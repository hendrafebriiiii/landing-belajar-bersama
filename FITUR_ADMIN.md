# 📋 Panduan Sistem Manajemen Soal CAT

## Fitur Utama Admin

Sistem ini menyediakan interface lengkap untuk administrator mengelola soal-soal simulasi CAT (Computer Assisted Test).

### 1. **Tab Manajemen User**
- Melihat daftar user yang terdaftar
- Melihat statistik user (Total, Aktif, Selesai, Rata-rata Skor)
- Search user berdasarkan nama atau email
- Lihat detail user dan riwayat percobaan
- Hapus user
- Export data user ke CSV

### 2. **Tab Manajemen Soal** ⭐

#### 🔹 Tambah Soal Baru

1. Klik tab **"📝 Manajemen Soal"**
2. Isi form di sebelah kiri:
   - **Nomor Soal**: Nomor urut soal (misal: 1, 2, 3, dll)
   - **Teks Soal**: Pertanyaan yang akan ditampilkan kepada user
   - **Opsi A, B, C, D**: Empat pilihan jawaban
   - **Jawaban Benar**: Pilih yang mana jawaban yang benar (A, B, C, atau D)
3. Klik tombol **"💾 Simpan"**
4. Soal baru akan langsung muncul di daftar soal

#### 🔹 Edit Soal

1. Cari soal yang ingin diubah di **Daftar Soal**
2. Klik tombol **"✏️ Edit"** pada soal tersebut
3. Form akan terisi otomatis dengan data soal
4. Ubah field yang diperlukan
5. Klik **"💾 Simpan"** untuk menyimpan perubahan
6. Judul form akan berubah menjadi "✏️ Edit Soal [nomor]" saat mode edit

#### 🔹 Hapus Soal

1. Cari soal yang ingin dihapus di **Daftar Soal**
2. Klik tombol **"🗑️ Hapus"** pada soal tersebut
3. Dialog konfirmasi akan muncul
4. Klik **"Hapus"** untuk mengkonfirmasi penghapusan
5. Soal akan dihapus dari daftar

#### 📊 Daftar Soal

Menampilkan:
- **No**: Nomor soal
- **Soal**: Teks pertanyaan (dipotong 50 karakter)
- **Jawaban**: Kunci jawaban yang benar (A, B, C, atau D)
- **Aksi**: Tombol Edit dan Hapus
- **Total**: Jumlah total soal dalam sistem

### 📌 Informasi Penting

- **Data disimpan di localStorage**: Soal yang ditambahkan/diubah akan tersimpan di browser lokal
- **Sinkronisasi otomatis**: Saat user membuka halaman user.html, soal-soal terbaru akan dimuat otomatis
- **Default Questions**: Sistem dilengkapi 10 soal default IPS yang dapat dimodifikasi atau dihapus

### 🎯 Use Cases

#### Skenario 1: Setup Awal
1. Admin mengakses tab "Manajemen Soal"
2. Melihat 10 soal default sudah tersedia
3. Jika perlu, dapat mengedit soal-soal default untuk menyesuaikan materi

#### Skenario 2: Menambah Bank Soal
1. Admin ingin menambah 5 soal baru
2. Isi form untuk setiap soal
3. Klik Simpan
4. Total soal akan bertambah menjadi 15

#### Skenario 3: Maintenance
1. Admin menemukan typo di salah satu soal
2. Klik Edit pada soal tersebut
3. Perbaiki teksnya
4. Klik Simpan

### 🔒 Akses Admin

- Masuk ke halaman admin.html
- Sistem otomatis mendeteksi admin sebagai "Admin Belajar Bersama"
- Tidak ada password login yang diperlukan untuk demo

### 💾 Backup Data

Untuk backup soal-soal Anda:
1. Buka Browser DevTools (F12)
2. Buka tab Console
3. Jalankan: `localStorage.getItem('catQuestions')`
4. Copy hasilnya dan simpan di file teks

Untuk restore:
1. Buka Browser DevTools (F12)
2. Buka tab Console
3. Jalankan: `localStorage.setItem('catQuestions', '[data yang di-backup]')`
4. Refresh halaman

---

**Versi**: 1.0  
**Tanggal**: May 2026  
**Sistem**: Belajar Bersama CAT Platform
