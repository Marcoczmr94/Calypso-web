import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const base = new URL(process.argv[2] || "http://127.0.0.1:4173/");
const productionFiles = ["index.html", "404.html", "robots.txt", "sitemap.xml", "site.webmanifest", "CNAME", ".nojekyll"];

const walk = (directory) => {
  const result = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...walk(absolute));
    else result.push(path.relative(root, absolute).split(path.sep).join("/"));
  }
  return result;
};

productionFiles.push(...walk(path.join(root, "assets")));

const checks = await Promise.all(productionFiles.map(async (relative) => {
  const url = new URL(relative, base);
  const response = await fetch(url);
  return { relative, status: response.status, type: response.headers.get("content-type") || "" };
}));

const failures = checks.filter((check) => check.status !== 200);
for (const check of checks) {
  process.stdout.write(`${check.status === 200 ? "PASS" : "FAIL"}  ${check.status}  ${check.relative}  ${check.type}\n`);
}

const missing = await fetch(new URL("ruta-que-no-existe", base));
if (missing.status !== 404) failures.push({ relative: "ruta-que-no-existe", status: missing.status });
else process.stdout.write("PASS  404  Las rutas inexistentes devuelven estado 404\n");

if (failures.length) process.exit(1);
process.stdout.write(`PASS  ${checks.length} recursos de producción respondieron sin 404\n`);
