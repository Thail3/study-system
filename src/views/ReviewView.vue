<script setup lang="ts">
import { getAllQuizItems } from '../data/quizzes'
import { useQuizReview } from '../composables/useQuizReview'
import QuizFlipCard from '../components/quiz/QuizFlipCard.vue'

const allItems = getAllQuizItems()
const { dueIds } = useQuizReview()

// Snapshot the due list once at mount — deliberately not reactive, so
// recordResult() calls during this session don't shift the list (and
// QuizFlipCard's progress) out from under the user mid-review.
const dueIdSet = new Set(dueIds(allItems.map((item) => item.id)))
const dueItems = allItems.filter((item) => dueIdSet.has(item.id))
</script>

<template>
  <div class="review-wrap">
    <nav class="breadcrumb">
      <router-link to="/">← กลับไป blueprint map</router-link>
    </nav>

    <header class="review-header">
      <p class="annotation-label">SPACED REPETITION</p>
      <h1>ทวนความจำ</h1>
    </header>

    <QuizFlipCard v-if="dueItems.length" :items="dueItems" :show-topic-label="true" />
    <p v-else class="empty-state annotation-label">ไม่มีข้อรอทวนวันนี้ — กลับมาใหม่พรุ่งนี้ หรือไปอ่าน topic ใหม่เพิ่ม</p>
  </div>
</template>

<style scoped>
.review-wrap {
  max-width: 640px;
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
.review-header {
  margin-bottom: var(--space-6);
}
.review-header h1 {
  margin: var(--space-1) 0 0;
}
.empty-state {
  padding: var(--space-5);
  text-align: center;
}
</style>
