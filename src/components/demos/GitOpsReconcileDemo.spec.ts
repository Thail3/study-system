import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import GitOpsReconcileDemo from './GitOpsReconcileDemo.vue'

let wrapper: VueWrapper | null = null

afterEach(() => {
  wrapper?.unmount()
  vi.useRealTimers()
  wrapper = null
})

describe('GitOpsReconcileDemo', () => {
  it('starts in sync (actual matches desired)', () => {
    wrapper = mount(GitOpsReconcileDemo)
    expect(wrapper.find('.state-box.drifted').exists()).toBe(false)
  })

  it('drift button sets actual out of sync with desired', async () => {
    wrapper = mount(GitOpsReconcileDemo)
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.state-box.drifted').exists()).toBe(true)
    expect(wrapper.text()).toContain('replicas: 10')
  })

  it('reconcile tick reverts drift back to desired state automatically', async () => {
    vi.useFakeTimers()
    wrapper = mount(GitOpsReconcileDemo)
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.state-box.drifted').exists()).toBe(true)

    await vi.advanceTimersByTimeAsync(2500)
    expect(wrapper.find('.state-box.drifted').exists()).toBe(false)
    expect(wrapper.find('.log-chip.fix').exists()).toBe(true)
  })
})
