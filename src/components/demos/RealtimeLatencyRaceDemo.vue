<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from 'vue'

interface Technique {
  name: string
  delayMs: number
  progress: number
}

const POLL_INTERVAL_MS = 2000
const ANIM_SCALE = 0.5

const techniques = reactive<Technique[]>([
  { name: 'Short Polling (ทุก 2 วิ)', delayMs: 0, progress: 0 },
  { name: 'Long Polling', delayMs: 0, progress: 0 },
  { name: 'SSE', delayMs: 0, progress: 0 },
  { name: 'WebSocket', delayMs: 0, progress: 0 },
])

const running = ref(false)
const revealed = ref(false)
let rafHandle: number | null = null

function randomDelays(): number[] {
  const eventOffset = Math.random() * POLL_INTERVAL_MS
  return [
    Math.round(POLL_INTERVAL_MS - eventOffset),
    Math.round(120 + Math.random() * 60),
    Math.round(40 + Math.random() * 30),
    Math.round(20 + Math.random() * 20),
  ]
}

function trigger() {
  if (running.value) return
  running.value = true
  revealed.value = false

  const delays = randomDelays()
  techniques.forEach((t, i) => {
    t.delayMs = delays[i]
    t.progress = 0
  })

  const start = performance.now()
  const maxDuration = Math.max(...delays) * ANIM_SCALE

  function tick(now: number) {
    const elapsed = now - start
    techniques.forEach((t) => {
      const dur = t.delayMs * ANIM_SCALE
      t.progress = dur === 0 ? 100 : Math.min(100, (elapsed / dur) * 100)
    })
    if (elapsed < maxDuration) {
      rafHandle = requestAnimationFrame(tick)
    } else {
      techniques.forEach((t) => (t.progress = 100))
      revealed.value = true
      running.value = false
      rafHandle = null
    }
  }
  rafHandle = requestAnimationFrame(tick)
}

function isSlow(t: Technique): boolean {
  return t.delayMs >= 500
}

onBeforeUnmount(() => {
  if (rafHandle) cancelAnimationFrame(rafHandle)
})
</script>

<template>
  <div class="realtime-demo blueprint-panel">
    <div class="controls">
      <button class="btn" :disabled="running" @click="trigger">จำลอง event ใหม่จาก server (เวลาสุ่ม)</button>
    </div>

    <div class="lanes">
      <div v-for="t in techniques" :key="t.name" class="lane">
        <p class="lane-name annotation-label">{{ t.name }}</p>
        <div class="lane-track">
          <div class="lane-fill" :class="{ slow: isSlow(t) }" :style="{ width: t.progress + '%' }" />
        </div>
        <p v-if="revealed" class="lane-ms annotation-label" :class="{ slow: isSlow(t) }">{{ t.delayMs }}ms กว่าจะรู้ตัว</p>
      </div>
    </div>
    <p class="hint annotation-label">
      กด "จำลอง event ใหม่" ดูว่าแต่ละวิธีรู้ตัวว่ามี event ใหม่ช้า/เร็วต่างกันแค่ไหน (event เกิดเวลาสุ่ม ระหว่างรอบ poll)
    </p>
  </div>
</template>

<style scoped>
.realtime-demo {
  padding: var(--space-5);
  margin: var(--space-6) 0;
}
.controls {
  display: flex;
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
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.lanes {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.lane-name {
  margin: 0 0 var(--space-1);
}
.lane-track {
  height: 18px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--paper);
  overflow: hidden;
}
.lane-fill {
  height: 100%;
  background: var(--mark-green);
  transition: background 0.2s;
}
.lane-fill.slow {
  background: var(--mark-red);
}
.lane-ms {
  margin: var(--space-1) 0 0;
  color: var(--ink-soft);
}
.lane-ms.slow {
  color: var(--mark-red);
}
.hint {
  margin: 0;
}
</style>
