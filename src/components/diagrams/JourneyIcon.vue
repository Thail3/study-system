<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <svg viewBox="0 0 24 24" class="journey-icon" aria-hidden="true">
    <g v-if="name === 'house'">
      <path d="M3 11 L12 4 L21 11" />
      <path d="M5 11 V21 H19 V11" />
      <path d="M10 21 V15 H14 V21" />
    </g>
    <g v-else-if="name === 'building'">
      <rect x="5" y="2" width="14" height="20" />
      <rect x="8" y="5" width="3" height="3" />
      <rect x="13" y="5" width="3" height="3" />
      <rect x="8" y="10" width="3" height="3" />
      <rect x="13" y="10" width="3" height="3" />
      <rect x="8" y="15" width="3" height="3" />
      <rect x="13" y="15" width="3" height="3" />
    </g>
    <g v-else-if="name === 'person'">
      <circle cx="12" cy="6" r="3" />
      <path d="M12 9 V16 M8 12 H16 M12 16 L8 22 M12 16 L16 22" />
    </g>
    <g v-else-if="name === 'notebook'">
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M8 8 H16 M8 12 H16 M8 16 H13" />
    </g>
    <g v-else-if="name === 'phone'">
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <circle cx="12" cy="18.5" r="0.8" fill="currentColor" stroke="none" />
    </g>
    <g v-else-if="name === 'gate'">
      <path d="M4 21 V5 M20 21 V5 M4 7 H20" />
      <path d="M9 12 L11.5 14.5 L16 9" />
    </g>
    <g v-else-if="name === 'envelope'">
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="M3 6 L12 14 L21 6" />
    </g>
  </svg>
</template>

<style scoped>
.journey-icon {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
