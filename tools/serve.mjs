import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const port = Number(process.argv[2] || 4173);
const mime = new Map([
  [".avif", "image/avif"],
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".mp4", "video/mp4"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webmanifest", "application/manifest+json"],
  [".webp", "image/webp"],
  [".xml", "application/xml; charset=utf-8"],
]);

const server = createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  let absolute = path.resolve(root, relative);

  if (!absolute.startsWith(root + path.sep)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  if (existsSync(absolute) && statSync(absolute).isDirectory()) {
    absolute = path.join(absolute, "index.html");
  }

  let status = 200;
  if (!existsSync(absolute) || !statSync(absolute).isFile()) {
    absolute = path.join(root, "404.html");
    status = 404;
  }

  response.writeHead(status, {
    "Cache-Control": "no-store",
    "Content-Type": mime.get(path.extname(absolute).toLowerCase()) || "application/octet-stream",
  });
  createReadStream(absolute).pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`Villa Calypso QA: http://127.0.0.1:${port}\n`);
});
