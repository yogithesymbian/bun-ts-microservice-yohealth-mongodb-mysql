import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const server = Bun.serve({
  port: 3002,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/records" && req.method === "POST") {
      try {
        const { userId, status } = await req.json();
        const record = await prisma.healthRecord.create({
          data: { userId, status },
        });
        return new Response(JSON.stringify(record), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: "Invalid request" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    if (url.pathname === "/records" && req.method === "GET") {
      const records = await prisma.healthRecord.findMany();
      return new Response(JSON.stringify(records), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`❤️ Health Service running at http://localhost:${server.port}`);
