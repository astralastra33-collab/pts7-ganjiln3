// =========================================================================
// SICIBINAGA VERCEL GAS RUNTIME EMULATOR (lib/gas-runtime.js)
// Zero-dependency Node.js 20+ adapter untuk:
//   1. Google Sheets API v4 (OAuth2 Service Account RS256 + Snapshot RAM Cache)
//   2. Google Drive API v3 (Folder, Upload File, Sharing, Move File)
//   3. UrlFetchApp.fetch (Groq AI 5 Keys + Supabase REST Service Role)
//   4. MailApp.sendEmail (Resend API / Optional GAS Webhook)
//   5. CacheService, PropertiesService, LockService, Utilities (crypto)
// =========================================================================
'use strict';

const crypto = require('crypto');

// Warm Serverless RAM Caches (bertahan antar-request selama container hangat)
const _globalCacheMap = new Map();       // key -> { val: string, exp: number }
const _sheetSnapshotCache = new Map();   // ssId -> { ts: number, url: string, title: string, sheets: [{ id, title, rows }] }
const _runtimePropsOverride = {};        // runtime edits dari admin panel dalam container aktif
let _googleAuthTokenCache = { token: '', exp: 0 };

// --- 1. GOOGLE SERVICE ACCOUNT OAUTH2 (RS256 JWT, ZERO DEPENDENCIES) ---
function parseServiceAccountJson() {
  const raw = (process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '').trim();
  if (!raw) return null;
  try {
    let text = raw;
    if (!text.startsWith('{')) {
      text = Buffer.from(text, 'base64').toString('utf8');
    }
    const obj = JSON.parse(text);
    if (obj.private_key && typeof obj.private_key === 'string') {
      obj.private_key = obj.private_key.replace(/\\n/g, '\n');
    }
    return obj;
  } catch (e) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON tidak valid (harus JSON Service Account utuh atau base64): ' + e.message);
  }
}

function base64UrlEncode(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(String(input), 'utf8');
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getGoogleAccessToken() {
  const now = Date.now();
  if (_googleAuthTokenCache.token && _googleAuthTokenCache.exp > now + 120000) {
    return _googleAuthTokenCache.token;
  }

  const sa = parseServiceAccountJson();
  if (!sa || !sa.client_email || !sa.private_key) {
    throw new Error(
      'Environment Variable GOOGLE_SERVICE_ACCOUNT_JSON belum dikonfigurasi di Vercel Dashboard. ' +
      'Tambahkan kunci JSON Google Service Account dan bagikan Spreadsheet kelas ini ke email Service Account sebagai Editor.'
    );
  }

  const iat = Math.floor(now / 1000);
  const exp = iat + 3600;
  const header = base64UrlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64UrlEncode(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive',
    aud: sa.token_uri || 'https://oauth2.googleapis.com/token',
    iat: iat,
    exp: exp
  }));

  const signingInput = `${header}.${claim}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signingInput);
  signer.end();
  const signature = base64UrlEncode(signer.sign(sa.private_key));
  const jwt = `${signingInput}.${signature}`;

  const tokenUri = sa.token_uri || 'https://oauth2.googleapis.com/token';
  const resp = await fetch(tokenUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=' + encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer') + '&assertion=' + encodeURIComponent(jwt)
  });
  const data = await resp.json();
  if (!resp.ok || !data.access_token) {
    throw new Error('Gagal autentikasi Google Service Account: ' + (data.error_description || data.error || ('HTTP ' + resp.status)));
  }

  _googleAuthTokenCache = {
    token: data.access_token,
    exp: now + ((Number(data.expires_in) || 3500) * 1000)
  };
  return _googleAuthTokenCache.token;
}

// --- 2. HELPER KONVERSI A1 NOTATION <-> (ROW, COL) ---
function colIndexToLetter(colNum) {
  let n = Number(colNum);
  let out = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    out = String.fromCharCode(65 + rem) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out || 'A';
}

function letterToColIndex(letters) {
  let res = 0;
  const s = String(letters || '').toUpperCase();
  for (let i = 0; i < s.length; i++) {
    res = res * 26 + (s.charCodeAt(i) - 64);
  }
  return res;
}

function parseA1Notation(a1) {
  const clean = String(a1 || 'A1').replace(/\$/g, '').trim();
  const parts = clean.split(':');
  const parseCell = (c) => {
    const m = /^([A-Za-z]+)(\d+)?$/.exec(c.trim());
    if (!m) return { row: 1, col: 1 };
    return { col: letterToColIndex(m[1]), row: m[2] ? parseInt(m[2], 10) : 1 };
  };
  const p1 = parseCell(parts[0]);
  const p2 = parts[1] ? parseCell(parts[1]) : p1;
  return {
    row: p1.row,
    col: p1.col,
    numRows: Math.max(1, p2.row - p1.row + 1),
    numCols: Math.max(1, p2.col - p1.col + 1)
  };
}

function quoteSheetName(name) {
  return "'" + String(name || '').replace(/'/g, "''") + "'";
}

function cloneMatrix(rows) {
  return (rows || []).map(r => (Array.isArray(r) ? r.map(v => (v === null || v === undefined ? '' : String(v))) : []));
}

// --- 3. GOOGLE SHEETS API V4 SNAPSHOT + WRITE-BACK EMULATOR ---
async function fetchSpreadsheetSnapshot(spreadsheetId, forceFresh) {
  const now = Date.now();
  const cached = _sheetSnapshotCache.get(spreadsheetId);
  if (!forceFresh && cached && (now - cached.ts) < 25000) {
    return {
      spreadsheetId: spreadsheetId,
      url: cached.url,
      title: cached.title,
      sheets: cached.sheets.map(s => ({ id: s.id, title: s.title, rows: cloneMatrix(s.rows) }))
    };
  }

  const token = await getGoogleAccessToken();
  const metaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=spreadsheetId,spreadsheetUrl,properties.title,sheets.properties(sheetId,title)`;
  const metaResp = await fetch(metaUrl, { headers: { Authorization: 'Bearer ' + token } });
  const meta = await metaResp.json();
  if (!metaResp.ok) {
    const errMsg = (meta && meta.error && meta.error.message) || ('HTTP ' + metaResp.status);
    throw new Error('Gagal membaca Spreadsheet (' + spreadsheetId + '): ' + errMsg + '. Pastikan Spreadsheet sudah di-Share sebagai Editor ke email Google Service Account.');
  }

  const sheetMetaList = (meta.sheets || []).map(s => ({
    id: s.properties.sheetId,
    title: s.properties.title
  }));

  const sheetsOut = [];
  if (sheetMetaList.length > 0) {
    const queryRanges = sheetMetaList.map(s => 'ranges=' + encodeURIComponent(quoteSheetName(s.title))).join('&');
    const valUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values:batchGet?${queryRanges}&valueRenderOption=FORMATTED_VALUE`;
    const valResp = await fetch(valUrl, { headers: { Authorization: 'Bearer ' + token } });
    const valData = await valResp.json();
    if (!valResp.ok) {
      const errMsg = (valData && valData.error && valData.error.message) || ('HTTP ' + valResp.status);
      throw new Error('Gagal menarik isi sheet batchGet: ' + errMsg);
    }
    const vrList = valData.valueRanges || [];
    for (let i = 0; i < sheetMetaList.length; i++) {
      const rawVals = (vrList[i] && vrList[i].values) ? vrList[i].values : [];
      sheetsOut.push({
        id: sheetMetaList[i].id,
        title: sheetMetaList[i].title,
        rows: cloneMatrix(rawVals)
      });
    }
  }

  const snapshot = {
    ts: now,
    spreadsheetId: spreadsheetId,
    url: meta.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    title: (meta.properties && meta.properties.title) || 'SICIBINAGA',
    sheets: sheetsOut
  };
  _sheetSnapshotCache.set(spreadsheetId, {
    ts: now,
    url: snapshot.url,
    title: snapshot.title,
    sheets: sheetsOut.map(s => ({ id: s.id, title: s.title, rows: cloneMatrix(s.rows) }))
  });
  return snapshot;
}

function createSpreadsheetEmulator(snapshot, opsCollector) {
  const ssId = snapshot.spreadsheetId;
  let nextTempSheetId = 900000000;

  function makeRange(sheetState, startRow, startCol, numRows, numCols) {
    const rangeObj = {
      getValues() {
        const out = [];
        for (let r = 0; r < numRows; r++) {
          const rowArr = sheetState.rows[startRow - 1 + r] || [];
          const line = [];
          for (let c = 0; c < numCols; c++) {
            const v = rowArr[startCol - 1 + c];
            line.push(v === undefined || v === null ? '' : v);
          }
          out.push(line);
        }
        return out;
      },
      getDisplayValues() {
        return rangeObj.getValues().map(row => row.map(v => (v === undefined || v === null ? '' : String(v))));
      },
      getValue() {
        const vals = rangeObj.getValues();
        return (vals[0] && vals[0][0] !== undefined) ? vals[0][0] : '';
      },
      setValue(val) {
        return rangeObj.setValues([[val]]);
      },
      setValues(matrix) {
        if (!Array.isArray(matrix)) return rangeObj;
        const cleanMat = matrix.map(row => (Array.isArray(row) ? row : [row]).map(v => (v === undefined || v === null ? '' : v)));
        for (let r = 0; r < cleanMat.length; r++) {
          const rIdx = startRow - 1 + r;
          while (sheetState.rows.length <= rIdx) sheetState.rows.push([]);
          for (let c = 0; c < cleanMat[r].length; c++) {
            const cIdx = startCol - 1 + c;
            while (sheetState.rows[rIdx].length <= cIdx) sheetState.rows[rIdx].push('');
            sheetState.rows[rIdx][cIdx] = String(cleanMat[r][c]);
          }
        }
        opsCollector.push({
          type: 'writeRange',
          ssId: ssId,
          sheetState: sheetState,
          startRow: startRow,
          startCol: startCol,
          values: cleanMat
        });
        return rangeObj;
      },
      clear() { return rangeObj.clearContent(); },
      clearContent() {
        const blanks = Array.from({ length: numRows }, () => Array.from({ length: numCols }, () => ''));
        return rangeObj.setValues(blanks);
      },
      merge() { return rangeObj; },
      setFontWeight() { return rangeObj; },
      setBackground() { return rangeObj; },
      setFontColor() { return rangeObj; },
      setFontSize() { return rangeObj; },
      setHorizontalAlignment() { return rangeObj; },
      setVerticalAlignment() { return rangeObj; },
      setWrap() { return rangeObj; }
    };
    return rangeObj;
  }

  function makeSheet(sheetState) {
    const shObj = {
      _state: sheetState,
      getName() { return sheetState.title; },
      setName(newTitle) {
        const clean = String(newTitle || '').trim();
        if (clean && clean !== sheetState.title) {
          const oldTitle = sheetState.title;
          sheetState.title = clean;
          opsCollector.push({ type: 'renameSheet', ssId: ssId, sheetState: sheetState, oldTitle: oldTitle, newTitle: clean });
        }
        return shObj;
      },
      getLastRow() {
        let last = sheetState.rows.length;
        while (last > 0) {
          const r = sheetState.rows[last - 1] || [];
          if (r.some(cell => String(cell === undefined || cell === null ? '' : cell) !== '')) break;
          last--;
        }
        return last;
      },
      getLastColumn() {
        let maxC = 0;
        for (let i = 0; i < sheetState.rows.length; i++) {
          if (sheetState.rows[i] && sheetState.rows[i].length > maxC) maxC = sheetState.rows[i].length;
        }
        return maxC;
      },
      getDataRange() {
        const lr = Math.max(1, shObj.getLastRow());
        const lc = Math.max(1, shObj.getLastColumn());
        return makeRange(sheetState, 1, 1, lr, lc);
      },
      getRange(a1OrRow, col, numRows, numCols) {
        if (typeof a1OrRow === 'string') {
          const p = parseA1Notation(a1OrRow);
          return makeRange(sheetState, p.row, p.col, p.numRows, p.numCols);
        }
        const r = Math.max(1, Number(a1OrRow) || 1);
        const c = Math.max(1, Number(col) || 1);
        const nr = Math.max(1, Number(numRows) || 1);
        const nc = Math.max(1, Number(numCols) || 1);
        return makeRange(sheetState, r, c, nr, nc);
      },
      appendRow(rowArray) {
        const cleanRow = (Array.isArray(rowArray) ? rowArray : [rowArray]).map(v => (v === undefined || v === null ? '' : v));
        const nextRowIdx = shObj.getLastRow();
        while (sheetState.rows.length < nextRowIdx) sheetState.rows.push([]);
        sheetState.rows[nextRowIdx] = cleanRow.map(v => String(v));
        opsCollector.push({
          type: 'appendRow',
          ssId: ssId,
          sheetState: sheetState,
          rowIndex1: nextRowIdx + 1,
          values: [cleanRow]
        });
        return shObj;
      },
      clear() {
        sheetState.rows = [];
        opsCollector.push({ type: 'clearSheet', ssId: ssId, sheetState: sheetState });
        return shObj;
      },
      deleteRow(rowPosition) {
        return shObj.deleteRows(rowPosition, 1);
      },
      deleteRows(rowPosition, howMany) {
        const pos = Math.max(1, Number(rowPosition) || 1);
        const cnt = Math.max(1, Number(howMany) || 1);
        sheetState.rows.splice(pos - 1, cnt);
        opsCollector.push({ type: 'deleteRows', ssId: ssId, sheetState: sheetState, startRow1: pos, count: cnt });
        return shObj;
      },
      setFrozenRows() { return shObj; },
      setColumnWidth() { return shObj; }
    };
    return shObj;
  }

  const sheetProxies = snapshot.sheets.map(st => makeSheet(st));

  return {
    getId() { return ssId; },
    getUrl() { return snapshot.url; },
    getName() { return snapshot.title; },
    getSheets() { return sheetProxies.slice(); },
    getSheetByName(name) {
      const target = String(name || '');
      return sheetProxies.find(sp => sp.getName() === target) || null;
    },
    insertSheet(name) {
      const title = String(name || ('Sheet' + (sheetProxies.length + 1))).trim();
      const existing = sheetProxies.find(sp => sp.getName() === title);
      if (existing) return existing;
      const newState = { id: nextTempSheetId++, title: title, rows: [], _isNew: true };
      snapshot.sheets.push(newState);
      const sp = makeSheet(newState);
      sheetProxies.push(sp);
      opsCollector.push({ type: 'addSheet', ssId: ssId, sheetState: newState, title: title });
      return sp;
    }
  };
}

async function flushSpreadsheetOps(opsCollector, primarySsId) {
  if (!opsCollector || opsCollector.length === 0) return;
  const token = await getGoogleAccessToken();

  // Kelompokkan operasi secara berurutan per spreadsheetId
  const bySs = new Map();
  for (const op of opsCollector) {
    if (!bySs.has(op.ssId)) bySs.set(op.ssId, []);
    bySs.get(op.ssId).push(op);
  }

  for (const [ssId, ops] of bySs.entries()) {
    // 1. Proses structural ops (addSheet, renameSheet) dulu agar sheetId asli didapat
    for (const op of ops) {
      if (op.type === 'addSheet') {
        const resp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(ssId)}:batchUpdate`, {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
          body: JSON.stringify({ requests: [{ addSheet: { properties: { title: op.title } } }] })
        });
        const data = await resp.json().catch(() => ({}));
        if (resp.ok && data.replies && data.replies[0] && data.replies[0].addSheet) {
          op.sheetState.id = data.replies[0].addSheet.properties.sheetId;
          op.sheetState._isNew = false;
        }
      } else if (op.type === 'renameSheet') {
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(ssId)}:batchUpdate`, {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requests: [{
              updateSheetProperties: {
                properties: { sheetId: op.sheetState.id, title: op.newTitle },
                fields: 'title'
              }
            }]
          })
        });
      }
    }

    // 2. Proses data ops secara berurutan (clearSheet, deleteRows, writeRange, appendRow)
    let pendingValueWrites = [];

    const flushPendingValues = async () => {
      if (pendingValueWrites.length === 0) return;
      const batchBody = {
        valueInputOption: 'RAW',
        data: pendingValueWrites
      };
      pendingValueWrites = [];
      const resp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(ssId)}/values:batchUpdate`, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify(batchBody)
      });
      if (!resp.ok) {
        const txt = await resp.text().catch(() => '');
        throw new Error('Sheets values:batchUpdate gagal (' + resp.status + '): ' + txt.substring(0, 180));
      }
    };

    for (const op of ops) {
      if (op.type === 'clearSheet') {
        await flushPendingValues();
        const clearRange = encodeURIComponent(quoteSheetName(op.sheetState.title));
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(ssId)}/values/${clearRange}:clear`, {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
          body: '{}'
        });
      } else if (op.type === 'deleteRows') {
        await flushPendingValues();
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(ssId)}:batchUpdate`, {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requests: [{
              deleteDimension: {
                range: {
                  sheetId: op.sheetState.id,
                  dimension: 'ROWS',
                  startIndex: op.startRow1 - 1,
                  endIndex: op.startRow1 - 1 + op.count
                }
              }
            }]
          })
        });
      } else if (op.type === 'writeRange') {
        const endRow = op.startRow + op.values.length - 1;
        const maxCols = Math.max(1, ...op.values.map(r => r.length));
        const endCol = op.startCol + maxCols - 1;
        const a1 = `${quoteSheetName(op.sheetState.title)}!${colIndexToLetter(op.startCol)}${op.startRow}:${colIndexToLetter(endCol)}${endRow}`;
        pendingValueWrites.push({ range: a1, values: op.values });
      } else if (op.type === 'appendRow') {
        await flushPendingValues();
        const rangeEnc = encodeURIComponent(`${quoteSheetName(op.sheetState.title)}!A1`);
        const resp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(ssId)}/values/${rangeEnc}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: op.values })
        });
        if (!resp.ok) {
          const txt = await resp.text().catch(() => '');
          throw new Error('Sheets appendRow gagal (' + resp.status + '): ' + txt.substring(0, 180));
        }
      }
    }
    await flushPendingValues();
    _sheetSnapshotCache.delete(ssId);
  }
  if (primarySsId) _sheetSnapshotCache.delete(primarySsId);
  opsCollector.length = 0;
}

// --- 4. GOOGLE DRIVE API V3 EMULATOR ---
function createDriveFileObj(meta) {
  const id = meta.id;
  const name = meta.name || '';
  const url = meta.webViewLink || `https://drive.google.com/file/d/${id}/view`;
  return {
    getId() { return id; },
    getName() { return name; },
    getUrl() { return url; },
    async setSharing() {
      try {
        const token = await getGoogleAccessToken();
        await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}/permissions`, {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'reader', type: 'anyone' })
        });
      } catch (e) {}
    },
    async moveTo(targetFolder) {
      const targetId = targetFolder && typeof targetFolder.getId === 'function' ? targetFolder.getId() : '';
      if (!targetId) return;
      const token = await getGoogleAccessToken();
      const prevParents = Array.isArray(meta.parents) ? meta.parents.join(',') : '';
      const q = prevParents
        ? `addParents=${encodeURIComponent(targetId)}&removeParents=${encodeURIComponent(prevParents)}`
        : `addParents=${encodeURIComponent(targetId)}`;
      await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}?${q}`, {
        method: 'PATCH',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: '{}'
      });
    }
  };
}

function createDriveFolderObj(meta) {
  const id = meta.id;
  const name = meta.name || '';
  const url = meta.webViewLink || `https://drive.google.com/drive/folders/${id}`;
  return {
    getId() { return id; },
    getName() { return name; },
    getUrl() { return url; },
    async setSharing() {
      try {
        const token = await getGoogleAccessToken();
        await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}/permissions`, {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'reader', type: 'anyone' })
        });
      } catch (e) {}
    },
    async getFoldersByName(childName) {
      return await queryDriveFolders(childName, id);
    },
    async createFolder(childName) {
      return await createDriveFolder(childName, id);
    },
    async createFile(blobOrName, contentStr, mimeTypeStr) {
      let fileName = 'file.bin';
      let mime = 'application/octet-stream';
      let buf = Buffer.alloc(0);

      if (blobOrName && typeof blobOrName === 'object' && blobOrName._isGasBlob) {
        fileName = blobOrName.name || 'file.bin';
        mime = blobOrName.mimeType || 'application/octet-stream';
        buf = blobOrName.buffer;
      } else {
        fileName = String(blobOrName || 'file.txt');
        mime = String(mimeTypeStr || 'text/plain');
        buf = Buffer.from(String(contentStr === undefined || contentStr === null ? '' : contentStr), 'utf8');
      }

      const token = await getGoogleAccessToken();
      const boundary = 'sicibinaga_bound_' + crypto.randomBytes(8).toString('hex');
      const metadata = JSON.stringify({ name: fileName, parents: [id], mimeType: mime });

      const headPart = Buffer.from(
        `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n` +
        `--${boundary}\r\nContent-Type: ${mime}\r\n\r\n`,
        'utf8'
      );
      const tailPart = Buffer.from(`\r\n--${boundary}--`, 'utf8');
      const bodyBuf = Buffer.concat([headPart, buf, tailPart]);

      const resp = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,parents,webViewLink', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: bodyBuf
      });
      const created = await resp.json();
      if (!resp.ok || !created.id) {
        throw new Error('Drive upload gagal: ' + ((created.error && created.error.message) || ('HTTP ' + resp.status)));
      }
      return createDriveFileObj(created);
    }
  };
}

async function queryDriveFolders(name, parentId) {
  const token = await getGoogleAccessToken();
  const safeName = String(name || '').replace(/'/g, "\\'");
  let q = `mimeType='application/vnd.google-apps.folder' and name='${safeName}' and trashed=false`;
  const effectiveParent = parentId || (process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID || '').trim();
  if (effectiveParent) {
    q += ` and '${effectiveParent.replace(/'/g, "\\'")}' in parents`;
  }
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,webViewLink)&pageSize=5`;
  const resp = await fetch(url, { headers: { Authorization: 'Bearer ' + token } });
  const data = await resp.json().catch(() => ({ files: [] }));
  const files = Array.isArray(data.files) ? data.files : [];
  let idx = 0;
  return {
    hasNext() { return idx < files.length; },
    next() { return createDriveFolderObj(files[idx++]); }
  };
}

async function createDriveFolder(name, parentId) {
  const token = await getGoogleAccessToken();
  const meta = { name: String(name || 'Folder'), mimeType: 'application/vnd.google-apps.folder' };
  const effectiveParent = parentId || (process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID || '').trim();
  if (effectiveParent) meta.parents = [effectiveParent];
  const resp = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(meta)
  });
  const created = await resp.json();
  if (!resp.ok || !created.id) {
    throw new Error('Drive createFolder gagal: ' + ((created.error && created.error.message) || ('HTTP ' + resp.status)));
  }
  return createDriveFolderObj(created);
}

// --- 5. BUILD REQUEST-SCOPED GAS GLOBALS ---
function createRequestGasGlobals(primarySpreadsheetId, preloadedSnapshot) {
  const opsCollector = [];
  const openSpreadsheets = new Map();

  if (preloadedSnapshot && primarySpreadsheetId) {
    openSpreadsheets.set(primarySpreadsheetId, createSpreadsheetEmulator(preloadedSnapshot, opsCollector));
  }

  const SpreadsheetApp = {
    openById(id) {
      const targetId = String(id || primarySpreadsheetId);
      if (openSpreadsheets.has(targetId)) return openSpreadsheets.get(targetId);
      throw new Error('Spreadsheet belum dimuat ke memori request (' + targetId + ').');
    },
    async create(title) {
      const token = await getGoogleAccessToken();
      const resp = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties: { title: String(title || 'Arsip SICIBINAGA') } })
      });
      const created = await resp.json();
      if (!resp.ok || !created.spreadsheetId) {
        throw new Error('Gagal membuat Spreadsheet arsip baru: ' + ((created.error && created.error.message) || ('HTTP ' + resp.status)));
      }
      const newSnap = {
        spreadsheetId: created.spreadsheetId,
        url: created.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${created.spreadsheetId}/edit`,
        title: title,
        sheets: (created.sheets || []).map(s => ({
          id: s.properties.sheetId,
          title: s.properties.title,
          rows: []
        }))
      };
      const emu = createSpreadsheetEmulator(newSnap, opsCollector);
      openSpreadsheets.set(created.spreadsheetId, emu);
      return emu;
    },
    flush() {
      // Flush aktual dieksekusi sekali secara atomik di akhir request oleh flushAll()
    }
  };

  const DriveApp = {
    Access: { ANYONE_WITH_LINK: 'ANYONE_WITH_LINK' },
    Permission: { VIEW: 'VIEW' },
    async getFoldersByName(name) { return await queryDriveFolders(name, ''); },
    async createFolder(name) { return await createDriveFolder(name, ''); },
    async getFileById(id) {
      const token = await getGoogleAccessToken();
      const resp = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}?fields=id,name,parents,webViewLink`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      const meta = await resp.json();
      if (!resp.ok || !meta.id) {
        throw new Error('File Drive tidak ditemukan (' + id + ')');
      }
      return createDriveFileObj(meta);
    }
  };

  const UrlFetchApp = {
    async fetch(url, options) {
      const opts = options || {};
      const method = (opts.method || 'GET').toUpperCase();
      const headers = Object.assign({}, opts.headers || {});
      if (opts.contentType && !headers['Content-Type'] && !headers['content-type']) {
        headers['Content-Type'] = opts.contentType;
      }
      const fetchOpts = { method: method, headers: headers };
      if (opts.payload !== undefined && method !== 'GET' && method !== 'HEAD') {
        fetchOpts.body = typeof opts.payload === 'string' ? opts.payload : JSON.stringify(opts.payload);
      }
      const resp = await fetch(url, fetchOpts);
      const text = await resp.text();
      if (!opts.muteHttpExceptions && !resp.ok) {
        throw new Error(`HTTP ${resp.status} dari ${url}: ${text.substring(0, 180)}`);
      }
      return {
        getResponseCode() { return resp.status; },
        getContentText() { return text; }
      };
    }
  };

  const MailApp = {
    getRemainingDailyQuota() {
      return process.env.RESEND_API_KEY ? 100 : 0;
    },
    async sendEmail(opts) {
      const to = typeof opts === 'object' ? opts.to : arguments[0];
      const subject = typeof opts === 'object' ? opts.subject : arguments[1];
      const body = typeof opts === 'object' ? opts.body : arguments[2];
      const htmlBody = typeof opts === 'object' ? opts.htmlBody : '';

      const resendKey = (process.env.RESEND_API_KEY || '').trim();
      if (!resendKey) {
        throw new Error('RESEND_API_KEY belum diisi di Vercel Environment Variables. Tambahkan RESEND_API_KEY (gratis di resend.com) agar email OTP 2FA dapat dikirim dari Vercel.');
      }
      const fromAddr = (process.env.EMAIL_FROM || 'SICIBINAGA <onboarding@resend.dev>').trim();
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + resendKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromAddr,
          to: [to],
          subject: subject || 'Notifikasi SICIBINAGA',
          text: body || '',
          html: htmlBody || undefined
        })
      });
      if (!resp.ok) {
        const errTxt = await resp.text().catch(() => '');
        throw new Error('Resend Email gagal (' + resp.status + '): ' + errTxt.substring(0, 180));
      }
    }
  };

  const CacheService = {
    getScriptCache() {
      return {
        get(key) {
          const item = _globalCacheMap.get(String(key));
          if (!item) return null;
          if (Date.now() > item.exp) { _globalCacheMap.delete(String(key)); return null; }
          return item.val;
        },
        getAll(keys) {
          const out = {};
          (keys || []).forEach(k => {
            const v = this.get(k);
            if (v !== null) out[k] = v;
          });
          return out;
        },
        put(key, val, ttlSec) {
          const exp = Date.now() + (Math.max(1, Number(ttlSec) || 600) * 1000);
          _globalCacheMap.set(String(key), { val: String(val), exp: exp });
        },
        putAll(mapObj, ttlSec) {
          Object.keys(mapObj || {}).forEach(k => this.put(k, mapObj[k], ttlSec));
        },
        remove(key) { _globalCacheMap.delete(String(key)); },
        removeAll(keys) { (keys || []).forEach(k => _globalCacheMap.delete(String(k))); }
      };
    }
  };

  const PropertiesService = {
    getScriptProperties() {
      return {
        getProperties() {
          const out = {};
          Object.keys(process.env).forEach(k => {
            if (k.startsWith('GROQ_') || k.startsWith('SUPABASE_') || k.startsWith('API_BANK_') || k.startsWith('BANKSOAL_') || k === 'SESSION_SECRET') {
              out[k] = process.env[k];
            }
          });
          return Object.assign(out, _runtimePropsOverride);
        },
        getProperty(k) {
          const all = this.getProperties();
          return all[k] !== undefined ? all[k] : null;
        },
        setProperty(k, v) { _runtimePropsOverride[String(k)] = String(v); },
        setProperties(obj) {
          Object.keys(obj || {}).forEach(k => { _runtimePropsOverride[k] = String(obj[k]); });
        },
        deleteProperty(k) { delete _runtimePropsOverride[String(k)]; }
      };
    }
  };

  const LockService = {
    getScriptLock() {
      return {
        tryLock() { return true; },
        waitLock() { return true; },
        releaseLock() {}
      };
    }
  };

  const Utilities = {
    DigestAlgorithm: { SHA_256: 'sha256' },
    Charset: { UTF_8: 'utf8' },
    computeDigest(_algo, input) {
      const buf = crypto.createHash('sha256').update(String(input || ''), 'utf8').digest();
      return Array.from(buf).map(b => (b > 127 ? b - 256 : b));
    },
    getUuid() { return crypto.randomUUID(); },
    base64Decode(b64) { return Buffer.from(String(b64 || ''), 'base64'); },
    newBlob(data, mimeType, name) {
      const buffer = Buffer.isBuffer(data) ? data : Buffer.from(String(data || ''), 'utf8');
      return { _isGasBlob: true, buffer: buffer, mimeType: mimeType || 'application/octet-stream', name: name || 'file.bin' };
    },
    formatDate(dateObj, _tz, fmt) {
      const d = new Date((dateObj ? dateObj.getTime() : Date.now()) + (7 * 3600 * 1000)); // Asia/Jakarta UTC+7
      const pad = (n) => String(n).padStart(2, '0');
      return String(fmt || 'dd/MM/yyyy HH:mm:ss')
        .replace(/yyyy/g, String(d.getUTCFullYear()))
        .replace(/MM/g, pad(d.getUTCMonth() + 1))
        .replace(/dd/g, pad(d.getUTCDate()))
        .replace(/HH/g, pad(d.getUTCHours()))
        .replace(/mm/g, pad(d.getUTCMinutes()))
        .replace(/ss/g, pad(d.getUTCSeconds()));
    },
    sleep() {}
  };

  const MimeType = {
    PLAIN_TEXT: 'text/plain',
    CSV: 'text/csv',
    JSON: 'application/json'
  };

  const ContentService = {
    MimeType: { JSON: 'application/json' },
    createTextOutput(txt) {
      return {
        _text: String(txt || ''),
        setMimeType() { return this; },
        getContent() { return this._text; }
      };
    }
  };

  const Session = {
    getEffectiveUser() {
      const sa = parseServiceAccountJson();
      return { getEmail() { return (sa && sa.client_email) || 'vercel-runtime@sicibinaga.local'; } };
    }
  };

  const Logger = { log(...a) { console.log('[SICIBINAGA]', ...a); } };

  // Stateless HMAC helper untuk Session Token & 2FA OTP lintas container serverless Vercel!
  function getStatelessHmacSecret() {
    return (
      process.env.SESSION_SECRET ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      ('sicibinaga-v97-' + primarySpreadsheetId)
    );
  }

  function signStatelessToken(prefix, payloadObj) {
    const b64 = base64UrlEncode(JSON.stringify(payloadObj));
    const sig = crypto.createHmac('sha256', getStatelessHmacSecret()).update(prefix + '.' + b64).digest('hex').substring(0, 32);
    return `${prefix}.${b64}.${sig}`;
  }

  function verifyStatelessToken(prefix, tokenStr) {
    try {
      const clean = String(tokenStr || '').trim();
      const parts = clean.split('.');
      if (parts.length !== 3 || parts[0] !== prefix) return null;
      const expected = crypto.createHmac('sha256', getStatelessHmacSecret()).update(parts[0] + '.' + parts[1]).digest('hex').substring(0, 32);
      if (parts[2] !== expected) return null;
      const jsonStr = Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
      const obj = JSON.parse(jsonStr);
      if (obj && obj.expiresAt && Date.now() > obj.expiresAt) return null;
      return obj;
    } catch (e) {
      return null;
    }
  }

  return {
    globals: {
      SpreadsheetApp, DriveApp, UrlFetchApp, MailApp,
      CacheService, PropertiesService, LockService,
      Utilities, MimeType, ContentService, Session, Logger,
      __signStatelessTokenV97: signStatelessToken,
      __verifyStatelessTokenV97: verifyStatelessToken
    },
    async flushAll() {
      await flushSpreadsheetOps(opsCollector, primarySpreadsheetId);
    }
  };
}

module.exports = {
  fetchSpreadsheetSnapshot,
  createRequestGasGlobals,
  parseServiceAccountJson,
  getGoogleAccessToken
};
