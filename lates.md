

### 🔹 1. **pakai migration (lebih recommended)**

```bash
cd auth-service
bunx prisma migrate dev --name init
```

Ini akan:

* Bikin tabel `User` di `authdb`.
* Simpan file migration SQL di `prisma/migrations/`.
* Update Prisma Client.

---

### 🔹 2. **pakai push (langsung sync schema, tanpa migration history)**

```bash
cd auth-service
bunx prisma db push
```

Ini langsung sync model di `schema.prisma` → DB (cocok buat dev cepat, tapi history migration nggak ada).

---

### 📌 Jadi alurnya:

1. Pastikan `auth-service/.env` benar:

   ```env
   DATABASE_URL="mysql://root:password@localhost:3306/authdb"
   ```

2. Jalankan:

   ```bash
   cd auth-service
   bunx prisma migrate dev --name init
   ```

3. Cek di MySQL:

   ```sql
   USE authdb;
   SHOW TABLES;
   ```

👉 Harusnya sekarang ada tabel `User`.
