<script setup lang="ts">
const departments = ['Cart', 'Order', 'Payment', 'Inventory']
const huts = [
  { cx: 560, label: 'Cart' },
  { cx: 660, label: 'Order' },
  { cx: 760, label: 'Payment' },
  { cx: 860, label: 'Inventory' },
]
</script>

<template>
  <figure class="mm-figure">
    <svg viewBox="0 0 940 280" xmlns="http://www.w3.org/2000/svg" class="mm-svg">
      <!-- LEFT: one big factory, one roof, one door -->
      <path d="M40,110 L150,50 L260,110 Z" fill="var(--diagram-violet-wash)" stroke="var(--diagram-violet)" stroke-width="2" />
      <rect x="40" y="110" width="220" height="110" fill="var(--diagram-violet-wash)" stroke="var(--diagram-violet)" stroke-width="2" />
      <g v-for="(d, i) in departments" :key="'dept' + i">
        <line :x1="40 + (i + 1) * 44" y1="110" :x2="40 + (i + 1) * 44" y2="220" stroke="var(--diagram-violet)" stroke-width="1" stroke-dasharray="2 3" opacity="0.6" />
        <text :x="40 + i * 44 + 22" y="200" text-anchor="middle" class="dept-label">{{ d }}</text>
      </g>
      <rect x="130" y="185" width="40" height="35" fill="var(--paper-raised)" stroke="var(--diagram-violet)" stroke-width="1.5" />
      <text x="150" y="245" text-anchor="middle" class="node-label strong">Monolith</text>
      <text x="150" y="261" text-anchor="middle" class="annotation-text">หลังคาเดียว ประตูเดียว ทุกแผนกอยู่ใต้ชายคาเดียวกัน</text>

      <!-- divider -->
      <line x1="420" y1="30" x2="420" y2="260" stroke="var(--line)" stroke-width="1" stroke-dasharray="4 4" />

      <!-- RIGHT: separate small huts, each own roof + door, connected by paths -->
      <g v-for="(h, i) in huts" :key="'hut-connector' + i">
        <line v-if="i > 0" :x1="huts[i - 1].cx + 20" y1="200" :x2="h.cx - 20" y2="200" stroke="var(--diagram-blue)" stroke-width="1.5" stroke-dasharray="3 3" />
      </g>
      <g v-for="(h, i) in huts" :key="'hut' + i">
        <path :d="`M${h.cx - 25},170 L${h.cx},145 L${h.cx + 25},170 Z`" fill="var(--diagram-blue-wash)" stroke="var(--diagram-blue)" stroke-width="1.8" />
        <rect :x="h.cx - 25" y="170" width="50" height="50" fill="var(--diagram-blue-wash)" stroke="var(--diagram-blue)" stroke-width="1.8" />
        <rect :x="h.cx - 7" y="195" width="14" height="25" fill="var(--paper-raised)" stroke="var(--diagram-blue)" stroke-width="1.2" />
        <text :x="h.cx" y="235" text-anchor="middle" class="dept-label">{{ h.label }}</text>
      </g>
      <text x="710" y="255" text-anchor="middle" class="node-label strong">Microservices</text>
      <text x="710" y="271" text-anchor="middle" class="annotation-text">หลังคาแยก ประตูแยก เดินไปมาหากันเป็นเส้นทางที่กำหนดไว้ชัด</text>
    </svg>
    <figcaption class="annotation-label">Fig — โรงงานหลังเดียวที่มีทุกแผนกใต้ชายคาเดียว เทียบกับกลุ่มโรงเรือนแยกที่เชื่อมกันด้วยเส้นทางที่ชัดเจน</figcaption>
  </figure>
</template>

<style scoped>
.mm-figure {
  margin: var(--space-5) 0;
  padding: var(--space-5);
  background: var(--paper-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}
.mm-svg {
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
.dept-label {
  font-family: var(--font-mono);
  font-size: 9.5px;
  fill: var(--ink-faint);
}
.annotation-text {
  font-family: var(--font-mono);
  font-size: 9.5px;
  fill: var(--ink-faint);
}
figcaption {
  margin-top: var(--space-3);
  text-align: center;
}
</style>
