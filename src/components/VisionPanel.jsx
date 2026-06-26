import { useEffect, useRef, useState } from 'react'

export default function VisionPanel() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [status, setStatus] = useState('INITIALIZING...')
  const [targets, setTargets] = useState([])
  const animFrameRef = useRef(null)
  const modelRef = useRef(null)

  useEffect(() => {
    let stream = null

    function loadScript(src) {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
        const s = document.createElement('script')
        s.src = src
        s.onload = resolve
        s.onerror = reject
        document.head.appendChild(s)
      })
    }

    async function init() {
      try {
        setStatus('LOADING NEURAL NET...')

        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js')
        await new Promise(resolve => setTimeout(resolve, 1000))
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js')
        await new Promise(resolve => setTimeout(resolve, 500))

        modelRef.current = await window.cocoSsd.load()
        setStatus('REQUESTING CAMERA ACCESS...')

        stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play()
            setStatus('SCANNING')
            detect()
          }
        }
      } catch (err) {
        console.error(err)
        setStatus('SENSOR ERROR')
      }
    }

    async function detect() {
      if (!videoRef.current || !canvasRef.current || !modelRef.current) return

      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const predictions = await modelRef.current.detect(video)
      setTargets(predictions)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Grid
      ctx.strokeStyle = 'rgba(255, 107, 0, 0.08)'
      ctx.lineWidth = 0.5
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke()
      }

      // Crosshair
      const cx = canvas.width / 2
      const cy = canvas.height / 2
      ctx.strokeStyle = 'rgba(255, 107, 0, 0.4)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(cx - 20, cy); ctx.lineTo(cx + 20, cy); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx, cy - 20); ctx.lineTo(cx, cy + 20); ctx.stroke()

      // Detections
      predictions.forEach((pred) => {
        const [x, y, w, h] = pred.bbox
        const label = pred.class.toUpperCase()
        const confidence = Math.round(pred.score * 100)

        ctx.strokeStyle = '#ff6b00'
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, w, h)

        const cs = 12
        ctx.strokeStyle = '#00d4ff'
        ctx.lineWidth = 2
        const corners = [
          [x, y, cs, cs],
          [x + w, y, -cs, cs],
          [x, y + h, cs, -cs],
          [x + w, y + h, -cs, -cs]
        ]
        corners.forEach(([bx, by, dx, dy]) => {
          ctx.beginPath()
          ctx.moveTo(bx + dx, by)
          ctx.lineTo(bx, by)
          ctx.lineTo(bx, by + dy)
          ctx.stroke()
        })

        ctx.fillStyle = 'rgba(0,0,0,0.7)'
        ctx.fillRect(x, y - 22, w, 22)
        ctx.fillStyle = '#ff6b00'
        ctx.font = 'bold 11px monospace'
        ctx.fillText(`${label} — ${confidence}%`, x + 4, y - 6)
      })

      animFrameRef.current = requestAnimationFrame(detect)
    }

    init()

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (stream) stream.getTracks().forEach(t => t.stop())
    }
  }, [])

  return (
    <div className="vision-panel">
      <div className="panel-label">
        <span className="label-bracket">[</span>
        OPTICAL THREAT SCANNER
        <span className="label-bracket">]</span>
        <span className="vision-status">{status}</span>
      </div>

      <div className="vision-display">
        <video ref={videoRef} className="vision-video" muted playsInline />
        <canvas ref={canvasRef} className="vision-canvas" />
        <div className="vision-corner tl" />
        <div className="vision-corner tr" />
        <div className="vision-corner bl" />
        <div className="vision-corner br" />
      </div>

      <div className="vision-readout">
        <div className="vision-stat">
          <span className="detail-key">TARGETS</span>
          <span className="amber">{targets.length} DETECTED</span>
        </div>
        <div className="vision-stat">
          <span className="detail-key">MODE</span>
          <span className="blue">ACTIVE SCAN</span>
        </div>
        <div className="vision-targets">
          {targets.slice(0, 4).map((t, i) => (
            <div key={i} className="vision-target-item">
              <span className="vision-target-dot" />
              <span className="vision-target-label">{t.class.toUpperCase()}</span>
              <span className="amber">{Math.round(t.score * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}