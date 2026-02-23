import fs from "node:fs";
import path from "node:path";

// Carpeta donde están tus logos
const dir = path.resolve("assets/colabs");

// Archivo que vamos a generar automáticamente
const out = path.resolve("assets/colabs.generated.js");

// Extensiones válidas
const exts = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg"]);

// Leer carpeta
const files = fs.readdirSync(dir)
  .filter(f => exts.has(path.extname(f).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, "es"));

// Construir array de objetos
const logos = files.map(f => ({
  src: `assets/colabs/${f}`.replaceAll("\\", "/"),
  alt: path.parse(f).name.replace(/[-_]+/g, " ")
}));

// Generar JS global (sin módulos en navegador)
const js = `// AUTO-GENERATED FILE. Do not edit manually.
window.COLABS = ${JSON.stringify(logos, null, 2)};
`;

// Escribir archivo
fs.writeFileSync(out, js, "utf8");

console.log(`✔ ${logos.length} logos generados en assets/colabs.generated.js`);