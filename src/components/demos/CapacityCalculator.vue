<script setup lang="ts">
import { computed, ref } from 'vue'

const dau = ref(1_000_000)
const actionsPerUser = ref(15)
const payloadKB = ref(10)
const peakMultiplier = ref(3)

const totalRequestsPerDay = computed(() => dau.value * actionsPerUser.value)
const avgQps = computed(() => totalRequestsPerDay.value / 86400)
const peakQps = computed(() => avgQps.value * peakMultiplier.value)
const dailyDataGB = computed(() => (totalRequestsPerDay.value * payloadKB.value) / 1_048_576)
const yearlyDataTB = computed(() => (dailyDataGB.value * 365) / 1024)

function fmt(n: number, digits = 0) {
  return n.toLocaleString('en-US', { maximumFractionDigits: digits })
}

const presets = [
  { label: 'Startup เล็ก', dau: 10_000, actions: 20, payload: 5 },
  { label: 'App ระดับกลาง', dau: 1_000_000, actions: 15, payload: 10 },
  { label: 'Twitter-scale', dau: 300_000_000, actions: 10, payload: 2 },
]

function applyPreset(p: (typeof presets)[number]) {
  dau.value = p.dau
  actionsPerUser.value = p.actions
  payloadKB.value = p.payload
}
</script>

<template>
  <div class="calc-demo blueprint-panel">
    <div class="presets">
      <button v-for="p in presets" :key="p.label" class="btn ghost" @click="applyPreset(p)">{{ p.label }}</button>
    </div>

    <div class="inputs">
      <label class="field">
        <span class="annotation-label">Daily Active Users</span>
        <input v-model.number="dau" type="number" min="0" />
      </label>
      <label class="field">
        <span class="annotation-label">Actions / user / วัน</span>
        <input v-model.number="actionsPerUser" type="number" min="0" />
      </label>
      <label class="field">
        <span class="annotation-label">ขนาด response เฉลี่ย (KB)</span>
        <input v-model.number="payloadKB" type="number" min="0" />
      </label>
      <label class="field">
        <span class="annotation-label">Peak multiplier (× average)</span>
        <input v-model.number="peakMultiplier" type="number" min="1" step="0.5" />
      </label>
    </div>

    <div class="results">
      <div class="result-card">
        <p class="annotation-label">Requests / วัน</p>
        <p class="result-num">{{ fmt(totalRequestsPerDay) }}</p>
      </div>
      <div class="result-card">
        <p class="annotation-label">Average QPS</p>
        <p class="result-num">{{ fmt(avgQps, 1) }}</p>
      </div>
      <div class="result-card highlight">
        <p class="annotation-label">Peak QPS — ต้องออกแบบรองรับตัวนี้</p>
        <p class="result-num">{{ fmt(peakQps, 1) }}</p>
      </div>
      <div class="result-card">
        <p class="annotation-label">Data transfer / วัน</p>
        <p class="result-num">{{ fmt(dailyDataGB, 1) }} GB</p>
      </div>
      <div class="result-card">
        <p class="annotation-label">Data สะสม / ปี</p>
        <p class="result-num">{{ fmt(yearlyDataTB, 2) }} TB</p>
      </div>
    </div>
    <p class="hint annotation-label">
      สูตร: requests/วัน = DAU × actions/user ; average QPS = requests/วัน ÷ 86,400 วินาที ; peak QPS = average × multiplier
      — ตัวเลขที่ต้องออกแบบระบบให้รองรับคือ <strong>peak QPS</strong> ไม่ใช่ average
    </p>
  </div>
</template>

<style scoped>
.calc-demo {
  padding: var(--space-5);
  margin: var(--space-6) 0;
}
.presets {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}
.btn.ghost {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--paper);
  color: var(--ink-soft);
  cursor: pointer;
}
.inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}
.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.field input {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  padding: var(--space-2);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--paper);
  color: var(--ink);
}
.results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.result-card {
  padding: var(--space-3);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--paper);
}
.result-card.highlight {
  border-color: var(--accent);
  background: var(--accent-wash);
}
.result-num {
  font-family: var(--font-mono);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--ink);
  margin: 4px 0 0;
}
.hint {
  margin: 0;
}
</style>
