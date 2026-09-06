<script setup lang="ts"></script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade-page" mode="out-in">
      <component :is="Component" :key="route.fullPath" />
    </transition>
  </router-view>
</template>

<style>
.fade-page-enter-active,
.fade-page-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.fade-page-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.fade-page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
