# SimplePG - Simple Payment Gateway Management System

## 2. Teknologi & Stack
* **Backend**: Go (Golang) v1.20+, Framework Gin, GORM ORM, MySQL Database, JWT (JSON Web Token), Bcrypt Password Hashing.
* **Frontend**: React 19, Vite, TypeScript, React Router v7, TanStack React Query v5, React Hook Form, Zod Validation, Lucide Icons.

---

## 3. Cara Menjalankan (Langkah demi Langkah)

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

### Langkah 2: Menjalankan Backend
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
    **`http://localhost:8080`**

---

### Langkah 3: Menjalankan Frontend
1. Buka terminal baru dan masuk ke direktori `frontend`:
   ```bash
   cd frontend
   ```
2. Install seluruh dependensi paket Node:
   ```bash
   npm install
   ```
3. Jalankan server:
   ```bash
   npm run dev
   ```
4. Buka browser dan akses aplikasi pada:
    **`http://localhost:5173`**

---

##  4. Akun Login untuk Testing & Cara Register

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

##  5. Bagian yang Belum Selesai
* Data transaksi belum bersifat privat per akun (setiap akun yang login masih melihat dan mengelola data transaksi global yang sama karena belum dihubungkan ke `user_id`).
* Fitur pencarian dan penyaringan data transaksi (filtering berdasarkan status, metode pembayaran, atau rentang tanggal).
* Halaman tampilan detail data transaksi secara khusus/terpisah (saat ini detail transaksi di-load langsung ke dalam form edit).
