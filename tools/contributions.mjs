#!/usr/bin/env node
/**
 * Contribution snake: fetches the PUBLIC GitHub contribution calendar for
 * GH_USERNAME and renders assets/contribution-snake.svg — a heat-map of the
 * last year with a snake that slithers through it and eats each active day.
 *
 *   node tools/contributions.mjs            # fetch + render
 *   node tools/contributions.mjs --offline  # re-render from tools/data/contributions.json
 *
 * Data source: GraphQL API when GH_TOKEN/GITHUB_TOKEN is set, otherwise the
 * public calendar at github.com/users/<login>/contributions. If fetching
 * fails, the existing snapshot is kept so CI never publishes invented data.
 * Run daily by .github/workflows/snake.yml.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { C, LEVELS, esc, baseStyle, open, frame } from "./theme.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LOGIN = process.env.GH_USERNAME || "Muhammad-Akhtar";
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const DATA = path.join(ROOT, "tools/data/contributions.json");
const OUT = path.join(ROOT, "assets/contribution-snake.svg");
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

async function fetchGraphQL() {
  const query = `query($l:String!){user(login:$l){contributionsCollection{contributionCalendar{weeks{contributionDays{date contributionCount contributionLevel}}}}}}`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${TOKEN}`, "Content-Type": "application/json", "User-Agent": "profile-snake" },
    body: JSON.stringify({ query, variables: { l: LOGIN } }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`GraphQL: ${res.status} ${JSON.stringify(json.errors || "")}`);
  const lv = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
  return json.data.user.contributionsCollection.contributionCalendar.weeks
    .flatMap((w) => w.contributionDays)
    .map((d) => ({ date: d.date, count: d.contributionCount, level: lv[d.contributionLevel] ?? 0 }));
}

async function fetchPublic() {
  const res = await fetch(`https://github.com/users/${LOGIN}/contributions`, { headers: { "User-Agent": "profile-snake" } });
  if (!res.ok) throw new Error(`calendar HTTP ${res.status}`);
  const html = await res.text();
  const tips = new Map();
  for (const m of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)</g)) {
    const n = /^(\d+) contribution/.exec(m[2].trim());
    tips.set(m[1], n ? +n[1] : 0);
  }
  const days = [];
  for (const [tag] of html.matchAll(/<td\b[^>]*ContributionCalendar-day[^>]*>/g)) {
    const date = /data-date="([^"]+)"/.exec(tag)?.[1];
    if (!date) continue;
    const id = /\bid="([^"]+)"/.exec(tag)?.[1];
    days.push({ date, count: tips.get(id) ?? 0, level: +(/data-level="(\d)"/.exec(tag)?.[1] ?? 0) });
  }
  if (days.length < 300) throw new Error(`parsed only ${days.length} days`);
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

async function load() {
  if (!process.argv.includes("--offline")) {
    for (const [name, fn] of [["GitHub GraphQL API", TOKEN && fetchGraphQL], ["public GitHub contribution calendar", fetchPublic]]) {
      if (!fn) continue;
      try {
        const days = await fn();
        const snap = { login: LOGIN, method: name, fetchedAt: new Date().toISOString(), days };
        fs.mkdirSync(path.dirname(DATA), { recursive: true });
        fs.writeFileSync(DATA, JSON.stringify(snap, null, 1) + "\n");
        return snap;
      } catch (e) { console.warn(`${name} failed: ${e.message}`); }
    }
    console.warn("Fetching failed; falling back to the saved snapshot.");
  }
  if (!fs.existsSync(DATA)) { console.warn("No snapshot; leaving SVG untouched."); process.exit(0); }
  return JSON.parse(fs.readFileSync(DATA, "utf8"));
}

const day = (iso) => new Date(`${iso}T00:00:00Z`);
const fmt = (d) => `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;

function render(snap) {
  const { days } = snap;
  const W = 1200, H = 410, CELL = 15, GAP = 4, STEP = CELL + GAP, GX = 118, GY = 182;
  const off = day(days[0].date).getUTCDay();
  const at = (i) => ({ wk: Math.floor((i + off) / 7), dow: (i + off) % 7 });
  const weeks = at(days.length - 1).wk + 1;

  // stats from real data only
  let total = 0, active = 0, run = 0, best = 0, bestEnd = -1, peak = days[0];
  days.forEach((d, i) => {
    total += d.count;
    if (d.count > 0) { active++; run++; if (run > best) { best = run; bestEnd = i; } if (d.count > peak.count) peak = d; } else run = 0;
  });
  const first = day(days[0].date), last = day(days.at(-1).date);
  const snapDate = fmt(new Date(snap.fetchedAt || last));

  // snake route: serpentine, down even weeks and up odd weeks
  const order = (wk, dow) => wk * 7 + (wk % 2 ? 6 - dow : dow) + 1;
  const pts = [];
  for (let w = 0; w < weeks; w++) for (let r = 0; r < 7; r++) {
    const dow = w % 2 ? 6 - r : r;
    pts.push([GX + w * STEP + CELL / 2, GY + dow * STEP + CELL / 2]);
  }
  pts.unshift([pts[0][0], pts[0][1] - STEP]);
  pts.push([pts.at(-1)[0] + STEP, pts.at(-1)[1]]);
  const DT = 0.05, BEGIN = 2.2;
  const runT = (pts.length - 1) * DT, loop = runT + 3.5, frac = (runT / loop).toFixed(4);
  const route = "M" + pts.map(([x, y]) => `${x} ${y}`).join(" L");

  const cells = days.map((d, i) => {
    const { wk, dow } = at(i);
    const color = LEVELS[d.level] ?? LEVELS[0];
    const eaten = d.count > 0
      ? `<animate attributeName="fill" values="${color};${LEVELS[0]}" keyTimes="0;${((order(wk, dow) * DT) / loop).toFixed(4)}" calcMode="discrete" dur="${loop.toFixed(2)}s" begin="${BEGIN}s" repeatCount="indefinite"/>` : "";
    return `<rect class="c" style="animation-delay:${(0.3 + (wk + dow * 1.5) * 0.016).toFixed(3)}s" x="${GX + wk * STEP}" y="${GY + dow * STEP}" width="${CELL}" height="${CELL}" rx="3.5" fill="${color}"${d.level === 4 ? ' filter="url(#g)"' : ""}><title>${d.count} contribution${d.count === 1 ? "" : "s"} · ${fmt(day(d.date))}</title>${eaten}</rect>`;
  }).join("\n    ");

  const SEG = 8;
  const snake = Array.from({ length: SEG }, (_, k) => {
    const s = SEG - 1 - k; // tail first, head on top
    const size = CELL - s * 0.9;
    const fill = s === 0 ? C.text : s < 3 ? C.blush : s < 5 ? C.accent : C.rose;
    const begin = (BEGIN + s * DT).toFixed(3);
    const eyes = s === 0 ? `<circle cx="${size / 2 - 4}" cy="-2.5" r="1.3" fill="${C.bgDeep}"/><circle cx="${size / 2 - 4}" cy="2.5" r="1.3" fill="${C.bgDeep}"/>` : "";
    return `<g opacity="0"${s === 0 ? ' filter="url(#g)"' : ""}>
      <animateMotion path="${route}" rotate="auto" dur="${loop.toFixed(2)}s" begin="${begin}s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;${frac};1" calcMode="linear"/>
      <animate attributeName="opacity" values="${(1 - s * 0.07).toFixed(2)};0" keyTimes="0;${frac}" calcMode="discrete" dur="${loop.toFixed(2)}s" begin="${begin}s" repeatCount="indefinite"/>
      <rect x="${-size / 2}" y="${-size / 2}" width="${size}" height="${size}" rx="${(size / 2.6).toFixed(1)}" fill="${fill}"/>${eyes}
    </g>`;
  }).join("\n    ");

  const months = [];
  let prev = -1;
  days.forEach((d, i) => {
    const m = day(d.date).getUTCMonth();
    if (m !== prev) { prev = m; months.push([at(i).wk, MONTHS[m]]); }
  });
  if (months.length > 1 && months[1][0] - months[0][0] < 3) months.shift();

  let streak = "";
  if (best > 1) {
    const s = at(bestEnd - best + 1);
    const x = GX + s.wk * STEP;
    streak = `<g class="fade" style="animation-delay:2.4s"><path d="M${x + CELL / 2} ${GY + 7 * STEP - 2} V${GY + 7 * STEP + 10}" stroke="${C.blush}" stroke-opacity=".6"/>
    <text class="mono" ${x + 440 > W - 56 ? `x="${Math.min(x + CELL + 6, W - 56)}" text-anchor="end"` : `x="${x}"`} y="${GY + 7 * STEP + 24}" font-size="10.5" letter-spacing="1.6" fill="${C.blush}">LONGEST STREAK · ${best} DAYS · ${fmt(day(days[bestEnd - best + 1].date)).toUpperCase()} – ${fmt(day(days[bestEnd].date)).toUpperCase()}</text></g>`;
  }

  const stats = [
    ["CONTRIBUTIONS", total.toLocaleString("en-US"), `${MONTHS[first.getUTCMonth()]} ${first.getUTCFullYear()} – ${MONTHS[last.getUTCMonth()]} ${last.getUTCFullYear()}`],
    ["ACTIVE DAYS", active, `of ${days.length} days`],
    ["LONGEST STREAK", best, best === 1 ? "day" : "consecutive days"],
    ["BUSIEST DAY", peak.count, peak.count ? fmt(day(peak.date)) : "—"],
  ].map(([k, v, sub], i) => `<g transform="translate(${610 + i * 150} 58)">
      <text class="mono" font-size="10" letter-spacing="1.8" fill="${C.accent}">${k}</text>
      <text class="serif" y="44" font-size="36" fill="${C.text}">${esc(v)}</text>
      <text class="mono" y="64" font-size="9.5" fill="${C.muted}">${esc(sub)}</text>
    </g>`).join("\n    ");

  const lx = W - 56 - 5 * 18 - 70;
  return `${open(W, H, `GitHub contributions for @${LOGIN}`,
    `${total} contributions from ${fmt(first)} to ${fmt(last)}: ${active} active days, longest streak ${best} days, busiest day ${peak.count} contributions on ${fmt(day(peak.date))}. Source: ${snap.method}, snapshot ${snapDate}.`)}
  ${frame(W, H, { cx: "88%", cy: "0%" })}
  <defs><filter id="g" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  ${baseStyle(`.c { transform-box: fill-box; transform-origin: center; animation: pop .8s cubic-bezier(.34,1.56,.64,1) both; }
    @keyframes pop { from { opacity: 0; transform: scale(.2); } to { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) { .c { animation: none; } }`)}
  <g class="fade">
    <text class="mono" x="56" y="68" font-size="11" letter-spacing="2.6" fill="${C.accent}">COMMIT LOG · REAL GITHUB ACTIVITY</text>
    <text class="serif" x="54" y="110" font-size="27" fill="${C.text}">Building in public, <tspan font-style="italic" fill="${C.blush}">one square</tspan> at a time.</text>
    ${stats}
  </g>
  <g class="mono" font-size="10.5" fill="${C.muted}">${months.map(([wk, m]) => `<text x="${GX + wk * STEP}" y="${GY - 12}">${m}</text>`).join("")}</g>
  <g class="mono" font-size="10" fill="${C.muted}" text-anchor="end">
    <text x="${GX - 12}" y="${GY + STEP + 11}">Mon</text><text x="${GX - 12}" y="${GY + 3 * STEP + 11}">Wed</text><text x="${GX - 12}" y="${GY + 5 * STEP + 11}">Fri</text>
  </g>
  <g>
    ${cells}
  </g>
  <g class="motion">
    ${snake}
  </g>
  ${streak}
  <g class="fade">
    <text class="mono" x="56" y="382" font-size="10.5" fill="${C.muted}">Source: ${esc(snap.method)} for @${esc(LOGIN)} · snapshot ${snapDate} · refreshed daily</text>
    <text class="mono" x="${lx}" y="382" font-size="10.5" fill="${C.muted}">Less</text>
    ${LEVELS.map((c, i) => `<rect x="${lx + 36 + i * 18}" y="372" width="12" height="12" rx="3" fill="${c}"/>`).join("")}
    <text class="mono" x="${lx + 36 + 5 * 18 + 4}" y="382" font-size="10.5" fill="${C.muted}">More</text>
  </g>
</svg>
`;
}

const snap = await load();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, render(snap), "utf8");
console.log(`Wrote assets/contribution-snake.svg from ${snap.days.length} days (${snap.method}).`);
