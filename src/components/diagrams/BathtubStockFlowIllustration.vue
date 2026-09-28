<script setup lang="ts"></script>

<template>
  <figure class="bt-figure">
    <svg viewBox="0 0 500 320" xmlns="http://www.w3.org/2000/svg" class="bt-svg">
      <!-- source cloud (unlimited water supply) -->
      <path
        d="M40,50 a10,10 0 0 1 4,-19 a12,12 0 0 1 23,-4 a9,9 0 0 1 11,12 a9,9 0 0 1 -3,17 h-28 a8,8 0 0 1 -7,-6 z"
        fill="var(--paper)"
        stroke="var(--ink-faint)"
        stroke-width="1.5"
      />

      <!-- faucet body -->
      <rect x="95" y="55" width="14" height="35" rx="3" fill="var(--paper-raised)" stroke="var(--ink)" stroke-width="2" />
      <rect x="95" y="85" width="55" height="12" rx="4" fill="var(--paper-raised)" stroke="var(--ink)" stroke-width="2" />

      <!-- inflow stream -->
      <line x1="145" y1="97" x2="145" y2="150" stroke="var(--diagram-blue)" stroke-width="3" stroke-dasharray="4 4" marker-end="url(#bt-arrow)" />

      <!-- tub outline -->
      <rect x="120" y="150" width="260" height="110" rx="28" fill="var(--paper-raised)" stroke="var(--ink)" stroke-width="2.5" />
      <!-- water inside tub -->
      <rect x="132" y="190" width="236" height="65" rx="18" fill="var(--diagram-blue-wash)" stroke="var(--diagram-blue)" stroke-width="1.5" />

      <!-- drain -->
      <circle cx="250" cy="256" r="6" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.5" />
      <line x1="250" y1="262" x2="250" y2="290" stroke="var(--ink-soft)" stroke-width="3" />
      <line x1="250" y1="290" x2="400" y2="290" stroke="var(--ink-soft)" stroke-width="3" marker-end="url(#bt-arrow-soft)" />

      <!-- sink cloud (unlimited drain) -->
      <path
        d="M400,270 a10,10 0 0 1 4,-19 a12,12 0 0 1 23,-4 a9,9 0 0 1 11,12 a9,9 0 0 1 -3,17 h-28 a8,8 0 0 1 -7,-6 z"
        fill="var(--paper)"
        stroke="var(--ink-faint)"
        stroke-width="1.5"
      />

      <!-- labels -->
      <text x="35" y="30" class="annotation-text">แหล่งน้ำ (ไม่จำกัด)</text>
      <text x="160" y="115" class="node-label strong" fill="var(--diagram-blue)">Inflow: ก๊อกน้ำ</text>
      <text x="250" y="222" text-anchor="middle" class="node-label strong">Stock: น้ำในอ่าง</text>
      <text x="290" y="310" class="node-label strong" fill="var(--ink-soft)">Outflow: ท่อระบาย</text>
      <text x="420" y="255" class="annotation-text">ท่อระบายสาธารณะ (ไม่จำกัด)</text>

      <defs>
        <marker id="bt-arrow" markerWidth="8" markerHeight="8" refX="4" refY="7" orient="auto">
          <path d="M0,0 L4,7 L8,0 Z" fill="var(--diagram-blue)" />
        </marker>
        <marker id="bt-arrow-soft" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="var(--ink-soft)" />
        </marker>
      </defs>
    </svg>
    <figcaption class="annotation-label">Fig — อ่างอาบน้ำจริง: ก๊อกน้ำเติม (inflow) น้ำในอ่างสะสม (stock) ท่อระบายพร่อง (outflow) — เทียบภาพนี้กับสัญลักษณ์ทางการด้านบนได้เลย</figcaption>
  </figure>
</template>

<style scoped>
.bt-figure {
  margin: var(--space-5) 0;
  padding: var(--space-5);
  background: var(--paper-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}
.bt-svg {
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
figcaption {
  margin-top: var(--space-3);
  text-align: center;
}
</style>
