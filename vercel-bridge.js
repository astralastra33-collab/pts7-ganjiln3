// =========================================================================
// SICIBINAGA VERCEL BRIDGE (public/vercel-bridge.js)
// Drop-in polyfill 100% kompatibel untuk google.script.run -> POST /api/rpc
// Menjaga seluruh 170 pemanggilan RPC di app.js berjalan utuh tanpa ubah UI!
// =========================================================================
(function initSicibinagaVercelBridge() {
  const RETRYABLE_FNS = new Set([
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
    'adminFetchLiveMonitorV94',
    'adminFetchAllJawabanSupabaseV91'
  ]);

  function createRunner(successFn, failureFn, userObj) {
    return new Proxy({}, {
      get(_target, prop) {
        if (prop === 'withSuccessHandler') return (fn) => createRunner(fn, failureFn, userObj);
        if (prop === 'withFailureHandler') return (fn) => createRunner(successFn, fn, userObj);
        if (prop === 'withUserObject') return (obj) => createRunner(successFn, failureFn, obj);
        if (typeof prop === 'symbol') return undefined;

        const fnName = String(prop);
        return async function (...args) {
          const maxTry = RETRYABLE_FNS.has(fnName) ? 3 : 1;
          let lastErr = null;

          for (let attempt = 1; attempt <= maxTry; attempt++) {
            try {
              const resp = await fetch('/api/rpc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fn: fnName, args: args })
              });

              let data = null;
              try {
                data = await resp.json();
              } catch (parseErr) {
                throw new Error('Respons server bukan JSON valid (HTTP ' + resp.status + ') pada ' + fnName);
              }

              if (!resp.ok || (data && data.__rpcError)) {
                const msg = (data && data.message) || ('HTTP ' + resp.status + ' pada ' + fnName);
                const err = new Error(msg);
                err.httpStatus = resp.status;
                throw err;
              }

              if (typeof successFn === 'function') {
                successFn(data ? data.result : null, userObj);
              }
              return;
            } catch (err) {
              lastErr = err;
              const status = err && err.httpStatus;
              // Jangan retry untuk error 400/401/403/404 logis
              if (attempt < maxTry && (!status || status >= 500 || status === 429)) {
                const waitMs = 700 + Math.floor(Math.random() * 1300);
                await new Promise(r => setTimeout(r, waitMs));
                continue;
              }
              break;
            }
          }

          if (typeof failureFn === 'function') {
            failureFn(lastErr || new Error('Gagal terhubung ke server Vercel (' + fnName + ').'), userObj);
          } else {
            console.error('[SICIBINAGA RPC ERROR]', fnName, lastErr);
          }
        };
      }
    });
  }

  window.google = window.google || {};
  window.google.script = window.google.script || {};
  window.google.script.run = createRunner(null, null, null);
  window.__SICIBINAGA_RUNTIME__ = 'VERCEL';
})();
