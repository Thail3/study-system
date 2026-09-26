<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from 'vue'

const desired = 3
const actual = ref(desired)
const tickPulse = ref(false)
const log = reactive<{ id: number; text: string; kind: 'drift' | 'fix' }[]>([])
let logId = 0
let reconcileTimer: ReturnType<typeof setInterval> | null = null

function pushLog(text: string, kind: 'drift' | 'fix') {
  log.unshift({ id: logId++, text, kind })
  if (log.length > 5) log.pop()
}

function causeDrift() {
  if (actual.value === desired) {
    actual.value = 10
    pushLog(`วิศวกร kubectl edit → replicas = ${actual.value} (ไม่ผ่าน Git)`, 'drift')
  }
}

function reconcileTick() {
  tickPulse.value = true
  setTimeout(() => (tickPulse.value = false), 300)
  if (actual.value !== desired) {
    actual.value = desired
    pushLog(`Reconciler: actual ไม่ตรง Git → ปรับกลับเป็น ${desired}`, 'fix')
  }
}

reconcileTimer = setInterval(reconcileTick, 2500)

onBeforeUnmount(() => {
  if (reconcileTimer) clearInterval(reconcileTimer)
})
</script>

<template>
  <div class="gitops-demo blueprint-panel">
    <div class="state-row">
      <div class="state-box">
        <p class="annotation-label">Git (Desired State)</p>
        <p class="value">replicas: {{ desired }}</p>
      </div>
      <div class="reconciler" :class="{ pulse: tickPulse }">
        <span class="dot" />
        Reconciler
      </div>
      <div class="state-box" :class="{ drifted: actual !== desired }">
        <p class="annotation-label">Cluster (Actual State)</p>
        <p class="value">replicas: {{ actual }}</p>
      </div>
    </div>

    <div class="controls">
      <button class="btn" :disabled="actual !== desired" @click="causeDrift">
        จำลอง: แก้ Cluster ตรงๆ (kubectl edit)
      </button>
    </div>

    <div class="log">
      <span v-for="entry in log" :key="entry.id" class="log-chip" :class="entry.kind">{{ entry.text }}</span>
    </div>
    <p class="hint annotation-label">
      Reconciler วนเช็คทุก 2.5 วิ (จุดกระพริบ) — กดปุ่มเพื่อจำลองมีคนแก้ cluster ตรงๆ แล้วดู reconciler รอบถัดไปปรับ actual กลับเป็น desired อัตโนมัติ
    </p>
  </div>
</template>

<style scoped>
.gitops-demo {
  padding: var(--space-5);
  margin: var(--space-6) 0;
}
.state-row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}
.state-box {
  flex: 1 1 140px;
  padding: var(--space-3) var(--space-4);
  border: 1.5px solid var(--line-strong);
  border-radius: var(--radius-sm);
  text-align: center;
}
.state-box.drifted {
  border-color: var(--mark-red);
  background: var(--mark-red-wash);
}
.state-box .value {
  font-family: var(--font-mono);
  font-weight: 600;
  margin: var(--space-1) 0 0;
}
.reconciler {
  flex: 0 0 auto;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--ink-soft);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-strong);
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.reconciler.pulse .dot {
  transform: scale(1.8);
  opacity: 0.5;
}
.controls {
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
  opacity: 0.4;
  cursor: not-allowed;
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
.log-chip.drift {
  background: var(--mark-red-wash);
  color: var(--mark-red);
}
.log-chip.fix {
  background: var(--mark-green-wash);
  color: var(--mark-green);
}
.hint {
  margin: 0;
}
</style>
