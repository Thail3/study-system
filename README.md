# Study System — เรียน System Design

สื่อเรียนรู้ System Design ส่วนตัว สร้างด้วย Vue 3 + TypeScript + Vite เนื้อหาเป็นภาษาไทยแทรกศัพท์เทคนิคอังกฤษ อธิบายแบบ analogy-first (ยกตัวอย่างเห็นภาพก่อนเข้าคำศัพท์) พร้อมไดอะแกรมและ interactive demo ประกอบแทบทุกหัวข้อ

หน้าแรกเป็น "blueprint map" ให้คลิกเข้าโมดูลไหนก่อนก็ได้ ไม่บังคับเรียงลำดับ ความคืบหน้าการอ่านเก็บใน `localStorage` ของเบราว์เซอร์เท่านั้น (ไม่มี backend, ไม่มี account)

## หลักสูตร (12 โมดูล)

1. Fundamentals — Client-Server, DNS, HTTP lifecycle, TCP vs UDP
2. Scalability — Scale up/out, Load Balancer, อัลกอริทึมกระจายโหลด, Stateless design
3. Caching — ทำไมต้อง cache, cache หลายระดับ, LRU eviction, cache invalidation
4. Database — SQL vs NoSQL, Indexing, Replication, Sharding
5. Consistency & CAP — CAP theorem, PACELC, Consistency models
6. Async & Messaging — Message queue, Pub/Sub, Event-driven architecture
7. Microservices & API Design — Monolith vs microservices, REST vs gRPC, API Gateway, Service discovery
8. Reliability — Rate limiting, Circuit breaker, Retry & backoff, Failover
9. Storage at Scale — Object storage, CDN, Search index
10. Security Basics — AuthN vs AuthZ, OAuth flow, Encryption
11. Capacity Estimation — Latency numbers, ตัวอย่างคำนวณ
12. Case Studies — URL shortener, Chat app, News feed, Rate limiter

## Dev

```bash
npm install
npm run dev
```

## คำสั่งอื่น

```bash
npm run build      # type-check (vue-tsc) + build production
npm run preview    # preview production build
npm test           # run vitest
npm run lint       # eslint
```

## Stack

- Vue 3 (`<script setup>`, Composition API) + TypeScript (strict) + Vite
- vue-router สำหรับ routing แบบ non-linear
- markdown-it + DOMPurify — render เนื้อหา markdown พร้อม sanitize ก่อน `v-html`
- mermaid — วาด diagram จาก markdown fence (`\`\`\`mermaid`), lazy-loaded แยก chunk
- Custom fence syntax (`\`\`\`demo`) — ฝัง interactive Vue component เข้าไปในเนื้อหา markdown ได้ตรงจุด
- Vitest + @vue/test-utils — component/unit tests
- ESLint (flat config, `eslint-plugin-vue` + `typescript-eslint`)

## โครงสร้างเนื้อหา

- `src/content/module-NN/*.md` — เนื้อหาแต่ละหัวข้อ (raw markdown, โหลดผ่าน `import.meta.glob`)
- `src/data/modules.ts` — สารบัญ/metadata ของแต่ละโมดูลและหัวข้อ
- `src/components/content/TopicRenderer.vue` — parser แปลง markdown + demo fence เป็น segment แล้ว render
- `src/components/demos/` — interactive demo components (เช่น Load Balancer, Circuit Breaker, Queue)
- `src/components/map/BlueprintMap.vue` — หน้าแรก/systems map
