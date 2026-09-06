<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

interface Layer {
  name: string
  available: boolean
  latency: number
}

const layers = reactive<Layer[]>([
  { name: 'Browser Cache', available: true, latency: 0 },
  { name: 'CDN', available: false, latency: 20 },
  { name: 'Server Cache', available: false, latency: 2 },
  { name: 'Redis', available: true, latency: 5 },
  { name: 'Database', available: true, latency: 50 },
])

const particleX = ref(-1)
const running = ref(false)
const resultText = ref('')
let rafHandle: number | null = null

function layerX(i: number) {
  return 60 + i * 150
}

function toggle(i: number) {
  layers[i].available = !layers[i].available
}

async function dispatch() {
  if (running.value) return
  running.value = true
  resultText.value = ''
  let hitIndex = layers.findIndex((l) => l.available)
  const travelTo = hitIndex === -1 ? layers.length - 1 : hitIndex
  const targetX = layerX(travelTo)
  const startTime = performance.now()
  const duration = 350 + travelTo * 200

  particleX.value = layerX(0) - 40
  await new Promise<void>((resolve) => {
    function tick(now: number) {
      const t = Math.min(1, (now - startTime) / duration)
      particleX.value = (layerX(0) - 40) + (targetX - (layerX(0) - 40)) * t
      if (t < 1) {
        rafHandle = requestAnimationFrame(tick)
      } else {
        resolve()
      }
    }
    rafHandle = requestAnimationFrame(tick)
  })

  const totalLatency = layers.slice(0, travelTo + 1).reduce((sum, l) => sum + l.latency, 0)
  if (hitIndex === -1) {
    resultText.value = `ไม่ hit ที่ไหนเลย ต้องอ่านจาก Database จริง — รวมเวลา ~${totalLatency}ms`
  } else {
    const path = layers.slice(0, hitIndex).map((l) => l.name).join(' → ')
    resultText.value = `Hit ที่ ${layers[hitIndex].name}${path ? ` (ผ่าน ${path} มาก่อน)` : ''} — รวมเวลา ~${totalLatency}ms`
  }
  running.value = false
}

const particleVisible = computed(() => particleX.value >= 0)

onMounted(() => {
  particleX.value = -1
})
onBeforeUnmount(() => {
  if (rafHandle) cancelAnimationFrame(rafHandle)
})
</script>

<template>
  <div class="cache-layers-demo blueprint-panel">
    <div class="controls">
      <button class="btn" :disabled="running" @click="dispatch">ส่ง request ใหม่</button>
      <span class="annotation-label">คลิกกล่องด้านล่างเพื่อสลับว่าชั้นนั้น "มีข้อมูล (hit)" หรือไม่</span>
    </div>

    <svg viewBox="0 0 820 160" xmlns="http://www.w3.org/2000/svg" class="layers-svg">
      <line x1="40" y1="80" :x2="layerX(4) + 40" y2="80" stroke="var(--line-strong)" stroke-width="1.5" stroke-dasharray="4 4" />
      <g
        v-for="(l, i) in layers"
        :key="l.name"
        class="layer-group"
        tabindex="0"
        role="button"
        :aria-label="`toggle ${l.name} cache hit`"
        @click="toggle(i)"
        @keydown.enter="toggle(i)"
        @keydown.space.prevent="toggle(i)"
      >
        <rect
          :x="layerX(i) - 45"
          y="50"
          width="90"
          height="60"
          rx="3"
          :fill="l.available ? 'var(--mark-green-wash)' : 'var(--paper-raised)'"
          :stroke="l.available ? 'var(--mark-green)' : 'var(--line-strong)'"
          stroke-width="1.75"
        />
        <text :x="layerX(i)" y="75" text-anchor="middle" class="layer-name">{{ l.name }}</text>
        <text :x="layerX(i)" y="93" text-anchor="middle" class="layer-latency">~{{ l.latency }}ms</text>
        <text :x="layerX(i)" y="128" text-anchor="middle" class="layer-state">{{ l.available ? 'มีข้อมูล' : 'ไม่มี' }}</text>
      </g>
      <circle v-if="particleVisible" :cx="particleX" cy="80" r="7" fill="var(--accent)" />
    </svg>

    <p v-if="resultText" class="result-text">{{ resultText }}</p>
    <p v-else class="result-text placeholder">กด "ส่ง request ใหม่" เพื่อดูว่า request วิ่งผ่านชั้นไหนบ้างก่อนเจอข้อมูล</p>
  </div>
</template>

<style scoped>
.cache-layers-demo {
  padding: var(--space-5);
  margin: var(--space-6) 0;
}
.controls {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
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
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.layers-svg {
  width: 100%;
  height: auto;
  display: block;
}
.layer-group {
  cursor: pointer;
}
.layer-group:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.layer-name {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 600;
  fill: var(--ink);
}
.layer-latency {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--ink-soft);
}
.layer-state {
  font-family: var(--font-mono);
  font-size: 9px;
  fill: var(--ink-faint);
}
.result-text {
  margin: var(--space-3) 0 0;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--ink);
}
.result-text.placeholder {
  color: var(--ink-faint);
  font-style: italic;
}
</style>
