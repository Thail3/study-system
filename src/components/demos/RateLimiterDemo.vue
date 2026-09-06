<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from 'vue'

const capacity = 8
const refillPerSecond = 2
const tokens = ref(capacity)
const log = reactive<{ id: number; allowed: boolean }[]>([])
let logId = 0

const refillTimer = setInterval(() => {
  tokens.value = Math.min(capacity, tokens.value + refillPerSecond * 0.2)
}, 200)

function sendRequest() {
  const allowed = tokens.value >= 1
  if (allowed) tokens.value -= 1
  log.unshift({ id: logId++, allowed })
  if (log.length > 8) log.pop()
}

function burst() {
  for (let i = 0; i < 8; i++) sendRequest()
}

onBeforeUnmount(() => clearInterval(refillTimer))
</script>

<template>
  <div class="rl-demo blueprint-panel">
    <div class="controls">
      <button class="btn" @click="sendRequest">ส่ง 1 request</button>
      <button class="btn" @click="burst">burst 8 requests</button>
    </div>

    <div class="bucket-row">
      <span class="annotation-label">TOKEN BUCKET ({{ Math.floor(tokens) }} / {{ capacity }})</span>
      <div class="bucket">
        <div v-for="i in capacity" :key="i" class="token" :class="{ filled: i <= Math.floor(tokens) }" />
      </div>
    </div>

    <div class="log">
      <span
        v-for="entry in log"
        :key="entry.id"
        class="log-chip"
        :class="entry.allowed ? 'ok' : 'denied'"
      >
        {{ entry.allowed ? '200 OK' : '429' }}
      </span>
    </div>
    <p class="hint annotation-label">
      bucket เติม token {{ refillPerSecond }}/วินาที — ทุก request ใช้ 1 token ถ้า token หมด request ถัดไปโดนปฏิเสธ (429) ทันที ลองกด burst แล้วสังเกต token หมดแล้วค่อยๆ เติมกลับ
    </p>
  </div>
</template>

<style scoped>
.rl-demo {
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
.bucket-row {
  margin-bottom: var(--space-4);
}
.bucket {
  display: flex;
  gap: 4px;
  margin-top: var(--space-2);
}
.token {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1.5px solid var(--line-strong);
  background: var(--paper);
  transition: background 0.15s;
}
.token.filled {
  background: var(--accent);
  border-color: var(--accent-strong);
}
.log {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
  min-height: 28px;
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
.log-chip.denied {
  background: var(--mark-red-wash);
  color: var(--mark-red);
}
.hint {
  margin: 0;
}
</style>
