# PANDUAN LENGKAP PENGGUNAAN & DOKUMENTASI SISTEM SICIBINAGA KELAS 7 (EDISI V66)
**SMPN 3 Bangil — Smart Learning Management System (LMS), Live Arena Turnamen, & Computer-Based Test (CBT) Terintegrasi AI**

---

## A. KONFIGURASI UTAMA & ARSITEKTUR SERVER
1. **Integrasi Database & 4 API Key Groq Kelas 7 (`Code.gs`)**:
   - `SPREADSHEET_ID`: `1YZ-TlyZ4FAuhtaYHQyuaLi3rDrwjJWopIdJ9--jWdII`
   - `GROQ_CBT_API_KEY_K7`, `GROQ_LMS_API_KEY_K7`, `GROQ_STUDENT_TUTOR_API_KEY_K7`, & `GROQ_VIDEO_API_KEY_K7` (Model Utama: `openai/gpt-oss-120b` / `openai/oss120b`).
   - **Realtime Database Supabase**: `https://xraqhfkrwwvlkvoulzuv.supabase.co` untuk penyimpanan jawaban ujian CBT terenkripsi, kehadiran *Live Monitor Omni-Activity*, serta *Leaderboard* & *Live Arena*.

2. **Komposisi Palet Warna Proporsional (60% Hijau Zamrud : 40% Aksen Multi-Warna)**:
   - **60% Hijau Zamrud (*Emerald Green* — `#059669`, `#10b981`, `#047857`, `#064e3b`, `#ecfdf5`)**: Struktur utama navigasi Sidebar, Header, tombol aksi utama, dan identitas Ruang Belajar Kelas 7.
   - **15% Emas Hangat (*Warm Gold & Amber* — `#fbbf24`, `#f59e0b`, `#fef3c7`)**: Poin XP, Lencana Kehormatan, indikator menu aktif di Sidebar/Bottom Bar, serta tombol Ragu-ragu CBT.
   - **13% Biru Samudra & Sian (*Ocean Teal & Sky Blue* — `#0d9488`, `#0284c7`, `#0ea5e9`)**: Kartu Pintar 3D (*Flashcards*), Peta Konsep, cincin progres, kartu KPI analitik, serta tombol akses Ujian Akhir (CBT).
   - **12% Ungu Indigo & Koral (*Royal Indigo, Violet & Coral Rose* — `#4f46e5`, `#7c3aed`, `#f43f5e`)**: Banner 3D Toga Tujuan Pembelajaran, Asisten Belajar AI Tutor, Live Arena Turnamen, dan lencana HOTS.

---

## B. ATURAN KEAMANAN BROWSER & KOMPATIBILITAS PERANGKAT (V65)
1. **Smartphone & Tablet Android (Wajib 100% Google Chrome Murni)**:
   - Hanya mengizinkan akses melalui aplikasi **Google Chrome resmi**.
   - Seluruh browser pihak ketiga/bawaan HP yang rawan disalahgunakan untuk *Split-Screen* atau *Floating Window* (**Opera, Samsung Internet, Mi Browser Xiaomi, Vivo/Oppo/HeyTap Browser, Realme Browser, UC Browser, Brave, Firefox, Edge**, serta *In-App WebView* **WhatsApp/Instagram/Line/TikTok/Telegram**) **DIBLOKIR OTOMATIS**.
   - Tersedia tombol **"Buka Langsung di Google Chrome"** berbasis *Android Intent* (`package=com.android.chrome`) di layar blokir untuk memindahkan siswa dari WhatsApp/browser bawaan langsung ke Google Chrome dalam 1 sentuhan.
2. **iPhone & iPad / iOS (Full Support 100% Tanpa Kendala)**:
   - Mendukung penuh **Safari (Apple)** dan **Google Chrome iOS** untuk seluruh fitur aplikasi (Ruang Belajar LMS, Suara Narator & AI Tutor, Live Arena, hingga Ujian CBT).
   - Dilengkapi *Anti-Stuck Viewport Lockdown* (tidak memicu kunci layar penuh palsu yang tidak didukung iOS) dan *Anti-False-Blur* pada *iframe* Google Apps Script, sambil tetap mendeteksi pindah tab/aplikasi (`document.hidden` & `pagehide`) serta *Split-Screen*.
3. **Laptop / PC Desktop (Windows & Mac)**:
   - Mendukung **Google Chrome resmi** (serta **Safari** pada perangkat Mac).

---

## C. PANDUAN PENGGUNAAN UNTUK SISWA
### 1. Login, Profil, Bingkai Avatar & Ganti Kata Sandi
- Pilih **Kelas (7A–7H)**, masukkan **Username/Email** (otomatis terisi saat memindai QR Code Kartu Peserta), dan **Password**.
- Klik kartu profil di **Sidebar Kiri** atau **Avatar Kanan Atas** untuk membuka **Modal Profil & Progres**:
  - Unggah **Foto Profil** dan tulis **Status Kata Motivasi**.
  - Pasang **Bingkai Badge Avatar** yang telah dikoleksi dari Live Arena.
  - **Ubah Kata Sandi** secara mandiri dan lihat tabel rekap nilai per mata pelajaran.

### 2. Beranda, 4 Widget Rekap Real-Time & Lonceng Notifikasi
- **4 Widget Rekap Real-Time** (Rata-rata Skor & Indeks, Keaktifan & Refleksi, Poin XP & Eksplorasi, Ketuntasan LMS & CBT) dapat diklik untuk membuka rincian data asli dari server.
- **Lonceng Notifikasi Real-Time (`🔔`)**: Memantau balasan diskusi dari Guru/teman, tambahan XP, dan lencana baru.
- **Pengaturan Kenyamanan (`⚙️`)**: Mengatur tema layar (**Terang, Sepia Hangat, Malam Teduh**), dan **Timer Fokus Pomodoro 25:00** (+25 XP).

### 3. Ruang Belajar Konstruktif (LMS 5 Langkah Sederhana)
- **Langkah 1 (Pengantar & Tujuan)**: Membaca tujuan pembelajaran pada *Banner 3D Toga*, mengamati gambar visual dari Guru (klik untuk *zoom*), serta menonton **Video Interaktif AI (YouTube/GDrive)** lengkap dengan tugas analisis & kuis video (+40 XP).
- **Langkah 2 (Baca Materi)**: Membaca pilar sub-materi, mendengarkan **Narator Suara Otomatis (TTS)**, dan menekan tombol **"✅ Aku Sudah Paham Bagian Ini"** di setiap pilar.
- **Langkah 3 (Kartu Pintar 3D)**: Menyentuh kartu istilah untuk membalik secara 3D (*Auto-Flip*) yang langsung memverifikasi hafalan (+30 XP).
- **Langkah 4 (Tantangan Cerita)**: Menganalisis studi kasus nyata, meminta **Petunjuk Berpikir Sokratik AI Groq**, dan menulis Jurnal Refleksi (min. 10 kata) yang diverifikasi otomatis oleh AI (+45 XP).
- **Langkah 5 (Kuis Evaluasi & Klaim XP)**: Mengerjakan soal latihan HOTS. Jika ada jawaban yang belum tepat, klik **"Minta Bimbingan AI Groq"** agar AI memandu penalaran tanpa membocorkan kunci instan.
- **Laci Kontekstual (Diskusi, File Bahan Ajar, AI Tutor Bersuara, & Catatan Pintar)**:
  - **Laci Diskusi**: Mengirim komentar teks atau **Voice Note (Rekaman Suara)** dan menerima balasan Guru.
  - **Laci File**: Melihat pratinjau & mengunduh bahan ajar (PDF, PPT, DOC, Video, Audio) dari Guru.
  - **Laci AI Tutor**: Berdiskusi 24/7 dengan fitur **Suara AI: ON/OFF**.
  - **Laci Catatan Pintar**: Mencatat rangkuman per bab (+20 XP) dan mengunduhnya ke file `.TXT`.

### 4. Live Arena (Turnamen Kuis), Klasemen Terpadu & Toko 16 Badge Avatar
- **Turnamen 10 Soal Berjenjang**: Terdiri dari 4 soal Mudah, 3 Sedang, dan 3 Sulit/HOTS. Menghasilkan **Poin Koin Arena** yang terpisah dari XP Modul LMS.
- **Menu Klasemen Terpadu**: Menampilkan Podium Top 3, Rapor Performa Pribadi, Klasemen Turnamen per Mapel, Klasemen Total XP LMS, dan Klasemen Rombel (7A–7H).
- **Toko Poin (16 Bingkai Badge Avatar)**: Menukarkan Poin Koin Arena dengan 16 bingkai avatar beranimasi (*Cyber-Pop, Anime Sakura, Mecha Gundam, Kitsune Spirit, Emerald Dragon, Solar Phoenix, Celestial Emperor*, dll.).

### 5. Portal Ujian Akhir (CBT Steril Anti-Cheat)
- Berdiri terpisah dari LMS; saat memasuki Portal Ujian maupun sesi Ujian CBT, seluruh komponen bantuan LMS dinonaktifkan secara fisik dari layar.
- Mendukung **6 Tipe Soal AKM**: Pilihan Ganda (`PG`), Pilihan Ganda Kompleks (`PGK`), Benar-Salah Card Layout (`BS`), Menjodohkan (`MJ`), Sebab-Akibat (`SA`), dan Isian Singkat (`IS`).

---

## D. PANDUAN PENGGUNAAN UNTUK GURU & ADMINISTRATOR
1. **Format Impor Word (`.docx`) & Smart Import Bank Soal (V64)**:
   - Mendukung penuh file Word yang menggunakan **Auto-Numbering (`List Paragraph`)** maupun penomoran ketik manual (`1.`, `2.`, dst.).
   - Mendukung opsi jawaban berhuruf (`A.`, `B.`, `C.`, `D.`) ke bawah, menyamping dalam satu baris, maupun 4 baris opsi tanpa huruf di bawah kalimat soal.
   - Mendukung **tabel stimulus kecil** di tengah soal (otomatis dikonversi menjadi teks rapi di dalam soal) maupun **Tabel Soal Word 6+ Kolom** (`No | Soal | Opsi A | Opsi B | Opsi C | Opsi D | Kunci | Tipe`).
   - **4 Cara Menandai Kunci Jawaban di Word**:
     1. Menulis baris `Kunci: A` (atau `Kunci: A,C` untuk PGK / `Kunci: B,S,B,S` untuk BS) di bawah opsi soal.
     2. Memberi tanda bintang di depan opsi benar (contoh: `*A. Biologi`).
     3. Mencetak **Tebal (Bold)** atau memberi garis bawah pada teks opsi yang benar.
     4. Mencantumkan daftar kunci jawaban kolektif di akhir dokumen.
2. **Studio Materi & Kuis AI (LMS)**:
   - Membuat modul 5 tahap + kuis formatif HOTS dalam **1x Request API Groq**.
   - Mengunggah gambar materi manual, link video YouTube/Google Drive + analisis AI, serta file bahan ajar ke Tab File siswa.
3. **Live Monitor Omni-Activity (V63)**:
   - Memantau secara *real-time* seluruh siswa yang sedang online di **Ruang LMS, Ujian CBT, Live Arena, dan Beranda** lengkap dengan indikator fokus layar, log jejak individu, tombol **Reset & Kick**, serta **Ekspor Excel (`.xlsx`)**.
4. **Rekap Nilai, Berita Acara Terurut & Pengaturan Kunci LMS**:
   - Mencetak Berita Acara dengan 3 pilihan urutan (Abjad Nama, Pelanggaran Terbanyak, atau Nilai Tertinggi) dan mengekspor laporan lengkap `.xlsx` (2 Sheet: Rekap Nilai & Rincian Jawaban Per Nomor Soal).
   - Mengunci atau membuka akses **Menu Ruang Belajar (LMS)** dan **Menu Ujian Akhir (CBT)** secara global maupun per mata pelajaran.

---

## E. PEMBARUAN EDISI V67 (BERANDA & PORTAL UJIAN BENTO UI)
1. **Menu Beranda — Progres Mata Pelajaran Berbasis Persentase**:
   - Menyajikan ringkasan persentase pengerjaan menyeluruh (cincin persentase total + bilah persentase **Modul LMS** dan **Ujian CBT**) beserta daftar persentase seluruh mata pelajaran dilengkapi filter (*Semua, Tuntas 100%, Berjalan, Belum Mulai*).
2. **Menu Beranda — Rekaman Seluruh Aktivitas Terakhir LMS Mendetail**:
   - Menggantikan daftar jadwal simulasi dengan log rekaman seluruh aktivitas siswa di dalam LMS secara kronologis dan mendetail: membuka ruang/bab LMS, perpindahan tahap 1–5, durasi baca aktif, ceklis pemahaman sub-konsep, Kartu Pintar 3D, evaluasi Jurnal Refleksi AI, Catatan Pintar, Forum QnA & balasan Guru, diskusi AI Tutor, presensi harian, dan status pengumpulan CBT.
3. **Portal Ujian Akhir (CBT) — UI Bento Steril & Fokus Mapel**:
   - Menghapus **Tabel Rincian Status Ujian CBT** dan **Daftar Sesi Jadwal Ujian** agar tampilan portal ujian berfokus 100% pada kartu Bento mata pelajaran yang akan diujikan, dilengkapi *Spotlight Card* untuk mapel siap ujian, 3 ubin ringkasan status interaktif, dan filter cepat.

---

## F. PEMBARUAN EDISI V68 (MENU RUANG BELAJAR LMS — UI & UX BENTO STYLE)
1. **Bento Top Deck Interaktif**:
   - Memadukan **Hero Bento LMS** (dengan tombol dinamis *Lanjutkan Modul Terakhir*) dan **3 Ubin Metrik Interaktif** (*Progres LMS %*, *Mapel Bermodul*, *Tuntas 100%*) yang langsung memfilter katalog saat diklik.
2. **Katalog Mata Pelajaran Bento Grid + Spotlight Card**:
   - Mata pelajaran yang terakhir dibuka atau sedang dipelajari tampil menonjol sebagai **Spotlight Bento Card** (2 kolom), lengkap dengan pratinjau bab berikutnya, chip komponen (*Jumlah Bab*, *Video AI*, *Kuis XP*, *Skor*), bilah progres persentase, dan tombol aksi cepat.
   - Mendukung filter cepat (*Semua, Ada Modul, Berjalan, Tuntas, Dikunci*), pengurutan dinamis (*Prioritas Belajar, Progres Tertinggi, Modul Terbanyak, A–Z*), pencarian judul mapel maupun judul bab, serta tetap mematuhi fitur **Kunci Manual LMS** dari Admin.

---

## G. PEMBARUAN EDISI V69 (DUAL MODE UJIAN PTS & PAS + MODE GURU/ADMIN + SUPABASE REAL-TIME)
1. **Menu Mode Guru/Admin di Portal Ujian CBT (`#eduview-assignments`)**:
   - Guru/Admin dapat masuk ke **Mode Guru / Admin** langsung dari Portal Ujian CBT untuk memilih dan mengunci **Mode Ujian Aktif (`PTS` atau `PAS`)** dalam 1 klik.
   - Mode aktif disimpan permanen di Sheet **`Pengaturan`** (`Mode Ujian Aktif`) melalui `saveExamModeConfigServerV69()` dan disiarkan *real-time* ke seluruh perangkat siswa melalui **Supabase Realtime Broadcast (`cbt-exam-mode-sync-v69`)**.
2. **Read/Write Supabase Tepat Sasaran Tanpa Migrasi SQL**:
   - Seluruh perekaman auto-save & pengumpulan ujian di tabel Supabase `jawaban_ujian` dipisahkan otomatis menggunakan kunci **`[PTS] <Mapel>`** dan **`[PAS] <Mapel>`** serta metadata terenkripsi `"__exam_mode"`, sehingga data PTS tidak pernah tertimpa oleh sesi PAS (data PTS lama/*legacy* tanpa prefiks tetap terbaca utuh sebagai PTS).
   - Dilengkapi indikator status koneksi Supabase (*live sync* & *auto-save*) di Portal CBT maupun layar pengerjaan soal, serta proteksi kunci mode sesi (`activeExamSessionModeV69`) selama ujian berlangsung.
3. **Filter Mode PTS / PAS di Panel Admin**:
   - Tab **Rekap Nilai**, **Analisis Butir Soal**, **Cetak Berita Acara**, **Ekspor Excel**, dan **Reset & Kick** kini mendukung pemilahan dan tindakan tepat sasaran khusus **Mode PTS** atau **Mode PAS**.

---

## H. PEMBARUAN EDISI V70 (BENTO STYLE BERANDA & VISUAL WIDGET TIDAK MONOTON)
1. **Progres Mata Pelajaran (Rekap Persentase) — Bento Mosaic**:
   - **Asymmetric Top Deck**: Memadukan 1 **Gauge Ring Tile** total persentase pengerjaan di sebelah kiri dengan 2 **Mini Metric Tiles** (*Modul LMS %* biru dan *Ujian PTS/PAS %* emas) di sebelah kanan.
   - **Variasi Kartu Mapel Tidak Monoton**: Menampilkan 1 **Spotlight Bento Card** (2 kolom) untuk mapel dengan progres tertinggi/rekomendasi, diikuti ubin persegi **2×2 Radial Icon Tiles** (cincin persentase mengelilingi ikon khas tiap mapel), serta **Horizontal Bento Rail** yang dapat digeser menyamping untuk sisa mata pelajaran agar halaman Beranda tetap ringkas di smartphone.
2. **Rekaman Aktivitas Terakhir LMS — Bento Pulse & Connected Timeline**:
   - **Bento Pulse Deck**: Menampilkan kartu **Aktivitas Terbaru (Spotlight Dark Card)** lengkap tombol lanjutkan 1-sentuhan, **Widget Stacked Bar Komposisi Aktivitas** (*Modul, Refleksi, AI/QnA, CBT*), dan ubin **Total Jejak Aktivitas**.
   - **Timeline Vertikal Bersih & Ringkas**: Menggantikan tumpukan kartu panjang yang monoton dengan garis timeline vertikal berkode warna, deduplikasi aktivitas berulang, serta tombol perluas/ringkas otomatis.

---

## I. PEMBARUAN EDISI V71 (LIVE ARENA KUIS — BENTO ARCADE UI & UX SERU)
1. **Compact Arcade Host & Status Bar**:
   - Mengemas kontrol Host Live Arena & Mode Guru menjadi bilah status modern yang ringkas dengan indikator `LIVE ARENA AKTIF / ARENA ISTIRAHAT`, chip `PIN`, informasi mode kelas, dan tombol cepat **Mode Guru** & **Studio Soal**.
2. **Bento Arcade Hero Mosaic**:
   - **Player Arcade Bento Card**: Menampilkan Avatar + Bingkai Badge universal, saldo **Poin Arena** interaktif, dan **Progress Bar Target Badge Berikutnya** untuk memicu semangat mengumpulkan poin.
   - **Raja Kuis Minggu Ini & 3 Aksi Arcade**: Menampilkan juara mingguan, tombol **🎲 Putar Kuis Acak (Roulette Spin)**, pintasan **Klasemen**, dan **Toko 16 Badge**.
3. **Tantangan Harian Spotlight & Katalog Mapel Bento Mosaic**:
   - Menyajikan banner **Kuis Kilat Harian** lengkap dengan pratinjau 3 jenjang kesulitan (*Mudah, Menengah, Sulit & HOTS*) dan bonus *Combo Streak x2*.
   - Grid Bento Kuis Mata Pelajaran dilengkapi filter cepat (*Semua, Siap Main, Pernah Main, Terkunci*), **Spotlight Card (2 kolom)** untuk mapel utama, skor terbaik pribadi (*Best Points*), animasi *roulette flash* saat **Putar Kuis Acak**, serta tampilan kunci yang tetap jernih & rapi.

---

## J. PEMBARUAN EDISI V72 (EDITORIAL BENTO BAB MENU LMS & 5 LANGKAH BELAJAR KONSTRUKTIF — ANTI COGNITIVE OVERLOAD)
1. **Tampilan Hub Bab Menu LMS (`#lms-subject-modules-hub-view`) — Editorial Bento Style**:
   - **Featured Wide Horizontal Bento Card**: Menampilkan bab prioritas/fokus dengan sampul visual (gambar unggahan Guru atau grafis editorial), tag gelap (`BAB X`), metadata ringkas (`5 Langkah Konstruktif • Kuis XP`), tujuan belajar 2 baris, nama penyusun, dan tombol aksi utama 1-klik.
   - **3-Column Editorial Bento Grid**: Memadukan kartu **Pemantik & Diskusi Kelas** (panel dalam berwarna lembut + pratinjau diskusi terakhir + tombol CTA penuh), kartu-kartu visual bab lainnya, serta ubin pintar (*Peta 5 Langkah* & *Alat Belajar*) agar tata letak selalu seimbang meski baru tersedia 1–2 bab.
2. **Environment 5 Langkah Belajar Konstruktif (`#lms-module-reader-view`) — Zero Cognitive Overload**:
   - **Single Unified Sticky Header**: Menghilangkan duplikasi header ganda di layar baca; menyediakan tombol `Daftar Bab`, 3 tombol alat ringkas (`Suara`, `Diskusi`, dan popover `Alat & AI` berisi AI Tutor, Catatan Pintar, File Bahan Ajar, Peta Konsep, serta Edit Mode Guru), 5 pil progres interaktif, dan panduan 1 kalimat tenang per langkah.
   - **Langkah 1–5 Berbasis Bento Interaktif**:
     - *Langkah 1*: Kartu tujuan horizontal + kartu Pemantik dengan reaksi cepat (`🤩 Penasaran!`, `🤔 Baru Tahu`, `🚀 Siap Eksplor`) + *progressive disclosure* untuk Video AI.
     - *Langkah 2*: Kartu pilar materi bernomor (`01`, `02`, `03`) dengan contoh nyata yang dapat dibuka-tutup, tombol `Tandai Aku Sudah Paham`, dan Fakta Unik lipat.
     - *Langkah 3*: Grid 2-kolom Kartu Pintar 3D (*auto-flip = langsung terverifikasi +30 XP*) + intisari cepat.
     - *Langkah 4*: Bento 2-kolom Studi Kasus (dengan petunjuk Sokratik AI Groq lipat) & Jurnal Refleksi (dilengkapi *starter chips* anti-buntu + indikator jumlah kata *real-time*).
     - *Langkah 5*: Kuis evaluasi Bento bersih dengan chip verifikasi 3 misi yang dapat diklik, opsi sentuh lega, dan tombol Petunjuk AI per soal.

---

## K. PEMBARUAN EDISI V73 (HARMONISASI ORGANIC-PLAYFUL MULTI-COLOR BENTO LMS)
1. **Palet Warna Variatif & Anti-Lelah Mata (*Eye-Care Botanical Bento*)**:
   - Memadukan kanvas krem hangat (`#f6f5f0`), permukaan kartu *warm-stone* (`#efede6`), kartu gradien hijau zamrud/botanikal (`#16a34a`–`#059669`), serta 6 palet pastel lembut variatif (*Mint, Sky, Amber, Violet, Rose, Teal*) yang berotasi pada kartu mapel, bab, pilar materi, dan Kartu 3D agar siswa tidak bosan maupun mengalami kelelahan visual (tetap mendukung penuh Mode Malam & Sepia).
2. **Harmonisasi Menyeluruh Menu LMS (`#eduview-courses`) & Hub Bab (`#lms-subject-modules-hub-view`)**:
   - **Header Editorial 2-Warna** + **Row 1 Asimetris**: Kartu *Workspace* dengan tombol lingkaran hijau `▶` & pratinjau kartu miring (*tilted mini-workspace preview*) + Kartu Metrik Hijau Botanikal berangka besar (`XX%`).
   - **Row 2 Mosaic 4-Slot**: Kartu Kutipan/Pemantik Hijau, Kartu Matriks Ikon Multi-Warna (akses cepat mapel/bab & fitur), Kartu **SVG Connected 5-Node Workflow** (klik simpul 1–5 langsung masuk ke tahap terkait), dan Kartu **Belajar Cerdas dgn AI** bertombol panah lingkaran hijau (`→`).
3. **Anti-*Cognitive Overload* & Anti-Bosan di 5 Langkah Belajar (`#lms-module-reader-view`)**:
   - **Langkah 2 (Mode Fokus 1 Kartu vs Lihat Semua)**: Secara *default* menampilkan 1 kartu pilar materi pastel per layar lengkap dengan tombol `Paham & Lanjut Bagian Berikutnya` dan indikator titik progres, mencegah dinding teks panjang.
   - **Langkah 3 (Kartu Pintar 3D Multi-Warna + Acak Kartu 🔀)**: Kartu 3D berpalet warna lembut yang dapat diacak untuk latihan daya ingat lebih seru.

---

## L. PEMBARUAN EDISI V74 (AUDIT & PERBAIKAN BUG MENYELURUH)
1. **Perbaikan SyntaxError & ReferenceError di `Code.gs`**:
   - Memperbaiki string *multiline* `.join('\n\n')` pada `evaluateStudentVideoAssignmentGroq()` agar lolos kompilasi ketat Google Apps Script V8.
   - Memperbaiki 3 referensi variabel `sheet.getRange(...)` menjadi `sheetQna.getRange(...)` pada inisialisasi otomatis sheet `LMS_QnA`.
2. **Perbaikan Laci Diskusi & File Bahan Ajar di Ruang Baca LMS V72/V73**:
   - Menambahkan kembali `id="trn-reader-shell-box"`, `id="trn-right-pane-body"`, `id="trn-right-pane-footer"`, serta fungsi `closeV60ContextualSideDrawer()` agar tombol **Diskusi** dan **File Bahan Ajar** terbuka dan tertutup mulus.
3. **Perbaikan Persistensi & Responsivitas UI LMS**:
   - Menyimpan ceklis pemahaman Langkah 2 (`toggleSubConceptCheck`) secara permanen ke `localStorage` (`tr.subChecked`), mereset indeks pilar Fokus 1 Kartu saat pindah bab, memperbarui counter Kartu 3D secara *live* saat dibalik, sinkronisasi otomatis UI setelah login Mode Guru, penutupan *click-away* pada popover **Alat & AI**, dan perbaikan kontras **Mode Malam**.

---

## M. PEMBARUAN EDISI V75 (NOVAVOLT BENTO MENU LMS, PENGHAPUSAN UNIVERSAL AI TUTOR/CATATAN/PETA KONSEP, & DIFERENSIASI BAB)
1. **Tampilan Awal Menu LMS (`#eduview-courses`) — NovaVolt Bento Showcase**:
   - Mengadaptasi komposisi asimetris 3 kolom modern: Kartu Tipografi `SICIBINAGA LMS 7` + Kartu *Portrait Story* 5-bar progres di kiri, Kartu Hero Pemandangan (*Scenic Sky & Meadow*) + Kartu Tracking Progres Berbukit Hijau + Kartu Taktil Gelap di tengah, serta Kartu Metrik Vertikal (XP & Mapel Bermodul) + Kartu Brand Hangat di kanan.
2. **Penghapusan Permanen & Universal**:
   - Menghapus total pilihan **AI Tutor**, **Catatan Pintar**, dan **Peta Konsep Bab** dari `Index.html` (termasuk laci samping & Bottom Bar Android), popover header ruang baca (diganti tombol langsung **Suara**, **Diskusi**, dan **File Bahan Ajar**), tab File, misi verifikasi XP, dan log aktivitas Beranda.
3. **Diferensiasi Palet Warna, Struktur Layout, & Konten Antar Bab**:
   - Setiap bab pada suatu mata pelajaran kini memiliki arsitektur kartu Bento dan identitas warna yang berbeda: **Bab 1** (*Discovery Emerald-Sky Wide Showcase*), **Bab 2** (*Royal Indigo Analytics + Daftar Pilar Interaktif & Radial Ring*), **Bab 3** (*Warm Terracotta Storyteller + Kutipan Kasus*), **Bab 4** (*Crimson-Slate Mastery + Aksi Ganda Materi/Kuis*), dan **Bab 5+** (*Ocean Teal + Diagram SVG 5 Simpul Interaktif*). Tema warna bab juga terbawa otomatis saat siswa memasuki ruang baca 5 langkah.

---

## N. PEMBARUAN EDISI V76 (PENYEDERHANAAN SOLID BOTTOM DRAWER LMS — 5 LANGKAH KONSTRUKTIF)
1. **Penghapusan Tombol Alat dari Solid Bottom Drawer (`#lms-fluid-dock`)**:
   - Menghapus permanen tombol **Diskusi**, **File**, **Panduan**, dan garis pemisah dari bilah bawah LMS (fitur Diskusi dan File tetap tersedia rapi di header atas ruang baca).
2. **Navigasi 5 Kolom Penuh & Proporsional**:
   - Bilah bawah LMS kini murni berisi 5 tombol navigasi langkah belajar konstruktif (**`1. Pengantar`**, **`2. Materi`**, **`3. Kartu 3D`**, **`4. Tantangan`**, **`5. Kuis XP`**) dalam grid `repeat(5, minmax(0, 1fr))` yang lebih lega, mudah disentuh, dan label teks tampil utuh tanpa terpotong di layar smartphone.

---

## O. PEMBARUAN EDISI V77 (LIVE ARENA KUIS — ULTRA-MODERN NEON EMERALD BENTO SHOWCASE)
1. **Top Pill Navigation & Host Control Bar**:
   - Mengemas kontrol Host Live Arena ke dalam bilah pil putih modern (status `LIVE AKTIF / ISTIRAHAT`, chip `PIN`, tautan cepat `Beranda • Klasemen • Toko Badge • Badge Saya`, sakelar pill `Buka/Aktif` & tombol `Studio Soal` saat Mode Guru aktif, tombol segarkan, serta tombol pil hitam `Mode Guru`).
2. **Bento Showcase 2 Baris High-Contrast (Monochrome White + Deep Obsidian + Neon Emerald Aurora)**:
   - **Baris 1 (3 Kolom Asimetris)**: Kartu Hero Hijau Prismatik Bergaris + tombol putih `Mulai Sekarang ▶`, Kartu Putih Aurora *Koleksi & Poinmu*, dan Kartu Gelap Obsidian berbingkai poster *Raja Kuis Puncak Pekan Ini*.
   - **Baris 2 (3 Kolom Seimbang)**: Kartu Putih *Putar Kuis Acak Seru*, Kartu Gelap Berkilau Cincin Hijau *Kuis Kilat Harian*, dan Kartu Gelap *Stacked Cover Fan* 5 sampul mata pelajaran bergaya sampul album interaktif yang dapat langsung diklik untuk bermain.
3. **Katalog Mapel Arena Minimalis & Responsif**:
   - Seluruh mata pelajaran dikemas serasi dalam nuansa *monochrome + neon emerald* lengkap dengan filter cepat (`Semua`, `Siap Main`, `Pernah Main`, `Terkunci`), kartu unggulan 2-kolom, dan efek animasi *roulette* hijau neon saat Putar Acak.

---

## P. PEMBARUAN EDISI V78 (EDITORIAL BENTO LANGKAH 2 MATERI + UPLOAD GAMBAR MANUAL MODE GURU/ADMIN)
1. **Menu Upload Gambar Manual Langsung pada Setiap Bagian Langkah 2 (Materi)**:
   - Di dalam **Langkah 2 (2. Materi)**, tersedia tombol **Mode Guru (Upload Gambar)** langsung di bilah atas sehingga Guru/Admin dapat mengaktifkan akses unggah tanpa harus keluar dari bab.
   - Setiap bagian materi (**Bagian 01, Bagian 02, Bagian 03, dst.**) memiliki zona **Upload Gambar Manual** yang mendukung unggah file langsung dari galeri HP/PC (dengan kompresi otomatis sisi klien agar cepat ke Google Drive) maupun tempel tautan URL/Google Drive, dilengkapi isian caption, fitur **Tambah Multi-Foto**, **Ganti**, dan **Hapus**.
   - Jika modul masih berupa modul bawaan (*default*), backend `saveSubMateriImageAdminV78()` otomatis menyimpannya ke Sheet `LMS_Materi` sehingga gambar tersimpan permanen.
2. **Adaptasi Editorial Bento Card pada Setiap Bagian Materi**:
   - **Bagian 01 (atau Mode Fokus 1 Kartu)**: Dikemas sebagai **Wide Horizontal Editorial Bento Card** (foto berbingkai rounded 16:10 + *hover zoom* + caption di kiri, tag pil gelap `Bagian 01` + breadcrumb + judul + uraian + panel *Contoh Nyata* + tombol Paham di kanan).
   - **Bagian 02, 03, dst. (Mode Lihat Semua)**: Dikemas sebagai **Vertical Photo Editorial Bento Cards** dalam grid 2 kolom (foto besar di atas + thumbnail switcher bila >1 foto + pil warna `Bagian 02/03` + judul + uraian + kartu *Contoh Nyata* lipat + tombol Paham).
   - Seluruh gambar mendukung **Klik untuk Zoom (Lightbox Interaktif)** bagi siswa.

---

## Q. PEMBARUAN EDISI V79 (EDITORIAL BENTO LANGKAH 4 — TANTANGAN CERITA & REFLEKSI)
1. **Kanvas Soft-Mist & Kartu Putih Bersih Beraksen Royal Blue (`#4e73f8`)**:
   - **Baris 1 (Asimetris 3.05fr : 1fr)**: Kartu **Cerita Studi Kasus Lebar** (ilustrasi editorial gelap bersorot lampu hangat di kiri + judul, uraian cerita, penyusun, dan tombol suara di kanan) berdampingan dengan **Panel Navigasi Fokus 5 Baris** (*Amati Kasus, Pertanyaan, Petunjuk AI, Tulis Solusi, Kesiapan*) berikon aktif biru cerah.
   - **Baris 2 (3 Kolom Asimetris)**:
     - *Kolom Kiri*: **Kartu Potret Pertanyaan Inti** dengan ilustrasi editorial krem hangat & ringkasan misi `+45 XP`.
     - *Kolom Tengah*: **Bilah Ide Cepat + 4 Hashtag Starter** (`#MenurutPendapatku`, `#LangkahSolusi`, `#Kesimpulan`, `#Pencegahan`) di atas **Kartu Studio Refleksi Siswa** (avatar + bingkai badge, strip 3 metrik *live*: `Kata`, `Reward +45`, `Status`, kotak teks refleksi, serta tombol ganda `Petunjuk AI` dan `Simpan & Lanjut Kuis`).
     - *Kolom Kanan*: **Kartu Mini Panduan Solusi Terbimbing**, **2 Tombol Navigasi Bulat Kembar (`<` & `>`)** antar-langkah, dan **Kartu Tag Kesiapan Kuis** dengan garis tepi biru aktif.

---

## R. PEMBARUAN EDISI V80 (BOTANICAL 4-CARD ASYMMETRIC BENTO LANGKAH 4 — TANTANGAN)
1. **Komposisi 4 Kartu Bento Asimetris Organik & Modern**:
   - **Kartu 1 (Atas-Kiri, 2 Kolom — Sage-Lime Case Hero)**: Latar gradasi hijau *sage-lime* lembut berilustrasi modern siswa di *beanbag* hijau (atau foto bab), judul & uraian studi kasus, tombol pil gelap `Tulis Solusi →`, tombol pil putih `Petunjuk AI`, serta tombol suara narator.
   - **Kartu 2 (Bawah-Kiri — Crisp White Workflows & Question)**: Menampilkan pertanyaan tantangan utama bersama panel inset lembut berisi **Panduan Solusi Terbimbing** (lipat) dan **3 Pil Kalimat Pembuka** 1-klik.
   - **Kartu 3 (Bawah-Tengah — Botanical Green Tracking & Tablet Refleksi)**: Latar hijau botanikal segar dengan bingkai **Tablet Dashboard Putih** yang memuat 3 metrik *live* (`Kata`, `Progres`, `Reward +45 XP`), kotak teks refleksi lega, slot evaluasi AI Groq, dan tombol `Simpan & Lanjut Kuis XP →`.
   - **Kartu 4 (Kanan Penuh 2 Baris — Collaboration & Misty Green Valley)**: Bagian atas putih bersih dengan 5 avatar melingkar bertumpuk & pintasan **Diskusi Kelas**, mengalir mulus ke ilustrasi **Lembah Hijau Berkabut** dengan panel kaca *Cek Kesiapan Kuis* (`Ragu`, `Paham`, `Siap!`) dan navigasi cepat `← Kartu 3D` / `Kuis XP →`.

---

## S. PEMBARUAN EDISI V81 (BACKGROUND FORUM CHAT KOLABORASI & SIMETRI SPACING BENTO UNIVERSAL)
1. **Langkah 4 Tantangan — Background Modern Icon Chat & Forum Diskusi**:
   - Mengganti latar kartu **Kolaborasi** menjadi ilustrasi vektor modern bernuansa *emerald-teal* berisi gelembung chat berlapis, indikator mengetik (`• • •`), lencana tanya jawab (`?` & `✓`), dan ikon forum diskusi interaktif yang tajam di desktop maupun smartphone (adaptif Mode Malam).
2. **Perbaikan Proporsi & Simetri Jarak Bento Live Arena Kuis**:
   - Memperbaiki pembungkus utama `.v81-arena-bento-stack` agar jarak vertikal antar baris (*Hero → Baris 1 → Baris 2 → Katalog Semua Arena*) 100% seimbang dan simetris dengan jarak horizontal antar kolom (tidak lagi menempel/dempet di smartphone).
3. **Sistem Spacing Bento Simetris Universal (Beranda, LMS, CBT, & Live Arena)**:
   - Menyeragamkan token jarak (`--v81-bento-gap`: `18px` desktop, `15px` tablet, `12px` smartphone) di seluruh *environment* SICIBINAGA, menyembunyikan slot kosong (`:empty`) untuk mencegah *double-gap*, serta menyeimbangkan *row-gap* dan *column-gap* agar seluruh grid Bento tampil rapi, presisi, dan utuh.

---

## T. PEMBARUAN EDISI V82 (NAVIGASI ATAS LMS SEJAJAR + POP-UP 1 HALAMAN PENUH DARK BLUR)
1. **Penjajaran 5 Tombol Navigasi Atas LMS (`.v82-top-tools-bar`)**:
   - Di bagian navigasi atas Ruang Baca LMS (dan di Hub Daftar Bab), tombol **Tanya AI Tutor** (`🤖`) dan **Catatan Materi** (`📝`) kini tampil sejajar secara proporsional bersama **Suara** (`🔊`), **Forum Diskusi** (`💬`), dan **Berkas Bahan Ajar** (`📎`) dalam 1 baris rapi di desktop maupun smartphone.
2. **Pop-Up Satu Halaman Penuh dengan Background Gelap & Blur (`#v82-lms-tool-modal`)**:
   - Menekan salah satu tombol **AI Tutor**, **Forum Diskusi**, **Catatan Materi**, atau **Berkas Bahan Ajar** membuka pop-up satu halaman penuh (`backdrop-filter: blur(16px)` di atas lapisan gelap `rgba(9, 13, 22, 0.78)`) dengan kartu putih modern, tab perpindahan cepat antar keempat fitur di header pop-up, tombol tutup `×` / tombol `Esc`, dukungan Mode Malam, serta sterilisasi otomatis saat sesi Ujian CBT aktif.

---

## U. PEMBARUAN EDISI V83 (PEMBERSIHAN HUB BAB & HEADER MINIMALIS "SICIBINAGA Ekosistem")
1. **Pembersihan Menu Pilih Bab (`#lms-subject-modules-hub-view`)**:
   - Menghapus permanen bar tombol **Tanya AI Tutor**, **Catatan Materi**, **Forum Diskusi**, dan **Berkas Bahan Ajar** dari tampilan awal bab / menu pilih bab modul belajar agar halaman pemilihan bab lebih bersih dan fokus pada daftar bab (keempat tombol beserta pop-up fullscreen *dark-blur* tetap tersedia rapi di dalam ruang baca bab aktif).
2. **Header Minimalis & Fungsionalis "SICIBINAGA Ekosistem"**:
   - Merombak header utama menjadi bilah putih membulat mengambang (*floating rounded minimalist bar*) 1 baris bersih dengan judul **`SICIBINAGA Ekosistem`**, tombol menu `☰` (membuka drawer di HP & melipat/membuka sidebar di desktop), 3 tombol bulat pastel (**Cari Cepat** dengan popover ramping, **Notifikasi Real-Time**, dan **Pengaturan Tema/Fokus**), **Avatar Siswa**, serta tombol pil bergaris tepi **`Presensi` / `Hadir ✓`**.

---

## V. PEMBARUAN EDISI V84 (HEADER SOLID HIJAU MODERN — EKOSISTEM PEMBELAJARAN / SICIBINAGA KELAS 7)
1. **Solid Modern Emerald Top App Bar (`.v84-solid-emerald-topbar`)**:
   - Merombak header utama menjadi bilah **solid edge-to-edge** berwarna **hijau zamrud modern** (`#065f46` → `#059669` → `#047857`) yang menyatu mulus dengan sidebar & bottom bar di desktop maupun smartphone (sudut bawah membulat `16px` di layar mobile persis gaya *native app bar*).
   - Menampilkan susunan judul 2 baris yang tegas & bersih: caption atas **`Ekosistem Pembelajaran`** dan judul utama **`SICIBINAGA Kelas 7`**, berdampingan dengan ikon putih bersih tanpa kotak ramai (**Menu `☰`**, **Cari `🔍`**, **Notifikasi `🔔`**, **Pengaturan `🎚️`**, **Presensi**, dan **Avatar Profil**).

---

## W. PEMBARUAN EDISI V85 (HEADER SOLID SMARTPHONE & PENGHAPUSAN TOTAL FITUR PRESENSI)
1. **Header Solid Hijau Modern Presisi Smartphone & Desktop (`.v85-solid-native-topbar`)**:
   - Memperbaiki aturan *responsive* layar kecil (`≤ 600px`) agar header selalu tampil **1 baris horizontal solid** penuh dari tepi ke tepi berwarna hijau zamrud modern (`#045b43` → `#057a55` → `#046c4e`).
   - Menampilkan caption atas **`PLATFORM BELAJAR`** (huruf kapital mint-hijau) dan judul utama **`SICIBINAGA Kelas 7`** (putih tebal), berdampingan dengan ikon putih minimalis (**Menu `☰`**, **Cari `🔍`**, **Notifikasi `🔔`**, **Pengaturan `🎚️`**) serta **Avatar Emas Lingkaran Putih**.
2. **Penghapusan Total & Permanen Fitur Presensi (Anti-Gimmick)**:
   - Menghapus seluruh tombol, fungsi (`markStudentDailyAttendance`), pencatatan `localStorage`, bonus XP presensi, dan rekaman log presensi di seluruh *environment* SICIBINAGA agar metrik keaktifan belajar 100% murni berasal dari aktivitas belajar nyata (LMS & CBT).

---

## X. PEMBARUAN EDISI V86 (FLOWSYNC-INSPIRED BENTO UI BERANDA MENU UJIAN AKHIR CBT)
1. **FlowSync High-Contrast Bento Showcase Stage (`.v86-cbt-flowsync-stage`)**:
   - Mengemas beranda Portal Ujian Akhir (CBT) dalam bingkai gelap obsidian (`#0b0f1a`) dengan palet kontras modern (**Vivid Mint `#3ef08e`**, **Electric Cobalt `#2563eb`**, **Ice Periwinkle `#d6e4ff`**, dan **Crisp White**).
   - **Kolom Kiri**: Kartu putih **Sistem Ujian Aman** dengan ilustrasi visor/perisai holografik & tombol **Cek Kesiapan Perangkat** (`cekKesiapanUjianSiswaV86()`), serta kartu biru kobalt **Sesi & Perangkat Siswa** berisi *mockup* jam/tanggal *live* dan indikator sesi tersimpan.
   - **Kolom Tengah**: **Bar 4 Segmen Warna Interaktif** (*Siap • Semua • Selesai • Terkunci*), **Kartu Hero Mint-Aurora** dengan tombol panah `↗` (*Quick Launch* langsung masuk ujian terbuka pertama), dan **Bar Hijau Mint `SICIBINAGA CBT`** dengan tombol **Sinkronkan**.
   - **Kolom Kanan**: **Kartu Metrik Besar Biru Kobalt** menampilkan jumlah mapel siap diujikan beserta ringkasan *Selesai | Terkunci | Mode PTS/PAS*, serta **Kartu `SUPABASE LIVE`** bergrafis node terhubung untuk cek & penyegaran status *auto-save* server.
2. **Harmonisasi Kartu Mapel & Quick-Resume Otomatis**:
   - Kartu *Spotlight* mapel utama berlatar obsidian dengan tombol hijau mint terang, kartu mapel terbuka beraksen putih-obsidian-kobalt, serta deteksi otomatis **Lanjutkan Sesi** jika siswa masih memiliki sesi ujian aktif yang tersimpan di perangkat.

---

## Y. PEMBARUAN EDISI V87 (DIFERENSIASI BENTO MINIMALIS FITUR BANTU vs PIL 5 LANGKAH BELAJAR LMS)
1. **Baris Fitur Bantu — Minimalist Soft-Tinted Bento Tiles (`.v87-bento-tools-grid`)**:
   - Mengemas 5 tombol fitur (**Suara**, **AI Tutor**, **Diskusi**, **Catatan**, **Berkas** + **Edit** saat Mode Guru) menjadi ubin Bento minimalis berlatar lembut *ice-slate* (`#e2ecf4`) tanpa border kaku, dengan tata letak asimetris bersih: **ikon di pojok kiri-atas**, **indikator/angka mikro di pojok kanan-atas** (`TTS/ON`, `AI`, jumlah diskusi, `✓/TXT`, jumlah berkas), dan **label teks di pojok kiri-bawah**.
   - Dilengkapi label mikro **`✦ FITUR BANTU BELAJAR`** dan perbaikan `toggleNarratorTTS()` agar status aktif (`ON` / `Stop`) tampil interaktif tanpa merusak tata letak ubin Bento.
2. **Baris 5 Langkah Pembelajaran — Clean White Capsule Stepper Pills (`.v87-steps-capsule-rail`)**:
   - Membedakan secara tegas 5 langkah belajar konstruktif (`1. Pengantar` s.d. `5. Kuis XP`) ke dalam rel **pil kapsul putih bersih** (`border-radius: 999px`) berlabel **`ALUR 5 LANGKAH BELAJAR • XX% Selesai`**, sehingga siswa dapat langsung membedakan mana tombol fitur alat bantu dan mana navigasi tahapan belajar di smartphone maupun desktop.

---

## Z. PEMBARUAN EDISI V88 (DUAL ENVIRONMENT BELAJAR LMS vs UJIAN CBT + GRADASI LOGIN ADAPTIF + TURBO SYNC ENGINE)
1. **Toggle Manual Dual Environment di Admin Dashboard (`#v88-admin-env-bar`)**:
   - Admin kini dapat beralih kapan saja antara **`Environment Belajar (LMS)`**, **`Environment Ujian (CBT)`**, atau **`Mode Terpadu (LMS + CBT)`** langsung dari Dashboard Admin.
   - Pengaturan disimpan permanen di Sheet **`Pengaturan`** (`Environment Aplikasi Aktif`) dan disiarkan *real-time* ke seluruh perangkat siswa (termasuk yang masih berada di layar Login) melalui Supabase Realtime Broadcast (`sicibinaga-env-sync-v88`).
2. **Pemisahan Konten Otomatis Tanpa Distraksi**:
   - **Environment Ujian (CBT)**: Menyembunyikan otomatis seluruh menu & widget LMS, Live Arena, Prestasi/Lencana, Streak/XP, serta mengganti Beranda menjadi **Beranda Fokus Ujian Steril** dengan nuansa visual *Midnight Indigo–Cobalt* agar siswa fokus penuh mengerjakan ujian.
   - **Environment Belajar (LMS)**: Menyembunyikan menu & widget Ujian CBT sehingga siswa fokus pada Ruang Belajar 5 Langkah & Live Arena bernuansa *Emerald–Teal*.
3. **Halaman Awal Login Siswa Adaptif (Gradasi Warna & Deskripsi Berbeda)**:
   - **Mode Belajar (LMS)**: Gradasi segar *Emerald Zamrud → Teal → Sky Aqua* lengkap dengan deskripsi & daftar fitur Ruang Belajar.
   - **Mode Ujian (CBT)**: Gradasi fokus *Midnight Obsidian → Deep Indigo → Royal Cobalt* lengkap dengan deskripsi sesi PTS/PAS & Tata Tertib Ujian CBT.
4. **Turbo Sync Engine Spreadsheet + Supabase Pasca-Login**:
   - **`CacheService` Backend (`Code.gs`)**: Mempercepat pembacaan konfigurasi awal & jadwal ujian (otomatis terinvalidasi saat Admin mengubah pengaturan).
   - **Jalur Cepat `getFastCBTBootstrapV88()`**: Saat Environment CBT aktif, siswa tidak lagi mengunduh/mengurai JSON modul LMS & QnA yang berat.
   - **SWR Instant Cache + Single-Pass Parallel Fetch (`Script.html`)**: Menggantikan *waterfall* 7 lapis `loadSubjects()` menjadi 1 batch `Promise.all([SpreadsheetAPI, SupabaseQuery])` + 1× `requestAnimationFrame` paint, serta menunda pemuatan sekunder secara *non-blocking*.

---

## AA. PEMBARUAN EDISI V89 (ARSIP MENYELURUH BANK SOAL TAHUNAN PTS/PAS KE GOOGLE DRIVE & EKSPOR MULTI-SHEET EXCEL)
1. **Arsip Menyeluruh Bank Soal ke Google Drive Jangka Panjang (`archiveAllBankSoalToDriveV89`)**:
   - Tersedia langsung pada Tab **Bank Soal** di Dashboard Admin (kartu kiri `Arsip Bank Soal ke GDrive`, tombol atas `Arsip Semua ke GDrive`, dan panel bawah `Arsip Bank Soal Tahunan`).
   - Membentuk struktur folder tahunan otomatis di Google Drive: `SICIBINAGA_Arsip_Bank_Soal_K7 / TP_2026-2027 / PTS_Ganjil (atau PAS_Ganjil) / Arsip_PTS_.../`.
   - Setiap sesi arsip menyimpan 4 format sekaligus: **Master Google Spreadsheet Multi-Mapel (+ Sheet RINGKASAN_ARSIP)**, **CSV per Mapel** (100% cocok untuk impor ulang), **Naskah TXT per Mapel**, dan **Backup `INDEX_ARSIP.json`**.
   - Dilengkapi opsi opsional *Kosongkan Bank Soal Aktif setelah arsip selesai* (dengan konfirmasi ganda) untuk memulai input soal semester/tahun ajaran baru.
2. **Riwayat Arsip Tahunan & Ekspor Lokal Multi-Sheet `.XLSX`**:
   - Seluruh arsip tercatat permanen di sheet sistem **`LMS_Arsip_BankSoal`** (terfilter otomatis agar tidak masuk daftar mapel ujian) dan ditampilkan dalam tabel riwayat berfilter mode (`Semua / PTS / PAS`) lengkap dengan tautan langsung ke Folder GDrive & Master Sheet.
   - Tombol **`Ekspor Semua (.XLSX)`** mengunduh seluruh mata pelajaran Bank Soal dalam 1 file Excel Multi-Sheet lokal.

---

## AB. PEMBARUAN EDISI V90 (SECURITY HARDENING SCRIPT PROPERTIES + FULL BUGFIX AUDIT)
1. **Migrasi 100% API Key Groq ke `PropertiesService.getScriptProperties()` (`Code.gs`)**:
   - Menghapus seluruh kunci *plaintext* (`gsk_...`) dari `Code.gs` dan menggantinya dengan `getGroqApiKeyPropV90()` (dengan *in-execution cache*, *smart fallback*, dan pesan error informatif bila properti belum diisi).
   - Menambahkan tombol **🛡️ Keamanan & API Key** pada header Dashboard Admin (`bukaModalStatusKeamananV90()` + `getSecurityScriptPropertiesStatusV90()`) untuk memverifikasi status keempat kunci secara aman tanpa membocorkan kunci penuh ke browser.
2. **Audit & Perbaikan Bug Menyeluruh (Tampilan, Fitur, & Fungsi)**:
   - **Tab Prestasi & Lencana (`grades`)**: Melengkapi pemanggilan `renderStudentEngagementWidgets()` dan `renderEduvanceHeatmapAndWeeklyBars()` pada Turbo Sync V88 & perpindahan tab `grades`.
   - **Isolasi Navigasi Dual Environment (`CBT` vs `LMS`)**: Menambahkan guard pada `switchEduvanceNav()` dan `openStudentLMS()` (termasuk klik daftar mapel di Sidebar) agar Environment Ujian CBT 100% steril dari kebocoran halaman LMS.
   - **Stabilitas Login & Ganti Akun**: Memulihkan label tombol `#btn-login` sesuai environment aktif saat gagal login serta mereset flag sinkronisasi awal saat login akun baru.
   - **Anti-Overflow Mobile**: Mengunci `overflow-x: hidden` dan gulir tabel responsif pada panel Arsip Bank Soal V89 & Toggle Admin V88.
3. **Panduan Keamanan Siap Pakai (`PANDUAN_KEAMANAN_V90.md`)**:
   - Disertakan langsung di dalam arsip ZIP mencakup panduan 2FA (Google, Supabase, Cloudflare), pengisian Script Properties GAS, dan konfigurasi Cloudflare SSL/TLS 1.3 + HSTS + WAF Geo-Block Indonesia.

---

## AC. PEMBARUAN EDISI V91 (SECURITY HARDENING TAHAP 1: RLS SUPABASE, SERVER PROXY, RATE LIMITING, SESSION TOKEN & 2FA OTP ADMIN)
1. **RLS Supabase & RPC Aman (`SQL_RLS_SUPABASE_V91.sql`)**:
   - Mengaktifkan Row Level Security pada `public.jawaban_ujian`, mencabut seluruh akses langsung tabel dari role publik (`anon`), dan menyediakan 2 fungsi `SECURITY DEFINER` (`get_my_exam_history_v91` & `upsert_my_exam_answer_v91`) dengan fallback otomatis di `Script.html` agar *zero-downtime*.
2. **Pemindahan Operasi Admin Supabase ke `Code.gs` (`service_role`)**:
   - Menambahkan `adminFetchAllJawabanSupabaseV91()` dan `adminResetJawabanSupabaseV91()` di `Code.gs` yang memverifikasi **Admin Session Token** lalu mengeksekusi operasi menggunakan `SUPABASE_SERVICE_ROLE_KEY` dari Script Properties.
3. **Rate Limiting Login (`CacheService`)**:
   - Melindungi `verifyLogin()` (maks 6 gagal → kunci 5 menit) dan `verifyAdmin()` (maks 5 gagal → kunci 5 menit) dari serangan *brute-force*.
4. **Server-Side Admin Session Token & 2FA OTP Email Admin**:
   - Setiap login Admin menerbitkan **Session Token 4 jam** di `CacheService` (dan otomatis dicabut saat logout).
   - Mendukung **2FA OTP 6-digit via Email (`MailApp`)** yang dapat diaktifkan/dinonaktifkan langsung dari tombol **🛡️ Keamanan & 2FA** di Dashboard Admin (dengan uji pengiriman email otomatis agar bebas risiko *lockout*).

---

## AD. PEMBARUAN EDISI V92 (SECURITY HARDENING TAHAP 2: ANTI LOGIN GANDA, SERVER EXAM TIMER, & HASHING PASSWORD BERTAHAP)
1. **Anti Login Ganda (*Single Active Session Lock*)**:
   - Backend (`issueStudentSessionV92`, `validateStudentSessionServerV92`, `clearStudentSessionServerV92`) menerbitkan `studentSessionId` unik per akun di `CacheService`, diverifikasi saat memulai ujian (`getQuestions`) & polling 45 detik selama CBT.
   - Frontend (`sicibinaga-session-guard-v92`) menyiarkan klaim sesi *real-time* yang langsung mengeluarkan perangkat lama (sambil mengamankan jawaban terakhir) dan mengirim peringatan *Login Ganda* ke Dashboard Admin.
2. **Validasi Waktu Mulai & Deadline Ujian di Server (`LMS_Exam_Sessions`)**:
   - `startOrResumeExamTimerServerV92()` dan `validateExamSubmissionTimeServerV92()` mencatat & memverifikasi waktu mulai ujian otoritatif di server Google (default 70 menit + toleransi jaringan 2 menit), sementara timer di browser memakai jam monotonik `performance.now()` yang kebal terhadap manipulasi jam HP.
   - Reset ujian oleh Admin (`adminResetJawabanSupabaseV91`) otomatis memanggil `clearServerExamTimerByAdminV92()` agar siswa mendapat waktu penuh saat mengulang.
3. **Hashing Password Bertahap (`Salted SHA-256`)**:
   - Format `sha256$<salt16>$<hash64>` otomatis diterapkan secara bertahap pada `verifyLogin()` (`Users`), `verifyAdmin()` (`Pengaturan` & `Guru`), `updateStudentPasswordClient()`, dan `saveGuruAccountAdmin()`.
   - `getSiswaKartuAdmin()` menampilkan `Terenkripsi (Sudah Aktif)` untuk akun ter-hash, serta tersedia statistik progres & tombol **Batch Hash Massal** pada modal **🛡️ Keamanan & 2FA** (plus fungsi `otorisasiIzinEmail2FA()` siap jalankan di `Code.gs`).

---

## AE. PEMBARUAN EDISI V93 (PERBAIKAN TOTAL LIVE MONITOR ANTI-PUTUS + PENGATURAN DURASI WAKTU UJIAN MANUAL REAL-TIME DI BANK SOAL)
1. **Perbaikan Total Live Monitor Omni-Activity (Dual-Layer Anti-Drop Telemetry)**:
   - **Akar Masalah Teratasi**: Menghilangkan badai `presenceChannel.track()` (yang sebelumnya dipicu setiap klik/ketikan soal hingga memicu *rate-limit eviction* Supabase di sekitar soal nomor 4 dan menampilkan `0 Siswa`), menghapus langganan `postgres_changes` yang ditolak RLS, menambahkan **Auto-Reconnect** dengan *exponential backoff* (`TIMED_OUT` / `CLOSED` / `CHANNEL_ERROR` + `online`), serta *Single-Interval Guard*.
   - **Arsitektur Dual-Layer Hybrid**: Progres soal (#1 s.d. #50+) dikirim melalui **Broadcast `omni_telemetry`** ber-*throttle* 1.2 detik + *heartbeat* 12 detik, sementara `presenceChannel.track()` hanya diperbarui ringan saat pindah zona atau tiap 18 detik. Admin menggabungkan keduanya dalam **Hybrid Live Registry** (TTL 45 detik) + tombol **📡 Panggil Sinyal** agar seluruh siswa yang sedang ujian tetap terpantau 100% sampai soal terakhir.
   - **Kapasitas Log Diperbesar**: Batas rekaman jejak dinaikkan dari 50 menjadi **250 entri per siswa** (1.500 entri global) agar seluruh perjalanan 50+ soal terekam utuh.
2. **Pengaturan Durasi Waktu Pengerjaan Ujian Manual & Real-Time di Bank Soal Admin**:
   - Menambahkan bilah kontrol **`Waktu Pengerjaan Ujian`** langsung di bawah pemilih mapel pada Tab **Bank Soal** lengkap dengan preset cepat (`45m`, `60m`, `70m`, `90m`, `120m`), input manual (`10–240 menit`), tombol **Simpan & Sinkron** (per mapel), dan **Semua Mapel**.
   - Disimpan aman di Sheet `Pengaturan` (`Durasi Mapel: <Mapel>`), memperbarui otomatis `Deadline_Ms` seluruh sesi `ACTIVE` di `LMS_Exam_Sessions`, dan disiarkan *real-time* (`exam_duration_updated`) ke Portal CBT maupun siswa yang sedang mengerjakan soal sehingga sisa timer langsung menyesuaikan tanpa *reload*.

---

## AF. PEMBARUAN EDISI V94 (DATABASE HEARTBEAT LIVE MONITOR — SKALA 255–500+ SISWA SERENTAK, ZERO WEBSOCKET)
1. **Arsitektur Database Heartbeat via PostgreSQL RPC (`SQL_LIVE_MONITOR_HEARTBEAT_V94.sql`)**:
   - Menambahkan tabel RLS-terkunci `public.live_monitor_siswa` (1 baris per siswa + kolom `recent_logs` JSONB hingga 120 jejak persisten) dan `public.app_runtime_config` (1 baris kontrol runtime).
   - Siswa mengirim 1 RPC ringan `student_heartbeat_v94` setiap ~15 detik (dengan *jitter* acak & *throttle* 4 detik) — **0 koneksi WebSocket**, **0 *fan-out***, dan **0 lag di HP siswa** bahkan saat **255–500+ siswa** ujian bersamaan di Supabase Free Tier.
2. **Kontrol Admin Terpadu & Persisten (`Code.gs` + `Script.html`)**:
   - `adminFetchLiveMonitorV94()` menarik seluruh status 255+ siswa lewat `SUPABASE_SERVICE_ROLE_KEY` setiap 8 detik saat Tab Monitor terbuka, menjaga jejak aktivitas tetap utuh meski browser Admin di-*refresh*.
   - Perintah **Reset & Kick**, **Anti Login Ganda**, **Toggle Environment (LMS/CBT)**, **Mode PTS/PAS**, dan **Durasi Ujian Manual (Bank Soal)** otomatis tersinkron ke seluruh perangkat siswa di dalam balasan *heartbeat* tanpa WebSocket.
   - Dilengkapi *zero-downtime fallback* otomatis ke V93 apabila `SQL_LIVE_MONITOR_HEARTBEAT_V94.sql` belum sempat dijalankan.

---

## AG. PEMBARUAN EDISI V95 (HIGH-CONCURRENCY 255+ SISWA: SUPABASE POSTGRESQL EXAM TIMER + CHUNKED CACHESERVICE + AUTO-RETRY JITTER)
1. **Migrasi Timer Ujian Server ke Supabase PostgreSQL (`SQL_EXAM_TIMER_CONCURRENCY_V95.sql`)**:
   - Memindahkan pencatatan `started_at`, `deadline_at`, dan validasi submit ujian dari Google Sheets + `LockService` ke tabel RLS-terkunci `public.exam_timer_sessions` melalui RPC paralel `start_or_resume_exam_timer_v95()` & `validate_exam_submission_time_v95()` (dengan *zero-downtime fallback* otomatis ke V92 jika SQL belum dijalankan).
   - Reset siswa (`adminResetJawabanSupabaseV91`) dan ubah durasi Bank Soal (`saveExamDurationAdminV93`) otomatis menyinkronkan `exam_timer_sessions` di Supabase melalui `service_role`.
2. **Chunked `CacheService` di `Code.gs` (Aman > 95 KB)**:
   - `verifyLogin()` membaca dari `getCachedUsersIndexV95()` (**TTL 60 detik**, *chunked* per 88 KB). Setelah Admin menjalankan **Batch Hash SHA-256** sebelum hari ujian, proses login 100% *read-only* tanpa menulis ke Sheet `Users`.
   - `getQuestions()` membaca dari `getCachedTokenMapV95()` (**TTL 30 detik**) & `getCachedSubjectQuestionsV95()` (**TTL 60 detik**, *chunked* + *versioned invalidation* otomatis saat soal diedit) dengan opsi `skipGasTimer: true` (0 `LockService`).
3. **Auto-Retry dengan *Jitter* Acak di Klien (`Script.html`)**:
   - Menambahkan `runGasWithAutoRetryJitterV95()` (maks **3× retry**, jeda acak **1,2–3,5 detik**) pada `doLogin()` dan `initNewExam()` (`getQuestions`) untuk meredam puncak antrean server GAS tanpa menampilkan pop-up error merah ke siswa.

---

## AH. PEMBARUAN EDISI V96 (PERBAIKAN INVALID API KEY GROQ + TAMPILAN UTUH 4 API KEY + AUTO-FAILOVER)
1. **Perbaikan Akar Masalah `Error: Invalid API Key` Groq (`sanitizeApiKeyValueV96`)**:
   - Menambahkan pembersih otomatis karakter pengganggu (tanda kutip tunggal `'...'`, kutip ganda `"..."`, *backtick*, spasi, baris baru, titik koma, dan prefiks `Bearer `) pada seluruh pembacaan **4 API Key Groq** (`GROQ_CBT_API_KEY_K7`, `GROQ_LMS_API_KEY_K7`, `GROQ_STUDENT_TUTOR_API_KEY_K7`, `GROQ_VIDEO_API_KEY_K7`) maupun `SUPABASE_SERVICE_ROLE_KEY`.
   - **Self-Healing Permanen**: Jika di Script Properties terdapat tanda kutip seperti `'gsk_...'`, sistem langsung membersihkan dan menyimpannya kembali secara otomatis.
   - **Auto-Failover 4 Kunci (`fetchGroqChatWithAutoFailoverV96`)**: Seluruh 11 fungsi AI di `Code.gs` otomatis melakukan *failover* ke kunci Groq valid lainnya apabila salah satu kunci terkena `HTTP 401` atau *rate-limit* `HTTP 429`.
2. **Tampilan Utuh (Tanpa Masking) & Uji Koneksi Live di Pusat Keamanan Admin**:
   - Di menu **🛡️ Keamanan & 2FA**, keempat API Key Groq ditampilkan secara **utuh tanpa disamarkan tanda bintang/titik** khusus untuk sesi Admin terverifikasi, dilengkapi tombol **Salin**, **Simpan 4 API Key Groq (Auto-Bersih)**, dan **⚡ Uji Koneksi 4 API Key Groq** langsung ke `api.groq.com/openai/v1/models`.

---

## AI. EDISI FINAL SICIBINAGA KELAS 7 (TEMA HIJAU ZAMRUD MODERN + 5 API KEY GROQ AUTO-SEED V96)
1. **Identitas & Rombel Kelas 7 (`7A`–`7H`)**:
   - Seluruh judul portal, pilihan kelas login, filter Admin, Leger Nilai, Progres LMS, Kartu Peserta (`value="7"`), Live Arena, Arsip Bank Soal (`SICIBINAGA_Arsip_Bank_Soal_K7`), dan folder Bahan Ajar (`SICIBINAGA_Bahan_Ajar_LMS_K7`) 100% menggunakan **SICIBINAGA Kelas 7**.
2. **Tema Desain Hijau Zamrud Modern (*Emerald Green*)**:
   - Seluruh **Dashboard Siswa** dan **Dashboard Admin** tampil seragam dalam tema **Hijau Zamrud Modern** (`#064e3b`, `#059669`, `#10b981`, `#d1fae5`, `#ecfdf5`) dengan kontras tinggi (WCAG AA/AAA), termasuk harmonisasi tab & kartu Dashboard Admin.
3. **Integrasi Database & 5 API Key Groq Khusus Kelas 7**:
   - **Spreadsheet ID**: `1YZ-TlyZ4FAuhtaYHQyuaLi3rDrwjJWopIdJ9--jWdII`
   - **Supabase URL**: `https://xraqhfkrwwvlkvoulzuv.supabase.co`
   - **5 API Key Groq K7**: `GROQ_CBT_API_KEY_K7`, `GROQ_LMS_API_KEY_K7`, `GROQ_STUDENT_TUTOR_API_KEY_K7`, `GROQ_VIDEO_API_KEY_K7`, dan `GROQ_BANKSOAL_QUIZ_API_KEY_K7` otomatis ter-seed ke GAS Script Properties, tampil utuh di **🛡️ Keamanan & 2FA**, dilengkapi pembersih otomatis tanda kutip (`sanitizeApiKeyValueV96`) & *auto-failover* 5 kunci pada seluruh 11 fungsi AI.

---

## AJ. PEMBARUAN EDISI V97 FINAL (ZERO-LOCK `doGet()` & CACHE MODE UJIAN — KELAS 7)
1. **Cache Guard 6 Jam pada `ensureSystemInitialized()` (`Code.gs`)**:
   - Menambahkan penjaga `CacheService` (`v97_sys_init_ok`, TTL 21.600 detik / 6 jam) sehingga pembukaan awal URL aplikasi (`doGet()`) oleh 255+ siswa serentak tidak lagi mengantre `LockService` maupun membaca 8 sheet sistem di Google Sheets.
   - Fungsi manual `otorisasiSistem()` tetap memanggil `ensureSystemInitialized(true)` untuk pemeriksaan paksa saat dibutuhkan Admin.
2. **Cache 30 Detik pada `getExamModeConfigServerV69()`**:
   - Menyimpan status mode ujian `PTS/PAS` ke `CacheService` (`v97_exam_mode_cfg`, TTL 30 detik) dan otomatis terinvalidasi melalui `clearSicibinagaFastCacheV88()` begitu Admin mengubah mode ujian.
