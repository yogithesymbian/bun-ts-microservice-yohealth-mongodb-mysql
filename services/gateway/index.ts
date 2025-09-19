import http from "http";
import { Writable } from "stream";

const services = {
    auth: "http://localhost:3001",
    health: "http://localhost:3002",
}

const server = http.createServer( async (req, res) => {
    if(!req.url) return

    if(req.url.startsWith("/auth")){
        const proxy = await fetch(services.auth + req.url.replace("/auth", ""), {
            method: req.method,
            headers: req.headers as any,
            body: req.method !== "GET" ? req : undefined,
        })
        res.writeHead(proxy.status, Object.fromEntries(proxy.headers.entries()));
        proxy.body?.pipeTo(Writable.toWeb(res))
        return;
    }

    if (req.url.startsWith("/health")) {
    const proxy = await fetch(services.health + req.url.replace("/health", ""), {
      method: req.method,
      headers: req.headers as any,
      body: req.method !== "GET" ? req : undefined,
    });
    res.writeHead(proxy.status, Object.fromEntries(proxy.headers.entries()));
    proxy.body?.pipeTo(Writable.toWeb(res));
    return;
  }

  res.writeHead(404);
  res.end("Not Found");
})

server.listen(3000, () => {
  console.log("🚀 API Gateway running at http://localhost:3000");
});