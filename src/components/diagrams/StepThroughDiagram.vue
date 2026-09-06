<script setup lang="ts">
import { ref } from 'vue'

interface Step {
  label: string
  detail: string
}

const props = defineProps<{ steps: Step[] }>()
const active = ref(0)

function next() {
  active.value = Math.min(props.steps.length - 1, active.value + 1)
}
function prev() {
  active.value = Math.max(0, active.value - 1)
}
</script>

<template>
  <figure class="step-figure">
    <div class="step-rail">
      <template v-for="(s, i) in steps" :key="i">
        <button class="step-dot" :class="{ active: i === active, done: i < active }" :title="s.label" @click="active = i">
          {{ i + 1 }}
        </button>
        <div v-if="i < steps.length - 1" class="step-line" :class="{ done: i < active }" />
      </template>
    </div>

    <div class="step-body blueprint-panel">
      <p class="annotation-label">STEP {{ active + 1 }} / {{ steps.length }}</p>
      <h3>{{ steps[active].label }}</h3>
      <p class="step-detail">{{ steps[active].detail }}</p>
      <div class="step-nav">
        <button class="btn ghost" :disabled="active === 0" @click="prev">← ก่อนหน้า</button>
        <button class="btn" :disabled="active === steps.length - 1" @click="next">ถัดไป →</button>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.step-figure {
  margin: var(--space-5) 0;
}
.step-rail {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-4);
}
.step-dot {
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid var(--line-strong);
  background: var(--paper-raised);
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  cursor: pointer;
}
.step-dot.active {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--paper-raised);
}
.step-dot.done {
  border-color: var(--mark-green);
  color: var(--mark-green);
}
.step-line {
  flex: 1 1 auto;
  height: 2px;
  background: var(--line);
  margin: 0 var(--space-1);
}
.step-line.done {
  background: var(--mark-green);
}
.step-body {
  padding: var(--space-5);
}
.step-body h3 {
  margin: var(--space-1) 0 var(--space-2);
}
.step-detail {
  color: var(--ink-soft);
  margin: 0 0 var(--space-4);
}
.step-nav {
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
.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
