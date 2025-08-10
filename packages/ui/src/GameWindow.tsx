import React, { useEffect, useRef } from 'react'
import { Application, Container, Graphics } from 'pixi.js'
import type { World } from '@monstertactics/sim'
import { makeWorld, step } from '@monstertactics/sim'
import { axialToPixel } from './hex'

export interface GameWindowProps {
  hexSize?: number
  showGrid?: boolean
  background?: number // Pixi color (0xRRGGBB)
}

const ensureRootStyles = () => {
  // Make the canvas fill viewport without default margins
  if (typeof document !== 'undefined') {
    const styleId = 'mt-root-style'
    if (!document.getElementById(styleId)) {
      const s = document.createElement('style')
      s.id = styleId
      s.textContent = `html, body, #root { height: 100%; }
        body { margin: 0; overflow: hidden; }` 
      document.head.appendChild(s)
    }
  }
}

export const GameWindow: React.FC<GameWindowProps> = ({ hexSize = 32, showGrid = true, background = 0x0b1020 }) => {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const appRef = useRef<Application | null>(null)
  const worldRef = useRef<World | null>(null)
  const unitGfxRef = useRef<Graphics | null>(null)

  useEffect(() => {
    ensureRootStyles()
    const host = hostRef.current!

    // Initialize Pixi application sized to container
    const app = new Application()
    appRef.current = app

    ;(async () => {
      await app.init({
        background,
        resizeTo: host, // auto-resize with container
        antialias: true,
      })
      host.appendChild(app.canvas)

      // World bootstrap using current size
      const bounds = { width: app.renderer.width, height: app.renderer.height }
      const world = makeWorld(bounds)
      worldRef.current = world

      // Stage containers
      const stage = new Container()
      app.stage.addChild(stage)

      // Optional: static grid background
      if (showGrid) {
        const grid = new Graphics()
        drawHexGrid(grid, bounds.width, bounds.height, hexSize)
        stage.addChild(grid)
      }

      // Demo unit graphic (circle placeholder)
      const u = new Graphics()
      u.circle(0, 0, 16).fill(0xffffff).stroke({ width: 2, color: 0x222222 })
      stage.addChild(u)
      unitGfxRef.current = u

      // Ticker: advance world and render positions
      app.ticker.add((ticker) => {
        const dt = ticker.deltaMS / 1000 // seconds
        if (!worldRef.current) return
        step(worldRef.current, dt)
        const main = worldRef.current.units[0]
        if (main && unitGfxRef.current) {
          unitGfxRef.current.position.set(main.pos.x, main.pos.y)
        }
      })

      // Resize: keep world bounds in sync (basic)
      const handleResize = () => {
        if (!worldRef.current) return
        worldRef.current.bounds.width = app.renderer.width
        worldRef.current.bounds.height = app.renderer.height
      }
      const ro = new ResizeObserver(handleResize)
      ro.observe(host)

      return () => {
        ro.disconnect()
      }
    })()

    return () => {
      // Cleanup Pixi
      try {
        const app = appRef.current
        if (app) {
          app.destroy()
        }
        if (host && host.firstChild === app?.canvas) host.removeChild(app.canvas)
      } catch {}
    }
  }, [hexSize, showGrid, background])

  return <div ref={hostRef} style={{ width: '100%', height: '100vh' }} />
}

function drawHexGrid(g: Graphics, w: number, h: number, size: number) {
  g.clear()
  g.stroke({ width: 1, color: 0x1b2a4a, alpha: 0.8 })
  // Draw a small region of axial coords around origin to fill the screen
  const radius = Math.ceil(Math.max(w, h) / (size * 1.5))
  for (let q = -radius; q <= radius; q++) {
    for (let r = -radius; r <= radius; r++) {
      const { x, y } = axialToPixel({ q, r }, size)
      if (x < -size || x > w + size || y < -size || y > h + size) continue
      hexPath(g, x, y, size)
    }
  }
}

function hexPath(g: Graphics, cx: number, cy: number, size: number) {
  // flat-top hex
  const pts: Array<[number, number]> = []
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 180 * (60 * i)
    const x = cx + size * Math.cos(angle)
    const y = cy + size * Math.sin(angle)
    pts.push([x, y])
  }
  g.poly(pts.flat()).closePath()
}