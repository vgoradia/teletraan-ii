import { useEffect, useRef } from 'react'

const TARGETS = [
  { lat: 34.05, lng: -118.24, label: 'LA SECTOR' },
  { lat: 40.71, lng: -74.01, label: 'NY SECTOR' },
  { lat: 51.51, lng: -0.13, label: 'LON SECTOR' },
  { lat: 35.68, lng: 139.69, label: 'TKY SECTOR' },
  { lat: -33.87, lng: 151.21, label: 'SYD SECTOR' },
]

function latLngToXY(lat, lng, cx, cy, r) {
  const x = cx + (lng / 180) * r * 0.85
  const y = cy - (lat / 90) * r * 0.42
  return { x, y }
}

export default function EarthMonitor() {
  const canvasRef = useRef(null)
  const angleRef = useRef(0)
  const frameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      const cx = w / 2
      const cy = h / 2
      const r = Math.min(w, h) * 0.38

      ctx.clearRect(0, 0, w, h)

      // Grid background
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.06)'
      ctx.lineWidth = 1
      for (let i = 0; i < w; i += 20) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, h)
        ctx.stroke()
      }
      for (let j = 0; j < h; j += 20) {
        ctx.beginPath()
        ctx.moveTo(0, j)
        ctx.lineTo(w, j)
        ctx.stroke()
      }

      // Outer ring
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255, 107, 0, 0.5)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Inner rings
      for (const scale of [0.66, 0.33]) {
        ctx.beginPath()
        ctx.arc(cx, cy, r * scale, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Crosshairs
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.25)'
      ctx.beginPath()
      ctx.moveTo(cx - r, cy)
      ctx.lineTo(cx + r, cy)
      ctx.moveTo(cx, cy - r)
      ctx.lineTo(cx, cy + r)
      ctx.stroke()

      // Scan wedge
      angleRef.current += 0.025
      const angle = angleRef.current
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, angle - 0.4, angle)
      ctx.closePath()
      ctx.fillStyle = 'rgba(0, 212, 255, 0.08)'
      ctx.fill()

      // Scan line
      const sx = cx + Math.cos(angle) * r
      const sy = cy + Math.sin(angle) * r
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(sx, sy)
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.7)'
      ctx.lineWidth = 2
      ctx.shadowColor = '#00d4ff'
      ctx.shadowBlur = 8
      ctx.stroke()
      ctx.shadowBlur = 0

      // Earth silhouette (simplified continents)
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2)
      ctx.clip()
      ctx.fillStyle = 'rgba(0, 80, 60, 0.3)'
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2)

      const land = [
        [0.15, -0.1, 0.12, 0.08],
        [-0.25, 0.05, 0.1, 0.15],
        [0.35, 0.1, 0.08, 0.12],
        [-0.05, 0.25, 0.15, 0.08],
        [0.55, -0.2, 0.06, 0.1],
      ]
      ctx.fillStyle = 'rgba(0, 212, 255, 0.15)'
      for (const [lx, ly, lw, lh] of land) {
        ctx.fillRect(cx + lx * r - lw * r / 2, cy + ly * r - lh * r / 2, lw * r, lh * r)
      }
      ctx.restore()

      // Target blips
      const now = Date.now()
      for (const t of TARGETS) {
        const { x, y } = latLngToXY(t.lat, t.lng, cx, cy, r)
        const pulse = 0.5 + 0.5 * Math.sin(now / 400 + t.lng)
        ctx.beginPath()
        ctx.arc(x, y, 3 + pulse * 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 107, 0, ${0.6 + pulse * 0.4})`
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x, y, 6 + pulse * 4, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255, 107, 0, ${0.2 + pulse * 0.2})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <div className="earth-monitor">
      <div className="panel-label">
        <span className="label-bracket">[</span>
        EARTH MONITORING
        <span className="label-bracket">]</span>
        <span className="blink-cursor">_</span>
      </div>
      <div className="earth-display">
        <canvas ref={canvasRef} className="radar-canvas" />
        <div className="earth-overlay-data">
          <div className="coord-line">
            <span className="data-key">ORBIT</span>
            <span className="data-val blue">GEO-SYNC</span>
          </div>
          <div className="coord-line">
            <span className="data-key">ZOOM</span>
            <span className="data-val">1:4,000,000</span>
          </div>
          <div className="coord-line">
            <span className="data-key">TARGETS</span>
            <span className="data-val amber pulse-text">{TARGETS.length} ACTIVE</span>
          </div>
        </div>
        <div className="sector-list">
          {TARGETS.map((t) => (
            <div key={t.label} className="sector-item">
              <span className="sector-dot" />
              {t.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
