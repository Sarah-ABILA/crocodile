import { useState } from 'react'
import './App.css'

const COLORS = ['#1D9E75','#0F6E56','#3db369','#27a862','#139e5a','#085041']
const HISTORY_KEY = 'crocodile_history'

const loadHistory = () => {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [] }
  catch { return [] }
}

function CrocoSVG({ color, open }) {
  return (
    <svg viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg" className="croco-svg">
      <rect x="10" y="28" width="70" height="34" rx="12" fill={color}/>
      <rect x="14" y="36" width="62" height="18" rx="8" fill="#a8e6c4"/>
      <rect x="5" y="50" width="22" height="10" rx="5" fill={color}/>
      <rect x="63" y="50" width="22" height="10" rx="5" fill={color}/>
      <rect x="14" y="54" width="14" height="14" rx="5" fill={color}/>
      <rect x="62" y="54" width="14" height="14" rx="5" fill={color}/>
      <rect x="20" y="18" width="50" height="16" rx="8" fill={color}/>
      {open && <rect x="20" y="34" width="50" height="10" rx="5" fill={color}/>}
      <circle cx="58" cy="22" r="7" fill="white" stroke={color} strokeWidth="1"/>
      <circle cx="58" cy="22" r="4" fill="#1a3a2a"/>
      <circle cx="60" cy="20" r="1.2" fill="white"/>
      {open && <>
        <rect x="28" y="30" width="6" height="8" rx="2" fill="white"/>
        <rect x="40" y="30" width="6" height="8" rx="2" fill="white"/>
        <rect x="52" y="30" width="6" height="8" rx="2" fill="white"/>
      </>}
      <rect x="60" y="14" width="18" height="8" rx="4" fill={color}/>
      <rect x="68" y="10" width="8" height="6" rx="3" fill={color}/>
    </svg>
  )
}

export default function App() {
  const [screen, setScreen] = useState('setup')
  const [input, setInput] = useState('')
  const [names, setNames] = useState([])
  const [loser, setLoser] = useState('')
  const [revealed, setRevealed] = useState({})
  const [suspense, setSuspense] = useState(false)
  const [history, setHistory] = useState(loadHistory)

  const addName = () => {
    const val = input.trim()
    if (!val || names.includes(val) || names.length >= 12) return
    setNames([...names, val])
    setInput('')
  }

  const removeName = (n) => setNames(names.filter(x => x !== n))

  const lancerTirage = () => {
    if (names.length < 2) return
    setSuspense(true)
    setTimeout(() => {
      const picked = names[Math.floor(Math.random() * names.length)]
      const entry = { loser: picked, names: [...names], date: new Date().toLocaleDateString('fr-FR') }
      const newHistory = [entry, ...loadHistory()].slice(0, 20)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
      setHistory(newHistory)
      setLoser(picked)
      setRevealed({})
      setSuspense(false)
      setScreen('result')
    }, 2500)
  }

  const clickCroco = (name) => {
    if (revealed[name]) return
    setRevealed(r => ({ ...r, [name]: name === loser ? 'pay' : 'nopay' }))
  }

  const restart = () => {
    setNames([])
    setInput('')
    setLoser('')
    setRevealed({})
    setScreen('setup')
  }

  if (screen === 'history') return (
    <div className="screen">
      <div className="croco-big">📋</div>
      <h1>Historique</h1>
      <div className="history-list">
        {history.map((entry, i) => (
          <div key={i} className="history-item">
            <span className="history-date">{entry.date}</span>
            <span className="history-loser">🐊 {entry.loser}</span>
            <span className="history-names">{entry.names.join(', ')}</span>
          </div>
        ))}
      </div>
      <button className="btn-main" onClick={() => setScreen('setup')}>Retour</button>
    </div>
  )

  if (screen === 'setup') return (
    <div className="screen">
      <div className="croco-big">🐊</div>
      <h1>Crocodile</h1>
      <p className="subtitle">Qui paye la tournée ?</p>
      <div className="input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addName()}
          placeholder="Ajouter un pote..."
          maxLength={20}
        />
        <button className="btn-main" onClick={addName}>Ajouter</button>
      </div>
      <div className="tags">
        {names.map(n => (
          <span key={n} className="tag">
            {n}
            <button onClick={() => removeName(n)}>×</button>
          </span>
        ))}
      </div>
      {names.length >= 2 && (
        <button
          className={`btn-main big ${suspense ? 'shaking' : ''}`}
          onClick={lancerTirage}
          disabled={suspense}
        >
          {suspense ? 'Le croco choisit... 🐊' : 'Lancer le tirage 🎲'}
        </button>
      )}
      {history.length > 0 && (
        <button className="btn-history" onClick={() => setScreen('history')}>
          Historique ({history.length}) 📋
        </button>
      )}
    </div>
  )

  return (
    <div className="screen">
      <div className="croco-big">🐊</div>
      <h1>Le croco a décidé !</h1>
      <div className="loser-name">{loser}</div>
      <p className="subtitle">doit payer la tournée !</p>
      <div className="croco-grid">
        {names.map((n, i) => {
          const rev = revealed[n]
          const isLoser = n === loser
          const color = rev === 'pay' ? '#e24b4a' : rev === 'nopay' ? '#3db369' : COLORS[i % COLORS.length]
          return (
            <div key={n} className="croco-card" onClick={() => clickCroco(n)}>
              <CrocoSVG color={color} open={rev === 'pay'} />
              <div className="croco-name">{n}{isLoser && !rev ? ' 🎯' : ''}</div>
              {rev === 'pay' && <span className="badge-pay">Je paye 💸</span>}
              {rev === 'nopay' && <span className="badge-nopay">Tranquille ✓</span>}
            </div>
          )
        })}
      </div>
      <p className="hint">Chaque pote clique sur son croco</p>
      <button className="btn-main" onClick={restart}>Recommencer</button>
    </div>
  )
}
