// =========================================================================
// SICIBINAGA VERCEL BACKEND CORE (lib/backend-core.js)
// Auto-compiled 100% utuh dari Code.gs V97 Final -> Node.js 20.x Serverless
// =========================================================================
'use strict';

function createBackendEngine(gasGlobals) {
  const {
    SpreadsheetApp, DriveApp, UrlFetchApp, MailApp,
    CacheService, PropertiesService, LockService,
    Utilities, MimeType, ContentService, Session, Logger,
    __signStatelessTokenV97, __verifyStatelessTokenV97
  } = gasGlobals;

// =====================================================================
// BACKEND SICIBINAGA KELAS 7 - GOOGLE APPS SCRIPT (VERSI TEROPTIMASI)
// =====================================================================

const SPREADSHEET_ID = '1YZ-TlyZ4FAuhtaYHQyuaLi3rDrwjJWopIdJ9--jWdII';
const SYSTEM_SHEETS = ['Users', 'Hasil', 'Token', 'Pengaturan', 'Feedback', 'LMS_Materi', 'LMS_Progress', 'LMS_QnA', 'Guru'];
function isSystemSheetName(name) {
  if (!name) return true;
  let clean = name.toString().trim().toLowerCase();
  if (clean.startsWith('lms_')) return true;
  return SYSTEM_SHEETS.some(s => s.toLowerCase() === clean);
}
// =====================================================================
// KONFIGURASI AMAN API KEY GROQ VIA SCRIPT PROPERTIES (V90)
// Isi 4 kunci berikut di Editor GAS -> Project Settings -> Script Properties:
//   1. GROQ_CBT_API_KEY_K7            (Bank Soal CBT & Live Arena Quiz)
//   2. GROQ_LMS_API_KEY_K7            (Studio Materi LMS, Diskusi & Poles AI)
//   3. GROQ_STUDENT_TUTOR_API_KEY_K7  (AI Tutor, Evaluasi Refleksi & Kuis)
//   4. GROQ_VIDEO_API_KEY_K7          (Analisis Video Pembelajaran AI)
// =====================================================================
let __v90ScriptPropsCache = null;

// 5 Kunci API Groq Terpisah Khusus SICIBINAGA Kelas 7 (Auto-Seed ke Script Properties + Auto-Failover):
const GROQ_CBT_API_KEY_K7 = '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';
const GROQ_LMS_API_KEY_K7 = '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';
const GROQ_STUDENT_TUTOR_API_KEY_K7 = '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';
const GROQ_VIDEO_API_KEY_K7 = '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';
const GROQ_BANKSOAL_QUIZ_API_KEY_K7 = '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';

const DEFAULT_GROQ_KEYS_K7 = {
  GROQ_CBT_API_KEY_K7: GROQ_CBT_API_KEY_K7,
  GROQ_LMS_API_KEY_K7: GROQ_LMS_API_KEY_K7,
  GROQ_STUDENT_TUTOR_API_KEY_K7: GROQ_STUDENT_TUTOR_API_KEY_K7,
  GROQ_VIDEO_API_KEY_K7: GROQ_VIDEO_API_KEY_K7,
  GROQ_BANKSOAL_QUIZ_API_KEY_K7: GROQ_BANKSOAL_QUIZ_API_KEY_K7
};

const GROQ_REQUIRED_KEY_DEFS_V96 = [
  { key: 'GROQ_CBT_API_KEY_K7', label: 'Generate Bank Soal CBT' },
  { key: 'GROQ_LMS_API_KEY_K7', label: 'Studio Materi & Diskusi LMS' },
  { key: 'GROQ_STUDENT_TUTOR_API_KEY_K7', label: 'AI Tutor & Evaluasi Siswa' },
  { key: 'GROQ_VIDEO_API_KEY_K7', label: 'Analisis Video Pembelajaran' },
  { key: 'GROQ_BANKSOAL_QUIZ_API_KEY_K7', label: 'Bank Soal Kuis & Live Arena Kelas 7' }
];

function ensureDefaultGroqKeysSeededK7() {
  try {
    const propsService = PropertiesService.getScriptProperties();
    const cur = propsService.getProperties() || {};
    const toSeed = {};
    let needWrite = false;
    GROQ_REQUIRED_KEY_DEFS_V96.forEach(def => {
      const cleanCur = sanitizeApiKeyValueV96(cur[def.key] || '');
      if (!isValidGroqKeyFormatV96(cleanCur) && DEFAULT_GROQ_KEYS_K7[def.key]) {
        toSeed[def.key] = DEFAULT_GROQ_KEYS_K7[def.key];
        needWrite = true;
      }
    });
    if (needWrite) {
      propsService.setProperties(toSeed, false);
      __v90ScriptPropsCache = null;
    }
  } catch (e) {}
}

// V96: Pembersih otomatis karakter pengganggu pada API Key (tanda kutip ' " `, spasi, titik koma, prefix Bearer)
function sanitizeApiKeyValueV96(rawVal) {
  let s = (rawVal === null || rawVal === undefined) ? '' : String(rawVal);
  // Hapus karakter zero-width / BOM / newline
  s = s.replace(/[\u200B-\u200D\uFEFF\r\n\t]/g, '').trim();
  // Hapus prefix "Bearer " jika terikut saat copy-paste
  s = s.replace(/^bearer\s+/i, '').trim();
  // Hapus tanda kutip tunggal/ganda/backtick/curly quotes & tanda baca nyasar di awal/akhir secara berulang
  let prev = '';
  while (s !== prev) {
    prev = s;
    s = s.replace(/^['"`‘’“”;,\s]+/, '').replace(/['"`‘’“”;,\s]+$/, '').trim();
  }
  return s;
}

function isValidGroqKeyFormatV96(cleanVal) {
  const s = (cleanVal || '').toString().trim();
  return s.length >= 20 && s.indexOf('ISI_API_KEY') === -1 && /^gsk_[A-Za-z0-9_-]{16,}$/.test(s);
}

function getAllScriptPropsCachedV90() {
  if (__v90ScriptPropsCache !== null) return __v90ScriptPropsCache;
  try {
    const rawProps = PropertiesService.getScriptProperties().getProperties() || {};
    const merged = Object.assign({}, rawProps);
    const toSeed = {};
    let hasMissing = false;
    GROQ_REQUIRED_KEY_DEFS_V96.forEach(def => {
      const cleanVal = sanitizeApiKeyValueV96(merged[def.key] || '');
      if (!isValidGroqKeyFormatV96(cleanVal) && DEFAULT_GROQ_KEYS_K7[def.key]) {
        merged[def.key] = DEFAULT_GROQ_KEYS_K7[def.key];
        toSeed[def.key] = DEFAULT_GROQ_KEYS_K7[def.key];
        hasMissing = true;
      }
    });
    if (hasMissing) {
      try { PropertiesService.getScriptProperties().setProperties(toSeed, false); } catch (se) {}
    }
    __v90ScriptPropsCache = merged;
  } catch (e) {
    __v90ScriptPropsCache = Object.assign({}, DEFAULT_GROQ_KEYS_K7);
  }
  return __v90ScriptPropsCache;
}

// V96: Membaca 4 API Key Groq dengan auto-sanitize + self-healing otomatis ke Script Properties!
function getGroqApiKeyPropV90(primaryPropName) {
  const props = getAllScriptPropsCachedV90();
  const candidates = [
    primaryPropName,
    'GROQ_CBT_API_KEY_K7',
    'GROQ_LMS_API_KEY_K7',
    'GROQ_STUDENT_TUTOR_API_KEY_K7',
    'GROQ_VIDEO_API_KEY_K7',
    'GROQ_BANKSOAL_QUIZ_API_KEY_K7',
    'GROQ_MASTER_API_KEY'
  ];

  let fallbackNonGsk = '';
  for (let i = 0; i < candidates.length; i++) {
    const k = candidates[i];
    if (!k) continue;
    const raw = (props[k] || '').toString();
    if (!raw) continue;
    const clean = sanitizeApiKeyValueV96(raw);
    if (!clean || clean.indexOf('ISI_API_KEY') !== -1) continue;

    // Self-heal otomatis: jika di Script Properties sebelumnya ada tanda kutip ('gsk_...') atau spasi nyasar, langsung perbaiki permanen!
    if (clean !== raw && isValidGroqKeyFormatV96(clean)) {
      try {
        PropertiesService.getScriptProperties().setProperty(k, clean);
        props[k] = clean;
      } catch (healErr) {}
    }

    if (isValidGroqKeyFormatV96(clean)) {
      return clean;
    }
    if (!fallbackNonGsk && clean.length > 16) {
      fallbackNonGsk = clean;
    }
  }
  return fallbackNonGsk;
}

function getAllValidGroqKeysListV96(preferredKey) {
  const props = getAllScriptPropsCachedV90();
  const seen = {};
  const list = [];
  const pushIfValid = (rawVal, propName) => {
    const clean = sanitizeApiKeyValueV96(rawVal);
    if (!clean || clean.indexOf('ISI_API_KEY') !== -1) return;
    if (propName && clean !== String(rawVal || '') && isValidGroqKeyFormatV96(clean)) {
      try {
        PropertiesService.getScriptProperties().setProperty(propName, clean);
        props[propName] = clean;
      } catch (e) {}
    }
    if (isValidGroqKeyFormatV96(clean) && !seen[clean]) {
      seen[clean] = true;
      list.push(clean);
    }
  };

  if (preferredKey) pushIfValid(preferredKey, null);
  GROQ_REQUIRED_KEY_DEFS_V96.forEach(def => pushIfValid(props[def.key], def.key));
  pushIfValid(props['GROQ_MASTER_API_KEY'], 'GROQ_MASTER_API_KEY');
  return list;
}

// V96: Smart Groq Fetch Wrapper — Otomatis bersihkan tanda kutip & failover ke kunci Groq lain bila terkena 401/429!
async function fetchGroqChatWithAutoFailoverV96(url, reqOptions) {
  const opts = Object.assign({}, reqOptions || {});
  const baseHeaders = Object.assign({}, opts.headers || {});
  const rawAuth = (baseHeaders['Authorization'] || baseHeaders['authorization'] || '').toString();
  const preferredKey = sanitizeApiKeyValueV96(rawAuth);
  const keyPool = getAllValidGroqKeysListV96(preferredKey);

  if (keyPool.length === 0) {
    if (preferredKey) {
      baseHeaders['Authorization'] = 'Bearer ' + preferredKey;
      opts.headers = baseHeaders;
    }
    return await UrlFetchApp.fetch(url, opts);
  }

  let lastResponse = null;
  for (let i = 0; i < keyPool.length; i++) {
    const tryHeaders = Object.assign({}, baseHeaders);
    delete tryHeaders['authorization'];
    tryHeaders['Authorization'] = 'Bearer ' + keyPool[i];
    const tryOpts = Object.assign({}, opts, { headers: tryHeaders, muteHttpExceptions: true });
    lastResponse = await UrlFetchApp.fetch(url, tryOpts);
    const code = lastResponse.getResponseCode();
    // Jika berhasil (200) atau error selain 401/429 (misal error model/payload), langsung kembalikan
    if (code === 200 || (code !== 401 && code !== 429)) {
      return lastResponse;
    }
  }
  return lastResponse;
}

function getMissingGroqKeyErrorV90(propName) {
  return {
    success: false,
    message: 'API Key Groq (' + propName + ') belum diisi atau formatnya tidak valid di Script Properties. Buka Dashboard Admin -> Keamanan & 2FA untuk mengisi 4 API Key Groq tanpa tanda kutip.'
  };
}

// V96: Status Script Properties — Menampilkan API Key Groq secara UTUH (tanpa disamarkan) khusus bagi sesi Admin terverifikasi,
// sekaligus otomatis membersihkan tanda kutip/spasi yang menempel di Script Properties!
function getSecurityScriptPropertiesStatusV90(allowFullGroqDisplay) {
  try {
    __v90ScriptPropsCache = null;
    const props = getAllScriptPropsCachedV90();
    let configuredCount = 0;
    let autoCleanedCount = 0;

    const items = GROQ_REQUIRED_KEY_DEFS_V96.map(item => {
      const raw = (props[item.key] || '').toString();
      const clean = sanitizeApiKeyValueV96(raw);
      const hadDirty = (raw.length > 0 && clean !== raw);

      // Auto-heal permanen jika ditemukan tanda kutip ('...') atau spasi di Script Properties!
      if (hadDirty && isValidGroqKeyFormatV96(clean)) {
        try {
          PropertiesService.getScriptProperties().setProperty(item.key, clean);
          props[item.key] = clean;
          autoCleanedCount++;
        } catch (healErr) {}
      }

      const validFormat = isValidGroqKeyFormatV96(clean);
      const ok = validFormat;
      if (ok) configuredCount++;
      const masked = clean.length > 10 ? (clean.substring(0, 4) + '••••••••' + clean.substring(clean.length - 4)) : (clean ? 'Format Salah' : 'Belum Diisi');

      return {
        key: item.key,
        label: item.label,
        isGroq: true,
        configured: ok,
        validFormat: validFormat,
        autoCleaned: hadDirty && validFormat,
        masked: masked,
        fullValue: allowFullGroqDisplay ? clean : ''
      };
    });

    return {
      success: true,
      configuredCount: configuredCount,
      totalRequired: GROQ_REQUIRED_KEY_DEFS_V96.length,
      allReady: configuredCount === GROQ_REQUIRED_KEY_DEFS_V96.length,
      autoCleanedCount: autoCleanedCount,
      items: items
    };
  } catch (e) {
    return { success: false, message: e.toString(), items: [] };
  }
}

function getTargetSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

// --- FUNGSI ROUTING UTAMA & PEMANGGIL FILE TERPISAH ---
function doGet(e) {
  if (e && e.parameter) {
    if (e.parameter.action === 'getKunci') return getKunciJawabanAPI();
    if (e.parameter.action === 'getConfig') return getConfigAPI();
    if (e.parameter.action === 'getSoal') return getSoalAPI(e.parameter.mapel);
  }
  
  // Pastikan struktur dasar Spreadsheet sudah siap saat aplikasi diakses
  ensureSystemInitialized();

  let template = HtmlService.createTemplateFromFile('Index');
  return template.evaluate()
      .setTitle('SICIBINAGA KELAS 7 - Sistem CBT Interaktif')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=5.0, user-scalable=yes')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// --- GENERATOR KREDENSIAL ACAK UNTUK INITIAL SETUP ---
function generateRandomCredential(prefix, length) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = prefix ? prefix + '-' : '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// --- FUNGSI AUTO SETUP & OTORISASI AWAL (TANPA HARDCODE ADMIN) ---
function ensureSystemInitialized(forceReinit) {
  // V97: Penjaga CacheService 6 jam agar 255+ siswa yang membuka doGet() serentak tidak antre LockService & tidak menembak Google Sheets!
  if (!forceReinit) {
    try {
      if (CacheService.getScriptCache().get('v97_sys_init_ok') === '1') return;
    } catch (cacheInitErr) {}
  }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;
  
  try {
    const ss = getTargetSpreadsheet();
    
    // 1. Inisialisasi Sheet Pengaturan & Akun Admin Otomatis
    let sheetPengaturan = ss.getSheetByName('Pengaturan');
    if (!sheetPengaturan) {
      sheetPengaturan = ss.insertSheet('Pengaturan');
      sheetPengaturan.appendRow(['KETERANGAN', 'NILAI (DIKELOLA OTOMATIS / UBAH DI SINI)']);
      sheetPengaturan.appendRow(['Logo Sekolah', 'https://cdn-icons-png.flaticon.com/512/5300/5300585.png']);
      sheetPengaturan.appendRow(['Nama Judul', 'Portal Ujian PTS SMPN 3 Bangil']);
      sheetPengaturan.appendRow(['Username Admin', generateRandomCredential('adm', 5).toLowerCase()]);
      sheetPengaturan.appendRow(['Password Admin', generateRandomCredential('KEY', 8)]);
      sheetPengaturan.appendRow(['API Key Groq', '']);
      sheetPengaturan.getRange("A1:B1").setFontWeight("bold").setBackground("#d1fae5");
      sheetPengaturan.setColumnWidth(1, 180);
      sheetPengaturan.setColumnWidth(2, 420);
    } else {
      // Cek apakah baris Username Admin & Password Admin sudah tertulis di Sheet
      const data = sheetPengaturan.getDataRange().getDisplayValues();
      let hasUser = false, hasPass = false, hasGroq = false;
      
      for (let i = 1; i < data.length; i++) {
        let key = (data[i][0] || '').toString().trim().toLowerCase();
        let val = (data[i][1] || '').toString().trim();
        if (key === 'username admin') {
          hasUser = true;
          if (val === '') sheetPengaturan.getRange(i + 1, 2).setValue(generateRandomCredential('adm', 5).toLowerCase());
        }
        if (key === 'password admin') {
          hasPass = true;
          if (val === '') sheetPengaturan.getRange(i + 1, 2).setValue(generateRandomCredential('KEY', 8));
        }
        if (key.includes('api key groq')) {
          hasGroq = true;
        }
      }
      if (!hasUser) sheetPengaturan.appendRow(['Username Admin', generateRandomCredential('adm', 5).toLowerCase()]);
      if (!hasPass) sheetPengaturan.appendRow(['Password Admin', generateRandomCredential('KEY', 8)]);
      if (!hasGroq) sheetPengaturan.appendRow(['API Key Groq', '']);
    }

    // 2. Inisialisasi Sheet Users
    if (!ss.getSheetByName('Users')) {
      let sheetUsers = ss.insertSheet('Users');
      sheetUsers.appendRow(['Nama Lengkap', 'Email', 'Password', 'Kelas']);
      sheetUsers.getRange("A1:D1").setFontWeight("bold").setBackground("#d1fae5");
    }

    // 3. Inisialisasi Sheet Token
    if (!ss.getSheetByName('Token')) {
      let sheetToken = ss.insertSheet('Token');
      sheetToken.appendRow(['Mata Pelajaran', 'Status', 'Token Mulai', 'Token Selesai']);
      sheetToken.getRange("A1:D1").setFontWeight("bold").setBackground("#d1fae5");
    }

    // 4. Inisialisasi Sheet Feedback
    if (!ss.getSheetByName('Feedback')) {
      let sheetFb = ss.insertSheet('Feedback');
      sheetFb.appendRow(['Waktu', 'Nama Siswa', 'Kelas', 'Mata Pelajaran', 'Rating (1-5)', 'Komentar']);
      sheetFb.getRange("A1:F1").setFontWeight("bold").setBackground("#d1fae5");
    }
    // 5. Inisialisasi Sheet LMS_Materi (Modul Belajar & Kuis Konstruktif)
    if (!ss.getSheetByName('LMS_Materi')) {
      let sheetLMS = ss.insertSheet('LMS_Materi');
      sheetLMS.appendRow(['ID_Modul', 'Mata Pelajaran', 'Judul Bab / Topik', 'Tujuan Pembelajaran', 'Konten Materi (JSON)', 'Kuis Formatif (JSON)', 'Pembuat', 'Tanggal Dibuat']);
      sheetLMS.getRange("A1:H1").setFontWeight("bold").setBackground("#d1fae5");
    }

    // 6. Inisialisasi Sheet LMS_Progress (Rekam Jejak Belajar, XP & Lencana Siswa)
    if (!ss.getSheetByName('LMS_Progress')) {
      let sheetProg = ss.insertSheet('LMS_Progress');
      sheetProg.appendRow(['Waktu', 'Email Siswa', 'Nama Siswa', 'Kelas', 'Mata Pelajaran', 'ID_Modul', 'Judul Modul', 'Skor Kuis', 'XP Diperoleh', 'Catatan Refleksi']);
      sheetProg.getRange("A1:J1").setFontWeight("bold").setBackground("#d1fae5");
    }

    // 7. Inisialisasi Sheet Guru (Multi-Role Guru & Admin)
    if (!ss.getSheetByName('Guru')) {
      let sheetGuru = ss.insertSheet('Guru');
      sheetGuru.appendRow(['Username', 'Password', 'Nama Lengkap Guru', 'Mata Pelajaran Diampu', 'Role']);
      sheetGuru.appendRow(['guru7', 'GURU123', 'Bapak/Ibu Guru Pengampu Kelas 7', 'ALL', 'GURU']);
      sheetGuru.getRange("A1:E1").setFontWeight("bold").setBackground("#d1fae5");
    }

    // 8. Inisialisasi Sheet LMS_QnA (Tanya Jawab Interaktif Siswa & Guru per Modul)
    if (!ss.getSheetByName('LMS_QnA')) {
      let sheetQna = ss.insertSheet('LMS_QnA');
      sheetQna.appendRow(['ID_QnA', 'Waktu', 'ID_Modul', 'Mata Pelajaran', 'Judul Modul', 'Nama Siswa', 'Kelas', 'Pertanyaan Siswa', 'Balasan Guru', 'Nama Guru Penjawab', 'Waktu Balasan']);
      sheetQna.getRange("A1:K1").setFontWeight("bold").setBackground("#d1fae5");
    }
    // Tandai 8 sheet sistem telah terverifikasi siap selama 6 jam (21.600 detik)
    try { CacheService.getScriptCache().put('v97_sys_init_ok', '1', 21600); } catch (cachePutErr) {}
  } catch (e) {
    console.error("Gagal melakukan inisialisasi awal: " + e.toString());
  } finally {
    lock.releaseLock();
  }
}

// Mempertahankan nama fungsi lama jika dipanggil dari trigger manual (selalu paksa cek ulang)
function otorisasiSistem() {
  ensureSystemInitialized(true);
}

// --- AUTENTIKASI ADMIN (MURNI MEMBACA DARI SPREADSHEET) ---
async function verifyAdmin(username, password, options) {
  try {
    const opts = options || {};
    if (!username || !password) {
      return { success: false, message: 'Username dan Password wajib diisi!' };
    }

    const cleanU = username.toString().trim();
    const cleanP = password.toString().trim();

    if (!opts.skipRateLimit) {
      const rl = checkLoginRateLimitV91('ADMIN', cleanU);
      if (!rl.allowed) return { success: false, rateLimited: true, message: rl.message };
    }

    ensureSystemInitialized();
    const ss = getTargetSpreadsheet();
    const sheet = ss.getSheetByName('Pengaturan');
    const data = sheet.getDataRange().getDisplayValues();

    let dbAdminUser = null;
    let dbAdminPass = null;
    let dbAdminPassRow = -1;

    for (let i = 1; i < data.length; i++) {
      let key = (data[i][0] || '').toString().trim().toLowerCase();
      let val = (data[i][1] || '').toString().trim();
      if (key === 'username admin') dbAdminUser = val;
      if (key === 'password admin') {
        dbAdminPass = val;
        dbAdminPassRow = i + 1;
      }
    }

    if (!dbAdminUser || !dbAdminPass) {
      return { success: false, message: 'Kredensial Admin belum terkonfigurasi di Sheet Pengaturan.' };
    }

    let matchedStaff = null;
    if (cleanU === dbAdminUser) {
      const admPassChk = verifyPasswordAnyFormatV92(cleanP, dbAdminPass);
      if (admPassChk.matched) {
        if (admPassChk.needsMigration && dbAdminPassRow > 1) {
          try {
            sheet.getRange(dbAdminPassRow, 2).setValue(hashPasswordSaltedV92(cleanP));
          } catch (migErr) {}
        }
        matchedStaff = { role: 'ADMIN', name: 'Super Administrator', mapelAmpu: 'ALL', username: cleanU };
      }
    }

    if (!matchedStaff) {
      const sheetGuru = ss.getSheetByName('Guru');
      if (sheetGuru) {
        const dataGuru = sheetGuru.getDataRange().getDisplayValues();
        for (let j = 1; j < dataGuru.length; j++) {
          let gUser = (dataGuru[j][0] || '').toString().trim();
          let gPass = (dataGuru[j][1] || '').toString().trim();
          if (gUser && cleanU.toLowerCase() === gUser.toLowerCase()) {
            const gChk = verifyPasswordAnyFormatV92(cleanP, gPass);
            if (gChk.matched) {
              if (gChk.needsMigration) {
                try {
                  sheetGuru.getRange(j + 1, 2).setValue(hashPasswordSaltedV92(cleanP));
                } catch (migErr2) {}
              }
              matchedStaff = {
                role: (dataGuru[j][4] || 'GURU').toString().trim().toUpperCase(),
                name: (dataGuru[j][2] || 'Guru Pengampu').toString().trim(),
                mapelAmpu: (dataGuru[j][3] || 'ALL').toString().trim(),
                username: gUser
              };
              break;
            }
          }
        }
      }
    }

    if (!matchedStaff) {
      if (!opts.skipRateLimit) {
        const failInfo = recordLoginFailureV91('ADMIN', cleanU, 5, 300);
        if (failInfo.locked) return { success: false, rateLimited: true, message: failInfo.message };
        return {
          success: false,
          message: `Username atau Password Guru/Admin tidak sesuai! (Sisa percobaan: ${failInfo.remaining}x)`
        };
      }
      return { success: false, message: 'Username atau Password Guru/Admin tidak sesuai!' };
    }

    if (!opts.skipRateLimit) clearLoginRateLimitV91('ADMIN', cleanU);

    // Cek apakah 2FA OTP Email Admin aktif (khusus login Panel Admin utama & role ADMIN)
    if (opts.allow2FA && !opts.skip2FA && matchedStaff.role === 'ADMIN') {
      const cfg2fa = getAdmin2FAConfigInternalV91();
      if (cfg2fa.enabled && cfg2fa.email) {
        const otpStart = await startAdmin2FAChallengeV91(matchedStaff, cfg2fa.email);
        if (otpStart.success) {
          return {
            success: true,
            requires2FA: true,
            challengeId: otpStart.challengeId,
            maskedEmail: otpStart.maskedEmail,
            expiresInSec: 300,
            role: matchedStaff.role,
            name: matchedStaff.name,
            mapelAmpu: matchedStaff.mapelAmpu
          };
        }
        return { success: false, message: otpStart.message };
      }
    }

    const tokenObj = issueAdminSessionTokenV91(matchedStaff);
    return {
      success: true,
      requires2FA: false,
      role: matchedStaff.role,
      name: matchedStaff.name,
      mapelAmpu: matchedStaff.mapelAmpu,
      adminSessionToken: tokenObj.token,
      sessionExpiresInSec: tokenObj.ttlSec
    };
  } catch (e) {
    return { success: false, message: 'Error Server: ' + e.message };
  }
}

// --- AUTENTIKASI SISWA ---
async function verifyLogin(email, password, kelasUser) {
  try {
    const cleanEmail = (email || '').toString().trim().toLowerCase();
    const cleanPass = (password || '').toString().trim();
    const cleanKelas = (kelasUser || '').toString().trim().toUpperCase();

    if (cleanEmail) {
      const rl = checkLoginRateLimitV91('STUDENT', cleanEmail);
      if (!rl.allowed) return { success: false, rateLimited: true, message: rl.message };
    }

    // V95: Baca daftar Users dari Chunked CacheService (TTL 60 detik, aman > 95 KB -> 0 Google Sheets hit saat 255 siswa login!)
    const usersIdx = getCachedUsersIndexV95();
    if (!usersIdx.success) {
      return { success: false, message: usersIdx.message || 'Database "Users" belum tersedia.' };
    }

    const userRecord = usersIdx.byEmail ? usersIdx.byEmail[cleanEmail] : null;
    if (userRecord) {
      const stuPassChk = verifyPasswordAnyFormatV92(cleanPass, userRecord.pass);
      if (stuPassChk.matched) {
        if (userRecord.kelas !== '' && cleanKelas !== '' && userRecord.kelas !== cleanKelas) {
          return {
            success: false,
            message: `Akun Anda terdaftar di kelas ${userRecord.kelas}, bukan ${cleanKelas}. Silakan pilih kelas yang sesuai!`
          };
        }
        // Jika password masih plaintext (belum di-Batch Hash sebelum Hari-H), migrasi bertahap ke SHA-256 + refresh cache
        if (stuPassChk.needsMigration && userRecord.rowNum > 1 && usersIdx.passCol > 0) {
          try {
            const ss = getTargetSpreadsheet();
            const sh = ss.getSheetByName('Users');
            if (sh) {
              sh.getRange(userRecord.rowNum, usersIdx.passCol).setValue(hashPasswordSaltedV92(cleanPass));
              clearUsersCacheV95();
            }
          } catch (migStuErr) {}
        }

        clearLoginRateLimitV91('STUDENT', cleanEmail);
        const stuName = userRecord.nama || 'Siswa';
        const stuKelas = userRecord.kelas || cleanKelas;
        const singleSess = issueStudentSessionV92(cleanEmail, stuName, stuKelas);
        return {
          success: true,
          name: stuName,
          kelas: stuKelas,
          studentSessionId: singleSess.sessionId,
          replacedPreviousSession: singleSess.replacedPrevious,
          servedFromCache: !!usersIdx.fromCache
        };
      }
    }

    // Cek apakah yang login di portal depan adalah Akun Admin atau Guru (Otomatis aktifkan Mode Guru!)
    const adminCheck = await verifyAdmin(email, password, { skipRateLimit: true, skip2FA: true });
    if (adminCheck && adminCheck.success) {
      clearLoginRateLimitV91('STUDENT', cleanEmail);
      return {
        success: true,
        name: adminCheck.name || 'Guru / Admin',
        kelas: cleanKelas || 'GURU/ADMIN',
        isStaffAccount: true,
        staffRole: adminCheck.role || 'ADMIN',
        mapelAmpu: adminCheck.mapelAmpu || 'ALL',
        adminSessionToken: adminCheck.adminSessionToken || ''
      };
    }

    if (cleanEmail) {
      const failSt = recordLoginFailureV91('STUDENT', cleanEmail, 6, 300);
      if (failSt.locked) return { success: false, rateLimited: true, message: failSt.message };
      return {
        success: false,
        message: `Username/Email atau Password tidak ditemukan! (Sisa percobaan: ${failSt.remaining}x)`
      };
    }
    return { success: false, message: 'Username/Email atau Password tidak ditemukan!' };
  } catch (e) {
    return { success: false, message: 'Error Server: ' + e.toString() };
  }
}

// --- API PENGATURAN & TOKEN ADMIN ---
function getExamSettingsAdmin() {
  try {
    ensureSystemInitialized();
    const ss = getTargetSpreadsheet();
    let tokenSheet = ss.getSheetByName('Token');
    
    let existingTokens = tokenSheet.getDataRange().getDisplayValues();
    let tokenMap = {};
    for (let i = 1; i < existingTokens.length; i++) {
      let mapelKey = (existingTokens[i][0] || '').toString().trim();
      if (mapelKey) {
        tokenMap[mapelKey] = {
          status: (existingTokens[i][1] || 'NONAKTIF').toString().trim().toUpperCase(),
          tokenMulai: (existingTokens[i][2] || '').toString().trim(),
          tokenSelesai: (existingTokens[i][3] || '').toString().trim()
        };
      }
    }
    
    let allSubjects = [];
    ss.getSheets().forEach(sheet => {
      let name = sheet.getName();
      if (!isSystemSheetName(name)) {
        allSubjects.push({ 
          mapel: name, 
          status: tokenMap[name] ? tokenMap[name].status : 'NONAKTIF', 
          tokenMulai: tokenMap[name] ? tokenMap[name].tokenMulai : 'MULAI123', 
          tokenSelesai: tokenMap[name] ? tokenMap[name].tokenSelesai : 'SELESAI123' 
        });
      }
    });
    return { success: true, data: allSubjects };
  } catch(e) { 
    return { success: false, message: e.toString() }; 
  }
}

function saveExamSettingsAdmin(settingsData) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    let tokenSheet = ss.getSheetByName('Token');
    if (!tokenSheet) tokenSheet = ss.insertSheet('Token');
    
    tokenSheet.clear();
    let outputData = [['Mata Pelajaran', 'Status', 'Token Mulai', 'Token Selesai']];
    if (Array.isArray(settingsData)) {
      settingsData.forEach(item => { 
        outputData.push([
          (item.mapel || '').toString().trim(), 
          (item.status || 'NONAKTIF').toString().trim().toUpperCase(), 
          (item.tokenMulai || '').toString().trim(), 
          (item.tokenSelesai || '').toString().trim()
        ]); 
      });
    }
    
    tokenSheet.getRange(1, 1, outputData.length, 4).setValues(outputData);
    tokenSheet.getRange("A1:D1").setFontWeight("bold").setBackground("#d1fae5");
    SpreadsheetApp.flush();
    clearSicibinagaFastCacheV88();
    return { success: true, message: "Pengaturan Akses & Token Ujian berhasil disinkronisasi!" };
  } catch(e) { 
    return { success: false, message: e.toString() }; 
  } finally { 
    lock.releaseLock(); 
  }
}

// --- FUNGSI TAMBAH MAPEL BARU DARI ADMIN PANEL ---
function tambahMapelBaruAdmin(namaMapel) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    let cleanName = (namaMapel || '').toString().trim();
    if (!cleanName) return { success: false, message: "Nama mata pelajaran tidak boleh kosong." };
    if (SYSTEM_SHEETS.map(s => s.toLowerCase()).includes(cleanName.toLowerCase())) {
      return { success: false, message: "Nama tersebut digunakan oleh sistem. Gunakan nama lain." };
    }

    const ss = getTargetSpreadsheet();
    if (ss.getSheetByName(cleanName)) {
      return { success: false, message: `Mata pelajaran "${cleanName}" sudah ada!` };
    }

    let newSheet = ss.insertSheet(cleanName);
    newSheet.getRange("A1:M1")
      .setValues([["No", "Soal", "Opsi A", "Opsi B", "Opsi C", "Opsi D", "Kunci", "Gambar Soal", "Gambar A", "Gambar B", "Gambar C", "Gambar D", "Tipe Soal"]])
      .setFontWeight("bold")
      .setBackground("#d1fae5");

    // Tambahkan juga default tokennya ke sheet Token
    let tokenSheet = ss.getSheetByName('Token');
    if (tokenSheet) {
      tokenSheet.appendRow([cleanName, 'NONAKTIF', 'MULAI7', 'SELESAI7']);
    }
    SpreadsheetApp.flush();
    return { success: true, message: `Mata pelajaran "${cleanName}" berhasil dibuat!` };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// --- FUNGSI PENGOLAH LINK DRIVE & KONFIGURASI UMUM ---
function extractDriveId(url) {
  if (!url) return "";
  let match = url.match(/(?:id=|d\/|folders\/)([a-zA-Z0-9_-]{25,})/);
  return match ? match[1] : url.trim();
}

// (Fungsi Baru) Mengubah URL Google Drive biasa menjadi Direct Link yang bisa dipanggil tag <img>
function formatDriveUrl(url) {
  if (!url) return "";
  let cleanUrl = url.toString().trim();
  if (cleanUrl.includes("drive.google")) {
    let match = cleanUrl.match(/(?:id=|d\/|folders\/)([a-zA-Z0-9_-]{25,})/);
    if (match && match[1]) {
      return "https://lh3.googleusercontent.com/d/" + match[1];
    }
  }
  return cleanUrl;
}

function getAppConfig() {
  try {
    const cache = CacheService.getScriptCache();
    const cached = cache.get('v88_app_config_full');
    if (cached) return JSON.parse(cached);
  } catch (e) {}

  ensureSystemInitialized();
  const ss = getTargetSpreadsheet();
  let sheet = ss.getSheetByName('Pengaturan');
  const data = sheet ? sheet.getDataRange().getDisplayValues() : [];

  let config = {
    logo: "https://cdn-icons-png.flaticon.com/512/5300/5300585.png",
    title: "SICIBINAGA KELAS 7",
    activeEnvironment: "ALL",
    activeExamMode: "PTS"
  };

  for (let i = 1; i < data.length; i++) {
    let key = (data[i][0] || '').toString().trim().toLowerCase();
    let val = (data[i][1] || '').toString().trim();

    if (key === 'logo sekolah' && val !== "") {
      if (val.startsWith("http") && !val.includes("drive.google")) {
        config.logo = val;
      } else {
        config.logo = "https://lh3.googleusercontent.com/d/" + extractDriveId(val);
      }
    }
    if (key === 'nama judul' && val !== "") {
      config.title = val;
    }
    if (key === 'environment aplikasi aktif' && ['LMS', 'CBT', 'ALL'].includes(val.toUpperCase())) {
      config.activeEnvironment = val.toUpperCase();
    }
    if (key === 'mode ujian aktif' && ['PTS', 'PAS'].includes(val.toUpperCase())) {
      config.activeExamMode = val.toUpperCase();
    }
  }

  try {
    CacheService.getScriptCache().put('v88_app_config_full', JSON.stringify(config), 30);
  } catch (e) {}
  return config;
}

function getConfigAPI() {
  try {
    return ContentService.createTextOutput(JSON.stringify({ success: true, data: getAppConfig() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// --- FUNGSI MANAJEMEN SOAL & KUNCI JAWABAN ---
function getKunciJawabanClient() { 
  try { 
    return JSON.parse(getKunciJawabanAPI().getContent()); 
  } catch (error) { 
    return { success: false, message: error.toString() }; 
  } 
}

function getKunciJawabanAPI() {
  try {
    const ss = getTargetSpreadsheet();
    const sheets = ss.getSheets();
    let masterKeys = {};
    
    sheets.forEach(sheet => {
      let name = sheet.getName();
      if (!isSystemSheetName(name)) {
        const data = sheet.getDataRange().getDisplayValues();
        let keys = {}; 
        let types = {};
        let total = 0;
        
        for (let i = 1; i < data.length; i++) {
          if (data[i].length < 2) continue; 
          let text = (data[i][1] || '').toString().trim();
          let imgSoal = data[i].length > 7 ? (data[i][7] || '').toString().trim() : "";
          if (text === "" && imgSoal === "") continue;
          
          total++;
          let kunci = data[i].length > 6 ? (data[i][6] || '').toString().trim().toUpperCase() : "";
          let tipe = data[i].length > 12 && data[i][12] ? data[i][12].toString().trim().toUpperCase() : "PG";
          if (kunci) { 
            keys[i.toString()] = kunci; 
            types[i.toString()] = tipe;
          }
        }
        // Tetap daftarkan mapel meskipun belum ada soal agar muncul di dropdown Bank Soal Admin
        masterKeys[name] = { total: total, keys: keys, types: types };
      }
    });
    return ContentService.createTextOutput(JSON.stringify({ success: true, data: masterKeys }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) { 
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON); 
  }
}

function getSoalAdmin(mapel) { 
  try { 
    return JSON.parse(getSoalAPI(mapel).getContent()); 
  } catch (error) { 
    return { success: false, message: error.toString() }; 
  } 
}

function getSoalAPI(mapel) {
  try {
    const ss = getTargetSpreadsheet();
    const sheet = ss.getSheetByName(mapel);
    if (!sheet) throw new Error("Mata pelajaran '" + mapel + "' belum tersedia di Spreadsheet.");
    
    const data = sheet.getDataRange().getDisplayValues();
    let soalOnly = [];
    if (data.length > 1) {
      for (let i = 1; i < data.length; i++) {
        let row = data[i];
        let text = (row[1] || '').toString().trim();
        let img = (row[7] || '').toString().trim();
        if (text !== "" || img !== "") {
          while (row.length < 13) row.push("");
          // MENGKONVERSI GAMBAR SEBELUM DIKIRIM KE ADMIN PANEL
          row[7] = formatDriveUrl(row[7]);
          row[8] = formatDriveUrl(row[8]);
          row[9] = formatDriveUrl(row[9]);
          row[10] = formatDriveUrl(row[10]);
          row[11] = formatDriveUrl(row[11]);
          if (!row[12]) row[12] = "PG";
          soalOnly.push(row.slice(0, 13));
        }
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true, data: soalOnly }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) { 
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON); 
  }
}

function saveSoalAdmin(mapel, soalArray) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName(mapel);
    if (!sheet) sheet = ss.insertSheet(mapel);
    
    sheet.clear();
    sheet.getRange("A1:M1")
      .setValues([["No", "Soal", "Opsi A", "Opsi B", "Opsi C", "Opsi D", "Kunci", "Gambar Soal", "Gambar A", "Gambar B", "Gambar C", "Gambar D", "Tipe Soal"]])
      .setFontWeight("bold")
      .setBackground("#d1fae5");
    
    if (soalArray && soalArray.length > 0) { 
      let paddedSoalArray = soalArray.map((row, idx) => {
        let cleanRow = Array.isArray(row) ? [...row] : [];
        cleanRow[0] = idx + 1;
        while (cleanRow.length < 13) cleanRow.push("");
        if (!cleanRow[12] || cleanRow[12].toString().trim() === "") cleanRow[12] = "PG";
        return cleanRow.slice(0, 13);
      });
      sheet.getRange(2, 1, paddedSoalArray.length, 13).setValues(paddedSoalArray); 
    }
    SpreadsheetApp.flush();
    bumpQuestionsCacheVersionV95();
    return { success: true, message: "Bank Soal berhasil disimpan & disinkronisasi!" };
  } catch (error) { 
    return { success: false, message: error.toString() }; 
  } finally { 
    lock.releaseLock(); 
  }
}

function appendSoalMasalAdmin(mapel, soalArray) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName(mapel);
    if (!sheet) return saveSoalAdmin(mapel, soalArray);
    
    let lastRow = sheet.getLastRow();
    let startNo = 1;
    if (lastRow > 1) {
      startNo = (parseInt(sheet.getRange(lastRow, 1).getValue()) || (lastRow - 1)) + 1;
    }
    
    if (soalArray && soalArray.length > 0) {
      let paddedSoalArray = soalArray.map((row, index) => {
        let cleanRow = Array.isArray(row) ? [...row] : [];
        cleanRow[0] = startNo + index; 
        while (cleanRow.length < 13) cleanRow.push("");
        if (!cleanRow[12] || cleanRow[12].toString().trim() === "") cleanRow[12] = "PG";
        return cleanRow.slice(0, 13);
      });
      sheet.getRange(lastRow + 1, 1, paddedSoalArray.length, 13).setValues(paddedSoalArray); 
    }
    SpreadsheetApp.flush();
    bumpQuestionsCacheVersionV95();
    return { success: true, message: "Soal berhasil ditambahkan ke baris terbawah!" };
  } catch (error) { 
    return { success: false, message: error.toString() }; 
  } finally { 
    lock.releaseLock(); 
  }
}

function updateSoalAdminRow(mapel, rowIndex, updatedRowData) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName(mapel);
    if (!sheet) return { success: false, message: "Mapel tidak ditemukan di Spreadsheet." };
    
    let cleanRow = Array.isArray(updatedRowData) ? [...updatedRowData] : [];
    while (cleanRow.length < 13) cleanRow.push("");
    if (!cleanRow[12]) cleanRow[12] = "PG";

    let sheetRow = parseInt(rowIndex) + 2; 
    sheet.getRange(sheetRow, 1, 1, 13).setValues([cleanRow.slice(0, 13)]);
    SpreadsheetApp.flush();
    bumpQuestionsCacheVersionV95();
    return { success: true, message: "Perubahan Soal berhasil disimpan ke Server!" };
  } catch(e) { 
    return { success: false, message: e.toString() }; 
  } finally { 
    lock.releaseLock(); 
  }
}

// --- FUNGSI UJIAN SISWA (TARIK MAPEL & SOAL) ---
function getSubjects() {
  const ss = getTargetSpreadsheet(); 
  const sheets = ss.getSheets(); 
  const subjects = []; 
  const tokenSheet = ss.getSheetByName('Token'); 
  let tokenData = tokenSheet ? tokenSheet.getDataRange().getDisplayValues() : [];
  
  sheets.forEach(sheet => {
    let name = sheet.getName();
    if (!isSystemSheetName(name)) {
      let status = 'NONAKTIF';
      for (let i = 1; i < tokenData.length; i++) { 
        if ((tokenData[i][0] || '').toString().trim() === name) { 
          status = (tokenData[i][1] || 'NONAKTIF').toString().trim().toUpperCase(); 
          break; 
        } 
      }
      subjects.push({ name: name, status: status });
    }
  });
  return subjects;
}

function getQuestions(subject, enteredToken, sessionMeta) {
  try {
    if (sessionMeta && sessionMeta.email && sessionMeta.sessionId) {
      const sessChk = validateStudentSessionServerV92(sessionMeta.email, sessionMeta.sessionId);
      if (!sessChk.valid) {
        return { success: false, duplicateLogin: true, message: sessChk.message };
      }
    }

    // 1. V95: Validasi Token dari CacheService (TTL 30 detik -> 0 Sheets hit saat 255 siswa mulai serentak!)
    const tokenRes = getCachedTokenMapV95();
    if (!tokenRes.success) {
      return { success: false, message: tokenRes.message || "Sheet 'Token' belum tersedia." };
    }

    const tokInfo = tokenRes.map ? tokenRes.map[subject] : null;
    const status = tokInfo ? tokInfo.status : 'NONAKTIF';
    const expectedToken = tokInfo ? tokInfo.expectedToken : '';
    const endToken = tokInfo ? tokInfo.endToken : '';

    if (status !== 'AKTIF') {
      return { success: false, message: 'Ujian untuk mata pelajaran ini sedang ditutup oleh Administrator.' };
    }
    if (expectedToken === '') {
      return { success: false, message: 'Token Mulai belum diatur oleh Pengawas/Admin.' };
    }
    if ((enteredToken || '').toString().trim().toUpperCase() !== expectedToken.toUpperCase()) {
      return { success: false, message: 'Token Mulai yang Anda masukkan SALAH!' };
    }

    // 2. V95: Ambil daftar soal dari Chunked CacheService (TTL 60 detik -> super cepat <120ms!)
    const qRes = getCachedSubjectQuestionsV95(subject);
    if (!qRes.success) {
      return { success: false, message: qRes.message || 'Bank soal mata pelajaran ini belum tersedia.' };
    }
    if (!qRes.questions || qRes.questions.length === 0) {
      return { success: false, message: 'Soal pada mata pelajaran ini masih kosong.' };
    }

    const durasiMapel = getExamDurationForSubjectV93(subject);

    // 3. V95: Jika klien memakai Supabase PostgreSQL Timer RPC (skipGasTimer: true),
    //    LEWATI LockService + Sheet LMS_Exam_Sessions agar 255 siswa 100% tanpa antrean!
    let serverTimer = null;
    if (sessionMeta && sessionMeta.email && !sessionMeta.skipGasTimer) {
      const tRes = startOrResumeExamTimerServerV92({
        email: sessionMeta.email,
        name: sessionMeta.name || '',
        kelas: sessionMeta.kelas || '',
        subject: subject,
        examMode: sessionMeta.examMode || 'PTS',
        sessionId: sessionMeta.sessionId || ''
      });
      if (tRes && tRes.success) {
        if (tRes.isExpired) {
          return {
            success: false,
            examTimeExpired: true,
            message: `Batas waktu server (${tRes.durationMin} menit) untuk ujian ${subject} sudah habis. Hubungi Pengawas jika memerlukan reset sesi.`
          };
        }
        serverTimer = tRes;
      }
    }

    return {
      success: true,
      data: qRes.questions,
      endToken: endToken,
      durationMin: durasiMapel,
      serverTimer: serverTimer,
      servedFromCache: !!qRes.fromCache
    };
  } catch (e) {
    return { success: false, message: 'Server sibuk saat memuat soal: ' + e.toString() };
  }
}

// --- FUNGSI UPLOAD GAMBAR, KARTU PESERTA, & FEEDBACK ---
function getSiswaKartuAdmin() {
  try {
    const ss = getTargetSpreadsheet(); 
    const sheet = ss.getSheetByName('Users');
    if (!sheet) return { success: false, message: "Sheet 'Users' tidak ditemukan!" };
    
    const data = sheet.getDataRange().getDisplayValues();
    if (data.length < 2) return { success: true, data: [] };

    let headers = data[0].map(h => h.toString().trim().toLowerCase());
    let idxNama = headers.findIndex(h => h.includes('nama')); 
    let idxEmail = headers.findIndex(h => h.includes('email') || h.includes('user')); 
    let idxPass = headers.findIndex(h => h.includes('pass')); 
    let idxKelas = headers.findIndex(h => h.includes('kelas') || h.includes('rombel'));
    
    if (idxNama === -1) idxNama = 0; 
    if (idxEmail === -1) idxEmail = 1; 
    if (idxPass === -1) idxPass = 2; 
    if (idxKelas === -1) idxKelas = 3;
    
    let siswaList = [];
    let counterPerKelas = {};

    for (let i = 1; i < data.length; i++) {
      let row = data[i]; 
      let nama = (row[idxNama] || '').toString().trim(); 
      let email = (row[idxEmail] || '').toString().trim(); 
      let pass = (row[idxPass] || '').toString().trim(); 
      let kelas = (row[idxKelas] || '7').toString().trim().toUpperCase();
      
      if (nama !== "") {
        counterPerKelas[kelas] = (counterPerKelas[kelas] || 0) + 1;
        const hashedFlag = isPasswordHashedV92(pass);
        siswaList.push({ 
          nama: nama, 
          absen: counterPerKelas[kelas], 
          kelas: kelas, 
          user: email, 
          pass: hashedFlag ? 'Terenkripsi (Sudah Aktif)' : pass,
          isHashed: hashedFlag
        }); 
      }
    }
    return { success: true, data: siswaList };
  } catch (error) { 
    return { success: false, message: error.toString() }; 
  }
}

async function uploadImageToDrive(base64Data, fileName) {
  try {
    let folderName = "CBT_Images_Sistem";
    let folders = await DriveApp.getFoldersByName(folderName);
    let folder = folders.hasNext() ? folders.next() : await DriveApp.createFolder(folderName);
    await folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    let splitBase = base64Data.split(','); 
    let type = splitBase[0].split(';')[0].replace('data:', ''); 
    let byteCharacters = Utilities.base64Decode(splitBase[1]); 
    let blob = Utilities.newBlob(byteCharacters, type, fileName || ('img_' + Date.now() + '.png'));
    let file = await folder.createFile(blob);
    
    return { success: true, url: "https://lh3.googleusercontent.com/d/" + file.getId() };
  } catch (e) { 
    return { success: false, message: e.toString() }; 
  }
}

function submitFeedbackClient(feedbackData) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); 
    const ss = getTargetSpreadsheet(); 
    let sheet = ss.getSheetByName('Feedback');
    if (!sheet) { 
      sheet = ss.insertSheet('Feedback'); 
      sheet.appendRow(['Waktu', 'Nama Siswa', 'Kelas', 'Mata Pelajaran', 'Rating (1-5)', 'Komentar']); 
    }
    sheet.appendRow([
      new Date().toLocaleString('id-ID'), 
      feedbackData.nama || '-', 
      feedbackData.kelas || '-', 
      feedbackData.mapel || '-', 
      feedbackData.rating || 5, 
      feedbackData.komentar || '-'
    ]);
    return { success: true };
  } catch (error) { 
    return { success: false, message: error.toString() }; 
  } finally { 
    lock.releaseLock(); 
  }
}

// =====================================================================
// FITUR AI GENERATOR SOAL VIA GROQ API (HOTS, LITERASI, NUMERASI, 4C)
// =====================================================================
async function generateSoalAIGroq(payload) {
  try {
    // KUNCI API GROQ BAWAAN KELAS 7 (CBT BANK SOAL)
    const GROQ_API_KEY = getGroqApiKeyPropV90('GROQ_CBT_API_KEY_K7');
    if (!GROQ_API_KEY) return getMissingGroqKeyErrorV90('GROQ_CBT_API_KEY_K7');
    
    let totalSoal = parseInt(payload.jumlah);
    let batchSize = 5; 
    let iterations = Math.ceil(totalSoal / batchSize);
    
    let finalData = [];
    let globalIndex = 1;

    let instruksiTujuan = payload.tujuan ? `Tujuan Pembelajaran:\n${payload.tujuan}\n` : "";
    let instruksiLiterasiNumerasi = payload.jenis === 'Literasi' ? "Fokuskan pada Literasi Membaca (analisis teks, kesimpulan, pemahaman mendalam)." : (payload.jenis === 'Numerasi' ? "Fokuskan pada Numerasi (analisis data, logika matematika dalam konteks nyata, angka tersirat)." : "Seimbangkan aspek Literasi dan Numerasi secara merata.");

    for (let i = 0; i < iterations; i++) {
        let limitSoal = (i === iterations - 1 && totalSoal % batchSize !== 0) ? totalSoal % batchSize : batchSize;
        
        // ---- AWAL KODE BARU UNTUK TIPE SOAL DINAMIS ----
        let tipeKode = payload.tipe || "PG";
        let instruksiTipe = "";
        let formatJSON = "";
        
        if (tipeKode === "PG") {
          instruksiTipe = "Buat soal pilihan ganda biasa (A, B, C, D) dengan TEPAT SATU jawaban benar.";
          formatJSON = `"a": "Teks Opsi A", "b": "Teks Opsi B", "c": "Teks Opsi C", "d": "Teks Opsi D", "kunci": "A"`;
        } else if (tipeKode === "PGK") {
          instruksiTipe = "Buat soal Pilihan Ganda Kompleks. Berikan 4 pilihan (A, B, C, D) di mana LEBIH DARI SATU opsi adalah benar.";
          formatJSON = `"a": "Opsi A", "b": "Opsi B", "c": "Opsi C", "d": "Opsi D", "kunci": "A,C" (pisahkan jawaban benar dengan koma)`;
        } else if (tipeKode === "BS") {
          instruksiTipe = "Buat soal Benar-Salah. Berikan 4 pernyataan (A, B, C, D) yang berkaitan dengan stimulus. Tentukan Kunci apakah masing-masing pernyataan itu Benar (B) atau Salah (S).";
          formatJSON = `"a": "Pernyataan 1", "b": "Pernyataan 2", "c": "Pernyataan 3", "d": "Pernyataan 4", "kunci": "B,S,B,S" (urutan jawaban B/S dipisah koma)`;
        } else if (tipeKode === "SA") {
          instruksiTipe = "Buat soal Sebab-Akibat. Opsi a, b, c, d kosongi saja. Kunci adalah A, B, C, D, atau E sesuai aturan standar Sebab-Akibat.";
          formatJSON = `"a": "", "b": "", "c": "", "d": "", "kunci": "A" (Pilih salah satu dari A/B/C/D/E)`;
        } else if (tipeKode === "MJ") {
          instruksiTipe = "Buat soal Menjodohkan. Isi 'a', 'b', 'c' dengan 3 premis. Isi 'd' dengan 4 pilihan jawaban/pasangan yang digabung dan dipisah tanda pipa (|). Kunci jawaban berisi pasangan yang benar untuk premis a, b, c dipisahkan koma (harus persis teks pasangannya).";
          formatJSON = `"a": "Premis 1", "b": "Premis 2", "c": "Premis 3", "d": "Pilihan1|Pilihan2|Pilihan3|Pilihan4", "kunci": "Pilihan2,Pilihan1,Pilihan4"`;
        }

        let sysPrompt = `Anda adalah ahli pembuat soal ujian SMP di Indonesia.
        Tugas: ${instruksiTipe}
        Jumlah: Buat tepat ${limitSoal} soal.
        Topik: "${payload.topik}"
        Tingkat: ${payload.kesulitan}. Pastikan berstandar HOTS.
        Fokus: ${instruksiLiterasiNumerasi}
        ${instruksiTujuan}
        
        ATURAN MUTLAK DAN KRITIS:
        1. WAJIB output dalam bentuk JSON murni.
        2. WAJIB menggunakan teks stimulus (paragraf/kasus/narasi) sebelum pertanyaan.
        3. Struktur JSON HARUS persis seperti ini:
        {
          "data": [
            {
              "soal": "[Teks Stimulus] [Pertanyaan]",
              ${formatJSON}
            }
          ]
        }`;
        // ---- AKHIR KODE BARU UNTUK TIPE SOAL DINAMIS ----

        let options = {
          "method": "post",
          "headers": {
            "Authorization": "Bearer " + GROQ_API_KEY,
            "Content-Type": "application/json"
          },
          "payload": JSON.stringify({
            "model": "openai/gpt-oss-120b", 
            "messages": [
                {"role": "system", "content": sysPrompt},
                {"role": "user", "content": "Keluarkan output HANYA dalam bentuk objek JSON sekarang."}
            ],
            "temperature": 0.1, 
            "max_tokens": 2500, 
            "response_format": { "type": "json_object" } 
          }),
          "muteHttpExceptions": true
        };

        let successFetch = false;
        let aiText = "";
        let resJson = {};
        
        for(let attempt = 1; attempt <= 3; attempt++) {
            try {
                let response = await fetchGroqChatWithAutoFailoverV96("https://api.groq.com/openai/v1/chat/completions", options);
                let responseCode = response.getResponseCode();
                resJson = JSON.parse(response.getContentText());
                
                if (responseCode === 429 || (resJson.error && resJson.error.message.includes("Rate limit"))) {
                    Utilities.sleep(10000 * attempt); 
                    continue; 
                }
                
                if (resJson.error) throw new Error(resJson.error.message);
                
                aiText = resJson.choices[0].message.content;
                successFetch = true;
                break;
            } catch(err) {
                if(attempt === 3) throw new Error("Gagal dari API Groq: " + err.message);
                Utilities.sleep(5000 * attempt); 
            }
        }

        if(!successFetch) continue;

        let jsonStr = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
        let matchJson = jsonStr.match(/\{[\s\S]*\}/); 
        if(matchJson) { jsonStr = matchJson[0]; }

        let parsed;
        try {
            parsed = JSON.parse(jsonStr);
        } catch(e) {
            throw new Error("AI memotong format JSON. Coba kurangi jumlah soal atau sederhanakan topik.");
        }

        let resultArr = parsed.data || parsed.soal || [];
        if (!Array.isArray(resultArr)) { resultArr = [parsed]; }

resultArr.forEach((item) => {
          if(item.soal && item.kunci) {
              finalData.push([
                globalIndex, 
                (item.soal || "").toString().trim(), 
                (item.a || "").toString().trim(), 
                (item.b || "").toString().trim(), 
                (item.c || "").toString().trim(), 
                (item.d || "").toString().trim(), 
                (item.kunci || "A").toString().trim().toUpperCase(), 
                "", "", "", "", "", 
                tipeKode // <--- Pastikan tipeKode dimasukkan ke indeks elemen ke-12 (Tipe Soal)
              ]);
              globalIndex++;
          }
        });
                
        if(i < iterations - 1) Utilities.sleep(8000); 
    }

    if(finalData.length === 0) throw new Error("AI gagal merakit data soal.");

    return { success: true, data: finalData };

  } catch (e) {
    return { success: false, message: "Sistem AI dihentikan: " + e.message };
  }
}

async function pancingOtorisasi() {
  await UrlFetchApp.fetch("https://api.groq.com");
}

// =====================================================================
// FITUR LMS KONSTRUKTIF, QNA INTERAKTIF & ASISTEN AI (GROQ OPENAI/OSS120B)
// =====================================================================

// 1. Ambil seluruh daftar Mata Pelajaran dari sheet non-sistem + data modul, QnA & progres siswa
function getLMSDashboardData(emailSiswa) {
  try {
    ensureSystemInitialized();
    const ss = getTargetSpreadsheet();
    const sheets = ss.getSheets();
    
    // Pastikan sheet LMS_QnA tersedia
    if (!ss.getSheetByName('LMS_QnA')) {
      let sheetQna = ss.insertSheet('LMS_QnA');
      sheetQna.appendRow(['ID_QnA', 'Waktu', 'ID_Modul', 'Mata Pelajaran', 'Judul Modul', 'Nama Siswa', 'Kelas', 'Pertanyaan Siswa', 'Balasan Guru', 'Nama Guru Penjawab', 'Waktu Balasan']);
      sheetQna.getRange("A1:K1").setFontWeight("bold").setBackground("#d1fae5");
    }

    // Ambil status ujian dari sheet Token agar terintegrasi dengan PTS/PAS
    const tokenSheet = ss.getSheetByName('Token');
    let tokenData = tokenSheet ? tokenSheet.getDataRange().getDisplayValues() : [];
    let tokenMap = {};
    for (let i = 1; i < tokenData.length; i++) {
      let mName = (tokenData[i][0] || '').toString().trim();
      if (mName) {
        tokenMap[mName] = (tokenData[i][1] || 'NONAKTIF').toString().trim().toUpperCase();
      }
    }

    // Ambil Diskusi QnA per Modul
    const qnaSheet = ss.getSheetByName('LMS_QnA');
    let qnaRows = qnaSheet ? qnaSheet.getDataRange().getDisplayValues() : [];
    let qnaByModul = {};
    for (let i = 1; i < qnaRows.length; i++) {
      let qr = qnaRows[i];
      if (!qr[0] || !qr[2]) continue;
      let mId = qr[2].toString().trim();
      if (!qnaByModul[mId]) qnaByModul[mId] = [];
      qnaByModul[mId].push({
        idQna: qr[0],
        waktu: qr[1],
        idModul: mId,
        mapel: qr[3],
        judulModul: qr[4],
        namaSiswa: qr[5],
        kelas: qr[6],
        pertanyaan: qr[7],
        balasanGuru: qr[8] || '',
        namaGuru: qr[9] || '',
        waktuBalas: qr[10] || '',
        meta: parseQnAExtendedMetaV37(qr)
      });
    }

    // Ambil semua modul pembelajaran dari LMS_Materi
    const lmsSheet = ss.getSheetByName('LMS_Materi');
    let lmsRows = lmsSheet ? lmsSheet.getDataRange().getDisplayValues() : [];
    let modulesByMapel = {};
    let allModules = [];

    for (let i = 1; i < lmsRows.length; i++) {
      let r = lmsRows[i];
      if (!r[0] || !r[1]) continue;
      let kontenObj = {};
      let kuisArr = [];
      try { kontenObj = JSON.parse(r[4] || '{}'); } catch (e) { kontenObj = {}; }
      try { kuisArr = JSON.parse(r[5] || '[]'); } catch (e) { kuisArr = []; }
      if (kontenObj.gambar_tujuan) kontenObj.gambar_tujuan = formatDriveUrl(kontenObj.gambar_tujuan);
      if (Array.isArray(kontenObj.galeri_tujuan)) {
        kontenObj.galeri_tujuan = kontenObj.galeri_tujuan.map(g => ({
          url: formatDriveUrl(g.url || ''),
          caption: g.caption || 'Visual Materi',
          uploadedAt: g.uploadedAt || ''
        }));
      }
      normalizeSubMateriImagesInKontenV78(kontenObj);

      let modId = r[0].toString().trim();
      let modItem = {
        id: modId,
        mapel: r[1].toString().trim(),
        judul: r[2].toString().trim(),
        tujuan: r[3].toString().trim(),
        konten: kontenObj,
        kuis: kuisArr,
        pembuat: r[6] || 'Guru SMPN 3 Bangil',
        tanggal: r[7] || '-',
        qnaList: qnaByModul[modId] || []
      };
      if (!modulesByMapel[modItem.mapel]) modulesByMapel[modItem.mapel] = [];
      modulesByMapel[modItem.mapel].push(modItem);
      allModules.push(modItem);
    }

    // Ambil progres siswa dari LMS_Progress
    const progSheet = ss.getSheetByName('LMS_Progress');
    let progRows = progSheet ? progSheet.getDataRange().getDisplayValues() : [];
    let studentProgress = [];
    let completedMap = {};
    let totalXP = 0;

    let cleanEmail = (emailSiswa || '').toString().trim().toLowerCase();
    let allStudentsXPMap = {};

    for (let i = 1; i < progRows.length; i++) {
      let pr = progRows[i];
      let rowEmail = (pr[1] || '').toString().trim().toLowerCase();
      let rowNama = (pr[2] || 'Siswa').toString().trim();
      let rowKelas = (pr[3] || '7').toString().trim();
      let modId = (pr[5] || '').toString().trim();
      let skor = parseFloat(pr[7]) || 0;
      let xp = parseInt(pr[8]) || 0;

      if (rowNama) {
        let sKey = rowEmail || rowNama.toLowerCase();
        if (!allStudentsXPMap[sKey]) {
          allStudentsXPMap[sKey] = { nama: rowNama, kelas: rowKelas, mods: {}, totalXP: 0, modCount: 0 };
        }
        if (!allStudentsXPMap[sKey].mods[modId] || xp > allStudentsXPMap[sKey].mods[modId]) {
          allStudentsXPMap[sKey].totalXP += (xp - (allStudentsXPMap[sKey].mods[modId] || 0));
          if (!allStudentsXPMap[sKey].mods[modId]) allStudentsXPMap[sKey].modCount++;
          allStudentsXPMap[sKey].mods[modId] = xp;
        }
      }

      if (cleanEmail && rowEmail === cleanEmail) {
        if (!completedMap[modId] || skor > completedMap[modId].skor) {
          if (completedMap[modId]) totalXP -= completedMap[modId].xp;
          completedMap[modId] = {
            waktu: pr[0],
            mapel: pr[4],
            idModul: modId,
            judulModul: pr[6],
            skor: skor,
            xp: xp,
            refleksi: pr[9] || ''
          };
          totalXP += xp;
        }
        studentProgress.push({
          waktu: pr[0],
          mapel: pr[4],
          idModul: modId,
          judulModul: pr[6],
          skor: skor,
          xp: xp,
          refleksi: pr[9] || ''
        });
      }
    }

    let leaderboardSorted = Object.values(allStudentsXPMap)
      .sort((a, b) => b.totalXP - a.totalXP || b.modCount - a.modCount)
      .slice(0, 10)
      .map((item, idx) => ({
        rank: idx + 1,
        nama: item.nama,
        kelas: item.kelas,
        totalXP: item.totalXP,
        modCount: item.modCount
      }));

    // Susun daftar mata pelajaran otomatis sesuai sheet yang ada di Spreadsheet
    let subjectsList = [];
    sheets.forEach(sh => {
      let sName = sh.getName();
      if (!isSystemSheetName(sName)) {
        let mods = modulesByMapel[sName] || [];
        let completedCount = mods.filter(m => completedMap[m.id] !== undefined).length;
        let jumlahSoalCBT = Math.max(0, sh.getLastRow() - 1);
        subjectsList.push({
          name: sName,
          examStatus: tokenMap[sName] || 'NONAKTIF',
          totalModules: mods.length,
          completedModules: completedCount,
          totalSoalUjian: jumlahSoalCBT,
          durasiUjian: getExamDurationForSubjectV93(sName),
          modules: mods
        });
      }
    });

    const envCfgV88 = getAppEnvironmentConfigV88();
    return {
      success: true,
      activeEnvironment: envCfgV88.activeEnvironment || 'ALL',
      activeExamMode: envCfgV88.activeExamMode || 'PTS',
      subjects: subjectsList,
      allModules: allModules,
      completedMap: completedMap,
      totalXP: totalXP,
      history: studentProgress,
      qnaByModul: qnaByModul,
      leaderboard: leaderboardSorted
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// 2. Simpan Progres Belajar Siswa, Skor Kuis Formatif, XP Terverifikasi Anti-Instan, & Refleksi Konstruktif
function saveStudentLMSProgress(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    ensureSystemInitialized();
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('LMS_Progress');
    
    let waktu = new Date().toLocaleString('id-ID');
    let skor = parseFloat(payload.skor) || 0;
    // Gunakan XP terverifikasi dari aktivitas nyata siswa (membaca, flashcard, refleksi AI, catatan, kuis)
    let xpEarned = parseInt(payload.xpVerified) || Math.round(60 + (skor * 1.4));

    sheet.appendRow([
      waktu,
      (payload.email || '').toString().trim().toLowerCase(),
      (payload.nama || 'Siswa').toString().trim(),
      (payload.kelas || '7').toString().trim(),
      (payload.mapel || '').toString().trim(),
      (payload.idModul || '').toString().trim(),
      (payload.judulModul || '').toString().trim(),
      skor,
      xpEarned,
      (payload.refleksi || '-').toString().trim()
    ]);
    SpreadsheetApp.flush();
    return { success: true, xpEarned: xpEarned, message: "Progres belajar & XP Terverifikasi berhasil disimpan!" };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// 3. Ambil seluruh data progres LMS, QnA & daftar Guru untuk Panel Guru/Admin
function getAdminLMSData() {
  try {
    ensureSystemInitialized();
    const ss = getTargetSpreadsheet();
    if (!ss.getSheetByName('LMS_QnA')) {
      let sheetQna = ss.insertSheet('LMS_QnA');
      sheetQna.appendRow(['ID_QnA', 'Waktu', 'ID_Modul', 'Mata Pelajaran', 'Judul Modul', 'Nama Siswa', 'Kelas', 'Pertanyaan Siswa', 'Balasan Guru', 'Nama Guru Penjawab', 'Waktu Balasan']);
      sheetQna.getRange("A1:K1").setFontWeight("bold").setBackground("#d1fae5");
    }
    
    // Modul LMS
    const lmsSheet = ss.getSheetByName('LMS_Materi');
    let lmsRows = lmsSheet ? lmsSheet.getDataRange().getDisplayValues() : [];
    let modules = [];
    for (let i = 1; i < lmsRows.length; i++) {
      let r = lmsRows[i];
      if (!r[0]) continue;
      let kontenObj = {};
      let kuisArr = [];
      try { kontenObj = JSON.parse(r[4] || '{}'); } catch (e) {}
      try { kuisArr = JSON.parse(r[5] || '[]'); } catch (e) {}
      if (kontenObj.gambar_tujuan) kontenObj.gambar_tujuan = formatDriveUrl(kontenObj.gambar_tujuan);
      if (Array.isArray(kontenObj.galeri_tujuan)) {
        kontenObj.galeri_tujuan = kontenObj.galeri_tujuan.map(g => ({
          url: formatDriveUrl(g.url || ''),
          caption: g.caption || 'Visual Materi',
          uploadedAt: g.uploadedAt || ''
        }));
      }
      normalizeSubMateriImagesInKontenV78(kontenObj);

      modules.push({
        rowIndex: i + 1,
        id: r[0],
        mapel: r[1],
        judul: r[2],
        tujuan: r[3],
        konten: kontenObj,
        kuis: kuisArr,
        pembuat: r[6] || 'Guru',
        tanggal: r[7] || '-'
      });
    }

    // Progres Siswa
    const progSheet = ss.getSheetByName('LMS_Progress');
    let progRows = progSheet ? progSheet.getDataRange().getDisplayValues() : [];
    let progressList = [];
    for (let i = 1; i < progRows.length; i++) {
      let pr = progRows[i];
      if (!pr[2]) continue;
      progressList.push({
        waktu: pr[0],
        email: pr[1],
        nama: pr[2],
        kelas: pr[3],
        mapel: pr[4],
        idModul: pr[5],
        judulModul: pr[6],
        skor: parseFloat(pr[7]) || 0,
        xp: parseInt(pr[8]) || 0,
        refleksi: pr[9] || '-'
      });
    }

    // Diskusi QnA Siswa & Guru
    const qnaSheet = ss.getSheetByName('LMS_QnA');
    let qnaRows = qnaSheet ? qnaSheet.getDataRange().getDisplayValues() : [];
    let qnaList = [];
    for (let i = 1; i < qnaRows.length; i++) {
      let qr = qnaRows[i];
      if (!qr[0]) continue;
      qnaList.push({
        idQna: qr[0],
        waktu: qr[1],
        idModul: qr[2],
        mapel: qr[3],
        judulModul: qr[4],
        namaSiswa: qr[5],
        kelas: qr[6],
        pertanyaan: qr[7],
        balasanGuru: qr[8] || '',
        namaGuru: qr[9] || '',
        waktuBalas: qr[10] || '',
        meta: parseQnAExtendedMetaV37(qr)
      });
    }

    // Daftar Akun Guru
    const guruSheet = ss.getSheetByName('Guru');
    let guruRows = guruSheet ? guruSheet.getDataRange().getDisplayValues() : [];
    let guruList = [];
    for (let i = 1; i < guruRows.length; i++) {
      let gr = guruRows[i];
      if (!gr[0]) continue;
      guruList.push({
        username: gr[0],
        password: gr[1],
        nama: gr[2],
        mapel: gr[3],
        role: gr[4] || 'GURU'
      });
    }

    // Daftar Siswa Terdaftar (Users) & Daftar Sheet Mata Pelajaran Aktif untuk Leger Analitik LMS
    const userSheet = ss.getSheetByName('Users');
    let userRows = userSheet ? userSheet.getDataRange().getDisplayValues() : [];
    let allStudents = [];
    for (let i = 1; i < userRows.length; i++) {
      let ur = userRows[i];
      if (!ur[0]) continue;
      allStudents.push({
        nama: (ur[0] || '').toString().trim(),
        email: (ur[1] || '').toString().trim(),
        kelas: (ur[3] || '7').toString().trim().toUpperCase()
      });
    }
    let subjectSheets = [];
    ss.getSheets().forEach(sh => {
      let sName = sh.getName();
      if (!isSystemSheetName(sName)) subjectSheets.push(sName);
    });

    return {
      success: true,
      modules: modules,
      progressList: progressList,
      qnaList: qnaList,
      guruList: guruList,
      allStudents: allStudents,
      subjectSheets: subjectSheets
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// 4. Generate Materi Pembelajaran Konstruktif + Kuis Interaktif dalam SATU KALI REQUEST (Single-Shot Groq API)
async function generateMateriDanKuisGroqSingleShot(payload) {
  try {
    const GROQ_API_KEY = getGroqApiKeyPropV90('GROQ_LMS_API_KEY_K7');
    if (!GROQ_API_KEY) return getMissingGroqKeyErrorV90('GROQ_LMS_API_KEY_K7');
    
    let mapel = (payload.mapel || "Mata Pelajaran SMP").toString().trim();
    let topik = (payload.topik || "Topik Pembelajaran").toString().trim();
    let tujuan = (payload.tujuan || "Siswa mampu memahami dan menerapkan konsep secara konstruktif dalam kehidupan sehari-hari.").toString().trim();
    let jumlahKuis = parseInt(payload.jumlahKuis) || 5;
    if (jumlahKuis > 10) jumlahKuis = 10;

    let sysPrompt = `Anda adalah Instruktur Pedagogi Konstruktif & Pengembang Kurikulum Merdeka SMP Kelas 7 terbaik di Indonesia.
Tugas Anda: Buat 1 Paket Modul Pembelajaran Konstruktif Terbimbing LENGKAP BESERTA Kuis Interaktifnya untuk mata pelajaran "${mapel}" tentang topik "${topik}" dalam SATU KALI RESPON JSON.
Tujuan Pembelajaran: ${tujuan}

Struktur Pembelajaran Konstruktif (5 Fase Terbimbing) yang WAJIB ada di objek "konten":
1. "pemantik": Pertanyaan memicu rasa ingin tahu & fenomena kontekstual di sekitar siswa SMP agar siswa tertarik (Apersepsi & Hook).
2. "eksplorasi": Penjelasan materi inti yang mendalam, terstruktur, menggunakan analogi seru, dibagi menjadi 3 sub-bagian dalam array "sub_materi" (masing-masing ada "judul_sub", "uraian", dan "contoh_nyata").
3. "fakta_unik": Array berisi 3 fakta unik/fun-facts sains/sosial/kontekstual terkait topik ("Tahukah Kamu?").
4. "kartu_pintar": Array berisi 4 Flashcards interaktif (masing-masing objek memiliki "istilah" dan "definisi") untuk dihafal/dipahami siswa dengan cara membalik kartu.
5. "studi_kasus": 1 Tantangan pemecahan masalah nyata (Problem-Based Learning) berisi "judul_kasus", "cerita_kasus", "pertanyaan_diskusi", dan "panduan_solusi".
6. "rangkuman": Array berisi 4 poin intisari materi.

Selain itu, buat tepat ${jumlahKuis} soal kuis formatif HOTS di array "kuis" lengkap dengan "pembahasan" yang menjelaskan mengapa jawaban tersebut benar agar siswa belajar dari umpan balik.

ATURAN FORMAT OUTPUT (WAJIB JSON MURNI TANPA TEKS LAIN):
{
  "judul_modul": "Judul Menarik tentang ${topik}",
  "tujuan_pembelajaran": "${tujuan}",
  "konten": {
    "pemantik": "Narasi apersepsi & pertanyaan pemantik...",
    "eksplorasi": {
      "pengantar": "Paragraf pengantar konsep...",
      "sub_materi": [
        {
          "judul_sub": "1. ...",
          "uraian": "Penjelasan lengkap, jelas, dan konstruktif...",
          "contoh_nyata": "Contoh konkret di kehidupan siswa SMP..."
        }
      ]
    },
    "fakta_unik": ["Fakta 1...", "Fakta 2...", "Fakta 3..."],
    "kartu_pintar": [
      { "istilah": "Konsep A", "definisi": "Penjelasan ringkas dan padat..." }
    ],
    "studi_kasus": {
      "judul_kasus": "Judul Tantangan Nyata",
      "cerita_kasus": "Skenario kasus kontekstual...",
      "pertanyaan_diskusi": "Apa yang harus dilakukan jika...?",
      "panduan_solusi": "Langkah berpikir kritis untuk menyelesaikan kasus..."
    },
    "rangkuman": ["Poin 1", "Poin 2", "Poin 3", "Poin 4"]
  },
  "kuis": [
    {
      "no": 1,
      "soal": "[Stimulus Singkat] Pertanyaan...",
      "a": "Opsi A",
      "b": "Opsi B",
      "c": "Opsi C",
      "d": "Opsi D",
      "kunci": "A",
      "pembahasan": "Penjelasan edukatif mengapa opsi tersebut benar..."
    }
  ]
}`;

    let modelsToTry = ["openai/gpt-oss-120b", "openai/oss120b", "llama-3.3-70b-versatile"];
    let lastError = "";
    let aiText = "";

    for (let m = 0; m < modelsToTry.length; m++) {
      let options = {
        "method": "post",
        "headers": {
          "Authorization": "Bearer " + GROQ_API_KEY,
          "Content-Type": "application/json"
        },
        "payload": JSON.stringify({
          "model": modelsToTry[m],
          "messages": [
            { "role": "system", "content": sysPrompt },
            { "role": "user", "content": "Susun modul pembelajaran konstruktif dan kuis beserta pembahasannya dalam 1 objek JSON utuh sekarang." }
          ],
          "temperature": 0.25,
          "max_tokens": 4500,
          "response_format": { "type": "json_object" }
        }),
        "muteHttpExceptions": true
      };

      let response = await fetchGroqChatWithAutoFailoverV96("https://api.groq.com/openai/v1/chat/completions", options);
      let resJson = JSON.parse(response.getContentText());

      if (response.getResponseCode() === 200 && resJson.choices && resJson.choices.length > 0) {
        aiText = resJson.choices[0].message.content;
        break;
      } else {
        lastError = resJson.error ? resJson.error.message : ("HTTP " + response.getResponseCode());
      }
    }

    if (!aiText) {
      throw new Error("Gagal memanggil Groq API: " + lastError);
    }

    let cleanJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    let matchObj = cleanJson.match(/\{[\s\S]*\}/);
    if (matchObj) cleanJson = matchObj[0];

    let parsedResult = JSON.parse(cleanJson);
    return {
      success: true,
      data: parsedResult
    };
  } catch (e) {
    return {
      success: false,
      message: "Gagal merakit Materi & Kuis AI: " + e.toString()
    };
  }
}

// 5. Simpan Modul LMS (Baru / Edit) ke Sheet LMS_Materi & Opsional Sinkronisasi Kuis ke Bank Soal PTS/PAS
function saveLMSModuleAdmin(modulePayload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(12000);
    ensureSystemInitialized();
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('LMS_Materi');
    
    let idModul = modulePayload.id || ('MOD-' + Date.now());
    let mapel = (modulePayload.mapel || '').toString().trim();
    let judul = (modulePayload.judul || '').toString().trim();
    let tujuan = (modulePayload.tujuan || '').toString().trim();
    let kontenStr = typeof modulePayload.konten === 'string' ? modulePayload.konten : JSON.stringify(modulePayload.konten || {});
    let kuisArr = Array.isArray(modulePayload.kuis) ? modulePayload.kuis : [];
    let kuisStr = JSON.stringify(kuisArr);
    let pembuat = (modulePayload.pembuat || 'Guru Pengampu').toString().trim();
    let tanggal = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

    let data = sheet.getDataRange().getDisplayValues();
    let foundRow = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === idModul) {
        foundRow = i + 1;
        break;
      }
    }

    let rowValues = [idModul, mapel, judul, tujuan, kontenStr, kuisStr, pembuat, tanggal];
    if (foundRow !== -1) {
      sheet.getRange(foundRow, 1, 1, 8).setValues([rowValues]);
    } else {
      sheet.appendRow(rowValues);
    }

    if (modulePayload.syncToBankSoal && kuisArr.length > 0 && mapel) {
      let soalForCBT = kuisArr.map((q, idx) => [
        idx + 1,
        q.soal || '',
        q.a || '',
        q.b || '',
        q.c || '',
        q.d || '',
        (q.kunci || 'A').toString().trim().toUpperCase(),
        '', '', '', '', '',
        'PG'
      ]);
      appendSoalMasalAdmin(mapel, soalForCBT);
    }

    SpreadsheetApp.flush();
    return {
      success: true,
      idModul: idModul,
      message: modulePayload.syncToBankSoal
        ? "Modul Pembelajaran disimpan ke LMS & Soal Kuis berhasil diintegrasikan ke Bank Soal PTS/PAS!"
        : "Modul Pembelajaran & Kuis Interaktif berhasil disimpan ke LMS!"
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// 6. Hapus Modul LMS
function deleteLMSModuleAdmin(idModul) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('LMS_Materi');
    if (!sheet) return { success: false, message: "Sheet LMS_Materi tidak ditemukan." };
    let data = sheet.getDataRange().getDisplayValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === idModul) {
        sheet.deleteRow(i + 1);
        SpreadsheetApp.flush();
        return { success: true, message: "Modul pembelajaran berhasil dihapus." };
      }
    }
    return { success: false, message: "ID Modul tidak ditemukan." };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// 7. Tambah / Simpan Akun Guru Pengampu
function saveGuruAccountAdmin(guruPayload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    ensureSystemInitialized();
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('Guru');
    let u = (guruPayload.username || '').toString().trim();
    let p = (guruPayload.password || '').toString().trim();
    let n = (guruPayload.nama || '').toString().trim();
    let m = (guruPayload.mapel || 'ALL').toString().trim();
    if (!u || !p || !n) return { success: false, message: "Username, Password, dan Nama Guru wajib diisi." };

    let data = sheet.getDataRange().getDisplayValues();
    const hashedGuruPass = isPasswordHashedV92(p) ? p : hashPasswordSaltedV92(p);
    for (let i = 1; i < data.length; i++) {
      if (data[i][0].toLowerCase() === u.toLowerCase()) {
        sheet.getRange(i + 1, 1, 1, 5).setValues([[u, hashedGuruPass, n, m, 'GURU']]);
        SpreadsheetApp.flush();
        return { success: true, message: "Data akun Guru berhasil diperbarui (Password Terenkripsi SHA-256)!" };
      }
    }
    sheet.appendRow([u, hashedGuruPass, n, m, 'GURU']);
    SpreadsheetApp.flush();
    return { success: true, message: "Akun Guru baru berhasil ditambahkan!" };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// 8. Simpan Pertanyaan Baru dari Siswa (Fitur QnA Siswa & Guru)
function submitStudentLMSQuestion(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('LMS_QnA');
    if (!sheet) {
      sheet = ss.insertSheet('LMS_QnA');
      sheet.appendRow(['ID_QnA', 'Waktu', 'ID_Modul', 'Mata Pelajaran', 'Judul Modul', 'Nama Siswa', 'Kelas', 'Pertanyaan Siswa', 'Balasan Guru', 'Nama Guru Penjawab', 'Waktu Balasan']);
      sheet.getRange("A1:K1").setFontWeight("bold").setBackground("#d1fae5");
    }

    let idQna = 'QNA-' + Date.now();
    let waktu = new Date().toLocaleString('id-ID');
    let item = {
      idQna: idQna,
      waktu: waktu,
      idModul: (payload.idModul || '').toString().trim(),
      mapel: (payload.mapel || '').toString().trim(),
      judulModul: (payload.judulModul || '').toString().trim(),
      namaSiswa: (payload.namaSiswa || 'Siswa').toString().trim(),
      kelas: (payload.kelas || '7').toString().trim(),
      pertanyaan: (payload.pertanyaan || '').toString().trim(),
      balasanGuru: '',
      namaGuru: '',
      waktuBalas: ''
    };

    sheet.appendRow([
      item.idQna, item.waktu, item.idModul, item.mapel, item.judulModul,
      item.namaSiswa, item.kelas, item.pertanyaan, '', '', ''
    ]);
    SpreadsheetApp.flush();
    return { success: true, item: item, message: "Pertanyaan berhasil dikirim ke Guru Pengampu!" };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// 9. Simpan Balasan Guru terhadap Pertanyaan Siswa di QnA LMS
function replyLMSQuestionAdmin(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('LMS_QnA');
    if (!sheet) return { success: false, message: "Sheet LMS_QnA belum tersedia." };

    let data = sheet.getDataRange().getDisplayValues();
    let idQna = (payload.idQna || '').toString().trim();
    let balasan = (payload.balasan || '').toString().trim();
    let namaGuru = (payload.namaGuru || 'Guru Pengampu').toString().trim();
    let waktuBalas = new Date().toLocaleString('id-ID');

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === idQna) {
        sheet.getRange(i + 1, 9, 1, 3).setValues([[balasan, namaGuru, waktuBalas]]);
        SpreadsheetApp.flush();
        return { success: true, message: "Balasan berhasil dikirim dan langsung tampil di ruang belajar siswa!" };
      }
    }
    return { success: false, message: "Data pertanyaan tidak ditemukan." };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// 10. Asisten Belajar AI (Groq openai/oss120b) di Setiap Modul Belajar Siswa
async function askAITutorLMS(payload) {
  try {
    const GROQ_API_KEY = getGroqApiKeyPropV90('GROQ_STUDENT_TUTOR_API_KEY_K7');
    if (!GROQ_API_KEY) return getMissingGroqKeyErrorV90('GROQ_STUDENT_TUTOR_API_KEY_K7');
    let mapel = (payload.mapel || 'Mata Pelajaran SMP').toString().trim();
    let judulModul = (payload.judulModul || 'Modul Pembelajaran').toString().trim();
    let ringkasanKonten = (payload.ringkasanKonten || '').toString().trim();
    let namaSiswa = (payload.namaSiswa || 'Siswa').toString().trim();
    let pertanyaan = (payload.pertanyaan || '').toString().trim();

    if (!pertanyaan) return { success: false, message: "Pertanyaan tidak boleh kosong." };

    let sysPrompt = `Anda adalah "Sahabat Belajar AI SICIBINAGA", asisten belajar konstruktif yang ramah, suportif, dan cerdas khusus untuk siswa Kelas 7 di SMPN 3 Bangil.
Saat ini Anda mendampingi siswa bernama "${namaSiswa}" yang sedang mempelajari:
- Mata Pelajaran: ${mapel}
- Judul Modul/Bab: ${judulModul}
- Konteks Materi Modul: ${ringkasanKonten}

ATURAN RESPON:
1. Jawablah dengan bahasa Indonesia yang hangat, mudah dipahami remaja SMP Kelas 7, terstruktur dengan poin-poin atau analogi kehidupan sehari-hari.
2. Gunakan pendekatan konstruktif/Sokratik: jelaskan konsepnya dengan jernih, berikan contoh nyata, dan di akhir kalimat berikan 1 kalimat penyemangat atau pertanyaan reflektif ringan.
3. Jangan gunakan format markdown yang terlalu rumit; gunakan paragraf pendek dan penomoran sederhana.`;

    let modelsToTry = ["openai/gpt-oss-120b", "openai/oss120b", "llama-3.3-70b-versatile"];
    let aiReply = "";
    let lastErr = "";

    for (let m = 0; m < modelsToTry.length; m++) {
      let options = {
        "method": "post",
        "headers": {
          "Authorization": "Bearer " + GROQ_API_KEY,
          "Content-Type": "application/json"
        },
        "payload": JSON.stringify({
          "model": modelsToTry[m],
          "messages": [
            { "role": "system", "content": sysPrompt },
            { "role": "user", "content": pertanyaan }
          ],
          "temperature": 0.4,
          "max_tokens": 900
        }),
        "muteHttpExceptions": true
      };

      let response = await fetchGroqChatWithAutoFailoverV96("https://api.groq.com/openai/v1/chat/completions", options);
      let resJson = JSON.parse(response.getContentText());

      if (response.getResponseCode() === 200 && resJson.choices && resJson.choices.length > 0) {
        aiReply = resJson.choices[0].message.content;
        break;
      } else {
        lastErr = resJson.error ? resJson.error.message : ("HTTP " + response.getResponseCode());
      }
    }

    if (!aiReply) throw new Error(lastErr || "Gagal menghubungi layanan AI Groq.");
    return { success: true, answer: aiReply };
  } catch (e) {
    return { success: false, message: "Asisten AI sedang sibuk: " + e.toString() };
  }
}

// 11. Simpan / Unggah Manual Gambar pada Kolom Tujuan Pembelajaran di Tabel Studio LMS
function saveTujuanPembelajaranImageAdmin(idModul, imageUrl, captionText) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('LMS_Materi');
    if (!sheet) return { success: false, message: "Sheet LMS_Materi tidak ditemukan." };

    let data = sheet.getDataRange().getDisplayValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === idModul) {
        let kontenObj = {};
        try { kontenObj = JSON.parse(data[i][4] || '{}'); } catch (e) { kontenObj = {}; }
        if (!Array.isArray(kontenObj.galeri_tujuan)) {
          kontenObj.galeri_tujuan = [];
        }
        let formattedUrl = formatDriveUrl(imageUrl);
        kontenObj.galeri_tujuan.push({
          url: formattedUrl,
          caption: (captionText || 'Ilustrasi Visual Tujuan Pembelajaran').toString().trim(),
          uploadedAt: new Date().toLocaleDateString('id-ID')
        });
        kontenObj.gambar_tujuan = formattedUrl;

        sheet.getRange(i + 1, 5).setValue(JSON.stringify(kontenObj));
        SpreadsheetApp.flush();
        return {
          success: true,
          url: formattedUrl,
          galeri: kontenObj.galeri_tujuan,
          message: "Gambar materi berhasil diunggah ke Tujuan Pembelajaran!"
        };
      }
    }
    return { success: false, message: "ID Modul tidak ditemukan." };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// 12. Hapus Gambar pada Kolom Tujuan Pembelajaran
function removeTujuanPembelajaranImageAdmin(idModul, imgIndex) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('LMS_Materi');
    if (!sheet) return { success: false, message: "Sheet LMS_Materi tidak ditemukan." };

    let data = sheet.getDataRange().getDisplayValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === idModul) {
        let kontenObj = {};
        try { kontenObj = JSON.parse(data[i][4] || '{}'); } catch (e) { kontenObj = {}; }
        if (Array.isArray(kontenObj.galeri_tujuan)) {
          kontenObj.galeri_tujuan.splice(parseInt(imgIndex), 1);
          kontenObj.gambar_tujuan = kontenObj.galeri_tujuan.length > 0 ? kontenObj.galeri_tujuan[kontenObj.galeri_tujuan.length - 1].url : "";
        } else {
          kontenObj.gambar_tujuan = "";
        }
        sheet.getRange(i + 1, 5).setValue(JSON.stringify(kontenObj));
        SpreadsheetApp.flush();
        return {
          success: true,
          galeri: kontenObj.galeri_tujuan || [],
          message: "Gambar berhasil dihapus dari Tujuan Pembelajaran."
        };
      }
    }
    return { success: false, message: "ID Modul tidak ditemukan." };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}


// 13. AI Groq Socratic Guide & Evaluator untuk Studi Kasus & Jurnal Refleksi Siswa (Tahap 4)
async function evaluateStudentReflectionGroq(payload) {
  try {
    const GROQ_API_KEY = getGroqApiKeyPropV90('GROQ_STUDENT_TUTOR_API_KEY_K7');
    if (!GROQ_API_KEY) return getMissingGroqKeyErrorV90('GROQ_STUDENT_TUTOR_API_KEY_K7');
    let mapel = (payload.mapel || 'Mata Pelajaran SMP').toString().trim();
    let judulModul = (payload.judulModul || 'Modul Pembelajaran').toString().trim();
    let tujuan = (payload.tujuan || '').toString().trim();
    let ceritaKasus = (payload.ceritaKasus || '').toString().trim();
    let pertanyaanDiskusi = (payload.pertanyaanDiskusi || '').toString().trim();
    let jawabanRefleksi = (payload.jawabanRefleksi || '').toString().trim();
    let mode = (payload.mode || 'EVALUASI').toString().trim().toUpperCase(); // 'PANDUAN' atau 'EVALUASI'

    let sysPrompt = "";
    if (mode === 'PANDUAN') {
      sysPrompt = `Anda adalah Mentor Pedagogi Sokratik AI untuk siswa SMP Kelas 7 pada mata pelajaran "${mapel}" (Bab: "${judulModul}").
Konteks Studi Kasus: ${ceritaKasus}
Pertanyaan Tantangan: ${pertanyaanDiskusi}

Tugas Anda: Berikan 3 langkah petunjuk berpikir (scaffolding / petunjuk Sokratik) yang memancing rasa ingin tahu siswa agar mereka bisa MENEMUKAN SENDIRI solusi dan kesimpulan refleksinya. JANGAN berikan jawaban langsung!
Wajib balas dalam format JSON murni:
{
  "langkah_pancingan": [
    "Petunjuk 1: Amati dulu bagian...",
    "Petunjuk 2: Hubungkan dengan konsep...",
    "Petunjuk 3: Coba simpulkan apa dampaknya jika..."
  ],
  "kata_kunci_bantuan": ["Kata Kunci 1", "Kata Kunci 2", "Kata Kunci 3"],
  "kalimat_motivasi": "Kalimat penyemangat singkat..."
}`;
    } else {
      sysPrompt = `Anda adalah Evaluator Pemahaman Konstruktif & Mentor Sokratik AI untuk siswa SMP Kelas 7 pada mata pelajaran "${mapel}" (Bab: "${judulModul}").
Tujuan Pembelajaran: ${tujuan}
Konteks Studi Kasus: ${ceritaKasus}
Pertanyaan Diskusi: ${pertanyaanDiskusi}
Jawaban / Jurnal Refleksi Siswa: "${jawabanRefleksi}"

Tugas Anda:
1. Evaluasi apakah jawaban refleksi siswa sudah menunjukkan pemahaman konsep yang utuh, masih dangkal, atau asal ketik.
2. Berikan skor kualitas refleksi (0 sampai 100). Syarat lulus verifikasi refleksi adalah skor >= 70.
3. Berikan apresiasi terhadap bagian yang sudah tepat, lalu berikan 1-2 pertanyaan/arahan Sokratik (tanpa membocorkan jawaban mentah) agar siswa menyempurnakan pemahamannya sendiri.
Wajib balas dalam format JSON murni:
{
  "skor_kualitas": 85,
  "status_lulus": true,
  "apresiasi": "Pujian spesifik atas ide siswa...",
  "koreksi_dan_arahan": "Umpan balik konstruktif & petunjuk bagian yang bisa dipertajam...",
  "pertanyaan_lanjutan": "1 pertanyaan pemantik agar siswa berpikir lebih dalam..."
}`;
    }

    let modelsToTry = ["openai/gpt-oss-120b", "openai/oss120b", "llama-3.3-70b-versatile"];
    let aiText = "";
    let lastErr = "";

    for (let m = 0; m < modelsToTry.length; m++) {
      let options = {
        "method": "post",
        "headers": {
          "Authorization": "Bearer " + GROQ_API_KEY,
          "Content-Type": "application/json"
        },
        "payload": JSON.stringify({
          "model": modelsToTry[m],
          "messages": [
            { "role": "system", "content": sysPrompt },
            { "role": "user", "content": mode === 'PANDUAN' ? "Berikan panduan berpikir Sokratik sekarang dalam JSON." : "Evaluasi refleksi siswa tersebut dalam JSON." }
          ],
          "temperature": 0.35,
          "max_tokens": 900,
          "response_format": { "type": "json_object" }
        }),
        "muteHttpExceptions": true
      };

      let response = await fetchGroqChatWithAutoFailoverV96("https://api.groq.com/openai/v1/chat/completions", options);
      let resJson = JSON.parse(response.getContentText());
      if (response.getResponseCode() === 200 && resJson.choices && resJson.choices.length > 0) {
        aiText = resJson.choices[0].message.content;
        break;
      } else {
        lastErr = resJson.error ? resJson.error.message : ("HTTP " + response.getResponseCode());
      }
    }

    if (!aiText) throw new Error(lastErr || "Gagal menghubungi AI Groq.");
    let cleanJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    let matchObj = cleanJson.match(/\{[\s\S]*\}/);
    if (matchObj) cleanJson = matchObj[0];
    return { success: true, data: JSON.parse(cleanJson) };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// 14. AI Groq Socratic Quiz Coach (Memberikan Petunjuk Bertahap / Koreksi Terbimbing Tanpa Membocorkan Kunci Jawaban)
async function getGroqQuizSocraticCoaching(payload) {
  try {
    const GROQ_API_KEY = getGroqApiKeyPropV90('GROQ_STUDENT_TUTOR_API_KEY_K7');
    if (!GROQ_API_KEY) return getMissingGroqKeyErrorV90('GROQ_STUDENT_TUTOR_API_KEY_K7');
    let mapel = (payload.mapel || 'Mata Pelajaran SMP').toString().trim();
    let judulModul = (payload.judulModul || 'Modul Pembelajaran').toString().trim();
    let soal = (payload.soal || '').toString().trim();
    let opsiText = (payload.opsiText || '').toString().trim();
    let jawabanSiswa = (payload.jawabanSiswa || '').toString().trim();
    let mode = (payload.mode || 'HINT').toString().trim().toUpperCase(); // 'HINT' (Petunjuk sebelum jawab) atau 'COACH' (Bimbingan saat jawaban salah)

    let sysPrompt = `Anda adalah Coach Sokratik AI untuk siswa SMP Kelas 7 pada mata pelajaran "${mapel}" (Bab: "${judulModul}").
Soal Kuis: ${soal}
Pilihan Opsi: ${opsiText}
${mode === 'COACH' ? `Siswa memilih opsi "${jawabanSiswa}" yang MASIH KURANG TEPAT.` : `Siswa meminta petunjuk cara menganalisis soal ini.`}

ATURAN KERAS:
1. DILARANG KERAS menyebutkan huruf kunci jawaban yang benar (A/B/C/D) secara langsung!
2. Berikan petunjuk logika / konsep kunci yang harus diperhatikan siswa pada soal agar siswa menemukan sendiri jawaban yang benar dan memahami materinya secara utuh.
3. Jika mode = COACH, jelaskan dengan ramah mengapa pilihan "${jawabanSiswa}" kurang tepat (miskonsepsi apa yang terjadi), lalu arahkan cara berpikir yang benar.
4. Gunakan bahasa Indonesia yang ringkas (maksimal 3-4 kalimat), hangat, dan mudah dipahami remaja SMP.`;

    let modelsToTry = ["openai/gpt-oss-120b", "openai/oss120b", "llama-3.3-70b-versatile"];
    let aiReply = "";
    let lastErr = "";

    for (let m = 0; m < modelsToTry.length; m++) {
      let options = {
        "method": "post",
        "headers": {
          "Authorization": "Bearer " + GROQ_API_KEY,
          "Content-Type": "application/json"
        },
        "payload": JSON.stringify({
          "model": modelsToTry[m],
          "messages": [
            { "role": "system", "content": sysPrompt },
            { "role": "user", "content": mode === 'COACH' ? "Bimbing saya memperbaiki jawaban yang kurang tepat ini tanpa membocorkan kunci jawabannya." : "Berikan petunjuk berpikir untuk mengerjakan soal ini tanpa membocorkan jawabannya." }
          ],
          "temperature": 0.35,
          "max_tokens": 450
        }),
        "muteHttpExceptions": true
      };

      let response = await fetchGroqChatWithAutoFailoverV96("https://api.groq.com/openai/v1/chat/completions", options);
      let resJson = JSON.parse(response.getContentText());
      if (response.getResponseCode() === 200 && resJson.choices && resJson.choices.length > 0) {
        aiReply = resJson.choices[0].message.content;
        break;
      } else {
        lastErr = resJson.error ? resJson.error.message : ("HTTP " + response.getResponseCode());
      }
    }

    if (!aiReply) throw new Error(lastErr || "Gagal menghubungi AI Groq.");
    return { success: true, coaching: aiReply };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}



// =====================================================================
// 15. FITUR LMS ANALISIS VIDEO INTERAKTIF (YOUTUBE & GOOGLE DRIVE)
//     DENGAN API GROQ KHUSUS ANALISIS VIDEO (GROQ_VIDEO_API_KEY_K7)
// =====================================================================

// Fungsi bantu mengekstrak metadata & embed URL dari tautan YouTube / Google Drive
async function parseVideoLinkMetadata(rawUrl) {
  let url = (rawUrl || '').toString().trim();
  let result = {
    originalUrl: url,
    platform: 'LAINNYA',
    videoId: '',
    embedUrl: url,
    thumbnailUrl: '',
    detectedTitle: ''
  };

  if (!url) return result;

  // Cek apakah link YouTube (youtube.com/watch?v=, youtu.be/, youtube.com/embed/, youtube.com/shorts/)
  let ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    result.platform = 'YOUTUBE';
    result.videoId = ytMatch[1];
    result.embedUrl = 'https://www.youtube.com/embed/' + ytMatch[1] + '?rel=0&modestbranding=1';
    result.thumbnailUrl = 'https://img.youtube.com/vi/' + ytMatch[1] + '/hqdefault.jpg';
    try {
      let oembedResp = await UrlFetchApp.fetch('https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=' + ytMatch[1] + '&format=json', { muteHttpExceptions: true });
      if (oembedResp.getResponseCode() === 200) {
        let oembedJson = JSON.parse(oembedResp.getContentText());
        if (oembedJson && oembedJson.title) {
          result.detectedTitle = oembedJson.title + (oembedJson.author_name ? (' (Channel: ' + oembedJson.author_name + ')') : '');
        }
      }
    } catch (e) {}
    return result;
  }

  // Cek apakah link Google Drive (drive.google.com/file/d/... atau id=...)
  if (url.includes('drive.google.com')) {
    let driveMatch = url.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]{20,})/);
    if (driveMatch && driveMatch[1]) {
      result.platform = 'GDRIVE';
      result.videoId = driveMatch[1];
      result.embedUrl = 'https://drive.google.com/file/d/' + driveMatch[1] + '/preview';
      try {
        let driveFile = await DriveApp.getFileById(driveMatch[1]);
        if (driveFile) {
          result.detectedTitle = driveFile.getName();
        }
      } catch (e) {}
      return result;
    }
  }

  return result;
}

// 15A. Generate Rangkuman Mendalam, Poin Analisis Kritis, Penugasan Isian & Kuis Analisis Video via Groq API
async function generateAndSaveVideoAnalysisLMSAdmin(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    ensureSystemInitialized();
    const GROQ_API_KEY = getGroqApiKeyPropV90('GROQ_VIDEO_API_KEY_K7');
    if (!GROQ_API_KEY) return getMissingGroqKeyErrorV90('GROQ_VIDEO_API_KEY_K7');

    let idModul = (payload.idModul || '').toString().trim();
    let videoUrl = (payload.videoUrl || '').toString().trim();
    let judulVideoInput = (payload.judulVideo || '').toString().trim();
    let konteksGuru = (payload.konteksVideo || '').toString().trim();
    let jmlIsian = parseInt(payload.jumlahIsian) || 3;
    let jmlKuis = parseInt(payload.jumlahKuis) || 4;
    if (jmlIsian < 1) jmlIsian = 2;
    if (jmlIsian > 6) jmlIsian = 6;
    if (jmlKuis < 1) jmlKuis = 3;
    if (jmlKuis > 8) jmlKuis = 8;

    if (!idModul || !videoUrl) {
      return { success: false, message: "ID Modul dan Link Video (YouTube / Google Drive) wajib diisi!" };
    }

    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('LMS_Materi');
    if (!sheet) return { success: false, message: "Sheet LMS_Materi tidak ditemukan." };

    let data = sheet.getDataRange().getDisplayValues();
    let targetRow = -1;
    let mapel = "";
    let judulModul = "";
    let tujuanModul = "";
    let kontenObj = {};

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === idModul) {
        targetRow = i + 1;
        mapel = (data[i][1] || '').toString().trim();
        judulModul = (data[i][2] || '').toString().trim();
        tujuanModul = (data[i][3] || '').toString().trim();
        try { kontenObj = JSON.parse(data[i][4] || '{}'); } catch (e) { kontenObj = {}; }
        break;
      }
    }

    if (targetRow === -1) {
      return { success: false, message: "Modul target tidak ditemukan di database." };
    }

    let videoMeta = await parseVideoLinkMetadata(videoUrl);
    let finalVideoTitle = judulVideoInput || videoMeta.detectedTitle || ("Video Pembelajaran: " + judulModul);

    let sysPrompt = `Anda adalah Pakar Analisis Media Pembelajaran Interaktif & Instruktur Kurikulum Merdeka SMP Kelas 7 di Indonesia.
Tugas Anda: Berdasarkan informasi Video Pembelajaran yang diunggah Guru berikut ini, susunlah:
1) Rangkuman Eksekutif Video yang jernih, menarik, dan mudah dipahami siswa SMP Kelas 7.
2) Analisis Mendalam Video (mencakup Konsep Kunci, Tahapan/Alur Penjelasan dalam Video, Analisis Hubungan Sebab-Akibat / Fenomena Nyata, dan Pesan Kunci).
3) Tepat ${jmlIsian} Soal Penugasan Isian Analisis Video (berupa pertanyaan uraian/isian analitis HOTS yang menuntut siswa mengamati dan menyimpulkan isi video, lengkap dengan "kunci_konsep" dan "panduan_penilaian").
4) Tepat ${jmlKuis} Soal Kuis Pilihan Ganda Analisis Video (A, B, C, D) berstandar HOTS lengkap dengan "kunci" (A/B/C/D) dan "pembahasan" edukatif.

INFORMASI VIDEO & MODUL:
- Mata Pelajaran: ${mapel}
- Judul Modul / Bab: ${judulModul}
- Tujuan Pembelajaran: ${tujuanModul}
- Platform Sumber Video: ${videoMeta.platform} (${videoMeta.originalUrl})
- Judul / Topik Video: ${finalVideoTitle}
- Catatan / Deskripsi Guru tentang Isi Video: ${konteksGuru || 'Sesuaikan secara komprehensif dengan topik modul dan tujuan pembelajaran di atas.'}

ATURAN FORMAT OUTPUT (WAJIB JSON MURNI TANPA TEKS LAIN):
{
  "judul_video": "${finalVideoTitle.replace(/"/g, "'")}",
  "rangkuman_eksekutif": "Paragraf rangkuman utuh dan menarik yang menjelaskan isi utama video pembelajaran ini...",
  "poin_analisis_mendalam": [
    {
      "aspek": "1. Konsep Inti & Fenomena Utama dalam Video",
      "uraian": "Penjelasan analitis mengenai konsep utama yang dibahas..."
    },
    {
      "aspek": "2. Kronologi / Alur Mekanisme & Bukti Ilmiah/Kontekstual",
      "uraian": "Penjelasan bagaimana proses atau argumen bekerja di dalam video..."
    },
    {
      "aspek": "3. Relevansi & Penerapan Nyata dalam Kehidupan Sehari-hari",
      "uraian": "Bagaimana siswa dapat mengaitkan isi video dengan lingkungan sekitarnya..."
    }
  ],
  "kesimpulan_kunci": [
    "Intisari penting 1 dari video...",
    "Intisari penting 2 dari video...",
    "Intisari penting 3 dari video..."
  ],
  "tugas_isian": [
    {
      "no": 1,
      "pertanyaan": "Pertanyaan analisis video yang menuntut siswa menjelaskan/menyimpulkan...",
      "petunjuk_jawab": "Perhatikan bagian penjelasan konsep X pada video...",
      "kunci_konsep": "Kata kunci / konsep utama yang wajib ada pada jawaban siswa..."
    }
  ],
  "kuis_video": [
    {
      "no": 1,
      "soal": "Berdasarkan analisis materi pada video pembelajaran, mengapa...?",
      "a": "Opsi A",
      "b": "Opsi B",
      "c": "Opsi C",
      "d": "Opsi D",
      "kunci": "A",
      "pembahasan": "Penjelasan lengkap mengapa opsi tersebut tepat sesuai analisis video..."
    }
  ]
}`;

    let modelsToTry = ["openai/gpt-oss-120b", "openai/oss120b", "llama-3.3-70b-versatile"];
    let aiText = "";
    let lastErr = "";

    for (let m = 0; m < modelsToTry.length; m++) {
      let options = {
        "method": "post",
        "headers": {
          "Authorization": "Bearer " + GROQ_API_KEY,
          "Content-Type": "application/json"
        },
        "payload": JSON.stringify({
          "model": modelsToTry[m],
          "messages": [
            { "role": "system", "content": sysPrompt },
            { "role": "user", "content": "Hasilkan JSON rangkuman, analisis mendalam, penugasan isian, dan kuis analisis video sekarang." }
          ],
          "temperature": 0.25,
          "max_tokens": 4000,
          "response_format": { "type": "json_object" }
        }),
        "muteHttpExceptions": true
      };

      let response = await fetchGroqChatWithAutoFailoverV96("https://api.groq.com/openai/v1/chat/completions", options);
      let resJson = JSON.parse(response.getContentText());
      if (response.getResponseCode() === 200 && resJson.choices && resJson.choices.length > 0) {
        aiText = resJson.choices[0].message.content;
        break;
      } else {
        lastErr = resJson.error ? resJson.error.message : ("HTTP " + response.getResponseCode());
      }
    }

    if (!aiText) throw new Error("Gagal memanggil API Groq Analisis Video: " + lastErr);

    let cleanJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    let matchObj = cleanJson.match(/\{[\s\S]*\}/);
    if (matchObj) cleanJson = matchObj[0];
    let parsedVideoAI = JSON.parse(cleanJson);

    let videoDataPackage = {
      url_asli: videoMeta.originalUrl,
      embed_url: videoMeta.embedUrl,
      platform: videoMeta.platform,
      video_id: videoMeta.videoId,
      thumbnail: videoMeta.thumbnailUrl,
      judul_video: parsedVideoAI.judul_video || finalVideoTitle,
      konteks_guru: konteksGuru,
      rangkuman_eksekutif: parsedVideoAI.rangkuman_eksekutif || '',
      poin_analisis_mendalam: Array.isArray(parsedVideoAI.poin_analisis_mendalam) ? parsedVideoAI.poin_analisis_mendalam : [],
      kesimpulan_kunci: Array.isArray(parsedVideoAI.kesimpulan_kunci) ? parsedVideoAI.kesimpulan_kunci : [],
      tugas_isian: Array.isArray(parsedVideoAI.tugas_isian) ? parsedVideoAI.tugas_isian : [],
      kuis_video: Array.isArray(parsedVideoAI.kuis_video) ? parsedVideoAI.kuis_video : [],
      updated_at: new Date().toLocaleString('id-ID')
    };

    kontenObj.video_interaktif = videoDataPackage;
    sheet.getRange(targetRow, 5).setValue(JSON.stringify(kontenObj));
    SpreadsheetApp.flush();

    return {
      success: true,
      videoData: videoDataPackage,
      message: "Video Pembelajaran beserta Rangkuman AI, Penugasan Isian, & Kuis Analisis berhasil disimpan ke Modul!"
    };
  } catch (e) {
    return { success: false, message: "Gagal memproses Analisis Video AI: " + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// 15B. Hapus Video Pembelajaran dari Modul
function removeVideoAnalysisLMSAdmin(idModul) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('LMS_Materi');
    if (!sheet) return { success: false, message: "Sheet LMS_Materi tidak ditemukan." };

    let data = sheet.getDataRange().getDisplayValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === idModul) {
        let kontenObj = {};
        try { kontenObj = JSON.parse(data[i][4] || '{}'); } catch (e) { kontenObj = {}; }
        delete kontenObj.video_interaktif;
        sheet.getRange(i + 1, 5).setValue(JSON.stringify(kontenObj));
        SpreadsheetApp.flush();
        return { success: true, message: "Video pembelajaran & tugas analisis berhasil dihapus dari modul." };
      }
    }
    return { success: false, message: "ID Modul tidak ditemukan." };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// 15C. Evaluasi Jawaban Isian & Kuis Analisis Video Siswa secara Komprehensif menggunakan API Groq Analisis Video
async function evaluateStudentVideoAssignmentGroq(payload) {
  try {
    const GROQ_API_KEY = getGroqApiKeyPropV90('GROQ_VIDEO_API_KEY_K7');
    if (!GROQ_API_KEY) return getMissingGroqKeyErrorV90('GROQ_VIDEO_API_KEY_K7');
    let mapel = (payload.mapel || 'Mata Pelajaran SMP').toString().trim();
    let judulModul = (payload.judulModul || 'Modul Pembelajaran').toString().trim();
    let judulVideo = (payload.judulVideo || 'Video Pembelajaran').toString().trim();
    let rangkumanVideo = (payload.rangkumanVideo || '').toString().trim();
    let daftarJawabanIsian = Array.isArray(payload.jawabanIsian) ? payload.jawabanIsian : [];
    let skorKuisPG = parseFloat(payload.skorKuisPG) || 0;

    let rincianIsianPrompt = daftarJawabanIsian.map((item, idx) =>
      `Soal Isian #${idx + 1}: "${item.pertanyaan}"
Konsep Kunci Acuan: "${item.kunci_konsep || '-'}"
Jawaban Siswa: "${item.jawaban_siswa || ''}"`
    ).join('\n\n');

    let sysPrompt = `Anda adalah Evaluator Analisis Video Pembelajaran AI untuk siswa SMP Kelas 7 di SMPN 3 Bangil.
Mata Pelajaran: ${mapel}
Judul Modul: ${judulModul}
Judul Video: ${judulVideo}
Intisari Video: ${rangkumanVideo}

Berikut adalah jawaban siswa pada Penugasan Isian Analisis Video:
${rincianIsianPrompt}

Tugas Anda:
1. Nilai setiap jawaban isian siswa (0 sampai 100) berdasarkan ketepatan konsep, daya analisis terhadap isi video, dan kejelasan kalimat.
2. Berikan umpan balik spesifik yang membimbing (konstruktif) untuk masing-masing nomor isian.
3. Hitung rata-rata skor isian ("skor_rata_isian" 0-100) dan berikan kesimpulan apresiasi menyeluruh.
Wajib balas dalam format JSON murni:
{
  "skor_rata_isian": 85,
  "status_lulus": true,
  "ringkasan_umpan_balik": "Apresiasi dan evaluasi menyeluruh atas hasil analisis video siswa...",
  "evaluasi_per_nomor": [
    {
      "no": 1,
      "skor": 85,
      "umpan_balik": "Penjelasan bagian yang sudah tepat dan penguatan konsep..."
    }
  ]
}`;

    let modelsToTry = ["openai/gpt-oss-120b", "openai/oss120b", "llama-3.3-70b-versatile"];
    let aiText = "";
    let lastErr = "";

    for (let m = 0; m < modelsToTry.length; m++) {
      let options = {
        "method": "post",
        "headers": {
          "Authorization": "Bearer " + GROQ_API_KEY,
          "Content-Type": "application/json"
        },
        "payload": JSON.stringify({
          "model": modelsToTry[m],
          "messages": [
            { "role": "system", "content": sysPrompt },
            { "role": "user", "content": "Evaluasi jawaban penugasan analisis video siswa tersebut dalam format JSON murni sekarang." }
          ],
          "temperature": 0.3,
          "max_tokens": 1800,
          "response_format": { "type": "json_object" }
        }),
        "muteHttpExceptions": true
      };

      let response = await fetchGroqChatWithAutoFailoverV96("https://api.groq.com/openai/v1/chat/completions", options);
      let resJson = JSON.parse(response.getContentText());
      if (response.getResponseCode() === 200 && resJson.choices && resJson.choices.length > 0) {
        aiText = resJson.choices[0].message.content;
        break;
      } else {
        lastErr = resJson.error ? resJson.error.message : ("HTTP " + response.getResponseCode());
      }
    }

    if (!aiText) throw new Error(lastErr || "Gagal menghubungi API Groq Analisis Video.");
    let cleanJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    let matchObj = cleanJson.match(/\{[\s\S]*\}/);
    if (matchObj) cleanJson = matchObj[0];
    let parsedEval = JSON.parse(cleanJson);

    let skorIsian = parseFloat(parsedEval.skor_rata_isian) || 80;
    let skorAkhirGabungan = Math.round((skorIsian * 0.5) + (skorKuisPG * 0.5));

    return {
      success: true,
      skorIsian: Math.round(skorIsian),
      skorKuisPG: Math.round(skorKuisPG),
      skorAkhirVideo: skorAkhirGabungan,
      data: parsedEval
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}


// =====================================================================
// 16. FITUR TRENNING-STYLE MULTIMEDIA DISCUSSION, PEER REPLY, VOICE NOTE & LIKE (V37)
// =====================================================================

function parseQnAExtendedMetaV37(qrRow) {
  let rawMeta = qrRow[11] || '';
  let meta = {
    judulDiskusi: '',
    sectionLabel: 'Tahap 1 • Pemantik & Tujuan',
    likes: 0,
    likedBy: [],
    lampiranGambar: '',
    voiceNoteDataUrl: '',
    voiceDuration: '',
    replies: []
  };
  if (rawMeta) {
    try {
      let parsed = JSON.parse(rawMeta);
      meta = Object.assign(meta, parsed);
    } catch (e) {}
  }
  return meta;
}

function submitStudentRichDiscussionV37(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('LMS_QnA');
    if (!sheet) {
      sheet = ss.insertSheet('LMS_QnA');
      sheet.appendRow(['ID_QnA', 'Waktu', 'ID_Modul', 'Mata Pelajaran', 'Judul Modul', 'Nama Siswa', 'Kelas', 'Pertanyaan Siswa', 'Balasan Guru', 'Nama Guru Penjawab', 'Waktu Balasan', 'Metadata_JSON']);
      sheet.getRange("A1:L1").setFontWeight("bold").setBackground("#d1fae5");
    }

    let idQna = 'QNA-' + Date.now();
    let waktu = new Date().toLocaleString('id-ID');
    let metaObj = {
      judulDiskusi: (payload.judulDiskusi || '').toString().trim(),
      sectionLabel: (payload.sectionLabel || 'Tahap 1 • Pemantik & Tujuan').toString().trim(),
      likes: 0,
      likedBy: [],
      lampiranGambar: (payload.lampiranGambar || '').toString().trim(),
      voiceNoteDataUrl: (payload.voiceNoteDataUrl || '').toString().trim(),
      voiceDuration: (payload.voiceDuration || '').toString().trim(),
      replies: []
    };

    let item = {
      idQna: idQna,
      waktu: waktu,
      idModul: (payload.idModul || '').toString().trim(),
      mapel: (payload.mapel || '').toString().trim(),
      judulModul: (payload.judulModul || '').toString().trim(),
      namaSiswa: (payload.namaSiswa || 'Siswa').toString().trim(),
      kelas: (payload.kelas || '7').toString().trim(),
      pertanyaan: (payload.pertanyaan || '').toString().trim(),
      balasanGuru: '',
      namaGuru: '',
      waktuBalas: '',
      meta: metaObj
    };

    sheet.appendRow([
      item.idQna, item.waktu, item.idModul, item.mapel, item.judulModul,
      item.namaSiswa, item.kelas, item.pertanyaan, '', '', '', JSON.stringify(metaObj)
    ]);
    SpreadsheetApp.flush();
    return { success: true, item: item, message: "Topik diskusi berhasil diterbitkan!" };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function submitDiscussionReplyOrLikeV37(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('LMS_QnA');
    if (!sheet) return { success: false, message: "Sheet LMS_QnA belum tersedia." };

    let data = sheet.getDataRange().getDisplayValues();
    let idQna = (payload.idQna || '').toString().trim();
    let actionType = (payload.actionType || 'REPLY').toString().trim().toUpperCase();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === idQna) {
        let meta = parseQnAExtendedMetaV37(data[i]);
        if (actionType === 'LIKE') {
          let userKey = (payload.namaUser || 'Siswa').toString().trim().toLowerCase();
          if (!Array.isArray(meta.likedBy)) meta.likedBy = [];
          let pos = meta.likedBy.indexOf(userKey);
          if (pos === -1) {
            meta.likedBy.push(userKey);
            meta.likes = (Number(meta.likes) || 0) + 1;
          } else {
            meta.likedBy.splice(pos, 1);
            meta.likes = Math.max(0, (Number(meta.likes) || 1) - 1);
          }
        } else if (actionType === 'REPLY') {
          if (!Array.isArray(meta.replies)) meta.replies = [];
          meta.replies.push({
            idReply: 'REP-' + Date.now(),
            nama: (payload.namaUser || 'Siswa').toString().trim(),
            role: (payload.roleUser || 'Learner').toString().trim(),
            kelas: (payload.kelasUser || '7').toString().trim(),
            waktu: new Date().toLocaleString('id-ID'),
            teks: (payload.teksBalasan || '').toString().trim(),
            lampiranGambar: (payload.lampiranGambar || '').toString().trim(),
            voiceNoteDataUrl: (payload.voiceNoteDataUrl || '').toString().trim(),
            voiceDuration: (payload.voiceDuration || '').toString().trim(),
            likes: 0
          });
        }
        sheet.getRange(i + 1, 12).setValue(JSON.stringify(meta));
        SpreadsheetApp.flush();
        return { success: true, meta: meta };
      }
    }
    return { success: false, message: "Diskusi tidak ditemukan." };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}


// =====================================================================
// 17. FITUR UPLOAD & MANAJEMEN FILE BAHAN AJAR MODUL LMS OLEH ADMIN (V38)
//     (MENDUKUNG VIDEO, PDF, DOC/DOCX, TXT, PPT/PPTX, XLS/XLSX, ZIP, GAMBAR & LINK)
// =====================================================================

function detectTeachingMaterialCategoryV38(fileName, mimeType, rawUrl) {
  let nameLow = (fileName || '').toLowerCase();
  let mimeLow = (mimeType || '').toLowerCase();
  let urlLow = (rawUrl || '').toLowerCase();

  if (mimeLow.includes('video') || /\.(mp4|webm|mkv|mov|avi|m4v)$/.test(nameLow) || urlLow.includes('youtube.com') || urlLow.includes('youtu.be')) {
    return 'VIDEO';
  }
  if (mimeLow.includes('pdf') || nameLow.endsWith('.pdf')) {
    return 'PDF';
  }
  if (mimeLow.includes('word') || mimeLow.includes('document') || /\.(doc|docx|odt|rtf)$/.test(nameLow) || urlLow.includes('docs.google.com/document')) {
    return 'DOC';
  }
  if (mimeLow.includes('presentation') || mimeLow.includes('powerpoint') || /\.(ppt|pptx|odp)$/.test(nameLow) || urlLow.includes('docs.google.com/presentation')) {
    return 'PPT';
  }
  if (mimeLow.includes('spreadsheet') || mimeLow.includes('excel') || /\.(xls|xlsx|csv|ods)$/.test(nameLow) || urlLow.includes('docs.google.com/spreadsheets')) {
    return 'XLS';
  }
  if (mimeLow.includes('text/plain') || /\.(txt|md)$/.test(nameLow)) {
    return 'TXT';
  }
  if (mimeLow.includes('zip') || mimeLow.includes('rar') || mimeLow.includes('compressed') || /\.(zip|rar|7z)$/.test(nameLow)) {
    return 'ZIP';
  }
  if (mimeLow.includes('audio') || /\.(mp3|wav|ogg|m4a)$/.test(nameLow)) {
    return 'AUDIO';
  }
  if (mimeLow.includes('image') || /\.(png|jpg|jpeg|gif|webp|svg)$/.test(nameLow)) {
    return 'IMAGE';
  }
  return 'FILE';
}

function buildEmbedAndDownloadUrlsV38(driveFileId, rawUrl, category) {
  if (driveFileId) {
    return {
      fileId: driveFileId,
      viewUrl: "https://drive.google.com/file/d/" + driveFileId + "/view?usp=sharing",
      previewUrl: "https://drive.google.com/file/d/" + driveFileId + "/preview",
      downloadUrl: "https://drive.google.com/uc?export=download&id=" + driveFileId
    };
  }
  let cleanUrl = (rawUrl || '').toString().trim();
  let previewUrl = cleanUrl;
  let downloadUrl = cleanUrl;

  // Deteksi YouTube
  let ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    previewUrl = "https://www.youtube.com/embed/" + ytMatch[1];
  } else {
    // Deteksi Google Drive File ID
    let gdMatch = cleanUrl.match(/\/(?:file|document|presentation|spreadsheets)\/d\/([a-zA-Z0-9_-]+)/) || cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (gdMatch && gdMatch[1]) {
      let gid = gdMatch[1];
      if (cleanUrl.includes('docs.google.com/document')) {
        previewUrl = "https://docs.google.com/document/d/" + gid + "/preview";
        downloadUrl = "https://docs.google.com/document/d/" + gid + "/export?format=pdf";
      } else if (cleanUrl.includes('docs.google.com/presentation')) {
        previewUrl = "https://docs.google.com/presentation/d/" + gid + "/embed";
        downloadUrl = "https://docs.google.com/presentation/d/" + gid + "/export/pdf";
      } else if (cleanUrl.includes('docs.google.com/spreadsheets')) {
        previewUrl = "https://docs.google.com/spreadsheets/d/" + gid + "/preview";
        downloadUrl = "https://docs.google.com/spreadsheets/d/" + gid + "/export?format=xlsx";
      } else {
        previewUrl = "https://drive.google.com/file/d/" + gid + "/preview";
        downloadUrl = "https://drive.google.com/uc?export=download&id=" + gid;
      }
    }
  }
  return {
    fileId: '',
    viewUrl: cleanUrl,
    previewUrl: previewUrl,
    downloadUrl: downloadUrl
  };
}

async function uploadAndSaveModuleTeachingFileAdminV38(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('LMS_Materi');
    if (!sheet) return { success: false, message: "Sheet LMS_Materi tidak ditemukan." };

    let idModul = (payload.idModul || '').toString().trim();
    let judulFile = (payload.judulFile || '').toString().trim();
    let deskripsiFile = (payload.deskripsiFile || '').toString().trim();
    let fileName = (payload.fileName || judulFile || ('Bahan_Ajar_' + Date.now())).toString().trim();
    let fileSizeLabel = (payload.fileSizeLabel || '').toString().trim();
    let base64Data = payload.base64Data || '';
    let externalUrl = (payload.externalUrl || '').toString().trim();
    let kategoriManual = (payload.kategori || '').toString().trim().toUpperCase();

    let driveFileId = '';
    let mimeType = payload.mimeType || '';

    // Jika admin mengunggah file langsung dari perangkat (Base64 Data URL)
    if (base64Data && base64Data.indexOf(',') > -1) {
      let folderName = "SICIBINAGA_Bahan_Ajar_LMS_K7";
      let folders = await DriveApp.getFoldersByName(folderName);
      let folder = folders.hasNext() ? folders.next() : await DriveApp.createFolder(folderName);
      await folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      let splitBase = base64Data.split(',');
      mimeType = mimeType || splitBase[0].split(';')[0].replace('data:', '') || 'application/octet-stream';
      let byteCharacters = Utilities.base64Decode(splitBase[1]);
      let blob = Utilities.newBlob(byteCharacters, mimeType, fileName);
      let createdFile = await folder.createFile(blob);
      try {
        await createdFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch (shErr) {}
      driveFileId = createdFile.getId();
      if (!fileSizeLabel) {
        let kb = Math.max(1, Math.round(byteCharacters.length / 1024));
        fileSizeLabel = kb >= 1024 ? (kb / 1024).toFixed(1) + ' MB' : kb + ' KB';
      }
    }

    let detectedCategory = kategoriManual && kategoriManual !== 'AUTO'
      ? kategoriManual
      : detectTeachingMaterialCategoryV38(fileName, mimeType, externalUrl);

    let urls = buildEmbedAndDownloadUrlsV38(driveFileId, externalUrl, detectedCategory);

    let newFileItem = {
      idFile: 'FILE-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      judul: judulFile || fileName,
      namaFileAsli: fileName,
      deskripsi: deskripsiFile || ('Bahan ajar resmi ' + detectedCategory),
      kategori: detectedCategory,
      mimeType: mimeType || 'application/octet-stream',
      ukuran: fileSizeLabel || 'Tautan Cloud',
      fileId: urls.fileId,
      viewUrl: urls.viewUrl,
      previewUrl: urls.previewUrl,
      downloadUrl: urls.downloadUrl,
      pengunggah: (payload.pengunggah || 'Admin / Guru').toString().trim(),
      waktuUpload: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    let data = sheet.getDataRange().getDisplayValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === idModul) {
        let kontenObj = {};
        try { kontenObj = JSON.parse(data[i][4] || '{}'); } catch (e) { kontenObj = {}; }
        if (!Array.isArray(kontenObj.berkas_bahan_ajar)) {
          kontenObj.berkas_bahan_ajar = [];
        }
        kontenObj.berkas_bahan_ajar.push(newFileItem);
        sheet.getRange(i + 1, 5).setValue(JSON.stringify(kontenObj));
        SpreadsheetApp.flush();
        return {
          success: true,
          fileItem: newFileItem,
          berkasList: kontenObj.berkas_bahan_ajar,
          message: "File bahan ajar (" + newFileItem.judul + ") berhasil ditambahkan ke Tab File modul!"
        };
      }
    }
    return { success: false, message: "ID Modul tidak ditemukan di Sheet LMS_Materi." };
  } catch (e) {
    return { success: false, message: "Gagal mengunggah bahan ajar: " + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function removeModuleTeachingFileAdminV38(idModul, idFileOrIndex) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('LMS_Materi');
    if (!sheet) return { success: false, message: "Sheet LMS_Materi tidak ditemukan." };

    let data = sheet.getDataRange().getDisplayValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === idModul) {
        let kontenObj = {};
        try { kontenObj = JSON.parse(data[i][4] || '{}'); } catch (e) { kontenObj = {}; }
        let list = Array.isArray(kontenObj.berkas_bahan_ajar) ? kontenObj.berkas_bahan_ajar : [];
        if (typeof idFileOrIndex === 'number' || /^\d+$/.test(String(idFileOrIndex))) {
          let idx = parseInt(idFileOrIndex, 10);
          if (idx >= 0 && idx < list.length) list.splice(idx, 1);
        } else {
          list = list.filter(f => f.idFile !== idFileOrIndex);
        }
        kontenObj.berkas_bahan_ajar = list;
        sheet.getRange(i + 1, 5).setValue(JSON.stringify(kontenObj));
        SpreadsheetApp.flush();
        return {
          success: true,
          berkasList: list,
          message: "Berkas bahan ajar berhasil dihapus dari modul."
        };
      }
    }
    return { success: false, message: "Modul tidak ditemukan." };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}


// =====================================================================
// 18. FITUR INTERACTIVE LIVE DISCUSSION HUB, DIRECT ADMIN LIVE ANSWER
//     (TANPA BUKA DASHBOARD ADMIN), AI GROQ DRAFT ANSWER & DISCUSSION XP/BADGES (V39)
// =====================================================================

function fetchModuleDiscussionsLiveV39(idModul) {
  try {
    const ss = getTargetSpreadsheet();
    let qnaSheet = ss.getSheetByName('LMS_QnA');
    if (!qnaSheet) return { success: true, qnaList: [] };

    let qnaRows = qnaSheet.getDataRange().getDisplayValues();
    let list = [];
    let targetId = (idModul || '').toString().trim();

    for (let i = 1; i < qnaRows.length; i++) {
      let qr = qnaRows[i];
      if (!qr[0] || !qr[2]) continue;
      let mId = qr[2].toString().trim();
      if (targetId && mId !== targetId) continue;
      list.push({
        idQna: qr[0],
        waktu: qr[1],
        idModul: mId,
        mapel: qr[3],
        judulModul: qr[4],
        namaSiswa: qr[5],
        kelas: qr[6],
        pertanyaan: qr[7],
        balasanGuru: qr[8] || '',
        namaGuru: qr[9] || '',
        waktuBalas: qr[10] || '',
        meta: parseQnAExtendedMetaV37(qr)
      });
    }
    return { success: true, qnaList: list };
  } catch (e) {
    return { success: false, message: e.toString(), qnaList: [] };
  }
}

function submitLiveAdminAnswerSidebarV39(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('LMS_QnA');
    if (!sheet) return { success: false, message: "Sheet LMS_QnA belum tersedia." };

    let data = sheet.getDataRange().getDisplayValues();
    let idQna = (payload.idQna || '').toString().trim();
    let balasan = (payload.balasan || '').toString().trim();
    let namaGuru = (payload.namaGuru || 'Guru Pengampu / Admin').toString().trim();
    let roleGuru = (payload.roleGuru || 'Trainer / Admin').toString().trim();
    let markResolved = payload.markResolved !== false;
    let pinThread = !!payload.pinThread;
    let waktuBalas = new Date().toLocaleString('id-ID');

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === idQna) {
        let meta = parseQnAExtendedMetaV37(data[i]);
        meta.isResolved = markResolved;
        if (payload.pinThread !== undefined) meta.isPinned = pinThread;

        if (!Array.isArray(meta.replies)) meta.replies = [];
        // Tambahkan juga ke dalam riwayat replies dengan flag isOfficialAnswer = true
        meta.replies.push({
          idReply: 'ADMREP-' + Date.now(),
          nama: namaGuru,
          role: roleGuru,
          kelas: 'GURU/ADMIN',
          waktu: waktuBalas,
          teks: balasan,
          lampiranGambar: (payload.lampiranGambar || '').toString().trim(),
          voiceNoteDataUrl: (payload.voiceNoteDataUrl || '').toString().trim(),
          voiceDuration: (payload.voiceDuration || '').toString().trim(),
          isOfficialAnswer: true,
          isBestSolution: true,
          likes: 1
        });

        sheet.getRange(i + 1, 9, 1, 4).setValues([[balasan, namaGuru, waktuBalas, JSON.stringify(meta)]]);
        SpreadsheetApp.flush();
        return {
          success: true,
          balasanGuru: balasan,
          namaGuru: namaGuru,
          waktuBalas: waktuBalas,
          meta: meta,
          message: "Live Answer Admin/Guru berhasil diterbitkan langsung di diskusi!"
        };
      }
    }
    return { success: false, message: "Topik diskusi tidak ditemukan." };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function toggleBestPeerSolutionSidebarV39(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('LMS_QnA');
    if (!sheet) return { success: false, message: "Sheet LMS_QnA belum tersedia." };

    let data = sheet.getDataRange().getDisplayValues();
    let idQna = (payload.idQna || '').toString().trim();
    let idReply = (payload.idReply || '').toString().trim();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === idQna) {
        let meta = parseQnAExtendedMetaV37(data[i]);
        if (Array.isArray(meta.replies)) {
          meta.replies.forEach(r => {
            if (r.idReply === idReply) {
              r.isBestSolution = !r.isBestSolution;
              if (r.isBestSolution) meta.isResolved = true;
            }
          });
        }
        sheet.getRange(i + 1, 12).setValue(JSON.stringify(meta));
        SpreadsheetApp.flush();
        return { success: true, meta: meta, message: "Status Solusi Terbaik berhasil diperbarui!" };
      }
    }
    return { success: false, message: "Diskusi tidak ditemukan." };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

async function generateSmartDiscussionAnswerGroqV39(payload) {
  try {
    const GROQ_API_KEY = getGroqApiKeyPropV90('GROQ_LMS_API_KEY_K7');
    if (!GROQ_API_KEY) return getMissingGroqKeyErrorV90('GROQ_LMS_API_KEY_K7');
    let mapel = payload.mapel || 'Mata Pelajaran';
    let judulModul = payload.judulModul || 'Modul Pembelajaran';
    let judulDiskusi = payload.judulDiskusi || '';
    let pertanyaanSiswa = payload.pertanyaanSiswa || '';
    let namaPenanya = payload.namaPenanya || 'Siswa';

    let sysPrompt = `Anda adalah Guru Pengampu & Mentor Ahli ${mapel} Kelas 7 SMPN 3 Bangil.
Seorang siswa bernama ${namaPenanya} mengajukan pertanyaan di forum diskusi modul "${judulModul}":
Judul Topik: "${judulDiskusi}"
Pertanyaan: "${pertanyaanSiswa}"

Tugas Anda:
Susun jawaban langsung (Live Answer) yang ramah, jelas, terstruktur, mudah dipahami siswa SMP Kelas 7, memberikan contoh konkret sehari-hari, dan memotivasi siswa. Panjang jawaban sekitar 3-5 kalimat padat.`;

    let modelsToTry = ["openai/gpt-oss-120b", "openai/oss120b", "llama-3.3-70b-versatile"];
    let aiReply = "";

    for (let m = 0; m < modelsToTry.length; m++) {
      let options = {
        "method": "post",
        "headers": {
          "Authorization": "Bearer " + GROQ_API_KEY,
          "Content-Type": "application/json"
        },
        "payload": JSON.stringify({
          "model": modelsToTry[m],
          "messages": [
            { "role": "system", "content": sysPrompt },
            { "role": "user", "content": "Buatkan draf Live Answer terbaik sekarang." }
          ],
          "temperature": 0.4,
          "max_tokens": 600
        }),
        "muteHttpExceptions": true
      };
      let response = await fetchGroqChatWithAutoFailoverV96("https://api.groq.com/openai/v1/chat/completions", options);
      let resJson = JSON.parse(response.getContentText());
      if (response.getResponseCode() === 200 && resJson.choices && resJson.choices.length > 0) {
        aiReply = resJson.choices[0].message.content;
        break;
      }
    }
    if (!aiReply) return { success: false, message: "Gagal menyusun draf AI." };
    return { success: true, answerDraft: aiReply.trim() };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}


// =====================================================================
// 19. FITUR FULL-MODULE LIVE EDITOR MODE GURU / ADMIN (REALTIME IN-PLACE
//     TANPA PERLU MEMBUKA DASHBOARD ADMIN) & PROTEKSI KHUSUS AKUN GURU/ADMIN (V40)
// =====================================================================

function saveLiveModuleFullEditV40(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(12000);
    ensureSystemInitialized();
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('LMS_Materi');
    if (!sheet) return { success: false, message: 'Sheet LMS_Materi belum tersedia.' };

    let idModul = (payload.id || ('MOD-' + Date.now())).toString().trim();
    let mapel = (payload.mapel || '').toString().trim();
    let judul = (payload.judul || 'Modul Pembelajaran').toString().trim();
    let tujuan = (payload.tujuan || '').toString().trim();
    let kontenObj = payload.konten || {};
    let kuisArr = Array.isArray(payload.kuis) ? payload.kuis : [];
    let pembuat = (payload.pembuat || 'Guru Pengampu').toString().trim();
    let tanggal = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

    let kontenStr = typeof kontenObj === 'string' ? kontenObj : JSON.stringify(kontenObj);
    let kuisStr = JSON.stringify(kuisArr);

    let data = sheet.getDataRange().getDisplayValues();
    let foundRow = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === idModul || (idModul.startsWith('DEFAULT-') && data[i][1] === mapel && data[i][2] === judul)) {
        foundRow = i + 1;
        idModul = data[i][0];
        break;
      }
    }

    if (idModul.startsWith('DEFAULT-')) {
      idModul = 'MOD-' + Date.now();
    }

    let rowValues = [idModul, mapel, judul, tujuan, kontenStr, kuisStr, pembuat, tanggal];
    if (foundRow !== -1) {
      sheet.getRange(foundRow, 1, 1, 8).setValues([rowValues]);
    } else {
      sheet.appendRow(rowValues);
    }

    if (payload.syncToBankSoal && kuisArr.length > 0 && mapel) {
      let soalForCBT = kuisArr.map((q, idx) => [
        idx + 1,
        q.soal || '',
        q.a || '',
        q.b || '',
        q.c || '',
        q.d || '',
        (q.kunci || 'A').toString().trim().toUpperCase(),
        '', '', '', '', '',
        'PG'
      ]);
      appendSoalMasalAdmin(mapel, soalForCBT);
    }

    SpreadsheetApp.flush();
    return {
      success: true,
      idModul: idModul,
      tanggal: tanggal,
      moduleData: {
        id: idModul,
        mapel: mapel,
        judul: judul,
        tujuan: tujuan,
        konten: typeof kontenObj === 'string' ? JSON.parse(kontenObj) : kontenObj,
        kuis: kuisArr,
        pembuat: pembuat,
        tanggal: tanggal
      },
      message: 'Seluruh perubahan konten modul berhasil disimpan secara Live ke Spreadsheet!'
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

async function polishModuleSectionWithAIGroqV40(payload) {
  try {
    const GROQ_API_KEY = getGroqApiKeyPropV90('GROQ_LMS_API_KEY_K7');
    if (!GROQ_API_KEY) return getMissingGroqKeyErrorV90('GROQ_LMS_API_KEY_K7');
    let mapel = payload.mapel || 'Mata Pelajaran';
    let judulModul = payload.judulModul || 'Modul Pembelajaran';
    let sectionType = payload.sectionType || 'UMUM';
    let currentText = payload.currentText || '';
    let instruction = payload.instruction || 'Perkaya dan pertajam materi ini agar kontekstual, menarik, dan mudah dipahami siswa Kelas 7 SMP.';

    let sysPrompt = `Anda adalah Guru Ahli & Pengembang Kurikulum Merdeka tingkat SMP Kelas 7 di SMPN 3 Bangil untuk mata pelajaran ${mapel}.
Modul saat ini: "${judulModul}" (Bagian: ${sectionType}).
Tugas Anda: Menyempurnakan atau menyusun konten bagian tersebut sesuai instruksi guru. Berikan langsung hasil teks/konten yang sudah disempurnakan tanpa kata pengantar berlebihan.`;

    let userPrompt = `Konten Saat Ini:\n${currentText}\n\nInstruksi Guru:\n${instruction}`;
    let modelsToTry = ["openai/gpt-oss-120b", "openai/oss120b", "llama-3.3-70b-versatile"];
    let aiResult = "";

    for (let m = 0; m < modelsToTry.length; m++) {
      let options = {
        "method": "post",
        "headers": {
          "Authorization": "Bearer " + GROQ_API_KEY,
          "Content-Type": "application/json"
        },
        "payload": JSON.stringify({
          "model": modelsToTry[m],
          "messages": [
            { "role": "system", "content": sysPrompt },
            { "role": "user", "content": userPrompt }
          ],
          "temperature": 0.45,
          "max_tokens": 1200
        }),
        "muteHttpExceptions": true
      };
      let response = await fetchGroqChatWithAutoFailoverV96("https://api.groq.com/openai/v1/chat/completions", options);
      let resJson = JSON.parse(response.getContentText());
      if (response.getResponseCode() === 200 && resJson.choices && resJson.choices.length > 0) {
        aiResult = resJson.choices[0].message.content;
        break;
      }
    }
    if (!aiResult) return { success: false, message: "Gagal menghubungi AI Groq." };
    return { success: true, polishedText: aiResult.trim() };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}


// =====================================================================
// 20. FITUR MODERASI & HAPUS MANUAL DISKUSI / BALASAN SISWA OLEH ADMIN/GURU
//     DALAM MODE GURU SERTA CLEAN HEADER ANTI-FAT-FINGER (V41)
// =====================================================================

function deleteDiscussionThreadOrReplyV41(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('LMS_QnA');
    if (!sheet) return { success: false, message: 'Sheet LMS_QnA belum tersedia.' };

    let idQna = (payload.idQna || '').toString().trim();
    let deleteType = (payload.deleteType || 'THREAD').toString().trim().toUpperCase(); // 'THREAD' | 'REPLY' | 'OFFICIAL_ANSWER' | 'CLEAR_REPLIES'
    let idReply = (payload.idReply || '').toString().trim();

    let data = sheet.getDataRange().getDisplayValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === idQna) {
        if (deleteType === 'THREAD') {
          sheet.deleteRow(i + 1);
          SpreadsheetApp.flush();
          return {
            success: true,
            deletedType: 'THREAD',
            idQna: idQna,
            message: 'Topik diskusi siswa berhasil dihapus secara permanen oleh Moderator (Guru/Admin)!'
          };
        }

        let meta = parseQnAExtendedMetaV37(data[i]);
        if (!Array.isArray(meta.replies)) meta.replies = [];

        if (deleteType === 'REPLY') {
          meta.replies = meta.replies.filter(r => r.idReply !== idReply);
          sheet.getRange(i + 1, 12).setValue(JSON.stringify(meta));
          SpreadsheetApp.flush();
          return {
            success: true,
            deletedType: 'REPLY',
            idQna: idQna,
            idReply: idReply,
            meta: meta,
            message: 'Balasan komentar berhasil dihapus oleh Moderator!'
          };
        }

        if (deleteType === 'OFFICIAL_ANSWER') {
          meta.replies = meta.replies.filter(r => !r.isOfficialAnswer);
          meta.isResolved = meta.replies.some(r => r.isBestSolution);
          sheet.getRange(i + 1, 9, 1, 4).setValues([['', '', '', JSON.stringify(meta)]]);
          SpreadsheetApp.flush();
          return {
            success: true,
            deletedType: 'OFFICIAL_ANSWER',
            idQna: idQna,
            meta: meta,
            message: 'Jawaban resmi Guru/Admin pada topik ini telah dihapus.'
          };
        }

        if (deleteType === 'CLEAR_REPLIES') {
          meta.replies = [];
          meta.isResolved = false;
          sheet.getRange(i + 1, 9, 1, 4).setValues([['', '', '', JSON.stringify(meta)]]);
          SpreadsheetApp.flush();
          return {
            success: true,
            deletedType: 'CLEAR_REPLIES',
            idQna: idQna,
            meta: meta,
            message: 'Seluruh balasan pada topik diskusi ini telah dibersihkan!'
          };
        }
      }
    }
    return { success: false, message: 'Data diskusi tidak ditemukan di server.' };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function editDiscussionThreadTextByAdminV41(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('LMS_QnA');
    if (!sheet) return { success: false, message: 'Sheet LMS_QnA belum tersedia.' };

    let idQna = (payload.idQna || '').toString().trim();
    let judulBaru = (payload.judulDiskusi || '').toString().trim();
    let pertanyaanBaru = (payload.pertanyaan || '').toString().trim();

    let data = sheet.getDataRange().getDisplayValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === idQna) {
        let meta = parseQnAExtendedMetaV37(data[i]);
        if (judulBaru) meta.judulDiskusi = judulBaru;
        sheet.getRange(i + 1, 8).setValue(pertanyaanBaru);
        sheet.getRange(i + 1, 12).setValue(JSON.stringify(meta));
        SpreadsheetApp.flush();
        return {
          success: true,
          idQna: idQna,
          pertanyaan: pertanyaanBaru,
          meta: meta,
          message: 'Konten pertanyaan diskusi berhasil dimoderasi/dirapikan!'
        };
      }
    }
    return { success: false, message: 'Topik diskusi tidak ditemukan.' };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}


// =====================================================================
// 21. FITUR REALTIME NOTIFICATION FEED & FOLLOW-UP AKTIVITAS SISWA (V42)
//     (MENDETEKSI BALASAN DISKUSI GURU/SISWA LAIN, PROGRES MODUL, XP & LENCANA)
// =====================================================================

function getStudentRealtimeNotificationsFeedV42(payload) {
  try {
    const ss = getTargetSpreadsheet();
    const namaSiswa = ((payload && payload.nama) || '').toString().trim().toLowerCase();
    const emailSiswa = ((payload && payload.email) || '').toString().trim().toLowerCase();
    const kelasSiswa = ((payload && payload.kelas) || '').toString().trim();

    let serverEvents = [];

    // 1. Periksa seluruh pertanyaan diskusi di LMS_QnA yang dibuat oleh siswa ini atau yang diikuti siswa ini
    let qnaSheet = ss.getSheetByName('LMS_QnA');
    if (qnaSheet && qnaSheet.getLastRow() > 1) {
      let qData = qnaSheet.getDataRange().getDisplayValues();
      for (let i = 1; i < qData.length; i++) {
        let row = qData[i];
        let idQna = row[0] || '';
        let waktuTanya = row[1] || '';
        let idMod = row[2] || '';
        let mapel = row[3] || '';
        let judulMod = row[4] || '';
        let penanya = (row[5] || '').toString().trim();
        let kelasPenanya = row[6] || '';
        let isiPertanyaan = row[7] || '';
        let balasanGuru = (row[8] || '').toString().trim();
        let namaGuru = (row[9] || 'Guru Pengampu').toString().trim();
        let waktuBalas = row[10] || waktuTanya;
        let meta = parseQnAExtendedMetaV37(row);
        let replies = Array.isArray(meta.replies) ? meta.replies : [];

        let isMyQuestion = namaSiswa && penanya.toLowerCase() === namaSiswa;

        // Jika pertanyaan siswa ini telah dibalas oleh Guru/Admin
        if (isMyQuestion && balasanGuru !== '') {
          serverEvents.push({
            id: 'NOTIF-GURU-' + idQna + '-' + balasanGuru.length,
            category: 'DISCUSSION',
            title: `💬 Pertanyaanmu Dijawab oleh ${namaGuru}!`,
            desc: `"${balasanGuru.substring(0, 110)}${balasanGuru.length > 110 ? '...' : ''}" pada modul ${judulMod} (${mapel}).`,
            time: waktuBalas || 'Baru saja',
            mapel: mapel,
            idModul: idMod,
            idQna: idQna,
            actionLabel: 'Lihat Balasan Guru',
            icon: 'fa-chalkboard-user',
            color: '#059669',
            bg: '#ecfdf5'
          });
        }

        // Jika pertanyaan siswa ini telah direspon/dibalas oleh siswa lain atau Guru di thread replies
        if (isMyQuestion && replies.length > 0) {
          replies.forEach((rep, rIdx) => {
            let repAuthor = (rep.nama || 'Teman Kelas').toString().trim();
            if (repAuthor.toLowerCase() !== namaSiswa) {
              serverEvents.push({
                id: 'NOTIF-REP-' + idQna + '-' + (rep.idReply || rIdx),
                category: 'DISCUSSION',
                title: rep.isBestSolution
                  ? `🌟 Solusi Terbaik di Diskusimu oleh ${repAuthor}`
                  : `💬 ${repAuthor} Merespon Pertanyaanmu!`,
                desc: `"${(rep.teks || 'Mengirim Voice Note / Lampiran').substring(0, 100)}" di bab ${judulMod} (${mapel}).`,
                time: rep.waktu || 'Baru saja',
                mapel: mapel,
                idModul: idMod,
                idQna: idQna,
                actionLabel: 'Buka Diskusi & Follow-Up',
                icon: rep.isOfficialAnswer ? 'fa-bolt' : 'fa-comments',
                color: '#4f46e5',
                bg: '#eef2ff'
              });
            }
          });
        }

        // Jika jawaban siswa ini di thread teman ditandai sebagai Solusi Terbaik oleh Guru/Admin
        replies.forEach((rep, rIdx) => {
          let repAuthor = (rep.nama || '').toString().trim().toLowerCase();
          if (namaSiswa && repAuthor === namaSiswa && rep.isBestSolution) {
            serverEvents.push({
              id: 'NOTIF-BESTSOL-' + idQna + '-' + (rep.idReply || rIdx),
              category: 'XP_BADGE',
              title: `🏆 Jawabanmu Terpilih Sebagai Solusi Terbaik! (+50 XP)`,
              desc: `Guru menandai jawabanmu pada diskusi "${(meta.judulDiskusi || isiPertanyaan).substring(0, 75)}" di ${mapel} sebagai Solusi Terbaik!`,
              time: rep.waktu || 'Baru saja',
              mapel: mapel,
              idModul: idMod,
              idQna: idQna,
              actionLabel: 'Lihat Apresiasi Diskusi',
              icon: 'fa-medal',
              color: '#059669',
              bg: '#fef3c7'
            });
          }
        });
      }
    }

    // 2. Periksa riwayat penyelesaian modul & kuis siswa di LMS_Progress
    let progSheet = ss.getSheetByName('LMS_Progress');
    if (progSheet && progSheet.getLastRow() > 1) {
      let pData = progSheet.getDataRange().getDisplayValues();
      for (let i = 1; i < pData.length; i++) {
        let pEmail = (pData[i][1] || '').toString().trim().toLowerCase();
        let pNama = (pData[i][2] || '').toString().trim().toLowerCase();
        if ((emailSiswa && pEmail === emailSiswa) || (namaSiswa && pNama === namaSiswa)) {
          let waktuSelesai = pData[i][0] || '';
          let mapel = pData[i][4] || '';
          let idMod = pData[i][5] || '';
          let judulMod = pData[i][6] || 'Modul LMS';
          let skor = Number(pData[i][7]) || 0;
          let xp = Number(pData[i][8]) || 0;
          serverEvents.push({
            id: 'NOTIF-PROG-' + idMod + '-' + skor,
            category: 'MODULE',
            title: `✅ Modul & Kuis Selesai: ${judulMod}`,
            desc: `Kamu meraih Skor Kuis ${skor}/100 dan memperoleh +${xp} XP pada mata pelajaran ${mapel}.`,
            time: waktuSelesai,
            mapel: mapel,
            idModul: idMod,
            actionLabel: 'Tinjau Pembahasan Modul',
            icon: 'fa-trophy',
            color: '#059669',
            bg: '#ecfdf5'
          });
        }
      }
    }

    return {
      success: true,
      serverEvents: serverEvents
    };
  } catch (e) {
    return { success: false, message: e.toString(), serverEvents: [] };
  }
}


// =====================================================================
// 22. PEMBARUAN V44: PENYIMPANAN PROFIL SISWA (FOTO PROFIL MANUAL,
//     KATA MUTIARA / MOTIVASI PRIBADI, & DATA LEVEL/XP DI FORUM DISKUSI)
// =====================================================================

function getOrCreateProfilSheetV44(ss) {
  let sheet = ss.getSheetByName('LMS_Profil');
  if (!sheet) {
    sheet = ss.insertSheet('LMS_Profil');
    sheet.appendRow([
      'Email_Username',
      'Nama_Siswa',
      'Kelas',
      'Foto_Profil_URL',
      'Kata_Mutiara_Motivasi',
      'Level_Terkini',
      'Total_XP_Terkini',
      'Waktu_Update'
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

async function saveStudentCustomProfileV44(payload) {
  try {
    const ss = getTargetSpreadsheet();
    const sheet = getOrCreateProfilSheetV44(ss);
    const email = ((payload && payload.email) || '').toString().trim().toLowerCase();
    const nama = ((payload && payload.nama) || '').toString().trim();
    const kelas = ((payload && payload.kelas) || '7').toString().trim();
    const motto = ((payload && payload.motto) || '').toString().trim();
    const levelNum = Number(payload && payload.level) || 1;
    const totalXP = Number(payload && payload.totalXP) || 0;
    let avatarUrl = ((payload && payload.avatarUrl) || '').toString().trim();

    if (payload && payload.avatarBase64 && payload.avatarBase64.startsWith('data:image')) {
      try {
        const uploadRes = await uploadImageToDrive(payload.avatarBase64, 'Avatar_' + (nama || 'Siswa').replace(/\s+/g, '_') + '.jpg');
        if (uploadRes && uploadRes.success && uploadRes.url) {
          avatarUrl = uploadRes.url;
        } else {
          avatarUrl = payload.avatarBase64;
        }
      } catch (eImg) {
        avatarUrl = payload.avatarBase64;
      }
    }

    const waktuSkrg = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm');
    const data = sheet.getDataRange().getValues();
    let foundRow = -1;

    for (let i = 1; i < data.length; i++) {
      const rowEmail = (data[i][0] || '').toString().trim().toLowerCase();
      const rowNama = (data[i][1] || '').toString().trim().toLowerCase();
      if ((email && rowEmail === email) || (nama && rowNama === nama.toLowerCase())) {
        foundRow = i + 1;
        if (!avatarUrl) avatarUrl = (data[i][3] || '').toString();
        break;
      }
    }

    if (foundRow !== -1) {
      sheet.getRange(foundRow, 1, 1, 8).setValues([[
        email || nama.toLowerCase(),
        nama,
        kelas,
        avatarUrl,
        motto,
        levelNum,
        totalXP,
        waktuSkrg
      ]]);
    } else {
      sheet.appendRow([
        email || nama.toLowerCase(),
        nama,
        kelas,
        avatarUrl,
        motto,
        levelNum,
        totalXP,
        waktuSkrg
      ]);
    }

    return {
      success: true,
      message: 'Foto profil dan status kata mutiara berhasil disimpan!',
      profile: {
        email: email,
        nama: nama,
        kelas: kelas,
        avatarUrl: avatarUrl,
        motto: motto,
        level: levelNum,
        totalXP: totalXP,
        updatedAt: waktuSkrg
      }
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function getAllStudentProfilesMapV44() {
  try {
    const ss = getTargetSpreadsheet();
    const profilesByName = {};
    const xpByName = {};

    const progSheet = ss.getSheetByName('LMS_Progress');
    if (progSheet && progSheet.getLastRow() > 1) {
      const pData = progSheet.getDataRange().getValues();
      const bestPerStudentMod = {};
      for (let i = 1; i < pData.length; i++) {
        const nm = (pData[i][2] || '').toString().trim();
        const kls = (pData[i][3] || '').toString().trim();
        const modId = (pData[i][5] || '').toString().trim();
        const xpVal = Number(pData[i][8]) || 0;
        if (!nm) continue;
        const key = nm.toLowerCase() + '||' + modId;
        if (!bestPerStudentMod[key] || xpVal > bestPerStudentMod[key].xp) {
          bestPerStudentMod[key] = { nama: nm.toLowerCase(), kelas: kls, xp: xpVal };
        }
      }
      Object.values(bestPerStudentMod).forEach(item => {
        xpByName[item.nama] = (xpByName[item.nama] || 0) + item.xp;
      });
    }

    const profSheet = ss.getSheetByName('LMS_Profil');
    if (profSheet && profSheet.getLastRow() > 1) {
      const rows = profSheet.getDataRange().getDisplayValues();
      for (let i = 1; i < rows.length; i++) {
        const email = (rows[i][0] || '').trim().toLowerCase();
        const nama = (rows[i][1] || '').trim();
        const kelas = (rows[i][2] || '').trim();
        const avatarUrl = (rows[i][3] || '').trim();
        const motto = (rows[i][4] || '').trim();
        const savedLv = Number(rows[i][5]) || 1;
        const savedXP = Math.max(Number(rows[i][6]) || 0, xpByName[nama.toLowerCase()] || 0);
        if (nama) {
          profilesByName[nama.toLowerCase()] = {
            email: email,
            nama: nama,
            kelas: kelas,
            avatarUrl: avatarUrl,
            motto: motto,
            level: savedLv,
            totalXP: savedXP
          };
        }
      }
    }

    Object.keys(xpByName).forEach(nmLow => {
      if (!profilesByName[nmLow]) {
        profilesByName[nmLow] = {
          email: '',
          nama: nmLow,
          kelas: '7',
          avatarUrl: '',
          motto: '',
          level: 1,
          totalXP: xpByName[nmLow]
        };
      }
    });

    return { success: true, profilesByName: profilesByName };
  } catch (e) {
    return { success: false, profilesByName: {}, message: e.toString() };
  }
}


// =====================================================================
// 23. PEMBARUAN V45: LIVE ARENA (MODE TURNAMEN SINKRON ALA KAHOOT! &
//     NETPEAK IQ ACADEMY) DENGAN KENDALI AKTIF/NONAKTIF SEAMLESS,
//     2 MODE AKSES (SATU KELAS vs BANYAK KELAS), & STUDIO GURU LIVE
// =====================================================================

function getOrCreateArenaConfigSheetV45(ss) {
  let sheet = ss.getSheetByName('LMS_Arena');
  if (!sheet) {
    sheet = ss.insertSheet('LMS_Arena');
    sheet.appendRow([
      'Mapel_Key',
      'Status_Aktif',
      'Mode_Akses',
      'Kelas_Diizinkan',
      'PIN_Room',
      'Waktu_Per_Soal',
      'Soal_Kustom_JSON',
      'Updated_By',
      'Updated_At'
    ]);
    sheet.setFrozenRows(1);
    sheet.appendRow([
      '__GLOBAL_ARENA__',
      'AKTIF',
      'MULTI',
      '7A,7B,7C,7D,7E,7F,7G,7H',
      '778899',
      '20',
      '[]',
      'System',
      Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm')
    ]);
  }
  return sheet;
}

function getOrCreateArenaScoresSheetV45(ss) {
  let sheet = ss.getSheetByName('LMS_Arena_Skor');
  if (!sheet) {
    sheet = ss.insertSheet('LMS_Arena_Skor');
    sheet.appendRow([
      'Waktu',
      'PIN_Room',
      'Mapel',
      'Email_Siswa',
      'Nama_Siswa',
      'Kelas',
      'Skor_Koin_Arena',
      'Benar',
      'Total_Soal',
      'Streak_Maks',
      'Mode_Akses'
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getLiveArenaConfigAndDataV45() {
  try {
    const ss = getTargetSpreadsheet();
    const arenaSheet = getOrCreateArenaConfigSheetV45(ss);
    const scoreSheet = getOrCreateArenaScoresSheetV45(ss);

    const allSubjects = [];
    ss.getSheets().forEach(sh => {
      const nm = sh.getName();
      if (!['Users', 'Hasil', 'Token', 'Pengaturan', 'Feedback', 'Guru', 'LMS_Materi', 'LMS_Progress', 'LMS_QnA', 'LMS_Profil', 'LMS_Arena', 'LMS_Arena_Skor'].includes(nm)) {
        allSubjects.push(nm);
      }
    });

    const rows = arenaSheet.getDataRange().getDisplayValues();
    let globalEnabled = true;
    const configByMapel = {};

    for (let i = 1; i < rows.length; i++) {
      const key = (rows[i][0] || '').trim();
      const st = (rows[i][1] || 'AKTIF').trim().toUpperCase();
      const mode = (rows[i][2] || 'MULTI').trim().toUpperCase();
      const allowedKls = (rows[i][3] || '7A,7B,7C,7D,7E,7F,7G,7H').trim();
      const pin = (rows[i][4] || '').trim();
      const timerSec = Number(rows[i][5]) || 20;
      let customQs = [];
      try { customQs = JSON.parse(rows[i][6] || '[]'); } catch (e) { customQs = []; }

      if (key === '__GLOBAL_ARENA__') {
        globalEnabled = (st === 'AKTIF');
      } else if (key) {
        configByMapel[key] = {
          mapel: key,
          enabled: st === 'AKTIF',
          accessMode: mode,
          allowedClasses: allowedKls.split(',').map(s => s.trim().toUpperCase()).filter(Boolean),
          roomPin: pin || String(100000 + (i * 1123) % 899999),
          timerSeconds: timerSec,
          customQuestions: Array.isArray(customQs) ? customQs : [],
          updatedBy: rows[i][7] || 'Admin/Guru',
          updatedAt: rows[i][8] || ''
        };
      }
    }

    allSubjects.forEach((sub, idx) => {
      if (!configByMapel[sub]) {
        configByMapel[sub] = {
          mapel: sub,
          enabled: true,
          accessMode: 'MULTI',
          allowedClasses: ['7A', '7B', '7C', '7D', '7E', '7F', '7G', '7H'],
          roomPin: String(800100 + idx * 111),
          timerSeconds: 20,
          customQuestions: [],
          updatedBy: 'Sistem Default',
          updatedAt: ''
        };
      }
    });

    const leaderboardByMapel = {};
    if (scoreSheet && scoreSheet.getLastRow() > 1) {
      const sRows = scoreSheet.getDataRange().getDisplayValues();
      for (let i = 1; i < sRows.length; i++) {
        const mp = (sRows[i][2] || '').trim();
        const nm = (sRows[i][4] || '').trim();
        const kls = (sRows[i][5] || '').trim();
        const coins = Number(sRows[i][6]) || 0;
        const bnr = Number(sRows[i][7]) || 0;
        const totQ = Number(sRows[i][8]) || 0;
        const strk = Number(sRows[i][9]) || 0;
        if (!mp || !nm) continue;
        if (!leaderboardByMapel[mp]) leaderboardByMapel[mp] = [];
        leaderboardByMapel[mp].push({
          waktu: sRows[i][0] || '',
          pin: sRows[i][1] || '',
          mapel: mp,
          email: sRows[i][3] || '',
          nama: nm,
          kelas: kls,
          coins: coins,
          benar: bnr,
          totalSoal: totQ,
          streak: strk
        });
      }
    }

    return {
      success: true,
      globalEnabled: globalEnabled,
      subjects: allSubjects,
      configByMapel: configByMapel,
      leaderboardByMapel: leaderboardByMapel
    };
  } catch (e) {
    return { success: false, message: e.toString(), globalEnabled: true, configByMapel: {}, leaderboardByMapel: {} };
  }
}

function saveLiveArenaConfigAdminV45(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    const sheet = getOrCreateArenaConfigSheetV45(ss);
    const data = sheet.getDataRange().getValues();
    const waktuSkrg = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm');

    const targetKey = ((payload && payload.mapelKey) || '__GLOBAL_ARENA__').toString().trim();
    const statusAktif = (payload && payload.enabled === false) ? 'NONAKTIF' : 'AKTIF';
    const modeAkses = ((payload && payload.accessMode) || 'MULTI').toString().trim().toUpperCase();
    const allowedClassesStr = Array.isArray(payload && payload.allowedClasses)
      ? payload.allowedClasses.join(',')
      : ((payload && payload.allowedClasses) || '7A,7B,7C,7D,7E,7F,7G,7H').toString();
    const roomPin = ((payload && payload.roomPin) || '778899').toString().trim();
    const timerSec = Number(payload && payload.timerSeconds) || 20;
    const customQsJson = JSON.stringify((payload && Array.isArray(payload.customQuestions)) ? payload.customQuestions : []);
    const updatedBy = ((payload && payload.updatedBy) || 'Guru / Admin').toString().trim();

    let foundRow = -1;
    for (let i = 1; i < data.length; i++) {
      if ((data[i][0] || '').toString().trim() === targetKey) {
        foundRow = i + 1;
        break;
      }
    }

    const rowValues = [targetKey, statusAktif, modeAkses, allowedClassesStr, roomPin, timerSec, customQsJson, updatedBy, waktuSkrg];
    if (foundRow !== -1) {
      sheet.getRange(foundRow, 1, 1, 9).setValues([rowValues]);
    } else {
      sheet.appendRow(rowValues);
    }

    SpreadsheetApp.flush();
    return {
      success: true,
      message: targetKey === '__GLOBAL_ARENA__'
        ? `Status Master Live Arena berhasil diubah menjadi ${statusAktif}!`
        : `Konfigurasi Live Arena mapel ${targetKey} berhasil disimpan secara seamless!`
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function submitLiveArenaScoreV45(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    const sheet = getOrCreateArenaScoresSheetV45(ss);
    const waktuSkrg = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm:ss');

    const mapel = ((payload && payload.mapel) || 'Umum').toString().trim();
    const email = ((payload && payload.email) || '').toString().trim().toLowerCase();
    const nama = ((payload && payload.nama) || 'Siswa').toString().trim();
    const kelas = ((payload && payload.kelas) || '7A').toString().trim().toUpperCase();
    const coins = Number(payload && payload.coins) || 0;
    const benar = Number(payload && payload.benar) || 0;
    const totalSoal = Number(payload && payload.totalSoal) || 1;
    const streak = Number(payload && payload.streak) || 0;
    const pin = ((payload && payload.roomPin) || '-').toString().trim();
    const modeAkses = ((payload && payload.accessMode) || 'MULTI').toString().trim();

    const data = sheet.getDataRange().getValues();
    let foundRow = -1;
    for (let i = 1; i < data.length; i++) {
      const rMapel = (data[i][2] || '').toString().trim().toLowerCase();
      const rNama = (data[i][4] || '').toString().trim().toLowerCase();
      if (rMapel === mapel.toLowerCase() && rNama === nama.toLowerCase()) {
        foundRow = i + 1;
        break;
      }
    }

    const rowData = [waktuSkrg, pin, mapel, email, nama, kelas, coins, benar, totalSoal, streak, modeAkses];
    if (foundRow !== -1) {
      const oldCoins = Number(data[foundRow - 1][6]) || 0;
      if (coins >= oldCoins) {
        sheet.getRange(foundRow, 1, 1, 11).setValues([rowData]);
      }
    } else {
      sheet.appendRow(rowData);
    }

    try {
      const xpBonus = Math.min(250, Math.max(40, Math.round(coins / 5)));
      saveStudentLMSProgress({
        email: email,
        nama: nama,
        kelas: kelas,
        mapel: mapel,
        idModul: 'ARENA-' + mapel.toUpperCase().replace(/\s+/g, '_'),
        judulModul: 'Turnamen Live Arena: ' + mapel,
        skor: Math.round((benar / Math.max(1, totalSoal)) * 100),
        xpVerified: xpBonus,
        refleksi: `Menyelesaikan Turnamen Sinkron Live Arena (${coins} Koin, Streak Maks ${streak}x)`
      });
    } catch (eProg) {}

    SpreadsheetApp.flush();
    return {
      success: true,
      coins: coins,
      message: `Skor Turnamen Live Arena (+${coins} Koin) berhasil dicatat di Papan Peringkat!`
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function getArenaQuestionsForSubjectV45(mapelName) {
  try {
    const ss = getTargetSpreadsheet();
    const cleanMapel = (mapelName || 'IPA').toString().trim();

    // 1. Cek Server Bank Soal Dinamis Live Arena (LMS_Arena_BankSoal V50) terlebih dahulu
    try {
      const bankSheet = getOrCreateArenaBankSoalSheetV50(ss);
      if (bankSheet && bankSheet.getLastRow() > 1) {
        const bRows = bankSheet.getDataRange().getDisplayValues();
        let activePack = null;
        let readyPack = null;
        for (let bi = 1; bi < bRows.length; bi++) {
          if ((bRows[bi][1] || '').trim().toLowerCase() === cleanMapel.toLowerCase()) {
            let pQs = [];
            try { pQs = JSON.parse(bRows[bi][6] || '[]'); } catch (e) { pQs = []; }
            const validPQs = Array.isArray(pQs) ? pQs.filter(q => q && !q.__isArenaMetaV46 && q.soal && q.soal.toString().trim() !== '') : [];
            if (validPQs.length > 0) {
              const st = (bRows[bi][4] || '').trim().toUpperCase();
              if (st === 'AKTIF') {
                activePack = {
                  idPaket: bRows[bi][0],
                  namaPaket: bRows[bi][2],
                  questions: normalizeToExact10ArenaQuestionsV50(validPQs, cleanMapel)
                };
                break;
              } else if (!readyPack) {
                readyPack = {
                  idPaket: bRows[bi][0],
                  namaPaket: bRows[bi][2],
                  questions: normalizeToExact10ArenaQuestionsV50(validPQs, cleanMapel)
                };
              }
            }
          }
        }
        const chosenPack = activePack || readyPack;
        if (chosenPack) {
          return {
            success: true,
            source: 'DYNAMIC_SERVER_BANK_V50',
            packId: chosenPack.idPaket,
            packName: chosenPack.namaPaket,
            questions: chosenPack.questions
          };
        }
      }
    } catch (eBank) {}

    // 2. Cek soal kustom di LMS_Arena (hanya ambil objek yang benar-benar memiliki properti .soal, abaikan __isArenaMetaV46!)
    const arenaSheet = getOrCreateArenaConfigSheetV45(ss);
    const aRows = arenaSheet.getDataRange().getDisplayValues();
    for (let i = 1; i < aRows.length; i++) {
      if ((aRows[i][0] || '').trim().toLowerCase() === cleanMapel.toLowerCase()) {
        try {
          const customArr = JSON.parse(aRows[i][6] || '[]');
          const realCustomQuestions = Array.isArray(customArr)
            ? customArr.filter(q => q && !q.__isArenaMetaV46 && q.soal && q.soal.toString().trim() !== '')
            : [];
          if (realCustomQuestions.length > 0) {
            return {
              success: true,
              source: 'CUSTOM_ARENA',
              questions: normalizeToExact10ArenaQuestionsV50(realCustomQuestions, cleanMapel)
            };
          }
        } catch (e) {}
      }
    }

    // 3. Tarik dari Kuis Modul LMS_Materi & Bank Soal Mapel
    const lmsSheet = ss.getSheetByName('LMS_Materi');
    const collected = [];
    if (lmsSheet && lmsSheet.getLastRow() > 1) {
      const mRows = lmsSheet.getDataRange().getDisplayValues();
      for (let i = 1; i < mRows.length; i++) {
        if ((mRows[i][1] || '').trim().toLowerCase() === cleanMapel.toLowerCase()) {
          let kuisArr = [];
          try { kuisArr = JSON.parse(mRows[i][5] || '[]'); } catch (e) { kuisArr = []; }
          let kontenObj = {};
          try { kontenObj = JSON.parse(mRows[i][4] || '{}'); } catch (e) { kontenObj = {}; }
          const heroImg = kontenObj.gambar_tujuan || '';

          kuisArr.forEach((q, idx) => {
            if (q && q.soal) {
              collected.push({
                id: 'LMSQ-' + i + '-' + idx,
                soal: q.soal,
                a: q.a || q.A || 'Opsi A',
                b: q.b || q.B || 'Opsi B',
                c: q.c || q.C || 'Opsi C',
                d: q.d || q.D || 'Opsi D',
                kunci: (q.kunci || 'A').toString().trim().toUpperCase(),
                pembahasan: q.pembahasan || '',
                imageUrl: q.imageUrl || heroImg || ''
              });
            }
          });
        }
      }
    }

    const subjSheet = ss.getSheetByName(cleanMapel);
    if (subjSheet && subjSheet.getLastRow() > 1 && collected.length < 15) {
      const sRows = subjSheet.getDataRange().getDisplayValues();
      for (let i = 1; i < sRows.length && collected.length < 20; i++) {
        const r = sRows[i];
        const tipe = (r[12] || 'PG').toString().trim().toUpperCase();
        if (r[1] && (tipe === 'PG' || tipe === '')) {
          collected.push({
            id: 'BANK-' + (r[0] || i),
            soal: r[1],
            a: r[2] || 'Opsi A',
            b: r[3] || 'Opsi B',
            c: r[4] || 'Opsi C',
            d: r[5] || 'Opsi D',
            kunci: (r[6] || 'A').toString().trim().toUpperCase().charAt(0) || 'A',
            pembahasan: 'Soal resmi Bank Soal ' + cleanMapel,
            imageUrl: r[7] ? formatDriveUrl(r[7]) : ''
          });
        }
      }
    }

    const final10 = normalizeToExact10ArenaQuestionsV50(collected, cleanMapel);
    return {
      success: true,
      source: collected.length > 0 ? 'LMS_AND_BANK' : 'DEFAULT_TIERED_10',
      questions: final10
    };
  } catch (e) {
    return {
      success: true,
      source: 'FALLBACK_TIERED_10',
      questions: normalizeToExact10ArenaQuestionsV50([], (mapelName || 'IPA').toString().trim())
    };
  }
}

// =====================================================================
// 24. PEMBARUAN V46: STUDIO EDITOR SOAL & KONTEN LIVE ARENA SECARA UTUH
//     (TERMASUK GENERATOR SOAL VARIATIF AI GROQ KHUSUS TURNAMEN ARENA,
//      IMPORT BANK SOAL / MODUL LMS, & PENGATURAN KONTEN ARENA LENGKAP)
// =====================================================================

async function generateArenaVariedQuestionsGroqV46(payload) {
  try {
    const GROQ_API_KEY = getGroqApiKeyPropV90('GROQ_BANKSOAL_QUIZ_API_KEY_K7');
    if (!GROQ_API_KEY) return getMissingGroqKeyErrorV90('GROQ_BANKSOAL_QUIZ_API_KEY_K7');
    const mapel = ((payload && payload.mapel) || 'IPA').toString().trim();
    const topik = ((payload && payload.topik) || ('Tantangan Seru ' + mapel + ' Kelas 7')).toString().trim();
    const jumlah = Math.min(20, Math.max(3, Number(payload && payload.jumlah) || 10));
    const gaya = ((payload && payload.gaya) || 'CAMPURAN_SERU').toString().trim();

    const sysPrompt = `Anda adalah Game Master & Penyusun Soal Turnamen Edukasi Interaktif bergaya Kahoot! & NetPeak IQ Academy untuk siswa SMP Kelas 7 pada mata pelajaran "${mapel}".
Topik Spesifik: "${topik}"
Gaya Tantangan: "${gaya}" (Wajib sangat bervariasi, tidak monoton, memacu adrenalin, menggabungkan tebak cepat konsep, studi kasus mini sehari-hari, mitos vs fakta sains/logika, tebak tokoh/istilah penting, dan penalaran HOTS ringan yang seru dimainkan di layar HP).

Buatlah tepat ${jumlah} butir soal pilihan ganda (A, B, C, D) yang segar, kreatif, dan berbeda dari soal ujian kaku biasa.
Wajib balas dalam format JSON murni dengan struktur berikut:
{
  "questions": [
    {
      "kategori": "Tebak Cepat / Fakta Unik / Kasus Nyata / Logika HOTS",
      "poinKoin": 100,
      "soal": "Pertanyaan menarik dan menantang...",
      "a": "Pilihan A",
      "b": "Pilihan B",
      "c": "Pilihan C",
      "d": "Pilihan D",
      "kunci": "A",
      "pembahasan": "Penjelasan singkat mengapa jawaban tersebut benar...",
      "imageUrl": ""
    }
  ]
}`;

    const modelsToTry = ["openai/gpt-oss-120b", "openai/oss120b", "llama-3.3-70b-versatile"];
    let aiText = "";
    let lastErr = "";

    for (let m = 0; m < modelsToTry.length; m++) {
      let options = {
        "method": "post",
        "headers": {
          "Authorization": "Bearer " + GROQ_API_KEY,
          "Content-Type": "application/json"
        },
        "payload": JSON.stringify({
          "model": modelsToTry[m],
          "messages": [
            { "role": "system", "content": sysPrompt },
            { "role": "user", "content": `Susun ${jumlah} soal turnamen Live Arena yang sangat variatif dan menarik untuk mapel ${mapel} topik "${topik}" dalam JSON.` }
          ],
          "temperature": 0.55,
          "max_tokens": 3500,
          "response_format": { "type": "json_object" }
        }),
        "muteHttpExceptions": true
      };

      let response = await fetchGroqChatWithAutoFailoverV96("https://api.groq.com/openai/v1/chat/completions", options);
      let resJson = JSON.parse(response.getContentText());
      if (response.getResponseCode() === 200 && resJson.choices && resJson.choices.length > 0) {
        aiText = resJson.choices[0].message.content;
        break;
      } else {
        lastErr = resJson.error ? resJson.error.message : ("HTTP " + response.getResponseCode());
      }
    }

    if (!aiText) throw new Error(lastErr || "Gagal menghubungi layanan AI Groq.");
    let cleanJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    let matchObj = cleanJson.match(/\{[\s\S]*\}/);
    if (matchObj) cleanJson = matchObj[0];
    let parsed = JSON.parse(cleanJson);
    let qArr = Array.isArray(parsed.questions) ? parsed.questions : [];

    let normalized = qArr.map((q, idx) => ({
      id: 'AIARENA-' + Date.now() + '-' + idx,
      kategori: (q.kategori || 'Tantangan Arena').toString().trim(),
      poinKoin: Number(q.poinKoin) || 100,
      soal: (q.soal || '').toString().trim(),
      a: (q.a || q.A || 'Opsi A').toString().trim(),
      b: (q.b || q.B || 'Opsi B').toString().trim(),
      c: (q.c || q.C || 'Opsi C').toString().trim(),
      d: (q.d || q.D || 'Opsi D').toString().trim(),
      kunci: ((q.kunci || 'A').toString().trim().toUpperCase().charAt(0)) || 'A',
      pembahasan: (q.pembahasan || '').toString().trim(),
      imageUrl: (q.imageUrl || '').toString().trim()
    })).filter(q => q.soal !== '');

    return {
      success: true,
      questions: normalized,
      message: `Berhasil merakit ${normalized.length} soal turnamen variatif dengan AI Groq!`
    };
  } catch (e) {
    return { success: false, message: e.toString(), questions: [] };
  }
}



// =====================================================================
// 25. PEMBARUAN V48: PEMISAHAN MURNI LOGIKA XP MODUL LMS (NAIK LEVEL KETAT)
//     VS POIN LIVE ARENA (TOKO REDEEM BINGKAI BADGE AVATAR UNIVERSAL)
// =====================================================================

function getOrCreateArenaBadgeStoreSheetV48(ss) {
  let sheet = ss.getSheetByName('LMS_Badge_Arena');
  if (!sheet) {
    sheet = ss.insertSheet('LMS_Badge_Arena');
    sheet.appendRow([
      'Email_Siswa',
      'Nama_Siswa',
      'Kelas',
      'Total_Poin_Arena_Didapat',
      'Poin_Arena_Terpakai',
      'Saldo_Poin_Arena',
      'Daftar_Badge_Dimiliki_JSON',
      'Badge_Aktif_ID',
      'Waktu_Update'
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange("A1:I1").setFontWeight("bold").setBackground("#d1fae5");
  }
  return sheet;
}

function calculateTotalArenaPointsForStudentV48(ss, email, nama) {
  const scoreSheet = getOrCreateArenaScoresSheetV45(ss);
  if (!scoreSheet || scoreSheet.getLastRow() <= 1) return 0;
  const rows = scoreSheet.getDataRange().getValues();
  let totalPoints = 0;
  const cleanEmail = (email || '').toString().trim().toLowerCase();
  const cleanNama = (nama || '').toString().trim().toLowerCase();

  for (let i = 1; i < rows.length; i++) {
    const rEmail = (rows[i][3] || '').toString().trim().toLowerCase();
    const rNama = (rows[i][4] || '').toString().trim().toLowerCase();
    if ((cleanEmail && rEmail === cleanEmail) || (cleanNama && rNama === cleanNama)) {
      totalPoints += (Number(rows[i][6]) || 0);
    }
  }
  return totalPoints;
}

// OVERRIDE submitLiveArenaScoreV45:
// Setiap selesai kuis mapel di Live Arena akan menambah POIN ARENA (Akumulatif)
// dan TIDAK LAGI memberikan XP ke LMS_Progress (XP murni hanya dari penyelesaian Modul/Bab LMS).
function submitLiveArenaScoreV45(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    const sheet = getOrCreateArenaScoresSheetV45(ss);
    const badgeSheet = getOrCreateArenaBadgeStoreSheetV48(ss);
    const waktuSkrg = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm:ss');

    const mapel = ((payload && payload.mapel) || 'Umum').toString().trim();
    const email = ((payload && payload.email) || '').toString().trim().toLowerCase();
    const nama = ((payload && payload.nama) || 'Siswa').toString().trim();
    const kelas = ((payload && payload.kelas) || '7A').toString().trim().toUpperCase();
    const poinSesi = Math.max(0, Number(payload && payload.coins) || 0);
    const benar = Number(payload && payload.benar) || 0;
    const totalSoal = Number(payload && payload.totalSoal) || 1;
    const streak = Number(payload && payload.streak) || 0;
    const pin = ((payload && payload.roomPin) || '-').toString().trim();
    const modeAkses = ((payload && payload.accessMode) || 'MULTI').toString().trim();

    const data = sheet.getDataRange().getValues();
    let foundRow = -1;
    for (let i = 1; i < data.length; i++) {
      const rMapel = (data[i][2] || '').toString().trim().toLowerCase();
      const rNama = (data[i][4] || '').toString().trim().toLowerCase();
      if (rMapel === mapel.toLowerCase() && rNama === nama.toLowerCase()) {
        foundRow = i + 1;
        break;
      }
    }

    if (foundRow !== -1) {
      const prevPoints = Number(data[foundRow - 1][6]) || 0;
      const prevStreak = Number(data[foundRow - 1][9]) || 0;
      const updatedPoints = prevPoints + poinSesi;
      const updatedStreak = Math.max(prevStreak, streak);
      const rowData = [waktuSkrg, pin, mapel, email, nama, kelas, updatedPoints, benar, totalSoal, updatedStreak, modeAkses];
      sheet.getRange(foundRow, 1, 1, 11).setValues([rowData]);
    } else {
      const rowData = [waktuSkrg, pin, mapel, email, nama, kelas, poinSesi, benar, totalSoal, streak, modeAkses];
      sheet.appendRow(rowData);
    }

    const totalEarned = calculateTotalArenaPointsForStudentV48(ss, email, nama);
    const bData = badgeSheet.getDataRange().getValues();
    let bRow = -1;
    let spentPoints = 0;
    let ownedJson = '[]';
    let equippedId = '';

    for (let j = 1; j < bData.length; j++) {
      const bEmail = (bData[j][0] || '').toString().trim().toLowerCase();
      const bNama = (bData[j][1] || '').toString().trim().toLowerCase();
      if ((email && bEmail === email) || (nama && bNama === nama.toLowerCase())) {
        bRow = j + 1;
        spentPoints = Number(bData[j][4]) || 0;
        ownedJson = bData[j][6] || '[]';
        equippedId = bData[j][7] || '';
        break;
      }
    }

    const availablePoints = Math.max(0, totalEarned - spentPoints);
    if (bRow !== -1) {
      badgeSheet.getRange(bRow, 1, 1, 9).setValues([[
        email || nama.toLowerCase(), nama, kelas, totalEarned, spentPoints, availablePoints, ownedJson, equippedId, waktuSkrg
      ]]);
    } else {
      badgeSheet.appendRow([
        email || nama.toLowerCase(), nama, kelas, totalEarned, 0, totalEarned, '[]', '', waktuSkrg
      ]);
    }

    SpreadsheetApp.flush();
    return {
      success: true,
      pointsAdded: poinSesi,
      totalEarnedPoints: totalEarned,
      availablePoints: availablePoints,
      message: `Kuis Live Arena selesai! Kamu meraih +${poinSesi} Poin Arena (Saldo Poin: ${availablePoints} Poin). Tukarkan di Toko Badge Avatar!`
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function getArenaBadgeStoreDataV48(emailSiswa, namaSiswa) {
  try {
    const ss = getTargetSpreadsheet();
    const badgeSheet = getOrCreateArenaBadgeStoreSheetV48(ss);
    const scoreSheet = getOrCreateArenaScoresSheetV45(ss);

    const earnedByName = {};
    if (scoreSheet && scoreSheet.getLastRow() > 1) {
      const sRows = scoreSheet.getDataRange().getValues();
      for (let i = 1; i < sRows.length; i++) {
        const nm = (sRows[i][4] || '').toString().trim();
        const pts = Number(sRows[i][6]) || 0;
        if (!nm) continue;
        const key = nm.toLowerCase();
        earnedByName[key] = (earnedByName[key] || 0) + pts;
      }
    }

    const badgeMapByName = {};
    if (badgeSheet && badgeSheet.getLastRow() > 1) {
      const bRows = badgeSheet.getDataRange().getDisplayValues();
      for (let j = 1; j < bRows.length; j++) {
        const em = (bRows[j][0] || '').trim().toLowerCase();
        const nm = (bRows[j][1] || '').trim();
        const kls = (bRows[j][2] || '7').trim();
        const spent = Number(bRows[j][4]) || 0;
        let owned = [];
        try { owned = JSON.parse(bRows[j][6] || '[]'); } catch (e) { owned = []; }
        const equipped = (bRows[j][7] || '').trim();
        if (!nm) continue;
        const key = nm.toLowerCase();
        const totalEarned = Math.max(Number(bRows[j][3]) || 0, earnedByName[key] || 0);
        const saldo = Math.max(0, totalEarned - spent);
        badgeMapByName[key] = {
          email: em,
          nama: nm,
          kelas: kls,
          totalEarned: totalEarned,
          spentPoints: spent,
          availablePoints: saldo,
          ownedBadges: Array.isArray(owned) ? owned : [],
          equippedBadge: equipped
        };
      }
    }

    Object.keys(earnedByName).forEach(k => {
      if (!badgeMapByName[k]) {
        badgeMapByName[k] = {
          email: '',
          nama: k,
          kelas: '7',
          totalEarned: earnedByName[k],
          spentPoints: 0,
          availablePoints: earnedByName[k],
          ownedBadges: [],
          equippedBadge: ''
        };
      }
    });

    const cleanNama = (namaSiswa || '').toString().trim().toLowerCase();
    const myData = badgeMapByName[cleanNama] || {
      email: (emailSiswa || '').toString().trim().toLowerCase(),
      nama: namaSiswa || 'Siswa',
      kelas: '7',
      totalEarned: earnedByName[cleanNama] || 0,
      spentPoints: 0,
      availablePoints: earnedByName[cleanNama] || 0,
      ownedBadges: [],
      equippedBadge: ''
    };

    return {
      success: true,
      myBadgeData: myData,
      allStudentsBadges: badgeMapByName
    };
  } catch (e) {
    return { success: false, message: e.toString(), myBadgeData: null, allStudentsBadges: {} };
  }
}

function redeemOrEquipArenaAvatarBadgeV48(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    const badgeSheet = getOrCreateArenaBadgeStoreSheetV48(ss);
    const waktuSkrg = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm:ss');

    const email = ((payload && payload.email) || '').toString().trim().toLowerCase();
    const nama = ((payload && payload.nama) || 'Siswa').toString().trim();
    const kelas = ((payload && payload.kelas) || '7A').toString().trim().toUpperCase();
    const badgeId = ((payload && payload.badgeId) || '').toString().trim();
    const badgePrice = Math.max(0, Number(payload && payload.badgePrice) || 0);
    const actionType = ((payload && payload.actionType) || 'REDEEM').toString().trim().toUpperCase();

    const totalEarned = calculateTotalArenaPointsForStudentV48(ss, email, nama);
    const data = badgeSheet.getDataRange().getValues();
    let foundRow = -1;
    let spentPoints = 0;
    let ownedBadges = [];
    let equippedBadge = '';

    for (let i = 1; i < data.length; i++) {
      const rEmail = (data[i][0] || '').toString().trim().toLowerCase();
      const rNama = (data[i][1] || '').toString().trim().toLowerCase();
      if ((email && rEmail === email) || (nama && rNama === nama.toLowerCase())) {
        foundRow = i + 1;
        spentPoints = Number(data[i][4]) || 0;
        try { ownedBadges = JSON.parse(data[i][6] || '[]'); } catch (e) { ownedBadges = []; }
        if (!Array.isArray(ownedBadges)) ownedBadges = [];
        equippedBadge = (data[i][7] || '').toString().trim();
        break;
      }
    }

    let availablePoints = Math.max(0, totalEarned - spentPoints);

    if (actionType === 'REDEEM') {
      if (!ownedBadges.includes(badgeId)) {
        if (availablePoints < badgePrice) {
          return {
            success: false,
            message: `Poin Arena kamu belum cukup! Harga badge ini ${badgePrice} Poin, sedangkan saldo poinmu saat ini ${availablePoints} Poin. Ayo selesaikan kuis di Live Arena!`
          };
        }
        spentPoints += badgePrice;
        availablePoints = Math.max(0, totalEarned - spentPoints);
        ownedBadges.push(badgeId);
      }
      equippedBadge = badgeId;
    } else if (actionType === 'EQUIP') {
      if (!ownedBadges.includes(badgeId)) {
        return { success: false, message: 'Kamu belum memiliki badge ini. Tukarkan dengan Poin Arena terlebih dahulu!' };
      }
      equippedBadge = badgeId;
    } else if (actionType === 'UNEQUIP') {
      equippedBadge = '';
    }

    const rowValues = [
      email || nama.toLowerCase(),
      nama,
      kelas,
      totalEarned,
      spentPoints,
      availablePoints,
      JSON.stringify(ownedBadges),
      equippedBadge,
      waktuSkrg
    ];

    if (foundRow !== -1) {
      badgeSheet.getRange(foundRow, 1, 1, 9).setValues([rowValues]);
    } else {
      badgeSheet.appendRow(rowValues);
    }

    SpreadsheetApp.flush();
    return {
      success: true,
      myBadgeData: {
        email: email,
        nama: nama,
        kelas: kelas,
        totalEarned: totalEarned,
        spentPoints: spentPoints,
        availablePoints: availablePoints,
        ownedBadges: ownedBadges,
        equippedBadge: equippedBadge
      },
      message: actionType === 'REDEEM'
        ? 'Selamat! Bingkai Badge Avatar berhasil ditukarkan dan langsung terpasang secara universal di profilmu!'
        : (actionType === 'EQUIP' ? 'Bingkai Badge Avatar berhasil dipasang ke profilmu!' : 'Bingkai Badge Avatar dilepas.')
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}


// =====================================================================
// 26. SERVER BANK SOAL QUIZ DINAMIS KELAS 7 (GROQ_BANKSOAL_QUIZ_API_KEY_K7)
//     & UPDATE KATA SANDI MANDIRI SISWA (TERINTEGRASI PENUH)
// =====================================================================

function updateStudentPasswordClient(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    const sheet = ss.getSheetByName('Users');
    if (!sheet) return { success: false, message: 'Sheet Users tidak ditemukan.' };

    const email = ((payload && payload.email) || '').toString().trim().toLowerCase();
    const newPass = ((payload && payload.newPass) || '').toString().trim();
    if (!email || !newPass) return { success: false, message: 'Email dan kata sandi baru wajib diisi.' };

    const data = sheet.getDataRange().getDisplayValues();
    for (let i = 1; i < data.length; i++) {
      if ((data[i][1] || '').toString().trim().toLowerCase() === email) {
        sheet.getRange(i + 1, 3).setValue(isPasswordHashedV92(newPass) ? newPass : hashPasswordSaltedV92(newPass));
        SpreadsheetApp.flush();
        clearUsersCacheV95();
        return { success: true, message: 'Kata sandi akun Kelas 7 berhasil diperbarui!' };
      }
    }
    return { success: false, message: 'Akun siswa tidak ditemukan di database Users.' };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateArenaBankSoalSheetV50(ss) {
  let sheet = ss.getSheetByName('LMS_Arena_BankSoal');
  if (!sheet) {
    sheet = ss.insertSheet('LMS_Arena_BankSoal');
    sheet.appendRow([
      'ID_Paket', 'Mata_Pelajaran', 'Nama_Paket', 'Jenjang_Fokus',
      'Status_Rilis', 'Urutan_Rotasi', 'Soal_JSON', 'Perfect_Clear_Count',
      'Pembuat', 'Waktu_Update'
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange("A1:J1").setFontWeight("bold").setBackground("#d1fae5");
  }
  return sheet;
}

function normalizeToExact10ArenaQuestionsV50(questionsArr, mapelName) {
  const cleanMapel = (mapelName || 'IPA').toString().trim();
  const tiers = ['MUDAH', 'MUDAH', 'MUDAH', 'MENENGAH', 'MENENGAH', 'MENENGAH', 'SULIT', 'SULIT', 'HOTS', 'HOTS'];
  const valid = Array.isArray(questionsArr)
    ? questionsArr.filter(q => q && !q.__isArenaMetaV46 && q.soal && q.soal.toString().trim() !== '')
    : [];

  const result = [];
  for (let i = 0; i < 10; i++) {
    const src = valid[i] || valid[i % Math.max(1, valid.length)] || {
      soal: `Pertanyaan Tantangan #${i + 1} (${cleanMapel} Kelas 7)`,
      a: 'Pilihan A', b: 'Pilihan B', c: 'Pilihan C', d: 'Pilihan D',
      kunci: 'A', pembahasan: `Pembahasan konsep ${cleanMapel} Kelas 7.`
    };
    const tier = (src.jenjang || tiers[i]).toString().trim().toUpperCase();
    const baseCoins = tier === 'MUDAH' ? 100 : (tier === 'MENENGAH' ? 125 : (tier === 'SULIT' ? 150 : 200));
    result.push({
      id: src.id || (`Q7-${i + 1}-${Date.now()}`),
      no: i + 1,
      jenjang: tier,
      kategori: src.kategori || (`Jenjang ${tier}`),
      poinKoin: Number(src.poinKoin) || baseCoins,
      soal: src.soal,
      a: src.a || src.A || 'Opsi A',
      b: src.b || src.B || 'Opsi B',
      c: src.c || src.C || 'Opsi C',
      d: src.d || src.D || 'Opsi D',
      kunci: ((src.kunci || 'A').toString().trim().toUpperCase().charAt(0)) || 'A',
      pembahasan: src.pembahasan || '',
      imageUrl: src.imageUrl || ''
    });
  }
  return result;
}

function getDynamicArenaQuestionBankServerV50(mapelName) {
  try {
    const ss = getTargetSpreadsheet();
    const sheet = getOrCreateArenaBankSoalSheetV50(ss);
    const cleanMapel = (mapelName || '').toString().trim().toLowerCase();
    const rows = sheet.getDataRange().getDisplayValues();
    const packs = [];

    for (let i = 1; i < rows.length; i++) {
      const mp = (rows[i][1] || '').toString().trim();
      if (cleanMapel && mp.toLowerCase() !== cleanMapel) continue;
      let qs = [];
      try { qs = JSON.parse(rows[i][6] || '[]'); } catch (e) { qs = []; }
      packs.push({
        idPaket: rows[i][0],
        mapel: mp,
        namaPaket: rows[i][2] || ('Paket Soal ' + i),
        jenjangFokus: rows[i][3] || 'BERJENJANG_OTOMATIS',
        statusRilis: (rows[i][4] || 'SIAP').toString().trim().toUpperCase(),
        urutanRotasi: Number(rows[i][5]) || i,
        questions: Array.isArray(qs) ? qs : [],
        perfectClearCount: Number(rows[i][7]) || 0,
        pembuat: rows[i][8] || 'Guru Kelas 7',
        waktuUpdate: rows[i][9] || ''
      });
    }
    return { success: true, packs: packs };
  } catch (e) {
    return { success: false, packs: [], message: e.toString() };
  }
}

function saveArenaQuestionPackServerV50(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    const sheet = getOrCreateArenaBankSoalSheetV50(ss);
    const idPaket = ((payload && payload.idPaket) || ('PKT-' + Date.now())).toString().trim();
    const mapel = ((payload && payload.mapel) || 'IPA').toString().trim();
    const namaPaket = ((payload && payload.namaPaket) || ('Paket Arena ' + mapel)).toString().trim();
    const jenjang = ((payload && payload.jenjangFokus) || 'BERJENJANG_OTOMATIS').toString().trim();
    const statusRilis = ((payload && payload.statusRilis) || 'AKTIF').toString().trim().toUpperCase();
    const urutan = Number(payload && payload.urutanRotasi) || 1;
    const perfectCount = Number(payload && payload.perfectClearCount) || 0;
    const pembuat = ((payload && payload.pembuat) || 'Guru Kelas 7').toString().trim();
    const waktu = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm');
    const exact10 = normalizeToExact10ArenaQuestionsV50((payload && payload.questions) || [], mapel);

    const data = sheet.getDataRange().getValues();
    let foundRow = -1;
    for (let i = 1; i < data.length; i++) {
      if (statusRilis === 'AKTIF' && (data[i][1] || '').toString().trim().toLowerCase() === mapel.toLowerCase()) {
        sheet.getRange(i + 1, 5).setValue('SIAP');
      }
      if ((data[i][0] || '').toString().trim() === idPaket) {
        foundRow = i + 1;
      }
    }

    const rowValues = [idPaket, mapel, namaPaket, jenjang, statusRilis, urutan, JSON.stringify(exact10), perfectCount, pembuat, waktu];
    if (foundRow !== -1) {
      sheet.getRange(foundRow, 1, 1, 10).setValues([rowValues]);
    } else {
      sheet.appendRow(rowValues);
    }
    SpreadsheetApp.flush();
    return { success: true, idPaket: idPaket, questions: exact10, message: 'Paket soal berhasil disimpan ke Server Bank Soal Kelas 7!' };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function deleteArenaQuestionPackServerV50(idPaket) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    const sheet = getOrCreateArenaBankSoalSheetV50(ss);
    const data = sheet.getDataRange().getDisplayValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === idPaket) {
        sheet.deleteRow(i + 1);
        SpreadsheetApp.flush();
        return { success: true, message: 'Paket soal dihapus.' };
      }
    }
    return { success: false, message: 'ID Paket tidak ditemukan.' };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

async function generateTieredArenaQuizGroqV50(payload) {
  try {
    const GROQ_API_KEY = getGroqApiKeyPropV90('GROQ_BANKSOAL_QUIZ_API_KEY_K7');
    if (!GROQ_API_KEY) return getMissingGroqKeyErrorV90('GROQ_BANKSOAL_QUIZ_API_KEY_K7');
    const mapel = ((payload && payload.mapel) || 'IPA').toString().trim();
    const topik = ((payload && payload.topik) || ('Materi Inti ' + mapel + ' Kelas 7')).toString().trim();
    const keunikan = ((payload && payload.keunikan) || ('Sesi-' + Date.now())).toString().trim();

    const sysPrompt = `Anda adalah Penyusun Bank Soal Kuis Turnamen Interaktif SMP Kelas 7 untuk mata pelajaran "${mapel}".
Topik: "${topik}" (${keunikan}).
Susun tepat 10 soal pilihan ganda (A, B, C, D) berjenjang:
- Nomor 1-3: Jenjang "MUDAH" (Konsep Dasar Kelas 7)
- Nomor 4-6: Jenjang "MENENGAH" (Aplikasi & Studi Kasus Sehari-hari Kelas 7)
- Nomor 7-8: Jenjang "SULIT" (Analisis Sebab-Akibat / Data)
- Nomor 9-10: Jenjang "HOTS" (Penalaran Kritis Tingkat Tinggi Kelas 7)

Wajib keluarkan JSON murni:
{
  "questions": [
    {
      "jenjang": "MUDAH",
      "kategori": "Konsep Dasar",
      "poinKoin": 100,
      "soal": "Pertanyaan...",
      "a": "Opsi A",
      "b": "Opsi B",
      "c": "Opsi C",
      "d": "Opsi D",
      "kunci": "A",
      "pembahasan": "Penjelasan singkat..."
    }
  ]
}`;

    const modelsToTry = ["openai/gpt-oss-120b", "openai/oss120b", "llama-3.3-70b-versatile"];
    let aiText = "";
    let lastErr = "";

    for (let m = 0; m < modelsToTry.length; m++) {
      let resp = await fetchGroqChatWithAutoFailoverV96("https://api.groq.com/openai/v1/chat/completions", {
        method: "post",
        headers: {
          "Authorization": "Bearer " + GROQ_API_KEY,
          "Content-Type": "application/json"
        },
        payload: JSON.stringify({
          model: modelsToTry[m],
          messages: [
            { role: "system", content: sysPrompt },
            { role: "user", content: "Keluarkan 10 soal berjenjang Kelas 7 dalam JSON sekarang." }
          ],
          temperature: 0.5,
          max_tokens: 3500,
          response_format: { type: "json_object" }
        }),
        muteHttpExceptions: true
      });
      let resJson = JSON.parse(resp.getContentText());
      if (resp.getResponseCode() === 200 && resJson.choices && resJson.choices.length > 0) {
        aiText = resJson.choices[0].message.content;
        break;
      } else {
        lastErr = resJson.error ? resJson.error.message : ("HTTP " + resp.getResponseCode());
      }
    }

    if (!aiText) throw new Error(lastErr || "Gagal memanggil API Groq BankSoal Quiz Kelas 7.");
    let cleanJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    let matchObj = cleanJson.match(/\{[\s\S]*\}/);
    if (matchObj) cleanJson = matchObj[0];
    let parsed = JSON.parse(cleanJson);
    const exact10 = normalizeToExact10ArenaQuestionsV50(parsed.questions || [], mapel);
    return { success: true, questions: exact10, message: "10 Soal Berjenjang Kelas 7 berhasil dirakit oleh AI!" };
  } catch (e) {
    return { success: false, message: e.toString(), questions: [] };
  }
}

async function rotateOrRegenerateArenaQuestionsOnPerfectScoreV50(payload) {
  const mapel = ((payload && payload.mapel) || 'IPA').toString().trim();
  const genRes = await generateTieredArenaQuizGroqV50({
    mapel: mapel,
    topik: 'Tantangan Dinamis ' + mapel + ' Kelas 7',
    keunikan: 'Rotasi-' + Date.now()
  });
  if (genRes && genRes.success && Array.isArray(genRes.questions) && genRes.questions.length > 0) {
    const newPackName = `Paket Dinamis AI (${Utilities.formatDate(new Date(), 'Asia/Jakarta', 'HH:mm')})`;
    saveArenaQuestionPackServerV50({
      idPaket: 'PKT-AI-' + Date.now(),
      mapel: mapel,
      namaPaket: newPackName,
      jenjangFokus: 'BERJENJANG_OTOMATIS',
      statusRilis: 'AKTIF',
      questions: genRes.questions,
      pembuat: 'AI Auto-Rotate Kelas 7'
    });
    return {
      success: true,
      rotated: true,
      newPackName: newPackName,
      questions: genRes.questions,
      message: `Paket soal baru "${newPackName}" untuk ${mapel} Kelas 7 telah diaktifkan!`
    };
  }
  return { success: false, rotated: false, message: genRes ? genRes.message : 'Gagal merotasi soal.' };
}

function getLiveArenaDiscussionsV50(mapelName) {
  try {
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('LMS_Arena_Diskusi');
    if (!sheet) return { success: true, posts: [] };
    const cleanMapel = (mapelName || '').toString().trim().toLowerCase();
    const rows = sheet.getDataRange().getDisplayValues();
    const posts = [];
    for (let i = 1; i < rows.length; i++) {
      if (cleanMapel && (rows[i][1] || '').toLowerCase() !== cleanMapel) continue;
      let reactions = { '🔥': 0, '💡': 0, '👏': 0, '❤️': 0 };
      let replies = [];
      try { reactions = JSON.parse(rows[i][6] || '{}'); } catch (e) {}
      try { replies = JSON.parse(rows[i][7] || '[]'); } catch (e) {}
      posts.push({
        idPesan: rows[i][0],
        mapel: rows[i][1],
        nama: rows[i][2],
        kelas: rows[i][3],
        kategoriPositif: rows[i][4],
        isi: rows[i][5],
        reactions: reactions,
        replies: replies,
        waktu: rows[i][8] || '',
        badgeId: rows[i][9] || ''
      });
    }
    return { success: true, posts: posts.reverse() };
  } catch (e) {
    return { success: false, posts: [], message: e.toString() };
  }
}

function submitLiveArenaPositivePostV50(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('LMS_Arena_Diskusi');
    if (!sheet) {
      sheet = ss.insertSheet('LMS_Arena_Diskusi');
      sheet.appendRow(['ID_Pesan', 'Mapel', 'Nama', 'Kelas', 'Kategori', 'Isi', 'Reactions_JSON', 'Replies_JSON', 'Waktu', 'Badge_ID']);
      sheet.setFrozenRows(1);
    }
    const post = {
      idPesan: 'ADISC-' + Date.now(),
      mapel: (payload && payload.mapel) || 'IPA',
      nama: (payload && payload.nama) || 'Siswa Kelas 7',
      kelas: (payload && payload.kelas) || '7A',
      kategoriPositif: (payload && payload.kategoriPositif) || '💡 Berbagi Tips Konsep',
      isi: (payload && payload.isi) || '',
      reactions: { '🔥': 1, '💡': 0, '👏': 0, '❤️': 0 },
      replies: [],
      waktu: Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm'),
      badgeId: (payload && payload.badgeId) || ''
    };
    sheet.appendRow([
      post.idPesan, post.mapel, post.nama, post.kelas, post.kategoriPositif,
      post.isi, JSON.stringify(post.reactions), JSON.stringify(post.replies), post.waktu, post.badgeId
    ]);
    SpreadsheetApp.flush();
    return { success: true, post: post };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function reactOrReplyArenaDiscussionV50(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('LMS_Arena_Diskusi');
    if (!sheet) return { success: false };
    const idPesan = (payload && payload.idPesan) || '';
    const rows = sheet.getDataRange().getDisplayValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === idPesan) {
        if (payload.actionType === 'REACT') {
          let reactions = {};
          try { reactions = JSON.parse(rows[i][6] || '{}'); } catch (e) {}
          const k = payload.reactionKey || '🔥';
          reactions[k] = (Number(reactions[k]) || 0) + 1;
          sheet.getRange(i + 1, 7).setValue(JSON.stringify(reactions));
        } else if (payload.actionType === 'REPLY') {
          let replies = [];
          try { replies = JSON.parse(rows[i][7] || '[]'); } catch (e) {}
          replies.push({
            idReply: 'AREP-' + Date.now(),
            nama: payload.nama || 'Siswa Kelas 7',
            kelas: payload.kelas || '7A',
            isi: payload.replyText || '',
            waktu: Utilities.formatDate(new Date(), 'Asia/Jakarta', 'HH:mm'),
            badgeId: payload.badgeId || ''
          });
          sheet.getRange(i + 1, 8).setValue(JSON.stringify(replies));
        }
        SpreadsheetApp.flush();
        return { success: true };
      }
    }
    return { success: false };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// =====================================================================
// 27. PEMBARUAN V69: DUAL MODE UJIAN (PTS & PAS) DI SHEET PENGATURAN
// =====================================================================

function getExamModeConfigServerV69() {
  try {
    try {
      const cachedMode = CacheService.getScriptCache().get('v97_exam_mode_cfg');
      if (cachedMode) return JSON.parse(cachedMode);
    } catch (ce) {}

    ensureSystemInitialized();
    const ss = getTargetSpreadsheet();
    const sheet = ss.getSheetByName('Pengaturan');
    let mode = 'PTS';
    let updatedBy = 'Sistem';
    let updatedAt = '-';

    if (sheet && sheet.getLastRow() > 1) {
      const data = sheet.getDataRange().getDisplayValues();
      for (let i = 1; i < data.length; i++) {
        const key = (data[i][0] || '').toString().trim().toLowerCase();
        const val = (data[i][1] || '').toString().trim();
        if (key === 'mode ujian aktif' && (val.toUpperCase() === 'PTS' || val.toUpperCase() === 'PAS')) {
          mode = val.toUpperCase();
        }
        if (key === 'mode ujian updatedby' && val) updatedBy = val;
        if (key === 'mode ujian updatedat' && val) updatedAt = val;
      }
    }
    const out = { success: true, mode: mode, updatedBy: updatedBy, updatedAt: updatedAt };
    try { CacheService.getScriptCache().put('v97_exam_mode_cfg', JSON.stringify(out), 30); } catch (ce2) {}
    return out;
  } catch (e) {
    return { success: false, mode: 'PTS', updatedBy: 'Sistem', updatedAt: '-', message: e.toString() };
  }
}

async function saveExamModeConfigServerV69(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    ensureSystemInitialized();
    const ss = getTargetSpreadsheet();
    let sheet = ss.getSheetByName('Pengaturan');
    if (!sheet) return { success: false, message: 'Sheet Pengaturan tidak ditemukan.' };

    const targetMode = ((payload && payload.mode) || 'PTS').toString().trim().toUpperCase();
    if (targetMode !== 'PTS' && targetMode !== 'PAS') {
      return { success: false, message: 'Mode ujian tidak valid. Pilih PTS atau PAS.' };
    }

    const updatedBy = ((payload && payload.updatedBy) || 'Guru / Admin').toString().trim();
    const updatedAt = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm:ss');

    const upsertSettingRow = (labelKey, newVal) => {
      const rows = sheet.getDataRange().getDisplayValues();
      for (let i = 1; i < rows.length; i++) {
        if ((rows[i][0] || '').toString().trim().toLowerCase() === labelKey.toLowerCase()) {
          sheet.getRange(i + 1, 2).setValue(newVal);
          return;
        }
      }
      sheet.appendRow([labelKey, newVal]);
    };

    upsertSettingRow('Mode Ujian Aktif', targetMode);
    upsertSettingRow('Mode Ujian UpdatedBy', updatedBy);
    upsertSettingRow('Mode Ujian UpdatedAt', updatedAt);
    SpreadsheetApp.flush();
    clearSicibinagaFastCacheV88();
    try { await syncRuntimeConfigToSupabaseV94({ active_exam_mode: targetMode }); } catch (syncErr1) {}

    return {
      success: true,
      mode: targetMode,
      updatedBy: updatedBy,
      updatedAt: updatedAt,
      message: 'Mode Ujian Aktif berhasil diubah ke ' + targetMode + ' dan disimpan permanen di server!'
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// =====================================================================
// 28. PEMBARUAN V78: UPLOAD & MANAJEMEN GAMBAR MANUAL PER BAGIAN MATERI
//     (LANGKAH 2 LMS — AKSES LANGSUNG MODE GURU / ADMIN)
// =====================================================================

function normalizeSubMateriImagesInKontenV78(kontenObj) {
  if (!kontenObj || !kontenObj.eksplorasi || !Array.isArray(kontenObj.eksplorasi.sub_materi)) return;
  kontenObj.eksplorasi.sub_materi.forEach(sm => {
    if (!sm) return;
    if (sm.gambar_sub) sm.gambar_sub = formatDriveUrl(sm.gambar_sub);
    if (Array.isArray(sm.galeri_gambar)) {
      sm.galeri_gambar = sm.galeri_gambar
        .filter(g => g && (g.url || typeof g === 'string'))
        .map(g => {
          if (typeof g === 'string') {
            return { url: formatDriveUrl(g), caption: 'Ilustrasi Materi', uploadedAt: '' };
          }
          return {
            url: formatDriveUrl(g.url || ''),
            caption: g.caption || 'Ilustrasi Materi',
            uploadedAt: g.uploadedAt || '',
            uploadedBy: g.uploadedBy || ''
          };
        });
    } else if (sm.gambar_sub) {
      sm.galeri_gambar = [{ url: sm.gambar_sub, caption: sm.caption_gambar || 'Ilustrasi Materi', uploadedAt: '' }];
    }
  });
}

async function saveSubMateriImageAdminV78(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    ensureSystemInitialized();
    const ss = getTargetSpreadsheet();
    const sheet = ss.getSheetByName('LMS_Materi');
    if (!sheet) return { success: false, message: 'Sheet LMS_Materi tidak ditemukan.' };

    let idModul = ((payload && payload.idModul) || '').toString().trim();
    const mapel = ((payload && payload.mapel) || '').toString().trim();
    const judulModul = ((payload && payload.judulModul) || 'Modul Pembelajaran').toString().trim();
    const subIdx = parseInt(payload && payload.subIdx, 10);
    const caption = ((payload && payload.caption) || 'Ilustrasi Bagian Materi').toString().trim();
    const uploadedBy = ((payload && payload.uploadedBy) || 'Guru / Admin').toString().trim();
    const replaceMode = !!(payload && payload.replaceMode);

    if (isNaN(subIdx) || subIdx < 0) {
      return { success: false, message: 'Indeks bagian materi tidak valid.' };
    }

    // 1. Proses sumber gambar (Upload Base64 ke Google Drive atau Link URL langsung)
    let finalUrl = ((payload && payload.imageUrl) || '').toString().trim();
    if (payload && payload.base64Data && payload.base64Data.indexOf(',') > -1) {
      const upRes = await uploadImageToDrive(payload.base64Data, payload.fileName || ('materi_sub_' + (subIdx + 1) + '_' + Date.now() + '.jpg'));
      if (!upRes || !upRes.success || !upRes.url) {
        return { success: false, message: 'Gagal mengunggah gambar ke Google Drive: ' + ((upRes && upRes.message) || 'Unknown error') };
      }
      finalUrl = upRes.url;
    } else if (finalUrl) {
      finalUrl = formatDriveUrl(finalUrl);
    }

    if (!finalUrl) {
      return { success: false, message: 'File gambar atau tautan URL gambar wajib diisi!' };
    }

    // 2. Temukan baris modul di LMS_Materi (atau buat otomatis jika modul masih DEFAULT)
    const data = sheet.getDataRange().getDisplayValues();
    let targetRow = -1;
    let kontenObj = {};

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === idModul || (idModul.startsWith('DEFAULT-') && data[i][1] === mapel && data[i][2] === judulModul)) {
        targetRow = i + 1;
        idModul = data[i][0];
        try { kontenObj = JSON.parse(data[i][4] || '{}'); } catch (e) { kontenObj = {}; }
        break;
      }
    }

    if (targetRow === -1) {
      // Modul bawaan/default belum tersimpan di sheet -> simpan dulu agar gambar permanen!
      const fb = (payload && payload.fallbackModule) || {};
      idModul = 'MOD-' + Date.now();
      kontenObj = (fb.konten && typeof fb.konten === 'object') ? fb.konten : { eksplorasi: { pengantar: '', sub_materi: [] } };
      const kuisArr = Array.isArray(fb.kuis) ? fb.kuis : [];
      const tanggal = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
      sheet.appendRow([
        idModul,
        mapel || fb.mapel || 'Umum',
        judulModul || fb.judul || 'Modul Pembelajaran',
        fb.tujuan || ('Memahami konsep ' + (mapel || 'pembelajaran')),
        JSON.stringify(kontenObj),
        JSON.stringify(kuisArr),
        uploadedBy,
        tanggal
      ]);
      targetRow = sheet.getLastRow();
    }

    if (!kontenObj.eksplorasi || typeof kontenObj.eksplorasi !== 'object') kontenObj.eksplorasi = {};
    if (!Array.isArray(kontenObj.eksplorasi.sub_materi)) kontenObj.eksplorasi.sub_materi = [];
    while (kontenObj.eksplorasi.sub_materi.length <= subIdx) {
      kontenObj.eksplorasi.sub_materi.push({
        judul_sub: 'Bagian Materi ' + (kontenObj.eksplorasi.sub_materi.length + 1),
        uraian: '',
        contoh_nyata: ''
      });
    }

    const sm = kontenObj.eksplorasi.sub_materi[subIdx];
    if (!Array.isArray(sm.galeri_gambar)) {
      sm.galeri_gambar = sm.gambar_sub ? [{ url: formatDriveUrl(sm.gambar_sub), caption: sm.caption_gambar || 'Ilustrasi Materi', uploadedAt: '' }] : [];
    }

    const newImgEntry = {
      url: finalUrl,
      caption: caption,
      uploadedAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      uploadedBy: uploadedBy
    };

    if (replaceMode) {
      sm.galeri_gambar = [newImgEntry];
    } else {
      sm.galeri_gambar.push(newImgEntry);
    }
    sm.gambar_sub = sm.galeri_gambar[0].url;
    sm.caption_gambar = sm.galeri_gambar[0].caption;

    sheet.getRange(targetRow, 5).setValue(JSON.stringify(kontenObj));
    SpreadsheetApp.flush();

    return {
      success: true,
      idModul: idModul,
      subIdx: subIdx,
      url: finalUrl,
      galeri: sm.galeri_gambar,
      message: 'Gambar materi Bagian ' + (subIdx + 1) + ' berhasil diunggah & langsung tampil!'
    };
  } catch (e) {
    return { success: false, message: 'Gagal menyimpan gambar materi: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function removeSubMateriImageAdminV78(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    const sheet = ss.getSheetByName('LMS_Materi');
    if (!sheet) return { success: false, message: 'Sheet LMS_Materi tidak ditemukan.' };

    const idModul = ((payload && payload.idModul) || '').toString().trim();
    const subIdx = parseInt(payload && payload.subIdx, 10);
    const imgIdx = parseInt(payload && payload.imgIdx, 10);

    const data = sheet.getDataRange().getDisplayValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === idModul) {
        let kontenObj = {};
        try { kontenObj = JSON.parse(data[i][4] || '{}'); } catch (e) { kontenObj = {}; }
        if (kontenObj.eksplorasi && Array.isArray(kontenObj.eksplorasi.sub_materi) && kontenObj.eksplorasi.sub_materi[subIdx]) {
          const sm = kontenObj.eksplorasi.sub_materi[subIdx];
          if (Array.isArray(sm.galeri_gambar) && imgIdx >= 0 && imgIdx < sm.galeri_gambar.length) {
            sm.galeri_gambar.splice(imgIdx, 1);
          }
          sm.gambar_sub = (Array.isArray(sm.galeri_gambar) && sm.galeri_gambar.length > 0) ? sm.galeri_gambar[0].url : '';
          sm.caption_gambar = (Array.isArray(sm.galeri_gambar) && sm.galeri_gambar.length > 0) ? sm.galeri_gambar[0].caption : '';
          sheet.getRange(i + 1, 5).setValue(JSON.stringify(kontenObj));
          SpreadsheetApp.flush();
          return {
            success: true,
            galeri: sm.galeri_gambar || [],
            message: 'Gambar berhasil dihapus dari Bagian ' + (subIdx + 1) + '.'
          };
        }
      }
    }
    return { success: false, message: 'Data modul atau bagian materi tidak ditemukan.' };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// =====================================================================
// 29. PEMBARUAN V88: DUAL ENVIRONMENT (LMS vs CBT vs ALL) + TURBO CACHE
// =====================================================================

function clearSicibinagaFastCacheV88() {
  try {
    CacheService.getScriptCache().removeAll([
      'v88_app_config_full',
      'v88_app_env_cfg',
      'v88_cbt_fast_subjects',
      'v92_exam_dur_min',
      'v93_exam_durations_map',
      'v95_token_map',
      'v97_exam_mode_cfg'
    ]);
    bumpQuestionsCacheVersionV95();
  } catch (e) {}
}

function getAppEnvironmentConfigV88() {
  try {
    const cache = CacheService.getScriptCache();
    const cached = cache.get('v88_app_env_cfg');
    if (cached) return JSON.parse(cached);

    ensureSystemInitialized();
    const ss = getTargetSpreadsheet();
    const sheet = ss.getSheetByName('Pengaturan');
    let activeEnvironment = 'ALL'; // 'LMS' | 'CBT' | 'ALL'
    let activeExamMode = 'PTS';    // 'PTS' | 'PAS'
    let updatedBy = 'Sistem';
    let updatedAt = '-';

    if (sheet && sheet.getLastRow() > 1) {
      const data = sheet.getDataRange().getDisplayValues();
      for (let i = 1; i < data.length; i++) {
        const key = (data[i][0] || '').toString().trim().toLowerCase();
        const val = (data[i][1] || '').toString().trim();
        if (key === 'environment aplikasi aktif' && ['LMS', 'CBT', 'ALL'].includes(val.toUpperCase())) {
          activeEnvironment = val.toUpperCase();
        }
        if (key === 'mode ujian aktif' && ['PTS', 'PAS'].includes(val.toUpperCase())) {
          activeExamMode = val.toUpperCase();
        }
        if (key === 'environment updatedby' && val) updatedBy = val;
        if (key === 'environment updatedat' && val) updatedAt = val;
      }
    }

    const res = {
      success: true,
      activeEnvironment: activeEnvironment,
      activeExamMode: activeExamMode,
      updatedBy: updatedBy,
      updatedAt: updatedAt
    };
    cache.put('v88_app_env_cfg', JSON.stringify(res), 25);
    return res;
  } catch (e) {
    return { success: false, activeEnvironment: 'ALL', activeExamMode: 'PTS', updatedBy: 'Sistem', updatedAt: '-', message: e.toString() };
  }
}

async function saveAppEnvironmentConfigV88(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    ensureSystemInitialized();
    const ss = getTargetSpreadsheet();
    const sheet = ss.getSheetByName('Pengaturan');
    if (!sheet) return { success: false, message: 'Sheet Pengaturan tidak ditemukan.' };

    const env = ((payload && payload.environment) || 'ALL').toString().trim().toUpperCase();
    if (!['LMS', 'CBT', 'ALL'].includes(env)) {
      return { success: false, message: 'Pilihan environment tidak valid (LMS / CBT / ALL).' };
    }
    const updatedBy = ((payload && payload.updatedBy) || 'Admin').toString().trim();
    const updatedAt = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm:ss');

    const upsertRow = (label, val) => {
      const rows = sheet.getDataRange().getDisplayValues();
      for (let i = 1; i < rows.length; i++) {
        if ((rows[i][0] || '').toString().trim().toLowerCase() === label.toLowerCase()) {
          sheet.getRange(i + 1, 2).setValue(val);
          return;
        }
      }
      sheet.appendRow([label, val]);
    };

    upsertRow('Environment Aplikasi Aktif', env);
    upsertRow('Environment UpdatedBy', updatedBy);
    upsertRow('Environment UpdatedAt', updatedAt);
    SpreadsheetApp.flush();
    clearSicibinagaFastCacheV88();
    try { await syncRuntimeConfigToSupabaseV94({ active_environment: env }); } catch (syncErr2) {}

    const envLabel = env === 'CBT' ? 'Environment Ujian (CBT)' : (env === 'LMS' ? 'Environment Belajar (LMS)' : 'Mode Terpadu (LMS + CBT)');
    return {
      success: true,
      activeEnvironment: env,
      updatedBy: updatedBy,
      updatedAt: updatedAt,
      message: 'Berhasil beralih ke ' + envLabel + ' & disiarkan real-time ke seluruh siswa!'
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// Jalur Turbo Khusus Environment Ujian (CBT): Tanpa parsing JSON modul LMS & QnA yang berat!
function getFastCBTBootstrapV88(emailSiswa) {
  try {
    const envCfg = getAppEnvironmentConfigV88();
    const cache = CacheService.getScriptCache();
    let subjectsList = null;

    const cachedSubs = cache.get('v88_cbt_fast_subjects');
    if (cachedSubs) {
      subjectsList = JSON.parse(cachedSubs);
    } else {
      const ss = getTargetSpreadsheet();
      const tokenSheet = ss.getSheetByName('Token');
      const tokenData = tokenSheet ? tokenSheet.getDataRange().getDisplayValues() : [];
      const tokenMap = {};
      for (let i = 1; i < tokenData.length; i++) {
        const m = (tokenData[i][0] || '').toString().trim();
        if (m) tokenMap[m] = (tokenData[i][1] || 'NONAKTIF').toString().trim().toUpperCase();
      }

      subjectsList = [];
      ss.getSheets().forEach(sh => {
        const sName = sh.getName();
        if (!isSystemSheetName(sName)) {
          const lastRow = Math.max(0, sh.getLastRow() - 1);
          subjectsList.push({
            name: sName,
            examStatus: tokenMap[sName] || 'NONAKTIF',
            totalModules: 0,
            completedModules: 0,
            totalSoalUjian: lastRow > 0 ? lastRow : 25,
            durasiUjian: getExamDurationForSubjectV93(sName),
            modules: []
          });
        }
      });
      cache.put('v88_cbt_fast_subjects', JSON.stringify(subjectsList), 20);
    }

    return {
      success: true,
      fastCBT: true,
      activeEnvironment: envCfg.activeEnvironment || 'CBT',
      activeExamMode: envCfg.activeExamMode || 'PTS',
      subjects: subjectsList,
      completedMap: {},
      history: [],
      qnaByModul: {},
      totalXP: 0,
      leaderboard: []
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// =====================================================================
// 30. PEMBARUAN V89: ARSIP MENYELURUH BANK SOAL PTS/PAS KE GOOGLE DRIVE
//     & PENCATATAN RIWAYAT ARSIP JANGKA PANJANG (MULTI-TAHUN)
// =====================================================================

const GDRIVE_ARCHIVE_ROOT_NAME_V89 = 'SICIBINAGA_Arsip_Bank_Soal_K7';

async function getOrCreateDriveFolderV89(parentFolder, folderName) {
  const cleanName = (folderName || 'Arsip').toString().trim();
  const iterator = parentFolder
    ? await parentFolder.getFoldersByName(cleanName)
    : await DriveApp.getFoldersByName(cleanName);
  if (iterator.hasNext()) return iterator.next();
  return parentFolder ? await parentFolder.createFolder(cleanName) : await DriveApp.createFolder(cleanName);
}

function getOrCreateArsipLogSheetV89(ss) {
  // Menggunakan prefiks LMS_ agar otomatis diabaikan oleh isSystemSheetName()
  let sheet = ss.getSheetByName('LMS_Arsip_BankSoal');
  if (!sheet) {
    sheet = ss.insertSheet('LMS_Arsip_BankSoal');
    sheet.appendRow([
      'ID_Arsip', 'Waktu_Arsip', 'Tahun_Ajaran', 'Semester', 'Mode_Ujian',
      'Jumlah_Mapel', 'Total_Soal', 'Link_Folder_GDrive', 'Link_Master_Sheet',
      'Pembuat', 'Catatan'
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange('A1:K1').setFontWeight('bold').setBackground('#d1fae5');
  }
  return sheet;
}

function csvEscapeV89(val) {
  const s = (val === null || val === undefined) ? '' : String(val);
  return '"' + s.replace(/"/g, '""') + '"';
}

function sanitizeSheetTitleV89(name) {
  return (name || 'Mapel').toString().replace(/[:\\\/\?\*\[\]]/g, '_').trim().substring(0, 95);
}

function collectAllBankSoalDataV89(selectedMapels) {
  const ss = getTargetSpreadsheet();
  const filterSet = (Array.isArray(selectedMapels) && selectedMapels.length > 0)
    ? new Set(selectedMapels.map(m => String(m).trim().toLowerCase()))
    : null;

  const collected = [];
  let grandTotalSoal = 0;

  ss.getSheets().forEach(sh => {
    const mapelName = sh.getName();
    if (isSystemSheetName(mapelName)) return;
    if (filterSet && !filterSet.has(mapelName.toLowerCase())) return;

    const rawValues = sh.getDataRange().getDisplayValues();
    const soalRows = [];
    for (let i = 1; i < rawValues.length; i++) {
      const row = rawValues[i].slice(0, 13);
      while (row.length < 13) row.push('');
      const teksSoal = (row[1] || '').toString().trim();
      const imgSoal = (row[7] || '').toString().trim();
      if (teksSoal === '' && imgSoal === '') continue;

      row[0] = soalRows.length + 1;
      row[7] = formatDriveUrl(row[7]);
      row[8] = formatDriveUrl(row[8]);
      row[9] = formatDriveUrl(row[9]);
      row[10] = formatDriveUrl(row[10]);
      row[11] = formatDriveUrl(row[11]);
      if (!row[12] || row[12].toString().trim() === '') row[12] = 'PG';
      soalRows.push(row);
    }

    grandTotalSoal += soalRows.length;
    collected.push({
      mapel: mapelName,
      totalSoal: soalRows.length,
      rows: soalRows
    });
  });

  return { subjects: collected, grandTotalSoal: grandTotalSoal };
}

async function archiveAllBankSoalToDriveV89(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(25000);
    ensureSystemInitialized();

    const modeUjian = ((payload && payload.modeUjian) || 'PTS').toString().trim().toUpperCase() === 'PAS' ? 'PAS' : 'PTS';
    const tahunAjaran = ((payload && payload.tahunAjaran) || '2026/2027').toString().trim();
    const semester = ((payload && payload.semester) || 'Ganjil').toString().trim();
    const catatan = ((payload && payload.catatan) || '-').toString().trim();
    const pembuat = ((payload && payload.pembuat) || 'Administrator').toString().trim();
    const selectedMapels = (payload && Array.isArray(payload.selectedMapels)) ? payload.selectedMapels : null;
    const clearAfterArchive = !!(payload && payload.clearAfterArchive);

    const snapshot = collectAllBankSoalDataV89(selectedMapels);
    if (!snapshot.subjects || snapshot.subjects.length === 0) {
      return { success: false, message: 'Tidak ada mata pelajaran bank soal yang ditemukan untuk diarsipkan.' };
    }

    const now = new Date();
    const stampFile = Utilities.formatDate(now, 'Asia/Jakarta', 'yyyy-MM-dd_HHmm');
    const waktuDisplay = Utilities.formatDate(now, 'Asia/Jakarta', 'dd/MM/yyyy HH:mm');
    const safeTP = 'TP_' + tahunAjaran.replace(/[\/\s]+/g, '-');
    const periodFolderName = `${modeUjian}_${semester}`;
    const sessionFolderName = `Arsip_${modeUjian}_${semester}_${stampFile}`;

    // 1. Bangun hierarki folder Google Drive jangka panjang
    const rootFolder = await getOrCreateDriveFolderV89(null, GDRIVE_ARCHIVE_ROOT_NAME_V89);
    const yearFolder = await getOrCreateDriveFolderV89(rootFolder, safeTP);
    const periodFolder = await getOrCreateDriveFolderV89(yearFolder, periodFolderName);
    const sessionFolder = await getOrCreateDriveFolderV89(periodFolder, sessionFolderName);
    const csvFolder = await getOrCreateDriveFolderV89(sessionFolder, 'CSV_Per_Mapel');
    const txtFolder = await getOrCreateDriveFolderV89(sessionFolder, 'Naskah_TXT_Per_Mapel');

    try {
      await rootFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      await sessionFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (shareErr) {}

    // 2. Buat Google Spreadsheet Master Arsip (Multi-Sheet seluruh mapel + Ringkasan)
    const masterTitle = `MASTER_ARSIP_BANK_SOAL_${modeUjian}_${semester}_${safeTP}_${stampFile}`;
    const masterSs = await SpreadsheetApp.create(masterTitle);
    const masterFile = await DriveApp.getFileById(masterSs.getId());
    try { await masterFile.moveTo(sessionFolder); } catch (mvErr) {}

    const summarySheet = masterSs.getSheets()[0];
    summarySheet.setName('RINGKASAN_ARSIP');
    summarySheet.getRange('A1:D6').setValues([
      ['ARSIP BANK SOAL SICIBINAGA KELAS 7', '', '', ''],
      ['Mode Ujian', modeUjian, 'Tahun Ajaran', tahunAjaran],
      ['Semester', semester, 'Waktu Arsip', waktuDisplay],
      ['Total Mata Pelajaran', snapshot.subjects.length, 'Total Butir Soal', snapshot.grandTotalSoal],
      ['Diarsipkan Oleh', pembuat, 'Catatan', catatan],
      ['', '', '', '']
    ]);
    summarySheet.getRange('A1:D1').merge().setFontWeight('bold').setFontSize(13).setBackground('#064e3b').setFontColor('#ffffff');
    summarySheet.getRange('A7:C7').setValues([['No', 'Mata Pelajaran', 'Jumlah Butir Soal']])
      .setFontWeight('bold').setBackground('#d1fae5');

    const headerRow = [
      'No', 'Soal', 'Opsi A', 'Opsi B', 'Opsi C', 'Opsi D', 'Kunci',
      'Gambar Soal', 'Gambar A', 'Gambar B', 'Gambar C', 'Gambar D', 'Tipe Soal'
    ];
    const summaryListRows = [];

    // 3. Tulis tiap mapel ke Master Sheet, CSV (siap impor ulang), dan Naskah TXT
    for (let idx = 0; idx < snapshot.subjects.length; idx++) {
      const subj = snapshot.subjects[idx];
      summaryListRows.push([idx + 1, subj.mapel, subj.totalSoal]);

      const tabSheet = masterSs.insertSheet(sanitizeSheetTitleV89(subj.mapel));
      const sheetMatrix = [headerRow].concat(subj.rows);
      tabSheet.getRange(1, 1, sheetMatrix.length, 13).setValues(sheetMatrix);
      tabSheet.getRange('A1:M1').setFontWeight('bold').setBackground('#d1fae5');
      tabSheet.setFrozenRows(1);

      let csvLines = ['No,Soal,Opsi A,Opsi B,Opsi C,Opsi D,Kunci,Gambar Soal,Gambar A,Gambar B,Gambar C,Gambar D,Tipe Soal'];
      let txtLines = [
        `ARSIP BANK SOAL ${modeUjian} (${semester} ${tahunAjaran})`,
        `MATA PELAJARAN : ${subj.mapel}`,
        `JUMLAH SOAL    : ${subj.totalSoal}`,
        `DIARSIPKAN     : ${waktuDisplay} oleh ${pembuat}`,
        '============================================================\r\n'
      ];

      subj.rows.forEach(r => {
        csvLines.push(r.map(csvEscapeV89).join(','));
        const cleanQ = (r[1] || '').toString().replace(/<[^>]*>?/gm, '');
        txtLines.push(
          `${r[0]}. ${cleanQ}\r\n` +
          `A. ${r[2] || ''}\r\nB. ${r[3] || ''}\r\nC. ${r[4] || ''}\r\nD. ${r[5] || ''}\r\n` +
          `Kunci: ${r[6] || 'A'} | Tipe: ${r[12] || 'PG'}\r\n`
        );
      });

      const safeFileBase = subj.mapel.replace(/[^a-zA-Z0-9_-]+/g, '_');
      await csvFolder.createFile(`${safeFileBase}_${modeUjian}_${safeTP}.csv`, '\uFEFF' + csvLines.join('\r\n'), MimeType.CSV);
      await txtFolder.createFile(`${safeFileBase}_${modeUjian}_${safeTP}.txt`, txtLines.join('\r\n'), MimeType.PLAIN_TEXT);
    }

    if (summaryListRows.length > 0) {
      summarySheet.getRange(8, 1, summaryListRows.length, 3).setValues(summaryListRows);
    }
    SpreadsheetApp.flush();

    // 4. Simpan INDEX_ARSIP.json untuk backup/restore utuh
    const jsonBackup = {
      app: 'SICIBINAGA Kelas 7',
      version: 'V89',
      modeUjian: modeUjian,
      tahunAjaran: tahunAjaran,
      semester: semester,
      waktuArsip: waktuDisplay,
      pembuat: pembuat,
      catatan: catatan,
      totalMapel: snapshot.subjects.length,
      totalSoal: snapshot.grandTotalSoal,
      bankSoal: snapshot.subjects
    };
    await sessionFolder.createFile('INDEX_ARSIP.json', JSON.stringify(jsonBackup, null, 2), MimeType.PLAIN_TEXT);

    // 5. Catat ke Sheet Log Riwayat Arsip Tahunan
    const ss = getTargetSpreadsheet();
    const logSheet = getOrCreateArsipLogSheetV89(ss);
    const idArsip = `ARSIP-${modeUjian}-${Date.now()}`;
    const folderUrl = sessionFolder.getUrl();
    const masterUrl = masterSs.getUrl();

    logSheet.appendRow([
      idArsip, waktuDisplay, tahunAjaran, semester, modeUjian,
      snapshot.subjects.length, snapshot.grandTotalSoal,
      folderUrl, masterUrl, pembuat, catatan
    ]);

    // 6. Opsional: Bersihkan butir soal setelah arsip berhasil (jika dicentang Admin)
    if (clearAfterArchive) {
      snapshot.subjects.forEach(subj => {
        const sh = ss.getSheetByName(subj.mapel);
        if (sh && sh.getLastRow() > 1) {
          sh.deleteRows(2, sh.getLastRow() - 1);
        }
      });
      if (typeof clearSicibinagaFastCacheV88 === 'function') clearSicibinagaFastCacheV88();
    }

    SpreadsheetApp.flush();

    return {
      success: true,
      idArsip: idArsip,
      modeUjian: modeUjian,
      tahunAjaran: tahunAjaran,
      semester: semester,
      totalMapel: snapshot.subjects.length,
      totalSoal: snapshot.grandTotalSoal,
      folderName: `${GDRIVE_ARCHIVE_ROOT_NAME_V89}/${safeTP}/${periodFolderName}/${sessionFolderName}`,
      folderUrl: folderUrl,
      masterSheetUrl: masterUrl,
      clearedAfterArchive: clearAfterArchive,
      message: `Berhasil mengarsipkan ${snapshot.subjects.length} mapel (${snapshot.grandTotalSoal} butir soal) ke Google Drive!`
    };
  } catch (e) {
    return { success: false, message: 'Gagal mengarsipkan ke Google Drive: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

async function getBankSoalArchiveHistoryV89() {
  try {
    const ss = getTargetSpreadsheet();
    const sheet = getOrCreateArsipLogSheetV89(ss);
    const rootFolder = await getOrCreateDriveFolderV89(null, GDRIVE_ARCHIVE_ROOT_NAME_V89);
    const rows = sheet.getDataRange().getDisplayValues();
    const list = [];

    for (let i = 1; i < rows.length; i++) {
      if (!rows[i][0]) continue;
      list.push({
        idArsip: rows[i][0],
        waktu: rows[i][1],
        tahunAjaran: rows[i][2],
        semester: rows[i][3],
        modeUjian: (rows[i][4] || 'PTS').toUpperCase(),
        jumlahMapel: Number(rows[i][5]) || 0,
        totalSoal: Number(rows[i][6]) || 0,
        folderUrl: rows[i][7] || '',
        masterUrl: rows[i][8] || '',
        pembuat: rows[i][9] || 'Admin',
        catatan: rows[i][10] || '-'
      });
    }

    return {
      success: true,
      rootFolderName: GDRIVE_ARCHIVE_ROOT_NAME_V89,
      rootFolderUrl: rootFolder.getUrl(),
      archives: list.reverse()
    };
  } catch (e) {
    return { success: false, archives: [], message: e.toString() };
  }
}

function getAllBankSoalSnapshotForExportV89() {
  try {
    const snapshot = collectAllBankSoalDataV89(null);
    return {
      success: true,
      subjects: snapshot.subjects,
      grandTotalSoal: snapshot.grandTotalSoal
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// =====================================================================
// 31. PEMBARUAN V91: SECURITY HARDENING TAHAP 1
//     - RATE LIMITING LOGIN (SISWA & ADMIN/GURU) VIA CACHESERVICE
//     - SERVER-SIDE ADMIN SESSION TOKEN (TTL 4 JAM)
//     - 2FA OTP ADMIN VIA EMAIL (MAILAPP, 6 DIGIT SHA-256, TTL 5 MENIT)
//     - SUPABASE SERVICE_ROLE SERVER PROXY (TARIK SEMUA JAWABAN & RESET SISWA)
// =====================================================================

const SUPABASE_DEFAULT_URL_V91 = 'https://xraqhfkrwwvlkvoulzuv.supabase.co';

function sha256HexV91(str) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(str || ''), Utilities.Charset.UTF_8);
  return digest.map(b => ('0' + ((b < 0 ? b + 256 : b)).toString(16)).slice(-2)).join('');
}

function maskEmailAddressV91(email) {
  const s = (email || '').toString().trim();
  const parts = s.split('@');
  if (parts.length !== 2) return '***';
  const name = parts[0];
  const dom = parts[1];
  const keep = name.length <= 2 ? name.charAt(0) : name.substring(0, 2);
  return keep + '••••@' + dom;
}

// --- A. RATE LIMITING LOGIN (ANTI BRUTE-FORCE) ---
function getRateLimitKeyV91(scope, rawId) {
  const norm = (rawId || 'anon').toString().trim().toLowerCase();
  return 'v91_rl_' + scope + '_' + sha256HexV91(norm).substring(0, 20);
}

function checkLoginRateLimitV91(scope, rawId) {
  try {
    const cache = CacheService.getScriptCache();
    const raw = cache.get(getRateLimitKeyV91(scope, rawId));
    if (!raw) return { allowed: true };
    const st = JSON.parse(raw);
    const now = Date.now();
    if (st.lockedUntil && now < st.lockedUntil) {
      const waitSec = Math.max(1, Math.ceil((st.lockedUntil - now) / 1000));
      const waitMin = Math.ceil(waitSec / 60);
      return {
        allowed: false,
        waitSec: waitSec,
        message: `Terlalu banyak percobaan login gagal. Akun dikunci sementara selama ±${waitMin} menit (${waitSec} detik) demi keamanan.`
      };
    }
    return { allowed: true };
  } catch (e) {
    return { allowed: true };
  }
}

function recordLoginFailureV91(scope, rawId, maxAttempts, lockSeconds) {
  const maxTry = maxAttempts || 5;
  const lockSec = lockSeconds || 300;
  try {
    const cache = CacheService.getScriptCache();
    const key = getRateLimitKeyV91(scope, rawId);
    const raw = cache.get(key);
    let st = raw ? JSON.parse(raw) : { count: 0, lockedUntil: 0 };
    st.count = (Number(st.count) || 0) + 1;
    if (st.count >= maxTry) {
      st.lockedUntil = Date.now() + (lockSec * 1000);
      cache.put(key, JSON.stringify(st), lockSec + 30);
      return {
        locked: true,
        remaining: 0,
        message: `Batas ${maxTry}x percobaan login gagal tercapai. Akses login dikunci otomatis selama ${Math.round(lockSec / 60)} menit.`
      };
    }
    cache.put(key, JSON.stringify(st), 600);
    return { locked: false, remaining: Math.max(1, maxTry - st.count) };
  } catch (e) {
    return { locked: false, remaining: 1 };
  }
}

function clearLoginRateLimitV91(scope, rawId) {
  try {
    CacheService.getScriptCache().remove(getRateLimitKeyV91(scope, rawId));
  } catch (e) {}
}

// --- B. SERVER-SIDE ADMIN SESSION TOKEN (TTL 4 JAM) ---
function issueAdminSessionTokenV91(staffObj) {
  const ttlSec = 14400; // 4 jam
  const sess = {
    role: (staffObj && staffObj.role) || 'ADMIN',
    name: (staffObj && staffObj.name) || 'Administrator',
    mapelAmpu: (staffObj && staffObj.mapelAmpu) || 'ALL',
    username: (staffObj && staffObj.username) || 'admin',
    issuedAt: Date.now(),
    expiresAt: Date.now() + (ttlSec * 1000)
  };
  const token = __signStatelessTokenV97('ADM91', sess);
  return { token: token, ttlSec: ttlSec, session: sess };
}

function validateAdminSessionTokenV91(token) {
  try {
    return __verifyStatelessTokenV97('ADM91', token);
  } catch (e) {
    return null;
  }
}

function revokeAdminSessionTokenV91(token) {
  try {
    const clean = (token || '').toString().trim();
    if (clean) CacheService.getScriptCache().remove('v91_admsess_' + clean);
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

// --- C. 2FA OTP ADMIN VIA EMAIL (MAILAPP) ---
function getAdmin2FAConfigInternalV91() {
  let enabled = false;
  let email = '';
  try {
    const props = getAllScriptPropsCachedV90();
    if (props['ADMIN_2FA_EMAIL']) email = props['ADMIN_2FA_EMAIL'].toString().trim();
    if ((props['ADMIN_2FA_ENABLED'] || '').toString().trim().toLowerCase() === 'true') enabled = true;

    const ss = getTargetSpreadsheet();
    const sheet = ss.getSheetByName('Pengaturan');
    if (sheet && sheet.getLastRow() > 1) {
      const rows = sheet.getDataRange().getDisplayValues();
      for (let i = 1; i < rows.length; i++) {
        const k = (rows[i][0] || '').toString().trim().toLowerCase();
        const v = (rows[i][1] || '').toString().trim();
        if (k === 'aktifkan 2fa otp admin') {
          enabled = (v.toUpperCase() === 'YA' || v.toUpperCase() === 'AKTIF' || v.toUpperCase() === 'TRUE');
        }
        if (k === 'email 2fa admin' && v && v.indexOf('@') > 0) {
          email = v;
        }
      }
    }

    if (!email) {
      try {
        const ownerEmail = Session.getEffectiveUser().getEmail();
        if (ownerEmail && ownerEmail.indexOf('@') > 0) email = ownerEmail;
      } catch (e2) {}
    }
  } catch (e) {}
  return { enabled: enabled, email: email };
}

async function startAdmin2FAChallengeV91(staffObj, targetEmail) {
  try {
    if (!targetEmail || targetEmail.indexOf('@') === -1) {
      return { success: false, message: 'Email 2FA Admin belum valid. Atur di Sheet Pengaturan baris "Email 2FA Admin".' };
    }
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const nonce = Utilities.getUuid().replace(/-/g, '').substring(0, 16);
    const waktuStr = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm:ss');

    const challengeData = {
      nonce: nonce,
      otpHash: sha256HexV91(nonce + ':' + otpCode),
      staff: staffObj,
      email: targetEmail,
      createdAt: Date.now(),
      expiresAt: Date.now() + 300000
    };
    const challengeId = __signStatelessTokenV97('OTP91', challengeData);

    const subject = `[SICIBINAGA 2FA] Kode Verifikasi Admin: ${otpCode}`;
    const htmlBody = `
      <div style="font-family:Arial,sans-serif; max-width:520px; margin:0 auto; border:1px solid #d1fae5; border-radius:16px; overflow:hidden;">
        <div style="background:#064e3b; color:#ffffff; padding:18px 22px;">
          <div style="font-size:11px; letter-spacing:1px; color:#a7f3d0; font-weight:bold;">VERIFIKASI 2FA PANEL ADMIN</div>
          <h2 style="margin:4px 0 0 0; font-size:20px;">SICIBINAGA Kelas 7</h2>
        </div>
        <div style="padding:22px; background:#ffffff; color:#0f172a;">
          <p style="margin:0 0 12px 0; font-size:14px;">Halo <b>${staffObj.name || 'Administrator'}</b>,</p>
          <p style="margin:0 0 16px 0; font-size:13.5px; color:#475569;">Gunakan kode OTP 6 digit berikut untuk menyelesaikan login ke Dashboard Admin:</p>
          <div style="background:#f0fdf4; border:2px dashed #10b981; border-radius:14px; padding:16px; text-align:center; font-size:32px; font-weight:900; letter-spacing:8px; color:#065f46;">
            ${otpCode}
          </div>
          <p style="margin:16px 0 0 0; font-size:12px; color:#64748b;">
            &bull; Berlaku selama <b>5 menit</b> (dikirim ${waktuStr} WIB).<br>
            &bull; Jangan bagikan kode ini kepada siapa pun. Jika bukan Anda yang mencoba login, segera ganti Password Admin di Sheet Pengaturan.
          </p>
        </div>
      </div>`;

    await MailApp.sendEmail({
      to: targetEmail,
      subject: subject,
      body: `Kode OTP 2FA Admin SICIBINAGA Anda: ${otpCode} (berlaku 5 menit, dikirim ${waktuStr} WIB). Jangan bagikan kepada siapa pun.`,
      htmlBody: htmlBody
    });

    return {
      success: true,
      challengeId: challengeId,
      maskedEmail: maskEmailAddressV91(targetEmail)
    };
  } catch (e) {
    return {
      success: false,
      message: 'Gagal mengirim email OTP 2FA (' + e.toString() + '). Pastikan izin MailApp sudah disetujui di Google Apps Script.'
    };
  }
}

function verifyAdminOtpV91(challengeId, otpInput) {
  try {
    const cleanId = (challengeId || '').toString().trim();
    const cleanOtp = (otpInput || '').toString().replace(/[^0-9]/g, '').trim();
    if (!cleanId || cleanOtp.length !== 6) {
      return { success: false, message: 'Masukkan 6 digit kode OTP yang valid.' };
    }

    const ch = __verifyStatelessTokenV97('OTP91', cleanId);
    if (!ch || !ch.nonce || !ch.otpHash) {
      return { success: false, expired: true, message: 'Kode OTP sudah kedaluwarsa (melewati 5 menit). Silakan login ulang.' };
    }

    const cache = CacheService.getScriptCache();
    const attKey = 'v91_otp_att_' + ch.nonce;
    const attempts = (Number(cache.get(attKey)) || 0) + 1;
    const expectedHash = sha256HexV91(ch.nonce + ':' + cleanOtp);

    if (expectedHash !== ch.otpHash) {
      if (attempts >= 5) {
        cache.remove(attKey);
        return { success: false, expired: true, message: 'Salah 5x. Kode OTP dibatalkan otomatis demi keamanan. Silakan login ulang.' };
      }
      cache.put(attKey, String(attempts), 300);
      return { success: false, message: `Kode OTP tidak cocok! (Sisa percobaan: ${5 - attempts}x)` };
    }

    cache.remove(attKey);
    const tokenObj = issueAdminSessionTokenV91(ch.staff);
    return {
      success: true,
      role: ch.staff.role,
      name: ch.staff.name,
      mapelAmpu: ch.staff.mapelAmpu,
      adminSessionToken: tokenObj.token,
      sessionExpiresInSec: tokenObj.ttlSec
    };
  } catch (e) {
    return { success: false, message: 'Gagal memverifikasi OTP: ' + e.toString() };
  }
}

async function resendAdminOtpV91(oldChallengeId) {
  try {
    const ch = __verifyStatelessTokenV97('OTP91', (oldChallengeId || '').toString().trim());
    if (!ch || !ch.staff || !ch.email) {
      return { success: false, message: 'Sesi OTP telah habis. Silakan login ulang dengan Username & Password.' };
    }
    return await startAdmin2FAChallengeV91(ch.staff, ch.email);
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

async function saveAdmin2FAConfigV91(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const sess = validateAdminSessionTokenV91(payload && payload.adminSessionToken);
    if (!sess || sess.role !== 'ADMIN') {
      return { success: false, message: 'Sesi Super Admin tidak valid atau telah kedaluwarsa. Silakan login ulang.' };
    }

    const enable2FA = !!(payload && payload.enabled);
    const email = ((payload && payload.email) || '').toString().trim();

    if (enable2FA && (!email || email.indexOf('@') === -1)) {
      return { success: false, message: 'Masukkan alamat Email Admin yang valid sebelum mengaktifkan 2FA OTP!' };
    }

    // Jika mengaktifkan 2FA, uji kirim email konfirmasi dulu agar tidak pernah terjadi lockout!
    if (enable2FA) {
      try {
        await MailApp.sendEmail({
          to: email,
          subject: '[SICIBINAGA] Aktivasi 2FA OTP Admin Berhasil',
          body: 'Selamat! Verifikasi 2FA OTP Email untuk Panel Admin SICIBINAGA Kelas 7 telah aktif. Setiap login Super Admin berikutnya akan mengirimkan kode 6 digit ke alamat email ini.'
        });
      } catch (mailErr) {
        return {
          success: false,
          message: 'Gagal mengirim email uji ke ' + email + ' (' + mailErr.toString() + '). 2FA belum diaktifkan agar akun Anda tidak terkunci.'
        };
      }
    }

    ensureSystemInitialized();
    const ss = getTargetSpreadsheet();
    const sheet = ss.getSheetByName('Pengaturan');
    const upsertSetting = (label, val) => {
      const rows = sheet.getDataRange().getDisplayValues();
      for (let i = 1; i < rows.length; i++) {
        if ((rows[i][0] || '').toString().trim().toLowerCase() === label.toLowerCase()) {
          sheet.getRange(i + 1, 2).setValue(val);
          return;
        }
      }
      sheet.appendRow([label, val]);
    };

    upsertSetting('Aktifkan 2FA OTP Admin', enable2FA ? 'YA' : 'TIDAK');
    if (email) upsertSetting('Email 2FA Admin', email);
    SpreadsheetApp.flush();

    return {
      success: true,
      enabled: enable2FA,
      email: email,
      maskedEmail: email ? maskEmailAddressV91(email) : '-',
      message: enable2FA
        ? '2FA OTP Admin AKTIF! Email uji konfirmasi telah dikirim ke ' + email + '.'
        : '2FA OTP Admin dinonaktifkan. Anda dapat mengaktifkannya kembali kapan saja.'
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// --- D. SUPABASE SERVICE_ROLE SERVER PROXY (UNTUK RLS KETAT) ---
function getSupabaseServerConfigV91() {
  __v90ScriptPropsCache = null;
  const props = getAllScriptPropsCachedV90();
  const url = sanitizeApiKeyValueV96(props['SUPABASE_URL'] || SUPABASE_DEFAULT_URL_V91).replace(/\/+$/, '');
  const serviceKey = sanitizeApiKeyValueV96(props['SUPABASE_SERVICE_ROLE_KEY'] || '');
  return {
    url: url,
    serviceKey: serviceKey,
    configured: serviceKey.length > 20 && serviceKey.indexOf('ISI_SERVICE_ROLE') === -1
  };
}

async function adminFetchAllJawabanSupabaseV91(adminSessionToken) {
  try {
    const sess = validateAdminSessionTokenV91(adminSessionToken);
    if (!sess) {
      return { success: false, unauthorized: true, message: 'Sesi Admin tidak valid atau kedaluwarsa. Silakan login ulang.' };
    }

    const cfg = getSupabaseServerConfigV91();
    if (!cfg.configured) {
      return {
        success: false,
        needsServiceRoleKey: true,
        message: 'SUPABASE_SERVICE_ROLE_KEY belum diisi di Script Properties.'
      };
    }

    const limit = 1000;
    const maxPages = 15;
    let allRows = [];

    for (let page = 0; page < maxPages; page++) {
      const from = page * limit;
      const to = from + limit - 1;
      const endpoint = cfg.url + '/rest/v1/jawaban_ujian?select=nama,kelas,mapel,jawaban,nilai,created_at&order=created_at.desc';
      const resp = await UrlFetchApp.fetch(endpoint, {
        method: 'get',
        headers: {
          'apikey': cfg.serviceKey,
          'Authorization': 'Bearer ' + cfg.serviceKey,
          'Range-Unit': 'items',
          'Range': from + '-' + to
        },
        muteHttpExceptions: true
      });
      const code = resp.getResponseCode();
      if (code < 200 || code >= 300) {
        return { success: false, message: 'Supabase Server Error (' + code + '): ' + resp.getContentText().substring(0, 180) };
      }
      const chunk = JSON.parse(resp.getContentText() || '[]');
      if (Array.isArray(chunk) && chunk.length > 0) {
        allRows = allRows.concat(chunk);
        if (chunk.length < limit) break;
      } else {
        break;
      }
    }

    return { success: true, data: allRows, total: allRows.length, source: 'SERVER_SERVICE_ROLE' };
  } catch (e) {
    return { success: false, message: 'Gagal menarik data Supabase via server: ' + e.toString() };
  }
}

async function adminResetJawabanSupabaseV91(payload) {
  try {
    const sess = validateAdminSessionTokenV91(payload && payload.adminSessionToken);
    if (!sess) {
      return { success: false, unauthorized: true, message: 'Sesi Admin tidak valid atau kedaluwarsa. Silakan login ulang.' };
    }

    const cfg = getSupabaseServerConfigV91();
    if (!cfg.configured) {
      return {
        success: false,
        needsServiceRoleKey: true,
        message: 'SUPABASE_SERVICE_ROLE_KEY belum diisi di Script Properties.'
      };
    }

    const namaSiswa = ((payload && payload.namaSiswa) || '').toString().trim();
    const mapelKeys = (payload && Array.isArray(payload.mapelKeys))
      ? payload.mapelKeys.map(m => String(m || '').trim()).filter(Boolean)
      : [];

    if (!namaSiswa || mapelKeys.length === 0) {
      return { success: false, message: 'Parameter nama siswa atau mata pelajaran tidak lengkap.' };
    }

    // Hapus per pasangan (nama, mapel) via REST API service_role agar 100% aman dari karakter khusus/koma
    for (let i = 0; i < mapelKeys.length; i++) {
      const mKey = mapelKeys[i];
      const endpoint = cfg.url + '/rest/v1/jawaban_ujian?nama=eq.' + encodeURIComponent(namaSiswa) + '&mapel=eq.' + encodeURIComponent(mKey);
      const resp = await UrlFetchApp.fetch(endpoint, {
        method: 'delete',
        headers: {
          'apikey': cfg.serviceKey,
          'Authorization': 'Bearer ' + cfg.serviceKey,
          'Prefer': 'return=minimal'
        },
        muteHttpExceptions: true
      });
      const code = resp.getResponseCode();
      if (code < 200 || code >= 300) {
        return { success: false, message: 'Gagal menghapus di Supabase (' + code + '): ' + resp.getContentText().substring(0, 160) };
      }
    }

    // V95: Bersihkan timer ujian di Supabase PostgreSQL (`exam_timer_sessions`) + fallback Sheet `LMS_Exam_Sessions`!
    try { await clearSupabaseExamTimerByAdminV95(namaSiswa, mapelKeys); } catch (clrSupaErr) {}
    try { clearServerExamTimerByAdminV92(namaSiswa, mapelKeys); } catch (clrErr) {}
    // V94: Tandai kick_until di tabel live_monitor_siswa agar siswa langsung keluar pada heartbeat berikutnya (0 WebSocket!)
    try {
      await markStudentKickedInMonitorSupabaseV94(namaSiswa, 'Admin/Pengawas mereset sesi ujian Anda (' + (mapelKeys[0] || '-') + ').');
    } catch (kickErr) {}

    return {
      success: true,
      source: 'SERVER_SERVICE_ROLE',
      message: 'Sesi & timer server ' + namaSiswa + ' berhasil direset aman.'
    };
  } catch (e) {
    return { success: false, message: 'Error Reset Server: ' + e.toString() };
  }
}

// --- E. UPGRADE ENDPOINT DIAGNOSTIK KEAMANAN V91 (GROQ + SUPABASE SERVICE KEY + 2FA + SESSION) ---
function getSecurityDashboardStatusV91(adminSessionToken) {
  try {
    const sess = validateAdminSessionTokenV91(adminSessionToken);
    const base = getSecurityScriptPropertiesStatusV90(!!sess);
    const supa = getSupabaseServerConfigV91();
    const cfg2fa = getAdmin2FAConfigInternalV91();

    const rawSupaKey = supa.serviceKey || '';
    const supaMasked = supa.configured
      ? (rawSupaKey.substring(0, 6) + '••••••••' + rawSupaKey.substring(rawSupaKey.length - 4))
      : 'Belum Diisi';

    const items = (base.items || []).concat([
      {
        key: 'SUPABASE_SERVICE_ROLE_KEY',
        label: 'Proxy Admin Supabase (Tarik Nilai & Reset RLS)',
        isGroq: false,
        configured: supa.configured,
        masked: supaMasked,
        fullValue: ''
      }
    ]);

    const configuredCount = items.filter(x => x.configured).length;
    return {
      success: true,
      configuredCount: configuredCount,
      totalRequired: items.length,
      allReady: configuredCount === items.length,
      autoCleanedCount: base.autoCleanedCount || 0,
      items: items,
      supabaseProxyReady: supa.configured,
      twoFactor: {
        enabled: cfg2fa.enabled,
        email: cfg2fa.email,
        maskedEmail: cfg2fa.email ? maskEmailAddressV91(cfg2fa.email) : ''
      },
      sessionActive: !!sess,
      sessionRole: sess ? sess.role : '',
      sessionExpiresMin: sess ? Math.max(0, Math.round((sess.expiresAt - Date.now()) / 60000)) : 0
    };
  } catch (e) {
    return { success: false, message: e.toString(), items: [] };
  }
}

// =====================================================================
// 32. PEMBARUAN V92: SECURITY HARDENING TAHAP 2
//     - HASHING PASSWORD BERTAHAP (SALTED SHA-256: sha256$<salt>$<hash>)
//     - ANTI LOGIN GANDA (SINGLE ACTIVE SESSION LOCK DI CACHESERVICE)
//     - VALIDASI WAKTU MULAI & DEADLINE UJIAN DI SERVER (LMS_Exam_Sessions)
//     - HELPER OTORISASI MAILAPP 1-KLIK (otorisasiIzinEmail2FA)
// =====================================================================

function otorisasiIzinEmail2FA() {
  const sisa = MailApp.getRemainingDailyQuota();
  Logger.log('Izin MailApp aktif! Sisa kuota email harian: ' + sisa);
  return { success: true, remainingQuota: sisa };
}

// --- A. SALTED SHA-256 PASSWORD HASHING (BERTAHAP & KOMPATIBEL PENUH) ---
function isPasswordHashedV92(val) {
  const s = (val || '').toString().trim();
  return /^sha256\$[a-f0-9]{16}\$[a-f0-9]{64}$/i.test(s);
}

function hashPasswordSaltedV92(plainPass) {
  const salt = Utilities.getUuid().replace(/-/g, '').substring(0, 16).toLowerCase();
  const hash = sha256HexV91(salt + ':' + String(plainPass || ''));
  return 'sha256$' + salt + '$' + hash;
}

function verifyPasswordAnyFormatV92(plainInput, storedVal) {
  const inp = (plainInput || '').toString().trim();
  const sto = (storedVal || '').toString().trim();
  if (!inp || !sto) return { matched: false, needsMigration: false };

  if (isPasswordHashedV92(sto)) {
    const parts = sto.split('$');
    const salt = parts[1];
    const expectedHash = parts[2].toLowerCase();
    const computedHash = sha256HexV91(salt + ':' + inp).toLowerCase();
    return { matched: computedHash === expectedHash, needsMigration: false };
  }

  // Legacy plaintext match -> tandai untuk migrasi otomatis bertahap
  const ok = inp === sto;
  return { matched: ok, needsMigration: ok };
}

function getPasswordHashingStatsV92() {
  try {
    const ss = getTargetSpreadsheet();
    let stuTotal = 0, stuHashed = 0;
    const shUsers = ss.getSheetByName('Users');
    if (shUsers && shUsers.getLastRow() > 1) {
      const data = shUsers.getDataRange().getDisplayValues();
      const headers = data[0].map(h => h.toString().trim().toLowerCase());
      let idxPass = headers.findIndex(h => h.includes('pass'));
      let idxEmail = headers.findIndex(h => h.includes('email') || h.includes('user'));
      if (idxEmail === -1) idxEmail = 1;
      if (idxPass === -1) idxPass = 2;
      for (let i = 1; i < data.length; i++) {
        const em = (data[i][idxEmail] || '').toString().trim();
        const pw = (data[i][idxPass] || '').toString().trim();
        if (!em || !pw) continue;
        stuTotal++;
        if (isPasswordHashedV92(pw)) stuHashed++;
      }
    }

    let guruTotal = 0, guruHashed = 0;
    const shGuru = ss.getSheetByName('Guru');
    if (shGuru && shGuru.getLastRow() > 1) {
      const gData = shGuru.getDataRange().getDisplayValues();
      for (let j = 1; j < gData.length; j++) {
        const u = (gData[j][0] || '').toString().trim();
        const p = (gData[j][1] || '').toString().trim();
        if (!u || !p) continue;
        guruTotal++;
        if (isPasswordHashedV92(p)) guruHashed++;
      }
    }

    let adminHashed = false;
    const shCfg = ss.getSheetByName('Pengaturan');
    if (shCfg && shCfg.getLastRow() > 1) {
      const cData = shCfg.getDataRange().getDisplayValues();
      for (let k = 1; k < cData.length; k++) {
        if ((cData[k][0] || '').toString().trim().toLowerCase() === 'password admin') {
          adminHashed = isPasswordHashedV92(cData[k][1]);
          break;
        }
      }
    }

    return {
      studentTotal: stuTotal,
      studentHashed: stuHashed,
      guruTotal: guruTotal,
      guruHashed: guruHashed,
      adminHashed: adminHashed
    };
  } catch (e) {
    return { studentTotal: 0, studentHashed: 0, guruTotal: 0, guruHashed: 0, adminHashed: false };
  }
}

function batchHashAllPlaintextPasswordsAdminV92(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const sess = validateAdminSessionTokenV91(payload && payload.adminSessionToken);
    if (!sess || sess.role !== 'ADMIN') {
      return { success: false, message: 'Sesi Super Admin tidak valid atau kedaluwarsa. Silakan login ulang.' };
    }

    const ss = getTargetSpreadsheet();
    let migratedUsers = 0, migratedGuru = 0, migratedAdmin = 0;

    // 1. Users sheet (batch write untuk kecepatan tinggi)
    const shUsers = ss.getSheetByName('Users');
    if (shUsers && shUsers.getLastRow() > 1) {
      const data = shUsers.getDataRange().getDisplayValues();
      const headers = data[0].map(h => h.toString().trim().toLowerCase());
      let idxPass = headers.findIndex(h => h.includes('pass'));
      let idxEmail = headers.findIndex(h => h.includes('email') || h.includes('user'));
      if (idxEmail === -1) idxEmail = 1;
      if (idxPass === -1) idxPass = 2;

      const passColValues = [];
      for (let i = 1; i < data.length; i++) {
        const em = (data[i][idxEmail] || '').toString().trim();
        const pw = (data[i][idxPass] || '').toString().trim();
        if (em && pw && !isPasswordHashedV92(pw)) {
          passColValues.push([hashPasswordSaltedV92(pw)]);
          migratedUsers++;
        } else {
          passColValues.push([data[i][idxPass]]);
        }
      }
      if (migratedUsers > 0) {
        shUsers.getRange(2, idxPass + 1, passColValues.length, 1).setValues(passColValues);
      }
    }

    // 2. Guru sheet
    const shGuru = ss.getSheetByName('Guru');
    if (shGuru && shGuru.getLastRow() > 1) {
      const gData = shGuru.getDataRange().getDisplayValues();
      const gPassCol = [];
      for (let j = 1; j < gData.length; j++) {
        const u = (gData[j][0] || '').toString().trim();
        const p = (gData[j][1] || '').toString().trim();
        if (u && p && !isPasswordHashedV92(p)) {
          gPassCol.push([hashPasswordSaltedV92(p)]);
          migratedGuru++;
        } else {
          gPassCol.push([gData[j][1]]);
        }
      }
      if (migratedGuru > 0) {
        shGuru.getRange(2, 2, gPassCol.length, 1).setValues(gPassCol);
      }
    }

    // 3. Pengaturan -> Password Admin
    const shCfg = ss.getSheetByName('Pengaturan');
    if (shCfg && shCfg.getLastRow() > 1) {
      const cData = shCfg.getDataRange().getDisplayValues();
      for (let k = 1; k < cData.length; k++) {
        if ((cData[k][0] || '').toString().trim().toLowerCase() === 'password admin') {
          const p = (cData[k][1] || '').toString().trim();
          if (p && !isPasswordHashedV92(p)) {
            shCfg.getRange(k + 1, 2).setValue(hashPasswordSaltedV92(p));
            migratedAdmin = 1;
          }
          break;
        }
      }
    }

    SpreadsheetApp.flush();
    clearUsersCacheV95();
    return {
      success: true,
      migratedUsers: migratedUsers,
      migratedGuru: migratedGuru,
      migratedAdmin: migratedAdmin,
      stats: getPasswordHashingStatsV92(),
      message: `Migrasi SHA-256 selesai! Di-hash: ${migratedUsers} akun siswa, ${migratedGuru} akun guru, ${migratedAdmin} akun admin.`
    };
  } catch (e) {
    return { success: false, message: 'Gagal migrasi hash massal: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// --- B. ANTI LOGIN GANDA (SINGLE ACTIVE SESSION LOCK) ---
function getStudentSessionCacheKeyV92(email) {
  const norm = (email || '').toString().trim().toLowerCase();
  return 'v92_stusess_' + sha256HexV91(norm).substring(0, 24);
}

function issueStudentSessionV92(email, name, kelas) {
  const cache = CacheService.getScriptCache();
  const key = getStudentSessionCacheKeyV92(email);
  let replacedPrevious = false;
  try {
    const prevRaw = cache.get(key);
    if (prevRaw) {
      const prevObj = JSON.parse(prevRaw);
      if (prevObj && prevObj.sessionId) replacedPrevious = true;
    }
  } catch (e) {}

  const sessionId = 'STU92-' + Utilities.getUuid().replace(/-/g, '').substring(0, 20) + '-' + Date.now().toString(36);
  const record = {
    sessionId: sessionId,
    email: (email || '').toString().trim().toLowerCase(),
    name: (name || '').toString().trim(),
    kelas: (kelas || '').toString().trim(),
    issuedAt: Date.now()
  };
  try {
    cache.put(key, JSON.stringify(record), 21600); // 6 jam
  } catch (e) {}

  return { sessionId: sessionId, replacedPrevious: replacedPrevious };
}

function validateStudentSessionServerV92(email, sessionId) {
  try {
    const cleanEmail = (email || '').toString().trim().toLowerCase();
    const cleanSess = (sessionId || '').toString().trim();
    if (!cleanEmail || !cleanSess) return { valid: true };

    const cache = CacheService.getScriptCache();
    const raw = cache.get(getStudentSessionCacheKeyV92(cleanEmail));
    if (!raw) {
      // Cache sudah kedaluwarsa alami -> perpanjang sesi sah agar tidak terjadi false kick
      cache.put(getStudentSessionCacheKeyV92(cleanEmail), JSON.stringify({
        sessionId: cleanSess, email: cleanEmail, issuedAt: Date.now()
      }), 21600);
      return { valid: true };
    }

    const stored = JSON.parse(raw);
    if (stored && stored.sessionId && stored.sessionId !== cleanSess) {
      return {
        valid: false,
        duplicateLogin: true,
        message: 'Akun Anda terdeteksi login di perangkat lain! Sesi di perangkat ini otomatis dihentikan demi integritas ujian.'
      };
    }
    return { valid: true };
  } catch (e) {
    return { valid: true };
  }
}

function clearStudentSessionServerV92(email, sessionId) {
  try {
    const cleanEmail = (email || '').toString().trim().toLowerCase();
    if (!cleanEmail) return { success: true };
    const cache = CacheService.getScriptCache();
    const key = getStudentSessionCacheKeyV92(cleanEmail);
    const raw = cache.get(key);
    if (raw) {
      const stored = JSON.parse(raw);
      if (!sessionId || (stored && stored.sessionId === sessionId)) {
        cache.remove(key);
      }
    }
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

// --- C. VALIDASI WAKTU MULAI & DEADLINE UJIAN DI SERVER ---
function getOrCreateExamSessionsSheetV92(ss) {
  // Prefiks LMS_ agar otomatis diabaikan isSystemSheetName()
  let sheet = ss.getSheetByName('LMS_Exam_Sessions');
  if (!sheet) {
    sheet = ss.insertSheet('LMS_Exam_Sessions');
    sheet.appendRow([
      'Session_Key', 'Email', 'Nama', 'Kelas', 'Mode', 'Mapel',
      'Started_At_Ms', 'Duration_Min', 'Deadline_Ms', 'Status',
      'Submitted_At_Ms', 'Flag_Waktu'
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange('A1:L1').setFontWeight('bold').setBackground('#e0e7ff');
  }
  return sheet;
}

function getConfiguredExamDurationMinV92() {
  try {
    const cache = CacheService.getScriptCache();
    const cached = cache.get('v92_exam_dur_min');
    if (cached) return Number(cached) || 70;

    const ss = getTargetSpreadsheet();
    const sheet = ss.getSheetByName('Pengaturan');
    let dur = 70;
    if (sheet && sheet.getLastRow() > 1) {
      const data = sheet.getDataRange().getDisplayValues();
      for (let i = 1; i < data.length; i++) {
        const k = (data[i][0] || '').toString().trim().toLowerCase();
        if (k === 'durasi ujian (menit)' || k === 'durasi ujian') {
          const v = parseInt(data[i][1], 10);
          if (!isNaN(v) && v >= 10 && v <= 240) dur = v;
          break;
        }
      }
    }
    cache.put('v92_exam_dur_min', String(dur), 60);
    return dur;
  } catch (e) {
    return 70;
  }
}

function buildExamTimerKeyV92(examMode, email, subject) {
  const m = ((examMode || 'PTS').toString().trim().toUpperCase() === 'PAS') ? 'PAS' : 'PTS';
  const em = (email || '').toString().trim().toLowerCase();
  const sub = (subject || '').toString().trim().toLowerCase();
  return m + '__' + em + '__' + sub;
}

function startOrResumeExamTimerServerV92(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(12000);
    const email = ((payload && payload.email) || '').toString().trim().toLowerCase();
    const name = ((payload && payload.name) || '').toString().trim();
    const kelas = ((payload && payload.kelas) || '').toString().trim();
    const subject = ((payload && payload.subject) || '').toString().trim();
    const examMode = ((payload && payload.examMode) || 'PTS').toString().trim().toUpperCase() === 'PAS' ? 'PAS' : 'PTS';
    const sessionId = ((payload && payload.sessionId) || '').toString().trim();

    if (!email || !subject) {
      return { success: false, message: 'Parameter email dan mata pelajaran wajib diisi.' };
    }

    if (sessionId) {
      const sChk = validateStudentSessionServerV92(email, sessionId);
      if (!sChk.valid) {
        return { success: false, duplicateLogin: true, message: sChk.message };
      }
    }

    const sessionKey = buildExamTimerKeyV92(examMode, email, subject);
    const cacheKey = 'v92_examt_' + sha256HexV91(sessionKey).substring(0, 24);
    const cache = CacheService.getScriptCache();
    const serverNowMs = Date.now();
    const graceMs = 120000; // Toleransi jaringan 2 menit

    // 1. Cek cache cepat dulu
    try {
      const latestDurMin = getExamDurationForSubjectV93(subject);
      const cRaw = cache.get(cacheKey);
      if (cRaw) {
        const cObj = JSON.parse(cRaw);
        if (cObj && cObj.startedAtMs && cObj.status === 'ACTIVE') {
          const effDur = latestDurMin || cObj.durationMin || 70;
          const effDeadline = cObj.startedAtMs + (effDur * 60000);
          const remMs = Math.max(0, effDeadline - serverNowMs);
          return {
            success: true,
            resumed: true,
            serverNowMs: serverNowMs,
            startedAtMs: cObj.startedAtMs,
            durationMin: effDur,
            deadlineMs: effDeadline,
            remainingMs: remMs,
            graceMs: graceMs,
            isExpired: serverNowMs > (effDeadline + graceMs)
          };
        }
      }
    } catch (e) {}

    // 2. Cek Sheet LMS_Exam_Sessions
    const ss = getTargetSpreadsheet();
    const sheet = getOrCreateExamSessionsSheetV92(ss);
    const rows = sheet.getDataRange().getDisplayValues();
    for (let i = rows.length - 1; i >= 1; i--) {
      if ((rows[i][0] || '').toString().trim() === sessionKey && (rows[i][9] || '').toString().trim().toUpperCase() === 'ACTIVE') {
        const startedAtMs = Number(rows[i][6]) || serverNowMs;
        const durationMin = getExamDurationForSubjectV93(subject) || Number(rows[i][7]) || 70;
        const deadlineMs = startedAtMs + (durationMin * 60000);
        const rec = { startedAtMs: startedAtMs, durationMin: durationMin, deadlineMs: deadlineMs, status: 'ACTIVE' };
        try { cache.put(cacheKey, JSON.stringify(rec), 14400); } catch (e2) {}
        const remMs = Math.max(0, deadlineMs - serverNowMs);
        return {
          success: true,
          resumed: true,
          serverNowMs: serverNowMs,
          startedAtMs: startedAtMs,
          durationMin: durationMin,
          deadlineMs: deadlineMs,
          remainingMs: remMs,
          graceMs: graceMs,
          isExpired: serverNowMs > (deadlineMs + graceMs)
        };
      }
    }

    // 3. Belum ada sesi aktif -> catat waktu mulai otoritatif di server!
    const durationMin = getExamDurationForSubjectV93(subject);
    const startedAtMs = serverNowMs;
    const deadlineMs = startedAtMs + (durationMin * 60000);
    sheet.appendRow([
      sessionKey, email, name, kelas, examMode, subject,
      startedAtMs, durationMin, deadlineMs, 'ACTIVE', '', 'ON_TIME'
    ]);
    SpreadsheetApp.flush();

    try {
      cache.put(cacheKey, JSON.stringify({
        startedAtMs: startedAtMs, durationMin: durationMin, deadlineMs: deadlineMs, status: 'ACTIVE'
      }), 14400);
    } catch (e3) {}

    return {
      success: true,
      resumed: false,
      serverNowMs: serverNowMs,
      startedAtMs: startedAtMs,
      durationMin: durationMin,
      deadlineMs: deadlineMs,
      remainingMs: durationMin * 60000,
      graceMs: graceMs,
      isExpired: false
    };
  } catch (e) {
    return { success: false, message: 'Gagal sinkronisasi timer server: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function validateExamSubmissionTimeServerV92(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const email = ((payload && payload.email) || '').toString().trim().toLowerCase();
    const subject = ((payload && payload.subject) || '').toString().trim();
    const examMode = ((payload && payload.examMode) || 'PTS').toString().trim().toUpperCase() === 'PAS' ? 'PAS' : 'PTS';
    const sessionKey = buildExamTimerKeyV92(examMode, email, subject);
    const cacheKey = 'v92_examt_' + sha256HexV91(sessionKey).substring(0, 24);
    const serverNowMs = Date.now();
    const graceMs = 120000;

    const ss = getTargetSpreadsheet();
    const sheet = getOrCreateExamSessionsSheetV92(ss);
    const rows = sheet.getDataRange().getDisplayValues();

    let foundRowIdx = -1;
    let startedAtMs = serverNowMs;
    let durationMin = 70;
    let deadlineMs = serverNowMs + 70 * 60000;

    for (let i = rows.length - 1; i >= 1; i--) {
      if ((rows[i][0] || '').toString().trim() === sessionKey && (rows[i][9] || '').toString().trim().toUpperCase() === 'ACTIVE') {
        foundRowIdx = i + 1;
        startedAtMs = Number(rows[i][6]) || serverNowMs;
        durationMin = Number(rows[i][7]) || 70;
        deadlineMs = Number(rows[i][8]) || (startedAtMs + durationMin * 60000);
        break;
      }
    }

    const overMs = Math.max(0, serverNowMs - deadlineMs);
    const withinGrace = overMs <= graceMs;
    const elapsedMin = Math.max(1, Math.round((serverNowMs - startedAtMs) / 60000));
    const flagStr = withinGrace ? 'ON_TIME' : ('LATE_' + Math.ceil(overMs / 60000) + 'M');

    if (foundRowIdx > 1) {
      sheet.getRange(foundRowIdx, 10, 1, 3).setValues([['SUBMITTED', serverNowMs, flagStr]]);
      SpreadsheetApp.flush();
    }
    try { CacheService.getScriptCache().remove(cacheKey); } catch (e) {}

    return {
      success: true,
      serverNowMs: serverNowMs,
      startedAtMs: startedAtMs,
      deadlineMs: deadlineMs,
      overMs: overMs,
      withinGrace: withinGrace,
      lateFlag: flagStr,
      elapsedMin: elapsedMin
    };
  } catch (e) {
    return { success: false, withinGrace: true, lateFlag: 'OFFLINE_GRACE', elapsedMin: 0, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function clearServerExamTimerByAdminV92(namaSiswa, mapelKeys) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getTargetSpreadsheet();
    const sheet = ss.getSheetByName('LMS_Exam_Sessions');
    if (!sheet || sheet.getLastRow() < 2) return { success: true, cleared: 0 };

    const cleanNama = (namaSiswa || '').toString().trim().toLowerCase();
    const cleanTargets = (mapelKeys || []).map(k => {
      const s = String(k || '').trim();
      const m = s.match(/^\[(PTS|PAS)\]\s*(.+)$/i);
      return (m ? m[2] : s).trim().toLowerCase();
    }).filter(Boolean);

    const rows = sheet.getDataRange().getDisplayValues();
    const cache = CacheService.getScriptCache();
    let cleared = 0;

    for (let i = rows.length - 1; i >= 1; i--) {
      const rNama = (rows[i][2] || '').toString().trim().toLowerCase();
      const rMapel = (rows[i][5] || '').toString().trim().toLowerCase();
      if (rNama === cleanNama && (cleanTargets.length === 0 || cleanTargets.includes(rMapel))) {
        const sKey = (rows[i][0] || '').toString().trim();
        if (sKey) {
          try { cache.remove('v92_examt_' + sha256HexV91(sKey).substring(0, 24)); } catch (ce) {}
        }
        sheet.getRange(i + 1, 10, 1, 3).setValues([['RESET_ADMIN', Date.now(), 'CLEARED']]);
        cleared++;
      }
    }
    if (cleared > 0) SpreadsheetApp.flush();
    return { success: true, cleared: cleared };
  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// Perluas status keamanan V91 agar menyertakan statistik Tahap 2 (Hashing SHA-256, Single Session, Server Timer)
async function getSecurityDashboardStatusV92(adminSessionToken) {
  const base = getSecurityDashboardStatusV91(adminSessionToken);
  if (!base || !base.success) return base;
  base.hashingStats = getPasswordHashingStatsV92();
  base.examDurationMin = getConfiguredExamDurationMinV92();
  base.stage2Active = true;
  base.heartbeatMonitorReady = await checkLiveMonitorTableReadyV94();
  base.examTimerSupabaseReady = await checkExamTimerTableReadyV95();
  return base;
}

// =====================================================================
// 33. PEMBARUAN V93: PENGATURAN DURASI WAKTU UJIAN MANUAL PER MAPEL
//     DI BANK SOAL ADMIN + SINKRONISASI REAL-TIME SESI UJIAN AKTIF
// =====================================================================

function getAllExamDurationsMapV93() {
  try {
    const cache = CacheService.getScriptCache();
    const cached = cache.get('v93_exam_durations_map');
    if (cached) return JSON.parse(cached);

    ensureSystemInitialized();
    const ss = getTargetSpreadsheet();
    const sheet = ss.getSheetByName('Pengaturan');
    let defaultMinutes = 70;
    const byMapel = {};

    if (sheet && sheet.getLastRow() > 1) {
      const rows = sheet.getDataRange().getDisplayValues();
      for (let i = 1; i < rows.length; i++) {
        const rawKey = (rows[i][0] || '').toString().trim();
        const lowKey = rawKey.toLowerCase();
        const rawVal = parseInt(rows[i][1], 10);
        if (isNaN(rawVal) || rawVal < 10 || rawVal > 240) continue;

        if (lowKey === 'durasi ujian (menit)' || lowKey === 'durasi ujian') {
          defaultMinutes = rawVal;
        } else if (lowKey.indexOf('durasi mapel:') === 0) {
          const mapelName = rawKey.substring(rawKey.indexOf(':') + 1).trim();
          if (mapelName) byMapel[mapelName] = rawVal;
        }
      }
    }

    const result = { success: true, defaultMinutes: defaultMinutes, byMapel: byMapel };
    try { cache.put('v93_exam_durations_map', JSON.stringify(result), 30); } catch (ce) {}
    return result;
  } catch (e) {
    return { success: false, defaultMinutes: 70, byMapel: {}, message: e.toString() };
  }
}

function getExamDurationForSubjectV93(subject) {
  try {
    const mapObj = getAllExamDurationsMapV93();
    const cleanSub = (subject || '').toString().trim();
    if (cleanSub && mapObj.byMapel) {
      if (mapObj.byMapel[cleanSub]) return Number(mapObj.byMapel[cleanSub]);
      const lowTarget = cleanSub.toLowerCase();
      const keys = Object.keys(mapObj.byMapel);
      for (let i = 0; i < keys.length; i++) {
        if (keys[i].toLowerCase() === lowTarget) return Number(mapObj.byMapel[keys[i]]);
      }
    }
    return Number(mapObj.defaultMinutes) || 70;
  } catch (e) {
    return 70;
  }
}

async function saveExamDurationAdminV93(payload) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const sess = validateAdminSessionTokenV91(payload && payload.adminSessionToken);
    if (!sess) {
      return { success: false, unauthorized: true, message: 'Sesi Admin/Guru tidak valid atau kedaluwarsa. Silakan login ulang.' };
    }

    const durationMin = parseInt(payload && payload.durationMin, 10);
    if (isNaN(durationMin) || durationMin < 10 || durationMin > 240) {
      return { success: false, message: 'Durasi ujian harus antara 10 hingga 240 menit!' };
    }

    const applyAll = !!(payload && payload.applyAll);
    const mapel = ((payload && payload.mapel) || '').toString().trim();

    if (!applyAll && !mapel) {
      return { success: false, message: 'Pilih mata pelajaran terlebih dahulu atau gunakan tombol Terapkan Semua Mapel.' };
    }

    if (sess.role !== 'ADMIN') {
      if (applyAll) {
        return { success: false, message: 'Hanya Super Admin yang dapat mengubah durasi untuk seluruh mata pelajaran sekaligus.' };
      }
      const ampu = (sess.mapelAmpu || '').toString().trim().toLowerCase();
      if (ampu !== 'all' && ampu.indexOf(mapel.toLowerCase()) === -1) {
        return { success: false, message: 'Anda tidak memiliki izin mengubah durasi mata pelajaran ' + mapel + '.' };
      }
    }

    ensureSystemInitialized();
    const ss = getTargetSpreadsheet();
    const sheet = ss.getSheetByName('Pengaturan');
    if (!sheet) return { success: false, message: 'Sheet Pengaturan tidak ditemukan.' };

    const upsertRow = (label, val) => {
      const rows = sheet.getDataRange().getDisplayValues();
      for (let i = 1; i < rows.length; i++) {
        if ((rows[i][0] || '').toString().trim().toLowerCase() === label.toLowerCase()) {
          sheet.getRange(i + 1, 2).setValue(val);
          return;
        }
      }
      sheet.appendRow([label, val]);
    };

    const affectedSubjects = [];
    if (applyAll) {
      upsertRow('Durasi Ujian (Menit)', durationMin);
      ss.getSheets().forEach(sh => {
        const sName = sh.getName();
        if (!isSystemSheetName(sName)) {
          upsertRow('Durasi Mapel: ' + sName, durationMin);
          affectedSubjects.push(sName);
        }
      });
    } else {
      upsertRow('Durasi Mapel: ' + mapel, durationMin);
      affectedSubjects.push(mapel);
    }

    // Sinkronkan juga seluruh sesi ujian ACTIVE di LMS_Exam_Sessions & CacheService agar batas waktu server ikut real-time!
    let updatedSessionsCount = 0;
    const sessSheet = ss.getSheetByName('LMS_Exam_Sessions');
    if (sessSheet && sessSheet.getLastRow() > 1) {
      const sRows = sessSheet.getDataRange().getDisplayValues();
      const cache = CacheService.getScriptCache();
      const lowSet = new Set(affectedSubjects.map(x => x.toLowerCase()));
      for (let i = 1; i < sRows.length; i++) {
        const status = (sRows[i][9] || '').toString().trim().toUpperCase();
        const rMapel = (sRows[i][5] || '').toString().trim().toLowerCase();
        if (status === 'ACTIVE' && (applyAll || lowSet.has(rMapel))) {
          const startedAtMs = Number(sRows[i][6]) || Date.now();
          const newDeadlineMs = startedAtMs + (durationMin * 60000);
          sessSheet.getRange(i + 1, 8, 1, 2).setValues([[durationMin, newDeadlineMs]]);
          const sKey = (sRows[i][0] || '').toString().trim();
          if (sKey) {
            try {
              const cKey = 'v92_examt_' + sha256HexV91(sKey).substring(0, 24);
              cache.put(cKey, JSON.stringify({
                startedAtMs: startedAtMs,
                durationMin: durationMin,
                deadlineMs: newDeadlineMs,
                status: 'ACTIVE'
              }), 14400);
            } catch (ce) {}
          }
          updatedSessionsCount++;
        }
      }
    }

    SpreadsheetApp.flush();
    clearSicibinagaFastCacheV88();

    const freshMap = getAllExamDurationsMapV93();
    try {
      await syncRuntimeConfigToSupabaseV94({
        default_duration_min: freshMap.defaultMinutes || durationMin,
        durations_by_mapel: freshMap.byMapel || {}
      });
    } catch (syncErr3) {}
    try {
      const supaUpdated = await updateSupabaseActiveExamTimersDurationV95(applyAll, affectedSubjects, durationMin);
      if (supaUpdated > 0) updatedSessionsCount += supaUpdated;
    } catch (syncErr4) {}
    return {
      success: true,
      applyAll: applyAll,
      mapel: applyAll ? 'ALL' : mapel,
      durationMin: durationMin,
      updatedSessionsCount: updatedSessionsCount,
      durationsMap: freshMap,
      message: applyAll
        ? `Durasi seluruh mata pelajaran (${affectedSubjects.length} mapel) diatur ke ${durationMin} menit & disiarkan real-time!`
        : `Durasi ujian ${mapel} diatur ke ${durationMin} menit & disiarkan real-time ke seluruh siswa!`
    };
  } catch (e) {
    return { success: false, message: 'Gagal menyimpan durasi ujian: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// =====================================================================
// 34. PEMBARUAN V94: DATABASE HEARTBEAT LIVE MONITOR (SKALA 255-500+ SISWA)
//     - 0 WEBSOCKET DI PERANGKAT SISWA (BEBAS LIMIT 200 KONEKSI FREE TIER)
//     - 0 FAN-OUT & 0 LAG DI HP ANDROID SISWA
//     - REKAMAN JEJAK PERSISTEN DI POSTGRESQL (public.live_monitor_siswa)
//     - SINKRONISASI KONTROL RUNTIME (ENVIRONMENT, PTS/PAS, DURASI) VIA DB
// =====================================================================

async function checkLiveMonitorTableReadyV94() {
  try {
    const cfg = getSupabaseServerConfigV91();
    if (!cfg.configured) return false;
    const resp = await UrlFetchApp.fetch(cfg.url + '/rest/v1/live_monitor_siswa?select=email&limit=1', {
      method: 'get',
      headers: {
        'apikey': cfg.serviceKey,
        'Authorization': 'Bearer ' + cfg.serviceKey
      },
      muteHttpExceptions: true
    });
    const code = resp.getResponseCode();
    return code >= 200 && code < 300;
  } catch (e) {
    return false;
  }
}

async function syncRuntimeConfigToSupabaseV94(partialPatch) {
  try {
    const cfg = getSupabaseServerConfigV91();
    if (!cfg.configured) return { success: false, skipped: true };

    const envCfg = getAppEnvironmentConfigV88();
    const durMap = getAllExamDurationsMapV93();
    const p = partialPatch || {};

    const bodyObj = {
      id: 1,
      active_environment: p.active_environment || envCfg.activeEnvironment || 'ALL',
      active_exam_mode: p.active_exam_mode || envCfg.activeExamMode || 'PTS',
      default_duration_min: Number(p.default_duration_min || durMap.defaultMinutes) || 70,
      durations_by_mapel: p.durations_by_mapel || durMap.byMapel || {},
      updated_at: new Date().toISOString()
    };

    const resp = await UrlFetchApp.fetch(cfg.url + '/rest/v1/app_runtime_config?on_conflict=id', {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'apikey': cfg.serviceKey,
        'Authorization': 'Bearer ' + cfg.serviceKey,
        'Prefer': 'resolution=merge-duplicates,return=minimal'
      },
      payload: JSON.stringify([bodyObj]),
      muteHttpExceptions: true
    });
    const code = resp.getResponseCode();
    return { success: code >= 200 && code < 300, code: code };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

async function markStudentKickedInMonitorSupabaseV94(namaSiswa, reasonText) {
  try {
    const cfg = getSupabaseServerConfigV91();
    if (!cfg.configured || !namaSiswa) return { success: false };

    const kickUntilIso = new Date(Date.now() + 180000).toISOString(); // berlaku 3 menit
    const endpoint = cfg.url + '/rest/v1/live_monitor_siswa?nama=ilike.' + encodeURIComponent(namaSiswa.toString().trim());
    const resp = await UrlFetchApp.fetch(endpoint, {
      method: 'patch',
      contentType: 'application/json',
      headers: {
        'apikey': cfg.serviceKey,
        'Authorization': 'Bearer ' + cfg.serviceKey,
        'Prefer': 'return=minimal'
      },
      payload: JSON.stringify({
        kick_until: kickUntilIso,
        kick_reason: (reasonText || 'Pengawas menghentikan sesi Anda.').toString().substring(0, 200)
      }),
      muteHttpExceptions: true
    });
    const code = resp.getResponseCode();
    return { success: code >= 200 && code < 300, code: code };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

async function adminKickStudentMonitorV94(payload) {
  try {
    const sess = validateAdminSessionTokenV91(payload && payload.adminSessionToken);
    if (!sess) {
      return { success: false, unauthorized: true, message: 'Sesi Admin tidak valid atau kedaluwarsa.' };
    }
    const namaSiswa = ((payload && payload.namaSiswa) || '').toString().trim();
    if (!namaSiswa) return { success: false, message: 'Nama siswa wajib diisi.' };
    const reason = ((payload && payload.reason) || 'Admin/Pengawas mengeluarkan sesi Anda dari aplikasi.').toString().trim();
    const res = await markStudentKickedInMonitorSupabaseV94(namaSiswa, reason);
    return {
      success: res.success,
      message: res.success ? ('Perintah keluar telah dikirim ke perangkat ' + namaSiswa + '.') : 'Tabel live_monitor_siswa belum siap.'
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

async function adminFetchLiveMonitorV94(adminSessionToken) {
  try {
    const sess = validateAdminSessionTokenV91(adminSessionToken);
    if (!sess) {
      return { success: false, unauthorized: true, message: 'Sesi Admin tidak valid atau kedaluwarsa.' };
    }

    const cfg = getSupabaseServerConfigV91();
    if (!cfg.configured) {
      return { success: false, needsServiceRoleKey: true, message: 'SUPABASE_SERVICE_ROLE_KEY belum diisi.' };
    }

    const endpoint = cfg.url + '/rest/v1/live_monitor_siswa?select=email,nama,kelas,zona,sub_zona,mapel,aktivitas_utama,detail_aktivitas,progress_pct,no_soal,tot_soal,jml_jawab,sisa_mnt,focus_status,device,v_count,updated_at,recent_logs&order=updated_at.desc&limit=1000';
    const resp = await UrlFetchApp.fetch(endpoint, {
      method: 'get',
      headers: {
        'apikey': cfg.serviceKey,
        'Authorization': 'Bearer ' + cfg.serviceKey
      },
      muteHttpExceptions: true
    });

    const code = resp.getResponseCode();
    if (code === 404 || code === 400) {
      const txt = resp.getContentText() || '';
      if (txt.indexOf('live_monitor_siswa') > -1 || txt.indexOf('PGRST205') > -1 || txt.indexOf('42P01') > -1) {
        return { success: false, needsSqlSetup: true, message: 'Tabel live_monitor_siswa belum dibuat. Jalankan SQL_LIVE_MONITOR_HEARTBEAT_V94.sql di Supabase.' };
      }
    }
    if (code < 200 || code >= 300) {
      return { success: false, message: 'Supabase Monitor Error (' + code + '): ' + resp.getContentText().substring(0, 180) };
    }

    const rows = JSON.parse(resp.getContentText() || '[]');
    return {
      success: true,
      serverNowMs: Date.now(),
      rows: Array.isArray(rows) ? rows : []
    };
  } catch (e) {
    return { success: false, message: 'Gagal mengambil data Live Monitor: ' + e.toString() };
  }
}

async function adminClearLiveMonitorTableV94(payload) {
  try {
    const sess = validateAdminSessionTokenV91(payload && payload.adminSessionToken);
    if (!sess || sess.role !== 'ADMIN') {
      return { success: false, message: 'Hanya Super Admin yang dapat membersihkan tabel Live Monitor.' };
    }
    const cfg = getSupabaseServerConfigV91();
    if (!cfg.configured) return { success: false, message: 'SUPABASE_SERVICE_ROLE_KEY belum diisi.' };

    // Hapus semua baris pada live_monitor_siswa (filter email != kosong)
    const resp = await UrlFetchApp.fetch(cfg.url + '/rest/v1/live_monitor_siswa?email=neq.__never__', {
      method: 'delete',
      headers: {
        'apikey': cfg.serviceKey,
        'Authorization': 'Bearer ' + cfg.serviceKey,
        'Prefer': 'return=minimal'
      },
      muteHttpExceptions: true
    });
    const code = resp.getResponseCode();
    if (code < 200 || code >= 300) {
      return { success: false, message: 'Gagal membersihkan tabel monitor (' + code + ').' };
    }
    return { success: true, message: 'Seluruh rekaman sesi Live Monitor lama berhasil dibersihkan!' };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// =====================================================================
// 35. PEMBARUAN V95: HIGH-CONCURRENCY ENGINE (255+ SISWA SERENTAK)
//     - CHUNKED CACHESERVICE AMAN > 95 KB (USERS 60s, TOKEN 30s, SOAL 60s)
//     - TIMER UJIAN SERVER DI SUPABASE POSTGRESQL (0 LOCKSERVICE!)
//     - ZERO-SHEET-HIT READ-ONLY LOGIN SETELAH BATCH HASH SHA-256
// =====================================================================

const V95_CACHE_CHUNK_SIZE = 88000;

function putChunkedCacheV95(baseKey, jsonStr, ttlSec) {
  try {
    const cache = CacheService.getScriptCache();
    const s = String(jsonStr || '');
    if (s.length <= V95_CACHE_CHUNK_SIZE) {
      cache.putAll({
        [baseKey + '_meta']: JSON.stringify({ n: 1 }),
        [baseKey + '_0']: s
      }, ttlSec);
      return true;
    }
    const mapToPut = {};
    const totalChunks = Math.ceil(s.length / V95_CACHE_CHUNK_SIZE);
    if (totalChunks > 25) return false;
    mapToPut[baseKey + '_meta'] = JSON.stringify({ n: totalChunks });
    for (let i = 0; i < totalChunks; i++) {
      mapToPut[baseKey + '_' + i] = s.substring(i * V95_CACHE_CHUNK_SIZE, (i + 1) * V95_CACHE_CHUNK_SIZE);
    }
    cache.putAll(mapToPut, ttlSec);
    return true;
  } catch (e) {
    return false;
  }
}

function getChunkedCacheV95(baseKey) {
  try {
    const cache = CacheService.getScriptCache();
    const metaRaw = cache.get(baseKey + '_meta');
    if (!metaRaw) return null;
    const meta = JSON.parse(metaRaw);
    const n = Number(meta && meta.n) || 0;
    if (n <= 0 || n > 25) return null;
    const keys = [];
    for (let i = 0; i < n; i++) keys.push(baseKey + '_' + i);
    const parts = cache.getAll(keys);
    let combined = '';
    for (let i = 0; i < n; i++) {
      const piece = parts[baseKey + '_' + i];
      if (typeof piece !== 'string') return null;
      combined += piece;
    }
    return combined;
  } catch (e) {
    return null;
  }
}

function removeChunkedCacheV95(baseKey) {
  try {
    const cache = CacheService.getScriptCache();
    const keys = [baseKey + '_meta'];
    for (let i = 0; i < 12; i++) keys.push(baseKey + '_' + i);
    cache.removeAll(keys);
  } catch (e) {}
}

function clearUsersCacheV95() {
  removeChunkedCacheV95('v95_users_idx');
}

function getCachedUsersIndexV95() {
  try {
    const cachedStr = getChunkedCacheV95('v95_users_idx');
    if (cachedStr) {
      const parsed = JSON.parse(cachedStr);
      if (parsed && parsed.byEmail) {
        parsed.fromCache = true;
        return parsed;
      }
    }

    const ss = getTargetSpreadsheet();
    const sheet = ss.getSheetByName('Users');
    if (!sheet) return { success: false, message: 'Database "Users" belum tersedia.' };

    const data = sheet.getDataRange().getDisplayValues();
    if (data.length < 2) return { success: false, message: 'Data peserta di sheet "Users" masih kosong.' };

    const headers = data[0].map(h => h.toString().trim().toLowerCase());
    let idxNama = headers.findIndex(h => h.includes('nama'));
    let idxEmail = headers.findIndex(h => h.includes('email') || h.includes('user'));
    let idxPass = headers.findIndex(h => h.includes('pass'));
    let idxKelas = headers.findIndex(h => h.includes('kelas') || h.includes('rombel'));

    if (idxNama === -1) idxNama = 0;
    if (idxEmail === -1) idxEmail = 1;
    if (idxPass === -1) idxPass = 2;
    if (idxKelas === -1) idxKelas = 3;

    const byEmail = {};
    for (let i = 1; i < data.length; i++) {
      const em = (data[i][idxEmail] || '').toString().trim().toLowerCase();
      if (!em) continue;
      byEmail[em] = {
        rowNum: i + 1,
        nama: (data[i][idxNama] || 'Siswa').toString().trim(),
        pass: (data[i][idxPass] || '').toString().trim(),
        kelas: (data[i][idxKelas] || '').toString().trim().toUpperCase()
      };
    }

    const obj = {
      success: true,
      passCol: idxPass + 1,
      byEmail: byEmail,
      fromCache: false
    };
    putChunkedCacheV95('v95_users_idx', JSON.stringify(obj), 60);
    return obj;
  } catch (e) {
    return { success: false, message: 'Gagal membaca database Users: ' + e.toString() };
  }
}

function getCachedTokenMapV95() {
  try {
    const cache = CacheService.getScriptCache();
    const cached = cache.get('v95_token_map');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.map) return parsed;
    }

    const ss = getTargetSpreadsheet();
    const tokenSheet = ss.getSheetByName('Token');
    if (!tokenSheet) return { success: false, message: "Sheet 'Token' belum tersedia." };

    const tokenData = tokenSheet.getDataRange().getDisplayValues();
    const map = {};
    for (let i = 1; i < tokenData.length; i++) {
      const subj = (tokenData[i][0] || '').toString().trim();
      if (!subj) continue;
      map[subj] = {
        status: (tokenData[i][1] || 'NONAKTIF').toString().trim().toUpperCase(),
        expectedToken: (tokenData[i][2] || '').toString().trim(),
        endToken: (tokenData[i][3] || '').toString().trim()
      };
    }

    const res = { success: true, map: map };
    try { cache.put('v95_token_map', JSON.stringify(res), 30); } catch (ce) {}
    return res;
  } catch (e) {
    return { success: false, message: 'Gagal membaca Token: ' + e.toString() };
  }
}

function getQuestionsCacheVersionV95() {
  try {
    const v = CacheService.getScriptCache().get('v95_q_ver');
    return v || '1';
  } catch (e) {
    return '1';
  }
}

function bumpQuestionsCacheVersionV95() {
  try {
    CacheService.getScriptCache().put('v95_q_ver', String(Date.now()), 21600);
  } catch (e) {}
}

function getCachedSubjectQuestionsV95(subject) {
  try {
    const ver = getQuestionsCacheVersionV95();
    const baseKey = 'v95_q_' + ver.slice(-6) + '_' + sha256HexV91((subject || '').toString().trim().toLowerCase()).substring(0, 16);
    const cachedStr = getChunkedCacheV95(baseKey);
    if (cachedStr) {
      const parsed = JSON.parse(cachedStr);
      if (Array.isArray(parsed)) {
        return { success: true, questions: parsed, fromCache: true };
      }
    }

    const ss = getTargetSpreadsheet();
    const sheet = ss.getSheetByName(subject);
    if (!sheet) return { success: false, message: 'Bank soal mata pelajaran ini belum tersedia.' };

    const data = sheet.getDataRange().getDisplayValues();
    const questions = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i].length < 2) continue;
      const text = (data[i][1] || '').toString().trim();
      const imgSoal = data[i].length > 7 ? (data[i][7] || '').toString().trim() : '';
      if (text === '' && imgSoal === '') continue;

      questions.push({
        id: i,
        no: data[i][0] ? data[i][0].toString() : i.toString(),
        text: text,
        options: {
          A: data[i].length > 2 ? data[i][2].toString() : '',
          B: data[i].length > 3 ? data[i][3].toString() : '',
          C: data[i].length > 4 ? data[i][4].toString() : '',
          D: data[i].length > 5 ? data[i][5].toString() : ''
        },
        imageUrl: formatDriveUrl(imgSoal),
        imgA: data[i].length > 8 ? formatDriveUrl(data[i][8]) : '',
        imgB: data[i].length > 9 ? formatDriveUrl(data[i][9]) : '',
        imgC: data[i].length > 10 ? formatDriveUrl(data[i][10]) : '',
        imgD: data[i].length > 11 ? formatDriveUrl(data[i][11]) : '',
        tipe: data[i].length > 12 && data[i][12] ? data[i][12].toString().trim().toUpperCase() : 'PG'
      });
    }

    if (questions.length > 0) {
      putChunkedCacheV95(baseKey, JSON.stringify(questions), 60);
    }
    return { success: true, questions: questions, fromCache: false };
  } catch (e) {
    return { success: false, message: 'Gagal membaca soal mapel: ' + e.toString() };
  }
}

async function checkExamTimerTableReadyV95() {
  try {
    const cfg = getSupabaseServerConfigV91();
    if (!cfg.configured) return false;
    const resp = await UrlFetchApp.fetch(cfg.url + '/rest/v1/exam_timer_sessions?select=session_key&limit=1', {
      method: 'get',
      headers: {
        'apikey': cfg.serviceKey,
        'Authorization': 'Bearer ' + cfg.serviceKey
      },
      muteHttpExceptions: true
    });
    const code = resp.getResponseCode();
    return code >= 200 && code < 300;
  } catch (e) {
    return false;
  }
}

async function clearSupabaseExamTimerByAdminV95(namaSiswa, mapelKeys) {
  try {
    const cfg = getSupabaseServerConfigV91();
    if (!cfg.configured || !namaSiswa) return { success: false, skipped: true };

    const cleanTargets = (mapelKeys || []).map(k => {
      const s = String(k || '').trim();
      const m = s.match(/^\[(PTS|PAS)\]\s*(.+)$/i);
      return (m ? m[2] : s).trim();
    }).filter(Boolean);

    const targets = cleanTargets.length > 0 ? cleanTargets : [''];
    for (let i = 0; i < targets.length; i++) {
      let endpoint = cfg.url + '/rest/v1/exam_timer_sessions?nama=ilike.' + encodeURIComponent(namaSiswa.toString().trim());
      if (targets[i]) endpoint += '&mapel=ilike.' + encodeURIComponent(targets[i]);
      await UrlFetchApp.fetch(endpoint, {
        method: 'patch',
        contentType: 'application/json',
        headers: {
          'apikey': cfg.serviceKey,
          'Authorization': 'Bearer ' + cfg.serviceKey,
          'Prefer': 'return=minimal'
        },
        payload: JSON.stringify({
          status: 'RESET_ADMIN',
          flag_waktu: 'CLEARED',
          updated_at: new Date().toISOString()
        }),
        muteHttpExceptions: true
      });
    }
    return { success: true };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

async function updateSupabaseActiveExamTimersDurationV95(applyAll, affectedSubjects, durationMin) {
  try {
    const cfg = getSupabaseServerConfigV91();
    if (!cfg.configured) return 0;

    const resp = await UrlFetchApp.fetch(cfg.url + '/rest/v1/rpc/admin_update_exam_timer_duration_v95', {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'apikey': cfg.serviceKey,
        'Authorization': 'Bearer ' + cfg.serviceKey
      },
      payload: JSON.stringify({
        p_apply_all: !!applyAll,
        p_mapel: applyAll ? '' : ((affectedSubjects && affectedSubjects[0]) || ''),
        p_duration_min: Number(durationMin) || 70
      }),
      muteHttpExceptions: true
    });
    const code = resp.getResponseCode();
    if (code >= 200 && code < 300) {
      const parsed = JSON.parse(resp.getContentText() || '0');
      return Number(parsed) || 0;
    }
    return 0;
  } catch (e) {
    return 0;
  }
}

// =====================================================================
// 36. PEMBARUAN V96: MANAJEMEN LANGSUNG & LIVE TEST 4 API KEY GROQ
//     (TAMPIL UTUH TANPA MASKING DI DASHBOARD ADMIN + AUTO-SANITIZE)
// =====================================================================

async function saveGroqScriptPropertiesAdminV96(payload) {
  try {
    const sess = validateAdminSessionTokenV91(payload && payload.adminSessionToken);
    if (!sess || sess.role !== 'ADMIN') {
      return { success: false, message: 'Hanya Super Admin dengan sesi aktif yang dapat menyimpan Script Properties Groq.' };
    }

    const keysMap = (payload && payload.keys) || {};
    const propsService = PropertiesService.getScriptProperties();
    const toSave = {};
    const invalidList = [];
    let savedCount = 0;

    GROQ_REQUIRED_KEY_DEFS_V96.forEach(def => {
      if (keysMap[def.key] === undefined) return;
      const clean = sanitizeApiKeyValueV96(keysMap[def.key]);
      if (!clean) {
        propsService.deleteProperty(def.key);
        return;
      }
      if (!isValidGroqKeyFormatV96(clean)) {
        invalidList.push(def.key + ' (harus diawali gsk_...)');
        return;
      }
      toSave[def.key] = clean;
      savedCount++;
    });

    if (invalidList.length > 0) {
      return {
        success: false,
        message: 'Format API Key Groq tidak valid pada: ' + invalidList.join(', ') + '. Pastikan menyalin kunci gsk_... yang benar tanpa teks tambahan.'
      };
    }

    if (savedCount > 0) {
      propsService.setProperties(toSave, false);
    }
    __v90ScriptPropsCache = null;

    return {
      success: true,
      savedCount: savedCount,
      status: await getSecurityDashboardStatusV92(payload.adminSessionToken),
      message: `${savedCount} API Key Groq berhasil dibersihkan dari tanda kutip/spasi & disimpan permanen ke Script Properties!`
    };
  } catch (e) {
    return { success: false, message: 'Gagal menyimpan API Key Groq: ' + e.toString() };
  }
}

async function testAllGroqApiKeysAdminV96(adminSessionToken) {
  try {
    const sess = validateAdminSessionTokenV91(adminSessionToken);
    if (!sess) {
      return { success: false, message: 'Sesi Admin/Guru tidak valid atau kedaluwarsa. Silakan login ulang.' };
    }

    __v90ScriptPropsCache = null;
    const props = getAllScriptPropsCachedV90();
    const results = [];
    let validCount = 0;

    for (let _ti = 0; _ti < GROQ_REQUIRED_KEY_DEFS_V96.length; _ti++) {
      const def = GROQ_REQUIRED_KEY_DEFS_V96[_ti];
      const raw = (props[def.key] || '').toString();
      const clean = sanitizeApiKeyValueV96(raw);

      if (clean && clean !== raw && isValidGroqKeyFormatV96(clean)) {
        try {
          PropertiesService.getScriptProperties().setProperty(def.key, clean);
          props[def.key] = clean;
        } catch (e) {}
      }

      if (!clean) {
        results.push({ key: def.key, label: def.label, ok: false, code: 0, statusText: 'Kosong (Belum Diisi)' });
        continue;
      }
      if (!isValidGroqKeyFormatV96(clean)) {
        results.push({ key: def.key, label: def.label, ok: false, code: 400, statusText: 'Format Salah (Wajib gsk_...)' });
        continue;
      }

      try {
        const resp = await UrlFetchApp.fetch('https://api.groq.com/openai/v1/models', {
          method: 'get',
          headers: { 'Authorization': 'Bearer ' + clean },
          muteHttpExceptions: true
        });
        const code = resp.getResponseCode();
        if (code === 200) {
          validCount++;
          results.push({ key: def.key, label: def.label, ok: true, code: 200, statusText: 'AKTIF & VALID (HTTP 200)' });
        } else if (code === 401) {
          results.push({ key: def.key, label: def.label, ok: false, code: 401, statusText: 'INVALID API KEY (HTTP 401)' });
        } else if (code === 429) {
          validCount++;
          results.push({ key: def.key, label: def.label, ok: true, code: 429, statusText: 'VALID (Sedang Rate Limit 429)' });
        } else {
          results.push({ key: def.key, label: def.label, ok: false, code: code, statusText: 'HTTP ' + code });
        }
      } catch (fetchErr) {
        results.push({ key: def.key, label: def.label, ok: false, code: 500, statusText: 'Gagal Koneksi: ' + fetchErr.toString().substring(0, 60) });
      }
    }

    return {
      success: true,
      validCount: validCount,
      total: results.length,
      allValid: validCount === results.length,
      results: results
    };
  } catch (e) {
    return { success: false, message: 'Gagal menguji API Key Groq: ' + e.toString() };
  }
}



  return {
    SPREADSHEET_ID,
    adminFetchAllJawabanSupabaseV91,
    adminFetchLiveMonitorV94,
    adminKickStudentMonitorV94,
    adminResetJawabanSupabaseV91,
    appendSoalMasalAdmin,
    archiveAllBankSoalToDriveV89,
    askAITutorLMS,
    batchHashAllPlaintextPasswordsAdminV92,
    deleteArenaQuestionPackServerV50,
    deleteDiscussionThreadOrReplyV41,
    deleteLMSModuleAdmin,
    editDiscussionThreadTextByAdminV41,
    evaluateStudentReflectionGroq,
    evaluateStudentVideoAssignmentGroq,
    fetchModuleDiscussionsLiveV39,
    generateAndSaveVideoAnalysisLMSAdmin,
    generateArenaVariedQuestionsGroqV46,
    generateMateriDanKuisGroqSingleShot,
    generateSmartDiscussionAnswerGroqV39,
    generateSoalAIGroq,
    generateTieredArenaQuizGroqV50,
    getAdminLMSData,
    getAllExamDurationsMapV93,
    getAllStudentProfilesMapV44,
    getAppConfig,
    getAppEnvironmentConfigV88,
    getArenaBadgeStoreDataV48,
    getArenaQuestionsForSubjectV45,
    getBankSoalArchiveHistoryV89,
    getConfigAPI,
    getDynamicArenaQuestionBankServerV50,
    getExamModeConfigServerV69,
    getExamSettingsAdmin,
    getFastCBTBootstrapV88,
    getGroqQuizSocraticCoaching,
    getKunciJawabanAPI,
    getKunciJawabanClient,
    getLMSDashboardData,
    getLiveArenaConfigAndDataV45,
    getLiveArenaDiscussionsV50,
    getQuestions,
    getSecurityDashboardStatusV91,
    getSecurityDashboardStatusV92,
    getSecurityScriptPropertiesStatusV90,
    getSiswaKartuAdmin,
    getSoalAPI,
    getSoalAdmin,
    getStudentRealtimeNotificationsFeedV42,
    getSubjects,
    polishModuleSectionWithAIGroqV40,
    reactOrReplyArenaDiscussionV50,
    redeemOrEquipArenaAvatarBadgeV48,
    removeModuleTeachingFileAdminV38,
    removeSubMateriImageAdminV78,
    removeTujuanPembelajaranImageAdmin,
    removeVideoAnalysisLMSAdmin,
    replyLMSQuestionAdmin,
    resendAdminOtpV91,
    revokeAdminSessionTokenV91,
    rotateOrRegenerateArenaQuestionsOnPerfectScoreV50,
    saveAdmin2FAConfigV91,
    saveAppEnvironmentConfigV88,
    saveArenaQuestionPackServerV50,
    saveExamDurationAdminV93,
    saveExamModeConfigServerV69,
    saveExamSettingsAdmin,
    saveGroqScriptPropertiesAdminV96,
    saveGuruAccountAdmin,
    saveLMSModuleAdmin,
    saveLiveArenaConfigAdminV45,
    saveLiveModuleFullEditV40,
    saveSoalAdmin,
    saveStudentCustomProfileV44,
    saveStudentLMSProgress,
    saveSubMateriImageAdminV78,
    saveTujuanPembelajaranImageAdmin,
    startOrResumeExamTimerServerV92,
    submitDiscussionReplyOrLikeV37,
    submitFeedbackClient,
    submitLiveAdminAnswerSidebarV39,
    submitLiveArenaPositivePostV50,
    submitLiveArenaScoreV45,
    submitStudentLMSQuestion,
    submitStudentRichDiscussionV37,
    tambahMapelBaruAdmin,
    testAllGroqApiKeysAdminV96,
    toggleBestPeerSolutionSidebarV39,
    updateSoalAdminRow,
    updateStudentPasswordClient,
    uploadAndSaveModuleTeachingFileAdminV38,
    uploadImageToDrive,
    validateExamSubmissionTimeServerV92,
    validateStudentSessionServerV92,
    verifyAdmin,
    verifyAdminOtpV91,
    verifyLogin
  };
}

module.exports = { createBackendEngine };
