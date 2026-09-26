import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import SamplingRaceDemo from './SamplingRaceDemo.vue'

let wrapper: VueWrapper | null = null

afterEach(() => {
  wrapper?.unmount()
  vi.restoreAllMocks()
  wrapper = null
})

function mockRandomSequence(values: number[]) {
  let i = 0
  vi.spyOn(Math, 'random').mockImplementation(() => values[i++ % values.length])
}

describe('SamplingRaceDemo', () => {
  it('tail-based always keeps an error request even when its own random roll would drop it', async () => {
    // call#1 (outcome) = 0.1 -> < 0.2 -> error
    // call#2 (headKept) = 0.9 -> not < 0.2 -> dropped
    // tailKept short-circuits to true for an error outcome, no 3rd random call consumed
    mockRandomSequence([0.1, 0.9])
    wrapper = mount(SamplingRaceDemo)
    await wrapper.find('button').trigger('click')

    const reqEls = wrapper.findAll('.req')
    expect(reqEls[0].classes()).toContain('error')
    expect(reqEls[0].classes()).not.toContain('kept')
    expect(reqEls[1].classes()).toContain('error')
    expect(reqEls[1].classes()).toContain('kept')
  })

  it('tally shows tail-based catching 100% of errors while head-based can miss them', async () => {
    mockRandomSequence([0.1, 0.9])
    wrapper = mount(SamplingRaceDemo)
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('Tail-based เก็บ Error ได้: 1/1')
    expect(wrapper.text()).toContain('Head-based เก็บ Error ได้: 0/1')
  })
})
