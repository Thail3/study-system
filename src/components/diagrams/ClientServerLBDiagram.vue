<script setup lang="ts">
const clients = [
  { y: 50, label: 'Client A' },
  { y: 140, label: 'Client B' },
  { y: 230, label: 'Client C' },
]
const servers = [
  { y: 40, label: 'Server 1' },
  { y: 140, label: 'Server 2' },
  { y: 240, label: 'Server 3' },
]
</script>

<template>
  <figure class="lb-figure">
    <svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" class="lb-svg">
      <g v-for="(c, i) in clients" :key="'client-line' + i">
        <path :d="`M90,${c.y + 20} C130,${c.y + 20} 130,155 170,155`" fill="none" stroke="var(--ink-faint)" stroke-width="1.5" />
      </g>
      <g v-for="(c, i) in clients" :key="'client' + i">
        <rect x="40" :y="c.y" width="50" height="40" fill="var(--paper-raised)" stroke="var(--ink)" stroke-width="1.5" />
        <line x1="46" :y1="c.y + 8" x2="84" :y2="c.y + 8" stroke="var(--ink-soft)" stroke-width="1" />
        <text x="65" :y="c.y + 55" text-anchor="middle" class="node-label">{{ c.label }}</text>
      </g>

      <rect x="170" y="120" width="120" height="70" fill="var(--paper-raised)" stroke="var(--ink)" stroke-width="2" />
      <text x="230" y="150" text-anchor="middle" class="node-label strong">Load</text>
      <text x="230" y="168" text-anchor="middle" class="node-label strong">Balancer</text>
      <text x="230" y="205" text-anchor="middle" class="annotation-text">L4 / L7 — health-checks each server</text>

      <g v-for="(s, i) in servers" :key="'lb-line' + i">
        <path :d="`M290,155 C340,155 340,${s.y + 30} 380,${s.y + 30}`" fill="none" stroke="var(--accent)" stroke-width="1.5" />
      </g>
      <g v-for="(s, i) in servers" :key="'server' + i">
        <rect x="380" :y="s.y" width="110" height="60" fill="var(--paper-raised)" stroke="var(--ink)" stroke-width="1.5" />
        <path :d="`M392,${s.y + 15} L468,${s.y + 15} M392,${s.y + 30} L468,${s.y + 30} M392,${s.y + 45} L468,${s.y + 45}`" stroke="var(--ink-soft)" stroke-width="1" />
        <text x="435" :y="s.y + 78" text-anchor="middle" class="node-label">{{ s.label }}</text>
      </g>

      <g v-for="(s, i) in servers" :key="'db-line' + i">
        <path :d="`M490,${s.y + 30} C570,${s.y + 30} 570,150 640,150`" fill="none" stroke="var(--ink-faint)" stroke-width="1.5" />
      </g>
      <ellipse cx="690" cy="110" rx="50" ry="14" fill="var(--paper-raised)" stroke="var(--ink)" stroke-width="1.5" />
      <path d="M640,110 L640,190 A50,14 0 0 0 740,190 L740,110" fill="var(--paper-raised)" stroke="var(--ink)" stroke-width="1.5" />
      <path d="M640,150 A50,14 0 0 0 740,150" fill="none" stroke="var(--ink)" stroke-width="1" />
      <text x="690" y="222" text-anchor="middle" class="node-label">Database</text>

      <defs>
        <marker id="lb-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="var(--accent)" />
        </marker>
      </defs>
    </svg>
    <figcaption class="annotation-label">Fig — clients never talk to servers directly, load balancer sits in front</figcaption>
  </figure>
</template>

<style scoped>
.lb-figure {
  margin: var(--space-5) 0;
  padding: var(--space-5);
  background: var(--paper-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}
.lb-svg {
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
