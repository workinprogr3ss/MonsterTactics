import React from 'react'
import { createRoot } from 'react-dom/client'
import { GameWindow } from '@monstertactics/ui'

function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <GameWindow hexSize={28} showGrid />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)