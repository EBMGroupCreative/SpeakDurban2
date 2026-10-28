const gameNS = window.LearnToSpeakDurbanDesignSystem_ec3271;

const GAME_META = {
  'game-01': { title: 'Say Gqom', how: 'Press the button. Click your tongue like you mean it. The click-o-meter judges you from VAALIE to FLUENT.' },
  'game-02': { title: 'Spot the Vaalie', how: 'Find three vaalie details hidden in the beach scene. Click to report. False reports are noted.' },
  'game-03': { title: 'Ja / No Laka', how: 'A statement appears. Agree? Slam NO LAKA (J key) — yes, it means yes. Disagree? Slam EISH, NO (N key). 45 seconds. Score counted in soft-serves.' },
  'game-04': { title: 'Durdle', how: 'Guess the five-letter Durban word in six tries. Orange = right spot. Black = wrong spot. Grey = not in the word.' },
  'game-05': { title: 'Pack for Durban', how: 'Drag items into the suitcase, or click them. Pack only what you actually need. The system is watching.' },
  'game-06': { title: 'The 2pm Quiz', how: 'Five questions. Only after 2pm. Before that you should be at the beach.' },
};

function GameShell({ id, score, onBack, children }) {
  const { Button, Icon, StatusStrip, RefCode } = gameNS;
  const meta = GAME_META[id];
  React.useEffect(() => {
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const k = e => { if (e.key === 'Escape') onBack(); };
    addEventListener('keydown', k);
    return () => { document.body.style.overflow = prev; removeEventListener('keydown', k); };
  }, []);
  return (
    <div role="dialog" aria-label={meta.title} style={{ position: 'fixed', inset: 0, zIndex: 60, overflowY: 'auto', background: 'var(--bg-graph)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 2, display: 'flex', alignItems: 'center', gap: 16, padding: '12px clamp(16px, 4vw, 40px)', background: 'var(--paper-2)', borderBottom: '2px solid var(--ink)' }}>
        <Button size="sm" icon={<Icon name="arrow-left" size={16} />} onClick={onBack}>Back to Activities</Button>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 12, justifyContent: 'center' }}>
          <RefCode prefix="" code={id.toUpperCase()} />
          <span style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 800, fontSize: 22, textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{meta.title}</span>
        </div>
        {score != null && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, border: '2px solid var(--ink)', padding: '5px 10px', background: 'var(--yellow)', whiteSpace: 'nowrap' }}>{score}</span>}
        <button type="button" aria-label="Close game" onClick={onBack} style={{ width: 32, height: 32, display: 'grid', placeItems: 'center', border: '2px solid var(--ink)', background: 'var(--paper-2)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, borderRadius: 0 }}>✕</button>
      </header>
      <main style={{ flex: 1, width: '100%', maxWidth: 1100, margin: '0 auto', padding: 'clamp(20px, 4vw, 48px) clamp(16px, 4vw, 40px)' }}>{children}</main>
      <div style={{ padding: '0 clamp(16px, 4vw, 40px) 28px', maxWidth: 1100, width: '100%', margin: '0 auto' }}>
        <StatusStrip label="How to play" live={false} items={[meta.how]} />
      </div>
    </div>
  );
}

const bigHead = { fontFamily: 'var(--font-grotesk)', fontWeight: 800, fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 0.92, letterSpacing: '-0.02em', textTransform: 'uppercase', margin: 0, textWrap: 'balance' };
const monoP = { fontFamily: 'var(--font-mono)', fontSize: 15, lineHeight: 1.55, margin: 0 };

/* GAME-01 */
function SayGqomGame({ setScore }) {
  const { Button } = gameNS;
  const stops = ['VAALIE', 'KOOK', 'LAATIE', 'BRU', 'FLUENT'];
  const lines = ['That was a cough. Try again, from the diaphragm.', 'A click was attempted. Gateway heard it, faintly.', 'Getting there. Your gran would nod politely.', 'Solid click. Taxi drivers would respect it.', 'Windows rattled. Gqom approved.'];
  const [phase, setPhase] = React.useState('idle');
  const [lvl, setLvl] = React.useState(0);
  const [live, setLive] = React.useState(0);
  const [note, setNote] = React.useState(null);
  const listen = async () => {
    setPhase('listening'); setNote(null); setLive(0);
    let peak = 0;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const an = ac.createAnalyser(); an.fftSize = 1024; ac.createMediaStreamSource(stream).connect(an);
      const buf = new Uint8Array(an.fftSize); const t0 = performance.now();
      await new Promise(res => { const tick = () => { an.getByteTimeDomainData(buf); let m = 0; for (let i = 0; i < buf.length; i++) m = Math.max(m, Math.abs(buf[i] - 128) / 128); peak = Math.max(peak, m); setLive(m); if (performance.now() - t0 < 2000) requestAnimationFrame(tick); else res(); }; tick(); });
      stream.getTracks().forEach(t => t.stop()); ac.close();
      peak = Math.min(1, peak * 1.6);
    } catch (e) {
      setNote('Microphone unavailable. Gateway guessed, generously.');
      await new Promise(r => setTimeout(r, 1200)); peak = 0.35 + Math.random() * 0.6;
    }
    setLvl(peak); setPhase('result');
    const idx = Math.min(4, Math.floor(peak * 5));
    setScore('Best: ' + stops[idx]);
  };
  const idx = Math.min(4, Math.floor(lvl * 5));
  const shown = phase === 'listening' ? live : phase === 'result' ? lvl : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, textAlign: 'center' }}>
      <h2 style={bigHead}>{phase === 'result' ? 'Rating: ' + stops[idx] : phase === 'listening' ? 'Click now.' : 'Say it with a click.'}</h2>
      <button type="button" onClick={phase === 'listening' ? undefined : listen} style={{ width: 220, height: 220, borderRadius: '50%', border: '3px solid var(--ink)', background: phase === 'listening' ? 'var(--yellow)' : 'var(--paper-2)', boxShadow: 'var(--shadow-hard)', cursor: phase === 'listening' ? 'default' : 'pointer', fontFamily: 'var(--font-pixel)', fontSize: 34, color: 'var(--ink)' }}>{phase === 'listening' ? 'GQ-!' : phase === 'result' ? 'AGAIN' : 'START'}</button>
      <div style={{ width: 'min(640px, 100%)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ position: 'relative', height: 34, border: '2px solid var(--ink)', background: 'var(--paper-2)', display: 'flex' }}>
          {stops.map((s, i) => <span key={s} style={{ flex: 1, borderLeft: i ? '1px solid var(--ink)' : 'none', background: i / 5 < shown ? 'var(--ink)' : 'transparent', transition: 'background 80ms linear' }}></span>)}
          <span style={{ position: 'absolute', top: -10, left: `calc(${shown * 100}% - 2px)`, width: 4, height: 50, background: 'var(--yellow)', outline: '1px solid var(--ink)' }}></span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>{stops.map(s => <span key={s}>{s}</span>)}</div>
      </div>
      <p style={{ ...monoP, maxWidth: 520 }}>{phase === 'result' ? lines[idx] : phase === 'listening' ? 'Listening for two seconds. Do not apologise.' : 'Press start, allow the microphone, and click your tongue once. Loudly. The neighbours will understand.'}</p>
      {note && <p style={{ ...monoP, fontSize: 12, color: 'var(--ink-2)' }}>{note}</p>}
      {phase === 'result' && <Button variant="primary" brackets onClick={listen}>Try again</Button>}
    </div>
  );
}

/* GAME-02 */
function SpotVaalieGame({ setScore, onBack }) {
  const { Halftone, Button, Dialog, Icon } = gameNS;
  const targets = [{ k: 'Flame shirt', x: 22, y: 42 }, { k: 'Socks with slops', x: 63, y: 78 }, { k: 'Gazebo with cup holders', x: 80, y: 26 }];
  const [found, setFound] = React.useState([]);
  const [misses, setMisses] = React.useState(0);
  const [toast, setToast] = React.useState(null);
  const [hint, setHint] = React.useState(false);
  React.useEffect(() => { setScore(found.length + '/3 found'); }, [found]);
  const click = e => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width * 100, y = (e.clientY - r.top) / r.height * 100;
    const hit = targets.find(t => !found.includes(t.k) && Math.hypot(t.x - x, (t.y - y) * 0.6) < 7);
    if (hit) { setFound([...found, hit.k]); setToast('Reported: ' + hit.k.toLowerCase() + '.'); }
    else { setMisses(misses + 1); setToast(['That is just a regular tourist.', 'That is a lifeguard. Leave him alone.', 'That is a seagull. Innocent.', 'False report. Gateway sighs.'][misses % 4]); }
  };
  const reset = () => { setFound([]); setMisses(0); setToast(null); setHint(false); };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'flex-start' }}>
      <div style={{ flex: '999 1 560px', minWidth: 0, position: 'relative', border: '2px solid var(--ink)', boxShadow: 'var(--shadow-hard)', cursor: 'crosshair' }} onClick={click}>
        <Halftone height={540} dot={6} placeholder="beach" caption="FIG. 2 — North Beach (placeholder scene)" />
        {targets.map(t => (found.includes(t.k) || hint) && (
          <span key={t.k} style={{ position: 'absolute', left: t.x + '%', top: t.y + '%', transform: 'translate(-50%,-50%)', width: 70, height: 70, borderRadius: '50%', border: found.includes(t.k) ? '3px solid var(--ink)' : '2px dashed var(--ink)', background: found.includes(t.k) ? 'rgba(255,90,46,.45)' : 'transparent', pointerEvents: 'none' }}></span>
        ))}
        {toast && <div style={{ position: 'absolute', left: 12, top: 12, fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, background: 'var(--paper-2)', border: '2px solid var(--ink)', padding: '6px 10px', pointerEvents: 'none' }}>{toast}</div>}
      </div>
      <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ ...bigHead, fontSize: 40 }}>Find the vaalie.</h2>
        <div style={{ border: '2px solid var(--ink)', background: 'var(--paper-2)' }}>
          {targets.map((t, i) => (
            <div key={t.k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderTop: i ? '1px dashed var(--ink-3)' : 'none', fontFamily: 'var(--font-mono)', fontSize: 14, textDecoration: found.includes(t.k) ? 'line-through' : 'none' }}>
              <span style={{ width: 20, height: 20, border: '2px solid var(--ink)', display: 'grid', placeItems: 'center', background: found.includes(t.k) ? 'var(--yellow)' : 'transparent', fontSize: 12, fontWeight: 700 }}>{found.includes(t.k) ? '✓' : ''}</span>{t.k}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-2)' }}>False reports: {misses}</div>
        {misses >= 3 && !hint && found.length < 3 && <Button size="sm" onClick={() => setHint(true)}>Ask a lifeguard (hint)</Button>}
      </div>
      {found.length === 3 && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 5, display: 'grid', placeItems: 'center', background: 'rgba(242,241,236,.6)', padding: 16 }}>
          <Dialog title="spot_the_vaalie.exe" kind="success" heading="Vaalie confirmed." onClose={reset}
            actions={<><Button size="sm" onClick={onBack}>Back to Activities</Button><Button size="sm" variant="primary" onClick={reset}>Play again</Button></>}>
            All three details reported with {misses} false alarm{misses === 1 ? '' : 's'}. The coast thanks you. Be gentle; they are on holiday.
          </Dialog>
        </div>
      )}
    </div>
  );
}

/* GAME-03 */
const JA_STATEMENTS = [
  ['A robot is a traffic light.', true], ['Baggies are formal attire on the coast.', true], ['A bunny is a small rabbit, served whole.', false],
  ['“Chips!” means the food has arrived.', false], ['Kiff means good.', true], ['Larney means cheap.', false], ['Shot means thanks.', true],
  ['Smaak means you like it a lot.', true], ['A laatie is an elderly gentleman.', false], ['Your pozi is your home.', true],
  ['Forks are required for bunny chow.', false], ['Vy means to go.', true], ['Gqom is dance music.', true], ['Ducking out means hiding from ducks.', false],
  ['A prawn is an idiot.', true], ['A kook has mastered surfing.', false], ['Yano is short for amapiano.', true], ['Logging means cutting down trees.', false], ['Logging is longboarding.', true],
  ['Mfethu is warmer than bru.', true], ['A vaalie wears socks with slops.', true], ['Tops means the worst.', false], ['Dala means to do.', true],
];
function JaNoLakaGame({ setScore, onBack }) {
  const { Button } = gameNS;
  const [phase, setPhase] = React.useState('ready');
  const [deck, setDeck] = React.useState([]);
  const [i, setI] = React.useState(0);
  const [pts, setPts] = React.useState(0);
  const [left, setLeft] = React.useState(45);
  const [flash, setFlash] = React.useState(null);
  const start = () => { setDeck([...JA_STATEMENTS].sort(() => Math.random() - 0.5)); setI(0); setPts(0); setLeft(45); setFlash(null); setPhase('play'); };
  React.useEffect(() => { if (phase !== 'play') return; const t = setInterval(() => setLeft(l => { if (l <= 1) { clearInterval(t); setPhase('done'); return 0; } return l - 1; }), 1000); return () => clearInterval(t); }, [phase]);
  React.useEffect(() => { setScore(pts + ' soft-serve' + (pts === 1 ? '' : 's')); }, [pts]);
  const answer = v => {
    if (phase !== 'play') return;
    const ok = deck[i][1] === v; if (ok) setPts(p => p + 1);
    setFlash(ok ? 'ok' : 'no'); setTimeout(() => setFlash(null), 260);
    if (i + 1 >= deck.length) setPhase('done'); else setI(i + 1);
  };
  React.useEffect(() => { const k = e => { if (e.key === 'j' || e.key === 'J') answer(true); if (e.key === 'n' || e.key === 'N') answer(false); }; addEventListener('keydown', k); return () => removeEventListener('keydown', k); });
  const verdict = pts >= 18 ? 'Fluent. Possibly born on the beachfront.' : pts >= 12 ? 'Bru-level. Respectable.' : pts >= 6 ? 'Laatie-level. Keep practising.' : 'Vaalie-level. The Dictionary is right there.';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, textAlign: 'center' }}>
      {phase === 'ready' && <>
        <h2 style={bigHead}>No laka or eish, no?</h2>
        <p style={{ ...monoP, maxWidth: 520 }}>45 seconds. Reminder: no laka means yes. The Institute apologises for nothing. One point per correct answer, paid in soft-serves. J and N keys work too.</p>
        <Button variant="primary" size="lg" brackets onClick={start}>Start the clock</Button>
      </>}
      {phase === 'play' && deck[i] && <>
        <div style={{ display: 'flex', gap: 24, fontFamily: 'var(--font-pixel)', fontSize: 28 }}><span>{String(left).padStart(2, '0')}s</span><span>{String(i + 1).padStart(2, '0')}/{deck.length}</span></div>
        <div style={{ width: 'min(760px, 100%)', minHeight: 220, display: 'grid', placeItems: 'center', padding: '28px 24px', border: '3px solid var(--ink)', boxShadow: 'var(--shadow-hard-lg)', background: flash === 'ok' ? 'var(--yellow)' : flash === 'no' ? 'var(--ink)' : 'var(--paper-2)', color: flash === 'no' ? 'var(--paper-2)' : 'var(--ink)', transition: 'background 80ms linear' }}>
          <div style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: 'clamp(28px, 3.6vw, 44px)', lineHeight: 1.1, textWrap: 'balance' }}>{deck[i][0]}</div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="primary" size="lg" onClick={() => answer(true)} style={{ minWidth: 200 }}>NO LAKA (J)</Button>
          <Button size="lg" onClick={() => answer(false)} style={{ minWidth: 200 }}>EISH, NO (N)</Button>
        </div>
      </>}
      {phase === 'done' && <>
        <h2 style={bigHead}>{pts} soft-serve{pts === 1 ? '' : 's'}.</h2>
        <p style={{ ...monoP, maxWidth: 520 }}>{verdict}</p>
        <div style={{ display: 'flex', gap: 12 }}><Button onClick={onBack}>Back to Activities</Button><Button variant="primary" brackets onClick={start}>Play again</Button></div>
      </>}
    </div>
  );
}

/* GAME-04 */
function DurdleGame({ setScore }) {
  const { Button } = gameNS;
  const ANSWERS = ['CHOON', 'BUNNY', 'SMAAK', 'CHIPS'];
  const answer = ANSWERS[Math.floor(Date.now() / 864e5) % ANSWERS.length];
  const [rows, setRows] = React.useState([]);
  const [cur, setCur] = React.useState('');
  const [msg, setMsg] = React.useState(null);
  const done = rows.includes(answer) || rows.length >= 6;
  const grade = g => { const res = Array(5).fill('x'); const pool = answer.split(''); g.split('').forEach((c, i) => { if (c === answer[i]) { res[i] = 'g'; pool[i] = null; } }); g.split('').forEach((c, i) => { if (res[i] !== 'g') { const j = pool.indexOf(c); if (j > -1) { res[i] = 'y'; pool[j] = null; } } }); return res; };
  const keyState = {}; rows.forEach(r => { const g = grade(r); r.split('').forEach((c, i) => { const s = g[i]; if (s === 'g' || (s === 'y' && keyState[c] !== 'g') || (!keyState[c])) keyState[c] = s; }); });
  const press = k => {
    if (done) return;
    if (k === 'ENTER') { if (cur.length < 5) { setMsg('Five letters, bru.'); return; } const n = [...rows, cur]; setRows(n); setCur(''); if (cur === answer) { setMsg(['Lekker first try. Suspicious.', 'Shap. Two tries.', 'Three tries. Solid.', 'Four. Fine.', 'Five. Close one.', 'Six. Just.'][n.length - 1]); setScore('Solved in ' + n.length); } else if (n.length >= 6) { setMsg('Eish. It was ' + answer + '. The Dictionary has it.'); setScore('Unsolved'); } else setMsg(null); return; }
    if (k === '⌫') { setCur(cur.slice(0, -1)); return; }
    if (/^[A-Z]$/.test(k) && cur.length < 5) setCur(cur + k);
  };
  React.useEffect(() => { const h = e => { const k = e.key === 'Enter' ? 'ENTER' : e.key === 'Backspace' ? '⌫' : e.key.toUpperCase(); press(k); }; addEventListener('keydown', h); return () => removeEventListener('keydown', h); });
  React.useEffect(() => { setScore((Math.min(rows.length + 1, 6)) + '/6'); }, []);
  const cell = s => ({ g: { background: 'var(--yellow)', color: 'var(--ink)' }, y: { background: 'var(--ink)', color: 'var(--paper-2)' }, x: { background: 'var(--paper-4)', color: 'var(--ink)' } }[s] || { background: 'var(--paper-2)', color: 'var(--ink)' });
  const grid = Array.from({ length: 6 }, (_, r) => rows[r] ? { t: rows[r], g: grade(rows[r]) } : r === rows.length ? { t: cur.padEnd(5), g: [] } : { t: '     ', g: [] });
  const kb = ['QWERTYUIOP', 'ASDFGHJKL', 'ENTER ZXCVBNM ⌫'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.08em' }}>DURDLE NO. {Math.floor(Date.now() / 864e5) % 1000} · TODAY’S WORD IS IN THE DICTIONARY</div>
      <div style={{ display: 'grid', gap: 6 }}>
        {grid.map((row, r) => <div key={r} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 58px)', gap: 6 }}>{row.t.split('').map((c, i) => <span key={i} style={{ height: 58, display: 'grid', placeItems: 'center', border: '2px solid var(--ink)', fontFamily: 'var(--font-pixel)', fontSize: 30, ...cell(row.g[i]) }}>{c.trim()}</span>)}</div>)}
      </div>
      <div style={{ minHeight: 24, fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700 }}>{msg}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', width: '100%' }}>
        {kb.map((row, ri) => <div key={ri} style={{ display: 'flex', gap: 5, justifyContent: 'center', width: '100%' }}>{(ri === 2 ? row.split(' ').flatMap((p, j) => j === 1 ? p.split('') : [p]) : row.split('')).map(k => <button key={k} type="button" onClick={() => press(k)} style={{ minWidth: k.length > 1 ? 72 : 38, flex: k.length > 1 ? '0 0 auto' : '0 1 44px', height: 50, border: '2px solid var(--ink)', borderRadius: 0, cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: k.length > 1 ? 11 : 15, fontWeight: 700, ...cell(keyState[k]) }}>{k}</button>)}</div>)}
      </div>
      {done && <Button variant="primary" brackets onClick={() => { setRows([]); setCur(''); setMsg(null); }}>Practise again</Button>}
    </div>
  );
}

/* GAME-05 */
const PACK_ITEMS = [
  { k: 'Baggies', ok: true }, { k: 'Sunscreen', ok: true }, { k: 'Slops', ok: true }, { k: 'Towel', ok: true },
  { k: 'Wetsuit', ok: false, h: '⚠ Error: wetsuit detected.', b: 'Baggies required.', a: ['OK', 'OK, bru'] },
  { k: 'Fork', ok: false, h: 'ABSOLUTELY NOT', b: 'Forks are not permitted within 50km of a bunny.', a: ['Remove fork'] },
  { k: 'Socks', ok: false, h: 'Vaalie behaviour detected.', b: 'Socks with slops is a serious offence on the coast.', a: ['Sorry', 'It won’t happen again'] },
  { k: 'Gazebo with cup holders', ok: false, h: 'Error: gazebo too larney.', b: 'The beach is free. So is the shade under someone else’s umbrella.', a: ['OK, fine'] },
];
function PackGame({ setScore, onBack }) {
  const { Button, Dialog, Icon } = gameNS;
  const [packed, setPacked] = React.useState([]);
  const [err, setErr] = React.useState(null);
  const [over, setOver] = React.useState(false);
  const need = PACK_ITEMS.filter(i => i.ok).length;
  React.useEffect(() => { setScore(packed.length + '/' + need + ' packed'); }, [packed]);
  const pack = k => { const it = PACK_ITEMS.find(i => i.k === k); if (!it) return; if (!it.ok) return setErr(it); if (!packed.includes(k)) setPacked([...packed, k]); };
  const won = packed.length === need;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
      <div style={{ flex: '1 1 360px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h2 style={{ ...bigHead, fontSize: 44 }}>Pack for Durban.</h2>
        <p style={monoP}>Drag to the suitcase or click to pack. Some items will be refused.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
          {PACK_ITEMS.map(it => {
            const p = packed.includes(it.k);
            return <button key={it.k} type="button" draggable={!p} onDragStart={e => e.dataTransfer.setData('text/plain', it.k)} onClick={() => pack(it.k)} disabled={p}
              style={{ minHeight: 64, padding: '10px 12px', border: '2px solid var(--ink)', borderRadius: 0, background: p ? 'var(--paper-3)' : 'var(--paper-2)', cursor: p ? 'default' : 'grab', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, textAlign: 'left', textDecoration: p ? 'line-through' : 'none', color: 'var(--ink)', boxShadow: p ? 'none' : 'var(--shadow-hard-sm)' }}>{it.k}</button>;
          })}
        </div>
      </div>
      <div onDragOver={e => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={e => { e.preventDefault(); setOver(false); pack(e.dataTransfer.getData('text/plain')); }}
        style={{ flex: '1 1 320px', position: 'relative', marginTop: 30, minHeight: 340, border: '3px solid var(--ink)', background: over ? 'var(--yellow)' : 'var(--paper-2)', boxShadow: 'var(--shadow-hard-lg)', padding: '40px 22px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ position: 'absolute', top: -26, left: '50%', transform: 'translateX(-50%)', width: 120, height: 24, border: '3px solid var(--ink)', borderBottom: 'none' }}></span>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em' }}>SUITCASE · {packed.length}/{need}</div>
        {packed.length === 0 && <div style={{ ...monoP, color: 'var(--ink-3)', marginTop: 40, textAlign: 'center' }}>Drop items here.</div>}
        {packed.map(k => <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700 }}><Icon name="check" size={20} />{k}</div>)}
      </div>
      {(err || won) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 5, display: 'grid', placeItems: 'center', background: 'rgba(242,241,236,.6)', padding: 16 }}>
          {err ? <Dialog title="pack_for_durban.exe" kind="error" heading={err.h} onClose={() => setErr(null)} actions={err.a.map((a, i) => <Button key={a} size="sm" variant={i === err.a.length - 1 ? 'primary' : 'secondary'} onClick={() => setErr(null)}>{a}</Button>)}>{err.b}</Dialog>
            : <Dialog title="pack_for_durban.exe" kind="success" heading="Packed. Vy." onClose={() => setPacked([])} actions={<><Button size="sm" onClick={onBack}>Back to Activities</Button><Button size="sm" variant="primary" onClick={() => setPacked([])}>Pack again</Button></>}>Baggies, sunscreen, slops, towel. Everything you actually need.</Dialog>}
        </div>
      )}
    </div>
  );
}

/* GAME-06 */
function TwoPmGame({ setScore, onBack }) {
  const { Button, Icon, AnswerOption } = gameNS;
  const [now, setNow] = React.useState(new Date());
  const [force, setForce] = React.useState(false);
  const [qs] = React.useState(() => [...window.LSD_DATA.exam].sort(() => Math.random() - 0.5).slice(0, 5));
  const [i, setI] = React.useState(0);
  const [pick, setPick] = React.useState(null);
  const [pts, setPts] = React.useState(0);
  React.useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const open = force || now.getHours() >= 14;
  React.useEffect(() => { setScore(open ? pts + '/5' : 'Locked'); }, [open, pts]);
  if (!open) {
    const t = new Date(now); t.setHours(14, 0, 0, 0); const s = Math.max(0, Math.floor((t - now) / 1000));
    const hms = [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map(n => String(n).padStart(2, '0')).join(':');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, textAlign: 'center' }}>
        <span style={{ width: 120, height: 120, display: 'grid', placeItems: 'center', border: '3px solid var(--ink)', background: 'var(--ink)', color: 'var(--yellow)', boxShadow: 'var(--shadow-hard)' }}><Icon name="lock" size={72} /></span>
        <h2 style={bigHead}>Come back after the beach.</h2>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(44px, 7vw, 80px)', lineHeight: 1 }}>{hms}</div>
        <p style={{ ...monoP, maxWidth: 480 }}>The 2pm Quiz opens at 14:00 sharp. Until then Gateway recommends sunscreen, a swim and a quarter mutton.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}><Button onClick={onBack}>Back to Activities</Button><Button variant="ghost" onClick={() => setForce(true)}>I’m already at the beach (open anyway)</Button></div>
      </div>
    );
  }
  if (i >= qs.length) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, textAlign: 'center' }}>
      <h2 style={bigHead}>{pts}/5.</h2>
      <p style={{ ...monoP, maxWidth: 480 }}>{pts === 5 ? 'Perfect. Go back to the beach, you’ve earned it.' : pts >= 3 ? 'Decent. The afternoon is young.' : 'The sun got to you. Try again tomorrow at 2.'}</p>
      <Button variant="primary" brackets onClick={onBack}>Back to Activities</Button>
    </div>
  );
  const q = qs[i];
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 26 }}>QUESTION {i + 1}/5</div>
      <div style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: 'clamp(26px, 3.4vw, 38px)', lineHeight: 1.1, textWrap: 'balance' }}>{q.q}</div>
      {q.a.map((a, k) => <AnswerOption key={k} letter={'abc'[k]} state={pick === null ? 'idle' : k === q.c ? 'correct' : k === pick ? 'wrong' : 'idle'} disabled={pick !== null} onClick={() => { setPick(k); if (k === q.c) setPts(pts + 1); }}>{a}</AnswerOption>)}
      {pick !== null && <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Button variant="primary" onClick={() => { setPick(null); setI(i + 1); }}>{i === 4 ? 'See score' : 'Next, bru'}</Button></div>}
    </div>
  );
}

function GameScreen({ id, onBack }) {
  const [score, setScore] = React.useState(null);
  const C = { 'game-01': SayGqomGame, 'game-02': SpotVaalieGame, 'game-03': JaNoLakaGame, 'game-04': DurdleGame, 'game-05': PackGame, 'game-06': TwoPmGame }[id];
  if (!C) return null;
  return <GameShell id={id} score={score} onBack={onBack}><C setScore={setScore} onBack={onBack} /></GameShell>;
}

Object.assign(window, { GameScreen, GAME_META });
