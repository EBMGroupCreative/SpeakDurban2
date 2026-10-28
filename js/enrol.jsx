const enrolNS = window.LearnToSpeakDurbanDesignSystem_ec3271;

function EnrolTease({ mobile }) {
  const { Icon, RefCode, Button } = enrolNS;
  const toForm = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => { const el = document.querySelector('input[autocomplete="given-name"]'); if (el) el.focus({ preventScroll: true }); }, 400); };
  const items = [
    ['01', 'The Dictionary', '32 words on index cards, each with a radio lesson.', 'B——y  n.  A quarter loaf of █████, hollowed and ██████ with curry.'],
    ['02', 'Activities', 'Six games, from Say Gqom to Spot the Vaalie, plus the leaderboard.', 'GAME-01 … GAME-06  ·  TOP STUDENTS: ████████'],
    ['03', 'Merch', 'Course materials. Mostly tees. One cooler box.', 'MERCH-01  ████.  Tee  ·  R ███'],
    ['04', 'Submit a Word', 'Know one we missed? File it with Gateway.', 'FORM W-05  ·  Review: 4 steps'],
    ['05', 'Study Pack', 'Download the course for the flight. Works offline.', 'PACK-01 … PACK-06  ·  51.0 MB'],
    ['06', 'Student Card', 'Upload a selfie. Get pixelated. Post it to your story.', 'STUDENT: █████  ·  FORKS ON PERSON: 0'],
    ['07', 'Flashcards', 'All 32 words on flip cards. Guess, flip, file as known.', 'LSD-13  ·  FRONT: B████  ·  BACK: ███████'],
    ['08', 'The Final Exam', '32 questions. Pass and your Certificate of Fluency prints itself.', 'Q13/32  The bunny arrives with a ████ █████. You:'],
  ];
  return (
    <section style={{ marginTop: mobile ? 44 : 72 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, marginBottom: 26 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Enrolment unlocks</div>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-grotesk)', fontWeight: 800, fontSize: mobile ? 40 : 'clamp(44px, 5vw, 72px)', lineHeight: 0.9, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>Eight files.<br />Currently locked.</h2>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.5, maxWidth: 340 }}>Everything below opens the moment you enrol. Contents partially redacted by Gateway’s legal team (one guy, Dave).</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: 22 }}>
        {items.map(([n, t, d, peek], i) => (
          <button key={n} type="button" onClick={toForm} style={{ all: 'unset', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', paddingLeft: [0, 24, 48, 12, 36, 60, 18, 42][i] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '7px 14px', marginBottom: -2, border: '2px solid var(--ink)', borderBottom: 'none', borderRadius: '6px 6px 0 0', background: 'var(--paper-2)', fontFamily: 'var(--font-mono)', fontSize: 12, position: 'relative' }}><b>{n}</b><span style={{ textTransform: 'lowercase' }}>{t}</span></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '18px 18px 14px', border: '2px solid var(--ink)', background: 'var(--paper-2)', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 800, fontSize: 28, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>{t}</div>
                <span style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 6, padding: '3px 8px 3px 4px', background: 'var(--ink)', color: 'var(--paper-2)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em' }}><Icon name="lock" size={16} />LOCKED</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.5, color: 'var(--ink-2)', textWrap: 'pretty' }}>{d}</div>
              <div style={{ marginTop: 'auto', padding: '10px 10px', border: '1px dashed var(--ink-3)', background: 'var(--bg-dots)', fontFamily: 'var(--font-mono)', fontSize: 12, whiteSpace: 'pre-wrap', overflow: 'hidden', color: 'var(--ink-2)' }}>{peek}</div>
            </div>
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', marginTop: 28, padding: '16px 18px', border: '2px solid var(--ink)', background: 'var(--yellow)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700 }}>Eight files. One form. Course fee: free.</span>
        <Button variant="primary" brackets onClick={toForm}>Unlock the course</Button>
      </div>
    </section>
  );
}

function Enrol({ onDone, mobile, initial }) {
  const { Window, Button, Barcode, RefCode, Dialog, StatusStrip } = enrolNS;
  const [f, setF] = React.useState({ name: '', email: '', consent: false, promise: false });
  const [err, setErr] = React.useState({});
  const [done, setDone] = React.useState(initial === 'done' ? { no: 'LSD-2026-04417', name: 'Thandi' } : null);
  const set = k => v => { setF({ ...f, [k]: v }); if (err[k]) setErr({ ...err, [k]: null }); };
  const submit = e => {
    e.preventDefault();
    const x = {};
    if (!f.name.trim()) x.name = 'Gateway needs this';
    if (!isEmail(f.email)) x.email = f.email ? 'That looks like a vaalie typed it' : 'Gateway needs this';
    if (!f.consent) x.consent = 'Tick it. It is free, bru';
    setErr(x);
    if (Object.keys(x).length) return;
    const no = 'LSD-2026-' + String(Math.floor(10000 + Math.random() * 89999));
    // Mock capture. In production, POST { name, email, consent, source: 'lsd-enrol' } to the CRM here.
    localStorage.setItem('lsd-enrolled', '1');
    localStorage.setItem('lsd-name', f.name.trim());
    localStorage.setItem('lsd-email', f.email.trim());
    localStorage.setItem('lsd-student', no);
    setDone({ no, name: f.name.trim() });
  };
  const rows = [['Lessons', '32 · real Durban slang'], ['Final exam', '32 questions · written on site'], ['Games', '6 · plus the leaderboard'], ['Study Pack', 'Download for the flight · works offline'], ['Certificate', 'Your name on it · redeemable at Gateway, Durban'], ['Course fee', 'Free']];
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ maxWidth: 'var(--page-max)', width: '100%', margin: '0 auto', padding: mobile ? '14px 16px' : '20px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, borderBottom: '2px solid var(--ink)' }}>
        <span style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 800, fontSize: mobile ? 16 : 20, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Learn to Speak Durban</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 8, height: 8, background: 'var(--yellow)', border: '1px solid var(--ink)' }}></span>Enrolment desk · open</span>
      </header>
      <main style={{ flex: 1, maxWidth: 'var(--page-max)', width: '100%', margin: '0 auto', padding: mobile ? '28px 16px 0' : '64px 64px 0' }}>
        <section style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: mobile ? 28 : 56, alignItems: 'flex-start', background: 'var(--paper-2)', border: '2px solid var(--ink)', boxShadow: mobile ? 'var(--shadow-hard)' : 'var(--shadow-hard-lg)', padding: mobile ? '36px 18px 22px' : '56px 56px 48px' }}>
          <RefCode code="LSD-2026 · FORM E-01" style={{ position: 'absolute', top: 10, left: 12 }} />
          {!mobile && <Barcode value="LSD-ENROL" width={160} height={36} style={{ position: 'absolute', top: 14, right: 16 }} />}
          <div style={{ flex: '999 1 480px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: mobile ? 18 : 26 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: mobile ? 11 : 13, letterSpacing: '0.16em', textTransform: 'uppercase' }}>A public service by Gateway</div>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-grotesk)', fontWeight: 800, fontSize: mobile ? 54 : 'clamp(56px, 7.6vw, 124px)', lineHeight: 0.86, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>Learn to<br />Speak <span style={{ fontFamily: 'var(--font-pixel)', fontWeight: 400, fontSize: '0.86em', letterSpacing: '-0.02em', background: 'var(--yellow)', padding: '0 0.06em' }}>Durban</span></h1>
            <p style={{ margin: 0, maxWidth: 540, fontFamily: 'var(--font-mono)', fontSize: mobile ? 14 : 16, lineHeight: 1.55, textWrap: 'pretty' }}>The course the whole country is passing happily. Enrol to open all 32 lessons, write the final exam and receive your Certificate of Fluency.</p>
            <div style={{ border: '2px solid var(--ink)', maxWidth: 560 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 12px', background: 'var(--paper-3)', borderBottom: '1px solid var(--ink)', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em' }}><span>ENROLMENT INCLUDES</span><span>2026 INTAKE</span></div>
              {rows.map(([k, v], i) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: mobile ? '96px 1fr' : '130px 1fr', gap: 12, padding: '9px 12px', borderTop: i ? '1px dashed var(--ink-3)' : 'none', fontFamily: 'var(--font-mono)', fontSize: 13 }}><span style={{ color: 'var(--ink-3)', textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.06em', paddingTop: 2 }}>{k}</span><span>{v}</span></div>
              ))}
            </div>
          </div>
          <div style={{ flex: '1 1 360px', minWidth: 0, maxWidth: mobile ? undefined : 460 }}>
            <Window title="enrolment_form.exe" bar="accent" meta="Step 1 of 1" controls={['close']} shadow="md" padding={0}>
              <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: mobile ? 16 : 22 }}>
                <Field label="First name" value={f.name} onChange={set('name')} placeholder="Your actual name. Not “Bru”." autoComplete="given-name" error={err.name} />
                <Field label="Email address" type="email" value={f.email} onChange={set('email')} placeholder="you@example.co.za" autoComplete="email" error={err.email} />
                <Tick checked={f.consent} onChange={set('consent')} error={err.consent}>Send me lessons, exam reminders and Gateway rewards. Unsubscribe any time — no hard feelings, bru.</Tick>
                <Tick checked={f.promise} onChange={set('promise')}>I promise not to bring a wetsuit. (Optional, but noted.)</Tick>
                <Button type="submit" variant="primary" size="lg" block brackets>Enrol, bru</Button>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.5, color: 'var(--ink-3)' }}>Your details are handled by Gateway in line with its <a href="#" style={{ color: 'var(--ink)' }}>privacy policy</a>. One enrolment per student. Clones must enrol separately.</div>
              </form>
            </Window>
            <button type="button" onClick={() => onDone('home')} style={{ all: 'unset', cursor: 'pointer', display: 'block', marginTop: 16, fontFamily: 'var(--font-mono)', fontSize: 12, textDecoration: 'underline', textUnderlineOffset: 4 }}>Already enrolled? Go to the course (we trust you)</button>
          </div>
        </section>
        <EnrolTease mobile={mobile} />
        <StatusStrip label="Intake" items={['Students enrolled today: 1,204', 'Forks confiscated: 37', 'Course fee: free', 'Fluency: guaranteed-ish']} style={{ marginTop: mobile ? 28 : 40 }} />
      </main>
      <Footer mobile={mobile} />
      {done && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40, display: 'grid', placeItems: 'center', padding: 16, background: 'rgba(242,241,236,.6)' }}>
          <Dialog title="enrolment.exe" kind="success" heading="Enrolment confirmed." width={mobile ? '100%' : 440} onClose={() => onDone('home')}
            actions={<><Button size="sm" onClick={() => onDone('home')}>Go to the index</Button><Button size="sm" variant="primary" onClick={() => onDone('dict')}>Begin Lesson 1</Button></>}>
            Welcome to the coast, {done.name}. Student no. <b>{done.no}</b>. Your first lesson is on its way to your inbox. Check spam. Gateway is new at email.
          </Dialog>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Enrol });
