<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

interface ServerNode {
  id: number
  healthy: boolean
  active: number
  total: number
}

interface Particle {
  id: number
  serverId: number
  p0: { x: number; y: number }
  p1: { x: number; y: number }
  p2: { x: number; y: number }
  start: number
  duration: number
  x: number
  y: number
}

type Algorithm = 'round-robin' | 'least-connections' | 'random'

const servers = reactive<ServerNode[]>([
  { id: 1, healthy: true, active: 0, total: 0 },
  { id: 2, healthy: true, active: 0, total: 0 },
  { id: 3, healthy: true, active: 0, total: 0 },
])
let nextServerId = 4
let rrCounter = 0
let particleId = 0

const algorithm = ref<Algorithm>('round-robin')
const particles = reactive<Particle[]>([])
const autoRunning = ref(false)
const errorFlash = ref(false)
let autoTimer: ReturnType<typeof setInterval> | null = null
let rafHandle: number | null = null
const pendingTimeouts = new Set<ReturnType<typeof setTimeout>>()

function runAfter(fn: () => void, delay: number) {
  const id = setTimeout(() => {
    pendingTimeouts.delete(id)
    fn()
  }, delay)
  pendingTimeouts.add(id)
}

const algoLabel: Record<Algorithm, string> = {
  'round-robin': 'Round Robin — วนลำดับเท่าๆ กัน',
  'least-connections': 'Least Connections — ส่งไปเครื่องที่ว่างสุด',
  random: 'Random — สุ่มเครื่องใดก็ได้',
}

const height = computed(() => 40 + servers.length * 90 + 20)
const lbCenterY = computed(() => height.value / 2)

function serverCenterY(i: number) {
  return 40 + i * 90 + 30
}

function pickServer(): ServerNode | null {
  const healthy = servers.filter((s) => s.healthy)
  if (!healthy.length) return null
  if (algorithm.value === 'round-robin') {
    const target = healthy[rrCounter % healthy.length]
    rrCounter++
    return target
  }
  if (algorithm.value === 'least-connections') {
    return healthy.reduce((min, s) => (s.active < min.active ? s : min), healthy[0])
  }
  return healthy[Math.floor(Math.random() * healthy.length)]
}

function dispatch() {
  const target = pickServer()
  if (!target) {
    errorFlash.value = true
    runAfter(() => {
      errorFlash.value = false
    }, 600)
    return
  }
  const index = servers.findIndex((s) => s.id === target.id)
  target.active++
  target.total++

  particles.push({
    id: particleId++,
    serverId: target.id,
    p0: { x: 130, y: lbCenterY.value },
    p1: { x: 195, y: (lbCenterY.value + serverCenterY(index)) / 2 },
    p2: { x: 260, y: serverCenterY(index) },
    start: performance.now(),
    duration: 550,
    x: 130,
    y: lbCenterY.value,
  })

  const processingTime = 700 + Math.random() * 700
  runAfter(() => {
    target.active = Math.max(0, target.active - 1)
  }, processingTime)
}

function bezier(p0: number, p1: number, p2: number, t: number) {
  const mt = 1 - t
  return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2
}

function tick(now: number) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    const t = Math.min(1, (now - p.start) / p.duration)
    p.x = bezier(p.p0.x, p.p1.x, p.p2.x, t)
    p.y = bezier(p.p0.y, p.p1.y, p.p2.y, t)
    if (t >= 1) particles.splice(i, 1)
  }
  rafHandle = requestAnimationFrame(tick)
}

function toggleHealth(id: number) {
  const s = servers.find((s) => s.id === id)
  if (s) s.healthy = !s.healthy
}

function addServer() {
  if (servers.length >= 6) return
  servers.push({ id: nextServerId++, healthy: true, active: 0, total: 0 })
}

function removeServer(id: number) {
  if (servers.length <= 2) return
  const idx = servers.findIndex((s) => s.id === id)
  if (idx !== -1) servers.splice(idx, 1)
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].serverId === id) particles.splice(i, 1)
  }
}

function toggleAuto() {
  autoRunning.value = !autoRunning.value
  if (autoRunning.value) {
    autoTimer = setInterval(dispatch, 450)
  } else if (autoTimer) {
    clearInterval(autoTimer)
    autoTimer = null
  }
}

function resetCounters() {
  servers.forEach((s) => {
    s.active = 0
    s.total = 0
  })
}

onMounted(() => {
  rafHandle = requestAnimationFrame(tick)
})
onBeforeUnmount(() => {
  if (autoTimer) clearInterval(autoTimer)
  if (rafHandle) cancelAnimationFrame(rafHandle)
  pendingTimeouts.forEach((id) => clearTimeout(id))
  pendingTimeouts.clear()
})
</script>

<template>
  <div class="lb-demo blueprint-panel">
    <div class="controls">
      <label class="control-item">
        <span class="annotation-label">Algorithm</span>
        <select v-model="algorithm" class="algo-select">
          <option value="round-robin">Round Robin</option>
          <option value="least-connections">Least Connections</option>
          <option value="random">Random</option>
        </select>
      </label>
      <button class="btn" @click="dispatch">ส่ง 1 request</button>
      <button class="btn" :class="{ active: autoRunning }" @click="toggleAuto">
        {{ autoRunning ? '■ หยุด auto' : '▶ auto-send' }}
      </button>
      <button class="btn" :disabled="servers.length >= 6" @click="addServer">+ เพิ่ม server</button>
      <button class="btn ghost" @click="resetCounters">reset ตัวนับ</button>
    </div>
    <p class="algo-desc annotation-label">{{ algoLabel[algorithm] }}</p>

    <svg :viewBox="`0 0 360 ${height}`" xmlns="http://www.w3.org/2000/svg" class="lb-svg">
      <rect x="20" :y="lbCenterY - 30" width="110" height="60" fill="var(--paper-raised)" stroke="var(--ink)" stroke-width="2" />
      <text x="75" :y="lbCenterY - 4" text-anchor="middle" class="node-label strong">Load</text>
      <text x="75" :y="lbCenterY + 14" text-anchor="middle" class="node-label strong">Balancer</text>
      <text v-if="errorFlash" x="75" :y="lbCenterY + 45" text-anchor="middle" class="error-label">✕ no healthy server</text>

      <g v-for="(s, i) in servers" :key="s.id">
        <path
          :d="`M130,${lbCenterY} C195,${lbCenterY} 195,${serverCenterY(i)} 260,${serverCenterY(i)}`"
          fill="none"
          :stroke="s.healthy ? 'var(--ink-faint)' : 'var(--mark-red)'"
          stroke-width="1.2"
          :stroke-dasharray="s.healthy ? '' : '3 4'"
        />
        <rect
          x="260"
          :y="serverCenterY(i) - 30"
          width="100"
          height="60"
          :fill="s.healthy ? 'var(--paper-raised)' : 'var(--mark-red-wash)'"
          stroke="var(--ink)"
          stroke-width="1.5"
          class="server-rect"
          tabindex="0"
          role="button"
          :aria-label="`toggle server ${s.id} healthy status`"
          @click="toggleHealth(s.id)"
          @keydown.enter="toggleHealth(s.id)"
          @keydown.space.prevent="toggleHealth(s.id)"
        />
        <text :x="310" :y="serverCenterY(i) - 8" text-anchor="middle" class="node-label">Server {{ s.id }}</text>
        <text :x="310" :y="serverCenterY(i) + 10" text-anchor="middle" class="mono-label">
          active {{ s.active }} · total {{ s.total }}
        </text>
        <text v-if="!s.healthy" :x="310" :y="serverCenterY(i) + 25" text-anchor="middle" class="error-label">unhealthy</text>
        <text
          v-if="servers.length > 2"
          :x="352"
          :y="serverCenterY(i) - 34"
          text-anchor="middle"
          class="remove-btn"
          tabindex="0"
          role="button"
          :aria-label="`remove server ${s.id}`"
          @click="removeServer(s.id)"
          @keydown.enter="removeServer(s.id)"
          @keydown.space.prevent="removeServer(s.id)"
        >
          ×
        </text>
      </g>

      <circle v-for="p in particles" :key="p.id" :cx="p.x" :cy="p.y" r="5" fill="var(--accent)" />
    </svg>
    <p class="hint annotation-label">คลิกกล่อง server เพื่อ toggle healthy/unhealthy (จำลอง server ล่ม) — คลิก × เพื่อลบ server</p>
  </div>
</template>

<style scoped>
.lb-demo {
  padding: var(--space-5);
  margin: var(--space-6) 0;
}
.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
}
.control-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.algo-select {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  padding: var(--space-1) var(--space-2);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--paper);
  color: var(--ink);
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
  transition:
    background 0.15s,
    color 0.15s;
}
.btn:hover:not(:disabled) {
  background: var(--accent-wash);
}
.btn.active {
  background: var(--accent);
  color: var(--paper-raised);
  border-color: var(--accent);
}
.btn.ghost {
  border-color: var(--line-strong);
  color: var(--ink-soft);
}
.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.algo-desc {
  margin: 0 0 var(--space-3);
}
.lb-svg {
  width: 100%;
  height: auto;
  display: block;
}
.node-label {
  font-family: var(--font-mono);
  font-size: 12px;
  fill: var(--ink);
}
.node-label.strong {
  font-size: 14px;
  font-weight: 600;
}
.mono-label {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--ink-soft);
}
.error-label {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--mark-red);
}
.server-rect {
  cursor: pointer;
}
.server-rect:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.remove-btn {
  font-family: var(--font-mono);
  font-size: 14px;
  fill: var(--mark-red);
  cursor: pointer;
}
.remove-btn:focus-visible {
  outline: 2px solid var(--mark-red);
  outline-offset: 2px;
}
.hint {
  margin-top: var(--space-3);
}
</style>
