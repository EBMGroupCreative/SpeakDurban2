const dictNS = window.LearnToSpeakDurbanDesignSystem_ec3271;

function buildDrawer(words) {
  const sorted = [...words].sort((a, b) => a[1].replace(/^The /, 'T').localeCompare(b[1].replace(/^The /, 'T')));
  const rows = []; let cur = null;
  const counts = {};
  sorted.forEach(w => { const L = w[1].replace(/^The /, 'T')[0].toUpperCase(); counts[L] = (counts[L] || 0) + 1; });
  const cols = [40, 60, 26, 52, 34, 64];
  sorted.forEach((w, i) => {
    const L = w[1].replace(/^The /, 'T')[0].toUpperCase();
    if (L !== cur) { rows.push({ letter: L, count: String(counts[L]).padStart(3, '0'), offset: 4 + (rows.length % 3) * 6 }); cur = L; }
    rows.push({ w, offset: cols[i % cols.length] });
  });
  return rows;
}

function EntryCard({ w, playing, setPlaying }) {
  const { Button, RefCode, Barcode, ProgressBar, Icon } = dictNS;
  const [num, word, pos, def, ex] = w;
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex', gap: 40, padding: '9px 22px', marginBottom: -2, background: 'var(--yellow)', border: '2px solid var(--ink)', borderBottom: 'none', borderRadius: '8px 8px 0 0', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, position: 'relative' }}><span>{num}</span><span style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 600 }}>{word}</span></div>
      </div>
      <article style={{ background: 'var(--paper-2)', border: '2px solid var(--ink)', boxShadow: 'var(--shadow-hard-lg)', padding: '28px 32px 24px', display: 'flex', flexDirection: 'column', gap: 18, transform: 'rotate(-0.6deg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><RefCode prefix="" code={'LSD-' + num + ' · Entry ' + num + ' of 32'} /><RefCode code="LSD-2026" /></div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-grotesk)', fontWeight: 800, fontStretch: '88%', fontSize: 84, lineHeight: 0.9, letterSpacing: '-0.02em' }}>{word}</h2>
          <span style={{ fontFamily: 'var(--font-mono)', fontStyle: 'italic', fontSize: 18, color: 'var(--ink-2)' }}>{pos}</span>
        </div>
        <div style={{ height: 2, background: 'var(--ink)' }}></div>
        <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 17, lineHeight: 1.55, textWrap: 'pretty' }}>{def}</p>
        <div style={{ border: '1px solid var(--ink)' }}>
          <div style={{ padding: '5px 10px', background: 'var(--paper-3)', borderBottom: '1px solid var(--ink)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em' }}>EXAMPLE</div>
          <div style={{ padding: '12px 12px', fontFamily: 'var(--font-mono)', fontSize: 15, fontStyle: 'italic' }}>“{ex}”</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <Button variant={playing ? 'accent' : 'primary'} icon={<Icon name={playing ? 'volume-3' : 'play'} size={18} />} onClick={() => setPlaying(!playing)}>{playing ? 'On air — Radio lesson ' + num : 'Hear it'}</Button>
          <Barcode value={'LSD-' + num + word} width={130} height={30} />
        </div>
        {playing && <ProgressBar label={'Radio lesson ' + num + ' · ' + word} value={3} max={10} showCount={false} />}
      </article>
    </div>
  );
}

function Dictionary() {
  const { IndexTab } = dictNS;
  const words = window.LSD_DATA.words;
  const rows = React.useMemo(() => buildDrawer(words), []);
  const [open, setOpen] = React.useState('13');
  const [playing, setPlaying] = React.useState(false);
  const w = words.find(x => x[0] === open);
  return (
    <div>
      <PageHead index="01" kicker="Reference · do not remove from the drawer" title="The Dictionary" right={<div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, maxWidth: 300, lineHeight: 1.5, textAlign: 'right' }}>Filed alphabetically. Numbered by lesson. Dusted weekly. Pull any card to read the full entry.</div>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))', gap: 56, alignItems: 'start' }}>
        <div>
          <div style={{ background: 'var(--paper-3)', border: '2px solid var(--ink)', borderBottom: 'none', padding: '18px 14px 0' }}>
            {rows.map((r, i) => (
              <div key={i} style={{ marginTop: i ? -14 : 0, padding: `0 ${Math.max(0, (rows.length - i) * 0.35)}px`, position: 'relative', zIndex: i }}>
                {r.letter
                  ? <IndexTab letter={r.letter} count={r.count} offset={r.offset} tabWidth="28%" />
                  : <IndexTab number={r.w[0]} word={r.w[1]} offset={r.offset} tabWidth="34%" active={r.w[0] === open} onClick={() => { setOpen(r.w[0]); setPlaying(false); }} />}
              </div>
            ))}
            <div style={{ height: 22, background: 'var(--paper-2)', borderTop: '1.5px solid var(--ink)', margin: '0 -14px' }}></div>
          </div>
          <div style={{ position: 'relative', height: 110, border: '2px solid var(--ink)', background: 'var(--paper-2)', boxShadow: 'var(--shadow-hard)', display: 'grid', placeItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: 20, fontWeight: 500, background: 'var(--yellow)', border: '1.5px solid var(--ink)', borderRadius: 6, padding: '6px 22px' }}>the whole language, filed.</span>
            <span style={{ position: 'absolute', left: 12, bottom: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)' }}>DRAWER 01 / 01 · LSD-01 – LSD-32 · SAND INSIDE: LIKELY</span>
          </div>
        </div>
        <div style={{ position: 'sticky', top: 140 }}>
          <EntryCard w={w} playing={playing} setPlaying={setPlaying} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Dictionary });
