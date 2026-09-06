<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from 'vue'

interface Attempt {
  n: number
  waitedMs: number
  status: 'waiting' | 'failed' | 'success'
}

const attempts = reactive<Attempt[]>([])
const running = ref(false)
const successChance = ref(0.25)
let timer: ReturnType<typeof setTimeout> | null = null

function reset() {
  if (timer) clearTimeout(timer)
  attempts.splice(0, attempts.length)
  running.value = false
}

function scheduleNext(attemptNumber: number) {
  const waitMs = attemptNumber === 1 ? 0 : Math.min(8000, 500 * 2 ** (attemptNumber - 2))
  attempts.push({ n: attemptNumber, waitedMs: waitMs, status: 'waiting' })
  const record = attempts[attempts.length - 1]

  timer = setTimeout(() => {
    const succeeded = Math.random() < successChance.value
    record.status = succeeded ? 'success' : 'failed'
    if (succeeded || attemptNumber >= 6) {
      running.value = false
    } else {
      scheduleNext(attemptNumber + 1)
    }
  }, waitMs)
}

function start() {
  if (running.value) return
  reset()
  running.value = true
  scheduleNext(1)
}

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div class="backoff-demo blueprint-panel">
    <div class="controls">
      <button class="btn" :disabled="running" @click="start">จำลอง request (ล้มเหลวแบบสุ่ม)</button>
      <button class="btn ghost" @click="reset">reset</button>
    </div>

    <div class="timeline">
      <div v-for="a in attempts" :key="a.n" class="attempt" :class="a.status">
        <p class="annotation-label">ครั้งที่ {{ a.n }}</p>
        <p class="attempt-wait">{{ a.n === 1 ? 'ทันที' : `รอ ${a.waitedMs / 1000}s ก่อน` }}</p>
        <p class="attempt-status">
          {{ a.status === 'waiting' ? 'กำลังรอ/ลอง…' : a.status === 'success' ? '✓ สำเร็จ' : '✕ ล้มเหลว' }}
        </p>
      </div>
      <p v-if="!attempts.length" class="placeholder">กด "จำลอง request" เพื่อดูช่วงเวลารอที่ยืดขึ้นเรื่อยๆ ทุกครั้งที่ล้มเหลว</p>
    </div>
  </div>
</template>

<style scoped>
.backoff-demo {
  padding: var(--space-5);
  margin: var(--space-6) 0;
}
.controls {
  display: flex;
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
.btn.ghost {
  border-color: var(--line-strong);
  color: var(--ink-soft);
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.timeline {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: flex-end;
}
.attempt {
  flex: 0 0 auto;
  min-width: 110px;
  border: 1.5px solid var(--line-strong);
  border-radius: var(--radius-sm);
  padding: var(--space-3);
  background: var(--paper);
  text-align: center;
}
.attempt.waiting {
  border-color: var(--accent);
  background: var(--accent-wash);
}
.attempt.success {
  border-color: var(--mark-green);
  background: var(--mark-green-wash);
}
.attempt.failed {
  border-color: var(--mark-red);
  background: var(--mark-red-wash);
}
.attempt-wait {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  margin: var(--space-1) 0;
}
.attempt-status {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  margin: 0;
  color: var(--ink-soft);
}
.placeholder {
  color: var(--ink-faint);
  font-style: italic;
  font-size: 0.85rem;
}
</style>
