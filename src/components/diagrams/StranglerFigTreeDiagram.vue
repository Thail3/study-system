<script setup lang="ts">
const stages = [
  { cx: 150, label: 'เริ่มต้น', sub: 'ระบบเก่าทำงานเต็มรูปแบบ ยังไม่มีอะไรมาแทนที่' },
  { cx: 450, label: 'ระหว่างทาง', sub: 'สร้างส่วนใหม่ขึ้นมาทีละจุด ครอบ/แทนที่ทีละ capability' },
  { cx: 750, label: 'สมบูรณ์', sub: 'ระบบใหม่ทำงานแทนทั้งหมด ค่อยรื้อของเก่าที่เหลือทิ้ง' },
]
</script>

<template>
  <figure class="sf-figure">
    <svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg" class="sf-svg">
      <!-- Stage 1: old tree only -->
      <rect x="140" y="150" width="20" height="90" fill="var(--diagram-violet-wash)" stroke="var(--diagram-violet)" stroke-width="2" />
      <circle cx="150" cy="120" r="55" fill="var(--diagram-violet-wash)" stroke="var(--diagram-violet)" stroke-width="2" />

      <!-- Stage 2: vine wraps around old trunk, both visible -->
      <rect x="440" y="150" width="20" height="90" fill="var(--diagram-violet-wash)" stroke="var(--diagram-violet)" stroke-width="2" />
      <circle cx="450" cy="120" r="55" fill="var(--diagram-violet-wash)" stroke="var(--diagram-violet)" stroke-width="1.5" opacity="0.55" />
      <path
        d="M430,240 C420,190 470,180 445,140 C425,110 475,95 450,65 C435,45 470,35 460,20"
        fill="none"
        stroke="var(--diagram-blue)"
        stroke-width="3"
        stroke-linecap="round"
      />
      <circle cx="430" cy="240" r="4" fill="var(--diagram-blue)" />
      <circle cx="445" cy="140" r="4" fill="var(--diagram-blue)" />
      <circle cx="450" cy="65" r="4" fill="var(--diagram-blue)" />
      <circle cx="460" cy="20" r="4" fill="var(--diagram-blue)" />

      <!-- Stage 3: new structure only, old trunk hollow/gone -->
      <rect x="740" y="150" width="20" height="90" fill="none" stroke="var(--diagram-violet)" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.5" />
      <circle cx="750" cy="120" r="55" fill="var(--diagram-blue-wash)" stroke="var(--diagram-blue)" stroke-width="2.5" />
      <path d="M735,235 C725,180 780,170 750,60" fill="none" stroke="var(--diagram-blue)" stroke-width="3" stroke-linecap="round" />

      <!-- ground line -->
      <line x1="30" y1="240" x2="870" y2="240" stroke="var(--line)" stroke-width="1.5" />

      <!-- stage dividers + labels -->
      <line x1="300" y1="20" x2="300" y2="260" stroke="var(--line)" stroke-width="1" stroke-dasharray="4 4" />
      <line x1="600" y1="20" x2="600" y2="260" stroke="var(--line)" stroke-width="1" stroke-dasharray="4 4" />

      <g v-for="(s, i) in stages" :key="'stage-label' + i">
        <text :x="s.cx" y="270" text-anchor="middle" class="node-label strong">{{ s.label }}</text>
        <text :x="s.cx" y="286" text-anchor="middle" class="annotation-text">{{ s.sub }}</text>
      </g>
    </svg>
    <figcaption class="annotation-label">Fig — เถาไม้เลื้อย (ระบบใหม่ สีฟ้า) ค่อยๆ เติบโตครอบต้นไม้เดิม (ระบบเก่า สีม่วง) ทีละส่วนจนแทนที่ทั้งหมด</figcaption>
  </figure>
</template>

<style scoped>
.sf-figure {
  margin: var(--space-5) 0;
  padding: var(--space-5);
  background: var(--paper-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}
.sf-svg {
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
  font-size: 9.5px;
  fill: var(--ink-faint);
}
figcaption {
  margin-top: var(--space-3);
  text-align: center;
}
</style>
