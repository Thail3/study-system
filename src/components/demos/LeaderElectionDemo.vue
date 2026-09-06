<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from 'vue'

type NodeRole = 'leader' | 'candidate' | 'follower' | 'down'

interface Node {
  id: number
  alive: boolean
  role: NodeRole
}

const TOTAL = 5
const MAJORITY = Math.floor(TOTAL / 2) + 1
const ELECTION_DELAY_MS = 700

const nodes = reactive<Node[]>(
  Array.from({ length: TOTAL }, (_, i) => ({ id: i, alive: true, role: i === 0 ? 'leader' : 'follower' })),
)
const term = ref(1)
const running = ref(false)
const statusText = ref('')

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

function hasLeader(): boolean {
  return nodes.some((n) => n.role === 'leader')
}

async function runElection() {
  running.value = true
  term.value += 1
  const alive = nodes.filter((n) => n.alive)
  alive.forEach((n) => (n.role = 'candidate'))

  await delay(ELECTION_DELAY_MS)
  if (cancelled) return

  if (alive.length >= MAJORITY) {
    const winner = alive[Math.floor(Math.random() * alive.length)]
    alive.forEach((n) => (n.role = n.id === winner.id ? 'leader' : 'follower'))
    statusText.value = `Node ${winner.id} ชนะเลือกตั้ง (term ${term.value}) — ได้เสียง ${alive.length}/${TOTAL} เกินครึ่งของทั้งหมด จึงเป็น leader ได้`
  } else {
    alive.forEach((n) => (n.role = 'follower'))
    statusText.value = `เลือก leader ไม่ได้ — เหลือ node ที่ยังทำงาน ${alive.length}/${TOTAL} ไม่ถึงเสียงข้างมาก (ต้องการอย่างน้อย ${MAJORITY}) ระบบหยุดรับ write เพื่อกันไม่ให้เกิด split-brain`
  }
  running.value = false
}

function killLeader() {
  if (running.value) return
  const leader = nodes.find((n) => n.role === 'leader')
  if (!leader) return
  leader.alive = false
  leader.role = 'down'
  statusText.value = ''
  void runElection()
}

function reset() {
  cancelled = true
  timers.forEach((t) => clearTimeout(t))
  timers.clear()
  nodes.forEach((n, i) => {
    n.alive = true
    n.role = i === 0 ? 'leader' : 'follower'
  })
  term.value = 1
  statusText.value = ''
  running.value = false
  cancelled = false
}

const ROLE_LABEL: Record<NodeRole, string> = {
  leader: 'LEADER',
  candidate: 'candidate…',
  follower: 'follower',
  down: 'down',
}

onBeforeUnmount(() => {
  cancelled = true
  timers.forEach((t) => clearTimeout(t))
  timers.clear()
})
</script>

<template>
  <div class="election-demo blueprint-panel">
    <div class="controls">
      <button class="btn" :disabled="running || !hasLeader()" @click="killLeader">ทำให้ Leader หายไปกะทันหัน</button>
      <button class="btn ghost" :disabled="running" @click="reset">Reset ระบบ</button>
      <span class="annotation-label">TERM {{ term }}</span>
    </div>

    <div class="nodes">
      <div v-for="n in nodes" :key="n.id" class="node-box" :class="n.role">
        <p class="node-id">Node {{ n.id }}</p>
        <p class="node-role annotation-label">{{ ROLE_LABEL[n.role] }}</p>
      </div>
    </div>

    <p v-if="statusText" class="result-text">{{ statusText }}</p>
    <p v-else class="hint annotation-label">
      กด "ทำให้ Leader หายไปกะทันหัน" ดูว่า node ที่เหลือเลือก leader ใหม่ยังไง — กดซ้ำหลายครั้งจนเหลือ node ไม่ถึงเสียงข้างมาก (3 จาก 5) ดูว่าเกิดอะไรขึ้น
    </p>
  </div>
</template>

<style scoped>
.election-demo {
  padding: var(--space-5);
  margin: var(--space-6) 0;
}
.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
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
.nodes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.node-box {
  flex: 1 1 100px;
  min-width: 100px;
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
.node-id {
  margin: 0 0 var(--space-1);
  font-weight: 600;
}
.node-role {
  margin: 0;
}
.node-box.leader {
  border-color: var(--mark-green);
  background: var(--mark-green-wash);
  color: var(--mark-green);
}
.node-box.candidate {
  border-color: var(--accent);
  background: var(--accent-wash);
  color: var(--accent-strong);
}
.node-box.down {
  border-style: dashed;
  border-color: var(--mark-red);
  color: var(--mark-red);
  opacity: 0.7;
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
