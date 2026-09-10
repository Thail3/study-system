const loaders = import.meta.glob('./**/*.md', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>

export async function getTopicSource(moduleId: number, file: string): Promise<string> {
  const folder = `module-${String(moduleId).padStart(2, '0')}`
  const key = `./${folder}/${file}.md`
  const load = loaders[key]
  if (!load) return `_(เนื้อหายังไม่ถูกเขียน: ${key})_`
  const src = await load()
  if (typeof src === 'string') return src
  if (import.meta.env.DEV) {
    console.warn(`[content] expected raw string for ${key}, got ${typeof src}`)
  }
  return `_(เนื้อหายังไม่ถูกเขียน: ${key})_`
}
