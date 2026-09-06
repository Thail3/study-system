<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from 'vue'

type StepStatus = 'pending' | 'running' | 'success' | 'failed' | 'compensating' | 'compensated'

interface SagaStep {
  name: string
  status: StepStatus
}

const STEP_NAMES = ['Reserve Flight', 'Reserve Hotel', 'Reserve Car']
const STEP_DELAY_MS = 550

const steps = reactive<SagaStep[]>(STEP_NAMES.map((name) => ({ name, status: 'pending' })))
const running = ref(false)
const resultText = ref('')

// Clearing a pending delay()'s own timer already stops its Promise from
// resolving, so `cancelled` is currently unreachable dead code on its own —
// keep it anyway as a guard for any future `await` added after this one.
let cancelled = false
const timers = new Set<ReturnType<typeof setTimeout>>()

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    const t = setTimeout(() => {
      timers.delete(t)
      resolve()
    }, ms)
    timers.add(t)
  })
}

function resetSteps() {
  steps.forEach((s) => (s.status = 'pending'))
  resultText.value = ''
}

async function runSaga() {
  if (running.value) return
  running.value = true
  resetSteps()

  const failIndex = Math.random() < 0.45 ? Math.floor(Math.random() * steps.length) : -1

  for (let i = 0; i < steps.length; i++) {
    await delay(STEP_DELAY_MS)
    if (cancelled) return
    steps[i].status = 'running'

    await delay(STEP_DELAY_MS)
    if (cancelled) return

    if (i === failIndex) {
      steps[i].status = 'failed'
      for (let j = i - 1; j >= 0; j--) {
        await delay(STEP_DELAY_MS)
        if (cancelled) return
        steps[j].status = 'compensating'
        await delay(STEP_DELAY_MS)
        if (cancelled) return
        steps[j].status = 'compensated'
      }
      resultText.value = `${steps[i].name} ล้มเหลว → compensate ย้อนกลับสำเร็จ ระบบกลับสู่สถานะเดิมก่อนเริ่ม saga`
      running.value = false
      return
    }
    steps[i].status = 'success'
  }
  resultText.value = 'Saga สำเร็จทั้งหมด — จองครบทั้ง flight/hotel/car'
  running.value = false
}

const STATUS_LABEL: Record<StepStatus, string> = {
  pending: 'รอ',
  running: 'กำลังทำ…',
  success: 'สำเร็จ',
  failed: 'ล้มเหลว',
  compensating: 'กำลังยกเลิก…',
  compensated: 'ยกเลิกแล้ว',
}

onBeforeUnmount(() => {
  cancelled = true
  timers.forEach((t) => clearTimeout(t))
  timers.clear()
})
</script>

<template>
  <div class="saga-demo blueprint-panel">
    <div class="controls">
      <button class="btn" :disabled="running" @click="() => void runSaga()">เริ่ม Saga ใหม่ (สุ่มจองทริป)</button>
    </div>

    <div class="steps">
      <div v-for="s in steps" :key="s.name" class="step-box" :class="s.status">
        <p class="step-name">{{ s.name }}</p>
        <p class="step-status annotation-label">{{ STATUS_LABEL[s.status] }}</p>
      </div>
    </div>

    <p v-if="resultText" class="result-text">{{ resultText }}</p>
    <p v-else class="hint annotation-label">กด "เริ่ม Saga ใหม่" — บางครั้งจะสุ่มเจอ step ล้มเหลว แล้วดูว่า step ก่อนหน้าถูก compensate (ยกเลิก) ย้อนกลับตามลำดับยังไง</p>
  </div>
</template>

<style scoped>
.saga-demo {
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
.steps {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.step-box {
  flex: 1 1 140px;
  min-width: 140px;
  border: 1.5px solid var(--line-strong);
  border-radius: var(--radius-sm);
  padding: var(--space-3);
  text-align: center;
  background: var(--paper);
  transition:
    border-color 0.2s,
    background 0.2s,
    color 0.2s;
}
.step-name {
  margin: 0 0 var(--space-1);
  font-weight: 600;
}
.step-status {
  margin: 0;
}
.step-box.running {
  border-color: var(--accent);
  background: var(--accent-wash);
  color: var(--accent-strong);
}
.step-box.success {
  border-color: var(--mark-green);
  background: var(--mark-green-wash);
  color: var(--mark-green);
}
.step-box.failed {
  border-color: var(--mark-red);
  background: var(--mark-red-wash);
  color: var(--mark-red);
}
.step-box.compensating {
  border-style: dashed;
  border-color: var(--mark-red);
  color: var(--mark-red);
}
.step-box.compensated {
  border-style: dashed;
  border-color: var(--line-strong);
  color: var(--ink-faint);
}
.result-text {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  margin: 0;
}
.hint {
  margin: 0;
}
</style>
