<script setup lang="ts">
import { computed, ref } from 'vue'
import JourneyIcon from './JourneyIcon.vue'

interface JourneyNode {
  icon: string
  label: string
}

interface JourneyStep {
  caption: string
  activeNode: number
}

const props = defineProps<{
  nodes: JourneyNode[]
  steps: JourneyStep[]
  travelerIcon?: string
}>()

const index = ref(0)

// Decorative role color per icon type (not tied to the mark-*
// term/insight/warning highlight colors) so each node stays visually
// distinct across the whole journey, not just while active.
const ICON_COLOR: Record<string, string> = {
  person: 'var(--diagram-blue)',
  house: 'var(--diagram-rose)',
  building: 'var(--accent)',
  notebook: 'var(--diagram-violet)',
  gate: 'var(--diagram-violet)',
  envelope: 'var(--diagram-blue)',
}
function nodeColor(icon: string): string {
  return ICON_COLOR[icon] ?? 'var(--ink-soft)'
}

const travelerIcon = computed(() => props.travelerIcon ?? 'person')
const activeNode = computed(() => props.steps[index.value]?.activeNode ?? 0)
const travelerPercent = computed(
  () => ((activeNode.value + 0.5) / (props.nodes.length || 1)) * 100,
)
const isLast = computed(() => index.value === props.steps.length - 1)

function next() {
  index.value = Math.min(props.steps.length - 1, index.value + 1)
}
function prev() {
  index.value = Math.max(0, index.value - 1)
}
</script>

<template>
  <figure class="journey-figure blueprint-panel">
    <div class="journey-rail">
      <div class="rail-line" />
      <div class="traveler" :style="{ left: travelerPercent + '%' }">
        <JourneyIcon :name="travelerIcon" class="traveler-icon" />
      </div>
      <div
        v-for="(n, i) in nodes"
        :key="i"
        class="rail-node"
        :class="{ active: i === activeNode }"
        :style="{ color: nodeColor(n.icon) }"
      >
        <JourneyIcon :name="n.icon" class="node-icon" />
        <p class="node-label annotation-label">{{ n.label }}</p>
      </div>
    </div>

    <div class="journey-body">
      <p class="annotation-label journey-progress">STEP {{ index + 1 }} / {{ steps.length }}</p>
      <p class="journey-caption">{{ steps[index].caption }}</p>
      <div class="journey-nav">
        <button type="button" class="btn ghost" :disabled="index === 0" @click="prev">← ก่อนหน้า</button>
        <button type="button" class="btn" :disabled="isLast" @click="next">ถัดไป →</button>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.journey-figure {
  padding: var(--space-5);
  margin: var(--space-6) 0;
}
.journey-rail {
  position: relative;
  display: flex;
  padding-top: 40px;
  margin-bottom: var(--space-5);
}
.rail-line {
  position: absolute;
  left: 0;
  right: 0;
  top: 68px;
  height: 2px;
  background: var(--line);
}
.traveler {
  position: absolute;
  top: 0;
  width: 28px;
  height: 28px;
  transform: translateX(-50%);
  transition: left 0.4s ease;
  color: var(--accent-strong);
}
.rail-node {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  opacity: 0.5;
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.rail-node.active {
  opacity: 1;
}
.rail-node.active .node-icon {
  transform: scale(1.15);
}
.node-icon {
  width: 32px;
  height: 32px;
  transition: transform 0.2s;
}
.node-label {
  margin: 0;
  text-align: center;
}
.journey-progress {
  margin: 0 0 var(--space-1);
}
.journey-caption {
  margin: 0 0 var(--space-4);
}
.journey-nav {
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
