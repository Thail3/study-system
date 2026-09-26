<script setup lang="ts">
import { reactive } from 'vue'

interface Req {
  id: number
  outcome: 'ok' | 'error'
  headKept: boolean
  tailKept: boolean
}

const requests = reactive<Req[]>([])
let reqId = 0

function fireRequest() {
  const outcome: Req['outcome'] = Math.random() < 0.2 ? 'error' : 'ok'
  // head-based: ต้องตัดสินใจก่อนรู้ผลลัพธ์ — สุ่มเก็บ 20% โดยไม่รู้ว่า outcome คืออะไร
  const headKept = Math.random() < 0.2
  // tail-based: รู้ผลลัพธ์ก่อนตัดสินใจ — error เก็บเสมอ, ok สุ่มเก็บ 20%
  const tailKept = outcome === 'error' ? true : Math.random() < 0.2
  requests.unshift({ id: reqId++, outcome, headKept, tailKept })
  if (requests.length > 8) requests.pop()
}

const errorCount = () => requests.filter((r) => r.outcome === 'error').length
const headCaughtCount = () => requests.filter((r) => r.outcome === 'error' && r.headKept).length
const tailCaughtCount = () => requests.filter((r) => r.outcome === 'error' && r.tailKept).length
</script>

<template>
  <div class="sampling-demo blueprint-panel">
    <div class="controls">
      <button class="btn" @click="fireRequest">ยิง Request ใหม่</button>
    </div>

    <div class="tally">
      <span class="annotation-label">Error ที่เกิดจริง: {{ errorCount() }}</span>
      <span class="annotation-label head">Head-based เก็บ Error ได้: {{ headCaughtCount() }}/{{ errorCount() }}</span>
      <span class="annotation-label tail">Tail-based เก็บ Error ได้: {{ tailCaughtCount() }}/{{ errorCount() }}</span>
    </div>

    <div class="lanes">
      <div class="lane">
        <p class="lane-title annotation-label">Head-based (ตัดสินใจก่อนรู้ผล)</p>
        <div v-for="r in requests" :key="'h' + r.id" class="req" :class="[r.outcome, { kept: r.headKept }]">
          #{{ r.id }} {{ r.outcome === 'error' ? 'ERROR' : 'ok' }} — {{ r.headKept ? 'เก็บ' : 'ทิ้ง' }}
        </div>
      </div>
      <div class="lane">
        <p class="lane-title annotation-label">Tail-based (รอผลก่อนตัดสินใจ)</p>
        <div v-for="r in requests" :key="'t' + r.id" class="req" :class="[r.outcome, { kept: r.tailKept }]">
          #{{ r.id }} {{ r.outcome === 'error' ? 'ERROR' : 'ok' }} — {{ r.tailKept ? 'เก็บ' : 'ทิ้ง' }}
        </div>
      </div>
    </div>
    <p class="hint annotation-label">
      ยิง request หลายๆครั้ง — สังเกตว่า Tail-based เก็บ trace ที่เป็น Error ได้ครบ 100% เสมอ ส่วน Head-based เก็บได้แค่บางส่วนเพราะตัดสินใจก่อนรู้ผลลัพธ์
    </p>
  </div>
</template>

<style scoped>
.sampling-demo {
  padding: var(--space-5);
  margin: var(--space-6) 0;
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
.tally {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
  margin-bottom: var(--space-4);
}
.tally .head {
  color: var(--mark-red);
}
.tally .tail {
  color: var(--mark-green);
}
.lanes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}
.lane-title {
  margin: 0 0 var(--space-2);
}
.req {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-1);
  background: var(--grid-line-strong);
  color: var(--ink-faint);
}
.req.kept {
  color: var(--ink);
  background: var(--accent-wash);
}
.req.error.kept {
  background: var(--mark-red-wash);
  color: var(--mark-red);
  font-weight: 600;
}
.req.error:not(.kept) {
  color: var(--mark-red);
}
.hint {
  margin: var(--space-4) 0 0;
}
@media (max-width: 560px) {
  .lanes {
    grid-template-columns: 1fr;
  }
}
</style>
