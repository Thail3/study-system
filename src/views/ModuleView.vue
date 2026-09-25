<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { getModuleBySlug } from '../data/modules'
import { getTopicSource } from '../content'
import { getQuizItemsForTopic, type QuizItem } from '../data/quizzes'
import { useProgress } from '../composables/useProgress'
import ModulePage from '../components/layout/ModulePage.vue'
import TopicRenderer from '../components/content/TopicRenderer.vue'
import QuizFlipCard from '../components/quiz/QuizFlipCard.vue'

const props = defineProps<{ slug: string }>()
const mod = computed(() => getModuleBySlug(props.slug))
const { isRead, toggleRead } = useProgress()

const topicSources = ref<Record<string, string>>({})

watchEffect(async () => {
  const m = mod.value
  if (!m) return
  const entries = await Promise.all(
    m.topics.map(async (topic) => [topic.id, await getTopicSource(m.id, topic.file)] as const),
  )
  if (mod.value?.slug !== m.slug) return
  topicSources.value = Object.fromEntries(entries)
})

// Computed (not called inline in the template) so each topic's item array
// keeps a stable reference across unrelated re-renders (e.g. toggling
// "read" on a different topic) instead of being rebuilt every render.
const quizByTopic = computed<Record<string, QuizItem[]>>(() => {
  const m = mod.value
  if (!m) return {}
  const map: Record<string, QuizItem[]> = {}
  for (const topic of m.topics) {
    map[topic.id] = getQuizItemsForTopic(m.slug, topic.id, m.title, topic.title)
  }
  return map
})
</script>

<template>
  <div v-if="!mod" class="not-found-wrap">
    <p class="annotation-label">404</p>
    <h1>ไม่พบโมดูลนี้</h1>
    <router-link to="/">← กลับไป blueprint map</router-link>
  </div>

  <ModulePage v-else :module="mod">
    <p v-if="!mod.topics.length" class="coming-soon-note">
      โมดูลนี้ยังไม่ถูกสร้าง — เนื้อหากำลังจะตามมา
    </p>

    <section v-for="topic in mod.topics" :key="topic.id" :id="topic.id" class="topic-section">
      <div class="topic-head">
        <h2>{{ topic.title }}</h2>
        <button class="mark-read-btn" :class="{ done: isRead(mod.slug, topic.id) }" @click="toggleRead(mod.slug, topic.id)">
          {{ isRead(mod.slug, topic.id) ? '☑ อ่านแล้ว' : '☐ ทำเครื่องหมายว่าอ่านแล้ว' }}
        </button>
      </div>
      <TopicRenderer v-if="topicSources[topic.id]" :source="topicSources[topic.id]" />
      <p v-else class="loading-note annotation-label">กำลังโหลดเนื้อหา…</p>
      <QuizFlipCard v-if="quizByTopic[topic.id]?.length" :items="quizByTopic[topic.id]" />
    </section>
  </ModulePage>
</template>

<style scoped>
.not-found-wrap {
  max-width: 600px;
  margin: var(--space-8) auto;
  padding: 0 var(--space-5);
}
.coming-soon-note {
  color: var(--ink-soft);
  font-style: italic;
}
.loading-note {
  color: var(--ink-soft);
}
.topic-section {
  margin-bottom: var(--space-8);
  scroll-margin-top: var(--space-5);
}
.topic-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
  margin-bottom: var(--space-3);
}
.mark-read-btn {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: var(--space-1) var(--space-2);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--paper-raised);
  color: var(--ink-soft);
  cursor: pointer;
  white-space: nowrap;
}
.mark-read-btn.done {
  background: var(--mark-green-wash);
  border-color: var(--mark-green);
  color: var(--mark-green);
}
</style>
