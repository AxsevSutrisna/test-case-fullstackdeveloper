# Payment Gateway Test Case

Aplikasi *fullstack* (Go + React) sederhana untuk manajemen transaksi pembayaran.

## Prasyarat
- **Go** (v1.20+)
- **Node.js** (v18+)
- **MySQL / Laragon** (Database: `test-case-fullstack`)

## Struktur Proyek
- `/backend`: Go API (Gin, GORM, MySQL, JWT)
- `/frontend`: React SPA (Vite, TypeScript, React Router, Tailwind/Vanilla CSS)

## Cara Menjalankan

### 1. Backend
Pastikan MySQL sudah berjalan dan terdapat database bernama `test-case-fullstack`.
```bash
cd backend
go run main.go
```
*(Backend berjalan di http://localhost:8080)*

### 2. Frontend
Buka terminal baru:
```bash
cd frontend
npm install
npm run dev
```
*(Frontend berjalan di http://localhost:5173)*
