// =========================================================================
// SICIBINAGA VERCEL HEALTH DIAGNOSTICS (GET /api/health)
// Cek kesiapan Environment Variables, Google Sheets API v4, Supabase & Groq!
// =========================================================================
'use strict';

const { parseServiceAccountJson, getGoogleAccessToken } = require('../lib/gas-runtime');

module.exports = async function handler(_req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const checks = {
    app: 'SICIBINAGA Kelas 7 (Vercel V97)',
    spreadsheetId: '1YZ-TlyZ4FAuhtaYHQyuaLi3rDrwjJWopIdJ9--jWdII',
    supabaseUrl: 'https://xraqhfkrwwvlkvoulzuv.supabase.co',
    googleServiceAccountConfigured: false,
    googleAuthOk: false,
    supabaseServiceRoleConfigured: Boolean((process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()),
    resendEmailConfigured: Boolean((process.env.RESEND_API_KEY || '').trim()),
    sessionSecretConfigured: Boolean((process.env.SESSION_SECRET || '').trim()),
    error: null
  };

  try {
    const sa = parseServiceAccountJson();
    checks.googleServiceAccountConfigured = Boolean(sa && sa.client_email && sa.private_key);
    checks.serviceAccountEmail = (sa && sa.client_email) || null;
    if (checks.googleServiceAccountConfigured) {
      await getGoogleAccessToken();
      checks.googleAuthOk = true;
    }
  } catch (e) {
    checks.error = e.message;
  }

  return res.status(200).json(checks);
};
