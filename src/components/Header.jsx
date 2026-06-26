import { useEffect, useState } from 'react'
import AutobotInsignia from './AutobotInsignia'

export default function Header() {
  const [time, setTime] = useState('')
  const [tick, setTick] = useState(true)

  useEffect(() => {
    const update = () => {
      const d = new Date()
      setTime(
        `${d.toISOString().slice(0, 10)} // ${d.toTimeString().slice(0, 8)} UTC`
      )
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTick((v) => !v), 500)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="teletraan-header">
      <div className="header-left">
        <AutobotInsignia size={52} />
        <div className="header-titles">
          <div className="header-sub">AUTOBOT COMMAND INTERFACE</div>
          <h1 className="header-title">
            TELETRAAN <span className="title-ii">II</span>
          </h1>
        </div>
      </div>

      <div className="header-center">
        <div className="header-readout">
          <span className="readout-label">FACILITY</span>
          <span className="readout-val">MOUNT ST. HILARY — ARK</span>
        </div>
        <div className="header-divider" />
        <div className="header-readout">
          <span className="readout-label">MODE</span>
          <span className="readout-val blue">FULL OPERATIONAL</span>
        </div>
      </div>

      <div className="header-right">
        <div className="status-cluster">
          <div className="status-item">
            <span className={`status-led ${tick ? 'on' : ''}`} />
            <span>CORE</span>
          </div>
          <div className="status-item">
            <span className={`status-led blue ${tick ? 'on' : ''}`} />
            <span>COMMS</span>
          </div>
          <div className="status-item">
            <span className={`status-led ${tick ? 'on' : ''}`} />
            <span>DEFENSE</span>
          </div>
        </div>
        <div className="header-clock">{time}</div>
        <div className="header-status-bar">
          <span className="status-text">SYSTEM STATUS:</span>
          <span className="status-ok">ONLINE</span>
          <span className="blink-cursor">█</span>
        </div>
      </div>
    </header>
  )
}
