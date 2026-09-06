export interface TopicMeta {
  id: string
  title: string
  file: string
}

export interface ModuleMeta {
  id: number
  slug: string
  title: string
  titleSub: string
  status: 'available' | 'coming-soon'
  position: { x: number; y: number }
  topics: TopicMeta[]
}

export const modules: ModuleMeta[] = [
  {
    id: 1,
    slug: 'fundamentals',
    title: 'Fundamentals',
    titleSub: 'พื้นฐาน client-server, network, HTTP/DNS, real-time',
    status: 'available',
    position: { x: 120, y: 80 },
    topics: [
      { id: 'client-server-model', title: 'Client-Server Model', file: '01-client-server-model' },
      { id: 'dns-resolution', title: 'DNS — จากชื่อโดเมนสู่ IP', file: '02-dns-resolution' },
      { id: 'http-lifecycle', title: 'HTTP Request/Response Lifecycle', file: '03-http-lifecycle' },
      { id: 'tcp-vs-udp', title: 'TCP vs UDP', file: '04-tcp-vs-udp' },
      { id: 'realtime-communication', title: 'Real-time Communication', file: '05-realtime-communication' },
    ],
  },
  {
    id: 2,
    slug: 'scalability',
    title: 'Scalability',
    titleSub: 'ขยายระบบรองรับโหลด',
    status: 'available',
    position: { x: 360, y: 80 },
    topics: [
      { id: 'vertical-vs-horizontal', title: 'Scale Up vs Scale Out', file: '01-vertical-vs-horizontal' },
      { id: 'load-balancer-basics', title: 'Load Balancer คืออะไร', file: '02-load-balancer-basics' },
      { id: 'lb-algorithms', title: 'อัลกอริทึมกระจายโหลด', file: '03-lb-algorithms' },
      { id: 'stateless-design', title: 'Stateless Design & Session', file: '04-stateless-design' },
    ],
  },
  {
    id: 3,
    slug: 'caching',
    title: 'Caching',
    titleSub: 'client/CDN/server/DB cache, eviction',
    status: 'available',
    position: { x: 600, y: 80 },
    topics: [
      { id: 'why-cache', title: 'ทำไมต้องมี Cache', file: '01-why-cache' },
      { id: 'cache-layers', title: 'Cache หลายระดับ (Client/CDN/Server/DB)', file: '02-cache-layers' },
      { id: 'eviction-policy', title: 'Eviction Policy (LRU)', file: '03-eviction-policy' },
      { id: 'cache-invalidation', title: 'Cache Invalidation', file: '04-cache-invalidation' },
    ],
  },
  {
    id: 4,
    slug: 'database',
    title: 'Database',
    titleSub: 'SQL vs NoSQL, index, replication, sharding, consensus',
    status: 'available',
    position: { x: 840, y: 80 },
    topics: [
      { id: 'sql-vs-nosql', title: 'SQL vs NoSQL', file: '01-sql-vs-nosql' },
      { id: 'indexing', title: 'Indexing', file: '02-indexing' },
      { id: 'replication', title: 'Replication', file: '03-replication' },
      { id: 'sharding', title: 'Sharding & Partitioning', file: '04-sharding' },
      { id: 'consensus-leader-election', title: 'Consensus & Leader Election', file: '05-consensus-leader-election' },
    ],
  },
  {
    id: 5,
    slug: 'consistency-cap',
    title: 'Consistency & CAP',
    titleSub: 'CAP theorem, PACELC, consistency patterns',
    status: 'available',
    position: { x: 840, y: 280 },
    topics: [
      { id: 'cap-theorem', title: 'CAP Theorem', file: '01-cap-theorem' },
      { id: 'pacelc', title: 'PACELC', file: '02-pacelc' },
      { id: 'consistency-models', title: 'Consistency Models (Strong vs Eventual)', file: '03-consistency-models' },
    ],
  },
  {
    id: 6,
    slug: 'async-messaging',
    title: 'Async & Messaging',
    titleSub: 'message queue, pub/sub, event-driven',
    status: 'available',
    position: { x: 600, y: 280 },
    topics: [
      { id: 'why-async', title: 'ทำไมต้อง Async', file: '01-why-async' },
      { id: 'message-queue', title: 'Message Queue', file: '02-message-queue' },
      { id: 'pub-sub', title: 'Pub/Sub', file: '03-pub-sub' },
      { id: 'event-driven', title: 'Event-Driven Architecture', file: '04-event-driven' },
    ],
  },
  {
    id: 7,
    slug: 'microservices-api',
    title: 'Microservices & API Design',
    titleSub: 'REST/gRPC, API gateway, service discovery, distributed transactions',
    status: 'available',
    position: { x: 360, y: 280 },
    topics: [
      { id: 'monolith-vs-microservices', title: 'Monolith vs Microservices', file: '01-monolith-vs-microservices' },
      { id: 'rest-vs-grpc', title: 'REST vs gRPC', file: '02-rest-vs-grpc' },
      { id: 'api-gateway', title: 'API Gateway', file: '03-api-gateway' },
      { id: 'service-discovery', title: 'Service Discovery', file: '04-service-discovery' },
      { id: 'distributed-transactions-saga', title: 'Distributed Transactions & Saga', file: '05-distributed-transactions-saga' },
    ],
  },
  {
    id: 8,
    slug: 'reliability',
    title: 'Reliability',
    titleSub: 'rate limiting, circuit breaker, retry, failover, observability, idempotency, deployment',
    status: 'available',
    position: { x: 120, y: 280 },
    topics: [
      { id: 'rate-limiting', title: 'Rate Limiting', file: '01-rate-limiting' },
      { id: 'circuit-breaker', title: 'Circuit Breaker', file: '02-circuit-breaker' },
      { id: 'retry-backoff', title: 'Retry & Backoff', file: '03-retry-backoff' },
      { id: 'failover-redundancy', title: 'Failover & Redundancy', file: '04-failover-redundancy' },
      { id: 'observability', title: 'Observability (Log, Metric, Trace)', file: '05-observability' },
      { id: 'idempotency', title: 'Idempotency', file: '06-idempotency' },
      { id: 'deployment-strategies', title: 'Deployment Strategies', file: '07-deployment-strategies' },
    ],
  },
  {
    id: 9,
    slug: 'storage-at-scale',
    title: 'Storage at Scale',
    titleSub: 'blob storage, CDN delivery, search index',
    status: 'available',
    position: { x: 120, y: 480 },
    topics: [
      { id: 'object-storage', title: 'Blob / Object Storage', file: '01-object-storage' },
      { id: 'cdn', title: 'CDN', file: '02-cdn' },
      { id: 'search-index', title: 'Search Index', file: '03-search-index' },
    ],
  },
  {
    id: 10,
    slug: 'security-basics',
    title: 'Security Basics',
    titleSub: 'authN/authZ, encryption in transit/rest',
    status: 'available',
    position: { x: 360, y: 480 },
    topics: [
      { id: 'authn-vs-authz', title: 'Authentication vs Authorization', file: '01-authn-vs-authz' },
      { id: 'oauth-flow', title: 'OAuth / Token Flow', file: '02-oauth-flow' },
      { id: 'encryption', title: 'Encryption in Transit vs at Rest', file: '03-encryption' },
    ],
  },
  {
    id: 11,
    slug: 'capacity-estimation',
    title: 'Capacity Estimation',
    titleSub: 'back-of-envelope math',
    status: 'available',
    position: { x: 600, y: 480 },
    topics: [
      { id: 'why-estimate', title: 'ทำไมต้อง Estimate', file: '01-why-estimate' },
      { id: 'latency-numbers', title: 'Latency Numbers ที่ควรจำ', file: '02-latency-numbers' },
      { id: 'estimation-calculator', title: 'ตัวอย่างคำนวณ', file: '03-estimation-calculator' },
    ],
  },
  {
    id: 12,
    slug: 'case-studies',
    title: 'Case Studies',
    titleSub: 'URL shortener, chat app, news feed, rate limiter',
    status: 'available',
    position: { x: 840, y: 480 },
    topics: [
      { id: 'url-shortener', title: 'Design: URL Shortener', file: '01-url-shortener' },
      { id: 'chat-app', title: 'Design: Chat App', file: '02-chat-app' },
      { id: 'news-feed', title: 'Design: News Feed', file: '03-news-feed' },
      { id: 'rate-limiter-case', title: 'Design: Rate Limiter', file: '04-rate-limiter-case' },
    ],
  },
]

export function getModuleBySlug(slug: string): ModuleMeta | undefined {
  return modules.find((m) => m.slug === slug)
}

export const mapPath = modules.map((m) => m.position)
