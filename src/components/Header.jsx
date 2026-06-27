import { useEffect, useState } from 'react'
import AutobotInsignia from './AutobotInsignia'

export default function Header() {
  const [time, setTime] = useState('')
  const [tick, setTick] = useState(true)
  const [energon, setEnergon] = useState(94.2)
  const [energonDir, setEnergonDir] = useState(-1)

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

  useEffect(() => {
    const t = setInterval(() => {
      setEnergon((v) => {
        let next = v + energonDir * (Math.random() * 0.3)
        if (next <= 20) { setEnergonDir(1); next = 20 }
        if (next >= 98) { setEnergonDir(-1); next = 98 }
        return parseFloat(next.toFixed(1))
      })
    }, 2000)
    return () => clearInterval(t)
  }, [energonDir])

  const energonColor = energon > 60 ? '#00d4ff' : energon > 30 ? '#ff6b00' : '#ff0000'
  const energonStatus = energon > 60 ? 'OPTIMAL' : energon > 30 ? 'LOW' : 'CRITICAL'

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
        <div className="header-divider" />
        <div className="header-readout">
          <span className="readout-label">ENERGON RESERVES</span>
          <div className="energon-bar-container">
            <div className="energon-bar-track">
              <div
                className="energon-bar-fill"
                style={{
                  width: `${energon}%`,
                  background: energonColor,
                  boxShadow: `0 0 8px ${energonColor}`,
                }}
              />
            </div>
            <span className="energon-value" style={{ color: energonColor }}>
              {energon}% — {energonStatus}
            </span>
          </div>
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