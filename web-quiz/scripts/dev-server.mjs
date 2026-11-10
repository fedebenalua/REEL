import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { pathToFileURL } from "node:url";

if (process.env.DATABASE_URL || process.env.NODE_ENV === "production" || process.env.VERCEL) {
  console.error("dev-server: solo para desarrollo local (sin DATABASE_URL ni entorno de producción).");
  process.exit(1);
}
if (!process.env.SQUARE_ACCESS_TOKEN) globalThis.__BRIO_LOCAL_DEV_SERVER__ = true;
const port = Number(process.env.PORT || 8000);
const root = join(process.cwd(), "public");
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json" };

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname.startsWith("/api/")) {
      const name = url.pathname.slice(5).replace(/[^a-z-]/g, "");
      const mod = await import(pathToFileURL(join(process.cwd(), "api", `${name}.js`)).href).catch(() => null);
      const fn = mod?.[req.method];
      if (!fn) { res.writeHead(404).end(); return; }
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const request = new Request(url, { method: req.method, headers: req.headers, body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks) });
      const response = await fn(request);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
      return;
    }
    let file = normalize(join(root, decodeURIComponent(url.pathname)));
    if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
    if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, "index.html");
    const data = await readFile(file);
    res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" });
    res.end(data);
  } catch (error) {
    if (error.code !== "ENOENT") console.error(error);
    res.writeHead(404, { "content-type": "text/plain" }).end("No encontrado");
  }
}).listen(port, "127.0.0.1", () => console.log(`Brío en http://127.0.0.1:${port}`));
