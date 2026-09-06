<script setup lang="ts">
interface Side {
  title: string
  points: string[]
}

defineProps<{ left: Side; right: Side; note?: string }>()
</script>

<template>
  <figure class="cmp-figure">
    <div class="cmp-grid">
      <div class="cmp-col">
        <p class="cmp-title annotation-label">{{ left.title }}</p>
        <ul>
          <li v-for="(p, i) in left.points" :key="'l' + i">{{ p }}</li>
        </ul>
      </div>
      <div class="cmp-divider" />
      <div class="cmp-col">
        <p class="cmp-title annotation-label">{{ right.title }}</p>
        <ul>
          <li v-for="(p, i) in right.points" :key="'r' + i">{{ p }}</li>
        </ul>
      </div>
    </div>
    <figcaption v-if="note" class="annotation-label">{{ note }}</figcaption>
  </figure>
</template>

<style scoped>
.cmp-figure {
  margin: var(--space-5) 0;
  padding: var(--space-5);
  background: var(--paper-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}
.cmp-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--space-5);
}
.cmp-col {
  min-width: 0;
}
.cmp-title {
  margin: 0 0 var(--space-3);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--line);
}
.cmp-col ul {
  margin: 0;
  padding-left: 1.1em;
}
.cmp-col li {
  margin-bottom: var(--space-2);
  font-size: 0.92rem;
}
.cmp-divider {
  width: 1px;
  background: repeating-linear-gradient(to bottom, var(--line-strong) 0 6px, transparent 6px 11px);
}
figcaption {
  margin-top: var(--space-3);
  text-align: center;
}
@media (max-width: 560px) {
  .cmp-grid {
    grid-template-columns: 1fr;
  }
  .cmp-divider {
    display: none;
  }
}
</style>
