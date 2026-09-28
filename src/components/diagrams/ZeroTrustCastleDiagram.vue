<script setup lang="ts">
const oldRooms = [
  { x: 60, y: 60 },
  { x: 150, y: 60 },
  { x: 105, y: 130 },
]
const newRooms = [
  { x: 560, y: 40, label: 'Room A' },
  { x: 680, y: 40, label: 'Room B' },
  { x: 560, y: 150, label: 'Room C' },
  { x: 680, y: 150, label: 'Room D' },
]
</script>

<template>
  <figure class="zt-figure">
    <svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg" class="zt-svg">
      <!-- LEFT: Perimeter security castle -->
      <ellipse cx="130" cy="150" rx="150" ry="120" fill="none" stroke="var(--diagram-rose)" stroke-width="1.5" stroke-dasharray="3 4" />
      <rect x="20" y="50" width="220" height="160" fill="var(--diagram-rose-wash)" stroke="var(--diagram-rose)" stroke-width="2" />
      <g v-for="i in 8" :key="'tooth' + i">
        <rect :x="20 + (i - 1) * 27.5" y="42" width="18" height="10" fill="var(--diagram-rose-wash)" stroke="var(--diagram-rose)" stroke-width="1.5" />
      </g>
      <rect x="110" y="150" width="40" height="60" fill="var(--paper-raised)" stroke="var(--diagram-rose)" stroke-width="2" />
      <g v-for="(r, i) in oldRooms" :key="'old-room' + i">
        <rect :x="r.x" :y="r.y" width="40" height="30" fill="var(--paper-raised)" stroke="var(--ink-faint)" stroke-width="1.2" />
      </g>
      <path d="M100,90 L140,90 M100,105 L140,105 M170,90 L200,90 M170,105 L200,105" stroke="var(--ink-faint)" stroke-width="1" stroke-dasharray="2 2" />
      <text x="130" y="235" text-anchor="middle" class="node-label strong">Perimeter Security</text>
      <text x="130" y="252" text-anchor="middle" class="annotation-text">กำแพงเดียว ประตูเดียว — เข้ามาได้แล้วเดินถึงทุกห้องเลย</text>

      <!-- divider -->
      <line x1="450" y1="30" x2="450" y2="260" stroke="var(--line)" stroke-width="1" stroke-dasharray="4 4" />

      <!-- RIGHT: Zero trust, checkpoint per room -->
      <g v-for="(r, i) in newRooms" :key="'new-room' + i">
        <rect :x="r.x" :y="r.y" width="90" height="70" fill="var(--diagram-blue-wash)" stroke="var(--diagram-blue)" stroke-width="1.5" />
        <text :x="r.x + 45" :y="r.y + 40" text-anchor="middle" class="node-label">{{ r.label }}</text>
        <g :transform="`translate(${r.x + 45 - 6}, ${r.y - 12})`">
          <rect x="0" y="5" width="12" height="10" rx="1.5" fill="var(--paper-raised)" stroke="var(--diagram-blue)" stroke-width="1.3" />
          <path d="M2,5 V2.5 A4,4 0 0 1 10,2.5 V5" fill="none" stroke="var(--diagram-blue)" stroke-width="1.3" />
        </g>
      </g>
      <text x="670" y="235" text-anchor="middle" class="node-label strong">Zero Trust</text>
      <text x="670" y="252" text-anchor="middle" class="annotation-text">ทุกห้องมีด่านตรวจของตัวเอง — เข้าห้องนี้ได้ไม่ได้แปลว่าเข้าห้องอื่นได้</text>
    </svg>
    <figcaption class="annotation-label">Fig — ปราสาทกำแพงเดียว (ตรวจแค่ตอนเข้าประตูใหญ่) เทียบกับ Zero Trust (ตรวจทุกจุดที่ข้าม boundary)</figcaption>
  </figure>
</template>

<style scoped>
.zt-figure {
  margin: var(--space-5) 0;
  padding: var(--space-5);
  background: var(--paper-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}
.zt-svg {
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
  font-size: 14px;
  font-weight: 600;
}
.annotation-text {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--ink-faint);
}
figcaption {
  margin-top: var(--space-3);
  text-align: center;
}
</style>
