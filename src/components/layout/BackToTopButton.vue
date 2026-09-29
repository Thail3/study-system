<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition name="fade-btn">
    <button v-if="visible" class="back-to-top-btn" aria-label="กลับขึ้นบนสุด" @click="scrollToTop">↑</button>
  </Transition>
</template>

<style scoped>
.back-to-top-btn {
  position: fixed;
  right: var(--space-5);
  bottom: var(--space-5);
  z-index: 50;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--paper-raised);
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
}
.back-to-top-btn:hover {
  color: var(--ink);
  border-color: var(--ink-soft);
}
.fade-btn-enter-active,
.fade-btn-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.fade-btn-enter-from,
.fade-btn-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
