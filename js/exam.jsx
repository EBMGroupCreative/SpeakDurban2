const examNS = window.LearnToSpeakDurbanDesignSystem_ec3271;

function ExamStack({ children, title = 'final_exam.exe', meta }) {
  const { Window } = examNS;
  return (
    <div style={{ position: 'relative', paddingTop: 72, paddingLeft: 72 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ position: 'absolute', top: i * 24, left: i * 24, right: 72 - i * 24, bottom: 72 - i * 24 }}>
          <Window title={title} controls={['close']} shadow="grey" style={{ height: '100%' }} bar="strip"><span></span></Window>
        </div>
      ))}
      <div style={{ position: 'relative' }}>
        <Window title={title} meta={meta} bar="accent" controls={['min', 'close']} shadow="lg" padding={0}>{children}</Window>
      </div>
    </div>
  );
}

function Certificate({ name, setName, score }) {
  const { RefCode, Barcode, Stamp, Input, Button } = examNS;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start' }}>
      <div style={{ flex: '999 1 520px', minWidth: 0, background: 'var(--paper-2)', border: '2px solid var(--ink)', boxShadow: 'var(--shadow-hard-lg)', padding: 14 }}>
        <div style={{ border: '1px solid var(--ink)', padding: '30px 40px 28px', position: 'relative', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><RefCode code={'LSD-2026-CERT-' + String(score).padStart(2, '0') + '0417'} /><RefCode prefix="" code="Issued as a public service by Gateway" /></div>
            <Barcode value={'CERT' + name} width={140} height={36} style={{ maxWidth: '40%' }} showValue={false} />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 10 }}>This certifies that</div>
          <div style={{ borderBottom: '2px solid var(--ink)', paddingBottom: 6, fontFamily: 'var(--font-grotesk)', fontWeight: 800, fontStretch: '88%', fontSize: 56, lineHeight: 1, minHeight: 56 }}>{name || '\u00a0'}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, lineHeight: 1.55, maxWidth: 520 }}>has completed all 32 lessons and passed the Final Exam with a score of <b>{score}/32</b>, and is hereby declared</div>
          <div style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 800, fontStretch: '88%', fontSize: 64, lineHeight: 0.9, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Fluent in Durban</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--ink)', marginTop: 8 }}>
            {[['Course', 'LSD-01 – LSD-32'], ['Grade', score >= 30 ? 'Native-ish' : 'Fluent'], ['Valid', 'Up and down the coast']].map(([k, v]) => (
              <div key={k} style={{ padding: '8px 10px 0 0', fontFamily: 'var(--font-mono)', fontSize: 12 }}><div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{k}</div>{v}</div>
            ))}
          </div>
          <Stamp top="A public service by Gateway" size={150} style={{ position: 'absolute', right: 34, bottom: 70 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 4px 0', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          <span>Show this certificate at Gateway, Durban to claim your graduation reward.</span><span style={{ color: 'var(--ink-3)' }}>1 / 1</span>
        </div>
      </div>
      <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input label="Name of graduate" value={name} onChange={e => setName(e.target.value)} hint="Printed exactly as typed. Choose wisely. Your gran will see this." />
        <Button variant="accent" size="lg" block brackets>Print certificate</Button>
        <Button block>Download PDF (for the fridge)</Button>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.5, color: 'var(--ink-2)' }}>Redeemable once per graduate at Gateway, Durban. Baggies optional at collection.</div>
      </div>
    </div>
  );
}

function Exam({ go, initial }) {
  const { AnswerOption, Button, ProgressBar, Dialog } = examNS;
  const Q = window.LSD_DATA.exam;
  const N = Q.length, PASS = 24;
  const [i, setI] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [phase, setPhase] = React.useState(initial || 'q');
  const [name, setName] = React.useState(() => localStorage.getItem('lsd-name') || 'Thandi Mkhize');
  const score = Object.entries(answers).filter(([k, v]) => Q[k].c === v).length;
  const q = Q[i];
  const sel = answers[i];
  const answered = Object.keys(answers).length;
  const complete = answered === N;
  const shown = complete ? score : (phase === 'fail' ? 13 : 29);
  const missed = complete ? Q.filter((x, k) => answers[k] !== x.c).map(x => window.LSD_DATA.words[+x.w - 1][1]) : ['Kiff', 'Robot', 'Pozi'];
  const next = () => { if (i < N - 1) setI(i + 1); else if (complete) setPhase(score >= PASS ? 'pass' : 'fail'); };
  const reset = () => { setAnswers({}); setI(0); setPhase('q'); };
  const demo = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
      <span style={{ color: 'var(--ink-3)', letterSpacing: '0.08em' }}>DEMO STATE</span>
      {[['q', 'Question'], ['pass', 'Pass'], ['fail', 'Fail']].map(([k, l]) => <Button key={k} size="sm" variant={phase === k ? 'primary' : 'secondary'} onClick={() => setPhase(k)}>{l}</Button>)}
    </div>
  );
  return (
    <div>
      <PageHead index="08" kicker="Assessment · pencils down, baggies on" title={phase === 'pass' ? 'Certificate of Fluency' : 'The Final Exam'} right={demo} />
      {phase === 'pass' ? <Certificate name={name} setName={setName} score={shown} /> : (
        <div style={{ position: 'relative', maxWidth: 900 }}>
          <ExamStack meta={'Question ' + String(i + 1).padStart(2, '0') + '/' + N}>
            <div style={{ padding: '28px 32px 0', display: 'flex', flexDirection: 'column', gap: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 30 }}>QUESTION {String(i + 1).padStart(2, '0')}/{N}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>REF: LSD-{q.w} · LESSON {q.w}/32</span>
              </div>
              <div style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: 36, lineHeight: 1.1, letterSpacing: '-0.01em', textWrap: 'balance' }}>{q.q}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {q.a.map((a, k) => <AnswerOption key={k} letter={'abc'[k]} state={sel === k ? 'selected' : 'idle'} onClick={() => { setAnswers({ ...answers, [i]: k }); }}>{a}</AnswerOption>)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: 'var(--ink-3)' }}>QUESTION MAP · JUMP AROUND, WE WON'T TELL</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, minmax(0,1fr))', gap: 4 }}>
                  {Q.map((x, k) => <button key={k} type="button" onClick={() => setI(k)} title={'Question ' + (k + 1)} style={{ height: 26, padding: 0, border: '1.5px solid var(--ink)', borderRadius: 0, cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, background: k === i ? 'var(--yellow)' : answers[k] !== undefined ? 'var(--ink)' : 'var(--paper-2)', color: k !== i && answers[k] !== undefined ? 'var(--paper-2)' : 'var(--ink)' }}>{String(k + 1).padStart(2, '0')}</button>)}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, padding: '22px 32px 26px', marginTop: 24, borderTop: '1px dashed var(--ink-3)' }}>
              <ProgressBar label="Answered" value={answered} max={N} segments={16} style={{ width: 300 }} />
              <div style={{ display: 'flex', gap: 10 }}>
                <Button disabled={i === 0} onClick={() => setI(i - 1)}>Wait, go back</Button>
                <Button variant="primary" disabled={sel === undefined || (i === N - 1 && !complete)} onClick={next}>{i === N - 1 ? (complete ? 'Hand it in' : (N - answered) + ' to go, bru') : 'Next, bru'}</Button>
              </div>
            </div>
          </ExamStack>
          {phase === 'fail' && (
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(242,241,236,.55)' }}>
              <Dialog title="exam_result.exe" kind="error" heading={'Eish. ' + shown + '/32.'} width={460} onClose={() => setPhase('q')}
                actions={<><Button size="sm" onClick={() => go('dict')}>Study the Dictionary</Button><Button size="sm" variant="primary" onClick={reset}>Try again</Button></>}>
                Rewrite immediately — the ocean isn't going anywhere.<span style={{ display: 'block', marginTop: 8, fontSize: 12, color: 'var(--ink-2)' }}>Pass mark: {PASS}/32. Gateway suggests revising: {missed.slice(0, 6).join(', ')}{missed.length > 6 ? ' and ' + (missed.length - 6) + ' more' : ''}.</span>
              </Dialog>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Exam });
