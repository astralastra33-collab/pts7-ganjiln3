// =========================================================================
// SICIBINAGA VERCEL SERVERLESS RPC ROUTER (api/rpc.js)
// Menangani seluruh 93 endpoint google.script.run + 3 endpoint GET legacy
// dengan 1.000+ eksekusi simultan, 0 LockService, & Snapshot RAM Cache!
// =========================================================================
'use strict';

const { fetchSpreadsheetSnapshot, createRequestGasGlobals } = require('../lib/gas-runtime');
const { createBackendEngine } = require('../lib/backend-core');

const SPREADSHEET_ID = '1YZ-TlyZ4FAuhtaYHQyuaLi3rDrwjJWopIdJ9--jWdII';

// RPC murni Groq AI / Supabase / stateless yang TIDAK perlu membaca Google Sheets sama sekali (0 Sheets API call!)
const NO_SHEET_FNS = new Set([
  'askAITutorLMS',
  'evaluateStudentReflectionGroq',
  'getGroqQuizSocraticCoaching',
  'evaluateStudentVideoAssignmentGroq',
  'generateSmartDiscussionAnswerGroqV39',
  'polishModuleSectionWithAIGroqV40',
  'generateSoalAIGroq',
  'generateMateriDanKuisGroqSingleShot',
  'generateArenaVariedQuestionsGroqV46',
  'generateTieredArenaQuizGroqV50',
  'adminFetchAllJawabanSupabaseV91',
  'adminFetchLiveMonitorV94',
  'adminKickStudentMonitorV94',
  'testAllGroqApiKeysAdminV96',
  'getSecurityScriptPropertiesStatusV90',
  'saveGroqScriptPropertiesAdminV96',
  'validateStudentSessionServerV92',
  'revokeAdminSessionTokenV91',
  'verifyAdminOtpV91',
  'resendAdminOtpV91',
  'uploadImageToDrive'
]);

// RPC baca saja -> pakai warm RAM snapshot cache (TTL 25s) agar 255+ siswa simultan <120ms!
const READ_ONLY_SHEET_FNS = new Set([
  'getAppConfig',
  'getAppEnvironmentConfigV88',
  'getExamModeConfigServerV69',
  'getAllExamDurationsMapV93',
  'getSubjects',
  'getFastCBTBootstrapV88',
  'verifyLogin',
  'getQuestions',
  'getKunciJawabanClient',
  'getLMSDashboardData',
  'getAdminLMSData',
  'getSiswaKartuAdmin',
  'getSoalAdmin',
  'getExamSettingsAdmin',
  'getSecurityDashboardStatusV91',
  'getSecurityDashboardStatusV92',
  'getAllStudentProfilesMapV44',
  'getArenaBadgeStoreDataV48',
  'getArenaQuestionsForSubjectV45',
  'getBankSoalArchiveHistoryV89',
  'getDynamicArenaQuestionBankServerV50',
  'getLiveArenaConfigAndDataV45',
  'getLiveArenaDiscussionsV50',
  'getStudentRealtimeNotificationsFeedV42',
  'fetchModuleDiscussionsLiveV39',
  'getConfigAPI',
  'getKunciJawabanAPI',
  'getSoalAPI'
]);

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  try {
    // 1. Dukungan GET Legacy (?action=getConfig | getKunci | getSoal&mapel=...)
    if (req.method === 'GET') {
      const action = (req.query && req.query.action) || '';
      const mapel = (req.query && req.query.mapel) || '';
      if (!['getConfig', 'getKunci', 'getSoal'].includes(action)) {
        return res.status(200).json({ ok: true, service: 'SICIBINAGA Vercel RPC', grade: '7' });
      }
      const snapshot = await fetchSpreadsheetSnapshot(SPREADSHEET_ID, false);
      const rt = createRequestGasGlobals(SPREADSHEET_ID, snapshot);
      const engine = createBackendEngine(rt.globals);
      let outObj;
      if (action === 'getConfig') outObj = await engine.getConfigAPI();
      else if (action === 'getKunci') outObj = await engine.getKunciJawabanAPI();
      else outObj = await engine.getSoalAPI(mapel);
      const rawTxt = (outObj && typeof outObj.getContent === 'function') ? outObj.getContent() : JSON.stringify(outObj);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.status(200).send(rawTxt);
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ __rpcError: true, message: 'Method tidak diizinkan.' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const fnName = String(body.fn || '').trim();
    const args = Array.isArray(body.args) ? body.args : [];

    if (!fnName) {
      return res.status(400).json({ __rpcError: true, message: 'Parameter fn wajib diisi.' });
    }

    // 2. Muat snapshot Spreadsheet hanya bila fungsi membutuhkannya
    let snapshot = null;
    if (!NO_SHEET_FNS.has(fnName)) {
      const forceFresh = !READ_ONLY_SHEET_FNS.has(fnName);
      snapshot = await fetchSpreadsheetSnapshot(SPREADSHEET_ID, forceFresh);
    }

    const rt = createRequestGasGlobals(SPREADSHEET_ID, snapshot);
    const engine = createBackendEngine(rt.globals);

    if (typeof engine[fnName] !== 'function') {
      return res.status(404).json({ __rpcError: true, message: 'Endpoint RPC tidak terdaftar: ' + fnName });
    }

    const result = await engine[fnName](...args);
    await rt.flushAll();

    return res.status(200).json({ ok: true, result: result });
  } catch (err) {
    console.error('[SICIBINAGA /api/rpc ERROR]', err);
    return res.status(500).json({
      __rpcError: true,
      message: (err && err.message) ? err.message : String(err)
    });
  }
};
