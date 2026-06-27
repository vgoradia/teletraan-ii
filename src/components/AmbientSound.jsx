import { useEffect, useRef, useState } from 'react'

export default function AmbientSound({ threatLevel }) {
  const audioCtxRef = useRef(null)
  const nodesRef = useRef({})
  const [enabled, setEnabled] = useState(false)

  function createAmbient(ctx) {
    // Base hum — low drone
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.value = 60
    gain1.gain.value = 0.04
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start()

    // Second harmonic
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.value = 120
    gain2.gain.value = 0.02
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start()

    // High frequency electronic hiss
    const bufferSize = ctx.sampleRate * 2
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.015
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    noise.loop = true
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.value = 2000
    noiseFilter.Q.value = 0.5
    noise.connect(noiseFilter)
    noiseFilter.connect(ctx.destination)
    noise.start()

    // Pulse effect
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 0.3
    lfoGain.gain.value = 0.01
    lfo.connect(lfoGain)
    lfoGain.connect(gain1.gain)
    lfo.start()

    nodesRef.current = { osc1, osc2, noise, lfo }
  }

  function playAlert(ctx, level) {
    const freqs = {
      ELEVATED: [440, 480],
      HIGH: [520, 580],
      CRITICAL: [660, 880],
    }
    const pair = freqs[level]
    if (!pair) return

    pair.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.15)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.3)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime + i * 0.15)
      osc.stop(ctx.currentTime + i * 0.15 + 0.3)
    })
  }

  function toggle() {
    if (!enabled) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      audioCtxRef.current = ctx
      createAmbient(ctx)
      setEnabled(true)
    } else {
      const nodes = nodesRef.current
      Object.values(nodes).forEach(n => { try { n.stop() } catch {} })
      audioCtxRef.current?.close()
      audioCtxRef.current = null
      nodesRef.current = {}
      setEnabled(false)
    }
  }

  const prevThreatRef = useRef('MINIMAL')
  useEffect(() => {
    if (!enabled || !audioCtxRef.current) return
    if (threatLevel && threatLevel !== prevThreatRef.current) {
      playAlert(audioCtxRef.current, threatLevel)
      prevThreatRef.current = threatLevel
    }
  }, [threatLevel, enabled])

  return (
    <button
      className={`ambient-toggle ${enabled ? 'ambient-on' : ''}`}
      onClick={toggle}
      title="Toggle ambient sound"
    >
      {enabled ? '[ SOUND ON ]' : '[ SOUND OFF ]'}
    </button>
  )
}