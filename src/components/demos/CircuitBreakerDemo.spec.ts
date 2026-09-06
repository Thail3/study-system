import { describe, it, expect, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import CircuitBreakerDemo from './CircuitBreakerDemo.vue'

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

describe('CircuitBreakerDemo', () => {
  it('stays closed for fewer than 3 consecutive failures', async () => {
    wrapper = mount(CircuitBreakerDemo)
    const failBtn = findByText(wrapper, 'ล้มเหลว')
    await failBtn.trigger('click')
    await failBtn.trigger('click')
    expect(wrapper.find('.state-box.active').text()).toBe('CLOSED')
  })

  it('trips open after 3 consecutive failures', async () => {
    wrapper = mount(CircuitBreakerDemo)
    const failBtn = findByText(wrapper, 'ล้มเหลว')
    await failBtn.trigger('click')
    await failBtn.trigger('click')
    await failBtn.trigger('click')
    expect(wrapper.find('.state-box.active').text()).toBe('OPEN')
  })

  it('rejects immediately without calling downstream while open', async () => {
    wrapper = mount(CircuitBreakerDemo)
    const failBtn = findByText(wrapper, 'ล้มเหลว')
    const okBtn = findByText(wrapper, 'สำเร็จ')
    await failBtn.trigger('click')
    await failBtn.trigger('click')
    await failBtn.trigger('click')
    expect(wrapper.find('.state-box.active').text()).toBe('OPEN')

    await okBtn.trigger('click')
    expect(wrapper.find('.log-chip').text()).toContain('ปฏิเสธทันที')
    expect(wrapper.find('.state-box.active').text()).toBe('OPEN')
  })

  it('a success call resets the failure counter', async () => {
    wrapper = mount(CircuitBreakerDemo)
    const failBtn = findByText(wrapper, 'ล้มเหลว')
    const okBtn = findByText(wrapper, 'สำเร็จ')
    await failBtn.trigger('click')
    await failBtn.trigger('click')
    await okBtn.trigger('click')
    await failBtn.trigger('click')
    await failBtn.trigger('click')
    // 2 failures again after reset, not yet at threshold of 3 -> still closed
    expect(wrapper.find('.state-box.active').text()).toBe('CLOSED')
  })
})
