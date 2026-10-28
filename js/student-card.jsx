const cardNS = window.LearnToSpeakDurbanDesignSystem_ec3271;

const CARD_W = 1080, CARD_H = 1920;
const LEVELS = [
  ['VAALIE', 'Still wearing socks with slops'],
  ['KOOK', 'Owns a wetsuit. Working on it'],
  ['LAATIE', 'Young, keen, slightly sunburnt'],
  ['BRU', 'Says "shot" at robots'],
  ['FLUENT', 'Has never once asked for a fork'],
];
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

function seeded(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
}

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

function ditherPhoto(ctx, img, x, y, w, h, { cell, style, zoom, ink }) {
  const cols = Math.floor(w / cell), rows = Math.floor(h / cell);
  const off = document.createElement('canvas'); off.width = cols; off.height = rows;
  const o = off.getContext('2d');
  const scale = Math.max(cols / img.width, rows / img.height) * zoom;
  const dw = img.width * scale, dh = img.height * scale;
  o.fillStyle = '#fff'; o.fillRect(0, 0, cols, rows);
  o.drawImage(img, (cols - dw) / 2, (rows - dh) * 0.3, dw, dh);
  const d = o.getImageData(0, 0, cols, rows).data;
  const lum = new Float32Array(cols * rows);
  let mn = 1, mx = 0;
  for (let i = 0; i < cols * rows; i++) { const l = (0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]) / 255; lum[i] = l; if (l < mn) mn = l; if (l > mx) mx = l; }
  const span = Math.max(0.2, mx - mn);
  ctx.fillStyle = ink;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    let l = (lum[r * cols + c] - mn) / span; l = Math.min(1, Math.max(0, (l - 0.5) * 1.25 + 0.5));
    const px = x + c * cell, py = y + r * cell;
    if (style === 'halftone') {
      const rad = cell * 0.66 * Math.sqrt(1 - l);
      if (rad > 0.4) { ctx.beginPath(); ctx.arc(px + cell / 2, py + cell / 2, rad, 0, Math.PI * 2); ctx.fill(); }
    } else if (l < (BAYER[r % 4][c % 4] + 0.5) / 16) ctx.fillRect(px, py, cell, cell);
  }
}

function drawStudentCard(canvas, o) {
  const ctx = canvas.getContext('2d');
  const css = getComputedStyle(document.documentElement);
  const ACC = css.getPropertyValue('--yellow').trim() || '#ff5a2e';
  const INK = '#111111', PAPER = '#ecebe4';
  const G = "'Switzer', 'Helvetica Neue', Arial, sans-serif", M = "'IBM Plex Mono', monospace", P = "'Geist Pixel', monospace";
  ctx.clearRect(0, 0, CARD_W, CARD_H);
  ctx.fillStyle = '#0b0b0b'; ctx.fillRect(0, 0, CARD_W, CARD_H);
  const rnd = seeded('grain');
  for (let i = 0; i < 9000; i++) { ctx.fillStyle = `rgba(255,255,255,${0.02 + rnd() * 0.05})`; ctx.fillRect(rnd() * CARD_W, rnd() * CARD_H, 2, 2); }
  // badge holder
  ctx.fillStyle = 'rgba(255,255,255,0.045)'; rrect(ctx, 90, 140, 900, 1700, 60); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 4; rrect(ctx, 90, 140, 900, 1700, 60); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.28)'; ctx.lineWidth = 2; rrect(ctx, 106, 156, 868, 1668, 48); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 5;
  rrect(ctx, 420, 210, 240, 64, 32); ctx.stroke();
  [[260, 242], [820, 242]].forEach(([cx, cy]) => { ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2); ctx.stroke(); });
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  [322, 338, 362].forEach(yy => { ctx.beginPath(); ctx.moveTo(106, yy); ctx.lineTo(974, yy); ctx.stroke(); });
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  for (let xx = 120; xx < 962; xx += 9) ctx.fillRect(xx, 384, 4, 22);
  // paper insert
  const X0 = 150, Y0 = 440, PW = 780, PH = 1340, L = 200, R = 880;
  ctx.fillStyle = PAPER; ctx.fillRect(X0, Y0, PW, PH);
  const rule = (yy, w = 3) => { ctx.fillStyle = INK; ctx.fillRect(L, yy, R - L, w); };
  ctx.fillStyle = INK; ctx.textBaseline = 'alphabetic';
  ctx.font = `500 30px ${M}`; ctx.fillText('STUDENT:', L, 520);
  ctx.textAlign = 'right'; ctx.fillStyle = '#6b6a66'; ctx.fillText('REF: LSD-2026', R, 520); ctx.textAlign = 'left';
  rule(544, 2);
  // name, fitted
  const words = (o.name || 'Your Name').trim().split(/\s+/);
  const lines = words.length > 1 ? [words[0], words.slice(1).join(' ')] : [words[0]];
  let fs = lines.length > 1 ? 112 : 124;
  ctx.font = `800 ${fs}px ${G}`;
  while (fs > 56 && Math.max(...lines.map(t => ctx.measureText(t).width)) > R - L) { fs -= 4; ctx.font = `800 ${fs}px ${G}`; }
  ctx.fillStyle = INK;
  const nameTop = 544 + 22 + fs * 0.74;
  lines.forEach((t, i) => ctx.fillText(t, L - 4, nameTop + i * fs * 0.92));
  const ruleY = Math.round(nameTop + (lines.length - 1) * fs * 0.92 + 30);
  rule(ruleY, 2);
  // photo + vertical barcode
  const PY = ruleY + 36, PHt = 1376 - PY, PWd = 540;
  if (o.img) ditherPhoto(ctx, o.img, L, PY, PWd, PHt, { cell: o.cell, style: o.style, zoom: o.zoom, ink: INK });
  else {
    ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.setLineDash([14, 10]); ctx.strokeRect(L + 2, PY + 2, PWd - 4, PHt - 4); ctx.setLineDash([]);
    ctx.font = `400 56px ${P}`; ctx.textAlign = 'center'; ctx.fillText('FACE', L + PWd / 2, PY + PHt / 2 - 10);
    ctx.font = `500 24px ${M}`; ctx.fillText('GOES HERE. ANY FACE.', L + PWd / 2, PY + PHt / 2 + 34); ctx.fillText('YOURS IS RECOMMENDED.', L + PWd / 2, PY + PHt / 2 + 66); ctx.textAlign = 'left';
  }
  const br = seeded(o.no + o.name); let by = PY;
  ctx.fillStyle = INK;
  while (by < PY + PHt) { const t = 2 + Math.floor(br() * 9); if (br() > 0.35) ctx.fillRect(R - 96, by, 96, t); by += t + 2 + Math.floor(br() * 5); }
  // pixel stamp on photo corner
  ctx.save(); ctx.translate(L + PWd - 70, PY + PHt - 40); ctx.rotate(-0.16);
  ctx.fillStyle = ACC; ctx.beginPath(); ctx.arc(0, 0, 78, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 70, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.font = `500 15px ${M}`; ctx.fillText('ENROLLED', 0, -26); ctx.font = `400 34px ${P}`; ctx.fillText(o.level, 0, 12); ctx.font = `500 15px ${M}`; ctx.fillText('2026', 0, 40);
  ctx.restore(); ctx.textAlign = 'left';
  // spec rows
  ctx.font = `600 30px ${M}`; ctx.fillStyle = INK; ctx.fillText('ID: ' + o.no, L, 1420);
  const rows = [['FLUENCY LEVEL', o.level], ['FAVOURITE WORD', o.word.toUpperCase()], ['FORKS ON PERSON', '0'], ['VALID UNTIL', 'LOW TIDE']];
  ctx.font = `400 24px ${M}`;
  rows.forEach(([k, v], i) => {
    const yy = 1474 + i * 38;
    ctx.fillStyle = '#3a3a38'; ctx.textAlign = 'left'; ctx.fillText(k, L, yy);
    ctx.fillStyle = INK; ctx.textAlign = 'right'; ctx.font = `700 24px ${M}`; ctx.fillText(v, R, yy); ctx.font = `400 24px ${M}`;
    ctx.fillStyle = '#9a9993'; ctx.fillRect(L, yy + 12, R - L, 1);
  });
  ctx.textAlign = 'left';
  rule(1636, 2);
  ctx.fillStyle = INK; ctx.font = `800 58px ${G}`;
  ctx.fillText('A public service', L - 2, 1706); ctx.fillText('by Gateway.', L - 2, 1758);
  if (o.logo) ctx.drawImage(o.logo, R - 112, 1652, 112, 112);
  // outside footer
  ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = `500 22px ${M}`; ctx.textAlign = 'center';
  ctx.fillText('LEARN TO SPEAK DURBAN · A PUBLIC SERVICE BY GATEWAY', CARD_W / 2, 1888); ctx.textAlign = 'left';
}

function StudentCard({ mobile }) {
  const { Window, Button, Icon, StatusStrip } = cardNS;
  const canvasRef = React.useRef(null);
  const fileRef = React.useRef(null);
  const [img, setImg] = React.useState(null);
  const [name, setName] = React.useState(() => localStorage.getItem('lsd-name') || 'Thandi Mkhize');
  const [level, setLevel] = React.useState('BRU');
  const [word, setWord] = React.useState('Shap');
  const [style, setStyle] = React.useState('pixel');
  const [cell, setCell] = React.useState(8);
  const [zoom, setZoom] = React.useState(1);
  const [ready, setReady] = React.useState(false);
  const [drag, setDrag] = React.useState(false);
  const [note, setNote] = React.useState(null);
  const [logo, setLogo] = React.useState(null);
  React.useEffect(() => { const im = new Image(); im.onload = () => setLogo(im); im.src = (window.__resources && window.__resources.gatewayLogo) || ((window.LSD_ASSETS || 'assets/') + 'logos/gateway-logo.png'); }, []);
  const no = React.useMemo(() => localStorage.getItem('lsd-student') || 'LSD-2026-04417', []);
  const words = window.LSD_DATA.words.map(w => w[1]);
  React.useEffect(() => {
    Promise.all(["800 120px Switzer", "400 24px 'IBM Plex Mono'", "500 24px 'IBM Plex Mono'", "700 24px 'IBM Plex Mono'", "400 40px 'Geist Pixel'"].map(f => document.fonts.load(f))).catch(() => {}).then(() => setReady(true));
  }, []);
  React.useEffect(() => { if (canvasRef.current) drawStudentCard(canvasRef.current, { img, name, level, word, style, cell, zoom, no, logo }); }, [img, name, level, word, style, cell, zoom, ready, logo]);
  const load = file => {
    if (!file || !file.type.startsWith('image/')) { setNote('That is not a photo. Gateway checked.'); return; }
    const im = new Image(); im.onload = () => { setImg(im); setNote(null); }; im.src = URL.createObjectURL(file);
  };
  const blob = () => new Promise(res => canvasRef.current.toBlob(res, 'image/png'));
  const save = async () => {
    const b = await blob(); const a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = 'lsd-student-card.png'; a.click();
    setNote('Saved. Post it to your story. Wait for the DMs.');
  };
  const canShare = typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [new File([''], 'x.png', { type: 'image/png' })] });
  const share = async () => {
    const b = await blob();
    try { await navigator.share({ files: [new File([b], 'lsd-student-card.png', { type: 'image/png' })], text: CAPTION }); } catch (e) {}
  };
  const CAPTION = 'Officially enrolled in Learn to Speak Durban, a public service by Gateway. Fluency: guaranteed-ish. Forks: 0. #LearnToSpeakDurban';
  const copy = () => { navigator.clipboard && navigator.clipboard.writeText(CAPTION); setNote('Caption copied. Paste responsibly.'); };
  const lab = { fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 10px', background: 'var(--paper-3)', borderBottom: '1px solid var(--ink)' };
  const box = { display: 'flex', flexDirection: 'column', border: '2px solid var(--ink)', background: 'var(--paper-2)' };
  const sel = { border: 'none', outline: 'none', background: 'transparent', padding: 12, fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--ink)', borderRadius: 0, appearance: 'none', cursor: 'pointer' };
  const seg = (opts, val, set) => (
    <div style={{ display: 'flex', borderTop: 'none' }}>
      {opts.map(([v, l], i) => <button key={v} type="button" onClick={() => set(v)} style={{ flex: 1, padding: '10px 8px', border: 'none', borderLeft: i ? '1px solid var(--ink)' : 'none', background: val === v ? 'var(--ink)' : 'transparent', color: val === v ? 'var(--paper-2)' : 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{l}</button>)}
    </div>
  );
  const previewH = mobile ? 560 : 760;
  return (
    <div>
      <PageHead index="06" kicker="Identification · for the gram" title="Student Card" right={<div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, maxWidth: 330, lineHeight: 1.5 }}>Proof of enrolment. Upload a photo and Gateway pixelates it, for privacy and for style. Post it to your story. Wait for the DMs.</div>} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 380px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Window title="student_card.exe" bar="accent" meta="Form ID-07" controls={['min', 'close']} shadow="lg" padding={0}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: mobile ? 16 : 22 }}>
              <div onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); load(e.dataTransfer.files[0]); }} onClick={() => fileRef.current.click()}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, border: '2px dashed var(--ink)', background: drag ? 'var(--yellow)' : 'var(--bg-dots)', cursor: 'pointer' }}>
                <span style={{ flex: 'none', width: 56, height: 56, display: 'grid', placeItems: 'center', border: '2px solid var(--ink)', background: 'var(--paper-2)' }}><Icon name={img ? 'check' : 'human'} size={32} /></span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'var(--font-mono)' }}>
                  <b style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{img ? 'Face received' : 'Upload a face'}</b>
                  <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>{img ? 'Click to swap it for a better angle.' : 'Drop a selfie or click. Gateway does not judge. The pixels might.'}</span>
                </span>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => load(e.target.files[0])} />
              </div>
              <Field label="Name on card" value={name} onChange={setName} placeholder="First and last. Or just first, like a legend." autoComplete="name" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                <label style={box}><span style={lab}>Fluency level</span><select value={level} onChange={e => setLevel(e.target.value)} style={sel}>{LEVELS.map(([v]) => <option key={v} value={v}>{v}</option>)}</select></label>
                <label style={box}><span style={lab}>Favourite word</span><select value={word} onChange={e => setWord(e.target.value)} style={sel}>{words.map(w => <option key={w} value={w}>{w}</option>)}</select></label>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-2)', marginTop: -4 }}>{level}: {LEVELS.find(l => l[0] === level)[1]}.</div>
              <div style={box}><span style={lab}>Pixel treatment</span>{seg([['pixel', 'Pixel'], ['halftone', 'Halftone']], style, setStyle)}</div>
              <div style={box}><span style={lab}>Resolution</span>{seg([[14, 'Chunky'], [8, 'Classic'], [5, 'Fine']], cell, setCell)}</div>
              <label style={{ ...box, padding: 0 }}><span style={{ ...lab, display: 'flex', justifyContent: 'space-between' }}><span>Zoom</span><span>{Math.round(zoom * 100)}%</span></span><input type="range" min="1" max="2.2" step="0.05" value={zoom} onChange={e => setZoom(+e.target.value)} style={{ margin: 14, accentColor: 'var(--ink)' }} /></label>
            </div>
          </Window>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button variant="primary" size="lg" block brackets onClick={save}>Save for the story</Button>
            <div style={{ display: 'flex', gap: 10 }}>
              {canShare && <Button block onClick={share}>Share</Button>}
              <Button block onClick={copy}>Copy caption</Button>
            </div>
            {note && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, padding: '8px 10px', border: '2px solid var(--ink)', background: 'var(--yellow)' }}>{note}</div>}
          </div>
        </div>
        <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start', maxWidth: '100%' }}>
          <canvas ref={canvasRef} width={CARD_W} height={CARD_H} style={{ display: 'block', height: previewH, width: previewH * 9 / 16, maxWidth: '100%', border: '2px solid var(--ink)', boxShadow: 'var(--shadow-hard-lg)', background: '#0b0b0b' }} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.04em' }}>FIG. 7 — Preview at {Math.round(previewH / CARD_H * 100)}%. Exports at 1080 × 1920.</div>
        </div>
      </div>
      <StatusStrip label="Format" items={['1080 × 1920', 'Ready for stories', 'Filter: not required', 'Forks on person: 0']} style={{ marginTop: 40 }} />
    </div>
  );
}

Object.assign(window, { StudentCard, drawStudentCard });
