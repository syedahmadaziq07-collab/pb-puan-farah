# DETEKTIF CILIK 3D: MISTERI KOTAK HILANG
### Bahan Bantu Belajar (BBB) Digital 3D Pendidikan Khas (HPPK 2)

Aplikasi permainan pengembaraan pendidikan tiga dimensi (3D) berasaskan web yang direka khusus untuk **Murid Berkeperluan Pendidikan Khas (MBPK)**, dengan tumpuan awal kepada kategori **Masalah Pembelajaran** bagi kursus **HPPK 2** di Malaysia.

---

## 🌟 Ciri-Ciri Utama Aplikasi

1. **Eksplorasi 3D Sebenar (Three.js & WebGL)**:
   - Persekitaran sekolah rendah Malaysia yang bersambung: **Bilik Darjah**, **Kantin**, **Perpustakaan**, dan **Lorong Sekolah**.
   - Kawalan watak orang ketiga (*Third-person controller*) dengan animasi berjalan dan melangkah.
   - Sistem pengesanan perlanggaran (*collision detection*) yang menghalang watak daripada menembusi dinding atau perabot.
   - Model 3D prosedural (3–12 bahagian komposit) tanpa kebergantungan aset luar (bebas ralat 404).

2. **Jalan Cerita Misteri Pendidikan ("Misteri Kotak Hilang")**:
   - Kotak biru berisi alatan seni hilang selepas kelas seni.
   - **Petunjuk 1 (Bilik Darjah)**: *"Ali membawa kotak biru keluar dari bilik darjah selepas kelas seni."*
   - **Petunjuk 2 (Kantin)**: *"Selepas melalui kantin, Ali pergi ke perpustakaan."*
   - **Petunjuk 3 (Perpustakaan)**: *"Kotak biru diletakkan di sebelah rak buku."*
   - **Kesimpulan Rasmi**: *"Kotak biru berada di sebelah rak buku di perpustakaan."*

3. **Sistem Bantuan Penyesuaian (Adaptive Scaffolding - Vygotsky)**:
   - **Tahap 0 (Berdikari)**: Percubaan ayat tanpa bantuan (direkodkan secara berasingan untuk ketepatan bebas).
   - **Tahap 1 (Sorotan Visual)**: Kata kunci dan frasa sendi ruang (contoh: *di bawah meja*) disorot dengan warna kontras.
   - **Tahap 2 (Pecahan Frasa)**: Ayat dipecahkan kepada blok frasa bermakna untuk mengurangkan beban kognitif.
   - **Tahap 3 (Contoh Berpandu)**: *Worked example* konkrit menunjukkan cara menyelesaikan tugasan.

4. **Peneguhan Positif & Sokongan Sosio-Emosi (Skinner & Erikson)**:
   - Karakter sahabat **"Si Kancil"** memberi galakan mesra.
   - Tiada penolakan nyawa (*no life penalty*) dan tiada bunyi hukuman.
   - Maklum balas pembetulan yang membina dan mengiktiraf usaha mencuba semula.

5. **Modul Penilaian HPPK 2 (Pra & Pasca-Intervensi)**:
   - **Ujian Awal (Baseline - 10 item)**: Menilai kefahaman hubungan ruang (*di atas, di bawah, di dalam, di sebelah*) dan kata kerja tindakan.
   - **Ujian Susulan (Post-Test - 10 item)**: Item selari dengan aras kesukaran setara untuk mengukur kemajuan murid.
   - **Pemerhatian Bacaan Lisan Guru**: Formula automatik:
     $$\text{Ketepatan (\%)} = \left(\frac{\text{Perkataan Dibaca Betul}}{\text{Jumlah Perkataan Dipersembahkan}}\right) \times 100$$
     dengan kawalan selamat bagi pembahagi sifar (*zero denominator guard*).

6. **Portal & Papan Pemuka Guru (Teacher Dashboard)**:
   - Pengurusan profil murid menggunakan **kod pseudonim** (contoh: `MBPK-A01`) tanpa maklumat peribadi sensitif (PII).
   - Analisis perbandingan peratusan pra vs pasca (*percentage point difference*).
   - Eksport laporan dalam format **CSV**, **JSON**, dan **Cetak PDF/Kertas**.
   - Tab khas **"Pemetaan Pedagogi"** menghuraikan integrasi teori Vygotsky, Skinner, Erikson, KPPB, dan kerangka 3E.

7. **Pangkalan Data Pengeluaran Supabase**:
   - Skim pangkalan data PostgreSQL lengkap (`supabase/migrations/20261029_initial_schema.sql`).
   - Keselamatan Baris (*Row Level Security - RLS*) ketat di mana guru hanya boleh mengakses rekod murid mereka sendiri.
   - Mod demo pratonton luar talian (*offline preview mode*) automatik jika kunci API awan belum diisi.

---

## 🛠️ Tindanan Teknologi (Tech Stack)

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Enjin 3D**: Three.js (r160+ dengan ACESFilmicToneMapping, SRGBColorSpace, RoomEnvironment reflection)
- **Audio**: Web Audio API (prosedural sintesis gelombang, 100% tanpa fail audio luar)
- **Pangkalan Data**: Supabase PostgreSQL & Supabase Auth
- **Ikon & Kesan**: Lucide React, Canvas Confetti
- **Pengehosan**: Render Static Site (`render.yaml`)

---

## 🚀 Panduan Pemasangan & Pembangunan Tempatan

### 1. Klon Repositori
```bash
git clone https://github.com/username/detektif-cilik-3d.git
cd detektif-cilik-3d
```

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Konfigurasi Pemboleh Ubah Persekitaran (`.env`)
Salin templat `.env.example`:
```bash
cp .env.example .env
```
Isikan kredensial projek Supabase anda:
```env
VITE_SUPABASE_URL="https://your-supabase-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-publishable-key"
```
*(Nota: Jika dibiarkan kosong, aplikasi akan beroperasi dalam Mod Pratonton Demo dengan storan sesi yang selamat).*

### 4. Jalankan Pelayan Pembangunan
```bash
npm run dev
```
Buka pelayar pada `http://localhost:3000`.

---

## 🗄️ Persediaan Pangkalan Data Supabase (SQL Migration)

1. Buka konsol projek anda di [Supabase Dashboard](https://supabase.com).
2. Pergi ke bahagian **SQL Editor**.
3. Buka fail `supabase/migrations/20261029_initial_schema.sql` dalam repositori ini.
4. Salin keseluruhan kod SQL dan tampal ke dalam SQL Editor Supabase.
5. Klik **Run**. Skim pangkalan data akan mencipta:
   - Jadual `learner_profiles`
   - Jadual `game_sessions`
   - Jadual `task_responses`
   - Jadual `assessment_results`
   - Jadual `oral_reading_observations`
   - Dasar keselamatan *Row Level Security (RLS)* untuk semua jadual.

---

## 🌐 Panduan Penempatan ke Render (Deployment)

Aplikasi ini telah dikonfigurasi menggunakan pelan cetak biru `render.yaml` untuk penempatan automatik ke **Render Static Site**:

1. Log masuk ke [Render Dashboard](https://render.com).
2. Klik **New** > **Static Site**.
3. Hubungkan repositori GitHub anda (`detektif-cilik-3d`).
4. Tetapkan konfigurasi berikut:
   - **Name**: `detektif-cilik-3d`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Dalam bahagian **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL` = URL projek Supabase anda
   - `VITE_SUPABASE_ANON_KEY` = Kunci awam anon Supabase anda
6. Di bawah **Redirects/Rewrites**, pastikan laluan SPA ditambah:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
7. Klik **Create Static Site** untuk memulakan penempatan pengeluaran.

---

## 🎮 Kawalan Permainan

### Desktop (Papan Kekunci & Tetikus)
- **W / Anak Panah Atas**: Bergerak ke hadapan
- **S / Anak Panah Bawah**: Bergerak ke belakang
- **A / Anak Panah Kiri**: Belok ke kiri
- **D / Anak Panah Kanan**: Belok ke kanan
- **E / Bar Ruang (Space)**: Periksa objek interaktif berhampiran
- **Esc**: Tutup modal / jeda

### Peranti Mudah Alih & Tablet
- **Joystick Maya (Bawah Kiri)**: Seret untuk mengawal arah pergerakan watak
- **Butang Tindakan Besar "PERIKSA" (Bawah Kanan)**: Ketuk untuk memeriksa objek atau membuka kad tugasan
- **Butang Lokasi Pantas (Dok Bawah)**: Ketuk nama bilik untuk berpindah lokasi serta-merta

---

## 📋 Senarai Semak Pengesahan & Ujian (Testing Checklist)

- [x] Aplikasi bermula dan dimuat dengan lancar pada port 3000.
- [x] Menu utama 3D berfungsi dengan butang Mula, Sambung, Tutorial, dan Tetapan.
- [x] Dunia 3D dirender dengan pencahayaan studio, bayang lembut, dan RoomEnvironment.
- [x] Watak Detektif Cilik bergerak secara 3 dimensi dengan kitaran langkah kaki.
- [x] Kamera orang ketiga mengikut pergerakan watak secara lancar (*smooth damping*).
- [x] Perlanggaran dinding dan perabot berfungsi (watak meluncur di sepanjang sempadan).
- [x] Tiga kawasan bilik sekolah (Bilik Darjah, Kantin, Perpustakaan, dan Lorong) boleh diteroka.
- [x] Pembukaan misi mengikut susunan kronologi (Bilik Darjah -> Kantin -> Perpustakaan).
- [x] Buku Nota Detektif merekodkan dan memaparkan ketiga-tiga petunjuk cerita.
- [x] Papan Bukti Akhir mengesahkan penyelesaian kes berlandaskan bukti secara deduktif.
- [x] Sistem perancah (scaffolding 4 aras) berfungsi mengikut prinsip ZPD Vygotsky.
- [x] Respons bebas kali pertama direkodkan secara berasingan daripada respons berbimbingan.
- [x] Ujian Pra (10 item) dan Ujian Pasca (10 item) boleh ditadbir dengan selamat.
- [x] Pengiraan peratusan ketepatan bacaan lisan mengendalikan sifar secara selamat.
- [x] Pengesahan guru melalui Supabase Auth dengan sokongan mod demo pantas.
- [x] Eksport laporan ke format CSV dan JSON berfungsi sepenuhnya.
- [x] Susun atur dok bawah boleh disembunyikan bagi pandangan 3D tanpa halangan.
- [x] Tiada aset luar yang bergantung kepada URL 404; audio dan model dijana secara kod.
- [x] Tiada data peribadi murid sebenar (PII) diminta atau disimpan.

---

## 📚 Rujukan HPPK 2 & Kerangka Teori

| Aspek Pembelajaran | Teori & Pengasas | Pelaksanaan Dalam Permainan |
| :--- | :--- | :--- |
| **Peningkatan Kognitif** | Lev Vygotsky (ZPD & Scaffolding) | Bantuan berperingkat (Aras 0: Bebas, Aras 1: Sorotan, Aras 2: Frasa, Aras 3: Contoh). |
| **Tingkah Laku** | B. F. Skinner (Operant Conditioning) | Maklum balas segera, peneguhan positif, pengiktirafan percubaan semula tanpa penalti nyawa. |
| **Sosio-Emosi** | Erik Erikson (Industry vs Inferiority) | Watak sahabat Si Kancil, tiada perbandingan markah awam, suasana penyiasatan yang menyokong. |
| **Pemprosesan Maklumat** | Sweller & Miller (Cognitive Load) | Satu tugasan dalam satu masa, fon boleh laras, mod pengurangan visual dan kontras tinggi. |
| **Kerangka 3E** | Liz Kolb | **Engagement** (3D), **Enhancement** (Scaffolding adaptif), **Extension** (Aktiviti maujud bilik darjah). |
