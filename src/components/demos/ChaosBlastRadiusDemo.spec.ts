import { describe, it, expect, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import ChaosBlastRadiusDemo from './ChaosBlastRadiusDemo.vue'

let wrapper: VueWrapper | null = null

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
})

describe('ChaosBlastRadiusDemo', () => {
  it('round 1 kills exactly 1 pod and passes', async () => {
    wrapper = mount(ChaosBlastRadiusDemo)
    await wrapper.find('button').trigger('click')
    expect(wrapper.findAll('.pod.killed')).toHaveLength(1)
    expect(wrapper.find('.verdict.ok').exists()).toBe(true)
  })

  it('round 3 breaks steady state and aborts, disabling further rounds', async () => {
    wrapper = mount(ChaosBlastRadiusDemo)
    const runBtn = wrapper.find('button')
    await runBtn.trigger('click')
    await runBtn.trigger('click')
    await runBtn.trigger('click')
    expect(wrapper.findAll('.pod.killed')).toHaveLength(7)
    expect(wrapper.find('.verdict.fail').exists()).toBe(true)
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('reset clears aborted state and killed pods', async () => {
    wrapper = mount(ChaosBlastRadiusDemo)
    const buttons = wrapper.findAll('button')
    const runBtn = buttons[0]
    const resetBtn = buttons[1]
    await runBtn.trigger('click')
    await runBtn.trigger('click')
    await runBtn.trigger('click')
    expect(wrapper.find('.verdict.fail').exists()).toBe(true)

    await resetBtn.trigger('click')
    expect(wrapper.findAll('.pod.killed')).toHaveLength(0)
    expect(wrapper.find('.verdict.fail').exists()).toBe(false)
  })
})
