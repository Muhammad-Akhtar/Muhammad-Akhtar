#!/usr/bin/env node
/**
 * Builds every static SVG in assets/ for the profile README.
 *   node tools/generate.mjs
 * Colours and fonts live in tools/theme.mjs. The contribution grid is built
 * separately by tools/contributions.mjs (it needs live GitHub data).
 * No external fonts or images: the portrait is embedded as base64.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { C, esc, baseStyle, open, frame } from "./theme.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "assets");
fs.mkdirSync(OUT, { recursive: true });
const write = (name, svg) => {
  fs.writeFileSync(path.join(OUT, name), svg.trim() + "\n", "utf8");
  console.log(`wrote assets/${name} (${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB)`);
};

/* ------------------------------------------------------------------ hero */
function hero() {
  const W = 1200, H = 480;
  const photo = fs.readFileSync(path.join(ROOT, "tools/src/akhtar.jpg")).toString("base64");
  const PX = 965, PY = 232, PR = 128, OR = 190;
  const orbit = [
    ["LLM", -120], ["API", -30], ["DATA", 30], ["VISION", 150],
  ].map(([label, deg]) => {
    const a = (deg * Math.PI) / 180;
    const x = PX + OR * Math.cos(a), y = PY + OR * Math.sin(a);
    const left = Math.cos(a) < 0;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" fill="${C.accent}"/>
    <text class="mono" x="${(x + (left ? -10 : 10)).toFixed(1)}" y="${(y + 4).toFixed(1)}" font-size="11" letter-spacing="1.6" fill="${C.muted}"${left ? ' text-anchor="end"' : ""}>${label}</text>`;
  }).join("\n    ");
  const stars = [[700, 70, 1], [1060, 60, 1], [640, 250, 1], [1120, 380, 1.3], [760, 420, 1], [560, 40, 1]]
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.text}" opacity=".7"/>`).join("");

  return `${open(W, H, "Muhammad Akhtar — Turning difficult business problems into simple, dependable solutions.",
    "Senior Software Engineer, AI Engineer and Full-Stack developer with 6+ years of experience in Python, Django, FastAPI, Laravel and Next.js.")}
  ${frame(W, H, { cx: "78%", cy: "28%", r: "60%", strength: 0.75 })}
  <defs>
    <radialGradient id="glow2" cx="12%" cy="95%" r="40%"><stop offset="0" stop-color="${C.accent}" stop-opacity=".22"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="${C.text}" stroke-opacity=".035"/></pattern>
    <linearGradient id="name" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.blush}"/><stop offset="1" stop-color="${C.accent}"/></linearGradient>
    <linearGradient id="rule" gradientUnits="userSpaceOnUse" x1="72" y1="0" x2="600" y2="0"><stop offset="0" stop-color="${C.accent}" stop-opacity="0"/><stop offset=".5" stop-color="${C.accent}"/><stop offset="1" stop-color="${C.accent}" stop-opacity=".2"/></linearGradient>
    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.blush}"/><stop offset="1" stop-color="${C.plum}"/></linearGradient>
    <radialGradient id="halo"><stop offset=".6" stop-color="${C.plum}" stop-opacity=".7"/><stop offset="1" stop-color="${C.plum}" stop-opacity="0"/></radialGradient>
    <clipPath id="clip"><circle cx="${PX}" cy="${PY}" r="${PR}"/></clipPath>
    <clipPath id="right"><rect x="480" y="0" width="720" height="${H}" rx="20"/></clipPath>
  </defs>
  ${baseStyle(`.d1{animation-delay:.15s}.d2{animation-delay:.3s}.d3{animation-delay:.45s}.d4{animation-delay:.6s}.d5{animation-delay:.75s}`)}
  <rect width="${W}" height="${H}" rx="20" fill="url(#glow2)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)" clip-path="url(#right)" opacity=".9"/>
  ${stars}

  <!-- portrait -->
  <g class="fade d2">
    <circle cx="${PX}" cy="${PY}" r="${OR}" fill="none" stroke="${C.accent}" stroke-opacity=".28"/>
    <circle cx="${PX}" cy="${PY}" r="${PR + 22}" fill="none" stroke="${C.accent}" stroke-opacity=".18" stroke-dasharray="2 6"/>
    <circle cx="${PX}" cy="${PY}" r="${PR + 40}" fill="url(#halo)"/>
    <image href="data:image/jpeg;base64,${photo}" x="${PX - PR}" y="${PY - PR}" width="${PR * 2}" height="${PR * 2}" clip-path="url(#clip)" preserveAspectRatio="xMidYMid slice"/>
    <circle cx="${PX}" cy="${PY}" r="${PR}" fill="none" stroke="url(#ring)" stroke-width="3"/>
    ${orbit}
    <circle class="motion" r="4" fill="${C.text}">
      <animateMotion dur="18s" repeatCount="indefinite" path="M${PX + OR} ${PY} A${OR} ${OR} 0 1 1 ${PX - OR} ${PY} A${OR} ${OR} 0 1 1 ${PX + OR} ${PY}"/>
    </circle>
  </g>

  <!-- prompt pill -->
  <g class="in">
    <rect x="72" y="62" width="318" height="36" rx="18" fill="${C.bgDeep}" fill-opacity=".7" stroke="${C.accent}" stroke-opacity=".3"/>
    <circle cx="92" cy="80" r="4" fill="${C.accent}"/>
    <text class="mono" x="106" y="85" font-size="13" fill="${C.muted}">~/akhtar $ <tspan fill="${C.text}">ship --dependable</tspan></text>
    <rect class="blink" x="370" y="71" width="8" height="18" fill="${C.blush}"/>
  </g>

  <g class="in d1">
    <path d="M72 134 H104" stroke="${C.accent}"/>
    <text class="mono" x="116" y="138" font-size="12" letter-spacing="3.6" fill="${C.accent}">AI ENGINEERING · FULL-STACK · 6+ YEARS</text>
  </g>
  <g class="in d2">
    <text class="serif" x="66" y="226" font-size="84" letter-spacing="-1.5" fill="${C.text}">Muhammad</text>
    <text class="serif" x="66" y="314" font-size="84" font-style="italic" letter-spacing="-1.5" fill="url(#name)">Akhtar<tspan fill="${C.accent}">.</tspan></text>
  </g>
  <path class="draw" d="M72 344 H600" stroke="url(#rule)" stroke-width="1.2"/>
  <circle cx="600" cy="344" r="3.5" fill="${C.text}"/>
  <g class="in d3">
    <text class="mono" x="72" y="382" font-size="13" letter-spacing="2.6" fill="${C.text}">SENIOR SOFTWARE ENGINEER · AI ENGINEER · FULL-STACK</text>
  </g>
  <g class="in d4">
    <text class="serif" x="72" y="416" font-size="20" font-style="italic" fill="${C.muted}">Turning difficult business problems into simple, dependable solutions.</text>
  </g>
  <g class="fade d5">
    <path d="M72 442 H1128" stroke="${C.accent}" stroke-opacity=".14"/>
    <text class="mono" x="72" y="464" font-size="10.5" letter-spacing="2" fill="${C.muted}">PYTHON · DJANGO · FASTAPI · LARAVEL · NEXT.JS · AWS</text>
    <text class="mono" x="1128" y="464" font-size="10.5" letter-spacing="2" fill="${C.blush}" text-anchor="end">API 14s → 2s · $30K/YR SAVED · 200+ KPIS</text>
  </g>
</svg>`;
}

/* ------------------------------------------------------- section titles */
function title(num, label, lead, em, right, alt) {
  const W = 1200, H = 120;
  return `${open(W, H, alt)}
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.bg}"/><stop offset="1" stop-color="${C.bgDeep}"/></linearGradient>
    <linearGradient id="line" gradientUnits="userSpaceOnUse" x1="40" y1="0" x2="1160" y2="0"><stop offset="0" stop-color="${C.accent}"/><stop offset=".6" stop-color="${C.plum}"/><stop offset="1" stop-color="${C.plum}" stop-opacity="0"/></linearGradient>
    <linearGradient id="sheen" gradientUnits="userSpaceOnUse" x1="-300" y1="0" x2="0" y2="0">
      <stop offset="0" stop-color="${C.blush}"/><stop offset=".5" stop-color="${C.text}"/><stop offset="1" stop-color="${C.blush}"/>
      <animateTransform attributeName="gradientTransform" type="translate" values="0 0;1500 0;1500 0" keyTimes="0;.4;1" dur="7s" begin="1.5s" repeatCount="indefinite"/>
    </linearGradient>
    <radialGradient id="pulse"><stop offset="0" stop-color="${C.text}"/><stop offset=".5" stop-color="${C.blush}" stop-opacity=".6"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/></radialGradient>
  </defs>
  ${baseStyle(".d2{animation-delay:.2s}.d3{animation-delay:.45s}")}
  <rect width="${W}" height="${H}" rx="16" fill="url(#bg)"/>
  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="15.5" fill="none" stroke="${C.accent}" stroke-opacity=".12"/>
  <g class="in"><text class="mono" x="40" y="36" font-size="12" letter-spacing="3" fill="${C.accent}"><tspan fill="${C.blush}">${num}</tspan>   ${esc(label)}</text></g>
  <g class="in d2"><text class="serif" x="38" y="84" font-size="42" letter-spacing="-1" fill="${C.text}">${esc(lead)} <tspan font-style="italic" fill="url(#sheen)">${esc(em)}</tspan></text></g>
  <g class="in d3"><text class="mono" x="1160" y="36" text-anchor="end" font-size="10.5" letter-spacing="2.4" fill="${C.muted}">${esc(right)}</text></g>
  <path class="draw" d="M40 104 H1160" stroke="url(#line)"/>
  <circle class="motion" cx="40" cy="104" r="7" fill="url(#pulse)" opacity="0">
    <animate attributeName="cx" values="40;1160" dur="6s" begin="2.3s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines=".45 0 .55 1"/>
    <animate attributeName="opacity" values="0;1;0" keyTimes="0;.15;1" dur="6s" begin="2.3s" repeatCount="indefinite"/>
  </circle>
</svg>`;
}

/* ----------------------------------------------------------------- about */
function about() {
  const W = 1200, H = 420;
  const lines = [
    ["whoami", "Muhammad Akhtar · Senior Software Engineer · AI Engineer"],
    ["cat experience.txt", "6+ years · Vaival Technologies · Bitsoft · Graymatrix"],
    ["cat path.txt", "backend → full stack → senior → lead → AI software engineer"],
    ["ls ./shipped", "donor-enrichment image-segmentation n8n-sync eviction-compliance"],
    ["echo $PRINCIPLE", "difficult business problems → simple, dependable solutions"],
  ];
  const term = lines.map(([cmd, out], i) => {
    const y = 122 + i * 50;
    return `<g class="in" style="animation-delay:${(0.4 + i * 0.35).toFixed(2)}s">
      <text class="mono" x="72" y="${y}" font-size="14" fill="${C.accent}">$ <tspan fill="${C.text}">${esc(cmd)}</tspan></text>
      <text class="mono" x="72" y="${y + 25}" font-size="13.5" fill="${C.plum}">→ <tspan fill="${C.muted}">${esc(out)}</tspan></text>
    </g>`;
  }).join("\n    ");
  const cards = [
    ["PRIMARY STACK", "Python", "Django · FastAPI · Celery"],
    ["WHERE AI LIVES", "LLMs &amp; Vision", "OpenAI · agentic AI · computer vision"],
    ["ALSO SHIPS IN", "PHP · Laravel", "CodeIgniter · React · Next.js"],
  ].map(([k, big, sub], i) => {
    const y = 66 + i * 102;
    return `<g class="in" style="animation-delay:${(0.6 + i * 0.2).toFixed(2)}s">
      <rect x="836" y="${y}" width="324" height="88" rx="12" fill="${C.bgDeep}" fill-opacity=".75" stroke="${C.accent}" stroke-opacity=".2"/>
      <rect x="836" y="${y + 4}" width="3" height="80" rx="1.5" fill="${C.accent}"/>
      <text class="mono" x="858" y="${y + 24}" font-size="9.5" letter-spacing="2.2" fill="${C.accent}">${k}</text>
      <text class="serif" x="857" y="${y + 58}" font-size="29" fill="${C.text}">${big}</text>
      <text class="sans" x="858" y="${y + 77}" font-size="12" fill="${C.muted}">${sub}</text>
    </g>`;
  }).join("\n    ");
  return `${open(W, H, "About Muhammad Akhtar",
    "Senior Software Engineer and AI Engineer with 6+ years across Vaival Technologies, Bitsoft and Graymatrix. Grew from backend developer to full stack, senior, lead and AI software engineer. Primary stack Python with Django, FastAPI and Celery; AI work with LLMs, OpenAI, agentic AI and computer vision; also PHP, Laravel, CodeIgniter, React and Next.js.")}
  ${frame(W, H, { cx: "80%", cy: "20%" })}
  <defs><pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="${C.text}" opacity=".025"/></pattern></defs>
  ${baseStyle()}
  <g class="fade">
    <rect x="40" y="40" width="760" height="340" rx="14" fill="${C.bgDeep}" fill-opacity=".72" stroke="${C.accent}" stroke-opacity=".2"/>
    <rect x="40" y="40" width="760" height="340" rx="14" fill="url(#scan)"/>
    <path d="M40 76 H800" stroke="${C.accent}" stroke-opacity=".15"/>
    <circle cx="62" cy="58" r="5" fill="${C.plum}"/><circle cx="80" cy="58" r="5" fill="${C.plumDeep}"/><circle cx="98" cy="58" r="5" fill="${C.plumDeep}"/>
    <text class="mono" x="420" y="62" font-size="12" fill="${C.muted}" text-anchor="middle">akhtar@portfolio: ~</text>
  </g>
    ${term}
  <rect class="blink" x="72" y="360" width="8" height="2" fill="${C.blush}"/>
    ${cards}
</svg>`;
}

/* ---------------------------------------------------------------- impact */
function impact() {
  const W = 1200, H = 430;
  const stats = [
    ["DATA INTEGRATION", "11GB+", "of data integrated"],
    ["KPIS", "200+", "KPIs integrated"],
    ["HR &amp; PAYROLL", "190+", "transactions handled"],
    ["ACCURACY", "98%", "across 197 employees"],
    ["PROVISIONING", "95%", "faster provisioning"],
  ].map(([k, v, sub], i) => {
    const x = 36 + i * 230;
    return `<g class="in" style="animation-delay:${(0.6 + i * 0.12).toFixed(2)}s">
      <circle cx="${x}" cy="300" r="3.5" fill="${C.blush}"/>
      <text class="mono" x="${x}" y="334" font-size="10" letter-spacing="2" fill="${C.accent}">${k}</text>
      <text class="serif" x="${x - 1}" y="374" font-size="36" fill="${C.text}">${v}</text>
      <text class="sans" x="${x}" y="398" font-size="12.5" fill="${C.muted}">${sub}</text>
    </g>`;
  }).join("\n    ");
  return `${open(W, H, "Impact",
    "API response time cut from 14 seconds to 2 seconds with ElasticSearch. N8N workflow automation cut costs by 25% and saves $30K a year. 11GB+ of data integrated, 200+ KPIs, 190+ HR and payroll transactions, 98% accuracy across 197 employees, provisioning 95% faster.")}
  ${frame(W, H, { cx: "45%", cy: "0%", r: "60%", strength: 0.45 })}
  <defs>
    <linearGradient id="card" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.plumDeep}" stop-opacity=".55"/><stop offset="1" stop-color="${C.bgDeep}" stop-opacity=".4"/></linearGradient>
    <radialGradient id="cglow" cx="80%" cy="0%" r="80%"><stop offset="0" stop-color="${C.plum}" stop-opacity=".7"/><stop offset="1" stop-color="${C.plum}" stop-opacity="0"/></radialGradient>
    <linearGradient id="ghost" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.text}" stop-opacity=".22"/><stop offset="1" stop-color="${C.text}" stop-opacity="0"/></linearGradient>
    <clipPath id="c1"><rect x="24" y="24" width="690" height="250" rx="16"/></clipPath>
    <clipPath id="c2"><rect x="730" y="24" width="446" height="250" rx="16"/></clipPath>
  </defs>
  ${baseStyle()}
  <g class="in">
    <rect x="24" y="24" width="690" height="250" rx="16" fill="url(#card)"/>
    <rect x="24" y="24" width="690" height="250" rx="16" fill="url(#cglow)"/>
    <text class="serif" x="700" y="140" font-size="124" text-anchor="end" fill="url(#ghost)" clip-path="url(#c1)">14s→2s</text>
    <rect x="24.5" y="24.5" width="689" height="249" rx="15.5" fill="none" stroke="${C.accent}" stroke-opacity=".22"/>
    <text class="mono" x="58" y="176" font-size="11" letter-spacing="3" fill="${C.accent}">ELASTICSEARCH · API PERFORMANCE</text>
    <text class="serif" x="56" y="226" font-size="44" fill="${C.text}">14s → 2s <tspan font-style="italic" fill="${C.blush}">response time</tspan></text>
    <text class="sans" x="58" y="254" font-size="13.5" fill="${C.muted}">API response time optimised with ElasticSearch</text>
  </g>
  <g class="in" style="animation-delay:.2s">
    <rect x="730" y="24" width="446" height="250" rx="16" fill="${C.bgDeep}" fill-opacity=".5"/>
    <text class="serif" x="1200" y="128" font-size="120" font-style="italic" text-anchor="end" fill="none" stroke="${C.text}" stroke-opacity=".2" clip-path="url(#c2)">$30K</text>
    <rect x="730.5" y="24.5" width="445" height="249" rx="15.5" fill="none" stroke="${C.accent}" stroke-opacity=".22"/>
    <text class="mono" x="762" y="176" font-size="11" letter-spacing="3" fill="${C.accent}">N8N · WORKFLOW AUTOMATION</text>
    <text class="serif" x="760" y="226" font-size="44" fill="${C.text}">$30K <tspan font-style="italic" fill="${C.blush}">saved / yr</tspan></text>
    <text class="sans" x="762" y="254" font-size="13.5" fill="${C.muted}">Operating costs cut 25% with N8N workflows</text>
  </g>
  <path class="draw" d="M24 300 H1176" stroke="${C.accent}" stroke-opacity=".3"/>
    ${stats}
</svg>`;
}

/* -------------------------------------------------------------- projects */
const chip = (x, y, label, hot = false) => {
  const w = Math.round(label.length * 7.1 + 28);
  return [`<rect x="${x}" y="${y}" width="${w}" height="28" rx="14" fill="${hot ? C.plum : C.plumDeep}" fill-opacity="${hot ? ".55" : ".5"}" stroke="${C.accent}" stroke-opacity="${hot ? ".6" : ".3"}"/>
      <text class="mono" x="${x + w / 2}" y="${y + 18}" font-size="11.5" text-anchor="middle" fill="${hot ? C.text : C.blush}">${esc(label)}</text>`, w];
};

function project({ file, n, kicker, name, sub, built, metrics, chips, art, alt }) {
  const W = 1200, H = 370;
  let cx = 56;
  const chipSvg = chips.map((c) => {
    const hot = c.startsWith("*");
    const [s, w] = chip(cx, 310, hot ? c.slice(1) : c, hot);
    cx += w + 8;
    return s;
  }).join("\n      ");
  if (cx > 740) throw new Error(`${file}: chips overflow (${cx})`);
  const metricSvg = metrics.map(([v, l], i) => `<text class="serif" x="${56 + i * 205}" y="270" font-size="36" fill="${C.text}">${esc(v)}</text>
      <text class="sans" x="${57 + i * 205}" y="293" font-size="13" fill="${C.muted}">${esc(l)}</text>`).join("\n      ");
  write(file, `${open(W, H, `${name}: ${sub}`, alt)}
  ${frame(W, H, { cx: "78%", cy: "40%", r: "55%", strength: 0.6 })}
  <defs>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="${C.text}" stroke-opacity=".03"/></pattern>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  ${baseStyle(".d1{animation-delay:.15s}.d2{animation-delay:.3s}.d3{animation-delay:.45s}.d4{animation-delay:.6s}")}
  <rect x="720" y="0" width="480" height="${H}" fill="url(#grid)"/>
  <g class="in"><text class="mono" x="56" y="58" font-size="11" letter-spacing="3" fill="${C.accent}">${String(n).padStart(2, "0")} · ${esc(kicker)}</text></g>
  <g class="in d1"><text class="serif" x="54" y="118" font-size="46" letter-spacing="-.5" fill="${C.text}">${esc(name)}</text></g>
  <g class="in d2">
    <text class="sans" x="56" y="158" font-size="17" fill="${C.muted}">${esc(sub)}</text>
    <text class="mono" x="56" y="192" font-size="12.5" fill="${C.accent}">BUILT › <tspan fill="${C.text}">${esc(built)}</tspan></text>
  </g>
  <path class="draw" d="M56 220 H690" stroke="${C.accent}" stroke-opacity=".3"/>
  <g class="in d3">
      ${metricSvg}
  </g>
  <g class="in d4">
      ${chipSvg}
  </g>
  <g class="fade d2">
  ${art}
  </g>
</svg>`);
}

// Small helper for the node diagrams on the right of each banner.
const node = (x, y, w, label, { hot = false, h = 34 } = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${hot ? C.plum : C.bgDeep}" fill-opacity="${hot ? ".8" : ".85"}" stroke="${hot ? C.blush : C.accent}" stroke-opacity="${hot ? ".8" : ".4"}"/>
    <text class="mono" x="${x + w / 2}" y="${y + h / 2 + 4}" font-size="11.5" text-anchor="middle" fill="${hot ? C.text : C.blush}">${label}</text>`;
const flow = (d, dur, begin = 0) => `<path d="${d}" fill="none" stroke="${C.accent}" stroke-opacity=".45" stroke-dasharray="3 5"/>
    <circle class="motion" r="3.2" fill="${C.text}" filter="url(#soft)"><animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="${d}"/></circle>`;

const artDonor = () => {
  const srcs = [["RocketReach", 92], ["TruthFinder", 158], ["FEC API", 224]];
  return `${srcs.map(([l, y]) => node(780, y, 124, l)).join("\n    ")}
    ${srcs.map(([, y], i) => flow(`M904 ${y + 17} C940 ${y + 17} 930 175 968 175`, 2.4, i * 0.6)).join("\n    ")}
    <circle cx="992" cy="175" r="26" fill="${C.plum}" stroke="${C.blush}" stroke-opacity=".8"/>
    <text class="mono" x="992" y="179" font-size="10" text-anchor="middle" fill="${C.text}" letter-spacing="1">AI</text>
    ${flow("M1018 175 H1040", 1.2)}
    <rect x="1040" y="84" width="122" height="182" rx="12" fill="${C.bgDeep}" fill-opacity=".9" stroke="${C.accent}" stroke-opacity=".45"/>
    <circle cx="1101" cy="122" r="18" fill="${C.plumDeep}" stroke="${C.accent}" stroke-opacity=".6"/>
    <circle cx="1101" cy="117" r="6" fill="${C.accent}"/><path d="M1090 132 a11 9 0 0 1 22 0" fill="${C.accent}"/>
    <rect x="1056" y="152" width="90" height="6" rx="3" fill="${C.blush}" opacity=".8"/>
    <rect x="1056" y="166" width="70" height="5" rx="2.5" fill="${C.muted}" opacity=".35"/>
    <rect x="1056" y="178" width="80" height="5" rx="2.5" fill="${C.muted}" opacity=".35"/>
    <rect x="1056" y="190" width="58" height="5" rx="2.5" fill="${C.muted}" opacity=".35"/>
    <rect x="1056" y="226" width="90" height="24" rx="12" fill="${C.plum}" fill-opacity=".7"/>
    <text class="mono" x="1101" y="242" font-size="10.5" text-anchor="middle" fill="${C.text}">✓ enriched</text>
    <text class="mono" x="780" y="300" font-size="10" letter-spacing="2" fill="${C.muted}">CHROME EXTENSION (MV3) · FASTAPI · REDIS</text>`;
};

const artSegment = () => {
  // three stacked, skewed planes: background, foreground, text
  const plane = (dx, dy, fill, label, inner, delay) => `<g class="in" style="animation-delay:${delay}s" transform="translate(${dx} ${dy})">
      <path d="M0 40 L170 0 L300 40 L130 80 Z" fill="${fill}" fill-opacity=".85" stroke="${C.blush}" stroke-opacity=".5"/>
      ${inner}
      <text class="mono" x="312" y="44" font-size="10.5" letter-spacing="1.6" fill="${C.muted}">${label}</text>
    </g>`;
  return `${plane(770, 196, C.plumDeep, "BACKGROUND", `<path d="M40 40 L170 10 L260 40 L130 70 Z" fill="${C.plum}" opacity=".6">
        <animate class="motion" attributeName="fill" values="${C.plum};${C.rose};${C.accent};${C.plum}" dur="6s" repeatCount="indefinite"/></path>`, 0.5)}
    ${plane(770, 128, C.bgDeep, "FOREGROUND", `<ellipse cx="150" cy="40" rx="52" ry="20" fill="${C.accent}" opacity=".85">
        <animate class="motion" attributeName="fill" values="${C.accent};${C.blush};${C.rose};${C.accent}" dur="6s" begin="2s" repeatCount="indefinite"/></ellipse>`, 0.7)}
    ${plane(770, 60, C.bgDeep, "TEXT", `<text class="serif" x="150" y="48" font-size="26" font-style="italic" text-anchor="middle" fill="${C.text}" transform="skewX(-10)" dx="8">Aa</text>`, 0.9)}
    <path d="M770 80 V276 M1070 100 V296" stroke="${C.accent}" stroke-opacity=".25" stroke-dasharray="2 5"/>
    <g transform="translate(780 318)">${[C.plum, C.rose, C.accent, C.blush, C.text].map((c, i) => `<rect x="${i * 26}" y="0" width="18" height="18" rx="5" fill="${c}"/>`).join("")}
      <text class="mono" x="140" y="13" font-size="10" letter-spacing="2" fill="${C.muted}">RECOLOUR ANY LAYER</text></g>`;
};

const artN8n = () => {
  const hub = [966, 175];
  const outer = [["ERPNext", 774, 70], ["Everee", 774, 262], ["Supabase", 1050, 70], ["Zoho Shift", 1050, 262]];
  const paths = outer.map(([, x, y], i) => {
    const sx = x < 900 ? x + 110 : x, sy = y + 17;
    return flow(`M${sx} ${sy} C${(sx + hub[0]) / 2} ${sy} ${(sx + hub[0]) / 2} ${hub[1]} ${hub[0]} ${hub[1]}`, 2.2, i * 0.5);
  }).join("\n    ");
  return `${paths}
    ${outer.map(([l, x, y]) => node(x, y, 110, l)).join("\n    ")}
    <rect x="${hub[0] - 46}" y="${hub[1] - 46}" width="92" height="92" rx="22" fill="${C.plum}" stroke="${C.blush}" stroke-opacity=".8"/>
    <rect x="${hub[0] - 58}" y="${hub[1] - 58}" width="116" height="116" rx="28" fill="none" stroke="${C.accent}" stroke-opacity=".3" stroke-dasharray="2 6"/>
    <text class="serif" x="${hub[0]}" y="${hub[1] + 2}" font-size="26" text-anchor="middle" fill="${C.text}">N8N</text>
    <text class="mono" x="${hub[0]}" y="${hub[1] + 22}" font-size="9" letter-spacing="1.6" text-anchor="middle" fill="${C.blush}">SYNC</text>
    <text class="mono" x="966" y="338" font-size="10" letter-spacing="2" text-anchor="middle" fill="${C.muted}">EMPLOYEE DATA · KEPT IN SYNC</text>`;
};

const artEviction = () => {
  const lines = [0, 1, 2, 3, 4, 5].map((i) => `<rect x="24" y="${78 + i * 22}" width="${[150, 120, 140, 96, 132, 110][i]}" height="6" rx="3" fill="${i === 2 ? C.blush : C.muted}" opacity="${i === 2 ? ".85" : ".3"}"/>`).join("");
  const cal = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
    const hot = r === 2 && c === 3;
    cal.push(`<rect x="${16 + c * 20}" y="${48 + r * 18}" width="14" height="12" rx="3" fill="${hot ? C.blush : C.plumDeep}" opacity="${hot ? 1 : 0.8}"/>`);
  }
  return `<g transform="translate(800 48) rotate(-4)">
      <rect width="210" height="250" rx="12" fill="${C.bgDeep}" fill-opacity=".92" stroke="${C.accent}" stroke-opacity=".45"/>
      <rect width="210" height="44" rx="12" fill="${C.plumDeep}"/><rect y="30" width="210" height="14" fill="${C.plumDeep}"/>
      <text class="mono" x="24" y="27" font-size="11" letter-spacing="2.4" fill="${C.blush}">NOTICE</text>
      ${lines}
      <rect x="24" y="212" width="104" height="22" rx="11" fill="${C.plum}" fill-opacity=".75"/>
      <text class="mono" x="76" y="227" font-size="10" text-anchor="middle" fill="${C.text}">auto-filled</text>
    </g>
    <g transform="translate(1000 150)">
      <rect width="152" height="136" rx="12" fill="${C.bg}" stroke="${C.blush}" stroke-opacity=".55"/>
      <text class="mono" x="16" y="30" font-size="10" letter-spacing="2" fill="${C.accent}">COURT DATE</text>
      ${cal.join("")}
      <circle class="motion" cx="83" cy="90" r="11" fill="none" stroke="${C.blush}"><animate attributeName="r" values="9;15;9" dur="2.4s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0;1" dur="2.4s" repeatCount="indefinite"/></circle>
    </g>
    <g transform="translate(1000 74)">
      ${node(0, 0, 152, "Yardi SOAP API", { h: 30 })}
    </g>
    ${flow("M1076 104 V150", 1.6)}`;
};

/* ------------------------------------------------------------ toolkit */
function toolkit() {
  const W = 1200, H = 500;
  const cards = [
    ["01 AI · LLM · VISION", "LLMs · Agentic AI", "Computer Vision", "OpenAI API", ""],
    ["02 BACKEND", "Python", "Django · FastAPI · Celery", "PHP · Laravel · CodeIgniter", "PRIMARY"],
    ["03 FRONTEND", "React · Next.js", "JavaScript", "Chrome Extensions (MV3)", ""],
    ["04 DATA &amp; SEARCH", "PostgreSQL · MySQL", "MongoDB · Redis", "ElasticSearch", ""],
    ["05 CLOUD &amp; DEVOPS", "AWS · EC2", "GitHub Actions · CI/CD", "DevOps", ""],
    ["06 AUTOMATION &amp; APIS", "N8N Workflows", "Stripe · OpenAI", "RocketReach · FEC · Yardi", ""],
  ].map(([k, a, b, c, tag], i) => {
    const x = 32 + (i % 3) * 388, y = 32 + Math.floor(i / 3) * 236;
    return `<g class="in" style="animation-delay:${(0.2 + i * 0.12).toFixed(2)}s">
      <rect x="${x}" y="${y}" width="360" height="200" rx="16" fill="${C.bgDeep}" fill-opacity=".72" stroke="${C.accent}" stroke-opacity=".2"/>
      <text class="mono" x="${x + 24}" y="${y + 36}" font-size="10" letter-spacing="2" fill="${C.accent}">${k}</text>
      <text class="serif" x="${x + 23}" y="${y + 92}" font-size="32" fill="${C.text}">${a}${tag ? `<tspan class="mono" dx="12" dy="-14" font-size="10" letter-spacing="1.5" fill="${C.accent}">${tag}</tspan>` : ""}</text>
      <text class="serif" x="${x + 24}" y="${y + 132}" font-size="22" fill="${C.text}">${b}</text>
      <text class="serif" x="${x + 24}" y="${y + 166}" font-size="20" fill="${C.muted}">${c}</text>
    </g>`;
  }).join("\n    ");
  return `${open(W, H, "Tech stack",
    "AI: LLMs, agentic AI, computer vision, OpenAI API. Backend: Python (primary) with Django, FastAPI and Celery; PHP with Laravel and CodeIgniter. Frontend: React, Next.js, JavaScript, Chrome extensions (MV3). Data and search: PostgreSQL, MySQL, MongoDB, Redis, ElasticSearch. Cloud and DevOps: AWS EC2, GitHub Actions, CI/CD. Automation and APIs: N8N, Stripe, OpenAI, RocketReach, FEC, Yardi.")}
  ${frame(W, H, { cx: "50%", cy: "50%", r: "55%", strength: 0.5 })}
  ${baseStyle()}
  <g stroke="${C.accent}" stroke-opacity=".14"><path d="M16 250 H1184"/><path d="M406 24 V476 M794 24 V476"/></g>
  ${[406, 794].map((x) => `<g transform="translate(${x} 250) rotate(45)"><rect x="-6" y="-6" width="12" height="12" fill="${C.bg}" stroke="${C.text}" stroke-opacity=".8"/></g>`).join("")}
    ${cards}
</svg>`;
}

/* ---------------------------------------------------------- experience */
function experience() {
  const W = 1200, H = 420;
  const X0 = 310, X1 = 1150, Y0 = 2020, Y1 = 2027;
  const px = (y, m) => X0 + ((y - Y0 + (m - 1) / 12) / (Y1 - Y0)) * (X1 - X0);
  const years = [];
  for (let y = Y0; y <= Y1 - 1; y++) {
    const x = px(y, 1);
    years.push(`<path d="M${x.toFixed(1)} 84 V350" stroke="${C.accent}" stroke-opacity=".1"/><text class="mono" x="${x.toFixed(1)}" y="72" font-size="11" letter-spacing="1.5" fill="${C.muted}">${y}</text>`);
  }
  const rows = [
    ["Vaival Technologies", "AI Engineer", [2022, 3], [2026, 6], "Mar 2022 – Jun 2026", "Backend Dev → Full Stack → Senior → Lead → AI Software Engineer"],
    ["Bitsoft", "Senior Software Engineer", [2020, 1], [2023, 1], "Jan 2020 – Jan 2023", ""],
    ["Graymatrix", "Full Stack Developer · remote", [2020, 1], [2021, 12], "Jan 2020 – Dec 2021", ""],
  ].map(([co, role, s, e, range, path], i) => {
    const y = 108 + i * 84;
    const x0 = px(...s), x1 = px(e[0], e[1] + 1);
    return `<g class="in" style="animation-delay:${(0.3 + i * 0.2).toFixed(2)}s">
      <circle cx="52" cy="${y + 8}" r="4" fill="${i === 0 ? C.blush : C.accent}"/>
      <text class="serif" x="68" y="${y + 15}" font-size="23" fill="${C.text}">${co}</text>
      <text class="sans" x="68" y="${y + 37}" font-size="13" fill="${C.muted}">${role}</text>
      <rect x="${x0.toFixed(1)}" y="${y - 6}" width="${(x1 - x0).toFixed(1)}" height="30" rx="15" fill="url(#bar${i === 0 ? "Hot" : ""})" stroke="${C.blush}" stroke-opacity="${i === 0 ? ".7" : ".3"}"/>
      <text class="mono" x="${(x0 + 16).toFixed(1)}" y="${y + 13}" font-size="11" letter-spacing=".5" fill="${C.text}">${range}</text>
      ${path ? `<text class="mono" x="${(x0 + 2).toFixed(1)}" y="${y + 46}" font-size="11" fill="${C.blush}">${esc(path)}</text>` : ""}
    </g>`;
  }).join("\n    ");
  return `${open(W, H, "Experience",
    "Vaival Technologies, AI Engineer, March 2022 to June 2026: grew from backend developer to full stack, senior, lead and AI software engineer. Bitsoft, Senior Software Engineer, January 2020 to January 2023. Graymatrix, Full Stack Developer (remote), January 2020 to December 2021.")}
  ${frame(W, H, { cx: "85%", cy: "10%" })}
  <defs>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.plumDeep}"/><stop offset="1" stop-color="${C.plum}" stop-opacity=".8"/></linearGradient>
    <linearGradient id="barHot" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.plum}"/><stop offset="1" stop-color="${C.rose}"/></linearGradient>
  </defs>
  ${baseStyle()}
  <text class="mono" x="52" y="72" font-size="11" letter-spacing="2.6" fill="${C.accent}">ROLE · COMPANY</text>
  ${years.join("\n  ")}
    ${rows}
  <path d="M40 362 H1160" stroke="${C.accent}" stroke-opacity=".16"/>
  <text class="mono" x="52" y="390" font-size="10.5" letter-spacing="2" fill="${C.muted}">6+ YEARS · BACKEND → FULL STACK → LEAD → AI ENGINEERING</text>
  <text class="mono" x="1148" y="390" font-size="10.5" letter-spacing="2" fill="${C.blush}" text-anchor="end">SENIOR SOFTWARE ENGINEER</text>
</svg>`;
}

/* -------------------------------------------------------------- footer */
function footer() {
  const W = 1200, H = 230;
  return `${open(W, H, "Akhtar — Difficult problems in. Simple, dependable solutions out.")}
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bgDeep}"/><stop offset="1" stop-color="${C.bg}"/></linearGradient>
    <radialGradient id="glow" cx="50%" cy="110%" r="60%"><stop offset="0" stop-color="${C.plum}" stop-opacity=".75"/><stop offset="1" stop-color="${C.plum}" stop-opacity="0"/></radialGradient>
    <linearGradient id="rule" gradientUnits="userSpaceOnUse" x1="150" y1="0" x2="1050" y2="0"><stop offset="0" stop-color="${C.accent}" stop-opacity="0"/><stop offset=".5" stop-color="${C.blush}" stop-opacity=".7"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/></linearGradient>
  </defs>
  ${baseStyle(".d2{animation-delay:.3s}.d3{animation-delay:.6s}")}
  <rect width="${W}" height="${H}" rx="20" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" rx="20" fill="url(#glow)"/>
  <g class="in"><text class="serif" x="600" y="104" font-size="78" font-style="italic" text-anchor="middle" fill="${C.blush}">Akhtar</text></g>
  <path class="draw" d="M150 132 H1050" stroke="url(#rule)"/>
  <circle cx="600" cy="132" r="3.5" fill="${C.text}"/>
  <g class="in d2"><text class="serif" x="600" y="172" font-size="20" font-style="italic" text-anchor="middle" fill="${C.text}">Difficult problems in. Simple, dependable solutions out.</text></g>
  <g class="in d3"><text class="mono" x="600" y="204" font-size="10.5" letter-spacing="3.4" text-anchor="middle" fill="${C.muted}">AI ENGINEERING · FULL-STACK · SENIOR SOFTWARE ENGINEER</text></g>
</svg>`;
}

/* ---------------------------------------------------------------- build */
write("hero.svg", hero());
const titles = [
  ["title-about.svg", "01", "ABOUT", "Hello, I'm", "Akhtar.", "WHO I AM"],
  ["title-impact.svg", "02", "IMPACT", "Numbers that", "held up.", "RESULTS"],
  ["title-work.svg", "03", "SELECTED WORK", "Hard problems,", "simple systems.", "CASE STUDIES"],
  ["title-toolkit.svg", "04", "TOOLKIT", "The tools I", "reach for.", "STACK"],
  ["title-commits.svg", "05", "COMMIT LOG", "Building,", "in public.", "ACTIVITY"],
  ["title-experience.svg", "06", "EXPERIENCE", "Six-plus years of", "shipping.", "TIMELINE"],
  ["title-connect.svg", "07", "CONNECT", "Bring me the", "difficult problem.", "SAY HELLO"],
];
for (const [f, n, l, lead, em, r] of titles) write(f, title(n, l, lead, em, r, `${n} ${l[0]}${l.slice(1).toLowerCase()}: ${lead} ${em}`));
write("about.svg", about());
write("impact.svg", impact());

project({
  file: "project-donor-enrichment.svg", n: 1, kicker: "AI ENGINEER · FASTAPI · NEXT.JS",
  name: "Donor Enrichment Platform", sub: "AI-powered enrichment of donor records, at scale.",
  built: "Chrome Extension (MV3) + enrichment via RocketReach, TruthFinder, FEC",
  metrics: [["80%", "enrichment success rate"], ["200+", "tasks processed per day"], ["30+ hrs", "saved every week"]],
  chips: ["FastAPI", "PostgreSQL", "Next.js", "Redis", "Chrome MV3", "*90% less manual work"],
  art: artDonor(),
  alt: "AI-Powered Donor Enrichment Platform, built as AI Engineer with FastAPI, PostgreSQL, Next.js, Redis and a Manifest V3 Chrome extension. 80% enrichment success via RocketReach, TruthFinder and FEC APIs; 200+ tasks a day; saves 30+ hours a week; 90% less manual intervention.",
});
project({
  file: "project-image-segmentation.svg", n: 2, kicker: "COMPUTER VISION · PYTHON",
  name: "AI Image Segmentation", sub: "Splits an image into layers you can edit and recolour.",
  built: "masking pipeline separating background / foreground / text",
  metrics: [["3 layers", "background · foreground · text"], ["Recolour", "each layer, dynamically"], ["Masking", "precise per-layer edits"]],
  chips: ["Python", "Computer Vision", "Masking", "*Layer editing"],
  art: artSegment(),
  alt: "AI Image Segmentation and Layer Editing System in Python: computer vision and masking separate background, foreground and text into layers that can be recoloured dynamically.",
});
project({
  file: "project-n8n-sync.svg", n: 3, kicker: "WORKFLOW AUTOMATION · N8N",
  name: "Employee Data Sync", sub: "N8N workflows that keep employee records in step everywhere.",
  built: "N8N workflows syncing ERPNext, Everee, Supabase and Zoho Shift",
  metrics: [["95%", "faster provisioning"], ["98%", "data accuracy"], ["$30K", "saved per year"]],
  chips: ["N8N", "ERPNext", "Everee", "Supabase", "Zoho Shift"],
  art: artN8n(),
  alt: "N8N Workflow Automation for employee data sync across ERPNext, Everee, Supabase and Zoho Shift: provisioning 95% faster, 98% accuracy and $30K a year saved.",
});
project({
  file: "project-eviction-compliance.svg", n: 4, kicker: "LEAD DEVELOPER · FASTAPI · NEXT.JS",
  name: "Eviction Compliance Platform", sub: "Recommends notices, fills legal forms, tracks court dates.",
  built: "Yardi SOAP API integration · Celery jobs · FastAPI + Next.js",
  metrics: [["Notices", "recommended per case"], ["Auto-fill", "legal documents"], ["Tracked", "court dates"]],
  chips: ["FastAPI", "Next.js", "Celery", "Yardi SOAP API"],
  art: artEviction(),
  alt: "Eviction Compliance Platform, built as Lead Developer with FastAPI, Next.js, Celery and the Yardi SOAP API: recommends eviction notices, auto-fills legal documents and tracks court dates.",
});
write("tech-constellation.svg", toolkit());
write("experience.svg", experience());
write("footer-signature.svg", footer());
