import { PrismaClient } from "@prisma/client";
import http from "http";

const prisma = new PrismaClient();

const server = http.createServer(async (req, res) => {
  if (!req.url) return;
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/register" && req.method === "POST") {
    let body = "";
    for await (const chunk of req) body += chunk;
    const { username, password } = JSON.parse(body);

    const user = await prisma.user.create({
      data: { username, password },
    });

    res.end(JSON.stringify(user));
    return;
  }

  if (req.url === "/login" && req.method === "POST") {
    let body = "";
    for await (const chunk of req) body += chunk;
    const { username, password } = JSON.parse(body);

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || user.password !== password) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: "Invalid credentials" }));
      return;
    }

    res.end(JSON.stringify({ message: "Login successful", user }));
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(3001, () => {
  console.log("🔑 Auth Service running at http://localhost:3001");
});
