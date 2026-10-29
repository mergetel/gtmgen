// Shared by the generator (/) and the back catalogue (/frameworks). No dependencies.
(function () {
  // The site's domain, printed on every slide. This is the only place it lives.
  // It says merge.tel until this site has a domain of its own.
  const SITE = 'merge.tel';
  const BRAND = 'GTM Strategy Generator';

  const W = 1600;
  const H = 900;
  const SANS = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "DejaVu Sans", sans-serif';
  const SERIF = 'Georgia, "Times New Roman", "DejaVu Serif", serif';

  const C = {
    paper: '#fbfaf7',
    navy: '#0f1b3d',
    ink: '#1f2937',
    muted: '#6b7280',
    line: '#d9dce3',
    teal: '#0f8a7e',
    tealSoft: '#d7efec',
    coral: '#f0603f',
    yellow: '#ffd84d',
    red: '#b42318',
    strip: '#eceef3',
  };

  // FNV-1a, so a product name always hashes to the same seed.
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
    const next = mulberry32(seed >>> 0);
    const r = {
      next,
      int: (a, b) => a + Math.floor(next() * (b - a + 1)),
      pick: (list) => list[Math.floor(next() * list.length)],
      shuffle: (list) => {
        const out = list.slice();
        for (let i = out.length - 1; i > 0; i--) {
          const j = Math.floor(next() * (i + 1));
          [out[i], out[j]] = [out[j], out[i]];
        }
        return out;
      },
    };
    r.take = (list, n) => r.shuffle(list).slice(0, n);
    return r;
  }

  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function font(weight, size, family) {
    return `${weight} ${size}px ${family || SANS}`;
  }

  // Shrinks the font until the text fits, then truncates with an ellipsis.
  function fit(ctx, text, maxW, weight, size, min, family) {
    let s = size;
    ctx.font = font(weight, s, family);
    while (s > min && ctx.measureText(text).width > maxW) {
      s -= 1;
      ctx.font = font(weight, s, family);
    }
    let t = text;
    while (t.length > 1 && ctx.measureText(t).width > maxW) t = t.slice(0, -2) + '…';
    return { text: t, size: s };
  }

  // Word wrap. Returns the y after the last line.
  function wrap(ctx, text, x, y, maxW, lineH, maxLines) {
    const words = String(text).split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    const limit = maxLines || lines.length;
    const shown = lines.slice(0, limit);
    if (lines.length > limit) {
      let last = shown[limit - 1];
      while (last.length > 1 && ctx.measureText(last + '…').width > maxW) last = last.slice(0, -1);
      shown[limit - 1] = last.replace(/[\s,.;:]+$/, '') + '…';
    }
    shown.forEach((l, i) => ctx.fillText(l, x, y + i * lineH));
    return y + shown.length * lineH;
  }

  function spaced(ctx, px) {
    if ('letterSpacing' in ctx) ctx.letterSpacing = px + 'px';
  }

  // Slide chrome: paper, kicker, title, and the footer strip with the tell in it.
  function frame(ctx, { kicker, title, page }) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = C.paper;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = C.navy;
    ctx.fillRect(0, 0, W, 10);

    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.fillStyle = C.teal;
    ctx.font = font(800, 20);
    spaced(ctx, 3);
    ctx.fillText(kicker.toUpperCase(), 70, 82);
    spaced(ctx, 0);

    if (title) {
      ctx.fillStyle = C.navy;
      const t = fit(ctx, title, W - 140, 700, 56, 34, SERIF);
      ctx.fillText(t.text, 70, 148);
      ctx.fillStyle = C.line;
      ctx.fillRect(70, 172, W - 140, 2);
    }

    ctx.fillStyle = C.strip;
    ctx.fillRect(0, H - 52, W, 52);
    ctx.textBaseline = 'middle';
    ctx.fillStyle = C.red;
    ctx.font = font(800, 18);
    spaced(ctx, 1.5);
    ctx.fillText('CONFIDENTIAL (made up)', 70, H - 26);
    spaced(ctx, 0);
    ctx.textAlign = 'right';
    ctx.fillStyle = C.muted;
    ctx.font = font(600, 18);
    ctx.fillText(`${BRAND} · ${SITE}${page ? '  ·  ' + page : ''}`, W - 70, H - 26);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }

  // A 2x2 with labelled axes. Everyone else is a grey dot. The hero sits alone top right.
  function matrix(ctx, box, opts) {
    const { x, y, w, h } = box;
    const mx = x + w / 2;
    const my = y + h / 2;
    const q = opts.quadrants;

    ctx.fillStyle = '#f2f3f6'; ctx.fillRect(x, y, w / 2, h / 2);
    ctx.fillStyle = C.tealSoft; ctx.fillRect(mx, y, w / 2, h / 2);
    ctx.fillStyle = '#eef0f4'; ctx.fillRect(x, my, w / 2, h / 2);
    ctx.fillStyle = '#f2f3f6'; ctx.fillRect(mx, my, w / 2, h / 2);
    ctx.strokeStyle = '#c3c8d2';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
    ctx.beginPath(); ctx.moveTo(mx, y); ctx.lineTo(mx, y + h); ctx.moveTo(x, my); ctx.lineTo(x + w, my); ctx.stroke();

    // Quadrant names, top left of each quadrant.
    ctx.font = font(800, 16);
    spaced(ctx, 1.5);
    const ql = [[q.tl, x, y], [q.tr, mx, y], [q.bl, x, my], [q.br, mx, my]];
    ql.forEach(([label, qx, qy], i) => {
      ctx.fillStyle = i === 1 ? C.teal : '#8a909c';
      const t = fit(ctx, label.toUpperCase(), w / 2 - 36, 800, 16, 11);
      ctx.fillText(t.text, qx + 18, qy + 32);
    });
    spaced(ctx, 0);

    // Axes, outside the box.
    ctx.fillStyle = C.navy;
    ctx.font = font(700, 22);
    ctx.textAlign = 'center';
    ctx.fillText(`${opts.xLabel} →`, mx, y + h + 40);
    ctx.font = font(600, 16);
    ctx.fillStyle = C.muted;
    ctx.textAlign = 'left';
    ctx.fillText('Low', x, y + h + 40);
    ctx.textAlign = 'right';
    ctx.fillText('Off the charts', x + w, y + h + 40);
    ctx.save();
    ctx.translate(x - 26, my);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = C.navy;
    ctx.font = font(700, 22);
    ctx.fillText(`${opts.yLabel} →`, 0, 0);
    ctx.restore();
    ctx.textAlign = 'left';

    // Competitors in fixed slots, so labels never pile up.
    const slots = opts.slots || [
      [0.05, 0.1], [0.17, 0.26], [0.06, 0.38], [0.55, 0.1], [0.6, 0.3], [0.05, 0.64], [0.15, 0.8],
    ];
    (opts.dots || []).forEach((label, i) => {
      const s = slots[i % slots.length];
      const dx = x + s[0] * w;
      const dy = y + h - s[1] * h;
      ctx.beginPath();
      ctx.arc(dx, dy, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#9aa1ae';
      ctx.fill();
      const edge = s[0] < 0.5 ? mx : x + w;
      ctx.fillStyle = '#4b5563';
      const t = fit(ctx, label, edge - dx - 28, 600, 20, 13);
      ctx.textBaseline = 'middle';
      ctx.fillText(t.text, dx + 18, dy + 1);
      ctx.textBaseline = 'alphabetic';
    });

    // The hero. Halo, dot, label.
    const hx = x + w * 0.83;
    const hy = y + h * 0.22;
    [64, 44].forEach((r, i) => {
      ctx.beginPath();
      ctx.arc(hx, hy, r, 0, Math.PI * 2);
      ctx.fillStyle = i ? 'rgba(240,96,63,0.22)' : 'rgba(240,96,63,0.1)';
      ctx.fill();
    });
    ctx.beginPath();
    ctx.arc(hx, hy, 24, 0, Math.PI * 2);
    ctx.fillStyle = C.coral;
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.fillStyle = C.navy;
    const ht = fit(ctx, opts.hero, w / 2 - 30, 800, 28, 16);
    ctx.fillText(ht.text, hx - Math.max(0, hx + ctx.measureText(ht.text).width / 2 - (x + w - 12)), hy + 84);
    if (opts.heroNote) {
      ctx.fillStyle = C.muted;
      ctx.font = font(500, 18);
      ctx.fillText(opts.heroNote, hx - 10, hy + 110);
    }
    ctx.textAlign = 'left';
  }

  // The weekly framework as a slide: its 2x2 on the left, its stages on the right.
  function drawFramework(ctx, fw) {
    frame(ctx, { kicker: `Framework of the week · ${fw.week}`, title: fw.name, page: 'appendix' });
    const box = { x: 120, y: 214, w: 760, h: 540 };
    matrix(ctx, box, {
      xLabel: fw.axes.x,
      yLabel: fw.axes.y,
      quadrants: fw.quadrants,
      dots: ['You, today'],
      slots: [[0.08, 0.14]],
      hero: 'You, eventually',
      heroNote: 'results not typical',
    });
    // The journey, drawn as a dashed line, because it has not happened.
    ctx.save();
    ctx.setLineDash([14, 12]);
    ctx.strokeStyle = C.coral;
    ctx.lineWidth = 4;
    ctx.beginPath();
    const sx = box.x + box.w * 0.08 + 14, sy = box.y + box.h * 0.86 - 14;
    const ex = box.x + box.w * 0.83 - 72, ey = box.y + box.h * 0.22;
    ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(sx + 140, sy - 220, ex - 240, ey + 30, ex, ey);
    ctx.stroke();
    ctx.restore();

    const px = 960;
    ctx.fillStyle = C.navy;
    ctx.font = font(800, 18);
    spaced(ctx, 2);
    ctx.fillText(`THE ${fw.steps.length} STAGES`, px, 236);
    spaced(ctx, 0);

    const shown = fw.steps.slice(0, 7);
    const rowH = shown.length > 6 ? 62 : 70;
    shown.forEach((st, i) => {
      const y = 262 + i * rowH;
      ctx.beginPath();
      ctx.arc(px + 24, y + 24, 24, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 ? C.teal : C.navy;
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = font(800, 22);
      ctx.fillText(st.letter || String(i + 1), px + 24, y + 32);
      ctx.textAlign = 'left';
      ctx.fillStyle = C.ink;
      const t = fit(ctx, st.word, 520, 700, 28, 16);
      ctx.fillText(t.text, px + 66, y + 34);
    });

    const after = 262 + shown.length * rowH + 30;
    ctx.fillStyle = C.muted;
    ctx.font = font(500, 20);
    wrap(ctx, fw.footnote || 'Patent pending. It is not pending.', px, Math.min(after, 790), 560, 28, 2);
  }

  // The site's own TAM. It grows 0.42% a day from launch, computed from the date.
  const TAM_START = Date.UTC(2026, 9, 28);
  const TAM_BASE = 4.2e12;
  const TAM_DAILY = 0.0042;

  function tamOn(date) {
    const d = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    const days = Math.max(0, Math.round((d - TAM_START) / 86400000));
    return TAM_BASE * Math.pow(1 + TAM_DAILY, days);
  }

  const UNITS = [
    [1e21, 'sextillion'], [1e18, 'quintillion'], [1e15, 'quadrillion'], [1e12, 'trillion'], [1e9, 'billion'],
  ];

  function bigMoney(n, digits) {
    for (const [v, name] of UNITS) {
      if (n >= v) return `$${(n / v).toFixed(digits == null ? 3 : digits)} ${name}`;
    }
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function mountTam(el) {
    if (!el) return;
    const value = document.createElement('b');
    value.textContent = bigMoney(tamOn(new Date()));
    const up = document.createElement('span');
    up.className = 'up';
    up.textContent = ` ▲ ${(TAM_DAILY * 100).toFixed(2)}% today`;
    el.replaceChildren('Our TAM: ', value, up);
  }

  function slugify(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'gtm';
  }

  function downloadCanvas(canvas, filename) {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, 'image/png');
  }

  window.GTM = {
    SITE, BRAND, W, H, SANS, SERIF, C,
    hashStr, rng, rr, font, fit, wrap, spaced, frame, matrix, drawFramework,
    tamOn, bigMoney, mountTam, slugify, downloadCanvas,
  };
})();
