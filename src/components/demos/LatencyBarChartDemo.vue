<script setup lang="ts">
import { computed, ref } from 'vue'

interface Op {
  name: string
  ns: number
  timeLabel: string
}

const OPS: Op[] = [
  { name: 'L1 Cache (CPU)', ns: 1, timeLabel: '~1ns' },
  { name: 'RAM', ns: 100, timeLabel: '~100ns' },
  { name: 'Compress 1KB', ns: 10_000, timeLabel: '~10μs' },
  { name: 'SSD', ns: 100_000, timeLabel: '~100μs' },
  { name: 'Round-trip DC เดียวกัน', ns: 500_000, timeLabel: '~500μs' },
  { name: 'HDD (จานหมุน)', ns: 10_000_000, timeLabel: '~10ms' },
  { name: 'Round-trip ข้าม region', ns: 150_000_000, timeLabel: '~150ms' },
]

const MAX_LOG = Math.log10(OPS[OPS.length - 1].ns)
const MIN_WIDTH_PCT = 4

function widthPct(ns: number): number {
  return Math.max(MIN_WIDTH_PCT, (Math.log10(ns) / MAX_LOG) * 100)
}

const selected = ref<number[]>([])

function toggleSelect(i: number) {
  const idx = selected.value.indexOf(i)
  if (idx !== -1) {
    selected.value.splice(idx, 1)
    return
  }
  if (selected.value.length >= 2) selected.value.shift()
  selected.value.push(i)
}

const comparisonText = computed(() => {
  if (selected.value.length < 2) return ''
  const [a, b] = selected.value
  const opA = OPS[a]
  const opB = OPS[b]
  const slower = opA.ns >= opB.ns ? opA : opB
  const faster = opA.ns >= opB.ns ? opB : opA
  const ratio = slower.ns / faster.ns
  const ratioText = ratio >= 1000 ? `${Math.round(ratio).toLocaleString()} เท่า` : `${ratio.toFixed(1)} เท่า`
  return `${slower.name} ช้ากว่า ${faster.name} ประมาณ ${ratioText}`
})
</script>

<template>
  <div class="latency-demo blueprint-panel">
    <div class="bars">
      <div
        v-for="(op, i) in OPS"
        :key="op.name"
        class="bar-row"
        :class="{ selected: selected.includes(i) }"
        tabindex="0"
        role="button"
        :aria-label="`เลือก ${op.name} เพื่อเทียบ`"
        :aria-pressed="selected.includes(i)"
        @click="toggleSelect(i)"
        @keydown.enter="toggleSelect(i)"
        @keydown.space.prevent="toggleSelect(i)"
      >
        <p class="bar-label annotation-label">{{ op.name }}</p>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: widthPct(op.ns) + '%' }" />
        </div>
        <p class="bar-time">{{ op.timeLabel }}</p>
      </div>
    </div>

    <p v-if="comparisonText" class="result-text">{{ comparisonText }}</p>
    <p v-else class="hint annotation-label">คลิกเลือก 2 แถวเพื่อเทียบว่าอันไหนช้ากว่ากี่เท่า</p>
  </div>
</template>

<style scoped>
.latency-demo {
  padding: var(--space-5);
  margin: var(--space-6) 0;
}
.bars {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}
.bar-row {
  display: grid;
  grid-template-columns: 160px 1fr 70px;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  cursor: pointer;
}
.bar-row:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.bar-row.selected {
  border-color: var(--accent);
  background: var(--accent-wash);
}
.bar-label {
  margin: 0;
}
.bar-track {
  height: 14px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--paper);
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: var(--accent);
}
.bar-row.selected .bar-fill {
  background: var(--accent-strong);
}
.bar-time {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--ink-soft);
  text-align: right;
}
.result-text {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  margin: 0;
}
.hint {
  margin: 0;
}
</style>
