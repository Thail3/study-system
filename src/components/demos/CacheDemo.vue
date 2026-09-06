<script setup lang="ts">
import { reactive, ref } from 'vue'

const keys = ['A', 'B', 'C', 'D', 'E', 'F']
const capacity = 4
const cache = reactive<string[]>([]) // index 0 = most recently used
const stats = reactive({ hits: 0, misses: 0 })
const lastAction = ref<{ key: string; result: 'hit' | 'miss'; evicted?: string } | null>(null)

function access(key: string) {
  const idx = cache.indexOf(key)
  if (idx !== -1) {
    cache.splice(idx, 1)
    cache.unshift(key)
    stats.hits++
    lastAction.value = { key, result: 'hit' }
    return
  }
  stats.misses++
  cache.unshift(key)
  let evicted: string | undefined
  if (cache.length > capacity) {
    evicted = cache.pop()
  }
  lastAction.value = { key, result: 'miss', evicted }
}

function reset() {
  cache.splice(0, cache.length)
  stats.hits = 0
  stats.misses = 0
  lastAction.value = null
}
</script>

<template>
  <div class="cache-demo blueprint-panel">
    <div class="controls">
      <span class="annotation-label">ขอข้อมูล key:</span>
      <button v-for="k in keys" :key="k" class="btn key-btn" @click="access(k)">{{ k }}</button>
      <button class="btn ghost" @click="reset">reset</button>
    </div>

    <p v-if="lastAction" class="last-action" :class="lastAction.result">
      key <strong>{{ lastAction.key }}</strong>
      {{ lastAction.result === 'hit' ? '→ HIT (มีใน cache แล้ว)' : '→ MISS (ต้องไปอ่านจาก DB)' }}
      <span v-if="lastAction.evicted"> — cache เต็ม, evict key <strong>{{ lastAction.evicted }}</strong> ออก (นานสุดที่ไม่ได้ใช้)</span>
    </p>

    <div class="slots">
      <div v-for="i in capacity" :key="i" class="slot" :class="{ filled: cache[i - 1] }">
        <span v-if="cache[i - 1]" class="slot-key">{{ cache[i - 1] }}</span>
        <span v-else class="slot-empty">empty</span>
        <span class="slot-rank annotation-label">{{ i === 1 ? 'MRU' : i === capacity ? 'LRU' : '' }}</span>
      </div>
    </div>

    <p class="stats annotation-label">hits: {{ stats.hits }} · misses: {{ stats.misses }} · hit rate:
      {{ stats.hits + stats.misses === 0 ? '—' : Math.round((stats.hits / (stats.hits + stats.misses)) * 100) + '%' }}
    </p>
    <p class="hint annotation-label">cache จุได้ {{ capacity }} key — ลองขอ A,B,C,D (เต็มพอดี) แล้วขอ E ดู — key ที่ไม่ได้ใช้นานสุด (LRU) จะถูกไล่ออก</p>
  </div>
</template>

<style scoped>
.cache-demo {
  padding: var(--space-5);
  margin: var(--space-6) 0;
}
.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
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
.key-btn {
  min-width: 2.4rem;
}
.btn.ghost {
  border-color: var(--line-strong);
  color: var(--ink-soft);
}
.last-action {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  margin: 0 0 var(--space-4);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  background: var(--grid-line-strong);
}
.last-action.hit {
  background: var(--mark-green-wash);
  color: var(--mark-green);
}
.last-action.miss {
  background: var(--mark-red-wash);
  color: var(--mark-red);
}
.slots {
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}
.slot {
  flex: 1;
  height: 70px;
  border: 1.5px dashed var(--line-strong);
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
}
.slot.filled {
  border-style: solid;
  border-color: var(--ink);
  background: var(--accent-wash);
}
.slot-key {
  font-family: var(--font-mono);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--ink);
}
.slot-empty {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--ink-faint);
}
.slot-rank {
  font-size: 0.6rem;
}
.stats,
.hint {
  margin: 0 0 var(--space-1);
}
</style>
