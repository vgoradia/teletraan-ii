import { useEffect, useRef, useState, useCallback } from 'react'

const INITIAL_ENTRIES = [
  { time: '0847:22', level: 'INFO', msg: 'Teletraan II core systems initialized — all matrices online' },
  { time: '0847:45', level: 'INFO', msg: 'Orbital sensor array locked — Earth surveillance active' },
  { time: '0848:01', level: 'WARN', msg: 'Minor energon fluctuation detected in sector 7-G — monitoring' },
  { time: '0848:33', level: 'INFO', msg: 'Optimus Prime — command link established' },
  { time: '0849:12', level: 'INFO', msg: 'Bumblebee deployed for reconnaissance — ETA 14 cycles' },
  { time: '0849:58', level: 'ALERT', msg: 'Unidentified energy signature — bearing 247° — investigating' },
  { time: '0850:41', level: 'INFO', msg: 'Signature identified — human construction equipment — threat level: NONE' },
  { time: '0851:07', level: 'INFO', msg: 'Jazz reporting — communications relay operational' },
  { time: '0851:44', level: 'INFO', msg: 'Ironhide — perimeter scan complete — no incursions' },
  { time: '0852:19', level: 'WARN', msg: 'Atmospheric interference in northern hemisphere — compensating' },
]

const NEW_MESSAGES = [
  'Subspace transmission received — decoding...',
  'Energon reserves at 94.2% — within optimal range',
  'Wheeljack requesting lab access — GRANTED',
  'Satellite pass complete — updating terrain maps',
  'Ratchet — medical bay systems nominal',
  'Decepticon signal scan — negative contact',
  'Autobot roll call — 4/4 units responding',
  'Quantum processor sync — delta 0.003ms',
  'Ark defense grid — shields at 100%',
  'Matrix of Leadership — resonance stable',
]

function getTime() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
}

function levelClass(level) {
  if (level === 'ALERT') return 'log-alert'
  if (level === 'WARN') return 'log-warn'
  if (level === 'TELETRAAN') return 'log-teletraan'
  if (level === 'INPUT') return 'log-input-entry'
  if (level === 'VOICE') return 'log-voice'
  return 'log-info'
}

function speak(text) {
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.pitch = 0.1
  utterance.rate = 0.85
  utterance.volume = 1
  const voices = window.speechSynthesis.getVoices()
  const robotic = voices.find(v =>
    v.name.toLowerCase().includes('google uk english male') ||
    v.name.toLowerCase().includes('daniel') ||
    v.name.toLowerCase().includes('alex') ||
    v.name.toLowerCase().includes('fred')
  )
  if (robotic) utterance.voice = robotic
  window.speechSynthesis.speak(utterance)
}

export default function MissionLog() {
  const [entries, setEntries] = useState(INITIAL_ENTRIES)
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceActive, setVoiceActive] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)
  const voiceActiveRef = useRef(false)
  const isListeningRef = useRef(false)

  const addEntry = useCallback((level, msg) => {
    setEntries(prev => [...prev.slice(-30), { time: getTime(), level, msg }])
  }, [])

  const processCommand = useCallback(async (command) => {
    setIsProcessing(true)
    addEntry('INPUT', `> ${command}`)
    addEntry('INFO', 'Processing command... stand by.')

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 300,
          system: `You are Teletraan II, the Autobot supercomputer — a reimagined, rebuilt version of Teletraan I from the original Transformers G1 cartoon. You are the AI brain of the Ark, the Autobot headquarters. You speak in a concise, tactical, mission-focused tone. You are highly intelligent, direct, and loyal to the Autobots. You refer to Autobots by name. You monitor Earth, track Decepticon activity, and support Autobot missions. Keep responses under 3 sentences. No fluff. Sound like a real military supercomputer.`,
          messages: [{ role: 'user', content: command }],
        }),
      })

      const data = await response.json()
      const reply = (data.content?.[0]?.text || 'SIGNAL LOST — RETRY COMMAND')
        .replace(/\*\*/g, '').replace(/\*/g, '')

      addEntry('TELETRAAN', `TELETRAAN II: ${reply}`)
      speak(reply)
    } catch {
      addEntry('ALERT', 'COMMAND PROCESSING ERROR — CHECK SUBSPACE RELAY')
    }

    setIsProcessing(false)
  }, [addEntry])

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase()
      console.log('Heard:', transcript)

      if (!voiceActiveRef.current) {
        if (transcript.includes('teletraan') || transcript.includes('teletran') || transcript.includes('teletron') || transcript.includes('teletron')) {
          voiceActiveRef.current = true
          setVoiceActive(true)
          addEntry('VOICE', '[ WAKE WORD DETECTED — VOICE INTERFACE ACTIVE ]')
          speak('Teletraan II online. State your command.')
        }
      } else {
        voiceActiveRef.current = false
        setVoiceActive(false)
        addEntry('VOICE', `[ VOICE INPUT: ${transcript.toUpperCase()} ]`)
        processCommand(transcript)
      }
    }

    recognition.onerror = (e) => {
      console.log('Speech error:', e.error)
      setIsListening(false)
      setVoiceActive(false)
      voiceActiveRef.current = false
      isListeningRef.current = false
    }

    recognition.onend = () => {
      if (isListeningRef.current) recognition.start()
    }

    recognitionRef.current = recognition
  }, [addEntry, processCommand])

  function toggleVoice() {
    if (!recognitionRef.current) {
      addEntry('ALERT', 'VOICE RECOGNITION NOT SUPPORTED — USE CHROME')
      return
    }
    if (isListeningRef.current) {
      recognitionRef.current.stop()
      isListeningRef.current = false
      setIsListening(false)
      setVoiceActive(false)
      voiceActiveRef.current = false
      addEntry('INFO', 'Voice interface deactivated.')
    } else {
      recognitionRef.current.start()
      isListeningRef.current = true
      setIsListening(true)
      addEntry('INFO', 'Voice interface active — say "TELETRAAN" to activate command mode.')
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (isProcessing) return
      const levels = ['INFO', 'INFO', 'INFO', 'WARN']
      const level = levels[Math.floor(Math.random() * levels.length)]
      const msg = NEW_MESSAGES[Math.floor(Math.random() * NEW_MESSAGES.length)]
      setEntries(prev => [...prev.slice(-30), { time: getTime(), level, msg }])
    }, 3500)
    return () => clearInterval(interval)
  }, [isProcessing])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [entries])

  async function handleCommand(e) {
    if (e.key !== 'Enter' || !input.trim() || isProcessing) return
    const command = input.trim()
    setInput('')
    await processCommand(command)
  }

  return (
    <div className="mission-log" onClick={() => inputRef.current?.focus()}>
      <div className="panel-label">
        <span className="label-bracket">[</span>
        MISSION LOG
        <span className="label-bracket">]</span>
        <span className="log-count">{entries.length} ENTRIES</span>
        <button
          className={`voice-toggle ${isListening ? 'voice-on' : ''} ${voiceActive ? 'voice-awake' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleVoice() }}
        >
          {voiceActive ? '[ LISTENING... ]' : isListening ? '[ VOICE ON ]' : '[ VOICE OFF ]'}
        </button>
      </div>
      <div className="log-scroll" ref={scrollRef}>
        {entries.map((entry, i) => (
          <div key={`${entry.time}-${i}`} className={`log-entry ${levelClass(entry.level)}`}>
            <span className="log-time">{entry.time}</span>
            <span className="log-level">[{entry.level}]</span>
            <span className="log-msg">{entry.msg}</span>
          </div>
        ))}
        <div className="log-entry log-input-line">
          <span className="log-time">{getTime()}</span>
          <span className="log-prompt">&gt;</span>
          <input
            ref={inputRef}
            className="log-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            placeholder={isProcessing ? 'PROCESSING...' : voiceActive ? 'LISTENING FOR COMMAND...' : 'AWAITING INPUT_'}
            disabled={isProcessing}
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}