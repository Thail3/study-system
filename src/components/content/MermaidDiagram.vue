<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Mermaid } from 'mermaid'

const props = defineProps<{ code: string; caption?: string }>()

const container = ref<HTMLDivElement | null>(null)
let renderToken = 0

let mermaidPromise: Promise<Mermaid> | null = null

function loadMermaid(): Promise<Mermaid> {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        fontFamily: 'IBM Plex Mono, monospace',
        themeVariables: {
          primaryColor: '#fbf8f0',
          primaryTextColor: '#16324f',
          primaryBorderColor: '#16324f',
          lineColor: '#1f6f8b',
          secondaryColor: '#f6f2e7',
          tertiaryColor: '#f6f2e7',
          noteBkgColor: '#fbf8f0',
          noteBorderColor: '#9fb0be',
          edgeLabelBackground: '#f6f2e7',
          fontSize: '14px',
        },
      })
      return mermaid
    })
  }
  return mermaidPromise
}

async function render() {
  const token = ++renderToken
  const id = `mermaid-${Math.random().toString(36).slice(2, 10)}`
  try {
    const mermaid = await loadMermaid()
    const { svg } = await mermaid.render(id, props.code)
    if (token === renderToken && container.value) {
      container.value.innerHTML = svg
    }
  } catch (err) {
    if (token === renderToken && container.value) {
      container.value.innerHTML = ''
      const pre = document.createElement('pre')
      pre.className = 'mermaid-error'
      pre.textContent = `diagram render error: ${(err as Error).message}`
      container.value.appendChild(pre)
    }
  }
}

onMounted(render)
watch(() => props.code, render)
</script>

<template>
  <figure class="diagram-figure">
    <div ref="container" class="mermaid-mount" />
    <figcaption v-if="caption" class="annotation-label">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.diagram-figure {
  margin: var(--space-5) 0;
  padding: var(--space-5);
  background: var(--paper-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  overflow-x: auto;
}
.mermaid-mount {
  display: flex;
  justify-content: center;
}
.mermaid-mount :deep(svg) {
  max-width: 100%;
  height: auto;
}
figcaption {
  margin-top: var(--space-3);
  text-align: center;
}
.mermaid-error {
  color: var(--mark-red);
  font-size: 0.8rem;
  white-space: pre-wrap;
}
</style>
