<script setup lang="ts">
import { computed, type Component } from 'vue'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import MermaidDiagram from './MermaidDiagram.vue'
import { demoRegistry } from '../demos/registry'

// html:true lets lesson prose (authored by us, not user input) use
// <mark class="hl-term|hl-insight|hl-warning"> for the 3-color highlight
// system — DOMPurify.sanitize() below still runs as a safety net regardless.
// Module-scoped: config is static, no need to rebuild per TopicRenderer instance.
const md = new MarkdownIt({ html: true, linkify: true, typographer: true })

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'del', 'sup', 'sub', 'a', 'mark',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'hr',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  ALLOWED_ATTR: ['class', 'href', 'title'],
}

const props = defineProps<{ source: string }>()

type Segment =
  | { type: 'html'; html: string }
  | { type: 'mermaid'; code: string; caption?: string }
  | { type: 'demo'; component: Component; props: Record<string, unknown>; caption?: string }
  | { type: 'unknown-demo'; name: string }

function parseDemoBody(body: string): { name: string; props: Record<string, unknown>; caption?: string } {
  const result: { name: string; props: Record<string, unknown>; caption?: string } = { name: '', props: {} }
  for (const line of body.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    const match = trimmed.match(/^([a-zA-Z]+):\s*(.*)$/)
    if (!match) continue
    const [, key, value] = match
    if (key === 'component') result.name = value.trim()
    else if (key === 'caption') result.caption = value.trim()
    else if (key === 'props') {
      try {
        result.props = JSON.parse(value.trim())
      } catch (err) {
        result.props = {}
        if (import.meta.env.DEV) {
          console.warn(`[TopicRenderer] invalid props JSON in demo fence: ${value.trim()}`, err)
        }
      }
    }
  }
  return result
}

function extractTitle(info: string): string | undefined {
  const match = info.match(/title="([^"]*)"/)
  return match ? match[1] : undefined
}

const segments = computed<Segment[]>(() => {
  const out: Segment[] = []
  let lastIndex = 0
  const fenceRe = /```(mermaid|demo)([^\n]*)\n([\s\S]*?)```/g
  let match: RegExpExecArray | null
  while ((match = fenceRe.exec(props.source))) {
    const [full, kind, info, body] = match
    const before = props.source.slice(lastIndex, match.index)
    if (before.trim())
      out.push({ type: 'html', html: DOMPurify.sanitize(md.render(before), SANITIZE_CONFIG) })

    if (kind === 'mermaid') {
      out.push({ type: 'mermaid', code: body.trim(), caption: extractTitle(info) })
    } else {
      const parsed = parseDemoBody(body)
      const component = demoRegistry[parsed.name]
      if (component) {
        out.push({ type: 'demo', component, props: parsed.props, caption: parsed.caption })
      } else {
        out.push({ type: 'unknown-demo', name: parsed.name })
      }
    }
    lastIndex = match.index + full.length
  }
  const rest = props.source.slice(lastIndex)
  if (rest.trim()) out.push({ type: 'html', html: DOMPurify.sanitize(md.render(rest), SANITIZE_CONFIG) })
  return out
})
</script>

<template>
  <div class="topic-content">
    <template v-for="(seg, i) in segments" :key="i">
      <div v-if="seg.type === 'html'" class="prose" v-html="seg.html" />
      <MermaidDiagram v-else-if="seg.type === 'mermaid'" :code="seg.code" :caption="seg.caption" />
      <figure v-else-if="seg.type === 'demo'" class="demo-figure">
        <component :is="seg.component" v-bind="seg.props" />
        <figcaption v-if="seg.caption" class="annotation-label">{{ seg.caption }}</figcaption>
      </figure>
      <div v-else class="prose">
        <pre class="mermaid-error">unknown demo component: {{ seg.name }}</pre>
      </div>
    </template>
  </div>
</template>

<style scoped>
.topic-content :deep(.prose) {
  max-width: 72ch;
}
.topic-content :deep(ul),
.topic-content :deep(ol) {
  padding-left: 1.4em;
  margin: 0 0 var(--space-4);
}
.topic-content :deep(li) {
  margin-bottom: var(--space-2);
}
.topic-content :deep(strong) {
  color: var(--ink);
}
.topic-content :deep(mark) {
  padding: 0 0.2em;
  border-radius: var(--radius-sm);
  font-weight: 600;
}
.topic-content :deep(mark.hl-term) {
  background: var(--mark-yellow-wash);
  color: var(--mark-yellow);
}
.topic-content :deep(mark.hl-insight) {
  background: var(--mark-green-wash);
  color: var(--mark-green);
}
.topic-content :deep(mark.hl-warning) {
  background: var(--mark-red-wash);
  color: var(--mark-red);
}
.topic-content :deep(blockquote) {
  margin: var(--space-4) 0;
  padding: var(--space-3) var(--space-4);
  border-left: 3px solid var(--accent);
  background: var(--accent-wash);
  color: var(--ink-soft);
}
.topic-content :deep(code) {
  background: var(--grid-line-strong);
  padding: 0.1em 0.35em;
  border-radius: var(--radius-sm);
  font-size: 0.9em;
}
.demo-figure {
  margin: var(--space-6) 0;
}
.mermaid-error {
  color: var(--mark-red);
}
</style>
