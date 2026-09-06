<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { QuizItem } from '../../data/quizzes'
import { useQuizReview } from '../../composables/useQuizReview'

const props = defineProps<{
  items: QuizItem[]
  showTopicLabel?: boolean
}>()

const { recordResult } = useQuizReview()

const index = ref(0)
const revealed = ref(false)
const done = ref(false)
const revealBtn = ref<HTMLButtonElement | null>(null)
const rememberBtn = ref<HTMLButtonElement | null>(null)

const current = computed(() => props.items[Math.min(index.value, props.items.length - 1)])
const isLast = computed(() => index.value === props.items.length - 1)

async function reveal() {
  revealed.value = true
  await nextTick()
  rememberBtn.value?.focus()
}

async function answer(remembered: boolean) {
  recordResult(current.value.id, remembered)
  if (isLast.value) {
    done.value = true
    return
  }
  index.value += 1
  revealed.value = false
  await nextTick()
  revealBtn.value?.focus()
}
</script>

<template>
  <div v-if="items.length && !done" class="quiz-card blueprint-panel">
    <div class="quiz-rail">
      <span v-for="(_, i) in items" :key="i" class="quiz-dot" :class="{ active: i === index, done: i < index }" />
    </div>

    <p class="annotation-label quiz-progress">QUIZ {{ index + 1 }} / {{ items.length }}</p>
    <p v-if="showTopicLabel" class="annotation-label quiz-topic">{{ current.moduleTitle }} — {{ current.topicTitle }}</p>

    <p class="quiz-question">{{ current.question }}</p>

    <template v-if="!revealed">
      <button ref="revealBtn" type="button" class="btn" @click="reveal">ดูเฉลย</button>
    </template>
    <template v-else>
      <p class="quiz-answer">{{ current.answer }}</p>
      <div class="quiz-actions">
        <button type="button" class="btn ghost" @click="answer(false)">จำไม่ได้ ทวนใหม่</button>
        <button ref="rememberBtn" type="button" class="btn" @click="answer(true)">จำได้แล้ว</button>
      </div>
    </template>
  </div>

  <p v-else-if="items.length && done" class="quiz-done annotation-label">✓ ทวนครบแล้ว {{ items.length }} ข้อ</p>
</template>

<style scoped>
.quiz-card {
  padding: var(--space-5);
  margin: var(--space-6) 0;
}
.quiz-rail {
  display: flex;
  gap: var(--space-1);
  margin-bottom: var(--space-3);
}
.quiz-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--line-strong);
}
.quiz-dot.active {
  background: var(--accent);
}
.quiz-dot.done {
  background: var(--mark-green);
}
.quiz-progress {
  margin: 0 0 var(--space-1);
}
.quiz-topic {
  margin: 0 0 var(--space-3);
  color: var(--accent-strong);
}
.quiz-question {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 var(--space-4);
}
.quiz-answer {
  color: var(--ink-soft);
  margin: 0 0 var(--space-4);
  padding: var(--space-3);
  background: var(--accent-wash);
  border-radius: var(--radius-sm);
}
.quiz-actions {
  display: flex;
  gap: var(--space-3);
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
.quiz-done {
  padding: var(--space-4);
  color: var(--mark-green);
}
</style>
