const merchNS = window.LearnToSpeakDurbanDesignSystem_ec3271;

function MerchPreview({ m }) {
  const { Halftone } = merchNS;
  const overlay = m.tee ? m.name : m.kind === 'Bumper sticker' ? 'FLUENT IN DURBAN' : m.kind === 'Cap' ? 'NATIVE SPEAKER' : null;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Halftone height="100%" dot={5} placeholder={m.kind === 'Bundle' || m.kind === 'Towel' ? 'beach' : 'product'} />
      {overlay && <div style={{ position: 'absolute', left: '50%', top: '44%', transform: 'translate(-50%,-50%)', background: 'var(--paper-2)', border: '2px solid var(--ink)', padding: '6px 10px', fontFamily: 'var(--font-grotesk)', fontWeight: 800, fontStretch: '88%', fontSize: m.tee ? 34 : 15, lineHeight: 1, whiteSpace: 'nowrap' }}>{overlay}</div>}
    </div>
  );
}

function Merch({ cart, setCart }) {
  const { SpecCard, Button, Dialog, Icon } = merchNS;
  const [added, setAdded] = React.useState(null);
  const items = window.LSD_DATA.merch;
  return (
    <div>
      <PageHead index="03" kicker="Course materials · compulsory-ish" title="Merch" right={
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, border: '2px solid var(--ink)', background: 'var(--paper-2)', padding: '10px 14px', boxShadow: 'var(--shadow-hard-sm)' }}>
          <Icon name="cooler-box" size={40} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.4 }}><b>Cooler box</b><br />{cart} item{cart === 1 ? '' : 's'} · kept cold</div>
        </div>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 24 }}>
        {items.map(m => (
          <SpecCard key={m.id} refCode={m.id} meta={m.kind} label={m.tee ? 'Tee' : m.name} crosshair={false} previewHeight={250} sourceLabel="PRICE" sourceTag={m.price} source={m.desc} interactive
            footer={<Button size="sm" variant="accent" block onClick={() => { setCart(cart + 1); setAdded(m); }}>Vy to checkout</Button>}>
            <MerchPreview m={m} />
          </SpecCard>
        ))}
      </div>
      {added && (
        <div style={{ position: 'fixed', right: 40, bottom: 40, zIndex: 30 }}>
          <Dialog title="cooler_box.exe" kind="success" heading="Packed in the cooler." width={360} onClose={() => setAdded(null)}
            actions={<><Button size="sm" onClick={() => setAdded(null)}>Keep shopping</Button><Button size="sm" variant="primary" onClick={() => setAdded(null)}>Chow now</Button></>}>
            {added.name} ({added.kind}) — {added.price}. Kept cold until checkout. Like a good cooler box should.
          </Dialog>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Merch });
