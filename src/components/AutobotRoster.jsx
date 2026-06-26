const AUTOBOTS = [
  {
    name: 'OPTIMUS PRIME',
    role: 'COMMANDER',
    status: 'ACTIVE',
    location: 'ARK — BRIDGE',
    power: 98,
    signal: 'STRONG',
  },
  {
    name: 'BUMBLEBEE',
    role: 'SCOUT',
    status: 'PATROL',
    location: 'SECTOR 7-G',
    power: 87,
    signal: 'STRONG',
  },
  {
    name: 'JAZZ',
    role: 'TACTICAL',
    status: 'ACTIVE',
    location: 'ARK — COMMS',
    power: 91,
    signal: 'STRONG',
  },
  {
    name: 'IRONHIDE',
    role: 'SECURITY',
    status: 'STANDBY',
    location: 'PERIMETER DEF',
    power: 94,
    signal: 'MODERATE',
  },
]

function StatusBadge({ status }) {
  const cls =
    status === 'ACTIVE'
      ? 'status-active'
      : status === 'PATROL'
        ? 'status-patrol'
        : 'status-standby'
  return <span className={`roster-status ${cls}`}>{status}</span>
}

export default function AutobotRoster() {
  return (
    <div className="autobot-roster">
      <div className="panel-label">
        <span className="label-bracket">[</span>
        AUTOBOT ROSTER
        <span className="label-bracket">]</span>
      </div>

      <div className="roster-count">
        <span className="count-num">{AUTOBOTS.length}</span>
        <span className="count-label">UNITS ONLINE</span>
      </div>

      <div className="roster-list">
        {AUTOBOTS.map((bot) => (
          <div key={bot.name} className="roster-card">
            <div className="roster-card-header">
              <span className={`roster-indicator ${bot.status.toLowerCase()}`} />
              <span className="roster-name">{bot.name}</span>
              <StatusBadge status={bot.status} />
            </div>
            <div className="roster-detail">
              <span className="detail-key">ROLE</span>
              <span className="detail-val">{bot.role}</span>
            </div>
            <div className="roster-detail">
              <span className="detail-key">LOC</span>
              <span className="detail-val blue">{bot.location}</span>
            </div>
            <div className="roster-detail">
              <span className="detail-key">PWR</span>
              <div className="power-bar-mini">
                <div
                  className="power-bar-fill"
                  style={{ width: `${bot.power}%` }}
                />
              </div>
              <span className="detail-val amber">{bot.power}%</span>
            </div>
            <div className="roster-detail">
              <span className="detail-key">SIG</span>
              <span
                className={`detail-val ${bot.signal === 'STRONG' ? 'blue' : 'amber'}`}
              >
                {bot.signal}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="roster-footer">
        DECEPTICON ACTIVITY: <span className="amber">MINIMAL</span>
        <span className="blink-cursor">_</span>
      </div>
    </div>
  )
}
