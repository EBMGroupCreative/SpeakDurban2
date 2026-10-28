const shellNS = window.LearnToSpeakDurbanDesignSystem_ec3271;

const NAV_ITEMS = [
  { id: 'home', index: '00', label: 'Index' },
  { id: 'dict', index: '01', label: 'Dictionary' },
  { id: 'act', index: '02', label: 'Activities' },
  { id: 'merch', index: '03', label: 'Merch' },
  { id: 'submit', index: '04', label: 'Submit' },
  { id: 'study', index: '05', label: 'Study' },
  { id: 'card', index: '06', label: 'ID Card' },
  { id: 'flash', index: '07', label: 'Flashcards' },
  { id: 'exam', index: '08', label: 'Final Exam' },
];

function Masthead({ page, go, cart = 0, mobile, compactNav }) {
  const { FolderTabs, Icon, RefCode } = shellNS;
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'var(--paper)', paddingTop: mobile ? 12 : 18 }}>
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto', padding: mobile ? '0 16px' : '0 64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, paddingBottom: 12 }}>
          <button onClick={() => go('home')} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: 14 }}>
            <span style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 800, fontStretch: '88%', fontSize: mobile ? 17 : 20, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Learn to Speak Durban</span>
            {!mobile && <RefCode code="LSD-2026" />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            {!mobile && <span style={{ color: 'var(--ink-3)' }}>Ocean 24°C · Tide: going out · Vibes: tops</span>}
            <button onClick={() => go('merch')} aria-label="Cooler box" style={{ display: 'flex', alignItems: 'center', gap: 8, border: '2px solid var(--ink)', background: cart ? 'var(--yellow)' : 'var(--paper-2)', padding: '5px 10px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700 }}>
              <shellNS.Icon name="cooler-box" size={20} />{String(cart).padStart(2, '0')}
            </button>
          </div>
        </div>
        {!mobile && !compactNav && <FolderTabs items={NAV_ITEMS} active={page} onChange={go} />}
      </div>
    </header>
  );
}

function Footer({ mobile }) {
  const { Barcode, RefCode } = shellNS;
  return (
    <footer style={{ marginTop: 96, borderTop: '2px solid var(--ink)', background: 'var(--paper-2)' }}>
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto', padding: mobile ? '24px 16px 32px' : '28px 64px 36px', display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: 24, alignItems: mobile ? 'flex-start' : 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>Learn to Speak Durban. A public service by Gateway.</div>
          <RefCode code="LSD-2026 · No forks were harmed in the making of this website" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {!mobile && <Barcode value="GATEWAY-DBN" width={120} height={34} />}
          <img src={(window.__resources && window.__resources.gatewayLogo) || ((window.LSD_ASSETS || 'assets/') + 'logos/gateway-logo.png')} alt="Gateway" style={{ width: mobile ? 64 : 76, height: 'auto', display: 'block' }} />
        </div>
      </div>
    </footer>
  );
}

function PageHead({ index, title, kicker, right }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32, margin: '48px 0 32px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{index} — {kicker}</div>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-grotesk)', fontWeight: 800, fontStretch: '88%', fontSize: 'clamp(48px, 6.2vw, 88px)', lineHeight: 0.88, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>{title}</h1>
      </div>
      {right}
    </div>
  );
}

Object.assign(window, { Masthead, Footer, PageHead, NAV_ITEMS });
