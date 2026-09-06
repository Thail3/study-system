<script setup lang="ts">
import { computed, ref } from 'vue'

const STAGES = [0, 10, 30, 60, 100]
const INSTANCE_COUNT = 10
const BAD_BUILD_CHANCE = 0.4
const BASELINE_ERROR_PCT = 1

const stageIndex = ref(0)
const isBadBuild = ref(Math.random() < BAD_BUILD_CHANCE)
const revealed = ref(false)

const canaryPercent = computed(() => STAGES[stageIndex.value])
const v2Count = computed(() => Math.round((INSTANCE_COUNT * canaryPercent.value) / 100))

const errorRatePercent = computed(() => {
  if (canaryPercent.value === 0) return BASELINE_ERROR_PCT
  if (!isBadBuild.value) return BASELINE_ERROR_PCT
  return Math.round(BASELINE_ERROR_PCT + canaryPercent.value * 0.6)
})

const isDangerZone = computed(() => isBadBuild.value && canaryPercent.value > 0)

function instanceState(i: number): 'v1' | 'v2-ok' | 'v2-bad' {
  if (i >= v2Count.value) return 'v1'
  return isBadBuild.value ? 'v2-bad' : 'v2-ok'
}

function advance() {
  if (stageIndex.value >= STAGES.length - 1) return
  stageIndex.value += 1
  if (canaryPercent.value === 100) revealed.value = true
}

function rollback() {
  stageIndex.value = 0
  revealed.value = true
}

function reroll() {
  isBadBuild.value = Math.random() < BAD_BUILD_CHANCE
  stageIndex.value = 0
  revealed.value = false
}
</script>

<template>
  <div class="canary-demo blueprint-panel">
    <div class="controls">
      <button class="btn" :disabled="canaryPercent >= 100" @click="advance">
        + ขยายสัดส่วน canary ({{ canaryPercent }}% → {{ STAGES[Math.min(stageIndex + 1, STAGES.length - 1)] }}%)
      </button>
      <button class="btn ghost" :disabled="canaryPercent === 0" @click="rollback">← Rollback (กลับเป็น v1 ทั้งหมด)</button>
      <button class="btn ghost" @click="reroll">สุ่ม build ใหม่</button>
    </div>

    <div class="instances">
      <div v-for="i in INSTANCE_COUNT" :key="i" class="instance-box" :class="instanceState(i - 1)">
        {{ instanceState(i - 1) === 'v1' ? 'v1' : 'v2' }}
      </div>
    </div>

    <p class="annotation-label error-rate" :class="{ danger: isDangerZone }">
      Error rate: {{ errorRatePercent }}% (baseline ~{{ BASELINE_ERROR_PCT }}%) — canary {{ canaryPercent }}% ของ traffic
    </p>
    <p v-if="revealed" class="result-text">
      {{ isBadBuild ? 'build นี้มีบั๊กจริง — เห็น error rate พุ่งตั้งแต่ canary ยังแค่ 10%' : 'build นี้ปกติดี — error rate นิ่งแม้ canary ครบ 100%' }}
    </p>
    <p v-else class="hint annotation-label">
      กด "ขยายสัดส่วน canary" ทีละขั้น สังเกต error rate — ถ้าพุ่งขึ้นให้ Rollback ทันทีก่อนกระทบ user ครบทุกคน
    </p>
  </div>
</template>

<style scoped>
.canary-demo {
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
.instances {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}
.instance-box {
  width: 44px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line-strong);
  background: var(--paper);
  color: var(--ink-soft);
  transition:
    background 0.3s,
    border-color 0.3s,
    color 0.3s;
}
.instance-box.v2-ok {
  background: var(--mark-green-wash);
  border-color: var(--mark-green);
  color: var(--mark-green);
}
.instance-box.v2-bad {
  background: var(--mark-red-wash);
  border-color: var(--mark-red);
  color: var(--mark-red);
}
.error-rate {
  margin: 0 0 var(--space-2);
}
.error-rate.danger {
  color: var(--mark-red);
}
.result-text {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  margin: 0;
}
.hint {
  margin: 0;
}
</style>
