<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

const stock = ref(50)
const inflow = ref(8)
const outflow = ref(5)
const running = ref(false)
const history = ref<number[]>([50])
const MAX_HISTORY = 60
const MAX_STOCK = 200

let timer: ReturnType<typeof setInterval> | null = null

function tick() {
  const next = Math.max(0, Math.min(MAX_STOCK, stock.value + inflow.value - outflow.value))
  stock.value = next
  history.value.push(next)
  if (history.value.length > MAX_HISTORY) history.value.shift()
}

function toggle() {
  if (running.value) {
    if (timer) clearInterval(timer)
    running.value = false
    return
  }
  running.value = true
  timer = setInterval(tick, 400)
}

function reset() {
  if (timer) clearInterval(timer)
  running.value = false
  stock.value = 50
  history.value = [50]
}

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

const fillPct = computed(() => Math.round((stock.value / MAX_STOCK) * 100))
const netFlow = computed(() => inflow.value - outflow.value)

const sparkPoints = computed(() => {
  const w = 280
  const h = 60
  const n = history.value.length
  if (n < 2) return ''
  return history.value
    .map((v, i) => {
      const x = (i / (MAX_HISTORY - 1)) * w
      const y = h - (v / MAX_STOCK) * h
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
})
</script>

<template>
  <div class="sf-sim blueprint-panel">
    <div class="sim-layout">
      <svg viewBox="0 0 140 200" class="tank-svg">
        <rect x="20" y="10" width="100" height="170" class="tank-outline" />
        <rect x="21" :y="181 - (fillPct / 100) * 169" width="98" :height="(fillPct / 100) * 169" class="tank-fill" />
        <text x="70" y="196" text-anchor="middle" class="tank-label">stock: {{ Math.round(stock) }}</text>
      </svg>

      <div class="controls">
        <label class="field">
          <span class="annotation-label">Inflow rate: {{ inflow }}/tick</span>
          <input v-model.number="inflow" type="range" min="0" max="20" step="1" />
        </label>
        <label class="field">
          <span class="annotation-label">Outflow rate: {{ outflow }}/tick</span>
          <input v-model.number="outflow" type="range" min="0" max="20" step="1" />
        </label>
        <p class="net-flow" :class="{ pos: netFlow > 0, neg: netFlow < 0 }">
          net flow: {{ netFlow > 0 ? '+' : '' }}{{ netFlow }}/tick
        </p>
        <div class="btn-row">
          <button class="btn" @click="toggle">{{ running ? 'หยุด' : 'เริ่มจำลอง' }}</button>
          <button class="btn ghost" @click="reset">reset</button>
        </div>
      </div>
    </div>

    <svg viewBox="0 0 280 60" class="spark-svg">
      <polyline :points="sparkPoints" fill="none" stroke="var(--accent-strong)" stroke-width="2" />
    </svg>
    <p class="annotation-label">stock level over time — ลองปรับ inflow/outflow แล้วดูว่า stock วิ่งเข้าสู่ค่าคงที่ พุ่งขึ้น หรือดิ่งลง</p>
  </div>
</template>

<style scoped>
.sf-sim {
  padding: var(--space-5);
  margin: var(--space-6) 0;
}
.sim-layout {
  display: flex;
  gap: var(--space-6);
  align-items: center;
  flex-wrap: wrap;
}
.tank-svg {
  width: 110px;
  height: 160px;
  flex: 0 0 auto;
}
.tank-outline {
  fill: none;
  stroke: var(--ink);
  stroke-width: 2;
}
.tank-fill {
  fill: var(--accent-wash);
  stroke: var(--accent-strong);
  stroke-width: 1;
  transition: y 0.3s ease, height 0.3s ease;
}
.tank-label {
  font-family: var(--font-mono);
  font-size: 9px;
  fill: var(--ink-soft);
}
.controls {
  flex: 1 1 220px;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.field input[type='range'] {
  accent-color: var(--accent-strong);
}
.net-flow {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  margin: 0;
  color: var(--ink-soft);
}
.net-flow.pos {
  color: var(--mark-red);
}
.net-flow.neg {
  color: var(--accent-strong);
}
.btn-row {
  display: flex;
  gap: var(--space-2);
}
.btn {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--ink);
  border-radius: var(--radius-sm);
  background: var(--paper-raised);
  color: var(--ink);
  cursor: pointer;
}
.btn.ghost {
  border-color: var(--line-strong);
  color: var(--ink-soft);
}
.spark-svg {
  width: 100%;
  max-width: 280px;
  height: 60px;
  margin-top: var(--space-4);
  display: block;
}
</style>
