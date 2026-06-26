import { useEffect, useState } from 'react'

function Bar({ label, value, max = 100, color = 'amber' }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="diag-bar-row">
      <span className="diag-label">{label}</span>
      <div className="diag-bar-track">
        <div
          className={`diag-bar-fill ${color}`}
          style={{ width: `${pct}%` }}
        />
        <div className="diag-bar-scan" />
      </div>
      <span className={`diag-value ${color}`}>{value.toFixed(1)}%</span>
    </div>
  )
}

function Sparkline({ data, color = 'blue' }) {
  const max = Math.max(...data, 1)
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 100}`)
    .join(' ')

  return (
    <svg className="sparkline" viewBox="0 0 100 30" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color === 'blue' ? '#00d4ff' : '#ff6b00'}
        strokeWidth="1.5"
        opacity="0.8"
      />
    </svg>
  )
}

export default function SystemDiagnostics() {
  const [cpu, setCpu] = useState(34.2)
  const [ram, setRam] = useState(61.8)
  const [net, setNet] = useState(12.4)
  const [temp, setTemp] = useState(42.1)
  const [uptime, setUptime] = useState({ days: 847, hours: 12, mins: 34, secs: 0 })
  const [cpuHistory, setCpuHistory] = useState(Array(20).fill(30))
  const [ramHistory, setRamHistory] = useState(Array(20).fill(60))

  useEffect(() => {
    const tick = setInterval(() => {
      setCpu((v) => {
        const next = Math.max(18, Math.min(78, v + (Math.random() - 0.48) * 8))
        setCpuHistory((h) => [...h.slice(1), next])
        return next
      })
      setRam((v) => {
        const next = Math.max(45, Math.min(85, v + (Math.random() - 0.5) * 3))
        setRamHistory((h) => [...h.slice(1), next])
        return next
      })
      setNet((v) => Math.max(2, Math.min(45, v + (Math.random() - 0.5) * 10)))
      setTemp((v) => Math.max(38, Math.min(48, v + (Math.random() - 0.5) * 1.5)))
      setUptime((u) => {
        let { days, hours, mins, secs } = u
        secs++
        if (secs >= 60) { secs = 0; mins++ }
        if (mins >= 60) { mins = 0; hours++ }
        if (hours >= 24) { hours = 0; days++ }
        return { days, hours, mins, secs }
      })
    }, 1000)
    return () => clearInterval(tick)
  }, [])

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div className="system-diagnostics">
      <div className="panel-label">
        <span className="label-bracket">[</span>
        SYSTEM DIAGNOSTICS
        <span className="label-bracket">]</span>
      </div>

      <div className="diag-section">
        <div className="diag-header">CORE PROCESSORS</div>
        <Bar label="CPU-α" value={cpu} color="amber" />
        <Bar label="CPU-β" value={cpu * 0.87 + 5} color="blue" />
        <Sparkline data={cpuHistory} color="amber" />
      </div>

      <div className="diag-section">
        <div className="diag-header">MEMORY MATRIX</div>
        <Bar label="RAM" value={ram} color="blue" />
        <Bar label="CACHE" value={ram * 0.4} color="amber" />
        <Sparkline data={ramHistory} color="blue" />
      </div>

      <div className="diag-section">
        <div className="diag-header">NETWORK I/O</div>
        <Bar label="TX/RX" value={net} max={50} color="blue" />
        <Bar label="TEMP" value={temp} max={60} color="amber" />
      </div>

      <div className="diag-section uptime-block">
        <div className="diag-header">UPTIME</div>
        <div className="uptime-display">
          <span className="uptime-num">{uptime.days}</span>
          <span className="uptime-unit">D</span>
          <span className="uptime-sep">:</span>
          <span className="uptime-num">{pad(uptime.hours)}</span>
          <span className="uptime-unit">H</span>
          <span className="uptime-sep">:</span>
          <span className="uptime-num">{pad(uptime.mins)}</span>
          <span className="uptime-unit">M</span>
          <span className="uptime-sep">:</span>
          <span className="uptime-num">{pad(uptime.secs)}</span>
          <span className="uptime-unit">S</span>
        </div>
      </div>

      <div className="diag-footer">
        <span className="status-dot online" />
        ALL SYSTEMS NOMINAL
        <span className="blink-cursor">_</span>
      </div>
    </div>
  )
}
