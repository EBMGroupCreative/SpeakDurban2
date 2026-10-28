const subNS = window.LearnToSpeakDurbanDesignSystem_ec3271;

function SubmitWord({ initial, mobile }) {
  const { Window, Button, Stamp, RefCode } = subNS;
  const blank = { word: '', meaning: '', example: '', where: '', name: localStorage.getItem('lsd-name') || '', email: localStorage.getItem('lsd-email') || '', real: false };
  const [f, setF] = React.useState(blank);
  const [err, setErr] = React.useState({});
  const [done, setDone] = React.useState(initial === 'done' ? { ref: 'LSD-SUB-0388', word: 'your word' } : null);
  const set = k => v => { setF({ ...f, [k]: v }); if (err[k]) setErr({ ...err, [k]: null }); };
  const submit = e => {
    e.preventDefault();
    const x = {};
    if (!f.word.trim()) x.word = 'A word is required. It is in the name';
    if (!f.meaning.trim()) x.meaning = 'Explain yourself';
    if (!isEmail(f.email)) x.email = f.email ? 'That looks like a vaalie typed it' : 'Gateway needs this';
    if (!f.real) x.real = 'Gateway checks';
    setErr(x);
    if (Object.keys(x).length) return;
    // Mock submission. In production, POST the form to the review inbox here.
    setDone({ ref: 'LSD-SUB-' + String(Math.floor(1000 + Math.random() * 8999)), word: f.word.trim() });
  };
  const steps = [['01', 'Received', 'Filed with a submission number.'], ['02', 'Read aloud', 'By Gateway, to Gateway.'], ['03', 'Field-tested', 'Said to a lifeguard. Reaction noted.'], ['04', 'Filed', 'Or returned with a polite note.']];
  return (
    <div>
      <PageHead index="04" kicker="Contributions · open to the public" title="Submit a Word" right={<div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, maxWidth: 320, lineHeight: 1.5 }}>The dictionary holds 32 words. The coast holds more. Send yours to Gateway for review.</div>} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start' }}>
        <div style={{ flex: '999 1 560px', minWidth: 0 }}>
          <Window title="submit_word.exe" bar="accent" meta={done ? 'Sent' : 'Form W-05'} controls={['min', 'close']} shadow="lg" padding={0}>
            {done ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center', padding: mobile ? 20 : '40px 36px' }}>
                <Stamp top="A public service by Gateway" middle="FILED" bottom="For review" size={150} />
                <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <RefCode code={done.ref} size="md" />
                  <div style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 800, fontSize: 40, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Filed for review.</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, lineHeight: 1.55 }}>Shot. "{done.word}" is with Gateway. If it passes the lifeguard test, you'll hear from us by email.</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}><Button variant="primary" onClick={() => { setF({ ...blank, name: f.name, email: f.email }); setDone(null); }}>Submit another</Button></div>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: mobile ? 16 : 26 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                  <Field label="The word" value={f.word} onChange={set('word')} placeholder="One word or phrase" error={err.word} />
                  <Field label="Where you heard it" value={f.where} onChange={set('where')} placeholder="e.g. North Beach, the taxi rank, my gran" />
                </div>
                <Field label="What it means" multiline rows={3} value={f.meaning} onChange={set('meaning')} placeholder="Explain it like you would to a vaalie." error={err.meaning} />
                <Field label="Use it in a sentence" multiline rows={2} value={f.example} onChange={set('example')} placeholder="Optional. Gateway likes examples." />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                  <Field label="Your name" value={f.name} onChange={set('name')} placeholder="For the credits" autoComplete="given-name" />
                  <Field label="Email address" type="email" value={f.email} onChange={set('email')} placeholder="you@example.co.za" autoComplete="email" error={err.email} />
                </div>
                <Tick checked={f.real} onChange={set('real')} error={err.real}>I confirm this word is real and someone in Durban actually says it.</Tick>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px dashed var(--ink-3)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>One word per form. Reviewed in order received, or by vibes.</span>
                  <div style={{ display: 'flex', gap: 10 }}><Button onClick={() => { setF(blank); setErr({}); }}>Clear</Button><Button type="submit" variant="primary" brackets>Send to Gateway</Button></div>
                </div>
              </form>
            )}
          </Window>
        </div>
        <div style={{ flex: '1 1 300px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ border: '2px solid var(--ink)', background: 'var(--paper-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 12px', background: 'var(--paper-3)', borderBottom: '1px solid var(--ink)', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em' }}><span>REVIEW PROCESS</span><span>4 STEPS</span></div>
            {steps.map(([n, t, d], i) => (
              <div key={n} style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: 10, padding: '12px', borderTop: i ? '1px dashed var(--ink-3)' : 'none', fontFamily: 'var(--font-mono)' }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{n}</span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><b style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t}</b><span style={{ fontSize: 12, color: 'var(--ink-2)' }}>{d}</span></span>
              </div>
            ))}
          </div>
          <div style={{ border: '2px solid var(--ink)', background: 'var(--ink)', color: 'var(--paper-2)', padding: '14px 14px', fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.6 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.1em', marginBottom: 6, color: 'var(--yellow)' }}>SUBMISSION RULES</div>
            Real words only. No forks. Words already in the 32 lessons will be returned with a copy of the Dictionary.
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SubmitWord });
