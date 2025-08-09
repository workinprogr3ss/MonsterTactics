import React from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  return (
    <div style={{fontFamily:'system-ui', padding:16}}>
      <h1>MonsterTactics</h1>
      <p>Web client scaffold is up. Connect to packages/sim, content packs, and ai-npc next.</p>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
