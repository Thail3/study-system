<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { modules, type Track } from '../../data/modules'
import { getAllQuizItems } from '../../data/quizzes'
import { useProgress } from '../../composables/useProgress'
import { useQuizReview } from '../../composables/useQuizReview'

const props = defineProps<{ track: Track }>()

const TRACK_META: Record<Track, { annotation: string; title: string; sub: string }> = {
  'system-design': {
    annotation: 'SYSTEM DESIGN — BLUEPRINT MAP',
    title: 'เรียน System Design',
    sub: 'คลิก node ไหนก่อนก็ได้ ไม่ต้องเรียงลำดับ — สถานะบน map จะอัปเดตตามที่อ่านแล้ว',
  },
  'system-architecture': {
    annotation: 'SYSTEM ARCHITECTURE — BLUEPRINT MAP',
    title: 'เรียน System Architecture',
    sub: 'คลิก node ไหนก่อนก็ได้ ไม่ต้องเรียงลำดับ — สถานะบน map จะอัปเดตตามที่อ่านแล้ว',
  },
  'systems-thinking': {
    annotation: 'SYSTEMS THINKING — BLUEPRINT MAP',
    title: 'เรียน Systems Thinking',
    sub: 'คลิก node ไหนก่อนก็ได้ ไม่ต้องเรียงลำดับ — สถานะบน map จะอัปเดตตามที่อ่านแล้ว',
  },
  'devops-observability': {
    annotation: 'DEVOPS & OBSERVABILITY — BLUEPRINT MAP',
    title: 'เรียน DevOps & Observability',
    sub: 'คลิก node ไหนก่อนก็ได้ ไม่ต้องเรียงลำดับ — สถานะบน map จะอัปเดตตามที่อ่านแล้ว',
  },
  'source-control': {
    annotation: 'SOURCE CONTROL & CODEBASE STRATEGY — BLUEPRINT MAP',
    title: 'เรียน Source Control & Codebase Strategy',
    sub: 'คลิก node ไหนก่อนก็ได้ ไม่ต้องเรียงลำดับ — สถานะบน map จะอัปเดตตามที่อ่านแล้ว',
  },
}

const router = useRouter()
const { moduleReadCount } = useProgress()
const { dueCount } = useQuizReview()

const allQuizIds = getAllQuizItems().map((item) => item.id)
const dueQuizCount = computed(() => dueCount(allQuizIds))

const meta = computed(() => TRACK_META[props.track])
const trackModules = computed(() => modules.filter((m) => m.track === props.track))

const pathPoints = computed(() => trackModules.value.map((m) => `${m.position.x},${m.position.y}`).join(' '))

interface ModuleNode {
  module: (typeof modules)[number]
  displayIndex: number
  state: 'coming-soon' | 'unread' | 'partial' | 'done'
  label: string
}

const nodes = computed<ModuleNode[]>(() =>
  trackModules.value.map((m, i) => {
    if (m.status === 'coming-soon') {
      return { module: m, displayIndex: i + 1, state: 'coming-soon', label: 'coming soon' }
    }
    const total = m.topics.length
    const read = moduleReadCount(
      m.slug,
      m.topics.map((t) => t.id),
    )
    const state = total === 0 || read === 0 ? 'unread' : read === total ? 'done' : 'partial'
    const label = total === 0 ? '' : `${read}/${total}`
    return { module: m, displayIndex: i + 1, state, label }
  }),
)

function go(slug: string) {
  router.push({ name: 'module', params: { track: props.track, slug } })
}
</script>

<template>
  <div class="map-wrap">
    <header class="map-header">
      <nav class="breadcrumb">
        <router-link to="/">← กลับไปเลือกวิชา</router-link>
      </nav>
      <p class="annotation-label">{{ meta.annotation }}</p>
      <h1>{{ meta.title }}</h1>
      <p class="map-sub">{{ meta.sub }}</p>
      <router-link v-if="dueQuizCount > 0" to="/review" class="review-badge">
        {{ dueQuizCount }} ข้อรอทวนวันนี้ →
      </router-link>
    </header>

    <svg viewBox="0 0 960 560" xmlns="http://www.w3.org/2000/svg" class="map-svg">
      <polyline :points="pathPoints" fill="none" stroke="var(--line-strong)" stroke-width="2" stroke-dasharray="6 6" />

      <g
        v-for="{ module: m, displayIndex, state, label } in nodes"
        :key="m.slug"
        class="node-group"
        :class="state"
        tabindex="0"
        role="button"
        :aria-label="`เปิดโมดูล ${m.title}`"
        @click="go(m.slug)"
        @keydown.enter="go(m.slug)"
        @keydown.space.prevent="go(m.slug)"
      >
        <rect
          :x="m.position.x - 74"
          :y="m.position.y - 38"
          width="148"
          height="76"
          rx="3"
          class="node-rect"
        />
        <text :x="m.position.x - 64" :y="m.position.y - 20" class="node-index">{{ String(displayIndex).padStart(2, '0') }}</text>
        <text :x="m.position.x" :y="m.position.y + 2" text-anchor="middle" class="node-title">{{ m.title }}</text>
        <text :x="m.position.x" :y="m.position.y + 22" text-anchor="middle" class="node-sub">
          {{ state === 'coming-soon' ? 'coming soon' : label || 'เริ่มเรียน' }}
        </text>
        <text v-if="state === 'done'" :x="m.position.x + 60" :y="m.position.y - 22" class="node-check">✓</text>
      </g>
    </svg>

    <ul class="legend">
      <li><span class="dot unread" /> ยังไม่เริ่ม</li>
      <li><span class="dot partial" /> อ่านบางส่วน</li>
      <li><span class="dot done" /> อ่านครบแล้ว</li>
      <li><span class="dot coming-soon" /> ยังไม่เปิด (coming soon)</li>
    </ul>
  </div>
</template>

<style scoped>
.map-wrap {
  max-width: 1080px;
  margin: 0 auto;
  padding: var(--space-7) var(--space-5) var(--space-8);
}
.map-header {
  margin-bottom: var(--space-6);
}
.breadcrumb {
  margin-bottom: var(--space-4);
}
.breadcrumb a {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--ink-soft);
  text-decoration: none;
}
.breadcrumb a:hover {
  color: var(--accent-strong);
}
.map-header h1 {
  margin: var(--space-2) 0;
}
.map-sub {
  color: var(--ink-soft);
  margin: 0;
}
.review-badge {
  display: inline-block;
  margin-top: var(--space-3);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--accent);
  border-radius: var(--radius-sm);
  background: var(--accent-wash);
  color: var(--accent-strong);
  text-decoration: none;
}
.review-badge:hover {
  background: var(--accent);
  color: var(--paper-raised);
}
.map-svg {
  width: 100%;
  height: auto;
  display: block;
}
.node-group {
  cursor: pointer;
}
.node-group:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.node-rect {
  fill: var(--paper-raised);
  stroke: var(--ink);
  stroke-width: 1.5;
  transition: filter 0.15s;
}
.node-group:hover .node-rect {
  filter: brightness(0.97);
}
.node-group.unread .node-rect {
  stroke: var(--ink);
}
.node-group.partial .node-rect {
  fill: var(--accent-wash);
  stroke: var(--accent-strong);
}
.node-group.done .node-rect {
  fill: var(--mark-green-wash);
  stroke: var(--mark-green);
}
.node-group.coming-soon .node-rect {
  stroke: var(--line-strong);
  stroke-dasharray: 4 3;
}
.node-group.coming-soon {
  opacity: 0.7;
}
.node-index {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--ink-faint);
  letter-spacing: 0.05em;
}
.node-title {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  fill: var(--ink);
}
.node-sub {
  font-family: var(--font-mono);
  font-size: 9.5px;
  fill: var(--ink-soft);
}
.node-check {
  font-size: 14px;
  fill: var(--mark-green);
}
.legend {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-5);
  margin: var(--space-6) 0 0;
  padding: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--ink-soft);
}
.legend li {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  display: inline-block;
  border: 1.5px solid var(--ink);
}
.dot.unread {
  background: var(--paper-raised);
}
.dot.partial {
  background: var(--accent-wash);
  border-color: var(--accent-strong);
}
.dot.done {
  background: var(--mark-green-wash);
  border-color: var(--mark-green);
}
.dot.coming-soon {
  border-style: dashed;
  border-color: var(--line-strong);
}
</style>
