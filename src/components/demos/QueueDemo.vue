<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from 'vue'

interface Msg {
  id: number
}
interface Consumer {
  id: number
  busy: boolean
  processed: number
  timer: ReturnType<typeof setInterval> | null
}

let msgId = 1
let consumerId = 1
const queue = reactive<Msg[]>([])
const consumers = reactive<Consumer[]>([])
const autoProducing = ref(false)
let producerTimer: ReturnType<typeof setInterval> | null = null
const pendingTimeouts = new Set<ReturnType<typeof setTimeout>>()

function produce() {
  queue.push({ id: msgId++ })
}

function tickConsumer(c: Consumer) {
  if (c.busy || queue.length === 0) return
  const msg = queue.shift()
  if (!msg) return
  c.busy = true
  const id = setTimeout(() => {
    pendingTimeouts.delete(id)
    c.busy = false
    c.processed++
  }, 900)
  pendingTimeouts.add(id)
}

function addConsumer() {
  if (consumers.length >= 4) return
  consumers.push({ id: consumerId++, busy: false, processed: 0, timer: null })
  const c = consumers[consumers.length - 1]
  c.timer = setInterval(() => tickConsumer(c), 300)
}

function removeConsumer(id: number) {
  const idx = consumers.findIndex((c) => c.id === id)
  if (idx === -1) return
  const c = consumers[idx]
  if (c.timer) clearInterval(c.timer)
  consumers.splice(idx, 1)
}

function toggleAutoProduce() {
  autoProducing.value = !autoProducing.value
  if (autoProducing.value) {
    producerTimer = setInterval(produce, 350)
  } else if (producerTimer) {
    clearInterval(producerTimer)
    producerTimer = null
  }
}

addConsumer()

onBeforeUnmount(() => {
  consumers.forEach((c) => c.timer && clearInterval(c.timer))
  if (producerTimer) clearInterval(producerTimer)
  pendingTimeouts.forEach((id) => clearTimeout(id))
  pendingTimeouts.clear()
})
</script>

<template>
  <div class="queue-demo blueprint-panel">
    <div class="controls">
      <button class="btn" @click="produce">ผลิต 1 message</button>
      <button class="btn" :class="{ active: autoProducing }" @click="toggleAutoProduce">
        {{ autoProducing ? '■ หยุด auto-produce' : '▶ auto-produce' }}
      </button>
      <button class="btn" :disabled="consumers.length >= 4" @click="addConsumer">+ เพิ่ม consumer</button>
    </div>

    <div class="queue-row">
      <span class="annotation-label queue-label">QUEUE ({{ queue.length }})</span>
      <div class="queue-track">
        <div v-for="m in queue.slice(0, 20)" :key="m.id" class="msg-box">{{ m.id }}</div>
        <span v-if="queue.length === 0" class="empty-note">ว่าง</span>
      </div>
    </div>

    <div class="consumers">
      <div v-for="c in consumers" :key="c.id" class="consumer-card" :class="{ busy: c.busy }">
        <p class="annotation-label">CONSUMER {{ c.id }}</p>
        <p class="consumer-state">{{ c.busy ? 'กำลังประมวลผล…' : 'ว่าง' }}</p>
        <p class="consumer-stat">processed: {{ c.processed }}</p>
        <button v-if="consumers.length > 1" class="remove-link" @click="removeConsumer(c.id)">ลบ consumer นี้</button>
      </div>
    </div>
    <p class="hint annotation-label">เพิ่ม consumer แล้วดู queue depth ลดเร็วขึ้น — นี่คือวิธี scale การประมวลผลแบบ async</p>
  </div>
</template>

<style scoped>
.queue-demo {
  padding: var(--space-5);
  margin: var(--space-6) 0;
}
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
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
.btn.active {
  background: var(--accent);
  color: var(--paper-raised);
  border-color: var(--accent);
}
.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.queue-row {
  margin-bottom: var(--space-5);
}
.queue-label {
  display: block;
  margin-bottom: var(--space-2);
}
.queue-track {
  display: flex;
  gap: var(--space-1);
  flex-wrap: wrap;
  min-height: 36px;
  padding: var(--space-2);
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-sm);
}
.msg-box {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-wash);
  border: 1px solid var(--accent-strong);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--accent-strong);
}
.empty-note {
  color: var(--ink-faint);
  font-size: 0.8rem;
  align-self: center;
}
.consumers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.consumer-card {
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: var(--space-3);
  background: var(--paper);
}
.consumer-card.busy {
  border-color: var(--mark-red);
  background: var(--mark-red-wash);
}
.consumer-state {
  margin: var(--space-1) 0;
  font-size: 0.85rem;
}
.consumer-stat {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--ink-soft);
}
.remove-link {
  margin-top: var(--space-2);
  border: none;
  background: none;
  color: var(--mark-red);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  cursor: pointer;
  padding: 0;
}
.hint {
  margin: 0;
}
</style>
