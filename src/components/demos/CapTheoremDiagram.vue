<script setup lang="ts">
import { ref, computed } from 'vue'

type Pair = 'cp' | 'ap' | 'ca'
const selected = ref<Pair | null>(null)

const info: Record<Pair, { title: string; body: string; example: string }> = {
  cp: {
    title: 'CP — Consistency + Partition Tolerance',
    body: 'ยอมสละ Availability: ถ้าเครือข่ายขาดการเชื่อมต่อระหว่าง node บาง node จะ "ปฏิเสธตอบ" แทนที่จะตอบด้วยข้อมูลที่อาจไม่ตรงกัน',
    example: 'ตัวอย่าง: etcd, ZooKeeper, ระบบ banking บางส่วนที่ยอมช้าดีกว่าข้อมูลผิด',
  },
  ap: {
    title: 'AP — Availability + Partition Tolerance',
    body: 'ยอมสละ Consistency: ทุก node ยังตอบ request ต่อแม้เครือข่ายขาด แต่ข้อมูลที่ตอบอาจไม่ล่าสุด (stale) จนกว่าจะ sync กันทีหลัง',
    example: 'ตัวอย่าง: Cassandra, DynamoDB, DNS — ระบบที่ "ตอบก่อน ค่อยตรงกันทีหลัง" (eventual consistency)',
  },
  ca: {
    title: 'CA — Consistency + Availability',
    body: 'ใช้ได้จริงก็ต่อเมื่อไม่มี network partition เลย — ในทางปฏิบัติระบบ distributed จริงมี partition เกิดขึ้นได้เสมอ ดังนั้น CA แท้ๆ มีแค่ระบบเครื่องเดียว (ไม่ distributed)',
    example: 'ตัวอย่าง: RDBMS เครื่องเดียวแบบดั้งเดิม (ไม่มี replica ข้ามเครื่อง)',
  },
}

const active = computed(() => (selected.value ? info[selected.value] : null))
</script>

<template>
  <figure class="cap-figure">
    <div class="cap-layout">
      <svg viewBox="0 0 300 260" xmlns="http://www.w3.org/2000/svg" class="cap-svg">
        <path
          d="M150,30 L270,230 L30,230 Z"
          fill="none"
          stroke="var(--line-strong)"
          stroke-width="1"
        />
        <line
          x1="150" y1="30" x2="30" y2="230"
          class="cap-edge" :class="{ active: selected === 'ca' }"
          tabindex="0" role="button" aria-label="เลือกคู่ Consistency + Availability (CA)"
          @click="selected = 'ca'"
          @keydown.enter="selected = 'ca'"
          @keydown.space.prevent="selected = 'ca'"
        />
        <line
          x1="30" y1="230" x2="270" y2="230"
          class="cap-edge" :class="{ active: selected === 'ap' }"
          tabindex="0" role="button" aria-label="เลือกคู่ Availability + Partition Tolerance (AP)"
          @click="selected = 'ap'"
          @keydown.enter="selected = 'ap'"
          @keydown.space.prevent="selected = 'ap'"
        />
        <line
          x1="270" y1="230" x2="150" y2="30"
          class="cap-edge" :class="{ active: selected === 'cp' }"
          tabindex="0" role="button" aria-label="เลือกคู่ Consistency + Partition Tolerance (CP)"
          @click="selected = 'cp'"
          @keydown.enter="selected = 'cp'"
          @keydown.space.prevent="selected = 'cp'"
        />

        <circle cx="150" cy="30" r="20" class="cap-node node-c" />
        <text x="150" y="35" text-anchor="middle" class="cap-node-label">C</text>
        <circle cx="30" cy="230" r="20" class="cap-node node-a" />
        <text x="30" y="235" text-anchor="middle" class="cap-node-label">A</text>
        <circle cx="270" cy="230" r="20" class="cap-node node-p" />
        <text x="270" y="235" text-anchor="middle" class="cap-node-label">P</text>

        <text x="150" y="12" text-anchor="middle" class="cap-full-label">Consistency</text>
        <text x="-10" y="252" text-anchor="middle" class="cap-full-label">Availability</text>
        <text x="300" y="252" text-anchor="end" class="cap-full-label">Partition Tolerance</text>
      </svg>

      <div class="cap-info blueprint-panel">
        <p class="annotation-label">คลิกที่ "เส้น" เชื่อม 2 มุม เพื่อดูว่าเลือกคู่นั้นแปลว่าอะไร</p>
        <template v-if="active">
          <h3>{{ active.title }}</h3>
          <p>{{ active.body }}</p>
          <p class="example">{{ active.example }}</p>
        </template>
        <p v-else class="placeholder">ยังไม่ได้เลือก — ลองคลิกเส้น A–P ด้านล่างก่อน (คู่ที่ระบบ distributed ส่วนใหญ่ต้องเลือก)</p>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.cap-figure {
  margin: var(--space-5) 0;
}
.cap-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--space-5);
  align-items: start;
}
.cap-svg {
  width: 100%;
  height: auto;
  overflow: visible;
}
.cap-edge {
  stroke: var(--accent);
  stroke-width: 10;
  stroke-opacity: 0.001;
  cursor: pointer;
}
.cap-edge.active {
  stroke-opacity: 0.35;
}
.cap-edge:focus-visible {
  stroke-opacity: 0.5;
  outline: 2px solid var(--accent);
}
.cap-node {
  stroke-width: 1.75;
}
.cap-node.node-c {
  fill: var(--diagram-violet-wash);
  stroke: var(--diagram-violet);
}
.cap-node.node-a {
  fill: var(--diagram-blue-wash);
  stroke: var(--diagram-blue);
}
.cap-node.node-p {
  fill: var(--diagram-rose-wash);
  stroke: var(--diagram-rose);
}
.cap-node-label {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 600;
  fill: var(--ink);
}
.cap-full-label {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--ink-soft);
}
.cap-info {
  padding: var(--space-5);
  min-height: 200px;
}
.cap-info h3 {
  margin: 0 0 var(--space-2);
}
.example {
  color: var(--ink-soft);
  font-size: 0.9rem;
}
.placeholder {
  color: var(--ink-faint);
  font-style: italic;
}
@media (max-width: 640px) {
  .cap-layout {
    grid-template-columns: 1fr;
  }
}
</style>
