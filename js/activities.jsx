const actNS = window.LearnToSpeakDurbanDesignSystem_ec3271;

function ClickOMeter() {
  const [v, setV] = React.useState(0.62);
  const stops = ['VAALIE', 'KOOK', 'LAATIE', 'BRU', 'FLUENT'];
  return (
    <div onClick={() => setV(Math.random())} style={{ width: '78%', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 6 }}><actNS.Icon name="headphone" size={32} /><span style={{ fontFamily: 'var(--font-pixel)', fontSize: 18 }}>"GQ-!"</span></div>
      <div style={{ position: 'relative', height: 22, border: '2px solid var(--ink)', background: 'var(--paper-2)', display: 'flex' }}>
        {stops.map((s, i) => <span key={s} style={{ flex: 1, borderLeft: i ? '1px solid var(--ink)' : 'none', background: i / stops.length < v ? 'var(--ink)' : 'transparent' }}></span>)}
        <span style={{ position: 'absolute', top: -8, left: `calc(${v * 100}% - 1px)`, width: 3, height: 34, background: 'var(--yellow)', outline: '1px solid var(--ink)', transition: 'left 200ms var(--ease-out)' }}></span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.04em', gap: 4 }}>{stops.map(s => <span key={s}>{s}</span>)}</div>
    </div>
  );
}

function SpotVaalie() {
  const marks = [[22, 40, 'flame shirt'], [64, 70, 'socks + slops'], [78, 28, 'gazebo']];
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <actNS.Halftone height="100%" dot={5} placeholder="beach" />
      {marks.map(([x, y, l]) => (
        <div key={l} style={{ position: 'absolute', left: x + '%', top: y + '%', transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 38, height: 38, borderRadius: '50%', border: '2px dashed var(--ink)', background: 'rgba(255,90,46,.25)' }}></span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, background: 'var(--paper-2)', border: '1px solid var(--ink)', padding: '1px 4px', whiteSpace: 'nowrap' }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

function JaNoLaka() {
  const { Button } = actNS;
  const [s, setS] = React.useState(3);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '80%' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, textAlign: 'center', background: 'var(--paper-2)', border: '2px solid var(--ink)', padding: '10px 14px' }}>A robot is a traffic light.</div>
      <div style={{ display: 'flex', gap: 10 }}><Button variant="primary" onClick={() => setS(s + 1)}>NO LAKA</Button><Button onClick={() => setS(Math.max(0, s - 1))}>EISH, NO</Button></div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>Score: {s} soft-serves</div>
    </div>
  );
}

function DurdleGrid() {
  const rows = [['K', 'O', 'O', 'K', ''], ['S', 'H', 'A', 'P', ''], ['', '', '', '', ''], ['', '', '', '', '']];
  const hit = { '0-0': 'y', '1-0': 'i', '1-1': 'i' };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 32px)', gap: 5 }}>
      {rows.flatMap((r, ri) => r.map((c, ci) => {
        const h = hit[ri + '-' + ci];
        return <span key={ri + '-' + ci} style={{ width: 32, height: 32, display: 'grid', placeItems: 'center', border: '2px solid var(--ink)', background: h === 'y' ? 'var(--yellow)' : h === 'i' ? 'var(--ink)' : 'var(--paper-2)', color: h === 'i' ? 'var(--paper-2)' : 'var(--ink)', fontFamily: 'var(--font-pixel)', fontSize: 16 }}>{c}</span>;
      }))}
    </div>
  );
}

function PackForDurban({ onBad }) {
  const items = [['Baggies', true], ['Sunscreen', true], ['Wetsuit', false], ['Fork', false]];
  const [packed, setPacked] = React.useState(['Baggies']);
  const add = (n, ok) => { if (!ok) return onBad(n); if (!packed.includes(n)) setPacked([...packed, n]); };
  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map(([n, ok]) => <button key={n} onClick={() => add(n, ok)} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, border: '2px solid var(--ink)', background: packed.includes(n) ? 'var(--paper-3)' : 'var(--paper-2)', padding: '4px 8px', cursor: 'grab', textAlign: 'left', textDecoration: packed.includes(n) ? 'line-through' : 'none' }}>{n}</button>)}
      </div>
      <actNS.Icon name="arrow-right" size={20} />
      <div style={{ width: 110, height: 96, border: '2px solid var(--ink)', background: 'var(--paper-2)', position: 'relative', padding: '18px 8px 6px', display: 'flex', flexDirection: 'column', gap: 2, fontFamily: 'var(--font-mono)', fontSize: 10 }}>
        <span style={{ position: 'absolute', top: -10, left: 34, width: 40, height: 10, border: '2px solid var(--ink)', borderBottom: 'none' }}></span>
        {packed.map(p => <span key={p}>✓ {p}</span>)}
      </div>
    </div>
  );
}

function Leaderboard() {
  const { Window, Icon } = actNS;
  return (
    <Window title="top_students.txt" meta="Live" controls={['min', 'close']} shadow="md" padding={0}>
      <div style={{ padding: '14px 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}><Icon name="trophy" size={24} /><span style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 800, fontStretch: '88%', fontSize: 26, textTransform: 'uppercase' }}>Top Students</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto auto', columnGap: 12, fontFamily: 'var(--font-mono)', fontSize: 13 }}>
        {['#', 'Student', 'Exam', 'Games'].map(h => <span key={h} style={{ padding: '6px 0', borderTop: '1px solid var(--ink)', borderBottom: '1px solid var(--ink)', background: 'var(--paper-3)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: h === '#' ? 16 : 0, paddingRight: h === 'Games' ? 16 : 0 }}>{h}</span>)}
        {window.LSD_DATA.leaderboard.map(([n, e, g], i) => (
          <React.Fragment key={n}>
            <span style={{ padding: '9px 0 9px 16px', borderBottom: '1px dashed var(--paper-4)', fontWeight: 700 }}>{i + 1}</span>
            <span style={{ padding: '9px 0', borderBottom: '1px dashed var(--paper-4)' }}>{i === 0 ? <span style={{ background: 'var(--yellow)', padding: '0 4px' }}>{n}</span> : n}</span>
            <span style={{ padding: '9px 0', borderBottom: '1px dashed var(--paper-4)' }}>{e}</span>
            <span style={{ padding: '9px 16px 9px 0', borderBottom: '1px dashed var(--paper-4)', textAlign: 'right' }}>{g}</span>
          </React.Fragment>
        ))}
      </div>
      <div style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>Updated after every exam. Forks disqualify. Sand in the keyboard is fine.</div>
    </Window>
  );
}

function Activities({ initialError = 'Wetsuit', game }) {
  const openGame = ref => { location.hash = 'act/' + ref.toLowerCase(); };
  const { SpecCard, Button, Dialog, Icon } = actNS;
  const [err, setErr] = React.useState(initialError);
  const games = [
    { ref: 'GAME-01', label: 'Say Gqom', tag: 'MIC', src: 'Mic-based pronunciation test. The click-o-meter rates your gqom click from VAALIE to FLUENT.', body: <ClickOMeter /> },
    { ref: 'GAME-02', label: 'Spot the Vaalie', tag: '3 TO FIND', src: 'Find the details in the beach scene: flame shirt, socks with slops, gazebo with cup holders.', body: <SpotVaalie />, nox: true },
    { ref: 'GAME-03', label: 'Ja / No Laka', tag: '60 SEC', src: 'Rapid true-false. Agree? NO LAKA (it means yes, keep up). Disagree? EISH, NO. Score counted in soft-serves.', body: <JaNoLaka /> },
    { ref: 'GAME-04', label: 'Durdle', tag: 'DAILY', src: 'Daily Durban-slang word game. Six tries. Today\u2019s word is in the Dictionary. So is tomorrow\u2019s. Hint hint.', body: <DurdleGrid /> },
    { ref: 'GAME-05', label: 'Pack for Durban', tag: 'DRAG', src: 'Drag the essentials to the suitcase. The system will tell you if you are wrong. Loudly.', body: <PackForDurban onBad={setErr} /> },
    { ref: 'GAME-06', label: 'The 2pm Quiz', tag: 'LOCKED', src: 'Locked before 2pm. Come back after the beach.', locked: true, body: <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: 0.9 }}><Icon name="lock" size={48} /><span style={{ fontFamily: 'var(--font-pixel)', fontSize: 22 }}>14:00</span><span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>Come back after the beach.</span></div> },
  ];
  return (
    <div>
      <PageHead index="02" kicker="Practical study · six games" title="Activities" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 640px), 1fr))', gap: 40, alignItems: 'start' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 28, position: 'relative' }}>
          {games.map(g => (
            <SpecCard key={g.ref} refCode={g.ref} meta={g.locked ? 'Opens 14:00' : 'Play'} label={g.label} chipVariant={g.locked ? 'inverse' : 'outline'} crosshair={!g.nox} previewHeight={230} sourceLabel="SOURCE" sourceTag={g.tag} source={g.src} interactive onClick={() => openGame(g.ref)}
              footer={<><span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>{g.locked ? 'Status: sunbathing' : 'Best: 9 soft-serves'}</span><Button size="sm" variant={g.locked ? 'secondary' : 'primary'} onClick={e => { e.stopPropagation(); openGame(g.ref); }}>{g.locked ? 'Peek' : 'Play full screen'}</Button></>}><div style={{ pointerEvents: 'none', position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>{g.body}</div></SpecCard>
          ))}
          {err && (
            <div style={{ position: 'absolute', left: '30%', top: '58%', zIndex: 5 }}>
              <Dialog title="pack_for_durban.exe" kind="error" heading={err === 'Fork' ? 'ABSOLUTELY NOT' : '\u26A0 Error: wetsuit detected.'} width={400} onClose={() => setErr(null)}
                actions={err === 'Fork' ? <Button size="sm" variant="primary" onClick={() => setErr(null)}>Remove fork</Button> : <><Button size="sm" onClick={() => setErr(null)}>OK</Button><Button size="sm" variant="primary" onClick={() => setErr(null)}>OK, bru</Button></>}>
                {err === 'Fork' ? 'Forks are not permitted within 50km of a bunny.' : 'Baggies required.'}
              </Dialog>
            </div>
          )}
        </div>
        <div style={{ position: 'sticky', top: 140, maxWidth: 460 }}><Leaderboard /></div>
      </div>
      {game && <GameScreen id={game} onBack={() => { location.hash = 'act'; }} />}
    </div>
  );
}

Object.assign(window, { Activities });
