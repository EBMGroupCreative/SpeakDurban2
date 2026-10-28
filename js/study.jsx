const studyNS = window.LearnToSpeakDurbanDesignSystem_ec3271;

const STUDY_PACKS = [
  { id: 'PACK-01', open: 'dict', icon: 'book-open', name: 'The Dictionary', fmt: 'PDF · 32 entries', mb: 2.1, desc: 'Every lesson, every example line. Printable. Works at 10,000 metres.' },
  { id: 'PACK-02', open: 'dict', icon: 'headphone', name: 'Radio lessons', fmt: 'MP3 · 32 tracks', mb: 46.2, desc: 'Hear each word said properly. Recommended for the flight in.' },
  { id: 'PACK-03', open: 'flash', icon: 'card-text', name: 'Flashcards', fmt: 'PDF · 32 cards', mb: 1.4, desc: 'Cut along the dotted line. Test the person in seat 14B.' },
  { id: 'PACK-04', open: 'exam', icon: 'notes', name: 'Final exam, offline', fmt: 'App data', mb: 0.3, desc: 'Write the exam in flight mode. It hands itself in when you land.' },
  { id: 'PACK-05', open: 'act/game-03', icon: 'gamepad', name: 'Ja / No Laka', fmt: 'App data', mb: 0.8, desc: 'The true-false game, offline. No laka still means yes at altitude.' },
  { id: 'PACK-06', open: 'act/game-04', icon: 'calendar', name: 'Durdle, 30 days', fmt: 'App data', mb: 0.2, desc: 'A month of daily words, preloaded. No signal required.' },
];

function useDownloads() {
  const [prog, setProg] = React.useState(() => { try { return JSON.parse(localStorage.getItem('lsd-offline') || '{}'); } catch (e) { return {}; } });
  const timers = React.useRef({});
  React.useEffect(() => { localStorage.setItem('lsd-offline', JSON.stringify(Object.fromEntries(Object.entries(prog).filter(([, v]) => v >= 100)))); }, [prog]);
  React.useEffect(() => () => Object.values(timers.current).forEach(clearInterval), []);
  const start = id => {
    if (timers.current[id]) return;
    setProg(p => ({ ...p, [id]: 0 }));
    timers.current[id] = setInterval(() => {
      setProg(p => {
        const v = Math.min(100, (p[id] || 0) + 9 + Math.random() * 14);
        if (v >= 100) { clearInterval(timers.current[id]); delete timers.current[id]; }
        return { ...p, [id]: v };
      });
    }, 160);
  };
  const remove = id => setProg(p => { const n = { ...p }; delete n[id]; return n; });
  return { prog, start, remove };
}

function Study({ go }) {
  const { Window, Button, Icon, ProgressBar, StatusStrip } = studyNS;
  const { prog, start, remove } = useDownloads();
  const saved = STUDY_PACKS.filter(p => prog[p.id] >= 100);
  const busy = STUDY_PACKS.some(p => prog[p.id] !== undefined && prog[p.id] < 100);
  const total = STUDY_PACKS.reduce((s, p) => s + p.mb, 0);
  const savedMb = saved.reduce((s, p) => s + p.mb, 0);
  const all = saved.length === STUDY_PACKS.length;
  return (
    <div>
      <PageHead index="05" kicker="Self-study · works offline" title="Study Pack" right={<div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, maxWidth: 320, lineHeight: 1.5 }}>For when you're flying in. Download the course before take-off. The lessons work in flight mode. The ocean does not.</div>} />
      <Window title="flight_mode.exe" bar="accent" meta={all ? 'Ready' : saved.length + '/' + STUDY_PACKS.length + ' saved'} controls={['min', 'close']} shadow="lg" padding={0}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'center', justifyContent: 'space-between', padding: '26px 28px' }}>
          <div style={{ flex: '999 1 420px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 800, fontSize: 'clamp(30px, 3.4vw, 46px)', lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{all ? 'Ready for flight mode.' : 'Save the whole course for the flight.'}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, lineHeight: 1.5, color: 'var(--ink-2)' }}>{all ? `${savedMb.toFixed(1)} MB saved to this device. Lessons, games and the exam all work without signal. Press Open on any pack to start.` : `Six packs, ${total.toFixed(1)} MB. Everything you need to keep studying between Joburg and the coast.`}</div>
          </div>
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ProgressBar label="Saved for offline" value={Math.round(savedMb * 10) / 10} max={Math.round(total * 10) / 10} segments={16} showCount={false} />
            {all
              ? <Button block onClick={() => STUDY_PACKS.forEach(p => remove(p.id))}>Clear downloads</Button>
              : <Button variant="primary" size="lg" block brackets disabled={busy} onClick={() => STUDY_PACKS.forEach(p => prog[p.id] >= 100 || start(p.id))}>{busy ? 'Packing…' : 'Save everything'}</Button>}
          </div>
        </div>
      </Window>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24, marginTop: 40 }}>
        {STUDY_PACKS.map(p => {
          const v = prog[p.id];
          const done = v >= 100, going = v !== undefined && !done;
          return (
            <div key={p.id} style={{ display: 'flex', flexDirection: 'column', border: '2px solid var(--ink)', background: 'var(--paper-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '2px solid var(--ink)', fontFamily: 'var(--font-mono)', fontSize: 12 }}><b>{p.id}</b><span style={{ color: 'var(--ink-3)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{p.fmt}</span></div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '18px 14px', flex: 1 }}>
                <span style={{ flex: 'none', width: 56, height: 56, display: 'grid', placeItems: 'center', border: '2px solid var(--ink)', background: done ? 'var(--yellow)' : 'var(--bg-dots)' }}><Icon name={p.icon} size={32} /></span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 800, fontSize: 24, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>{p.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.5, color: 'var(--ink-2)', textWrap: 'pretty' }}>{p.desc}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 12px', borderTop: '2px solid var(--ink)', background: 'var(--paper-3)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}><span>SIZE</span><span>{p.mb.toFixed(1)} MB</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', minHeight: 58 }}>
                {going ? <ProgressBar value={Math.round(v)} max={100} segments={12} showCount={false} style={{ flex: 1 }} /> : done ? <>
                  <span style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="check" size={18} />Saved</span>
                  <Button size="sm" variant="ghost" onClick={() => remove(p.id)}>Remove</Button>
                  <Button size="sm" variant="primary" onClick={() => go && go(p.open)}>Open {'→'}</Button>
                </> : <Button size="sm" variant="primary" block onClick={() => start(p.id)}>↓ Download</Button>}
              </div>
            </div>
          );
        })}
      </div>
      <StatusStrip label="Cabin" items={['Seatbelt sign: on', 'Wi-Fi: optional', 'Fluency: continuing']} style={{ marginTop: 40 }} />
    </div>
  );
}

Object.assign(window, { Study, STUDY_PACKS });
