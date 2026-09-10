<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

const loopType = ref<'R' | 'B'>('R')
const startValue = ref(10)
const strength = ref(0.15)
const goal = ref(80)
const running = ref(false)
const history = ref<number[]>([10])
const MAX_HISTORY = 50
const MAX_VALUE = 200

let timer: ReturnType<typeof setInterval> | null = null

function tick() {
  const current = history.value[history.value.length - 1]
  let next: number
  if (loopType.value === 'R') {
    next = current + current * strength.value
  } else {
    next = current + (goal.value - current) * strength.value
  }
  next = Math.max(0, Math.min(MAX_VALUE, next))
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
  timer = setInterval(tick, 350)
}

function reset() {
  if (timer) clearInterval(timer)
  running.value = false
  history.value = [startValue.value]
}

function selectType(t: 'R' | 'B') {
  loopType.value = t
  reset()
}

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

const chartPoints = computed(() => {
  const w = 320
  const h = 120
  const n = history.value.length
  if (n < 2) return ''
  return history.value
    .map((v, i) => {
      const x = (i / (MAX_HISTORY - 1)) * w
      const y = h - (v / MAX_VALUE) * h
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
})

const goalY = computed(() => 120 - (goal.value / MAX_VALUE) * 120)
</script>

<template>
  <div class="loop-sim blueprint-panel">
    <div class="type-toggle">
      <button class="btn" :class="{ active: loopType === 'R' }" @click="selectType('R')">R — Reinforcing</button>
      <button class="btn" :class="{ active: loopType === 'B' }" @click="selectType('B')">B — Balancing</button>
    </div>

    <div class="controls">
      <label class="field">
        <span class="annotation-label">ค่าเริ่มต้น: {{ startValue }}</span>
        <input v-model.number="startValue" type="range" min="1" max="150" step="1" @change="reset" />
      </label>
      <label class="field">
        <span class="annotation-label">loop strength: {{ strength.toFixed(2) }}</span>
        <input v-model.number="strength" type="range" min="0.02" max="0.4" step="0.01" />
      </label>
      <label v-if="loopType === 'B'" class="field">
        <span class="annotation-label">goal: {{ goal }}</span>
        <input v-model.number="goal" type="range" min="10" max="180" step="1" />
      </label>
      <div class="btn-row">
        <button class="btn" @click="toggle">{{ running ? 'หยุด' : 'เริ่มจำลอง' }}</button>
        <button class="btn ghost" @click="reset">reset</button>
      </div>
    </div>

    <svg viewBox="0 0 320 120" class="chart-svg">
      <line v-if="loopType === 'B'" x1="0" :y1="goalY" x2="320" :y2="goalY" class="goal-line" />
      <polyline
        :points="chartPoints"
        fill="none"
        :stroke="loopType === 'R' ? 'var(--mark-red)' : 'var(--accent-strong)'"
        stroke-width="2.5"
      />
    </svg>
    <p class="annotation-label">
      {{
        loopType === 'R'
          ? 'Reinforcing loop: ค่าพุ่งแบบ exponential ไม่มีจุดหยุด ยิ่งเวลาผ่านยิ่งชันขึ้น'
          : 'Balancing loop: ค่าไล่เข้าหาเส้น goal (ประ) แล้วนิ่งอยู่ตรงนั้น'
      }}
    </p>
  </div>
</template>

<style scoped>
.loop-sim {
  padding: var(--space-5);
  margin: var(--space-6) 0;
}
.type-toggle {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
  align-items: flex-end;
}
.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 160px;
}
.field input[type='range'] {
  accent-color: var(--accent-strong);
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
.btn.active {
  background: var(--accent-wash);
  border-color: var(--accent-strong);
  color: var(--accent-strong);
  font-weight: 600;
}
.chart-svg {
  width: 100%;
  max-width: 320px;
  height: 120px;
  display: block;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--paper);
}
.goal-line {
  stroke: var(--ink-faint);
  stroke-width: 1;
  stroke-dasharray: 4 3;
}
</style>
