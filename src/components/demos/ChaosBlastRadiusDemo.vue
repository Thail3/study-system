<script setup lang="ts">
import { computed, ref } from 'vue'

const POD_COUNT = 9
interface Round {
  label: string
  killCount: number
  breaks: boolean
}
const rounds: Round[] = [
  { label: 'Round 1: kill pod เดียว (11%)', killCount: 1, breaks: false },
  { label: 'Round 2: kill 3 pod (33%)', killCount: 3, breaks: false },
  { label: 'Round 3: kill 7 pod (78%)', killCount: 7, breaks: true },
]

const roundIndex = ref(-1)
const aborted = ref(false)

const currentRound = computed(() => (roundIndex.value >= 0 ? rounds[roundIndex.value] : null))
const killedCount = computed(() => currentRound.value?.killCount ?? 0)
const isDone = computed(() => roundIndex.value >= rounds.length - 1)

function runNextRound() {
  if (aborted.value || isDone.value) return
  roundIndex.value++
  if (rounds[roundIndex.value].breaks) aborted.value = true
}

function reset() {
  roundIndex.value = -1
  aborted.value = false
}
</script>

<template>
  <div class="chaos-demo blueprint-panel">
    <div class="pod-grid">
      <div v-for="i in POD_COUNT" :key="i" class="pod" :class="{ killed: i <= killedCount }">
        {{ i <= killedCount ? '✕' : 'OK' }}
      </div>
    </div>

    <p v-if="currentRound" class="annotation-label round-label">{{ currentRound.label }}</p>
    <p v-else class="annotation-label round-label">ยังไม่เริ่มทดลอง</p>

    <div class="verdict" :class="aborted ? 'fail' : roundIndex >= 0 ? 'ok' : ''">
      <template v-if="aborted">Steady State หลุดเกณฑ์ — Abort ทดลองทันที</template>
      <template v-else-if="roundIndex >= 0">Steady State ยังอยู่ในเกณฑ์ — ผ่าน</template>
      <template v-else>กด "Run Round" เพื่อเริ่มทดลองจาก blast radius เล็กสุด</template>
    </div>

    <div class="controls">
      <button class="btn" :disabled="aborted || isDone" @click="runNextRound">Run Round →</button>
      <button class="btn ghost" @click="reset">Reset</button>
    </div>
    <p class="hint annotation-label">
      ไล่ขยาย blast radius ทีละ round — round ไหนหลุดเกณฑ์ (แดง) คือจุดที่เจอขอบเขตความทนทานจริงของระบบ ต้อง Abort ไม่ขยายต่อ
    </p>
  </div>
</template>

<style scoped>
.chaos-demo {
  padding: var(--space-5);
  margin: var(--space-6) 0;
}
.pod-grid {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}
.pod {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--line-strong);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--mark-green);
  background: var(--mark-green-wash);
  transition: background 0.3s ease, color 0.3s ease;
}
.pod.killed {
  color: var(--mark-red);
  background: var(--mark-red-wash);
  border-color: var(--mark-red);
}
.round-label {
  margin: 0 0 var(--space-2);
}
.verdict {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-4);
  background: var(--grid-line-strong);
  color: var(--ink-soft);
}
.verdict.ok {
  background: var(--mark-green-wash);
  color: var(--mark-green);
}
.verdict.fail {
  background: var(--mark-red-wash);
  color: var(--mark-red);
  font-weight: 600;
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
  opacity: 0.4;
  cursor: not-allowed;
}
.hint {
  margin: 0;
}
</style>
