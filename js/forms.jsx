const formNS = window.LearnToSpeakDurbanDesignSystem_ec3271;

// Kit-level form fields (multiline + error states, checkbox). Same visual language as DS Input.
function Field({ label, value, onChange, placeholder, hint, error, multiline, rows = 3, type = 'text', autoComplete }) {
  const [focus, setFocus] = React.useState(false);
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <label style={{ display: 'flex', flexDirection: 'column', border: '2px solid var(--ink)', background: 'var(--paper-2)', boxShadow: focus ? 'var(--shadow-hard-sm)' : 'none', transition: 'box-shadow var(--dur-snap) linear' }}>
      <span style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '6px 10px', borderBottom: '1px solid var(--ink)', background: error ? 'var(--ink)' : focus ? 'var(--yellow)' : 'var(--paper-3)', color: error ? 'var(--paper-2)' : 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        <span>{label}</span>{error && <span>✕ {error}</span>}
      </span>
      <Tag type={multiline ? undefined : type} rows={multiline ? rows : undefined} value={value} placeholder={placeholder} autoComplete={autoComplete} onChange={e => onChange(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ border: 'none', outline: 'none', background: 'transparent', padding: 12, fontFamily: 'var(--font-mono)', fontSize: 16, lineHeight: 1.5, color: 'var(--ink)', minWidth: 0, resize: 'vertical' }} />
      {hint && <span style={{ padding: '0 12px 8px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>{hint}</span>}
    </label>
  );
}

function Tick({ checked, onChange, children, error }) {
  return (
    <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.5 }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }} />
      <span aria-hidden="true" style={{ flex: 'none', width: 22, height: 22, marginTop: 1, display: 'grid', placeItems: 'center', border: '2px solid var(--ink)', background: checked ? 'var(--yellow)' : 'var(--paper-2)', outline: error ? '2px solid var(--ink)' : 'none', outlineOffset: 2, fontWeight: 700, fontSize: 14, lineHeight: 1 }}>{checked ? '✓' : ''}</span>
      <span style={{ textWrap: 'pretty' }}>{children}{error && <b style={{ display: 'block', fontSize: 11, marginTop: 2 }}>✕ {error}</b>}</span>
    </label>
  );
}

const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

Object.assign(window, { Field, Tick, isEmail });
