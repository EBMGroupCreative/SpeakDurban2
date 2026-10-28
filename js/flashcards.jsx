const flashNS = window.LearnToSpeakDurbanDesignSystem_ec3271;

function Flashcards() {
  const { Button, RefCode, Barcode, ProgressBar, StatusStrip, Icon } = flashNS;
  const all = window.LSD_DATA.words;
  const [order, setOrder] = React.useState(() => all.map((_, i) => i));
  const [pos, setPos] = React.useState(0);
  const [flip, setFlip] = React.useState(false);
  const [known, setKnown] = React.useState(() => { try { return JSON.parse(localStorage.getItem('lsd-flash') || '[]'); } catch (e) { return []; } });
  const [onlyNew, setOnlyNew] = React.useState(false);
  React.useEffect(() => { localStorage.setItem('lsd-flash', JSON.stringify(known)); }, [known]);
  const deck = onlyNew ? order.filter(i => !known.includes(all[i][0])) : order;
  const idx = deck.length ? deck[Math.min(pos, deck.length - 1)] : null;
  const w = idx !== null ? all[idx] : null;
  const go = d => { setFlip(false); setTimeout(() => setPos(p => (p + d + deck.length) % deck.length), flip ? 120 : 0); };
  const mark = got => {
    if (!w) return;
    setKnown(k => got ? (k.includes(w[0]) ? k : [...k, w[0]]) : k.filter(x => x !== w[0]));
    if (onlyNew && got) { setFlip(false); setPos(p => Math.min(p, Math.max(0, deck.length - 2))); } else go(1);
  };
  const shuffle = () => { const o = [...order]; for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; } setOrder(o); setPos(0); setFlip(false); };
  React.useEffect(() => {
    const f = e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === ' ') { e.preventDefault(); setFlip(x => !x); }
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    addEventListener('keydown', f); return () => removeEventListener('keydown', f);
  });
  const face = { position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', background: 'var(--paper-2)', border: '2px solid var(--ink)', display: 'flex', flexDirection: 'column', padding: '22px 28px' };
  const allDone = known.length === all.length;
  return (
    <div>
      <PageHead index="07" kicker="Revision · one card at a time" title="Flashcards" right={<div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, maxWidth: 320, lineHeight: 1.5 }}>Read the word. Guess the meaning. Flip the card. Be honest with yourself. The Institute is.</div>} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'flex-start' }}>
        <div style={{ flex: '999 1 560px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {w ? <>
            <div onClick={() => setFlip(!flip)} style={{ position: 'relative', height: 440, perspective: 1600, cursor: 'pointer' }} role="button" aria-label="Flip card">
              <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transition: 'transform 420ms var(--ease-out)', transform: flip ? 'rotateY(180deg)' : 'none', boxShadow: 'var(--shadow-hard-lg)' }}>
                <div style={face}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><RefCode prefix="" code={'LSD-' + w[0] + ' · Card ' + (deck.indexOf(idx) + 1) + ' of ' + deck.length} /><RefCode code="LSD-2026" /></div>
                  <div style={{ flex: 1, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 28 }}>{w[0]}</span>
                      <span style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 800, fontSize: 'clamp(64px, 9vw, 120px)', lineHeight: 0.9, letterSpacing: '-0.02em' }}>{w[1]}</span>
                      {known.includes(w[0]) && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', background: 'var(--yellow)', border: '2px solid var(--ink)', padding: '3px 8px' }}>FILED AS KNOWN</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}><span>Tap or press space to flip</span><Barcode value={'FLASH' + w[0]} width={100} height={24} /></div>
                </div>
                <div style={{ ...face, transform: 'rotateY(180deg)', gap: 16, background: 'var(--paper-2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><RefCode prefix="" code={'LSD-' + w[0] + ' · Reverse'} /><RefCode code="LSD-2026" /></div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 800, fontSize: 52, lineHeight: 0.95 }}>{w[1]}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontStyle: 'italic', fontSize: 16, color: 'var(--ink-2)' }}>{w[2]}</span>
                  </div>
                  <div style={{ height: 2, background: 'var(--ink)' }}></div>
                  <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 17, lineHeight: 1.55, textWrap: 'pretty' }}>{w[3]}</p>
                  <div style={{ marginTop: 'auto', border: '1px solid var(--ink)' }}>
                    <div style={{ padding: '5px 10px', background: 'var(--paper-3)', borderBottom: '1px solid var(--ink)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em' }}>EXAMPLE</div>
                    <div style={{ padding: 12, fontFamily: 'var(--font-mono)', fontSize: 15, fontStyle: 'italic' }}>“{w[4]}”</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' }}>
              <Button onClick={() => go(-1)} icon={<Icon name="arrow-left" size={18} />}>Back</Button>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Button onClick={() => mark(false)}>Eish, again</Button>
                <Button variant="primary" onClick={() => mark(true)}>Got it, shap</Button>
              </div>
              <Button onClick={() => go(1)}>Next <Icon name="arrow-right" size={18} /></Button>
            </div>
          </> : (
            <div style={{ height: 440, border: '2px solid var(--ink)', background: 'var(--yellow)', boxShadow: 'var(--shadow-hard-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 28 }}>
              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 40 }}>32/32</span>
              <span style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 800, fontSize: 56, lineHeight: 0.9, textTransform: 'uppercase' }}>Deck cleared.</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, maxWidth: 420 }}>Every card filed as known. The Final Exam is expecting you. So is the ocean.</span>
              <Button variant="primary" onClick={() => { setOnlyNew(false); setPos(0); }}>Review the full deck</Button>
            </div>
          )}
        </div>
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <ProgressBar label="Filed as known" value={known.length} max={all.length} segments={16} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4 }}>
            {all.map((x, i) => {
              const on = w && x[0] === w[0], k = known.includes(x[0]);
              return <button key={x[0]} type="button" title={x[1]} onClick={() => { if (onlyNew && k) setOnlyNew(false); const d = (onlyNew && !k) ? deck : order; setPos(d.indexOf(i)); setFlip(false); }}
                style={{ height: 32, border: '2px solid var(--ink)', background: on ? 'var(--yellow)' : k ? 'var(--ink)' : 'var(--paper-2)', color: k && !on ? 'var(--paper-2)' : 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, cursor: 'pointer', padding: 0 }}>{x[0]}</button>;
            })}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button block onClick={shuffle}>Shuffle the deck</Button>
            <Button block variant={onlyNew ? 'primary' : 'secondary'} onClick={() => { setOnlyNew(!onlyNew); setPos(0); setFlip(false); }}>{onlyNew ? 'Showing: still learning' : 'Only the ones I don\u2019t know'}</Button>
            {known.length > 0 && <Button block variant="ghost" onClick={() => setKnown([])}>Forget everything (start over)</Button>}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.5, color: 'var(--ink-2)' }}>{allDone ? 'All 32 filed. You are, technically, fluent.' : 'Black = filed as known. Orange = on the desk. Keys: space flips, arrows move.'}</div>
        </div>
      </div>
      <StatusStrip label="Deck" items={['32 cards', 'Known: ' + known.length, 'Works offline', 'Cheating: impossible, you only cheat yourself']} style={{ marginTop: 40 }} />
    </div>
  );
}

Object.assign(window, { Flashcards });
