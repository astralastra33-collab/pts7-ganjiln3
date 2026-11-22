-- =========================================================================
-- SQL_RLS_SUPABASE_V91.sql — PENGUNCIAN ROW LEVEL SECURITY (RLS) SUPABASE
-- UNTUK SICIBINAGA KELAS 7 (EDISI V91 - SECURITY HARDENING TAHAP 1)
-- =========================================================================
-- PENTING SEBELUM MENJALANKAN SCRIPT INI:
-- 1. Pastikan Anda sudah memasukkan SUPABASE_SERVICE_ROLE_KEY ke dalam
--    Google Apps Script -> Project Settings -> Script Properties.
-- 2. Pastikan kode Edisi V91 sudah di-deploy di Google Apps Script.
-- 3. Tempel & klik RUN pada script ini di Supabase Dashboard -> SQL Editor.
-- =========================================================================

-- 1. Aktifkan Row Level Security (RLS) pada tabel jawaban_ujian
ALTER TABLE public.jawaban_ujian ENABLE ROW LEVEL SECURITY;

-- 2. Bersihkan seluruh policy lama yang terlalu longgar (jika ada)
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'jawaban_ujian'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.jawaban_ujian', pol.policyname);
  END LOOP;
END $$;

-- 3. CABUT seluruh akses langsung (SELECT, INSERT, UPDATE, DELETE) dari role publik (anon/authenticated)
--    Artinya: Browser siswa dengan ANON KEY TIDAK BISA lagi mengintip jawaban teman,
--    TIDAK BISA menghapus baris ujian, dan TIDAK BISA memalsukan nilai!
--    Sementara role `service_role` (dipakai oleh Code.gs di sisi server) tetap memiliki akses penuh.
REVOKE ALL ON TABLE public.jawaban_ujian FROM anon, authenticated;

-- 4. Fungsi RPC Aman #1: Membaca riwayat ujian milik siswa sendiri SAJA
--    - Hanya mengembalikan kolom (mapel, nilai, created_at) -> KOLOM `jawaban` TIDAK PERNAH DIKIRIM!
--    - Membutuhkan nama minimal 2 karakter agar tidak bisa melakukan dump massal.
CREATE OR REPLACE FUNCTION public.get_my_exam_history_v91(p_nama text)
RETURNS TABLE (
  mapel text,
  nilai text,
  created_at text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_nama IS NULL OR char_length(trim(p_nama)) < 2 THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    j.mapel::text,
    j.nilai::text,
    j.created_at::text
  FROM public.jawaban_ujian j
  WHERE lower(trim(j.nama::text)) = lower(trim(p_nama))
  ORDER BY j.created_at DESC NULLS LAST;
END;
$$;

-- 5. Fungsi RPC Aman #2: Menyimpan / Memperbarui jawaban ujian milik siswa sendiri
--    - Tidak pernah mengizinkan siswa mengubah kolom `nilai` atau `created_at`.
--    - Mencegah manipulasi jawaban setelah 3 jam sejak baris pertama kali dibuat.
--    - Bekerja baik jika tabel memiliki UNIQUE constraint (nama, mapel) maupun tidak.
CREATE OR REPLACE FUNCTION public.upsert_my_exam_answer_v91(
  p_nama text,
  p_kelas text,
  p_mapel text,
  p_jawaban text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_clean_nama  text := trim(COALESCE(p_nama, ''));
  v_clean_kelas text := trim(COALESCE(p_kelas, ''));
  v_clean_mapel text := trim(COALESCE(p_mapel, ''));
  v_existing_ct timestamptz;
  v_found       boolean := false;
BEGIN
  IF char_length(v_clean_nama) < 2 OR char_length(v_clean_mapel) < 2 THEN
    RAISE EXCEPTION 'Nama siswa dan mata pelajaran tidak valid.';
  END IF;

  SELECT true, j.created_at
  INTO v_found, v_existing_ct
  FROM public.jawaban_ujian j
  WHERE j.nama = v_clean_nama AND j.mapel = v_clean_mapel
  LIMIT 1;

  IF v_found THEN
    -- Cegah perubahan jawaban jika sudah melewati 3 jam (180 menit) sejak mulai tercatat
    IF v_existing_ct IS NOT NULL AND (now() - v_existing_ct) > interval '3 hours' THEN
      RAISE EXCEPTION 'Sesi ujian untuk mata pelajaran ini sudah terkunci.';
    END IF;

    UPDATE public.jawaban_ujian
    SET kelas = v_clean_kelas,
        jawaban = p_jawaban
    WHERE nama = v_clean_nama AND mapel = v_clean_mapel;

    RETURN jsonb_build_object('status', 'updated');
  ELSE
    INSERT INTO public.jawaban_ujian (nama, kelas, mapel, jawaban)
    VALUES (v_clean_nama, v_clean_kelas, v_clean_mapel, p_jawaban);

    RETURN jsonb_build_object('status', 'inserted');
  END IF;
END;
$$;

-- 6. Berikan izin eksekusi HANYA pada 2 fungsi RPC aman tersebut untuk role publik
REVOKE ALL ON FUNCTION public.get_my_exam_history_v91(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.upsert_my_exam_answer_v91(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_exam_history_v91(text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.upsert_my_exam_answer_v91(text, text, text, text) TO anon, authenticated, service_role;

-- =========================================================================
-- VERIFIKASI: Jalankan kueri di bawah ini untuk memastikan RLS sudah aktif:
--   SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'jawaban_ujian';
-- Hasil harus menunjukkan: relrowsecurity = true
-- =========================================================================
