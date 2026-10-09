import type { Mermaid } from 'mermaid'

let mermaidPromise: Promise<Mermaid> | null = null

// Dynamic import is intentional: keeps the large mermaid bundle in its own
// lazily-loaded chunk instead of the main entry.
function loadMermaid(): Promise<Mermaid> {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        fontFamily: 'IBM Plex Mono, monospace',
        themeVariables: {
          primaryColor: '#fbf8f0',
          primaryTextColor: '#16324f',
          primaryBorderColor: '#16324f',
          lineColor: '#1f6f8b',
          secondaryColor: '#f6f2e7',
          tertiaryColor: '#f6f2e7',
          noteBkgColor: '#fbf8f0',
          noteBorderColor: '#9fb0be',
          edgeLabelBackground: '#f6f2e7',
          fontSize: '14px',
        },
      })
      return mermaid
    })
  }
  return mermaidPromise
}

// Keyed by diagram source. Stores the in-flight promise so concurrent
// mounts of the same diagram share one render, and revisiting a module
// (remount) skips mermaid entirely. Failed renders are evicted so a retry
// is possible.
const svgCache = new Map<string, Promise<string>>()

export function renderMermaid(code: string): Promise<string> {
  const cached = svgCache.get(code)
  if (cached) return cached
  const pending = loadMermaid()
    .then((mermaid) => mermaid.render(`mermaid-${Math.random().toString(36).slice(2, 10)}`, code))
    .then(({ svg }) => svg)
  svgCache.set(code, pending)
  pending.catch(() => svgCache.delete(code))
  return pending
}
