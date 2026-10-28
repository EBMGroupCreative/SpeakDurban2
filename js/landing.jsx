const landNS = window.LearnToSpeakDurbanDesignSystem_ec3271;

function HeroCard({ go, mobile }) {
  const { Button, Barcode, RefCode } = landNS;
  return (
    <section style={{ position: 'relative', background: 'var(--paper-2)', border: '2px solid var(--ink)', boxShadow: mobile ? 'var(--shadow-hard)' : '10px 10px 0 var(--ink)', padding: mobile ? '36px 20px 24px' : '56px 56px 48px', display: 'flex', flexWrap: 'wrap', gap: mobile ? 28 : 48 }}>
      <RefCode code="LSD-2026" style={{ position: 'absolute', top: 10, left: 12 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: mobile ? 20 : 28, minWidth: 0, flex: '1 1 560px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: mobile ? 11 : 13, letterSpacing: '0.16em', textTransform: 'uppercase' }}>A public service by Gateway</div>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-grotesk)', fontWeight: 800, fontStretch: '88%', fontSize: mobile ? 62 : 'clamp(56px, 8.6vw, 140px)', lineHeight: 0.84, letterSpacing: '-0.025em', textTransform: 'uppercase' }}>Learn to<br />Speak <span style={{ fontFamily: 'var(--font-pixel)', fontWeight: 400, fontStretch: '100%', fontSize: '0.86em', letterSpacing: '-0.04em', background: 'var(--yellow)', padding: '0 0.06em' }}>Durban</span></h1>
        <div style={{ height: 2, background: 'var(--ink)' }}></div>
        <p style={{ margin: 0, maxWidth: 560, fontFamily: 'var(--font-mono)', fontSize: mobile ? 14 : 16, lineHeight: 1.55, textWrap: 'pretty' }}>32 lessons of real Durban slang. A final exam you can write right here. A certificate of fluency with your name on it — redeemable at Gateway, Durban.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button variant="primary" size="lg" brackets onClick={() => go('dict')}>Begin Lesson 1</Button>
          <Button size="lg" onClick={() => go('exam')}>Skip to exam (brave)</Button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: mobile ? 'column-reverse' : 'column', justifyContent: 'space-between', gap: 24, flex: mobile ? '1 1 100%' : '0 1 340px', minWidth: mobile ? 0 : 280, borderLeft: mobile ? 'none' : '2px solid var(--ink)', paddingLeft: mobile ? 0 : 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: mobile ? 'flex-start' : 'flex-end', gap: 6 }}>
          <Barcode value="LSD-2026-DBN" width={mobile ? 200 : 300} height={mobile ? 44 : 72} />
          <RefCode prefix="" code="Course No. 4001 · Coastal dialect · Humidity: 87%" />
        </div>
        <div style={{ border: '2px solid var(--ink)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 12px', background: 'var(--paper-3)', borderBottom: '1px solid var(--ink)', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em' }}><span>ENROLMENT</span><span>OPEN</span></div>
          <div style={{ padding: '14px 12px', fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, lineHeight: 1.45 }}>Course fee: free.<br />Fluency: guaranteed-ish.</div>
        </div>
      </div>
      {!mobile && <div style={{ position: 'absolute', right: 10, bottom: 10, width: 28, height: 28, borderRight: '2px solid var(--ink)', borderBottom: '2px solid var(--ink)' }}></div>}
    </section>
  );
}

function Landing({ go, mobile }) {
  const { FolderCard, StatusStrip } = landNS;
  const sections = [
    { id: 'dict', index: '01', title: 'The Dictionary', description: '32 words, filed by an intern who has since gone surfing. Pull a card. Hear it on the radio.', meta: '32 entries' },
    { id: 'act', index: '02', title: 'Activities', description: 'Six games for practical study. Some require a microphone. One requires 2pm.', meta: '6 games' },
    { id: 'merch', index: '03', title: 'Merch', description: 'Course materials. Mostly tees. One cooler box, metaphorically.', meta: '8 items' },
    { id: 'submit', index: '04', title: 'Submit a Word', description: 'Heard a word at the taxi rank we don’t know? Report it. Gateway will investigate.', meta: 'Open to the public' },
    { id: 'study', index: '05', title: 'Study Pack', description: 'Download the course before take-off. Study at 10,000 metres. Practise on seat 14B.', meta: 'Works offline' },
    { id: 'card', index: '06', title: 'Student Card', description: 'Upload a selfie. Gateway pixelates it. Your ex sees it on your story.', meta: '1080 × 1920' },
    { id: 'flash', index: '07', title: 'Flashcards', description: 'All 32 words on flip cards. Guess, flip, file as known. Honesty encouraged.', meta: '32 cards' },
    { id: 'exam', index: '08', title: 'The Final Exam', description: '32 questions, one per lesson. Pass and the certificate prints itself. Fail and the ocean waits.', meta: '32 questions' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: mobile ? 36 : 56, paddingTop: mobile ? 20 : 48 }}>
      <HeroCard go={go} mobile={mobile} />
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fill, minmax(270px, 1fr))', gap: mobile ? 22 : 24 }}>
        {sections.map((s, i) => <FolderCard key={s.id} {...s} active={!mobile && i === 1 ? undefined : undefined} tabOffset={mobile ? 0 : [0, 24, 48, 12, 36, 60, 18, 42][i]} onClick={() => go(s.id)} />)}
      </div>
      <StatusStrip items={['Current ocean temperature: 24°C', 'Lessons: 32', 'Forks required: 0']} />
    </div>
  );
}

Object.assign(window, { Landing, HeroCard });
