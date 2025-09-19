# 📖 bun-ts-microservices 

## Screenshots

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/user-attachments/assets/95f67ed2-9d4c-4a53-9737-9b8f58a3ab32">
        <img src="https://github.com/user-attachments/assets/95f67ed2-9d4c-4a53-9737-9b8f58a3ab32" width="250"/>
      </a>
      <br/>
      <sub>Prisma Generate</sub>
    </td>
    <td align="center">
      <a href="https://github.com/user-attachments/assets/acb9e1c0-d138-4246-b413-35380d45f383">
        <img src="https://github.com/user-attachments/assets/acb9e1c0-d138-4246-b413-35380d45f383" width="250"/>
      </a>
      <br/>
      <sub>MySQL Tableplus</sub>
    </td>
    <td align="center">
      <a href="https://github.com/user-attachments/assets/d934df4a-3281-4937-8af5-fe837032a8b5">
        <img src="https://github.com/user-attachments/assets/d934df4a-3281-4937-8af5-fe837032a8b5" width="250"/>
      </a>
      <br/>
      <sub>Prisma MongoDB</sub>
    </td>
  </tr>
</table>


## 🚀 Overview

Contoh project **Microservices dengan Bun + TypeScript** menggunakan:

* **API Gateway** → routing request ke service
* **Auth Service** → MySQL + Prisma (User login & register)
* **Health Service** → MongoDB + Prisma (CRUD Health Records)

Tujuan: Migrasi monolith PHP → microservices modern.

---

## 📂 Project Structure

```
bun-microservices/
 ├─ gateway/          # API Gateway (routing ke services)
 │   └─ index.ts
 ├─ auth-service/     # Auth Service pakai MySQL + Prisma
 │   ├─ index.ts
 │   └─ prisma/schema.prisma
 ├─ health-service/   # Health Service pakai MongoDB + Prisma
 │   ├─ index.ts
 │   └─ prisma/schema.prisma
 ├─ package.json
 └─ tsconfig.json
```

---

## ⚙️ Prerequisites

* [Bun](https://bun.sh) terinstall
* [MySQL](https://dev.mysql.com/downloads/) jalan di `localhost:3306`
* [MongoDB](https://www.mongodb.com/try/download/community) jalan di `localhost:27017`
* [Prisma](https://www.prisma.io/) via `bunx`

---

## 🔑 Auth Service (MySQL)

### `.env`

```env
DATABASE_URL="mysql://root:password@localhost:3306/authdb"
```

### `schema.prisma`

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id       Int     @id @default(autoincrement())
  username String  @unique
  password String
}
```

### Setup

```sh
cd auth-service
bunx prisma generate
bunx prisma db push   # bikin table Users
bun index.ts
```

---

## ❤️ Health Service (MongoDB + Replica Set)

### `.env`

```env
DATABASE_URL="mongodb://localhost:27017/healthdb?replicaSet=rs0"
```

### `schema.prisma`

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model HealthRecord {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String
  status    String
  createdAt DateTime @default(now())
}
```

### Setup Replica Set (macOS, Homebrew ARM/M1)

```sh
brew services stop mongodb-community@7.0
mongod --dbpath /opt/homebrew/var/mongodb --replSet rs0
```

In new terminal:

```sh
mongosh
rs.initiate()
rs.status()
```

### Generate client

```sh
cd health-service
bunx prisma generate
```

### Run service

```sh
bun index.ts
```

---

## 🐛 Common Issues & Fixes

1. **`SyntaxError: JSON Parse error`**
   → Pastikan request body JSON valid dan kirim header `Content-Type: application/json`.

   Example:

   ```sh
   curl -X POST http://localhost:3001/register \
    -H "Content-Type: application/json" \
    -d '{"username":"yogi","password":"123"}'
   ```

2. **Prisma error `P2031: Replica Set required`**
   → Prisma untuk MongoDB butuh **Replica Set**, aktifkan dengan:

   ```sh
   mongod --dbpath /opt/homebrew/var/mongodb --replSet rs0
   mongosh
   rs.initiate()
   ```

3. **TablePlus tidak menampilkan field MongoDB**

   * MongoDB schemaless → field terlihat setelah ada document.
   * Coba insert data via API, lalu cek di `mongosh`:

     ```js
     use healthdb
     db.HealthRecord.find().pretty()
     ```

---

## 🌐 Example Requests

### Auth Service

```sh
# Register user
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"secret"}'
```

### Health Service

```sh
# Insert record
curl -X POST http://localhost:3002/records \
  -H "Content-Type: application/json" \
  -d '{"userId":"123","status":"Healthy"}'

# Get records
curl http://localhost:3002/records
```

---

## ✅ Status

* [x] MySQL Auth Service jalan
* [x] MongoDB Health Service jalan (Replica Set required)
* [x] CRUD tested via curl
* [ ] API Gateway JWT (next step)


This project was created using `bun init` in bun v1.2.22. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
