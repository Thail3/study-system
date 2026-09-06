<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from 'vue'

interface SpanDef {
  name: string
  start: number
  duration: number
}

interface Span extends SpanDef {
  id: number
  targetWidth: number
  width: number
}

const CHART_WIDTH = 380
const LABEL_WIDTH = 130
const ROW_HEIGHT = 34
const SLOW_THRESHOLD_MS = 150
const ANIM_MS = 500

let spanId = 0
const spans = reactive<Span[]>([])
const selectedId = ref<number | null>(null)
const totalMs = ref(1)
let rafHandle: number | null = null
let animStart = 0

function randomScenario(): SpanDef[] {
  const dbSlow = Math.random() < 0.35
  return [
    { name: 'Load Balancer', start: 0, duration: 5 + Math.round(Math.random() * 5) },
    { name: 'API Gateway', start: 6, duration: 10 + Math.round(Math.random() * 10) },
    { name: 'Auth Service', start: 18, duration: 18 + Math.round(Math.random() * 12) },
    { name: 'Order Service', start: 40 + Math.round(Math.random() * 8), duration: 30 + Math.round(Math.random() * 20) },
    {
      name: 'Database Query',
      start: 75 + Math.round(Math.random() * 10),
      duration: dbSlow ? 160 + Math.round(Math.random() * 90) : 22 + Math.round(Math.random() * 18),
    },
  ]
}

function scale(ms: number) {
  return (ms / totalMs.value) * CHART_WIDTH
}

function tick(now: number) {
  const t = Math.min(1, (now - animStart) / ANIM_MS)
  const eased = 1 - (1 - t) * (1 - t)
  spans.forEach((s) => {
    s.width = s.targetWidth * eased
  })
  if (t < 1) {
    rafHandle = requestAnimationFrame(tick)
  } else {
    rafHandle = null
  }
}

function trigger() {
  selectedId.value = null
  const defs = randomScenario()
  totalMs.value = Math.max(...defs.map((d) => d.start + d.duration)) + 10

  spans.splice(0, spans.length)
  defs.forEach((d) => {
    spans.push({ ...d, id: spanId++, targetWidth: scale(d.duration), width: 0 })
  })

  if (rafHandle) cancelAnimationFrame(rafHandle)
  animStart = performance.now()
  rafHandle = requestAnimationFrame(tick)
}

function spanX(s: Span): number {
  return LABEL_WIDTH + scale(s.start)
}

function isSlow(s: Span): boolean {
  return s.duration >= SLOW_THRESHOLD_MS
}

function toggleSelect(id: number) {
  selectedId.value = selectedId.value === id ? null : id
}

trigger()

onBeforeUnmount(() => {
  if (rafHandle) cancelAnimationFrame(rafHandle)
})
</script>

<template>
  <div class="trace-demo blueprint-panel">
    <div class="controls">
      <button class="btn" @click="trigger">จำลอง request ใหม่</button>
      <span class="annotation-label total-label">Total trace: ~{{ Math.max(...spans.map((s) => s.start + s.duration), 0) }}ms</span>
    </div>

    <svg
      :viewBox="`0 0 ${LABEL_WIDTH + CHART_WIDTH + 130} ${spans.length * ROW_HEIGHT + 10}`"
      xmlns="http://www.w3.org/2000/svg"
      class="trace-svg"
    >
      <g v-for="(s, i) in spans" :key="s.id">
        <text x="0" :y="i * ROW_HEIGHT + 18" class="span-label">{{ s.name }}</text>
        <rect
          :x="spanX(s)"
          :y="i * ROW_HEIGHT + 4"
          :width="Math.max(2, s.width)"
          height="16"
          rx="2"
          class="span-bar"
          :class="{ slow: isSlow(s), selected: selectedId === s.id }"
          tabindex="0"
          role="button"
          :aria-label="`${s.name}: ${s.duration}ms, เริ่มที่ ${s.start}ms`"
          :aria-pressed="selectedId === s.id"
          @click="toggleSelect(s.id)"
          @keydown.enter="toggleSelect(s.id)"
          @keydown.space.prevent="toggleSelect(s.id)"
        />
        <text v-if="selectedId === s.id" :x="spanX(s) + s.width + 8" :y="i * ROW_HEIGHT + 16" class="span-detail">
          {{ s.duration }}ms (เริ่มที่ {{ s.start }}ms)
        </text>
      </g>
    </svg>
    <p class="hint annotation-label">
      คลิกแถบไหนก็ได้เพื่อดูรายละเอียด — แถบสีแดงคือ span ที่ช้าผิดปกติ นี่คือสิ่งที่ distributed tracing ช่วยให้เห็นได้ทันทีว่าคอขวดอยู่ตรงไหน
      โดยไม่ต้องเดา
    </p>
  </div>
</template>

<style scoped>
.trace-demo {
  padding: var(--space-5);
  margin: var(--space-6) 0;
}
.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
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
.trace-svg {
  width: 100%;
  height: auto;
  display: block;
}
.span-label {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--ink-soft);
}
.span-bar {
  fill: var(--accent);
  stroke: var(--accent-strong);
  stroke-width: 1;
  cursor: pointer;
}
.span-bar.slow {
  fill: var(--mark-red-wash);
  stroke: var(--mark-red);
}
.span-bar.selected {
  stroke-width: 2;
}
.span-bar:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.span-detail {
  font-family: var(--font-mono);
  font-size: 9.5px;
  fill: var(--ink-soft);
}
.hint {
  margin: 0;
}
</style>
