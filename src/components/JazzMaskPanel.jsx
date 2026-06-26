const MASK_DATA = {
  unit: 'JAZZ',
  designation: 'TACTICAL OPERATIONS UNIT',
  status: 'OFFLINE',
  hardware: [
    { label: 'VISOR DISPLAY', value: '—', status: 'offline' },
    { label: 'AUDIO ARRAY', value: '—', status: 'offline' },
    { label: 'LED MATRIX', value: '—', status: 'offline' },
    { label: 'VOICE MODULE', value: '—', status: 'offline' },
    { label: 'MOTION SENSOR', value: '—', status: 'offline' },
    { label: 'BATTERY', value: '—', status: 'offline' },
  ],
  commsLink: 'AWAITING HANDSHAKE',
  firmware: 'v0.0.0 — NOT CONNECTED',
}

export default function JazzMaskPanel() {
  return (
    <div className="jazz-mask-panel">
      <div className="panel-label">
        <span className="label-bracket">[</span>
        JAZZ UNIT — WEARABLE INTERFACE
        <span className="label-bracket">]</span>
      </div>

      <div className="jazz-status-header">
        <span className="jazz-status-indicator offline" />
        <span className="jazz-unit-name">JAZZ</span>
        <span className="jazz-status-badge offline">OFFLINE</span>
      </div>

      <div className="jazz-designation">{MASK_DATA.designation}</div>

      <div className="jazz-hardware-grid">
        {MASK_DATA.hardware.map((item) => (
          <div key={item.label} className="jazz-hardware-item">
            <span className="jazz-hw-indicator offline" />
            <span className="jazz-hw-label">{item.label}</span>
            <span className="jazz-hw-value offline">—</span>
          </div>
        ))}
      </div>

      <div className="jazz-comms">
        <div className="jazz-comms-row">
          <span className="detail-key">COMMS LINK</span>
          <span className="jazz-comms-val amber">{MASK_DATA.commsLink}</span>
        </div>
        <div className="jazz-comms-row">
          <span className="detail-key">FIRMWARE</span>
          <span className="jazz-comms-val">{MASK_DATA.firmware}</span>
        </div>
      </div>

      <div className="jazz-offline-notice">
        — PHYSICAL UNIT NOT CONNECTED —
        <br />
        CONNECT JAZZ MASK VIA USB / BLUETOOTH TO ACTIVATE
      </div>
    </div>
  )
}