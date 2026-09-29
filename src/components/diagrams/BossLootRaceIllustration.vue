<script setup lang="ts">
interface Player {
  x: number
  y: number
  winner?: boolean
}

const players: Player[] = [
  { x: 470, y: 285 },
  { x: 442, y: 333 },
  { x: 400, y: 369 },
  { x: 348, y: 388, winner: true },
  { x: 292, y: 388 },
  { x: 240, y: 369 },
  { x: 197, y: 333 },
  { x: 170, y: 285 },
]

const item = { x: 320, y: 220 }
</script>

<template>
  <figure class="bl-figure">
    <svg viewBox="0 0 640 420" xmlns="http://www.w3.org/2000/svg" class="bl-svg">
      <!-- boss corpse -->
      <ellipse cx="320" cy="100" rx="70" ry="38" fill="var(--diagram-violet-wash)" stroke="var(--diagram-violet)" stroke-width="2" />
      <path d="M280,75 L295,60 M280,60 L295,75" stroke="var(--diagram-violet)" stroke-width="2.5" stroke-linecap="round" />
      <path d="M345,75 L360,60 M345,60 L360,75" stroke="var(--diagram-violet)" stroke-width="2.5" stroke-linecap="round" />
      <path d="M295,70 L310,55 L305,72 Z" fill="var(--diagram-violet)" />
      <path d="M330,72 L335,55 L350,70 Z" fill="var(--diagram-violet)" />
      <text x="320" y="145" text-anchor="middle" class="annotation-text">บอสตาย</text>

      <!-- drop line -->
      <line x1="320" y1="138" x2="320" y2="205" stroke="var(--ink-faint)" stroke-width="1.5" stroke-dasharray="3 3" />

      <!-- item drop -->
      <path d="M320,200 L340,220 L320,240 L300,220 Z" fill="var(--accent-wash)" stroke="var(--accent-strong)" stroke-width="2" />
      <path d="M320,190 L320,178 M340,220 L355,220 M320,250 L320,262 M300,220 L285,220" stroke="var(--accent-strong)" stroke-width="1.5" stroke-linecap="round" />
      <text x="320" y="270" text-anchor="middle" class="node-label strong">ไอเทมหายาก (qty=1)</text>

      <!-- players racing toward item -->
      <g v-for="(p, i) in players" :key="'player' + i">
        <line :x1="p.x" :y1="p.y" :x2="item.x" :y2="item.y" stroke="var(--line-strong)" stroke-width="1" stroke-dasharray="2 3" />
        <circle :cx="p.x" :cy="p.y" r="15" :fill="p.winner ? 'var(--accent-wash)' : 'var(--paper-raised)'" :stroke="p.winner ? 'var(--accent-strong)' : 'var(--ink-faint)'" stroke-width="1.8" />
        <text v-if="p.winner" :x="p.x" :y="p.y + 5" text-anchor="middle" class="check-mark">✓</text>
        <text v-else :x="p.x" :y="p.y + 5" text-anchor="middle" class="x-mark">×</text>
      </g>

      <text x="348" y="410" text-anchor="middle" class="node-label strong" fill="var(--accent-strong)">1 คนได้ (ping ต่ำสุด)</text>
      <text x="170" y="410" text-anchor="middle" class="annotation-text">999 คน: "มีคนเก็บไปแล้ว"</text>
    </svg>
    <figcaption class="annotation-label">Fig — ผู้เล่นนับพันกด claim พร้อมกันในหน้าต่างเวลาเดียว มีแค่ 1 คนชนะจริง — ที่เหลือเห็นข้อความเดียวกันพร้อมกันหมด</figcaption>
  </figure>
</template>

<style scoped>
.bl-figure {
  margin: var(--space-5) 0;
  padding: var(--space-5);
  background: var(--paper-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}
.bl-svg {
  width: 100%;
  height: auto;
  display: block;
}
.node-label {
  font-family: var(--font-mono);
  font-size: 12px;
  fill: var(--ink);
}
.node-label.strong {
  font-size: 13px;
  font-weight: 600;
}
.annotation-text {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--ink-faint);
}
.check-mark {
  font-size: 14px;
  font-weight: 700;
  fill: var(--accent-strong);
}
.x-mark {
  font-size: 13px;
  font-weight: 700;
  fill: var(--ink-faint);
}
figcaption {
  margin-top: var(--space-3);
  text-align: center;
}
</style>
