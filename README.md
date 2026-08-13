# SimplePG - Simple Payment Gateway Management System

Aplikasi *fullstack* (Go + React) sederhana untuk **Manajemen Transaksi Payment Gateway** yang dilengkapi dengan sistem authentikasi JWT, validasi data transaksi, dan antarmuka pengguna (*UI*) yang modern, bersih, serta responsif.

---

## 📌 1. Tema yang Dipilih
**Payment Gateway / Manajemen Transaksi Pembayaran (`SimplePG`)**
Sistem ini digunakan untuk mengelola transaksi pembayaran pelanggan, memantau status pembayaran (*Success*, *Pending*, *Failed*), serta mencegah duplikasi data transaksi.

---

## 🛠️ 2. Teknologi & Stack
* **Backend**: Go (Golang) v1.20+, Framework Gin, GORM ORM, MySQL Database, JWT (JSON Web Token), Bcrypt Password Hashing.
* **Frontend**: React 19, Vite, TypeScript, React Router v7, TanStack React Query v5, React Hook Form, Zod Validation, Lucide Icons.
* **Styling**: Modern Clean Minimalist Vanilla CSS (White Theme).

---

## 🚀 3. Cara Menjalankan (Langkah demi Langkah)

### Prasyarat:
* **Go** (v1.20 atau lebih baru)
* **Node.js** (v18 atau lebih baru) & `npm`
* **MySQL Database** (via Laragon, XAMPP, atau MySQL Server Service)

---

### Langkah 1: Persiapan Database MySQL
1. Pastikan Service MySQL Anda sudah berjalan.
2. Buat database baru bernama **`test-case-fullstack`** pada MySQL Anda (melalui phpMyAdmin, DBeaver, atau MySQL CLI):
   ```sql
   CREATE DATABASE `test-case-fullstack`;
   ```

---

### Langkah 2: Menjalankan Backend (Go API)
1. Buka Terminal / Command Prompt dan masuk ke direktori `backend`:
   ```bash
   cd backend
   ```
2. *(Opsional)* Jika perlu mengkustomisasi koneksi database, sesuaikan file `.env` di folder `backend`.
3. Jalankan aplikasi backend:
   ```bash
   go run main.go
   ```
4. Backend akan melakukan **Auto Migration** tabel `users` & `transactions` serta memasukkan **Seed Data awal**. Server akan berjalan pada:
   👉 **`http://localhost:8080`**

---

### Langkah 3: Menjalankan Frontend (React SPA)
1. Buka terminal baru dan masuk ke direktori `frontend`:
   ```bash
   cd frontend
   ```
2. Install seluruh dependensi paket Node:
   ```bash
   npm install
   ```
3. Jalankan server pengembang (*development server*):
   ```bash
   npm run dev
   ```
4. Buka browser Anda dan akses aplikasi pada:
   👉 **`http://localhost:5173`**

---

## 🔑 4. Akun Login untuk Testing & Cara Register

### Akun Bawaan (Seed User):
Sistem telah secara otomatis mendaftarkan akun penguji default saat backend dijalankan pertama kali:
* **Email**: `admin@test.com`
* **Password**: `password123`

### Cara Register (Buat Akun Baru):
1. Buka halaman aplikasi di `http://localhost:5173/login`.
2. Klik link **"Daftar sekarang"** (atau langsung buka `http://localhost:5173/register`).
3. Masukkan **Nama Lengkap**, **Email valid**, dan **Password** (minimal 6 karakter).
4. Klik **Daftar**, lalu gunakan akun baru tersebut untuk masuk (*login*).

---

## 📋 5. Fitur Utama yang Terimplementasi
* ✅ **Authentikasi & Keamanan**:
  * Pendaftaran akun (Register) dengan enkripsi password Bcrypt.
  * Login dengan pengembalian token JWT.
  * Proteksi route backend & frontend (hanya user terautentikasi yang bisa mengakses fitur CRUD).
  * Tombol mata pada input password (Show / Hide Password toggle).
* ✅ **Manajemen Transaksi (CRUD)**:
  * **Create**: Tambah transaksi baru dengan format otomatis Rupiah (`Rp. 50.000`) & penanganan pencegahan nilai negatif.
  * **Read List & Detail**: Menampilkan daftar transaksi dalam tabel dan otomatis mengisi data saat edit.
  * **Update**: Memperbarui detail transaksi & status pembayaran (*Pending*, *Success*, *Failed*).
  * **Delete**: Menghapus data transaksi dengan dialog konfirmasi.
  * **Validasi Keunikan**: Pencegahan nomor pelanggan duplikat (`customer_number`).
* ✅ **State Management & UI**:
  * Handling State: *Loading*, *Sukses*, *Gagal (Error Alert)*, dan *Kosong (Empty State)*.
  * Desain antarmuka profesional, bersih, dan minimalis berbasis tema putih murni.

---

## 🚧 6. Bagian yang Belum Selesai (Status Proyek)
* **Status**: **100% SELESAI** (Seluruh kriteria wajib backend, frontend, authentikasi, CRUD, validasi, dan penanganan state telah terpenuhi sepenuhnya).
* **Rencana Pengembangan Selanjutnya (Future Improvements)**:
  * Fitur ekspor laporan daftar transaksi ke format PDF / Excel.
  * Integrasi dengan Payment Gateway SDK asli (misal: Midtrans / Xendit Sandbox).
