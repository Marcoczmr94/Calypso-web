import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const required = [
  "index.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "site.webmanifest",
  "CNAME",
  ".nojekyll",
  "assets/css/site.css",
  "assets/js/config.js",
  "assets/js/site.js",
  "assets/brand/logo-calypso-600.png"
];

const failures = [];
const pass = (message) => process.stdout.write(`PASS  ${message}\n`);
const fail = (message) => failures.push(message);

for (const relative of required) {
  const exists = fs.existsSync(path.join(root, relative));
  if (exists) pass(`Existe ${relative}`);
  else fail(`Falta ${relative}`);
}

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "assets/css/site.css"), "utf8");
const config = fs.readFileSync(path.join(root, "assets/js/config.js"), "utf8");
const siteJs = fs.readFileSync(path.join(root, "assets/js/site.js"), "utf8");

const assertions = [
  [!/(?:src|href)=["']\/assets\//.test(html), "No hay rutas /assets absolutas"],
  [!/(?:src|href)=["']#["']/.test(html), "No hay enlaces ficticios #"],
  [!/(?:src|href)=["']data:/.test(html), "No hay recursos base64 embebidos"],
  [/rel=["']canonical["']/.test(html), "Existe canonical"],
  [/https:\/\/villacalypso\.mx\//.test(html) && /villacalypso\.mx/.test(config), "El dominio canónico es villacalypso.mx"],
  [/property=["']og:image["']/.test(html), "Existe imagen Open Graph"],
  [/application\/ld\+json/.test(html), "Existen datos estructurados"],
  [/MCZ-REFERIDO/.test(config) && !/MARCO-WEB-CALYPSO/.test(config), "El referido comercial MCZ está configurado"],
  [/promotionCode:\s*["']MCZ10["']/.test(config) && /promotionDiscount:\s*["']10%["']/.test(config), "El código promocional y descuento están configurados"],
  [/MCZ10/.test(html) && /10% de descuento/.test(html), "El beneficio web se comunica en la página"],
  [/VC-\$\{stamp\}-\$\{time\}-\$\{String\(sequence\)\.padStart\(2, "0"\)\}/.test(siteJs), "El folio incluye fecha, hora y secuencia"],
  [/527442297671/.test(config), "El número técnico de WhatsApp está configurado"],
  [/id=["']siteIntro["']/.test(html) && /id=["']introExplore["']/.test(html), "La apertura fotográfica incluye el botón Explorar"],
  [!/<video\b/.test(html) && !/assets\/cinema\//.test(html + css + siteJs), "El sitio no publica ni reproduce video"],
  [/intro-active/.test(siteJs) && /setBackgroundInert/.test(siteJs), "La introducción bloquea el fondo de forma accesible"],
  [/prefers-reduced-motion/.test(css), "Existe soporte para movimiento reducido"],
  [/srcset=/.test(html) && /type=["']image\/avif/.test(html), "La galería usa srcset y AVIF"],
  [/villa-pool-wide-1920\.webp["'] width=["']1920["'] height=["']2560["']/.test(html), "Las fotos de alta resolución declaran dimensiones"],
  [!/assets\/images\/source\//.test(html + siteJs), "La entrega no depende de fuentes de edición"],
  [!/assets\/images\/(?:optimized\/)?acapulco-/.test(html + css + siteJs), "La interfaz no depende de fotografías externas de Acapulco"],
  [!/assets\/images\/(?:pool|golden|bluehour|villa-table-local|acapulco-bay-premium)\.(?:jpg|webp)/.test(html + css + siteJs), "La entrega no depende de imágenes históricas"],
  [!/optimized\/(?:pool|golden|bluehour|villa-table-local|acapulco-bay-premium)-/.test(html + css + siteJs), "La entrega no depende de variantes históricas"],
  [fs.statSync(path.join(root, "404.html")).size < 5000, "La página 404 es ligera"]
];

for (const [condition, message] of assertions) {
  if (condition) pass(message);
  else fail(message);
}

const references = new Set();
const captureReferences = (text, pattern) => {
  for (const match of text.matchAll(pattern)) references.add(match[1]);
};
captureReferences(html, /(?:src|href)=["'](\.\/[^"'#?]+)["']/g);
captureReferences(html, /srcset=["']([^"']+)["']/g);
captureReferences(css, /url\(["']?(\.\.\/[^"')?]+)["']?\)/g);

for (const reference of references) {
  if (reference.includes(",") || reference.includes(" ")) {
    for (const candidate of reference.split(",")) {
      const url = candidate.trim().split(/\s+/)[0];
      if (!url.startsWith("./")) continue;
      const file = path.resolve(root, url.slice(2));
      if (!fs.existsSync(file)) fail(`Referencia inexistente: ${url}`);
    }
    continue;
  }
  const base = reference.startsWith("../") ? path.join(root, "assets/css") : root;
  const file = path.resolve(base, reference);
  if (!fs.existsSync(file)) fail(`Referencia inexistente: ${reference}`);
}

if (failures.length) {
  for (const message of failures) process.stderr.write(`FAIL  ${message}\n`);
  process.exit(1);
}

pass("Todas las comprobaciones estáticas terminaron sin errores");
