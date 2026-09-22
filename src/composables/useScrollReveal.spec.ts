import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, nextTick, useTemplateRef } from 'vue'
import { mount } from '@vue/test-utils'
import { useScrollReveal } from './useScrollReveal'

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = []
  callback: IntersectionObserverCallback
  observed: Element | null = null
  disconnected = false
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    FakeIntersectionObserver.instances.push(this)
  }
  observe(el: Element) {
    this.observed = el
  }
  disconnect() {
    this.disconnected = true
  }
  unobserve() {}
  trigger(isIntersecting: boolean) {
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
  }
}

function makeHost(active: boolean) {
  return defineComponent({
    setup() {
      const target = useTemplateRef<HTMLDivElement>('target')
      return { target, ...useScrollReveal(target, active) }
    },
    template: `<div ref="target">
      <button class="replay" @click="replay">replay</button>
      <span class="revealed">{{ revealed }}</span>
      <span class="token">{{ replayToken }}</span>
    </div>`,
  })
}

describe('useScrollReveal', () => {
  beforeEach(() => {
    FakeIntersectionObserver.instances = []
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('stays unrevealed until the target intersects', async () => {
    const wrapper = mount(makeHost(true))
    await nextTick()
    expect(wrapper.find('.revealed').text()).toBe('false')

    FakeIntersectionObserver.instances[0].trigger(true)
    await nextTick()
    expect(wrapper.find('.revealed').text()).toBe('true')
  })

  it('disconnects the observer after the first reveal', async () => {
    const wrapper = mount(makeHost(true))
    await nextTick()
    const observer = FakeIntersectionObserver.instances[0]
    observer.trigger(true)
    await nextTick()
    expect(observer.disconnected).toBe(true)
    wrapper.unmount()
  })

  it('never observes when inactive', async () => {
    mount(makeHost(false))
    await nextTick()
    expect(FakeIntersectionObserver.instances).toHaveLength(0)
  })

  it('replay bumps replayToken without resetting revealed', async () => {
    const wrapper = mount(makeHost(true))
    await nextTick()
    FakeIntersectionObserver.instances[0].trigger(true)
    await nextTick()
    await wrapper.find('.replay').trigger('click')
    expect(wrapper.find('.token').text()).toBe('1')
    expect(wrapper.find('.revealed').text()).toBe('true')
  })

  it('disconnects on unmount even before a reveal fires', async () => {
    const wrapper = mount(makeHost(true))
    await nextTick()
    const observer = FakeIntersectionObserver.instances[0]
    wrapper.unmount()
    expect(observer.disconnected).toBe(true)
  })
})
