import { describe, it, expect, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import LoadBalancerDemo from './LoadBalancerDemo.vue'

let wrapper: VueWrapper | null = null

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
})

function findByText(w: VueWrapper, text: string) {
  const match = w.findAll('button').find((b) => b.text().includes(text))
  if (!match) throw new Error(`button with text "${text}" not found`)
  return match
}

describe('LoadBalancerDemo', () => {
  it('round robin distributes requests evenly across healthy servers', async () => {
    wrapper = mount(LoadBalancerDemo)
    const sendBtn = findByText(wrapper, 'ส่ง 1 request')
    for (let i = 0; i < 6; i++) {
      await sendBtn.trigger('click')
    }
    const totals = wrapper.findAll('.mono-label').map((n) => n.text())
    expect(totals).toHaveLength(3)
    totals.forEach((t) => expect(t).toContain('total 2'))
  })

  it('excludes an unhealthy server from routing', async () => {
    wrapper = mount(LoadBalancerDemo)
    const serverRects = wrapper.findAll('.server-rect')
    await serverRects[0].trigger('click') // mark server 1 unhealthy

    const sendBtn = findByText(wrapper, 'ส่ง 1 request')
    for (let i = 0; i < 6; i++) {
      await sendBtn.trigger('click')
    }

    expect(wrapper.findAll('.error-label').some((l) => l.text() === 'unhealthy')).toBe(true)
    const totals = wrapper.findAll('.mono-label').map((n) => n.text())
    expect(totals[0]).toContain('total 0')
  })

  it('flashes an error and sends nothing when every server is unhealthy', async () => {
    wrapper = mount(LoadBalancerDemo)
    const serverRects = wrapper.findAll('.server-rect')
    for (const rect of serverRects) {
      await rect.trigger('click')
    }
    const sendBtn = findByText(wrapper, 'ส่ง 1 request')
    await sendBtn.trigger('click')
    expect(wrapper.text()).toContain('no healthy server')
  })
})
