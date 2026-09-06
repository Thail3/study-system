const globResult = import.meta.glob('./**/*.md', { eager: true, query: '?raw', import: 'default' })

const rawFiles: Record<string, string> = {}
for (const [key, value] of Object.entries(globResult)) {
  if (typeof value === 'string') {
    rawFiles[key] = value
  } else if (import.meta.env.DEV) {
    console.warn(`[content] expected raw string for ${key}, got ${typeof value}`)
  }
}

export function getTopicSource(moduleId: number, file: string): string {
  const folder = `module-${String(moduleId).padStart(2, '0')}`
  const key = `./${folder}/${file}.md`
  return rawFiles[key] ?? `_(เนื้อหายังไม่ถูกเขียน: ${key})_`
}
