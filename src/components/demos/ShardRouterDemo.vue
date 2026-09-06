<script setup lang="ts">
import { computed, ref } from 'vue'

interface KeyItem {
  label: string
  hash: number
}

const KEYS: KeyItem[] = Array.from({ length: 12 }, (_, i) => ({
  label: `user_${1000 + i}`,
  hash: ((i + 1) * 2654435761) >>> 0,
}))

const MAX_SHARDS = 5
const shardCount = ref(3)
const previousShardCount = ref(3)
const showMoved = ref(false)

function shardOf(hash: number, n: number): number {
  return hash % n
}

const assignments = computed(() =>
  KEYS.map((k) => ({
    ...k,
    shard: shardOf(k.hash, shardCount.value),
    prevShard: shardOf(k.hash, previousShardCount.value),
  })),
)

const movedCount = computed(() => assignments.value.filter((a) => a.shard !== a.prevShard).length)

function shardKeys(shardIndex: number) {
  return assignments.value.filter((a) => a.shard === shardIndex)
}

function addShard() {
  if (shardCount.value >= MAX_SHARDS) return
  previousShardCount.value = shardCount.value
  shardCount.value += 1
  showMoved.value = true
}

function reset() {
  previousShardCount.value = 3
  shardCount.value = 3
  showMoved.value = false
}
</script>

<template>
  <div class="shard-demo blueprint-panel">
    <div class="controls">
      <button class="btn" :disabled="shardCount >= MAX_SHARDS" @click="addShard">
        + เพิ่ม shard ({{ shardCount }} → {{ shardCount + 1 }})
      </button>
      <button class="btn ghost" @click="reset">reset</button>
      <span v-if="showMoved" class="annotation-label result">{{ movedCount }}/{{ KEYS.length }} keys ต้องย้าย shard</span>
    </div>

    <div class="shards">
      <div v-for="s in shardCount" :key="s" class="shard-col">
        <p class="annotation-label shard-title">SHARD {{ s - 1 }}</p>
        <div
          v-for="a in shardKeys(s - 1)"
          :key="a.label"
          class="key-chip"
          :class="{ moved: showMoved && a.shard !== a.prevShard }"
        >
          {{ a.label }}
        </div>
      </div>
    </div>
    <p class="hint annotation-label">
      โมเดล hash แบบง่าย (mod จำนวน shard) — กด "เพิ่ม shard" ดูว่ากี่ key ต้องย้ายที่อยู่ใหม่ (สีแดง = ย้าย, ปกติ = อยู่ที่เดิม)
    </p>
  </div>
</template>

<style scoped>
.shard-demo {
  padding: var(--space-5);
  margin: var(--space-6) 0;
}
.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
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
.result {
  color: var(--mark-red);
}
.shards {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.shard-col {
  flex: 1 1 100px;
  min-width: 100px;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-sm);
  padding: var(--space-2);
}
.shard-title {
  margin: 0 0 var(--space-2);
}
.key-chip {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  padding: var(--space-1) var(--space-2);
  margin-bottom: var(--space-1);
  background: var(--accent-wash);
  border: 1px solid var(--accent-strong);
  border-radius: var(--radius-sm);
  color: var(--accent-strong);
  transition:
    background 0.2s,
    border-color 0.2s,
    color 0.2s;
}
.key-chip.moved {
  background: var(--mark-red-wash);
  border-color: var(--mark-red);
  color: var(--mark-red);
}
.hint {
  margin: 0;
}
</style>
