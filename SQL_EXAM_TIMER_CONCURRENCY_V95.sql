-- =========================================================================
-- SQL_EXAM_TIMER_CONCURRENCY_V95.sql
-- MIGRASI TIMER UJIAN SERVER KE SUPABASE POSTGRESQL (0 LOCKSERVICE!)
-- MENANGANI 255 - 500+ TRANSAKSI MULAI & SUBMIT UJIAN SECARA PARALEL
-- =========================================================================
-- CARA MENJALANKAN:
-- 1. Buka Supabase Dashboard -> SQL Editor -> New Query.
-- 2. Tempel seluruh isi file ini, lalu klik RUN.
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.exam_timer_sessions (
  session_key   text PRIMARY KEY,
  email         text NOT NULL,
  nama          text DEFAULT '',
  kelas         text DEFAULT '-',
  exam_mode     text DEFAULT 'PTS',
  mapel         text NOT NULL,
  started_at    timestamptz NOT NULL DEFAULT now(),
  duration_min  integer NOT NULL DEFAULT 70,
  deadline_at   timestamptz NOT NULL,
  status        text NOT NULL DEFAULT 'ACTIVE',
  submitted_at  timestamptz NULL,
  flag_waktu    text DEFAULT 'ON_TIME',
  updated_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_exam_timer_nama_mapel
  ON public.exam_timer_sessions (lower(nama), lower(mapel));

CREATE INDEX IF NOT EXISTS idx_exam_timer_active_mapel
  ON public.exam_timer_sessions (status, lower(mapel));

ALTER TABLE public.exam_timer_sessions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.exam_timer_sessions FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.start_or_resume_exam_timer_v95(
  p_email        text,
  p_nama         text DEFAULT '',
  p_kelas        text DEFAULT '-',
  p_exam_mode    text DEFAULT 'PTS',
  p_mapel        text DEFAULT '',
  p_duration_min integer DEFAULT 70
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email       text := lower(trim(COALESCE(p_email, '')));
  v_mode        text := CASE WHEN upper(trim(COALESCE(p_exam_mode, 'PTS'))) = 'PAS' THEN 'PAS' ELSE 'PTS' END;
  v_mapel       text := trim(COALESCE(p_mapel, ''));
  v_key         text := v_mode || '__' || v_email || '__' || lower(v_mapel);
  v_dur_min     integer := GREATEST(10, LEAST(240, COALESCE(p_duration_min, 70)));
  v_cfg_dur     integer;
  v_existing    public.exam_timer_sessions%ROWTYPE;
  v_has_row     boolean := false;
  v_now         timestamptz := now();
  v_started     timestamptz;
  v_deadline    timestamptz;
  v_grace_ms    bigint := 120000;
  v_rem_ms      bigint;
  v_is_expired  boolean;
BEGIN
  IF char_length(v_email) < 2 OR char_length(v_mapel) < 1 THEN
    RETURN jsonb_build_object('success', false, 'message', 'Email dan mata pelajaran wajib diisi.');
  END IF;

  BEGIN
    SELECT COALESCE(
      NULLIF((c.durations_by_mapel ->> v_mapel)::integer, 0),
      NULLIF(c.default_duration_min, 0)
    )
    INTO v_cfg_dur
    FROM public.app_runtime_config c
    WHERE c.id = 1
    LIMIT 1;

    IF v_cfg_dur IS NOT NULL AND v_cfg_dur >= 10 AND v_cfg_dur <= 240 THEN
      v_dur_min := v_cfg_dur;
    END IF;
  EXCEPTION WHEN undefined_table OR invalid_text_representation THEN
    NULL;
  END;

  SELECT * INTO v_existing
  FROM public.exam_timer_sessions
  WHERE session_key = v_key;
  v_has_row := FOUND;

  IF v_has_row AND upper(COALESCE(v_existing.status, '')) = 'ACTIVE' THEN
    v_started := v_existing.started_at;
    v_deadline := v_started + make_interval(mins => v_dur_min);

    IF v_existing.duration_min IS DISTINCT FROM v_dur_min OR v_existing.deadline_at IS DISTINCT FROM v_deadline THEN
      UPDATE public.exam_timer_sessions
      SET duration_min = v_dur_min,
          deadline_at  = v_deadline,
          updated_at   = v_now
      WHERE session_key = v_key;
    END IF;

    v_rem_ms := GREATEST(0, (extract(epoch FROM (v_deadline - v_now)) * 1000)::bigint);
    v_is_expired := ((extract(epoch FROM (v_now - v_deadline)) * 1000)::bigint > v_grace_ms);

    RETURN jsonb_build_object(
      'success', true,
      'resumed', true,
      'serverNowMs', (extract(epoch FROM v_now) * 1000)::bigint,
      'startedAtMs', (extract(epoch FROM v_started) * 1000)::bigint,
      'durationMin', v_dur_min,
      'deadlineMs', (extract(epoch FROM v_deadline) * 1000)::bigint,
      'remainingMs', v_rem_ms,
      'graceMs', v_grace_ms,
      'isExpired', v_is_expired
    );
  END IF;

  v_started := v_now;
  v_deadline := v_now + make_interval(mins => v_dur_min);

  INSERT INTO public.exam_timer_sessions (
    session_key, email, nama, kelas, exam_mode, mapel,
    started_at, duration_min, deadline_at, status, submitted_at, flag_waktu, updated_at
  ) VALUES (
    v_key, v_email, trim(COALESCE(p_nama, '')), trim(COALESCE(p_kelas, '-')), v_mode, v_mapel,
    v_started, v_dur_min, v_deadline, 'ACTIVE', NULL, 'ON_TIME', v_now
  )
  ON CONFLICT (session_key) DO UPDATE SET
    nama         = EXCLUDED.nama,
    kelas        = EXCLUDED.kelas,
    started_at   = EXCLUDED.started_at,
    duration_min = EXCLUDED.duration_min,
    deadline_at  = EXCLUDED.deadline_at,
    status       = 'ACTIVE',
    submitted_at = NULL,
    flag_waktu   = 'ON_TIME',
    updated_at   = v_now;

  RETURN jsonb_build_object(
    'success', true,
    'resumed', false,
    'serverNowMs', (extract(epoch FROM v_now) * 1000)::bigint,
    'startedAtMs', (extract(epoch FROM v_started) * 1000)::bigint,
    'durationMin', v_dur_min,
    'deadlineMs', (extract(epoch FROM v_deadline) * 1000)::bigint,
    'remainingMs', (v_dur_min::bigint * 60000),
    'graceMs', v_grace_ms,
    'isExpired', false
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_exam_submission_time_v95(
  p_email     text,
  p_exam_mode text DEFAULT 'PTS',
  p_mapel     text DEFAULT ''
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email       text := lower(trim(COALESCE(p_email, '')));
  v_mode        text := CASE WHEN upper(trim(COALESCE(p_exam_mode, 'PTS'))) = 'PAS' THEN 'PAS' ELSE 'PTS' END;
  v_mapel       text := trim(COALESCE(p_mapel, ''));
  v_key         text := v_mode || '__' || v_email || '__' || lower(v_mapel);
  v_now         timestamptz := now();
  v_grace_ms    bigint := 120000;
  v_row         public.exam_timer_sessions%ROWTYPE;
  v_over_ms     bigint := 0;
  v_within      boolean := true;
  v_elapsed_min integer := 1;
  v_flag        text := 'ON_TIME';
BEGIN
  SELECT * INTO v_row
  FROM public.exam_timer_sessions
  WHERE session_key = v_key
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', true,
      'withinGrace', true,
      'lateFlag', 'ON_TIME',
      'elapsedMin', 1
    );
  END IF;

  v_over_ms := GREATEST(0, (extract(epoch FROM (v_now - v_row.deadline_at)) * 1000)::bigint);
  v_within := (v_over_ms <= v_grace_ms);
  v_elapsed_min := GREATEST(1, round(extract(epoch FROM (v_now - v_row.started_at)) / 60.0)::integer);
  v_flag := CASE WHEN v_within THEN 'ON_TIME' ELSE ('LATE_' || ceil(v_over_ms / 60000.0)::integer || 'M') END;

  UPDATE public.exam_timer_sessions
  SET status       = 'SUBMITTED',
      submitted_at = v_now,
      flag_waktu   = v_flag,
      updated_at   = v_now
  WHERE session_key = v_key;

  RETURN jsonb_build_object(
    'success', true,
    'serverNowMs', (extract(epoch FROM v_now) * 1000)::bigint,
    'startedAtMs', (extract(epoch FROM v_row.started_at) * 1000)::bigint,
    'deadlineMs', (extract(epoch FROM v_row.deadline_at) * 1000)::bigint,
    'overMs', v_over_ms,
    'withinGrace', v_within,
    'lateFlag', v_flag,
    'elapsedMin', v_elapsed_min
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_exam_timer_duration_v95(
  p_apply_all    boolean,
  p_mapel        text,
  p_duration_min integer
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_dur   integer := GREATEST(10, LEAST(240, COALESCE(p_duration_min, 70)));
  v_count integer := 0;
BEGIN
  UPDATE public.exam_timer_sessions
  SET duration_min = v_dur,
      deadline_at  = started_at + make_interval(mins => v_dur),
      updated_at   = now()
  WHERE status = 'ACTIVE'
    AND (COALESCE(p_apply_all, false) = true OR lower(mapel) = lower(trim(COALESCE(p_mapel, ''))));

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

REVOKE ALL ON FUNCTION public.start_or_resume_exam_timer_v95(text,text,text,text,text,integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.validate_exam_submission_time_v95(text,text,text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_update_exam_timer_duration_v95(boolean,text,integer) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.start_or_resume_exam_timer_v95(text,text,text,text,text,integer) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.validate_exam_submission_time_v95(text,text,text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.admin_update_exam_timer_duration_v95(boolean,text,integer) TO service_role;
