#!/usr/bin/env node
// Invents this week's framework and appends it to data/frameworks.json.
//
// The seed is the ISO week, so running it twice in one week does nothing the second time.
// FORCE=1 adds another one anyway (the workflow's manual "force" input).
// Writes name, slug and created to $GITHUB_OUTPUT, and the PR body to $PR_BODY_FILE,
// when those are set.
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data', 'frameworks.json');

// Word banks. Everything here is generic consultant vocabulary. No real frameworks,
// companies or people, and nothing named after one.
const ACRONYMS = ['PIVOT', 'SCALE', 'GRIT', 'BLITZ', 'SPARK', 'HYPE', 'VIBE', 'LEVER', 'PRISM', 'MOAT', 'ORBIT', 'SURGE', 'ALIGN', 'CRAFT', 'BOOST', 'FLARE', 'NOVA', 'THRIVE'];
const LETTER_WORDS = {
  A: ['Align', 'Amplify', 'Ambition', 'Activate'],
  B: ['Benchmark', 'Brand', 'Bandwidth', 'Bias for action'],
  C: ['Cadence', 'Circle back', 'Capture', 'Category'],
  E: ['Evangelize', 'Empower', 'Ecosystem', 'Escalate'],
  F: ['Flywheel', 'Focus', 'Frictionless', 'Feedback loop'],
  G: ['Growth', 'Grind', 'Go-wide', 'Gut check'],
  H: ['Hustle', 'Hypothesize', 'Hockey stick', 'Hand-wave'],
  I: ['Ideate', 'Iterate', 'Impact', 'Inflect'],
  K: ['KPIs', 'Kickoff', 'Know-how', 'Keynote'],
  L: ['Leverage', 'Land', 'Learn', 'Loop in'],
  M: ['Momentum', 'Monetize', 'Mindshare', 'Moat'],
  N: ['North star', 'Narrative', 'Network', 'Nudge'],
  O: ['Optimize', 'Operationalize', 'Own it', 'Offsite'],
  P: ['Pivot', 'Prioritize', 'Productize', 'Pipeline'],
  R: ['Reframe', 'Retain', 'Rally', 'Roadmap'],
  S: ['Synergize', 'Scale', 'Socialize', 'Storytell'],
  T: ['Thought-lead', 'Traction', 'Transform', 'Touch base'],
  U: ['Unlock', 'Upsell', 'Unblock', 'Uplevel'],
  V: ['Vibes', 'Validate', 'Velocity', 'Visionate'],
  W: ['Win', 'Workshop', 'Whiteboard', 'Wow'],
  Y: ['Yield', 'Yes-and', 'Year over year', 'Yardstick'],
  Z: ['Zoom out', 'Zero in', 'Zeal', 'Zen'],
};
const SHAPES = ['Loop', 'Matrix', 'Funnel', 'Canvas', 'Ladder', 'Spiral', 'Pyramid', 'Stack', 'Wheel', 'Cycle', 'Engine', 'Compass', 'Hourglass', 'Pinwheel', 'Trampoline', 'Flywheel', 'Staircase', 'Lasso'];
const ADJECTIVES = ['Inverted', 'Reverse', 'Quantum', 'Recursive', 'Asymmetric', 'Infinite', 'Fractal', 'Upside-Down', 'Concentric', 'Agile', 'Holistic', 'Sideways'];
const COUNTS = ['Two', 'Three', 'Four', 'Five', 'Seven', 'Nine', 'Twelve'];
const COUNT_NOUNS = ['Moat', 'Vibe', 'Lever', 'Horizon', 'Pillar', 'Loop', 'Gear', 'Lens'];
const STAGES = ['Ideate', 'Validate the ideation', 'Align', 'Scale', 'Re-align', 'Synergize', 'Celebrate early', 'Pivot', 'Iterate', 'Socialize', 'Operationalize', 'Thought-lead', 'Retro', 'Rebrand', 'Circle back', 'Repeat'];
const AXES = ['Synergy', 'Vibes', 'Momentum', 'Aura', 'Alignment', 'Disruption', 'Leverage', 'Gut feeling', 'Velocity', 'Mindshare', 'Narrative', 'Conviction', 'Bandwidth', 'Hustle', 'Optionality', 'Main character energy'];
const QUADRANT_SETS = [
  { tl: 'Dreamers', tr: 'Inevitable', bl: 'Busywork', br: 'Headless chickens' },
  { tl: 'All vision', tr: 'Keynote material', bl: 'Status quo', br: 'All motion' },
  { tl: 'Slideware', tr: 'Category of one', bl: 'Fax machines', br: 'Busy, somehow' },
  { tl: 'Big talk', tr: 'Unstoppable', bl: 'Meetings', br: 'Spinning plates' },
  { tl: 'Philosophers', tr: 'Market makers', bl: 'Committees', br: 'Interns' },
];

const OPENERS = [
  (f) => `${f.name} is a ${f.count}-stage operating model for teams who have outgrown linear thinking but haven't committed to circles.`,
  (f) => `${f.name} replaces your current strategy with a shape, which is what most strategies were anyway.`,
  (f) => `${f.name} came out of a whiteboard session that ran three hours long and produced one diagram. This is the diagram.`,
  (f) => `${f.name} gives leadership a single picture to point at when someone asks what the plan is.`,
];
const PLOTS = [
  (f) => `Plot every initiative on ${f.axes.x} against ${f.axes.y}.`,
  (f) => `Score each initiative from one to ten on ${f.axes.x}, then on ${f.axes.y}, then round both up.`,
  (f) => `Map your roadmap onto ${f.axes.x} and ${f.axes.y}, the two dimensions our research found to matter most.`,
];
const MIDDLES = [
  (f) => `Anything in the bottom left ("${f.quadrants.bl}") gets a steering committee. Anything in the top right ("${f.quadrants.tr}") gets a keynote.`,
  (f) => `Initiatives start in "${f.quadrants.bl}", pass through "${f.quadrants.tl}" for a quarter of reflection, and graduate to "${f.quadrants.tr}" once someone senior says so.`,
  (f) => `Nothing ever lands in "${f.quadrants.br}" on purpose. If it does, move the dot.`,
];
const CLOSERS = [
  'The loop never closes, which is the point.',
  'Run it quarterly, or whenever the board asks what the strategy is.',
  'Results compound. We have not measured them.',
  'Teams that adopt it report feeling aligned, which is the main deliverable.',
  'It works best on a slide, and is untested off one.',
];
const FOOTNOTES = [
  'Patent pending. It is not pending.',
  'Licensed for internal use and LinkedIn carousels.',
  'Peer reviewed by a peer.',
  'Validated with a sample size of one offsite.',
  'Certification available at a later, more expensive date.',
];

function hashStr(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rng(seed) {
  const next = mulberry32(seed);
  const pick = (list) => list[Math.floor(next() * list.length)];
  const int = (a, b) => a + Math.floor(next() * (b - a + 1));
  const take = (list, n) => {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out.slice(0, n);
  };
  return { next, pick, int, take };
}

// ISO 8601 week, e.g. 2026-W44.
function isoWeek(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

const plural = (w) => (w.endsWith('x') ? w.slice(0, -1) + 'ces' : w.endsWith('s') ? w + 'es' : w + 's');

const slugify = (s) => s.toLowerCase().replace(/^the\s+/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function invent(r) {
  const kind = r.pick(['acronym', 'acronym', 'recursive', 'adjective', 'count']);
  let name, steps, count;
  if (kind === 'acronym') {
    const word = r.pick(ACRONYMS);
    count = r.int(word.length + 1, 12);
    name = `The ${word}-${count} ${r.pick(SHAPES)}`;
    steps = word.split('').map((letter) => ({ letter, word: r.pick(LETTER_WORDS[letter]) }));
  } else if (kind === 'recursive') {
    const shape = r.pick(SHAPES);
    name = `The ${shape} of ${plural(shape)}`;
    count = r.int(4, 6);
    steps = r.take(STAGES, count).map((word) => ({ word }));
  } else if (kind === 'adjective') {
    name = `The ${r.pick(ADJECTIVES)} ${r.pick(SHAPES)}`;
    count = r.int(4, 6);
    steps = r.take(STAGES, count).map((word) => ({ word }));
  } else {
    const n = r.pick(COUNTS);
    name = `The ${n}-${r.pick(COUNT_NOUNS)} ${r.pick(SHAPES)}`;
    count = r.int(4, 6);
    steps = r.take(STAGES, count).map((word) => ({ word }));
  }
  const [x, y] = r.take(AXES, 2);
  const f = { name, count, steps, axes: { x, y }, quadrants: r.pick(QUADRANT_SETS) };
  const parts = [r.pick(OPENERS)(f), r.pick(PLOTS)(f), r.pick(MIDDLES)(f)];
  if (kind === 'acronym' && count > steps.length) {
    parts.push(`There are ${count} stages and ${steps.length} letters. The other ${count - steps.length} are proprietary.`);
  }
  parts.push(r.pick(CLOSERS));
  return { ...f, kind, explainer: parts.join(' '), footnote: r.pick(FOOTNOTES) };
}

const list = JSON.parse(readFileSync(DATA, 'utf8'));
if (!Array.isArray(list)) throw new Error('data/frameworks.json must be a JSON array');

const now = new Date();
const week = isoWeek(now);
const force = process.env.FORCE === '1' || process.env.FORCE === 'true';
const thisWeek = list.filter((f) => f.week === week).length;

function output(key, value) {
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
}

if (thisWeek && !force) {
  console.log(`${week} already has a framework. Nothing to do.`);
  output('created', 'false');
  process.exit(0);
}

const taken = new Set(list.map((f) => f.name));
const r = rng(hashStr(`${week}#${thisWeek}`));
let fw = invent(r);
for (let i = 0; taken.has(fw.name) && i < 50; i++) fw = invent(r);
if (taken.has(fw.name)) throw new Error('Ran out of new framework names. Add words to the banks.');

const entry = {
  week,
  date: now.toISOString().slice(0, 10),
  name: fw.name,
  slug: slugify(fw.name),
  kind: fw.kind,
  steps: fw.steps,
  axes: fw.axes,
  quadrants: fw.quadrants,
  explainer: fw.explainer,
  footnote: fw.footnote,
};
list.push(entry);
writeFileSync(DATA, JSON.stringify(list, null, 2) + '\n');

console.log(`${entry.name} (${week})\n${entry.explainer}`);
output('created', 'true');
output('name', entry.name);
output('slug', entry.slug);

if (process.env.PR_BODY_FILE) {
  writeFileSync(process.env.PR_BODY_FILE, [
    `This week's framework is ${entry.name}.`,
    '',
    entry.explainer,
    '',
    `It plots ${entry.axes.x} against ${entry.axes.y}. Stages: ${entry.steps.map((s) => s.word).join(', ')}.`,
    '',
    'Made up by `scripts/new-framework.mjs` and merged by the weekly workflow. No consultants were billed.',
    '',
  ].join('\n'));
}
