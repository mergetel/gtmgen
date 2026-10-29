// The generator. Everything on a slide comes from one seed, and the seed comes from the
// URL hash (product name, description and a reroll count), so every plan is a permalink.
(function () {
  const { W, H, C, SERIF, rng, rr, font, fit, wrap, spaced, frame, matrix, hashStr, slugify } = window.GTM;

  const PLACEHOLDER = { n: 'Your Product', d: 'It does a thing, but with AI' };

  const TAMS = [
    ['$4.2 trillion', 'Global GDP, plus vibes'],
    ['$4.2 trillion', 'Every person, times every dollar'],
    ['$11.7 trillion', 'I multiplied twice to be safe'],
    ['$88 quadrillion', 'Source: a pie chart I saw once'],
    ['$4.2 trillion', 'Rounded up from $4.2 trillion'],
  ];
  const SAMS = [
    ['$380 billion', 'People with wifi'],
    ['$71 billion', 'Anyone who has said "workflow"'],
    ['$12.6 billion', 'Excluding Antarctica (for now)'],
    ['$940 billion', 'Everyone with a laptop and a dream'],
  ];
  const SOMS = [
    ['$18', 'You and your mom'],
    ['$9/mo', 'You and your mom (annual plan)'],
    ['$0 (trial)', 'You and your mom'],
    ['$27', 'You, your mom, and her book club'],
  ];
  const METHODS = [
    'Googled "how many people are there"',
    'Asked the group chat',
    'Top down, then further down',
    'Bottom up, then gave up',
  ];

  const ICP_FIELDS = [
    ['Company size', '1 to 8 billion'],
    ['Industry', 'All of them'],
    ['Job title', 'Decision maker (any decision)'],
    ['Budget', 'Yes'],
    ['Pain point', 'Has problems'],
    ['Hangs out', 'The internet, mostly'],
    ['Buying trigger', 'Wakes up'],
    ['Tech stack', 'A computer'],
    ['Location', 'Earth (initially)'],
    ['Disqualified if', 'Not a person'],
    ['Age', '18 to forever'],
    ['Goals', 'Wants things'],
  ];

  const AXES = [
    ['Synergy', 'Vibes'],
    ['Disruption', 'Alignment'],
    ['Leverage', 'Aura'],
    ['Thought leadership', 'Momentum'],
    ['Category creation', 'Gut feeling'],
    ['Scalability', 'Main character energy'],
    ['AI-nativeness', 'Hustle'],
  ];
  const COMPETITORS = [
    'Legacy incumbents', 'Spreadsheets', 'Doing nothing', 'A consultant', 'Pen and paper',
    'An intern with a plan', 'The status quo', 'Email', 'Hope', 'Asking around',
  ];
  const QUADRANTS = [
    { tl: 'Niche visionaries', tr: 'Category of one', bl: 'Everyone else', br: 'Confused' },
    { tl: 'All talk', tr: 'Inevitable', bl: 'The past', br: 'Busy, somehow' },
    { tl: 'Dreamers', tr: 'Just you', bl: 'Fax machines', br: 'Spreadsheet energy' },
  ];
  const HERO_NOTES = ['alone, as foretold', 'nobody else up here', 'axes chosen by us', 'not to scale'];

  const PERSONAS = [
    ['Growth Gwen', 'VP of Growth-ish'],
    ['Budget Bob', 'Holds the card'],
    ['Champion Charlie', 'Internal champion'],
    ['Skeptic Sam', 'Has seen things'],
    ['Visionary Val', 'Chief Vision Officer'],
    ['Procurement Pat', 'Needs a PDF'],
    ['Enterprise Erin', 'Head of Synergy'],
    ['Startup Stu', 'Founder, again'],
  ];
  const POSES = [
    ['salad', '"I laugh at salad, alone."'],
    ['laptop', '"I point at my laptop, delighted."'],
    ['headset', '"My headset is always on."'],
    ['chart', '"I gesture at a chart going up."'],
    ['mug', '"I drink coffee near a window."'],
    ['thumbs', '"Thumbs up. That\'s it."'],
  ];
  const GOALS = ['Hit Q4', 'Synergize', 'Get promoted sideways', 'Fewer meetings, more meetings', 'Look busy', 'Own a dashboard'];
  const PAINS = ['Meetings about meetings', 'Legacy everything', 'Slow wifi', 'Too many tabs', 'Mondays', 'Their current tool, vaguely'];
  const SHIRTS = ['#0f8a7e', '#3b5bdb', '#f0603f', '#7048e8', '#e8590c', '#1c7ed6'];
  const SKINS = ['#f5d0b5', '#e0ac85', '#c68a5e', '#8d5a3b', '#f1c9a5', '#a86b45'];

  const PRO_PRICES = ['$49', '$99', '$19', '$199', '$9'];
  const PRO_NOTES = ['/mo (was $9, then $499)', '/mo, billed emotionally', '/mo, for now', '/seat /mo /vibe'];
  const FEATURES = {
    free: ['Paid in exposure', 'One (1) project', 'A logo (ours)', 'Community support (you)'],
    pro: ['Everything in Free, but paid', 'Priority vibes', 'Unlimited-ish', 'A dashboard'],
    ent: ['Price goes up each call', 'SSO (someday)', 'A shared channel', 'A person named Account'],
  };
  const PRICE_NOTES = ['Every price ends in 9. That is science.', 'Decoy tier included. You are welcome.', 'Raise prices until someone yells.'];

  const FILLER = [
    'Align on alignment', 'Socialize the deck', 'Waitlist for the waitlist', 'Rebrand (third time)',
    'Offsite to plan the offsite', 'Hire a Head of Vibes', 'Circle back on circling back',
    'Thought leadership (posting)', "Find the North Star's North Star", 'Synergy audit',
    'Launch, then relaunch', 'OKRs for the OKRs', 'Brand book v2: the font', 'Stakeholder map (the map)',
    'Pick a mascot', 'Webinar nobody asked for', 'Revisit the pricing page', 'Narrative workshop',
    'Rehearse the QBR', 'Make the logo bigger', 'Content calendar for the calendar', 'Buy a .ai domain',
  ];
  const OWNERS = ['TBD', 'Everyone', 'A committee', 'The intern', "Whoever's free", 'Future hire', 'Nobody (yet)'];
  const REAL = 'Tell your customers what you shipped';

  // Where the one real row sits on the plan slide, in canvas pixels. The page lays a link over it.
  const PLAN = { top: 236, rowH: 47, labelX: 70, barX0: 640, barX1: 1530 };

  function readState() {
    const p = new URLSearchParams(location.hash.slice(1));
    const r = Number(p.get('r'));
    return {
      n: (p.get('n') || '').slice(0, 32),
      d: (p.get('d') || '').slice(0, 90),
      r: Number.isInteger(r) && r >= 0 ? r : 0,
    };
  }

  function writeState(s) {
    const p = new URLSearchParams();
    if (s.n) p.set('n', s.n);
    if (s.d) p.set('d', s.d);
    if (s.r) p.set('r', String(s.r));
    const hash = p.toString();
    history.replaceState(null, '', hash ? '#' + hash : location.pathname);
  }

  // One plan, drawn in a fixed order. Each section gets its own stream so tweaking
  // one list never reshuffles another.
  function makePlan(s) {
    const name = s.n.trim() || PLACEHOLDER.n;
    const desc = s.d.trim() || PLACEHOLDER.d;
    const seed = hashStr(`${name.toLowerCase()}|${desc.toLowerCase()}|${s.r}`);
    const part = (k) => rng(seed ^ hashStr(k));

    const a = part('tam');
    const tam = a.pick(TAMS), sam = a.pick(SAMS), som = a.pick(SOMS), method = a.pick(METHODS);

    const b = part('icp');
    const icp = b.take(ICP_FIELDS, 6);

    const c = part('matrix');
    const axes = c.pick(AXES);
    const quadrants = c.pick(QUADRANTS);
    const competitors = c.take(COMPETITORS, c.int(5, 7));
    const heroNote = c.pick(HERO_NOTES);

    const d = part('personas');
    const poses = d.take(POSES, 3);
    const goals = d.take(GOALS, 3);
    const pains = d.take(PAINS, 3);
    const personas = d.take(PERSONAS, 3).map(([who, role], i) => ({
      who, role,
      age: `${d.int(27, 44)}-ish`,
      pose: poses[i][0],
      quote: poses[i][1],
      goal: goals[i],
      pain: pains[i],
      shirt: SHIRTS[(d.int(0, SHIRTS.length - 1) + i * 2) % SHIRTS.length],
      skin: d.pick(SKINS),
      hair: d.pick(['#2b2118', '#6b4423', '#c9a227', '#1a1a1a', '#8c8c8c']),
    }));

    const e = part('pricing');
    const pricing = {
      pro: e.pick(PRO_PRICES),
      proNote: e.pick(PRO_NOTES),
      free: e.take(FEATURES.free, 3),
      proF: e.take(FEATURES.pro, 3),
      ent: e.take(FEATURES.ent, 3),
      note: e.pick(PRICE_NOTES),
    };

    const f = part('plan');
    const filler = f.take(FILLER, 11).map((label) => {
      const start = f.int(0, 9);
      return { label, owner: f.pick(OWNERS), start, len: f.int(2, Math.min(6, 13 - start)) };
    });
    const realAt = f.int(2, 10);
    const rows = filler.slice();
    rows.splice(realAt, 0, { label: REAL, owner: 'merge.tel', start: 0, len: 13, real: true });

    const g = part('cover');
    const cover = {
      fy: `FY${g.int(27, 29)}`,
      draft: g.int(7, 48),
      suffix: g.pick(['FINAL', 'FINAL_final', 'FINAL_v2_USE_THIS', 'final (3)']),
    };

    return { name, desc, seed, tam, sam, som, method, icp, axes, quadrants, competitors, heroNote, personas, pricing, rows, realAt, cover };
  }

  // ---------------------------------------------------------------- slides

  function drawCover(ctx, p) {
    frame(ctx, { kicker: 'Go-to-market strategy', title: '', page: 'p. 1' });

    // Decoration: a chart that only goes up, made of circles.
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.arc(1110 + i * 64, 780 - i * i * 7, 12 + i * 4, 0, Math.PI * 2);
      ctx.fillStyle = i === 6 ? C.coral : `rgba(15,138,126,${0.12 + i * 0.09})`;
      ctx.fill();
    }

    ctx.fillStyle = C.navy;
    // Stops short of the stamp.
    const t = fit(ctx, p.name, 820, 800, 120, 40, SERIF);
    ctx.fillText(t.text, 70, 300);
    ctx.fillStyle = C.ink;
    ctx.font = font(500, 38);
    const y = wrap(ctx, p.desc, 74, 380, 900, 52, 3);

    ctx.fillStyle = C.muted;
    ctx.font = font(500, 26);
    const meta = [
      'Prepared for: the board (imaginary)',
      'Prepared by: a random number generator',
      `${p.cover.fy} · Draft v${p.cover.draft} ${p.cover.suffix}.pptx`,
    ];
    meta.forEach((m, i) => ctx.fillText(m, 74, Math.max(y + 60, 560) + i * 42));

    stamp(ctx, 1200, 280, -9, 'CONFIDENTIAL', '(made up)');
  }

  function stamp(ctx, x, y, deg, top, bottom) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((deg * Math.PI) / 180);
    ctx.globalAlpha = 0.85;
    ctx.strokeStyle = C.red;
    ctx.fillStyle = C.red;
    ctx.font = font(900, 54);
    spaced(ctx, 4);
    const w = ctx.measureText(top).width + 60;
    ctx.lineWidth = 6;
    rr(ctx, -w / 2, -64, w, 128, 12);
    ctx.stroke();
    ctx.lineWidth = 2;
    rr(ctx, -w / 2 + 10, -54, w - 20, 108, 8);
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.fillText(top, 0, -4);
    spaced(ctx, 1);
    ctx.font = font(800, 30);
    ctx.fillText(bottom, 0, 38);
    spaced(ctx, 0);
    ctx.restore();
  }

  function drawTam(ctx, p) {
    frame(ctx, { kicker: '01 · Market sizing', title: 'TAM, SAM, SOM', page: 'p. 2' });
    const tiers = [
      ['TAM', p.tam[0], p.tam[1], 980, C.navy],
      ['SAM', p.sam[0], p.sam[1], 700, C.teal],
      ['SOM', p.som[0], p.som[1], 420, C.coral],
    ];
    const cx = 590, top = 222, th = 176, gap = 14;
    tiers.forEach(([tag, value, note, w], i) => {
      const y = top + i * (th + gap);
      const next = i < 2 ? tiers[i + 1][3] : w * 0.62;
      ctx.beginPath();
      ctx.moveTo(cx - w / 2, y);
      ctx.lineTo(cx + w / 2, y);
      ctx.lineTo(cx + next / 2, y + th);
      ctx.lineTo(cx - next / 2, y + th);
      ctx.closePath();
      ctx.fillStyle = tiers[i][4];
      ctx.fill();
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.font = font(800, 20);
      spaced(ctx, 3);
      ctx.fillText(tag, cx, y + 40);
      spaced(ctx, 0);
      ctx.fillStyle = '#ffffff';
      const v = fit(ctx, value, next - 40, 800, 54, 28, SERIF);
      ctx.fillText(v.text, cx, y + 102);
      const nt = fit(ctx, note, (w + next) / 2 - 50, 600, 24, 17);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.fillText(nt.text, cx, y + 144);
      ctx.textAlign = 'left';
    });

    // Side notes.
    const sx = 1150;
    note(ctx, sx, 240, 380, 'We only need 1% of the TAM.', 'Then 1% more. Then the rest.', 3);
    note(ctx, sx, 450, 380, 'Methodology', p.method + '.', -2);
    ctx.fillStyle = C.muted;
    ctx.font = font(600, 22);
    ctx.fillText('Not to scale. Nothing here is.', sx, 760);
  }

  // A sticky note with a heading and a line.
  function note(ctx, x, y, w, head, body, deg) {
    ctx.save();
    ctx.translate(x + w / 2, y + 85);
    ctx.rotate((deg * Math.PI) / 180);
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(-w / 2 + 6, -79, w, 170);
    ctx.fillStyle = C.yellow;
    ctx.fillRect(-w / 2, -85, w, 170);
    ctx.fillStyle = C.navy;
    ctx.font = font(800, 26);
    const after = wrap(ctx, head, -w / 2 + 24, -42, w - 48, 32, 2);
    ctx.font = font(500, 22);
    wrap(ctx, body, -w / 2 + 24, after + 10, w - 48, 28, 3);
    ctx.restore();
  }

  function drawIcp(ctx, p) {
    frame(ctx, { kicker: '02 · Who we sell to', title: 'Ideal customer profile', page: 'p. 3' });

    // Profile card.
    rr(ctx, 70, 214, 1460, 580, 20);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = C.line;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Avatar: a generic person-shaped shape.
    rr(ctx, 110, 254, 300, 300, 150);
    ctx.fillStyle = C.tealSoft;
    ctx.fill();
    ctx.save();
    rr(ctx, 110, 254, 300, 300, 150);
    ctx.clip();
    ctx.fillStyle = C.teal;
    ctx.beginPath(); ctx.arc(260, 370, 62, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(260, 540, 120, 100, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.textAlign = 'center';
    ctx.fillStyle = C.muted;
    ctx.font = font(600, 20);
    ctx.fillText('Photo: everyone', 260, 592);
    ctx.textAlign = 'left';

    ctx.fillStyle = C.teal;
    ctx.font = font(800, 18);
    spaced(ctx, 2);
    ctx.fillText('THE CUSTOMER', 460, 278);
    spaced(ctx, 0);
    ctx.fillStyle = C.navy;
    ctx.font = font(700, 60, SERIF);
    ctx.fillText('Everyone,', 460, 352);
    ctx.fillText('but especially people.', 460, 420);

    ctx.fillStyle = C.ink;
    ctx.font = font(500, 24);
    const need = 'Core need: ' + p.desc.replace(/[.!]+$/, '') + '.';
    wrap(ctx, need, 460, 470, 1030, 32, 2);

    // Field grid.
    const gx = 110, gy = 620, cw = 470, chh = 72;
    p.icp.forEach(([k, v], i) => {
      const x = gx + (i % 3) * cw;
      const y = gy + Math.floor(i / 3) * chh;
      ctx.fillStyle = C.muted;
      ctx.font = font(700, 16);
      spaced(ctx, 1.5);
      ctx.fillText(k.toUpperCase(), x, y);
      spaced(ctx, 0);
      ctx.fillStyle = C.ink;
      const t = fit(ctx, v, cw - 30, 600, 26, 16);
      ctx.fillText(t.text, x, y + 32);
    });
  }

  function drawMatrix(ctx, p) {
    frame(ctx, { kicker: '03 · Competitive landscape', title: `${p.axes[0]} vs. ${p.axes[1]}`, page: 'p. 4' });
    matrix(ctx, { x: 150, y: 210, w: 900, h: 560 }, {
      xLabel: p.axes[0],
      yLabel: p.axes[1],
      quadrants: p.quadrants,
      dots: p.competitors,
      hero: p.name,
      heroNote: p.heroNote,
    });
    note(ctx, 1140, 230, 390, 'Key insight', 'The top right is empty, except for you. We checked.', 2);
    ctx.fillStyle = C.ink;
    ctx.font = font(500, 24);
    wrap(ctx, `Competitors were placed by feel. ${p.axes[0]} and ${p.axes[1]} were chosen after the dots.`, 1140, 520, 390, 34, 5);
  }

  function person(ctx, cx, base, pr) {
    const skin = pr.skin;
    // Body.
    rr(ctx, cx - 70, base - 150, 140, 170, 50);
    ctx.fillStyle = pr.shirt;
    ctx.fill();
    // Head and hair.
    ctx.beginPath(); ctx.arc(cx, base - 200, 44, 0, Math.PI * 2); ctx.fillStyle = skin; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, base - 212, 46, Math.PI * 1.02, Math.PI * 1.98); ctx.fillStyle = pr.hair; ctx.fill();
    // The smile. Always the smile.
    ctx.beginPath(); ctx.arc(cx, base - 196, 22, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.strokeStyle = '#3a2a20'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.stroke();
    ctx.fillStyle = '#3a2a20';
    ctx.beginPath(); ctx.arc(cx - 15, base - 210, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 15, base - 210, 4, 0, Math.PI * 2); ctx.fill();

    const arm = (x1, y1, x2, y2) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.strokeStyle = pr.shirt; ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.stroke();
      ctx.beginPath(); ctx.arc(x2, y2, 15, 0, Math.PI * 2); ctx.fillStyle = skin; ctx.fill();
    };

    switch (pr.pose) {
      case 'salad':
        arm(cx - 56, base - 120, cx - 30, base - 60);
        arm(cx + 56, base - 120, cx + 30, base - 60);
        ctx.beginPath(); ctx.arc(cx, base - 62, 52, 0, Math.PI); ctx.fillStyle = '#ffffff'; ctx.fill();
        ['#40c057', '#2f9e44', '#69db7c', '#fa5252'].forEach((g, i) => {
          ctx.beginPath(); ctx.arc(cx - 30 + i * 20, base - 66, 13, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        });
        break;
      case 'laptop':
        arm(cx - 56, base - 120, cx - 110, base - 170);
        arm(cx + 62, base - 128, cx + 84, base - 40);
        rr(ctx, cx - 10, base - 90, 120, 76, 6); ctx.fillStyle = '#adb5bd'; ctx.fill();
        rr(ctx, cx - 2, base - 82, 104, 60, 4); ctx.fillStyle = '#d0ebff'; ctx.fill();
        break;
      case 'headset':
        ctx.beginPath(); ctx.arc(cx, base - 205, 54, Math.PI * 1.05, Math.PI * 1.95);
        ctx.strokeStyle = '#343a40'; ctx.lineWidth = 8; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + 50, base - 195); ctx.quadraticCurveTo(cx + 45, base - 160, cx + 14, base - 170);
        ctx.lineWidth = 5; ctx.stroke();
        arm(cx - 62, base - 128, cx - 84, base - 40);
        arm(cx + 56, base - 120, cx + 96, base - 200);
        break;
      case 'chart':
        arm(cx - 62, base - 128, cx - 84, base - 40);
        arm(cx + 56, base - 120, cx + 110, base - 180);
        ctx.beginPath(); ctx.moveTo(cx + 120, base - 186); ctx.lineTo(cx + 168, base - 226);
        ctx.strokeStyle = '#343a40'; ctx.lineWidth = 4; ctx.stroke();
        [24, 44, 70].forEach((bh, i) => {
          ctx.fillStyle = i === 2 ? C.coral : C.teal;
          ctx.fillRect(cx + 150 + i * 22, base - 200 - bh, 16, bh);
        });
        break;
      case 'mug':
        arm(cx - 62, base - 128, cx - 84, base - 40);
        arm(cx + 62, base - 128, cx + 100, base - 150);
        rr(ctx, cx + 96, base - 206, 40, 46, 6); ctx.fillStyle = '#ffffff'; ctx.fill();
        ctx.strokeStyle = '#495057'; ctx.lineWidth = 3; ctx.stroke();
        ctx.beginPath(); ctx.arc(cx + 140, base - 183, 11, -Math.PI / 2, Math.PI / 2);
        ctx.lineWidth = 6; ctx.strokeStyle = '#ffffff'; ctx.stroke();
        break;
      default:
        arm(cx - 62, base - 128, cx - 84, base - 40);
        arm(cx + 56, base - 120, cx + 100, base - 196);
        rr(ctx, cx + 94, base - 238, 14, 34, 7); ctx.fillStyle = skin; ctx.fill();
    }
  }

  function drawPersonas(ctx, p) {
    frame(ctx, { kicker: '04 · Personas', title: 'Meet the buyers', page: 'p. 5' });
    const cw = 460, gap = 40, x0 = 70, y0 = 208, chh = 612;
    p.personas.forEach((pr, i) => {
      const x = x0 + i * (cw + gap);
      rr(ctx, x, y0, cw, chh, 18);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = C.line;
      ctx.lineWidth = 2;
      ctx.stroke();

      // The "photo": an office window, a person, a watermark.
      ctx.save();
      rr(ctx, x, y0, cw, 290, 18);
      ctx.clip();
      const sky = ctx.createLinearGradient(0, y0, 0, y0 + 290);
      sky.addColorStop(0, '#e7f5ff');
      sky.addColorStop(1, '#f8f9fa');
      ctx.fillStyle = sky;
      ctx.fillRect(x, y0, cw, 290);
      ctx.strokeStyle = '#d0ebff';
      ctx.lineWidth = 6;
      for (let k = 1; k < 4; k++) {
        ctx.beginPath(); ctx.moveTo(x + (cw / 4) * k, y0); ctx.lineTo(x + (cw / 4) * k, y0 + 290); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(x, y0 + 120); ctx.lineTo(x + cw, y0 + 120); ctx.stroke();
      person(ctx, x + cw / 2 - 20, y0 + 290, pr);
      ctx.save();
      ctx.translate(x + cw / 2, y0 + 150);
      ctx.rotate(-0.32);
      ctx.fillStyle = 'rgba(15,27,61,0.16)';
      ctx.font = font(900, 34);
      ctx.textAlign = 'center';
      spaced(ctx, 3);
      ctx.fillText('NOT A REAL PERSON', 0, 0);
      spaced(ctx, 0);
      ctx.restore();
      ctx.restore();

      const tx = x + 28;
      ctx.fillStyle = C.navy;
      ctx.font = font(700, 34, SERIF);
      ctx.fillText(pr.who, tx, y0 + 344);
      ctx.fillStyle = C.muted;
      ctx.font = font(600, 20);
      ctx.fillText(`${pr.role} · ${pr.age}`, tx, y0 + 376);
      ctx.fillStyle = C.ink;
      ctx.font = font('italic 500', 24);
      wrap(ctx, pr.quote, tx, y0 + 424, cw - 56, 32, 2);

      [['GOAL', pr.goal], ['FRUSTRATED BY', pr.pain]].forEach(([k, v], j) => {
        const y = y0 + 512 + j * 58;
        ctx.fillStyle = C.teal;
        ctx.font = font(800, 15);
        spaced(ctx, 1.5);
        ctx.fillText(k, tx, y);
        spaced(ctx, 0);
        ctx.fillStyle = C.ink;
        const t = fit(ctx, v, cw - 56, 600, 22, 14);
        ctx.fillText(t.text, tx, y + 28);
      });
    });
  }

  function drawPricing(ctx, p) {
    frame(ctx, { kicker: '05 · Pricing strategy', title: 'Charge less. No, more.', page: 'p. 6' });
    const tiers = [
      { name: 'Starter', price: '$0', per: 'forever, sort of', feats: p.pricing.free },
      { name: 'Pro', price: p.pricing.pro, per: p.pricing.proNote, feats: p.pricing.proF, hot: true },
      { name: 'Enterprise', price: "Let's talk", per: 'and talk, and talk', feats: p.pricing.ent },
    ];
    const cw = 380, gap = 32, x0 = 70, y0 = 250;
    tiers.forEach((t, i) => {
      const x = x0 + i * (cw + gap);
      const y = t.hot ? y0 - 30 : y0;
      const h = t.hot ? 560 : 500;
      rr(ctx, x, y, cw, h, 18);
      ctx.fillStyle = t.hot ? C.navy : '#ffffff';
      ctx.fill();
      ctx.strokeStyle = t.hot ? C.navy : C.line;
      ctx.lineWidth = 2;
      ctx.stroke();
      if (t.hot) {
        ctx.font = font(800, 16);
        spaced(ctx, 1.5);
        const label = 'MOST POPULAR (WITH US)';
        const lw = ctx.measureText(label).width + 32;
        rr(ctx, x + cw / 2 - lw / 2, y - 18, lw, 36, 18);
        ctx.fillStyle = C.coral;
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(label, x + cw / 2, y + 6);
        ctx.textAlign = 'left';
        spaced(ctx, 0);
      }
      const fg = t.hot ? '#ffffff' : C.navy;
      const sub = t.hot ? 'rgba(255,255,255,0.7)' : C.muted;
      ctx.fillStyle = sub;
      ctx.font = font(800, 18);
      spaced(ctx, 2);
      ctx.fillText(t.name.toUpperCase(), x + 32, y + 64);
      spaced(ctx, 0);
      ctx.fillStyle = fg;
      const pt = fit(ctx, t.price, cw - 64, 800, 64, 36, SERIF);
      ctx.fillText(pt.text, x + 32, y + 140);
      ctx.fillStyle = sub;
      const per = fit(ctx, t.per, cw - 64, 500, 20, 14);
      ctx.fillText(per.text, x + 32, y + 176);
      t.feats.forEach((f, j) => {
        const fy = y + 250 + j * 56;
        ctx.fillStyle = t.hot ? C.yellow : C.teal;
        ctx.font = font(800, 22);
        ctx.fillText('✓', x + 32, fy);
        ctx.fillStyle = fg;
        const ft = fit(ctx, f, cw - 100, 500, 22, 14);
        ctx.fillText(ft.text, x + 66, fy);
      });
    });
    note(ctx, 1316, 290, 220, 'Rule', p.pricing.note, 4);
  }

  function drawPlan(ctx, p) {
    frame(ctx, { kicker: '06 · Execution', title: 'The 90-day plan', page: 'p. 7' });
    const { top, rowH, labelX, barX0, barX1 } = PLAN;
    const wk = (barX1 - barX0) / 13;

    ctx.fillStyle = C.muted;
    ctx.font = font(700, 16);
    spaced(ctx, 1.5);
    ['MONTH 1', 'MONTH 2', 'MONTH 3'].forEach((m, i) => ctx.fillText(m, barX0 + i * (barX1 - barX0) / 3, top - 10));
    ctx.fillText('WORKSTREAM', labelX, top - 10);
    ctx.fillText('OWNER', 470, top - 10);
    spaced(ctx, 0);

    p.rows.forEach((row, i) => {
      const y = top + i * rowH;
      if (row.real) {
        ctx.fillStyle = C.yellow;
        ctx.fillRect(labelX - 16, y + 2, barX1 - labelX + 32, rowH - 4);
      } else if (i % 2) {
        ctx.fillStyle = '#f3f4f7';
        ctx.fillRect(labelX - 16, y + 2, barX1 - labelX + 32, rowH - 4);
      }
      ctx.fillStyle = row.real ? 'rgba(15,27,61,0.12)' : C.line;
      for (let k = 1; k < 3; k++) ctx.fillRect(barX0 + k * (barX1 - barX0) / 3 - 4, y, 2, rowH);
      ctx.textBaseline = 'middle';
      const mid = y + rowH / 2;
      ctx.fillStyle = row.real ? C.navy : '#4b5563';
      const lt = fit(ctx, row.label, 380, row.real ? 800 : 500, 21, 14);
      ctx.fillText(lt.text, labelX, mid);
      ctx.fillStyle = row.real ? C.navy : C.muted;
      const ot = fit(ctx, row.owner, 150, row.real ? 800 : 500, 18, 12);
      ctx.fillText(ot.text, 470, mid);

      const bx = barX0 + row.start * wk;
      const bw = row.len * wk - 6;
      rr(ctx, bx, y + 10, bw, rowH - 20, 8);
      ctx.fillStyle = row.real ? C.navy : '#c3c8d2';
      ctx.fill();
      if (row.real) {
        ctx.fillStyle = '#ffffff';
        ctx.font = font(800, 18);
        ctx.fillText('Every time you merge. It goes out on its own.', bx + 18, mid + 1);
        ctx.textAlign = 'right';
        ctx.fillStyle = C.yellow;
        ctx.fillText('← the only real one', bx + bw - 18, mid + 1);
        ctx.textAlign = 'left';
      }
      ctx.textBaseline = 'alphabetic';
    });

  }

  const SLIDES = [
    { id: 'cover', draw: drawCover },
    { id: 'tam', draw: drawTam },
    { id: 'icp', draw: drawIcp },
    { id: 'matrix', draw: drawMatrix },
    { id: 'personas', draw: drawPersonas },
    { id: 'pricing', draw: drawPricing },
    { id: 'plan', draw: drawPlan },
  ];

  function postText(p) {
    return [
      `Just wrapped the go-to-market strategy for ${p.name}.`,
      '',
      `TAM: ${p.tam[0]}.`,
      `SOM: ${p.som[1].toLowerCase()}.`,
      '',
      `Our 2x2 speaks for itself. ${p.axes[0]} vs. ${p.axes[1]}. Top right. Alone.`,
      '',
      '12 workstreams. 90 days. 1 vision.',
      '',
      'Agree? ♻️ Repost to help a founder in your network.',
      '',
      '(The whole plan was made up by a random number generator. One item on it is real.)',
    ].join('\n');
  }

  // ---------------------------------------------------------------- page wiring

  const nameEl = document.getElementById('name');
  const descEl = document.getElementById('desc');
  const postEl = document.getElementById('post');
  const realLink = document.getElementById('real-link');
  const canvases = {};
  SLIDES.forEach((s) => { canvases[s.id] = document.getElementById(`slide-${s.id}`); });

  let state = readState();
  nameEl.value = state.n;
  descEl.value = state.d;
  nameEl.placeholder = PLACEHOLDER.n;
  descEl.placeholder = PLACEHOLDER.d;

  function placeRealLink(p) {
    const y = PLAN.top + p.realAt * PLAN.rowH;
    realLink.style.left = `${((PLAN.labelX - 16) / W) * 100}%`;
    realLink.style.width = `${((PLAN.barX1 - PLAN.labelX + 32) / W) * 100}%`;
    realLink.style.top = `${(y / H) * 100}%`;
    realLink.style.height = `${(PLAN.rowH / H) * 100}%`;
  }

  function render() {
    const p = makePlan(state);
    SLIDES.forEach((s) => {
      const cv = canvases[s.id];
      s.draw(cv.getContext('2d'), p);
    });
    canvases.cover.setAttribute('aria-label', `Cover slide: go-to-market strategy for ${p.name}, stamped CONFIDENTIAL (made up).`);
    canvases.tam.setAttribute('aria-label', `TAM ${p.tam[0]}, SAM ${p.sam[0]}, SOM ${p.som[0]}: ${p.som[1]}.`);
    canvases.matrix.setAttribute('aria-label', `A 2x2 of ${p.axes[0]} against ${p.axes[1]} with ${p.name} alone in the top right.`);
    canvases.plan.setAttribute('aria-label', `A 90-day plan of 12 workstreams. Eleven are filler. Row ${p.realAt + 1} is real: ${REAL}.`);
    placeRealLink(p);
    postEl.textContent = postText(p);
    document.title = `${p.name}: go-to-market strategy (made up)`;
    writeState(state);
    return p;
  }

  let timer = 0;
  function soon() {
    clearTimeout(timer);
    timer = setTimeout(render, 90);
  }

  nameEl.addEventListener('input', () => { state.n = nameEl.value.slice(0, 32); state.r = 0; soon(); });
  descEl.addEventListener('input', () => { state.d = descEl.value.slice(0, 90); state.r = 0; soon(); });
  document.getElementById('form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    render();
    document.getElementById('plan-start').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('reroll').addEventListener('click', () => { state.r += 1; render(); });

  function flash(btn, text) {
    const before = btn.dataset.label || btn.textContent;
    btn.dataset.label = before;
    btn.textContent = text;
    setTimeout(() => { btn.textContent = before; }, 1800);
  }

  async function copy(btn, text) {
    try {
      await navigator.clipboard.writeText(text);
      flash(btn, 'Copied');
    } catch (_err) {
      flash(btn, "Couldn't copy, select it by hand");
    }
  }

  document.getElementById('copy-link').addEventListener('click', (ev) => copy(ev.currentTarget, location.href));
  document.getElementById('copy-post').addEventListener('click', (ev) => copy(ev.currentTarget, postEl.textContent));

  document.querySelectorAll('[data-download]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.download;
      const p = makePlan(state);
      window.GTM.downloadCanvas(canvases[id], `gtm-${slugify(p.name)}-${id}.png`);
    });
  });

  window.addEventListener('hashchange', () => {
    state = readState();
    nameEl.value = state.n;
    descEl.value = state.d;
    render();
  });

  render();
  window.GTM.mountTam(document.getElementById('tam'));
})();
