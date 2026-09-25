<script setup lang="ts">
import { computed } from 'vue'
import { modules, type Track } from '../data/modules'
import { useProgress } from '../composables/useProgress'

const { moduleReadCount } = useProgress()

interface SubjectCard {
  track: Track
  annotation: string
  title: string
  sub: string
}

const subjects: SubjectCard[] = [
  {
    track: 'system-design',
    annotation: 'TRACK 01',
    title: 'System Design',
    sub: 'scalability, caching, database, CAP, messaging, microservices, reliability, storage, security, estimation, case studies',
  },
  {
    track: 'system-architecture',
    annotation: 'TRACK 02',
    title: 'System Architecture',
    sub: 'architectural styles, documentation & views (C4/ADR), domain-driven design, quality attributes & trade-off, deployment & infra, CQRS/event sourcing, team topologies, evolutionary architecture, case studies',
  },
  {
    track: 'systems-thinking',
    annotation: 'TRACK 03',
    title: 'Systems Thinking',
    sub: 'stocks & flows, feedback loops, behavior patterns, systems archetypes, leverage points, system traps, case studies',
  },
  {
    track: 'devops-observability',
    annotation: 'TRACK 04',
    title: 'DevOps & Observability',
    sub: 'monitoring fundamentals, metrics & Prometheus, centralized logging, distributed tracing, dashboards & Grafana, alerting & SLO, case studies',
  },
  {
    track: 'source-control',
    annotation: 'TRACK 05',
    title: 'Source Control & Codebase Strategy',
    sub: 'monorepo vs polyrepo, branching strategies, code review & merge strategy, versioning & release management, git workflow at scale, case studies',
  },
]

function trackStats(track: Track) {
  const trackModules = modules.filter((m) => m.track === track)
  const totalTopics = trackModules.reduce((sum, m) => sum + m.topics.length, 0)
  const readTopics = trackModules.reduce((sum, m) => sum + moduleReadCount(m.slug, m.topics.map((t) => t.id)), 0)
  return { moduleCount: trackModules.length, totalTopics, readTopics }
}

const cards = computed(() =>
  subjects.map((s) => ({ ...s, stats: trackStats(s.track) })),
)
</script>

<template>
  <div class="picker-wrap">
    <header class="picker-header">
      <p class="annotation-label">เลือกวิชาที่จะเรียน</p>
      <h1>Study System</h1>
      <p class="picker-sub">คลิกวิชาไหนก่อนก็ได้ ไม่ต้องเรียงลำดับ — แนะนำ System Design ก่อนถ้ายังไม่เคยเรียนมาก่อน</p>
    </header>

    <div class="card-grid">
      <router-link v-for="c in cards" :key="c.track" :to="{ name: 'track-home', params: { track: c.track } }" class="subject-card">
        <p class="annotation-label">{{ c.annotation }}</p>
        <h2>{{ c.title }}</h2>
        <p class="card-sub">{{ c.sub }}</p>
        <div class="card-footer">
          <div
            v-if="c.stats.totalTopics"
            class="progress-track"
            role="progressbar"
            :aria-valuenow="c.stats.readTopics"
            :aria-valuemin="0"
            :aria-valuemax="c.stats.totalTopics"
            :aria-label="`${c.title} progress`"
          >
            <div class="progress-fill" :style="{ width: (c.stats.readTopics / c.stats.totalTopics) * 100 + '%' }" />
          </div>
          <p class="annotation-label">
            {{ c.stats.moduleCount }} module · {{ c.stats.readTopics }}/{{ c.stats.totalTopics }} อ่านแล้ว
          </p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.picker-wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-7) var(--space-5) var(--space-8);
}
.picker-header {
  margin-bottom: var(--space-7);
}
.picker-header h1 {
  margin: var(--space-2) 0;
}
.picker-sub {
  color: var(--ink-soft);
  margin: 0;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-5);
}
@media (max-width: 640px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
.subject-card {
  display: flex;
  flex-direction: column;
  padding: var(--space-5);
  background: var(--paper-raised);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--ink);
  transition: filter 0.15s;
}
.subject-card:hover {
  filter: brightness(0.97);
}
.subject-card h2 {
  margin: var(--space-1) 0 var(--space-2);
}
.card-sub {
  color: var(--ink-soft);
  font-size: 0.9rem;
  margin: 0 0 var(--space-5);
  flex: 1;
}
.card-footer {
  margin-top: auto;
}
.progress-track {
  height: 6px;
  background: var(--grid-line-strong);
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-bottom: var(--space-2);
}
.progress-fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.25s ease;
}
</style>
