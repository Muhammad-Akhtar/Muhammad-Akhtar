// Single source of truth for colours and type. Change a value here, then run
//   node tools/generate.mjs && node tools/contributions.mjs --offline
// to rebuild every SVG in assets/.

export const C = {
  bg: "#190B12",        // card background (top)
  bgDeep: "#10070C",    // card background (bottom / insets)
  plum: "#701A3D",      // primary accent (badges, glows)
  plumDeep: "#451126",  // secondary accent (project badges, fades)
  rose: "#A12556",      // strong heat / mid accent
  accent: "#C77B9B",    // kickers, rules, dots
  blush: "#E5B5C7",     // highlighted words, numbers
  text: "#F8F0F3",      // primary text
  muted: "#B6A3AC",     // secondary text
};

// Heat levels for the contribution grid (none -> most).
export const LEVELS = ["#1C0C15", C.plumDeep, C.plum, C.rose, C.blush];

// System font stacks only: GitHub's image proxy blocks web fonts.
export const FONT = {
  serif: `Georgia, "Iowan Old Style", "Palatino Linotype", "Times New Roman", serif`,
  mono: `ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`,
  sans: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
};

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Shared <style> block: font classes + entrance animations that switch off
// for prefers-reduced-motion (final state is always the resting state).
export const baseStyle = (extra = "") => `<style>
    .serif { font-family: ${FONT.serif}; }
    .mono { font-family: ${FONT.mono}; }
    .sans { font-family: ${FONT.sans}; }
    .in { animation: in 1s cubic-bezier(.16,1,.3,1) both; }
    .fade { animation: fade 1.2s ease both; }
    .draw { stroke-dasharray: 1200; stroke-dashoffset: 1200; animation: draw 1.8s cubic-bezier(.65,0,.35,1) .4s forwards; }
    .blink { animation: blink 1.1s steps(1) infinite; }
    @keyframes in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
    @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes draw { to { stroke-dashoffset: 0; } }
    @keyframes blink { 50% { opacity: 0; } }
    ${extra}
    @media (prefers-reduced-motion: reduce) {
      .in, .fade, .blink { animation: none; }
      .draw { animation: none; stroke-dashoffset: 0; }
      .motion { display: none; }
    }
  </style>`;

// Opening tag + accessible title/desc.
export const open = (w, h, title, desc = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="t${desc ? " d" : ""}">
  <title id="t">${esc(title)}</title>${desc ? `\n  <desc id="d">${esc(desc)}</desc>` : ""}`;

// Dark rounded card with a plum glow; gives every SVG its own background so
// it reads the same on GitHub's light and dark themes.
export const frame = (w, h, { cx = "85%", cy = "15%", r = "70%", strength = 0.55, rx = 20 } = {}) => `<defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.bg}"/><stop offset="1" stop-color="${C.bgDeep}"/></linearGradient>
    <radialGradient id="glow" cx="${cx}" cy="${cy}" r="${r}"><stop offset="0" stop-color="${C.plum}" stop-opacity="${strength}"/><stop offset="1" stop-color="${C.plumDeep}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${w}" height="${h}" rx="${rx}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" rx="${rx}" fill="url(#glow)"/>
  <rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="${rx - 0.5}" fill="none" stroke="${C.accent}" stroke-opacity=".16"/>`;
