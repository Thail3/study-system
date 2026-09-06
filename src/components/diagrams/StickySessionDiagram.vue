<script setup lang="ts">
const leftServers = [
  { y: 60, label: 'Server 1', active: false },
  { y: 150, label: 'Server 2', active: true },
  { y: 240, label: 'Server 3', active: false },
]
const rightServers = [
  { y: 60, label: 'Server 1' },
  { y: 150, label: 'Server 2' },
  { y: 240, label: 'Server 3' },
]
</script>

<template>
  <figure class="sticky-figure">
    <svg viewBox="0 0 920 400" xmlns="http://www.w3.org/2000/svg" class="sticky-svg">
      <line x1="460" y1="20" x2="460" y2="380" stroke="var(--line-strong)" stroke-width="1.5" stroke-dasharray="4 5" />
      <text x="250" y="40" text-anchor="middle" class="panel-title">STICKY SESSION</text>
      <text x="690" y="40" text-anchor="middle" class="panel-title">EXTERNAL SESSION STORE</text>

      <!-- left: sticky -->
      <rect x="60" y="160" width="50" height="40" fill="var(--paper-raised)" stroke="var(--ink)" stroke-width="1.5" />
      <text x="85" y="215" text-anchor="middle" class="node-label">Client</text>
      <path d="M110,180 C140,180 140,180 170,180" fill="none" stroke="var(--ink-faint)" stroke-width="1.5" />
      <rect x="170" y="150" width="90" height="60" fill="var(--paper-raised)" stroke="var(--ink)" stroke-width="2" />
      <text x="215" y="185" text-anchor="middle" class="node-label strong">LB</text>

      <g v-for="(s, i) in leftServers" :key="'ls' + i">
        <path
          :d="`M260,180 C310,180 310,${s.y + 25} 380,${s.y + 25}`"
          fill="none"
          :stroke="s.active ? 'var(--mark-red)' : 'var(--ink-faint)'"
          :stroke-width="s.active ? 2 : 1"
          :stroke-dasharray="s.active ? '' : '3 4'"
        />
        <rect
          x="380"
          :y="s.y"
          width="90"
          height="50"
          :fill="s.active ? 'var(--mark-red-wash)' : 'var(--paper-raised)'"
          stroke="var(--ink)"
          :stroke-width="s.active ? 2 : 1.2"
        />
        <text x="425" :y="s.y + 30" text-anchor="middle" class="node-label">{{ s.label }}</text>
      </g>
      <text x="230" y="225" text-anchor="middle" class="annotation-text">cookie: srv=2, pinned</text>
      <text x="230" y="360" text-anchor="middle" class="annotation-text">session lives only in Server 2's memory</text>

      <!-- right: external store -->
      <rect x="510" y="160" width="50" height="40" fill="var(--paper-raised)" stroke="var(--ink)" stroke-width="1.5" />
      <text x="535" y="215" text-anchor="middle" class="node-label">Client</text>
      <path d="M560,180 C590,180 590,180 620,180" fill="none" stroke="var(--ink-faint)" stroke-width="1.5" />
      <rect x="620" y="150" width="90" height="60" fill="var(--paper-raised)" stroke="var(--ink)" stroke-width="2" />
      <text x="665" y="185" text-anchor="middle" class="node-label strong">LB</text>

      <g v-for="(s, i) in rightServers" :key="'rs' + i">
        <path :d="`M710,180 C750,180 750,${s.y + 25} 800,${s.y + 25}`" fill="none" stroke="var(--accent)" stroke-width="1.5" />
        <rect x="800" :y="s.y" width="90" height="50" fill="var(--paper-raised)" stroke="var(--ink)" stroke-width="1.5" />
        <text x="845" :y="s.y + 30" text-anchor="middle" class="node-label">{{ s.label }}</text>
        <path :d="`M845,${s.y + 50} L845,315`" fill="none" stroke="var(--ink-soft)" stroke-width="1" stroke-dasharray="2 3" />
      </g>
      <rect x="720" y="320" width="250" height="40" fill="var(--accent-wash)" stroke="var(--accent)" stroke-width="1.5" />
      <text x="845" y="345" text-anchor="middle" class="node-label">Session Store (Redis / DB)</text>
      <text x="665" y="230" text-anchor="middle" class="annotation-text">any server can serve any request</text>
    </svg>
    <figcaption class="annotation-label">Fig — pin-to-server breaks when that server dies; shared store doesn't</figcaption>
  </figure>
</template>

<style scoped>
.sticky-figure {
  margin: var(--space-5) 0;
  padding: var(--space-5);
  background: var(--paper-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}
.sticky-svg {
  width: 100%;
  height: auto;
  display: block;
}
.panel-title {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  fill: var(--ink-soft);
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
