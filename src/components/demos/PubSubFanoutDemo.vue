<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from 'vue'

interface Sub {
  id: number
  name: string
  status: 'idle' | 'working' | 'done'
  tookMs: number
}

const subs = reactive<Sub[]>([
  { id: 1, name: 'Email Service', status: 'idle', tookMs: 0 },
  { id: 2, name: 'Analytics', status: 'idle', tookMs: 0 },
  { id: 3, name: 'Notification', status: 'idle', tookMs: 0 },
])

const mode = ref<'sequential' | 'parallel'>('parallel')
const running = ref(false)
const totalMs = ref<number | null>(null)
const timers: ReturnType<typeof setTimeout>[] = []

function randomWork() {
  return 400 + Math.random() * 900
}

function reset() {
  timers.forEach((t) => clearTimeout(t))
  timers.length = 0
  subs.forEach((s) => {
    s.status = 'idle'
    s.tookMs = 0
  })
  running.value = false
  totalMs.value = null
}

async function publish() {
  if (running.value) return
  reset()
  running.value = true
  const start = performance.now()

  if (mode.value === 'parallel') {
    subs.forEach((s) => {
      s.status = 'working'
      const work = randomWork()
      const t = setTimeout(() => {
        s.status = 'done'
        s.tookMs = Math.round(work)
        if (subs.every((x) => x.status === 'done')) {
          totalMs.value = Math.round(performance.now() - start)
          running.value = false
        }
      }, work)
      timers.push(t)
    })
  } else {
    for (const s of subs) {
      s.status = 'working'
      const work = randomWork()
      await new Promise<void>((resolve) => {
        const t = setTimeout(() => {
          s.status = 'done'
          s.tookMs = Math.round(work)
          resolve()
        }, work)
        timers.push(t)
      })
    }
    totalMs.value = Math.round(performance.now() - start)
    running.value = false
  }
}

onBeforeUnmount(() => timers.forEach((t) => clearTimeout(t)))
</script>

<template>
  <div class="pubsub-demo blueprint-panel">
    <div class="controls">
      <label class="control-item">
        <span class="annotation-label">โหมด</span>
        <select v-model="mode" class="mode-select" :disabled="running">
          <option value="parallel">ส่งพร้อมกัน (Pub/Sub)</option>
          <option value="sequential">ส่งทีละคน (เรียกตรง)</option>
        </select>
      </label>
      <button class="btn" :disabled="running" @click="publish">Publish Event</button>
      <button class="btn ghost" @click="reset">reset</button>
    </div>

    <div class="publisher">
      <span class="annotation-label">user.registered event</span>
    </div>

    <div class="subs">
      <div v-for="s in subs" :key="s.id" class="sub-card" :class="s.status">
        <p class="annotation-label">{{ s.name }}</p>
        <p class="sub-state">
          {{ s.status === 'idle' ? 'รอ event' : s.status === 'working' ? 'กำลังทำงาน…' : `เสร็จแล้ว (${s.tookMs}ms)` }}
        </p>
      </div>
    </div>

    <p v-if="totalMs !== null" class="result-text">
      รวมเวลาทั้งหมด: {{ totalMs }}ms ({{ mode === 'parallel' ? 'ทุกคนทำงานพร้อมกัน ใช้เวลาเท่ากับตัวที่ช้าสุดตัวเดียว' : 'รอทีละคนจบก่อนค่อยเริ่มคนถัดไป เวลารวมกันหมด' }})
    </p>
    <p v-else class="result-text placeholder">ลองสลับโหมดแล้วกด Publish เทียบเวลารวมดู</p>
  </div>
</template>

<style scoped>
.pubsub-demo {
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
.control-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.mode-select {
  font-family: var(--font-mono);
  font-size: 0.8rem;
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
}
.btn.ghost {
  border-color: var(--line-strong);
  color: var(--ink-soft);
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.publisher {
  text-align: center;
  padding: var(--space-2);
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-4);
}
.subs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.sub-card {
  border: 1.5px solid var(--line-strong);
  border-radius: var(--radius-sm);
  padding: var(--space-3);
  text-align: center;
  background: var(--paper);
  transition:
    border-color 0.2s,
    background 0.2s;
}
.sub-card.working {
  border-color: var(--accent);
  background: var(--accent-wash);
}
.sub-card.done {
  border-color: var(--mark-green);
  background: var(--mark-green-wash);
}
.sub-state {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  margin: var(--space-1) 0 0;
  color: var(--ink-soft);
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
