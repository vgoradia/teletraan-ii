import { useEffect, useRef, useState } from 'react'

const AUTOBOTS = ['OPTIMUS PRIME', 'BUMBLEBEE', 'JAZZ', 'IRONHIDE', 'RATCHET', 'WHEELJACK']

const INTERCEPTED = [
  'MEGATRON: The Autobots suspect nothing. Prepare the energon raid.',
  'STARSCREAM: Understood. Seekers are in position.',
  'SOUNDWAVE: Rumble, Frenzy — deploy.',
  'MEGATRON: The Ark will fall before sunrise.',
  'STARSCREAM: Megatron, the Decepticons should follow ME.',
  'SHOCKWAVE: Cybertron secure. Awaiting further orders.',
  'MEGATRON: Starscream, your incompetence is noted.',
  'SOUNDWAVE: Autobot signal detected — triangulating.',
]

function getTime() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
}

export default function SubspaceComms() {
  const [messages, setMessages] = useState([
    { time: '0847:33', from: 'OPTIMUS PRIME', to: 'ALL', msg: 'Autobots, maintain defensive positions.', type: 'autobot' },
    { time: '0849:12', from: 'BUMBLEBEE', to: 'OPTIMUS PRIME', msg: 'Sector 7-G clear. No hostiles detected.', type: 'autobot' },
    { time: '0851:44', from: 'IRONHIDE', to: 'ALL', msg: 'Perimeter secure. Weapons hot.', type: 'autobot' },
  ])
  const [from, setFrom] = useState('OPTIMUS PRIME')
  const [to, setTo] = useState('ALL')
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    // Random intercepted Decepticon transmissions
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const msg = INTERCEPTED[Math.floor(Math.random() * INTERCEPTED.length)]
        const parts = msg.split(': ')
        setMessages(prev => [...prev.slice(-20), {
          time: getTime(),
          from: parts[0],
          to: '???',
          msg: parts.slice(1).join(': '),
          type: 'intercepted'
        }])
      }
    }, 12000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  function sendMessage(e) {
    if (e.key !== 'Enter' || !input.trim()) return
    setMessages(prev => [...prev.slice(-20), {
      time: getTime(),
      from,
      to,
      msg: input.trim(),
      type: 'autobot'
    }])
    setInput('')
  }

  return (
    <div className="subspace-comms">
      <div className="panel-label">
        <span className="label-bracket">[</span>
        SUBSPACE COMMUNICATIONS
        <span className="label-bracket">]</span>
        <span className="log-count">{messages.length} TRANSMISSIONS</span>
      </div>

      <div className="comms-scroll" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`comms-entry ${m.type}`}>
            <span className="comms-time">{m.time}</span>
            <span className="comms-from">{m.from}</span>
            <span className="comms-arrow">→</span>
            <span className="comms-to">{m.to}</span>
            <span className="comms-msg">{m.msg}</span>
            {m.type === 'intercepted' && <span className="comms-tag">INTERCEPTED</span>}
          </div>
        ))}
      </div>

      <div className="comms-input-row">
        <select
          className="comms-select"
          value={from}
          onChange={e => setFrom(e.target.value)}
        >
          {AUTOBOTS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <span className="comms-arrow">→</span>
        <select
          className="comms-select"
          value={to}
          onChange={e => setTo(e.target.value)}
        >
          <option value="ALL">ALL</option>
          {AUTOBOTS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <input
          className="comms-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={sendMessage}
          placeholder="TRANSMIT MESSAGE..."
        />
      </div>
    </div>
  )
}