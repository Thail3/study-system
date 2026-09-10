<script setup lang="ts">
import type { Track } from '../data/modules'
import BlueprintMap from '../components/map/BlueprintMap.vue'

defineProps<{ track: Track }>()
</script>

<template>
  <BlueprintMap :track="track" />
</template>
