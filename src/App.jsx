import { useState, useEffect } from 'react'
import Header from './components/Header'
import SystemDiagnostics from './components/SystemDiagnostics'
import EarthMonitor from './components/EarthMonitor'
import AutobotRoster from './components/AutobotRoster'
import MissionLog from './components/MissionLog'
import JazzMaskPanel from './components/JazzMaskPanel'
import VisionPanel from './components/VisionPanel'
import AmbientSound from './components/AmbientSound'
import './App.css'

export default function App() {
  const [threatLevel, setThreatLevel] = useState('MINIMAL')

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen()
        } else {
          document.exitFullscreen()
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className="teletraan">
      <div className="crt-screen">
        <Header />

        <main className="dashboard-grid">
          <aside className="panel panel-left">
            <SystemDiagnostics onThreatChange={(t) => {
              document.documentElement.style.setProperty('--threat-color', t.color)
              setThreatLevel(t.level)
            }} />
          </aside>

          <section className="panel panel-center">
            <EarthMonitor />
          </section>

          <aside className="panel panel-right">
            <AutobotRoster />
          </aside>

          <aside className="panel panel-jazz">
            <JazzMaskPanel />
          </aside>

          <aside className="panel panel-vision">
            <VisionPanel />
          </aside>

          <footer className="panel panel-bottom">
            <MissionLog />
          </footer>
        </main>

        <div className="corner-bracket tl" />
        <div className="corner-bracket tr" />
        <div className="corner-bracket bl" />
        <div className="corner-bracket br" />
      </div>

      <div className="crt-overlay" aria-hidden="true" />
      <div className="crt-vignette" aria-hidden="true" />
      <AmbientSound threatLevel={threatLevel} />
    </div>
  )
}