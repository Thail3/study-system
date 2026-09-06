<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from 'vue'

type State = 'closed' | 'open' | 'half-open'
const state = ref<State>('closed')
const failureCount = ref(0)
const threshold = 3
const openDurationMs = 4000
const log = reactive<{ id: number; text: string; kind: 'ok' | 'fail' | 'rejected' }[]>([])
let logId = 0
let openTimer: ReturnType<typeof setTimeout> | null = null

function pushLog(text: string, kind: 'ok' | 'fail' | 'rejected') {
  log.unshift({ id: logId++, text, kind })
  if (log.length > 6) log.pop()
}

function tripOpen() {
  state.value = 'open'
  if (openTimer) clearTimeout(openTimer)
  openTimer = setTimeout(() => {
    state.value = 'half-open'
  }, openDurationMs)
}

function call(success: boolean) {
  if (state.value === 'open') {
    pushLog('ปฏิเสธทันที — ไม่เรียก downstream (fail fast)', 'rejected')
    return
  }
  if (success) {
    pushLog('เรียกสำเร็จ', 'ok')
    failureCount.value = 0
    if (state.value === 'half-open') state.value = 'closed'
    return
  }
  pushLog('เรียกล้มเหลว', 'fail')
  if (state.value === 'half-open') {
    tripOpen()
    return
  }
  failureCount.value++
  if (failureCount.value >= threshold) tripOpen()
}

onBeforeUnmount(() => {
  if (openTimer) clearTimeout(openTimer)
})
</script>

<template>
  <div class="cb-demo blueprint-panel">
    <div class="states">
      <div class="state-box" :class="{ active: state === 'closed' }">CLOSED</div>
      <div class="arrow">→</div>
      <div class="state-box" :class="{ active: state === 'open' }">OPEN</div>
      <div class="arrow">→</div>
      <div class="state-box" :class="{ active: state === 'half-open' }">HALF-OPEN</div>
    </div>
    <p class="annotation-label state-note">
      failures ติดกัน: {{ failureCount }}/{{ threshold }}
      <span v-if="state === 'open'"> — จะลอง half-open ใน {{ openDurationMs / 1000 }} วิ</span>
    </p>

    <div class="controls">
      <button class="btn ok" @click="call(true)">เรียก downstream (สำเร็จ)</button>
      <button class="btn fail" @click="call(false)">เรียก downstream (ล้มเหลว)</button>
    </div>

    <div class="log">
      <span v-for="entry in log" :key="entry.id" class="log-chip" :class="entry.kind">{{ entry.text }}</span>
    </div>
    <p class="hint annotation-label">
      กดล้มเหลวติดกัน {{ threshold }} ครั้ง → breaker เปิด (OPEN) หยุดยิงไป downstream ทันที รอ {{ openDurationMs / 1000 }} วิ
      แล้วจะเข้า HALF-OPEN ให้ลอง 1 request — สำเร็จกลับเป็น CLOSED, ล้มเหลวกลับไป OPEN ใหม่
    </p>
  </div>
</template>

<style scoped>
.cb-demo {
  padding: var(--space-5);
  margin: var(--space-6) 0;
}
.states {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
  flex-wrap: wrap;
}
.state-box {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  padding: var(--space-2) var(--space-4);
  border: 1.5px solid var(--line-strong);
  border-radius: var(--radius-sm);
  color: var(--ink-soft);
}
.state-box.active {
  border-color: var(--accent);
  background: var(--accent-wash);
  color: var(--accent-strong);
  font-weight: 600;
}
.arrow {
  color: var(--ink-faint);
}
.state-note {
  margin: 0 0 var(--space-4);
}
.controls {
  display: flex;
  gap: var(--space-2);
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
.btn.ok:hover {
  background: var(--mark-green-wash);
}
.btn.fail:hover {
  background: var(--mark-red-wash);
}
.log {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
  min-height: 24px;
}
.log-chip {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}
.log-chip.ok {
  background: var(--mark-green-wash);
  color: var(--mark-green);
}
.log-chip.fail {
  background: var(--mark-red-wash);
  color: var(--mark-red);
}
.log-chip.rejected {
  background: var(--grid-line-strong);
  color: var(--ink-soft);
}
.hint {
  margin: 0;
}
</style>
