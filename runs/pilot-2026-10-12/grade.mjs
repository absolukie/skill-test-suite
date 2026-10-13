// Deterministic grader for the skill test suite pilot.
// Static rubric checks on each produced file + a headless-browser behavior pass.
import fs from 'node:fs';
import puppeteer from '/home/hatch/workspace/moonblinked-studio/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';

const BASE = '/home/hatch/workspace/skill-test-suite/runs/pilot-2026-10-12';
const has = (s, re) => re.test(s);

const STATIC = {
  carousel: [
    ['snap-type x mandatory', s => has(s, /scroll-snap-type:\s*x mandatory/)],
    ['snap-stop always', s => has(s, /scroll-snap-stop:\s*always/)],
    ['overscroll-behavior-x contain', s => has(s, /overscroll-behavior-x:\s*contain/)],
    ['per-slide N/5 counters', s => (s.match(/[1-5]\s*\/\s*5/g) || []).length >= 5 || (has(s, /tcount|counter/) && has(s, /\+\s*1/) && has(s, /\/\s*['"`]?\s*\+|\/\s*\$\{/))],
    ['no smooth scrolling anywhere', s => !has(s, /behavior:\s*['"]smooth|scroll-behavior:\s*smooth|smooth:\s*true/)],
    ['equal-height logic (measure + pin)', s => has(s, /offsetHeight|scrollHeight|getBoundingClientRect/) && has(s, /style\.(height|minHeight)|Math\.max/)],
    ['touch-action manipulation', s => has(s, /touch-action:\s*manipulation/)],
    ['wrap-around modulo index', s => has(s, /%\s*(n|len|length|total|count|5|spots|items|slides)/) || has(s, /wrap/)],
    ['prev/next are buttons with aria-labels', s => (s.match(/<button[^>]*aria-label="[^"]*"/gi) || []).length >= 2],
    ['no external asset references', s => !has(s.replace(/www\.w3\.org/g, ''), /(src|href)\s*=\s*"https?:\/\//)],
  ],
  'ab-toggle': [
    ['exactly one role=switch control', s => (s.match(/<[a-z]+[^>]*role="switch"/g) || []).length === 1],
    ['no side-picking buttons (one button total)', s => (s.match(/<button/g) || []).length === 1],
    ['sliding thumb to left:50%', s => has(s, /thumb/) && has(s, /left:\s*50%|translateX\(100%\)|translateX\(calc/)],
    ['overshoot easing on thumb', s => { const m = s.match(/cubic-bezier\(\s*[\d.]+,\s*[\d.]+,\s*[\d.]+,\s*(1\.\d+)\)/); return !!m && parseFloat(m[1]) > 1; }],
    ['stage crossfade ~450ms opacity', s => has(s, /(opacity|all)\s+(0?\.4s|0?\.45s|0?\.5s|400ms|450ms|500ms)/) || has(s, /transition:[^;]*opacity/)],
    ['prefers-reduced-motion handled', s => has(s, /prefers-reduced-motion/)],
    ['touch-action manipulation + aria-label naming both sides', s => has(s, /touch-action:\s*manipulation/) && has(s, /aria-label="[^"]*(Coffee|beans|headline A|version A|A and B)/i)],
  ],
  'before-after-slider': [
    ['role=slider with min 0 max 100', s => has(s, /role="slider"/) && has(s, /aria-valuemin="0"/) && has(s, /aria-valuemax="100"/)],
    ['before layer via clip-path inset', s => has(s, /clip-path:\s*inset|clipPath\s*=\s*`?inset|clipPath\s*=\s*'inset/)],
    ['divider via transform translateX', s => has(s, /translateX\(/)],
    ['travel clamped 2..98', s => (has(s, /Math\.max\(\s*2|Math\.min\(\s*98|clamp\(\s*2/) && has(s, /98/)) || (has(s, /MIN\s*=\s*2/) && has(s, /MAX\s*=\s*98/))],
    ['touch-action none', s => has(s, /touch-action:\s*none/)],
    ['setPointerCapture used', s => has(s, /setPointerCapture/)],
    ['tap-to-glide animation present', s => has(s, /transition:[^;]*(transform|clip-path)/) || has(s, /glide|animateTo|animateDivider/)],
    ['notch handle ~6x24px', s => has(s, /width:\s*6px/) && has(s, /height:\s*24px/)],
  ],
};

async function behavior(page, fileCase, url) {
  const out = {};
  await page.goto(url, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 350));
  if (fileCase === 'ab-toggle') {
    const seq = await page.evaluate(() => {
      const sw = document.querySelector('[role="switch"]');
      if (!sw) return null;
      const s0 = sw.getAttribute('aria-checked');
      sw.click();
      const s1 = sw.getAttribute('aria-checked');
      sw.click();
      const s2 = sw.getAttribute('aria-checked');
      return { s0, s1, s2 };
    });
    out['aria-checked flips on click'] = !!seq && seq.s1 !== null && seq.s1 !== seq.s0;
    out['every tap flips (2nd click returns)'] = !!seq && seq.s1 !== seq.s0 && seq.s2 === seq.s0;
  }
  if (fileCase === 'before-after-slider') {
    const vals = await page.evaluate(() => {
      const el = document.querySelector('[role="slider"]');
      if (!el) return null;
      el.focus();
      const v = () => el.getAttribute('aria-valuenow');
      const start = v();
      const key = k => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
      // use real keyboard via document.activeElement check fallback: also dispatch on document
      return { start, el: true };
    });
    if (!vals) { out['keyboard: 50 ->58 (2x Right), End 98, Home 2'] = false; out['aria-valuenow starts at 50 and updates'] = false; }
    else {
      const wait = () => new Promise(r => setTimeout(r, 160));
      await page.keyboard.press('ArrowRight'); await wait();
      await page.keyboard.press('ArrowRight'); await wait();
      const v58 = await page.evaluate(() => document.querySelector('[role="slider"]').getAttribute('aria-valuenow'));
      await page.keyboard.press('End'); await wait();
      const vEnd = await page.evaluate(() => document.querySelector('[role="slider"]').getAttribute('aria-valuenow'));
      await page.keyboard.press('Home'); await wait();
      const vHome = await page.evaluate(() => document.querySelector('[role="slider"]').getAttribute('aria-valuenow'));
      out['aria-valuenow starts at 50 and updates'] = vals.start === '50' && v58 !== '50';
      out['keyboard: 50 ->58 (2x Right), End 98, Home 2'] = v58 === '58' && vEnd === '98' && vHome === '2';
      out._vals = { start: vals.start, v58, vEnd, vHome };
    }
  }
  if (fileCase === 'carousel') {
    out['next arrow advances + card tap keeps scrollY'] = await page.evaluate(async () => {
      const btns = Array.from(document.querySelectorAll('button'));
      const next = btns.find(b => /next/i.test(b.getAttribute('aria-label') || '') || b.classList.contains('next') || b.id === 'tnext');
      const readout = () => document.body.innerText;
      const before = readout();
      if (next) next.click();
      await new Promise(r => setTimeout(r, 250));
      const changed = readout() !== before;
      window.scrollTo(0, 0);
      const y0 = window.scrollY;
      const card = document.querySelector('.tslide-card, .tslide, .slide, [class*="card"]');
      if (card) card.click();
      await new Promise(r => setTimeout(r, 150));
      return changed && window.scrollY === y0;
    });
  }
  return out;
}

const browser = await puppeteer.launch({
  executablePath: '/home/hatch/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844 });

const report = {};
for (const fileCase of Object.keys(STATIC)) {
  report[fileCase] = {};
  for (const arm of ['without', 'with']) {
    report[fileCase][arm] = [];
    for (let t = 1; t <= 3; t++) {
      const path = `${BASE}/${fileCase}/${arm}/trial${t}.html`;
      const s = fs.readFileSync(path, 'utf8');
      const checks = {};
      for (const [name, fn] of STATIC[fileCase]) {
        try { checks[name] = !!fn(s); } catch { checks[name] = false; }
      }
      const b = await behavior(page, fileCase, 'file://' + path);
      for (const [k, v] of Object.entries(b)) if (!k.startsWith('_')) checks[k] = !!v;
      if (b._vals) checks._vals = b._vals;
      const total = Object.values(checks).filter(v => v === true).length;
      report[fileCase][arm].push({ trial: t, total, checks });
      console.log(`${fileCase} ${arm} trial${t}: ${total}/${Object.keys(checks).filter(k => !k.startsWith('_')).length}`);
    }
  }
}
await browser.close();
fs.writeFileSync(BASE + '/grades.json', JSON.stringify(report, null, 1));
console.log('grades written');
