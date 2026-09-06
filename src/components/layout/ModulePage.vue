<script setup lang="ts">
import { computed } from 'vue'
import type { ModuleMeta } from '../../data/modules'
import { useProgress } from '../../composables/useProgress'

const props = defineProps<{ module: ModuleMeta }>()
const { moduleReadCount } = useProgress()

const readCount = computed(() => moduleReadCount(props.module.slug, props.module.topics.map((t) => t.id)))
const pct = computed(() => {
  const total = props.module.topics.length
  return total ? Math.round((readCount.value / total) * 100) : 0
})
</script>

<template>
  <div class="module-page">
    <nav class="breadcrumb">
      <router-link to="/">← กลับไป blueprint map</router-link>
    </nav>

    <header class="module-header">
      <p class="annotation-label">MODULE {{ String(module.id).padStart(2, '0') }}</p>
      <h1>{{ module.title }}</h1>
      <p class="module-sub">{{ module.titleSub }}</p>

      <div v-if="module.topics.length" class="progress-track">
        <div class="progress-fill" :style="{ width: pct + '%' }" />
      </div>
      <p v-if="module.topics.length" class="annotation-label">{{ readCount }}/{{ module.topics.length }} อ่านแล้ว</p>
    </header>

    <nav v-if="module.topics.length" class="topic-index">
      <a v-for="(t, i) in module.topics" :key="t.id" :href="`#${t.id}`" class="topic-index-item">
        <span class="mono">{{ String(i + 1).padStart(2, '0') }}</span> {{ t.title }}
      </a>
    </nav>

    <div class="module-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.module-page {
  max-width: 780px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-5) var(--space-8);
}
.breadcrumb {
  margin-bottom: var(--space-5);
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
.module-header {
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-5);
  border-bottom: 1px solid var(--line);
}
.module-header h1 {
  margin: var(--space-1) 0 var(--space-2);
}
.module-sub {
  color: var(--ink-soft);
  margin: 0 0 var(--space-4);
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
.topic-index {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-7);
  padding: var(--space-4);
  background: var(--paper-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}
.topic-index-item {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--ink);
  text-decoration: none;
}
.topic-index-item .mono {
  font-family: var(--font-mono);
  color: var(--ink-faint);
  margin-right: var(--space-2);
}
.topic-index-item:hover {
  color: var(--accent-strong);
}
</style>
