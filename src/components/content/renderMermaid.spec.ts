import { describe, it, expect, vi, beforeEach } from 'vitest'

const render = vi.fn()
// Dynamic `import('./renderMermaid')` below is intentional: the module holds a
// process-wide cache, so each test needs a fresh module instance (resetModules).
vi.mock('mermaid', () => ({ default: { initialize: vi.fn(), render } }))

describe('renderMermaid', () => {
  beforeEach(() => {
    vi.resetModules()
    render.mockReset()
  })

  it('renders identical diagram source once, including concurrent requests', async () => {
    render.mockResolvedValue({ svg: '<svg>a</svg>' })
    const { renderMermaid } = await import('./renderMermaid')
    const [a, b] = await Promise.all([renderMermaid('graph TD; A-->B'), renderMermaid('graph TD; A-->B')])
    const c = await renderMermaid('graph TD; A-->B')
    expect([a, b, c]).toEqual(['<svg>a</svg>', '<svg>a</svg>', '<svg>a</svg>'])
    expect(render).toHaveBeenCalledTimes(1)
  })

  it('does not cache a failed render, so a later retry can succeed', async () => {
    render.mockRejectedValueOnce(new Error('parse error')).mockResolvedValueOnce({ svg: '<svg>ok</svg>' })
    const { renderMermaid } = await import('./renderMermaid')
    await expect(renderMermaid('bad')).rejects.toThrow('parse error')
    await expect(renderMermaid('bad')).resolves.toBe('<svg>ok</svg>')
  })
})
