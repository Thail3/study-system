<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from 'vue'

interface Replica {
  id: number
  value: string
  synced: boolean
}

const replicas = reactive<Replica[]>([
  { id: 1, value: 'เก่า', synced: true },
  { id: 2, value: 'เก่า', synced: true },
  { id: 3, value: 'เก่า', synced: true },
])

const writing = ref(false)
const elapsedMs = ref(0)
const windowClosedMs = ref<number | null>(null)
let startTime = 0
let tickTimer: ReturnType<typeof setInterval> | null = null
const timers: ReturnType<typeof setTimeout>[] = []

const syncedCount = () => replicas.filter((r) => r.synced).length

function write() {
  if (writing.value) return
  writing.value = true
  windowClosedMs.value = null
  elapsedMs.value = 0
  startTime = performance.now()

  replicas.forEach((r) => (r.synced = false))

  tickTimer = setInterval(() => {
    elapsedMs.value = Math.round(performance.now() - startTime)
  }, 50)

  replicas.forEach((r) => {
    const delay = 300 + Math.random() * 1400
    const t = setTimeout(() => {
      r.value = 'ใหม่'
      r.synced = true
      if (syncedCount() === replicas.length) {
        windowClosedMs.value = Math.round(performance.now() - startTime)
        if (tickTimer) clearInterval(tickTimer)
        writing.value = false
      }
    }, delay)
    timers.push(t)
  })
}

function reset() {
  if (tickTimer) clearInterval(tickTimer)
  timers.forEach((t) => clearTimeout(t))
  timers.length = 0
  replicas.forEach((r) => {
    r.value = 'เก่า'
    r.synced = true
  })
  writing.value = false
  elapsedMs.value = 0
  windowClosedMs.value = null
}

onBeforeUnmount(() => {
  if (tickTimer) clearInterval(tickTimer)
  timers.forEach((t) => clearTimeout(t))
})
</script>

<template>
  <div class="ec-demo blueprint-panel">
    <div class="controls">
      <button class="btn" :disabled="writing" @click="write">เขียนค่าใหม่</button>
      <button class="btn ghost" @click="reset">reset</button>
      <span class="annotation-label">{{ syncedCount() }}/{{ replicas.length }} replica sync แล้ว — {{ elapsedMs }}ms</span>
    </div>

    <div class="replicas">
      <div v-for="r in replicas" :key="r.id" class="replica-card" :class="{ pending: !r.synced }">
        <p class="annotation-label">REPLICA {{ r.id }}</p>
        <p class="replica-value">{{ r.value }}</p>
        <p class="replica-state">{{ r.synced ? '✓ ตรงกันแล้ว' : '… ยังไม่ sync' }}</p>
      </div>
    </div>

    <p v-if="windowClosedMs !== null" class="result-text">
      inconsistency window ปิดแล้ว — ทุก replica ตรงกันหลังผ่านไป {{ windowClosedMs }}ms
    </p>
    <p v-else-if="!writing" class="result-text placeholder">กด "เขียนค่าใหม่" ดู replica แต่ละตัวค่อยๆ sync ไม่พร้อมกัน</p>
  </div>
</template>

<style scoped>
.ec-demo {
  padding: var(--space-5);
  margin: var(--space-6) 0;
}
.controls {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
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
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.replicas {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.replica-card {
  border: 1.5px solid var(--mark-green);
  background: var(--mark-green-wash);
  border-radius: var(--radius-sm);
  padding: var(--space-3);
  text-align: center;
  transition:
    border-color 0.2s,
    background 0.2s;
}
.replica-card.pending {
  border-color: var(--line-strong);
  background: var(--paper);
}
.replica-value {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  font-weight: 600;
  margin: var(--space-1) 0;
}
.replica-state {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--ink-soft);
  margin: 0;
}
.result-text {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  margin: 0;
}
.result-text.placeholder {
  color: var(--ink-faint);
  font-style: italic;
}
</style>
