#!/usr/bin/env node
/**
 * Local preview of README.md roughly as GitHub renders it on a profile page
 * (~900px content column), in both light and dark themes.
 *   node tools/preview.mjs [outDir]   -> outDir/preview-light.html, preview-dark.html
 * The README is pure HTML blocks, so it is inlined as-is; relative asset
 * paths are rewritten to file:// URLs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.resolve(process.argv[2] || path.join(ROOT, "tools/.preview"));
fs.mkdirSync(out, { recursive: true });
const base = pathToFileURL(ROOT + path.sep).href;
const body = fs.readFileSync(path.join(ROOT, "README.md"), "utf8")
  .replace(/src="assets\//g, `src="${base}assets/`)
  .split(/\n\s*\n/).map((block) => `<div class="blk">${block}</div>`).join("\n");

const themes = {
  light: { bg: "#ffffff", fg: "#1f2328", border: "#d0d7de" },
  dark: { bg: "#0d1117", fg: "#e6edf3", border: "#30363d" },
};
for (const [name, t] of Object.entries(themes)) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>README preview (${name})</title>
<style>
  body { margin: 0; background: ${t.bg}; color: ${t.fg}; font: 16px -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; }
  .box { width: 900px; margin: 24px auto; border: 1px solid ${t.border}; border-radius: 6px; padding: 24px; box-sizing: border-box; }
  .blk { margin: 0 0 16px; }
  .blk > p { margin: 0; }
  img { max-width: 100%; box-sizing: content-box; vertical-align: middle; }
  a { color: #4493f8; }
</style></head><body><div class="box">
${body}
</div></body></html>`;
  const file = path.join(out, `preview-${name}.html`);
  fs.writeFileSync(file, html);
  console.log(file);
}
