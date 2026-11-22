-- =========================================================================
-- SQL_LIVE_MONITOR_HEARTBEAT_V94.sql
-- ARSITEKTUR LIVE MONITOR DATABASE HEARTBEAT (SKALA 255 - 500+ SISWA SIMULTAN)
-- ZERO WEBSOCKET DI HP SISWA | ZERO FAN-OUT | 100% GRATIS DI SUPABASE FREE TIER
-- =========================================================================
-- CARA MENJALANKAN:
-- 1. Buka Supabase Dashboard -> SQL Editor -> New Query.
-- 2. Tempel seluruh isi skrip ini, lalu klik RUN.
-- =========================================================================

-- 1. Tabel status & jejak aktivitas live per siswa (1 baris per siswa aktif)
CREATE TABLE IF NOT EXISTS public.live_monitor_siswa (
  email             text PRIMARY KEY,
  nama              text NOT NULL,
  kelas             text DEFAULT '-',
  zona              text DEFAULT 'BERANDA',
  sub_zona          text DEFAULT '',
  mapel             text DEFAULT '-',
  aktivitas_utama   text DEFAULT '',
  detail_aktivitas  text DEFAULT '',
  progress_pct      integer DEFAULT 0,
  no_soal           integer DEFAULT 0,
  tot_soal          integer DEFAULT 0,
  jml_jawab         integer DEFAULT 0,
  sisa_mnt          integer DEFAULT 0,
  focus_status      text DEFAULT 'FOKUS_AKTIF',
  device            text DEFAULT '',
  v_count           integer DEFAULT 0,
  session_id        text DEFAULT '',
  kick_until        timestamptz NULL,
  kick_reason       text DEFAULT '',
  recent_logs       jsonb DEFAULT '[]'::jsonb,
  updated_at        timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_live_monitor_updated_at
  ON public.live_monitor_siswa (updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_live_monitor_nama_lower
  ON public.live_monitor_siswa (lower(nama));

-- 2. Tabel kontrol runtime 1 baris (Environment, Mode PTS/PAS, & Durasi Ujian)
CREATE TABLE IF NOT EXISTS public.app_runtime_config (
  id                    integer PRIMARY KEY DEFAULT 1,
  active_environment    text DEFAULT 'ALL',
  active_exam_mode      text DEFAULT 'PTS',
  default_duration_min  integer DEFAULT 70,
  durations_by_mapel    jsonb DEFAULT '{}'::jsonb,
  updated_at            timestamptz DEFAULT now()
);

INSERT INTO public.app_runtime_config (id, active_environment, active_exam_mode, default_duration_min, durations_by_mapel)
VALUES (1, 'ALL', 'PTS', 70, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 3. Kunci ketat dengan Row Level Security (RLS)
--    Siswa dengan anon key TIDAK BISA membaca status teman atau mengubah konfigurasi!
ALTER TABLE public.live_monitor_siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_runtime_config ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.live_monitor_siswa FROM anon, authenticated;
REVOKE ALL ON TABLE public.app_runtime_config FROM anon, authenticated;

-- 4. Fungsi RPC #1: Baca konfigurasi runtime ringan untuk halaman Login (0 WebSocket)
CREATE OR REPLACE FUNCTION public.get_runtime_config_v94()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (
      SELECT jsonb_build_object(
        'active_environment', c.active_environment,
        'active_exam_mode', c.active_exam_mode,
        'default_duration_min', c.default_duration_min,
        'durations_by_mapel', c.durations_by_mapel,
        'updated_at', c.updated_at
      )
      FROM public.app_runtime_config c
      WHERE c.id = 1
      LIMIT 1
    ),
    jsonb_build_object(
      'active_environment', 'ALL',
      'active_exam_mode', 'PTS',
      'default_duration_min', 70,
      'durations_by_mapel', '{}'::jsonb
    )
  );
$$;

-- 5. Fungsi RPC #2: Heartbeat Atomik Siswa (Upsert status + Simpan Jejak + Cek Login Ganda + Cek Kick + Terima Config)
CREATE OR REPLACE FUNCTION public.student_heartbeat_v94(
  p_email            text,
  p_nama             text,
  p_kelas            text DEFAULT '-',
  p_zona             text DEFAULT 'BERANDA',
  p_sub_zona         text DEFAULT '',
  p_mapel            text DEFAULT '-',
  p_aktivitas_utama  text DEFAULT '',
  p_detail_aktivitas text DEFAULT '',
  p_progress_pct     integer DEFAULT 0,
  p_no_soal          integer DEFAULT 0,
  p_tot_soal         integer DEFAULT 0,
  p_jml_jawab        integer DEFAULT 0,
  p_sisa_mnt         integer DEFAULT 0,
  p_focus_status     text DEFAULT 'FOKUS_AKTIF',
  p_device           text DEFAULT '',
  p_v_count          integer DEFAULT 0,
  p_session_id       text DEFAULT '',
  p_claim_session    boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email       text := lower(trim(COALESCE(p_email, '')));
  v_nama        text := trim(COALESCE(p_nama, ''));
  v_sess        text := trim(COALESCE(p_session_id, ''));
  v_existing    public.live_monitor_siswa%ROWTYPE;
  v_has_row     boolean := false;
  v_logs        jsonb := '[]'::jsonb;
  v_new_sig     text;
  v_prev_sig    text;
  v_entry       jsonb;
  v_runtime     jsonb;
BEGIN
  IF char_length(v_email) < 2 OR char_length(v_nama) < 2 THEN
    RETURN jsonb_build_object('ok', false, 'status', 'INVALID');
  END IF;

  SELECT * INTO v_existing
  FROM public.live_monitor_siswa
  WHERE email = v_email;
  v_has_row := FOUND;

  -- A. Cek Anti Login Ganda (jika bukan klaim login baru & sesi di DB milik perangkat lain)
  IF v_has_row
     AND NOT COALESCE(p_claim_session, false)
     AND v_sess <> ''
     AND COALESCE(v_existing.session_id, '') <> ''
     AND v_existing.session_id <> v_sess
     AND (now() - COALESCE(v_existing.updated_at, now() - interval '1 hour')) < interval '6 hours'
  THEN
    RETURN jsonb_build_object(
      'ok', false,
      'status', 'DUPLICATE_SESSION',
      'message', 'Akun Anda terdeteksi login di perangkat lain! Sesi di perangkat ini otomatis dihentikan demi integritas ujian.'
    );
  END IF;

  -- B. Cek Perintah Kick / Reset dari Admin/Pengawas
  IF v_has_row
     AND NOT COALESCE(p_claim_session, false)
     AND v_existing.kick_until IS NOT NULL
     AND v_existing.kick_until > now()
  THEN
    UPDATE public.live_monitor_siswa
    SET kick_until = NULL,
        updated_at = now() - interval '2 minutes'
    WHERE email = v_email;

    RETURN jsonb_build_object(
      'ok', false,
      'status', 'KICKED',
      'reason', COALESCE(NULLIF(v_existing.kick_reason, ''), 'Admin/Pengawas menghentikan sesi Anda.')
    );
  END IF;

  -- C. Bangun & deduplikasi jejak aktivitas persisten (maks 120 entri terbaru per siswa)
  v_logs := CASE
    WHEN v_has_row AND jsonb_typeof(v_existing.recent_logs) = 'array' THEN v_existing.recent_logs
    ELSE '[]'::jsonb
  END;

  v_new_sig := COALESCE(p_zona,'') || '|' || COALESCE(p_mapel,'') || '|' || COALESCE(p_detail_aktivitas,'') || '|' || COALESCE(p_focus_status,'');
  v_prev_sig := CASE
    WHEN jsonb_array_length(v_logs) > 0 THEN COALESCE(v_logs->0->>'sig', '')
    ELSE ''
  END;

  IF v_new_sig <> v_prev_sig THEN
    v_entry := jsonb_build_object(
      'sig', v_new_sig,
      'w', to_char(now() AT TIME ZONE 'Asia/Jakarta', 'HH24:MI:SS'),
      't', to_char(now() AT TIME ZONE 'Asia/Jakarta', 'DD Mon'),
      'z', COALESCE(p_zona, 'BERANDA'),
      'm', COALESCE(p_mapel, '-'),
      'a', left(COALESCE(p_aktivitas_utama, ''), 120),
      'd', left(COALESCE(p_detail_aktivitas, ''), 260),
      'f', COALESCE(p_focus_status, 'FOKUS_AKTIF'),
      'ts', (extract(epoch FROM now()) * 1000)::bigint
    );

    -- Prepend entry baru & potong agar maksimal 120 entri per siswa
    v_logs := (
      SELECT jsonb_agg(elem)
      FROM (
        SELECT elem
        FROM jsonb_array_elements(jsonb_build_array(v_entry) || v_logs) WITH ORDINALITY AS t(elem, ord)
        ORDER BY ord
        LIMIT 120
      ) sub
    );
  END IF;

  -- D. Upsert status live siswa ke PostgreSQL
  INSERT INTO public.live_monitor_siswa (
    email, nama, kelas, zona, sub_zona, mapel, aktivitas_utama, detail_aktivitas,
    progress_pct, no_soal, tot_soal, jml_jawab, sisa_mnt, focus_status, device,
    v_count, session_id, kick_until, kick_reason, recent_logs, updated_at
  ) VALUES (
    v_email, v_nama, COALESCE(p_kelas, '-'), COALESCE(p_zona, 'BERANDA'), COALESCE(p_sub_zona, ''),
    COALESCE(p_mapel, '-'), left(COALESCE(p_aktivitas_utama, ''), 140), left(COALESCE(p_detail_aktivitas, ''), 300),
    COALESCE(p_progress_pct, 0), COALESCE(p_no_soal, 0), COALESCE(p_tot_soal, 0), COALESCE(p_jml_jawab, 0),
    COALESCE(p_sisa_mnt, 0), COALESCE(p_focus_status, 'FOKUS_AKTIF'), left(COALESCE(p_device, ''), 60),
    COALESCE(p_v_count, 0), v_sess, NULL, '', v_logs, now()
  )
  ON CONFLICT (email) DO UPDATE SET
    nama             = EXCLUDED.nama,
    kelas            = EXCLUDED.kelas,
    zona             = EXCLUDED.zona,
    sub_zona         = EXCLUDED.sub_zona,
    mapel            = EXCLUDED.mapel,
    aktivitas_utama  = EXCLUDED.aktivitas_utama,
    detail_aktivitas = EXCLUDED.detail_aktivitas,
    progress_pct     = EXCLUDED.progress_pct,
    no_soal          = EXCLUDED.no_soal,
    tot_soal         = EXCLUDED.tot_soal,
    jml_jawab        = EXCLUDED.jml_jawab,
    sisa_mnt         = EXCLUDED.sisa_mnt,
    focus_status     = EXCLUDED.focus_status,
    device           = EXCLUDED.device,
    v_count          = EXCLUDED.v_count,
    session_id       = CASE WHEN COALESCE(p_claim_session, false) OR EXCLUDED.session_id <> '' THEN EXCLUDED.session_id ELSE public.live_monitor_siswa.session_id END,
    kick_until       = CASE WHEN COALESCE(p_claim_session, false) THEN NULL ELSE public.live_monitor_siswa.kick_until END,
    recent_logs      = EXCLUDED.recent_logs,
    updated_at       = now();

  -- E. Sertakan konfigurasi runtime terbaru (1 baris) dalam balasan heartbeat
  v_runtime := public.get_runtime_config_v94();

  RETURN jsonb_build_object(
    'ok', true,
    'status', 'OK',
    'server_now_ms', (extract(epoch FROM now()) * 1000)::bigint,
    'runtime_config', v_runtime
  );
END;
$$;

-- 6. Izinkan eksekusi HANYA pada 2 fungsi RPC aman untuk role publik
REVOKE ALL ON FUNCTION public.get_runtime_config_v94() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.student_heartbeat_v94(text,text,text,text,text,text,text,text,integer,integer,integer,integer,integer,text,text,integer,text,boolean) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.get_runtime_config_v94() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.student_heartbeat_v94(text,text,text,text,text,text,text,text,integer,integer,integer,integer,integer,text,text,integer,text,boolean) TO anon, authenticated, service_role;
