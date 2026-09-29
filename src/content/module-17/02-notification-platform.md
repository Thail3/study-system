ลองนึกภาพห้องส่งข่าวของสถานีวิทยุ — เวลามีเหตุการณ์เกิดขึ้น (ไฟไหม้, อุบัติเหตุ, ผลบอล) นักข่าวภาคสนามไม่ได้โทรหาทุกช่องทุกช่อง ทุกหนังสือพิมพ์ ทุกเว็บข่าวเองทีละที่ เขาแค่**ส่งข่าวเข้าศูนย์กลาง** แล้วศูนย์กลางนั้นจะกระจายข่าวต่อไปยังทุกช่องทางเองโดยอัตโนมัติ — วิทยุ, ทีวี, เว็บ, แอปมือถือ — นักข่าวภาคสนามไม่ต้องรู้ด้วยซ้ำว่าปลายทางมีกี่ช่องทาง

ระบบ **Notification Platform** ในบริษัท e-commerce หรือ fintech ก็ทำงานแบบเดียวกันเป๊ะ — เวลามีเหตุการณ์เกิดขึ้นในระบบ (สินค้าจัดส่งแล้ว, การชำระเงินล้มเหลว, บัญชีถูกล็อก) จะต้องมีคนแจ้งผู้ใช้ผ่านหลายช่องทาง (email, push notification, SMS) โดยที่ service ต้นทางไม่ต้องรู้เรื่องช่องทางเหล่านั้นเลยแม้แต่น้อย

## Requirement คร่าวๆ

- Service ต่างๆ ในระบบ (Order, Payment, Auth ฯลฯ) เกิด event แล้วต้องมีคนส่งแจ้งเตือนผู้ใช้ได้ โดยที่ Order Service ไม่ต้องรู้จัก Twilio หรือ SendGrid เลย
- รองรับหลายช่องทาง: Email, Push Notification, SMS — และเพิ่มช่องทางใหม่ในอนาคตได้โดยไม่กระทบ service ต้นทาง
- ปริมาณ event ไม่สม่ำเสมอ — บางช่วงเงียบมาก (กลางดึก) บางช่วงพุ่งสูงมาก (flash sale, batch job ตอนเช้า)
- แจ้งเตือนพลาดได้บ้าง (ส่งช้าไม่กี่วินาทีไม่ตาย) แต่ต้อง**ไม่ทำให้ Order/Payment service ช้าลง**เพราะรอส่ง notification

## Event-Driven Architecture: จุดเชื่อมที่หลวมโดยตั้งใจ

จากโมดูล 13 — ถ้าให้ Order Service เรียก Notification Service ตรงๆ แบบ synchronous (เหมือนนักข่าวโทรหาทุกช่องเอง) จะเกิดปัญหาสองอย่าง: หนึ่ง Order Service ต้องรู้จักทุก client ที่ต้องแจ้ง (tight coupling) สอง ถ้า Notification Service ช้าหรือล่ม จะดึง Order Service ให้ช้าตามไปด้วย (cascading failure) ทั้งที่การแจ้งเตือนไม่ได้อยู่ใน critical path ของการสั่งซื้อ

คำตอบคือ <mark class="hl-term">**Event-Driven Architecture**</mark> — Order Service แค่ **publish event** เข้า event bus (เช่น "OrderShipped", "PaymentFailed") แล้วจบหน้าที่ทันที ไม่ต้องรอใครตอบ ส่วน Notification Service เป็นแค่หนึ่งใน**หลาย subscriber** ที่ฟัง event เหล่านี้อยู่ (อาจมี Analytics Service ฟัง event เดียวกันด้วยก็ได้ โดยไม่ต้องแก้อะไรที่ Order Service เลย) — <mark class="hl-insight">นี่คือความแตกต่างสำคัญจาก synchronous call: ผู้ส่งไม่รู้จักและไม่สนใจว่าใครเป็นผู้รับ</mark>

```mermaid
flowchart LR
    Order["Order Service"] -->|"publish: OrderShipped"| Bus["Event Bus\n(Kafka/SNS/EventBridge)"]
    Payment["Payment Service"] -->|"publish: PaymentFailed"| Bus
    Auth["Auth Service"] -->|"publish: AccountLocked"| Bus
    Bus -->|"subscribe"| Notif["Notification Service"]
    Bus -.->|"subscribe (แยกต่างหาก)"| Analytics["Analytics Service"]
    Notif --> Email["Email Provider\n(SendGrid)"]
    Notif --> Push["Push Provider\n(FCM/APNs)"]
    Notif --> SMS["SMS Provider\n(Twilio)"]
```

ข้อดีที่ชัดเจนคือ **decoupling** — เพิ่มช่องทางแจ้งเตือนใหม่ (เช่น LINE Notify) แค่เพิ่ม provider ใน Notification Service เดียว ไม่ต้องแตะ Order/Payment/Auth เลยสักบรรทัด แต่ก็แลกมาด้วยความซับซ้อนเรื่อง **eventual consistency** — ผู้ใช้อาจได้รับแจ้งเตือนช้ากว่าเหตุการณ์จริงไม่กี่วินาทีถึงนาที ซึ่งยอมรับได้สำหรับโดเมนนี้ (ต่างจาก Payment ที่ต้องการ strong consistency แบบที่เห็นในเคส e-commerce checkout)

ข้อควรระวังของ event-driven คือมันแก้ปัญหาหนึ่งแล้วสร้างคำถามใหม่เสมอ — พอ service ต้นทางไม่ต้องรู้จักผู้รับแล้ว จะรู้ได้อย่างไรว่า event ที่ publish ไปถูกประมวลผลจริง <mark class="hl-warning">ถ้า Notification Service ล่มไปตอนที่ event เข้ามาพอดี event นั้นจะหายไปเลยหรือไม่</mark> นี่คือเหตุผลที่ event bus ที่เลือกใช้ต้องรองรับการ**เก็บ event ไว้จนกว่าจะมีคน consume สำเร็จ** (เช่น Kafka ที่เก็บ log ไว้ระยะหนึ่ง หรือ SQS ที่ลบ message ก็ต่อเมื่อ consumer ยืนยันแล้วเท่านั้น) ไม่ใช่แค่ fire-and-forget เฉยๆ

```demo
component: JourneyDiagram
props: {"nodes":[{"icon":"building","label":"Order Service"},{"icon":"notebook","label":"Event Bus"},{"icon":"building","label":"Notification Service"},{"icon":"envelope","label":"Email/SMS/Push"}],"travelerIcon":"envelope","steps":[{"activeNode":0,"caption":"Order Service เกิด event OrderShipped แล้ว publish เข้า Event Bus ทันที ไม่รอใครตอบกลับ"},{"activeNode":1,"caption":"Event Bus เก็บ event ไว้ รอให้ subscriber มาดึงไปประมวลผล"},{"activeNode":2,"caption":"Notification Service เป็นหนึ่งใน subscriber ที่ฟัง event นี้อยู่ ดึง event ไปประมวลผล"},{"activeNode":3,"caption":"Notification Service ยิงต่อไปยัง Email/Push/SMS provider ตามช่องทางที่ผู้ใช้ตั้งไว้"},{"activeNode":2,"caption":"ถ้า provider ล้มเหลว Notification Service retry ด้วย backoff และย้ายเข้า dead-letter queue ถ้ายังไม่สำเร็จ ไม่บล็อก event อื่น"}]}
```

## Reliability: เมื่อ Provider ภายนอกล่มหรือ Event ซ้ำ

Event-driven architecture แก้ปัญหา coupling ได้ก็จริง แต่สร้างคำถามใหม่ที่ต้องตอบให้ชัด — ถ้า event bus ส่ง event ซ้ำ (at-least-once delivery ซึ่งเป็นค่าเริ่มต้นของ message broker ส่วนใหญ่) หรือถ้า email provider ภายนอกอย่าง SendGrid ล่มชั่วคราวระหว่างที่ Notification Service กำลังยิง request จะเกิดอะไรขึ้น

คำตอบมาตรฐานคือสองกลไกที่ทำงานร่วมกัน ทั้งคู่ต่อยอดจากโมดูล Reliability ของ System Design โดยตรง: หนึ่ง <mark class="hl-term">**Idempotency**</mark> — ทุก event ต้องมี unique event ID กำกับ ถ้า Notification Service เห็น event ID ที่เคยประมวลผลไปแล้ว ให้ข้ามทันที ป้องกันไม่ให้ผู้ใช้ได้รับอีเมลซ้ำสองสามฉบับจาก event เดียวกัน สอง **Retry with backoff + Dead-Letter Queue** — ถ้ายิง request ไป provider แล้วล้มเหลว ให้ retry แบบ exponential backoff สักสองสามครั้ง ถ้ายังไม่สำเร็จให้ย้าย event นั้นไปเก็บใน dead-letter queue แยกต่างหาก เพื่อให้ทีมตรวจสอบทีหลังได้ โดยไม่บล็อกการประมวลผล event อื่นที่เข้ามาต่อคิว

สองกลไกนี้คือสิ่งที่ทำให้ "ยอมรับ eventual consistency ได้" ในทางปฏิบัติจริง ไม่ใช่แค่ยอมรับความช้า แต่ต้องออกแบบให้ระบบ**พังบางส่วนได้โดยไม่พังทั้งหมด** — provider ตัวหนึ่งล่มไม่ควรทำให้ event ของ provider อื่นค้างตามไปด้วย

## Trade-off เรื่อง Quality Attribute: Serverless (FaaS) vs Worker Pool

นี่คือจุดที่โมดูล 16 เข้ามาเต็มๆ — เมื่อออกแบบตัว Notification Service เองว่าจะรันด้วยอะไร มีสอง option หลักที่มัก debate กัน และ**ไม่มีคำตอบเดียวที่ถูกเสมอ** ขึ้นอยู่กับว่าให้น้ำหนัก quality attribute ไหนมากกว่า

**Serverless (FaaS เช่น AWS Lambda)** — แต่ละ event ที่มาถึงจะ trigger function ใหม่ขึ้นมาประมวลผลแล้วปิดตัวเอง เหมาะกับ workload ที่ไม่สม่ำเสมออย่างมาก เพราะจ่ายเงินตาม event จริง ไม่มี event ก็ไม่มีค่าใช้จ่าย (scale to zero) แต่มีจุดอ่อนคือ **cold start** — ถ้า function ไม่ได้ถูกเรียกมาสักพัก ครั้งถัดไปจะช้ากว่าปกติเพราะต้อง initialize ใหม่ทั้งหมด

**Worker Pool (long-running process)** — มี process หรือ container ที่รันตลอดเวลา คอยดึง message จาก queue มาประมวลผล ข้อดีคือ latency สม่ำเสมอ ไม่มี cold start เพราะ process พร้อมทำงานอยู่แล้วเสมอ แต่ต้องจ่ายค่า infra ตลอด 24 ชั่วโมงแม้ตอนกลางดึกที่แทบไม่มี event เข้ามาเลย (idle cost)

การตัดสินใจนี้จริงๆ คือคำถามเดียวกับที่โมดูล 18 (Deployment & Infra Architecture) เรื่อง Cloud-Native Architecture Patterns พูดถึง — Serverless FaaS คือรูปแบบ cloud-native ที่สุดขั้วด้าน elasticity (scale to zero) ส่วน Worker Pool ที่รันบน container orchestration (เช่น Kubernetes จากโมดูล 18) ให้ control เหนือ concurrency และ resource มากกว่า เลือกได้ตามว่าให้น้ำหนัก operational simplicity หรือ latency consistency มากกว่ากัน

```demo
component: ComparisonDiagram
props: {"left":{"title":"Serverless FaaS (เช่น Lambda)","points":["Scale to zero — ไม่มี event ไม่มีค่าใช้จ่าย","จ่ายตาม event จริง (pay-per-invocation) เหมาะกับ traffic ไม่สม่ำเสมอ","มี cold start — ครั้งแรกหลังว่างนานจะช้ากว่าปกติ","ไม่ต้องดูแล infra เอง (ops overhead ต่ำ)"]},"right":{"title":"Long-running Worker Pool","points":["Latency สม่ำเสมอ ไม่มี cold start เพราะ process พร้อมอยู่แล้ว","ควบคุม concurrency และ retry logic ได้ละเอียดกว่า","ต้องจ่ายค่า infra ตลอดเวลาแม้ไม่มี event เข้า (idle cost)","ต้องดูแล scaling เอง (autoscaling group, health check)"]},"note":"เลือกจากคำถาม: notification เป็น critical path ที่ต้องเร็วสม่ำเสมอไหม? ถ้าดีเลย์ไม่กี่ร้อย ms รับได้ (เช่น email) Serverless คุ้มกว่าเพราะ traffic ไม่สม่ำเสมอ แต่ถ้าต้องการ SLA latency แน่นอน (เช่น push notification เตือน OTP) worker pool ที่ warm อยู่เสมออาจเหมาะกว่า"}
```

## ตารางเปรียบเทียบ Trade-off

| ประเด็น | Serverless (FaaS) | Worker Pool |
|---|---|---|
| ต้นทุนตอน traffic ต่ำ | ต่ำมาก (scale to zero) | คงที่ ไม่ลดตาม traffic |
| ต้นทุนตอน traffic สูงมาก | อาจแพงกว่าถ้า sustained load สูงตลอด | คุ้มกว่าถ้า utilization สูงสม่ำเสมอ |
| Latency | ไม่แน่นอน (cold start เป็นครั้งคราว) | สม่ำเสมอกว่า |
| ความซับซ้อนด้าน ops | ต่ำ — ผู้ให้บริการจัดการ infra ให้ | สูงกว่า — ต้องดูแล autoscaling, health check เอง |
| เหมาะกับ workload | Spiky/ไม่สม่ำเสมอ, ไม่ critical เรื่อง latency | สม่ำเสมอ, ต้องการ latency คงที่ |

## คำถามเจาะลึกที่มักถูกถามต่อ

พออธิบายว่า Notification Platform ใช้ event bus, idempotency, retry พร้อม dead-letter queue และ serverless จบ คนสัมภาษณ์หรือเพื่อนร่วมทีมมักไม่หยุดแค่ "ใช้อะไร" แต่จะถามต่อว่า "แล้วข้างในมันทำงานยังไง ถ้าพังจะเกิดอะไรขึ้น" สี่คำถามด้านล่างคือคำถามต่อยอดที่เจอบ่อยที่สุด แต่ละข้อไล่ให้ครบว่า ใช้ความรู้อะไรจากโมดูลไหน แก้ปัญหายังไง มีขั้นตอนอะไรบ้าง และข้างใต้จริงๆ มีอะไรทำงานอยู่

### Q1: Notification Service รู้ได้ยังไงว่า event นี้เคยส่งแจ้งเตือนไปแล้ว โดยเฉพาะตอนที่ consumer สองตัวได้ event เดียวกันมาพร้อมกัน

**ใช้ความรู้อะไร:** โมดูล Reliability ของ System Design (Idempotency) บวกโมดูล 13 (Event-Driven — message broker ส่งแบบ at-least-once จึงส่ง event เดิมซ้ำได้) บวกโมดูล 15 (Domain Event คือข้อเท็จจริงที่เกิดขึ้นแล้วและมี "ตัวตน" ของตัวเอง จึงกำกับด้วยรหัสประจำตัวได้)

**นึกภาพก่อน:** ลองนึกถึงห้องรับพัสดุที่มีสมุดลงทะเบียนเล่มเดียว ใบสั่งส่งของเลขที่ 789 มาถึงพนักงานสองคนพร้อมกันเป็นสองสำเนา ถ้าต่างคนเปิดสมุดดูก่อนว่า "ยังไม่มีเลข 789" แล้วค่อยลงชื่อและส่งของ ทั้งคู่ก็เห็นว่าว่างในเสี้ยววินาทีเดียวกัน แล้วส่งของออกไปสองชุด นี่คือ **race condition** (แข่งกันทำงานจนผลผิด) แบบเดียวกับ "อ่านก่อนแล้วค่อยเขียน" ในเคส e-commerce checkout แค่คราวนี้ของที่ซ้ำคืออีเมลหรือ SMS ที่ผู้ใช้ได้รับสองฉบับ

**แก้ปัญหายังไง:** เปลี่ยนจาก "เปิดสมุดดูก่อน แล้วค่อยลงชื่อ" เป็น "ลงชื่อเลย ถ้าชื่อนี้มีอยู่แล้วให้ปฏิเสธ" ในคำสั่งเดียว เรียกว่า <mark class="hl-term">**atomic set-if-absent**</mark> (ใส่ค่าก็ต่อเมื่อยังไม่มีค่านั้น โดยเช็คและใส่เสร็จในก้าวเดียวที่แบ่งแยกไม่ได้) ขั้นตอนคือ

1. **ผู้ส่ง event สร้าง event ID ครั้งเดียวตอนเหตุการณ์เกิด** เช่น UUID (รหัสสุ่มยาวๆ ที่ซ้ำกันแทบเป็นไปไม่ได้) แล้วแนบไปกับ message เสมอ ถ้า broker ส่ง message เดิมซ้ำ ID ก็เป็นค่าเดิม ห้ามให้ฝั่ง consumer สร้าง ID เอง เพราะ ID ที่เปลี่ยนทุกครั้งที่รับจะมองไม่ออกว่าเป็น event เดียวกัน
2. **ก่อนเรียก provider ให้ consumer "จอง" ID ในที่เก็บกลางด้วยคำสั่งเดียว** ตัวอย่างใน PostgreSQL:

```sql
INSERT INTO processed_event (event_id, channel, status, claimed_at)
VALUES ('evt-8f3a', 'email', 'PROCESSING', now())
ON CONFLICT (event_id, channel) DO NOTHING;
```

3. **ดูจำนวนแถวที่ถูกสร้าง** ได้ 1 แถว แปลว่าเราเป็นผู้ชนะ ไปส่งได้ ได้ 0 แถว แปลว่ามีคนจองไปแล้ว (ถ้าใช้ Redis ก็เทียบเท่ากับ `SET dedupe:evt-8f3a:email PROCESSING NX EX 86400` โดย NX คือตั้งค่าเมื่อยังไม่มี key นี้ และ EX คือให้หมดอายุเองตามจำนวนวินาทีที่ระบุ ผลตอบกลับเป็น OK หรือ nil ซึ่งตีความแบบเดียวกัน ตัวเลขเป็นแค่ตัวอย่าง)
4. **key ต้องเป็นคู่ event ID กับช่องทาง** ไม่ใช่ event ID เดี่ยวๆ เพราะ event หนึ่งอันสั่งส่งได้ทั้ง email, push, SMS ถ้า email สำเร็จแต่ SMS ล้ม การ retry ต้องส่งแค่ SMS ถ้า key มีแค่ event ID ระบบจะเข้าใจผิดว่า "event นี้ทำเสร็จแล้ว" แล้วข้าม SMS ไปเลย

**ข้างใต้ทำงานยังไง:** <mark class="hl-insight">ความ atomic ต้องมาจากที่เก็บข้อมูล (unique key) ไม่ใช่จากโค้ดที่เราเขียนเช็คเอง</mark> ใน database คือ unique index บนคู่ (event_id, channel) เมื่อสอง transaction พยายาม insert key เดียวกัน ตัวที่สองจะ *ต้องรอ* ให้ตัวแรกจบก่อน (commit หรือ rollback) แล้วค่อยรู้ผล ถ้าตัวแรก commit ตัวที่สองเจอ conflict และได้ 0 แถว แต่ถ้าตัวแรก rollback คำจองหายไป ตัวที่สองได้สิทธิ์แทน (นี่คือพฤติกรรมของ PostgreSQL ฐานข้อมูลอื่นมีรายละเอียดต่างกันเล็กน้อยแต่หลักเดียวกัน) ส่วน Redis ประมวลผลคำสั่งทีละคำสั่งอยู่แล้ว จึงไม่มีทางที่ SET NX สองคำสั่งจะสอดแทรกกันกลางคัน

แถวที่จองไว้ไม่ใช่แค่ "เคยเห็น" แต่เป็นเครื่องจักรสถานะเล็กๆ คือ PROCESSING (จองแล้ว กำลังส่ง) ไปเป็น SENT (provider ตอบสำเร็จแล้ว) พร้อมเวลาที่จอง (claimed_at) ที่ต้องมีสถานะเพราะคำว่า "ข้าม" มีสามความหมายที่ต่างกันมาก

- เจอ SENT — ทำเสร็จจริงแล้ว ack ทิ้ง message ได้เลย
- เจอ PROCESSING ที่ยังไม่เกินเวลาที่ให้ทำ (lease) — มีคนกำลังทำอยู่ **อย่า ack** ปล่อยให้ message กลับมาลองใหม่ทีหลัง เพราะถ้าผู้จองตายกลางทางแล้วเราทิ้ง message ไป จะไม่มีใครส่งแจ้งเตือนนี้เลย
- เจอ PROCESSING ที่เกินเวลา — ผู้จองน่าจะตายไปแล้ว ขอรับช่วงต่อด้วย UPDATE ที่มีเงื่อนไข (เป็น atomic เช่นกัน) แล้วส่งเอง

เรื่องอายุของ record ต้องเก็บไว้นานกว่าช่วงที่ event เดิมจะ "กลับมา" ได้ คือระยะที่ bus เก็บ event รวมกับช่วง retry ทั้งหมด และช่วงที่ทีมอาจ replay จาก dead-letter queue (ดู Q2) แต่ไม่ต้องเก็บตลอดกาลเพราะตารางจะโตไม่หยุด จึงใช้ TTL ของ Redis หรือ job ลบแถวเก่าใน database

```mermaid
flowchart TB
    E["Event evt-8f3a<br/>ถูกส่งมาซ้ำเป็นสองสำเนา"] --> CA["Consumer A"]
    E --> CB["Consumer B"]
    CA --> S["INSERT event_id + channel<br/>ลงที่เก็บกลาง (unique key)"]
    CB --> S
    S -->|"ได้ 1 แถว"| W["ผู้ชนะ: สถานะ PROCESSING<br/>เรียก provider ส่งอีเมล"]
    S -->|"ได้ 0 แถว"| L["ผู้แพ้: ดูสถานะที่มีอยู่แล้ว"]
    W --> D["ส่งสำเร็จ: เปลี่ยนเป็น SENT แล้ว ack"]
    L -->|"เจอ SENT"| L1["ack ทิ้งได้เลย"]
    L -->|"เจอ PROCESSING ที่ยังไม่เกินเวลา"| L2["ไม่ ack<br/>ให้ message กลับมาลองใหม่"]

    classDef win fill:#3d6ea552,stroke:#3d6ea5,stroke-width:1.5px
    classDef lose fill:#a8527a52,stroke:#a8527a,stroke-width:1.5px
    classDef store fill:#6b5b9552,stroke:#6b5b95,stroke-width:1.5px
    class W,D win
    class L,L1,L2 lose
    class S store
```

```demo
component: StepThroughDiagram
props: {"steps":[{"label":"1. Event เดียวมาถึง consumer สองตัวพร้อมกัน","detail":"เกิดได้เมื่อ broker ส่งซ้ำเพราะ ack ของรอบแรกหาย หรือรอบแรกทำนานเกินเวลาที่ broker รอ จึงส่งสำเนาที่สองให้อีกตัว ทั้งสองสำเนามี event ID เดียวกันคือ evt-8f3a"},{"label":"2. ทั้งคู่ยิง INSERT พร้อมกัน ไม่มีใคร SELECT ก่อน","detail":"Consumer A และ B ต่างส่งคำสั่ง INSERT ของคู่ (evt-8f3a, email) ไปที่เก็บกลาง ไม่มีขั้น 'เช็คว่ามีไหม' คั่นกลางให้เกิดช่องว่าง"},{"label":"3. Unique index ตัดสิน: A ได้แถว B ได้ 0 แถว","detail":"Database รับคำสั่งของ A ก่อน B ที่ key เดียวกันต้องรอให้ A จบ พอ A commit แล้ว B เจอ conflict จึงได้ 0 แถว ไม่มีโค้ดฝั่ง application คุมคิวเลย"},{"label":"4. A ส่งอีเมล ส่วน B เห็นว่า A ยังทำอยู่","detail":"A เรียก provider ส่งอีเมล B อ่านสถานะเจอ PROCESSING ที่ยังไม่เกินเวลา จึง 'ไม่ ack' ปล่อยให้ message กลับเข้าคิวรอลองใหม่ เผื่อ A ตายกลางทาง"},{"label":"5. A สำเร็จ เปลี่ยนเป็น SENT แล้ว ack","detail":"provider ตอบสำเร็จ A อัปเดตแถวเป็น SENT แล้ว ack message ของตัวเอง"},{"label":"6. B กลับมาลองใหม่ เจอ SENT แล้ว ack ทิ้ง","detail":"รอบหน้า B ได้ message เดิมกลับมา ครั้งนี้เห็น SENT จึง ack ทิ้งได้อย่างปลอดภัย ผู้ใช้ได้รับอีเมลฉบับเดียว แต่ถ้า A ตายในขั้น 4 แถวจะค้างที่ PROCESSING จนเกินเวลา แล้ว B รับช่วงส่งแทน"}]}
```

**ถ้าพังหรือมีข้อควรระวังอะไร:**

- **ห้ามเช็คด้วย SELECT แล้วค่อย INSERT แยกสองจังหวะ** — นั่นคือ race condition เดิมทุกประการ ต้องเป็นคำสั่งเดียวที่ให้ที่เก็บเป็นคนตัดสิน
- **ไม่มีลำดับ "จองแล้วส่ง" หรือ "ส่งแล้วจด" ไหนกันได้ 100%** — ถ้าทำเป็น SENT ตั้งแต่ก่อนส่งแล้ว crash แจ้งเตือนจะหายเงียบ ถ้าส่งก่อนแล้วค่อยจด crash คั่นกลางจะส่งซ้ำ การใช้ PROCESSING พร้อม lease ปิดกรณีหายเงียบได้ แต่ยังเหลือช่องแคบๆ ที่ provider รับไปแล้วแต่เรา crash ก่อนจด SENT ซึ่งจะปิดได้ก็ต่อเมื่อ provider รองรับ idempotency key ให้แนบ event ID ไป ถ้าไม่รองรับต้องยอมรับซ้ำแบบหายาก แจ้งเตือนส่วนใหญ่ยอมรับซ้ำหายากได้ดีกว่าหายเงียบ แต่ข้อความที่ซ้ำแล้วเสียหายจริง (เช่น แจ้งยอดตัดเงิน) ต้องประเมินให้เข้มขึ้น
- <mark class="hl-warning">ถ้า TTL ของ record dedupe สั้นกว่าเวลาที่ event จะกลับมาได้ ระบบจะ "ลืม" ว่าเคยส่ง แล้วส่งซ้ำตอน replay</mark> — และถ้าเก็บใน Redis ต้องรู้ว่าข้อมูลอาจหายตอน failover หรือถูกลบเมื่อหน่วยความจำเต็ม (ขึ้นกับการตั้งค่า) ถ้าต้องการความแน่นอนกว่าให้เก็บใน database
- event ID จับได้เฉพาะกรณี "message เดียวกันมาซ้ำ" ไม่ได้จับกรณีที่ต้นทาง publish สองครั้งด้วย ID ต่างกัน (เช่น Order Service retry แล้วสร้าง event ใหม่) จึงควรมี business key เช่น order-789-shipped เป็นชั้นที่สอง

### Q2: Retry with backoff และ Dead-Letter Queue ทำงานทีละขั้นยังไง ack, visibility timeout, poison message และการ replay คืออะไร

**ใช้ความรู้อะไร:** โมดูล 16 (Availability tactic แบบ Retry ในหัวข้อ Architecture Tactics ขั้นสูง — retry กู้ได้เฉพาะความล้มเหลวชั่วคราว) บวกโมดูล Reliability ของ System Design (exponential backoff และ dead-letter queue) บวกโมดูล 13 (message broker ที่รอให้ consumer ยืนยัน)

**นึกภาพก่อน:** ไรเดอร์ส่งอาหารไปถึงแล้วลูกค้าไม่รับสาย ไรเดอร์ไม่ทิ้งอาหารไว้กลางทาง และไม่โทรรัวทุกวินาที แต่รอสักพักแล้วโทรใหม่ ห่างขึ้นเรื่อยๆ พอโทรครบจำนวนครั้งที่ตกลงกันแล้วยังไม่ติด ก็ไม่โทรอีก แต่ส่งกลับเข้าตู้ "พัสดุตีกลับ" ให้ฝ่ายลูกค้าสัมพันธ์ตามต่อ ระหว่างนั้นไรเดอร์ออกไปส่งออเดอร์อื่นต่อได้ ไม่ต้องยืนรออยู่หน้าบ้านนั้น ตู้พัสดุตีกลับคือ **dead-letter queue (DLQ)** และการที่ไรเดอร์ไม่ยืนรอคือการไม่บล็อก event อื่น

**แก้ปัญหายังไง:** ก่อนไล่ขั้นตอน ขอนิยามคำสี่คำที่ใช้ตลอดข้อนี้ **ack** (acknowledge) คือ consumer บอก broker ว่า "ประมวลผลเสร็จแล้ว ลบหรือขยับผ่านได้" **visibility timeout** คือช่วงเวลาที่ message ที่ถูกหยิบไปแล้วถูกซ่อนจาก consumer ตัวอื่นชั่วคราว **consumer offset** คือตำแหน่งที่ consumer อ่านถึงใน log และ **<mark class="hl-term">poison message</mark>** คือ message ที่ประมวลผลไม่สำเร็จไม่ว่าจะลองกี่ครั้ง (เช่น payload เสียรูปแบบ หรือมี bug ที่เกิดเฉพาะข้อมูลนี้) ขั้นตอนมีดังนี้

1. Worker หยิบ message จากคิว แต่ message **ยังไม่ถูกลบ** แค่ถูก "ยืม" ไว้ชั่วคราว
2. Worker เรียก provider ถ้าสำเร็จ ก็ **ack** เพื่อบอกให้ลบ message ทิ้ง
3. ถ้าล้มเหลวแบบ **ชั่วคราว** (timeout, HTTP 429 ที่แปลว่าส่งถี่เกินโควตา, หรือ 5xx ที่แปลว่า provider ขัดข้อง) worker **ไม่ ack** แล้วให้ message กลับมาใหม่หลังหน่วงเวลา ซึ่งหน่วงนานขึ้นทุกรอบ (backoff) และสุ่มเวลาเพิ่มเล็กน้อย (jitter)
4. ถ้าล้มเหลวแบบ **ถาวร** (เช่น เบอร์โทรผิดรูปแบบ, provider ตอบ 400) ไม่ต้อง retry เพราะลองอีกกี่ครั้งผลก็เหมือนเดิม ส่งเข้า DLQ ทันทีพร้อมบันทึกสาเหตุ
5. ถ้า retry ครบจำนวนครั้งที่กำหนดแล้วยังไม่สำเร็จ ก็ย้ายเข้า DLQ เช่นกัน
6. คนหรือระบบตรวจสอบเห็น alert แก้สาเหตุ แล้ว **replay** คือส่ง message กลับเข้าคิวหลักให้ประมวลผลใหม่

**ข้างใต้ทำงานยังไง:** การ retry ทำงานต่างกันตามชนิดของ broker

- **คิวแบบ Amazon SQS** (Simple Queue Service — คิวข้อความของ AWS) — consumer ไม่ได้ถูก "ส่ง" message แต่เป็นฝ่าย *receive* เมื่อ receive แล้ว message ถูกซ่อนตาม visibility timeout ถ้า consumer ไม่ลบก่อนหมดเวลา message ก็กลับมาให้ consumer ตัวไหนก็ได้ receive ใหม่ พร้อมตัวนับจำนวนครั้งที่ถูก receive ที่เพิ่มขึ้น เมื่อตัวนับเกินค่าที่ตั้งไว้ (เรียกว่า maxReceiveCount ใน redrive policy) SQS ย้าย message เข้า DLQ ที่เราสร้างเตรียมไว้ให้เอง และ consumer ยังปรับ visibility timeout ของ message เป็นรายตัวได้ จึงใช้เป็นตัวกำหนดเวลา backoff ได้
- **log แบบ Kafka** — ไม่มีการลบทีละ message consumer จำ **offset** ของตัวเอง และ commit offset ก็คือ ack เมื่อ crash ก็เริ่มอ่านใหม่จาก offset ที่ commit ล่าสุด Kafka ไม่มี visibility timeout และตัว consumer ของ Kafka ไม่มี DLQ ในตัว ทีมจึงมักสร้าง topic สำหรับ retry และ topic ที่เป็น DLQ เอง โดย consumer publish message ที่ล้มไปยัง topic ถัดไปพร้อมข้อมูลจำนวนครั้ง แล้ว commit offset ของ topic หลักเพื่อเดินหน้าต่อ

ส่วน jitter ที่หลายคนข้าม มีเหตุผลชัดเจน ถ้า provider ล่มแล้วกลับมา แล้ว worker หลายร้อยตัวรอเวลาเท่ากันเป๊ะ (1 วินาที, 2 วินาที, 4 วินาที) ทุกตัวจะยิงพร้อมกันเป็นคลื่นลูกเดียว (thundering herd) แล้วล้ม provider ที่เพิ่งฟื้นซ้ำอีก วิธีมาตรฐานคือสุ่มเวลารอในช่วงที่ขยายขึ้นทุกรอบ:

```text
เวลารอ = สุ่มค่าระหว่าง 0 ถึง min(เพดาน, ฐาน x 2 ยกกำลังรอบที่ลอง)
ตัวอย่าง ฐาน = 1 วินาที : รอบ 1 สุ่มใน 0-2 วิ, รอบ 2 สุ่มใน 0-4 วิ, รอบ 3 สุ่มใน 0-8 วิ (ตัวเลขเป็นแค่ตัวอย่าง)
```

```mermaid
flowchart LR
    Q["Queue หลัก"] --> W["Worker เรียก provider"]
    W -->|"สำเร็จ"| ACK["ack: ลบ message"]
    W -->|"ล้มชั่วคราว: timeout, 429, 5xx"| R["ไม่ ack<br/>รอ backoff + jitter"]
    R -->|"กลับเข้าคิว ลองใหม่"| Q
    W -->|"ล้มถาวร: เช่น เบอร์ผิดรูปแบบ"| D["Dead-Letter Queue<br/>เก็บสาเหตุ + จำนวนครั้ง"]
    R -->|"ครบจำนวนครั้งที่กำหนด"| D
    D -->|"แก้สาเหตุแล้ว replay ทีละน้อย"| Q

    classDef ok fill:#3d6ea552,stroke:#3d6ea5,stroke-width:1.5px
    classDef retry fill:#6b5b9552,stroke:#6b5b95,stroke-width:1.5px
    classDef dead fill:#a8527a52,stroke:#a8527a,stroke-width:1.5px
    class Q,W,ACK ok
    class R retry
    class D dead
```

```demo
component: JourneyDiagram
props: {"nodes":[{"icon":"notebook","label":"Queue หลัก"},{"icon":"building","label":"Worker"},{"icon":"phone","label":"SMS Provider"},{"icon":"notebook","label":"Dead-Letter Queue"},{"icon":"person","label":"ทีมตรวจสอบ"}],"travelerIcon":"envelope","steps":[{"activeNode":0,"caption":"Message ส่ง SMS แจ้งเตือนรออยู่ในคิว Worker หยิบไปแล้ว message ถูกซ่อนไว้ชั่วคราว (visibility timeout) แต่ยังไม่ถูกลบ"},{"activeNode":1,"caption":"Worker เรียก provider ซึ่งเป็นครั้งที่ 1"},{"activeNode":2,"caption":"Provider ตอบ 503 (ขัดข้องชั่วคราว) Worker ไม่ ack แล้วไปทำ message อื่นต่อ ไม่ยืนรอ"},{"activeNode":0,"caption":"หลังรอตาม backoff message กลับมาให้ receive ใหม่ ตัวนับจำนวนครั้งเพิ่มเป็น 2 แล้วลองอีกรอบโดยรอนานขึ้นและสุ่มเวลาเพิ่ม"},{"activeNode":3,"caption":"ลองครบจำนวนครั้งที่ตั้งไว้แล้วยังล้ม ระบบย้าย message เข้า DLQ พร้อมสาเหตุ ส่วน event อื่นในคิวหลักไหลต่อได้ตามปกติ"},{"activeNode":4,"caption":"Alert แจ้งว่า DLQ ไม่ว่าง ทีมพบว่า provider กลับมาปกติแล้ว จึง replay message กลับเข้าคิวหลักทีละน้อย และเพราะมี idempotency (Q1) การส่งซ้ำจึงปลอดภัย"}]}
```

**ถ้าพังหรือมีข้อควรระวังอะไร:**

- <mark class="hl-warning">ถ้า visibility timeout สั้นกว่าเวลาที่ worker ใช้จริง (รวม timeout ของการเรียก provider) message จะกลับมาให้ตัวอื่นทั้งที่ตัวแรกยังทำอยู่</mark> ผลคือส่งซ้ำ เป็นเหตุผลอีกข้อที่ต้องมี idempotency ตาม Q1 และควรตั้ง timeout ของการเรียก provider ให้สั้นกว่า visibility timeout เสมอ
- **retry ทุกตัวพร้อมกันตอน provider ล่มคือการซ้ำเติม** — ยิ่ง retry ถี่ยิ่งเพิ่มโหลดให้ provider ที่กำลังแย่ (retry storm) จึงต้องมี backoff พร้อม jitter และ circuit breaker (ตัวตัดวงจรที่หยุดเรียก provider ชั่วคราวเมื่อเห็นว่าล้มติดกันหลายครั้ง) อย่าให้ retry เป็นคำตอบของทุกความล้มเหลว เพราะความล้มเหลวถาวรไม่มีวันหายจากการลองซ้ำ
- **poison message ที่ไม่มีเพดานจำนวนครั้งจะวนไม่จบ** — กิน capacity ของ worker ไปเรื่อยๆ และใน log ที่ต้องเรียงลำดับ ถ้า consumer ลองอ่าน offset เดิมซ้ำอยู่กับที่ message ที่อยู่ข้างหลังทั้งหมดใน partition นั้นจะถูกบล็อกตาม (head-of-line blocking) เพดานจำนวนครั้งกับ DLQ คือสิ่งที่ตัดวงจรนี้
- **DLQ ที่ไม่มีคนดูคือถังขยะเงียบ** — ต้องมี alert เมื่อ DLQ ไม่ว่าง และต้องรู้ว่า DLQ ก็มีระยะเก็บจำกัดเหมือนคิวทั่วไป ถ้าไม่มีใครมาจัดการทันก็หายอยู่ดี ก่อน replay ให้แก้สาเหตุให้เสร็จก่อนเสมอ ไม่งั้นก็แค่วนกลับเข้า DLQ อีกรอบ และควรทยอย replay แทนการเทกลับทีเดียว เพื่อไม่ให้ท่วม provider
- **แจ้งเตือนบางชนิดมีอายุ** — OTP (One-Time Password, รหัสผ่านใช้ครั้งเดียว) ที่ replay ออกไปหลังจากผ่านไปหลายชั่วโมงไม่มีประโยชน์และทำให้ผู้ใช้สับสน ควรใส่เวลาหมดอายุไปกับ event แล้วให้ worker ข้ามเมื่อเลยเวลา แทนที่จะส่งทุกอย่างที่ replay กลับมา

### Q3: ทำไม event bus ถึงส่ง event ซ้ำได้ แต่ถ้า Notification Service ล่มก็ไม่ทำให้ event หาย สองเรื่องนี้ไม่ขัดกันเหรอ

**ใช้ความรู้อะไร:** โมดูล 13 (Event-Driven — event bus และ message broker) บวกโมดูล 19 (Event Sourcing — log ที่ต่อท้ายอย่างเดียวและเก็บ event ไว้ให้อ่านย้อนหลังได้ เป็นหลักคิดเดียวกับ log ของ Kafka) บวกโมดูล Reliability ของ System Design (delivery guarantee)

**ปัญหาคืออะไร:** ลองนึกถึงพนักงานส่งจดหมายลงทะเบียนที่ต้องได้ใบตอบรับกลับมา ถ้าผู้รับเซ็นแล้วแต่ใบตอบรับหายระหว่างทาง พนักงานจะไม่รู้เลยว่าจดหมายถึงหรือยัง มีแค่สองทางเลือก ทางแรกคือสมมติว่าถึงแล้ว ถ้าผิด จดหมายหายไปเลย ทางที่สองคือส่งใหม่อีกฉบับ ถ้าผิด ผู้รับได้จดหมายซ้ำสองฉบับ ระบบที่ยอมให้ข้อมูลหายไม่ได้จะเลือกทางที่สอง นี่คือที่มาของ **<mark class="hl-term">at-least-once delivery</mark>** (ส่งอย่างน้อยหนึ่งครั้ง — ซ้ำได้ แต่ห้ามหาย) ส่วนทางแรกคือ at-most-once (ส่งอย่างมากหนึ่งครั้ง — ไม่ซ้ำ แต่หายได้) จุดสำคัญคือ broker มองไม่ออกว่า "consumer ตายก่อนทำ", "ทำเสร็จแล้วแต่ ack ไม่ถึง" หรือ "ack ถึงช้า" ต่างกันตรงไหน เพราะสิ่งเดียวที่มันเห็นคือ **ไม่ได้รับ ack** จึงต้องเลือกว่าจะเชื่อว่าสำเร็จหรือส่งซ้ำ

**แก้ปัญหายังไง:** แยกปัญหาเป็นสองครึ่งที่แก้คนละที่ ครึ่ง "ไม่ให้หาย" แก้ที่ broker ครึ่ง "ซ้ำแล้วไม่เป็นไร" แก้ที่ consumer

1. **Broker เขียน event ลง storage ที่ทนทานก่อนตอบ publisher ว่ารับแล้ว** คือเก็บลงดิสก์และทำสำเนาไว้หลายเครื่อง ไม่ใช่เก็บไว้ในหน่วยความจำเครื่องเดียว
2. **Event ถูกเก็บจนหมดเงื่อนไขการเก็บ ไม่ใช่จนกว่ามีใครอ่านสักคน** — Kafka เก็บ log ตามเวลาหรือขนาดที่ตั้งไว้ และไม่ลบเมื่ออ่านแล้ว consumer แต่ละกลุ่มจำ offset ของตัวเองแยกกัน (จึงทำให้ Analytics Service อ่าน event เดียวกันกับ Notification Service ได้โดยไม่กวนกัน) ส่วน SQS เก็บ message ไว้จนกว่า consumer จะลบ หรือหมดระยะเก็บที่ตั้งไว้
3. **Consumer ที่ล่มกลับมาอ่านต่อจากตำแหน่งที่ ack ล่าสุด** — event ที่เข้ามาระหว่างล่มรออยู่ครบ
4. **ส่วนที่ซ้ำ จัดการด้วย idempotency ที่ consumer** ตามที่เล่าใน Q1

**ข้างใต้ทำงานยังไง:** ลองไล่สามช่วงของเส้นทาง

- **Publisher ถึง broker** — publish ถือว่าสำเร็จเมื่อ broker ตอบ ack กลับมา ถ้าเครือข่ายหลุดก่อน publisher ได้รับ ack มันไม่รู้ว่า event ถึงหรือยัง จึง publish ซ้ำ ดังนั้นความซ้ำเกิดได้ตั้งแต่ฝั่งผู้ส่ง (Kafka มี idempotent producer ที่กันซ้ำในช่วงนี้ แต่รับประกันแค่ระหว่าง producer กับ broker เท่านั้น) และเพื่อกัน event หาย broker บางตัวมีตัวเลือกให้ publisher รอให้หลาย replica ยืนยันก่อน (เช่น acks=all ของ Kafka)
- **การเก็บใน broker** — topic ของ Kafka แบ่งเป็น partition แต่ละ partition คือ log ที่ต่อท้ายอย่างเดียว (append-only) ทุก event ได้เลขลำดับที่เรียกว่า offset และถูกทำสำเนาไปหลาย broker ส่วน SQS เก็บ message ซ้ำซ้อนไว้หลายเครื่อง
- **Consumer ล่มแล้วกลับมา** — สมมติล่มไป 2 ชั่วโมง ระหว่างนั้น event ไหลเข้ามาเก็บต่อท้าย log เรื่อยๆ committed offset ของ Notification Service ค้างอยู่ที่เดิม พอกลับมาก็อ่านต่อจากตรงนั้นและไล่ตามให้ทัน ตัวเลขที่บอกว่าค้างอยู่เท่าไหร่เรียกว่า **consumer lag** (จำนวน event ระหว่างตำแหน่งที่ ack ล่าสุดกับปลายของ log) เป็นตัวชี้วัดที่ควรตั้ง alert

```mermaid
flowchart LR
    P["Order Service<br/>publish event"] --> E1
    subgraph LOG["Event Bus: log ที่เก็บตามเวลา ไม่ลบเมื่ออ่านแล้ว"]
        E1["offset 1<br/>อ่านและ ack แล้ว"] --> E2["offset 2<br/>อ่านและ ack แล้ว"]
        E2 --> E3["offset 3<br/>consumer ล่มตอนนี้ ยังไม่ ack"]
        E3 --> E4["offset 4<br/>เข้ามาระหว่างล่ม"]
        E4 --> E5["offset 5<br/>เข้ามาระหว่างล่ม"]
    end
    C["Notification Service<br/>จำ offset ที่ ack ล่าสุด = 2"] -.->|"กลับมาแล้วอ่านต่อจาก offset 3"| E3

    classDef done fill:#3d6ea552,stroke:#3d6ea5,stroke-width:1.5px
    classDef waiting fill:#6b5b9552,stroke:#6b5b95,stroke-width:1.5px
    classDef consumer fill:#a8527a52,stroke:#a8527a,stroke-width:1.5px
    class E1,E2 done
    class E3,E4,E5 waiting
    class C consumer
```

```demo
component: ComparisonDiagram
props: {"left":{"title":"At-most-once (ส่งอย่างมากหนึ่งครั้ง)","points":["Broker ส่งครั้งเดียวแล้วถือว่าจบ ไม่รอ ack หรือไม่ส่งซ้ำ","ไม่มี event ซ้ำ ผู้ใช้ไม่ได้รับอีเมลสองฉบับ","ถ้า consumer ตายหลังรับแต่ก่อนทำเสร็จ event หายถาวรโดยไม่มีใครรู้","เหมาะกับข้อมูลที่หายได้ เช่น ตัวเลข metric ที่สุ่มเก็บ ไม่เหมาะกับแจ้งเตือนสำคัญอย่าง OTP"]},"right":{"title":"At-least-once (ส่งอย่างน้อยหนึ่งครั้ง)","points":["Broker เก็บ event ไว้จนกว่าจะได้ ack ถ้าไม่ได้ ack ก็ส่งใหม่","ไม่หาย แม้ consumer ล่มระหว่างทาง event รออยู่ครบ","แต่ซ้ำได้ เมื่อ ack ตกหล่นระหว่างทาง หรือ publisher ส่งซ้ำ","ต้องคู่กับ idempotency ที่ consumer (Q1) เป็นค่าเริ่มต้นของ broker ส่วนใหญ่และเป็นสิ่งที่เคสนี้เลือก"]},"note":"ไม่ขัดกัน เพราะ 'ซ้ำ' กับ 'หาย' คือสองหน้าของการตัดสินใจเดียวกันตอนไม่แน่ใจ ระบบเลือกส่งซ้ำแทนการยอมให้หาย แล้วผลักภาระจัดการความซ้ำไปให้ consumer ที่ทำ idempotent ได้"}
```

**ถ้าพังหรือมีข้อควรระวังอะไร:**

- <mark class="hl-warning">ถ้า consumer ล่มนานกว่าระยะที่ broker เก็บ event (retention) event ที่หมดอายุจะถูกลบจริงและกู้กลับมาไม่ได้</mark> ระยะเก็บตั้งได้เอง และค่าเริ่มต้นของแต่ละระบบต่างกัน (ตั้งแต่หลักวันถึงหลักสัปดาห์) ต้องตรวจในเอกสารของระบบที่ใช้ และตั้งให้ยาวกว่าเวลาที่ทีมกู้ระบบจริงได้ทัน พร้อม alert ที่ consumer lag
- **ช่องโหว่ที่ฝั่ง publisher (dual write)** — Order Service บันทึก order ลง database สำเร็จ แล้ว crash ก่อน publish event เข้า bus ต่อให้ bus ทนทานแค่ไหน event นี้ก็ไม่เคยเข้าไปเลย วิธีที่นิยมคือ **transactional outbox** เขียน event ลงตาราง outbox ใน transaction เดียวกับการบันทึก order แล้วมีตัว relay คอยอ่านตารางนั้นไป publish ทีหลัง ซึ่ง relay เองก็ส่งแบบ at-least-once จึงวนกลับมาพึ่ง idempotency อีกรอบ
- **"exactly-once" ที่ broker บางตัวโฆษณาไม่ได้ครอบคลุมถึงการส่งอีเมล** — ความรับประกันแบบนั้นใช้ได้ภายในระบบของ broker เอง เช่น อ่านจาก Kafka แล้วเขียนกลับ Kafka พอมี side effect ภายนอกอย่างการเรียก provider ส่งอีเมล ไม่มี broker ตัวไหนรับประกันแทนเราได้ ต้องทำ idempotency ที่ฝั่ง consumer เสมอ
- พอ consumer กลับมาหลังล่มนาน event ที่ค้างจะไหลเข้ามาพร้อมกันเป็นก้อนใหญ่ และอาจท่วม provider ได้ (ดู Q4) รวมทั้ง event เก่าบางชนิดหมดอายุการใช้งานไปแล้ว (เช่น OTP) ควรมีเวลาหมดอายุให้ข้ามได้ ตามที่เล่าใน Q2

### Q4: ตอน flash sale event พุ่งเป็นหมื่น Serverless จะ scale ยังไง cold start เกิดตอนไหน และทำไมเพดานจริงกลับเป็น provider ภายนอก

**ใช้ความรู้อะไร:** โมดูล 13 (Serverless — Cold Start) บวกโมดูล 16 (ทุกการตัดสินใจคือ trade-off และต้องหาคอขวดก่อน scale) บวกโมดูล 18 (Cloud-Native Patterns และ Container Orchestration — ฝั่ง worker pool ที่คุม concurrency เองได้) บวกโมดูล Reliability ของ System Design (backoff และ circuit breaker) ตัวอย่างชื่อฟีเจอร์ด้านล่างอิง AWS Lambda ซึ่งแต่ละ cloud ตั้งชื่อต่างกัน แต่หลักการเดียวกัน

**นึกภาพก่อน:** ร้านอาหารที่เรียกพนักงานเสิร์ฟรายชั่วโมงมาเสริมเมื่อลูกค้าล้น คนใหม่ต้องแต่งชุด เรียนเมนู และหาโต๊ะก่อนเริ่มงาน (cold start) ส่วนคนที่เพิ่งเสิร์ฟเสร็จยังยืนอยู่ในร้าน รับโต๊ะถัดไปได้ทันที (warm) แต่ต่อให้มีพนักงานเยอะแค่ไหน ครัวก็ออกอาหารได้เท่าเดิม พนักงานที่เพิ่มมาก็แค่ไปยืนออกันหน้าครัว (ตรงกับ provider ภายนอกอย่าง Twilio หรือ SendGrid ที่เราขยายเองไม่ได้) และเมื่อสั่งถี่เกินไป ครัวจะตอบกลับมาว่า "ช้าลงหน่อย" ซึ่งคือ HTTP 429 (Too Many Requests)

**แก้ปัญหายังไง:** ไล่ทีละชั้น ตั้งแต่ตัวกันกระแทกไปจนถึงตัวคุมความเร็ว

1. **ให้ queue เป็นตัวรับ spike** — event หมื่นรายการเข้ามาต่อคิวก่อน แทนที่ function ทุกตัวจะยิง provider ทันที เทคนิคนี้เรียกว่า <mark class="hl-term">**load leveling**</mark> (ปรับโหลดที่พุ่งให้ไหลเรียบขึ้น) และคิวเป็นตัวเดียวกับที่ Q3 อธิบายว่าเก็บ event ไว้ไม่ให้หาย
2. **คุมจำนวน function ที่รันพร้อมกันให้เท่ากับที่ provider รับได้** ใช้ความสัมพันธ์ว่า อัตราเรียกต่อวินาที ≈ จำนวนที่ทำพร้อมกัน ÷ เวลาต่อครั้ง สมมติ provider SMS รับได้ 100 ครั้งต่อวินาที และเรียกแต่ละครั้งใช้ 0.2 วินาที ก็ต้องการ concurrency ราว 20 ไม่ใช่ 1,000 (ตัวเลขเป็นแค่ตัวอย่าง) แล้วตั้งเพดานที่ตัวดึงจากคิว หรือที่ function ให้ไม่เกินนั้น
3. **แยกคิวและ function ตามช่องทาง** — email, push, SMS มีเพดานคนละค่า ถ้ารวมคิวเดียว SMS ที่ติดเพดานจะลากช่องทางอื่นค้างตามไปด้วย ตรงกับหลักในหัวข้อ Reliability ที่ว่า provider ตัวหนึ่งล่มไม่ควรทำให้ event ของ provider อื่นค้าง
4. **แยกเส้นทางที่ไวต่อ latency** เช่น OTP ไปอีกคิวและอีก function ที่เตรียม environment ให้พร้อมไว้ล่วงหน้า (provisioned concurrency) ส่วนเส้นทางที่ช้าไปไม่กี่วินาทีได้ ยอมรับ cold start ได้

**ข้างใต้ทำงานยังไง:** สองเรื่องคือ cold start กับ concurrency ต้องเข้าใจกลไกจริง

- **Cold start เกิดตอนที่ไม่มี environment ว่าง** — เมื่อ event มา แต่ไม่มี execution environment ที่พร้อมและว่างอยู่ แพลตฟอร์มต้องทำตามลำดับ คือ (1) จัดสรร environment ใหม่ที่แยกส่วนกันต่อ function (2) ดาวน์โหลดโค้ด (3) เริ่ม runtime (4) รันโค้ด init ที่อยู่นอกตัว handler เช่น โหลด library และสร้าง client ต่อ provider แล้ว (5) จึงเรียก handler ที่ทำงานจริง ขั้น 1-4 คือ cold start ซึ่งใช้เวลามากน้อยตาม runtime ขนาดโค้ด และงานใน init พอทำเสร็จ environment ถูกเก็บไว้ช่วงหนึ่ง event ถัดไปข้ามขั้น 1-4 ได้ (warm start) แต่แพลตฟอร์มเป็นคนตัดสินว่าเก็บนานแค่ไหน ไม่ใช่สัญญาที่พึ่งพาได้
- **หนึ่ง environment ทำทีละหนึ่ง event** — ดังนั้น concurrency ก็คือจำนวน environment ที่ทำงานพร้อมกัน ถ้า event 1,000 รายการมาพร้อมกัน ต้องมี environment ราว 1,000 ตัว และแทบทุกตัวเป็น cold start เพราะยังไม่เคยมีมาก่อน
- **ตัว scale ทำงานเป็นขั้น ไม่ใช่ทันที** — ตัวดึงคิวของแพลตฟอร์ม (event source mapping ของ Lambda) คอยดูจำนวน message ที่ค้าง แล้วเพิ่มจำนวน function ที่เรียกพร้อมกันเป็นขั้นๆ ตามอัตราที่แพลตฟอร์มกำหนด จนถึงเพดานที่เราตั้ง (เช่น reserved concurrency ของ function หรือ maximum concurrency ของ event source) และเพดานระดับ account ของ cloud
- **เพดานจริงคือตัวที่ต่ำสุดในสายโซ่** — <mark class="hl-insight">ปริมาณที่ส่งออกได้จริงไม่ได้ขึ้นกับว่า function scale ได้แค่ไหน แต่ขึ้นกับตัวที่คอขวดที่สุดในสายโซ่</mark> คือค่าต่ำสุดของ (concurrency ที่ตั้งไว้, rate limit ของ provider, ความสามารถของ database ที่ function ไปอ่านค่าตั้งของผู้ใช้) และในสามตัวนี้ provider คือตัวเดียวที่เราขยายเองไม่ได้
- **ฝั่ง worker pool ต่างกันตรงไหน** — worker คุมอัตราได้ตรงกว่า โดยให้ทุกตัวขอ "token" จาก rate limiter กลาง (เช่น token bucket ที่เก็บใน Redis) ก่อนยิง ส่วนใน serverless เราคุมได้แค่ concurrency ซึ่งเป็นตัวแทนทางอ้อมของอัตรา จึงต้องเผื่อไว้

```mermaid
flowchart LR
    S["Event พุ่งเป็นหมื่นรายการ"] --> Q["Queue<br/>เก็บ spike ไว้"]
    Q --> M["ตัวดึงคิวเพิ่ม function<br/>ตามจำนวน message ที่ค้าง"]
    M --> F["Function หลายตัวรันพร้อมกัน<br/>ถูกจำกัดด้วยเพดาน concurrency"]
    F --> P["Provider ภายนอก<br/>rate limit คือเพดานจริง"]
    P -->|"เกินเพดาน: HTTP 429"| RT["retry พร้อม backoff"]
    RT --> Q

    classDef buffer fill:#3d6ea552,stroke:#3d6ea5,stroke-width:1.5px
    classDef compute fill:#6b5b9552,stroke:#6b5b95,stroke-width:1.5px
    classDef limit fill:#a8527a52,stroke:#a8527a,stroke-width:1.5px
    class S,Q,M buffer
    class F compute
    class P,RT limit
```

```demo
component: StepThroughDiagram
props: {"steps":[{"label":"1. Event พุ่งเข้าคิวในไม่กี่วินาที","detail":"สมมติ flash sale เริ่ม แล้ว event OrderShipped และ PaymentFailed เข้ามา 5,000 รายการอย่างรวดเร็ว Queue รับไว้ทั้งหมด ยังไม่มี function ตัวไหนแตะ provider"},{"label":"2. ตัวดึงคิวเริ่มเพิ่ม function เป็นขั้นๆ","detail":"ยังไม่มี environment เตรียมไว้พอ function ตัวแรกๆ ต้อง cold start คือจัดสรร environment ดาวน์โหลดโค้ด เริ่ม runtime และรัน init ก่อนทำงานจริง event ช่วงนี้จึงช้ากว่าปกติ"},{"label":"3. Environment ที่ทำเสร็จถูกใช้ซ้ำ","detail":"function ที่ทำ event แรกเสร็จแล้วรับ event ถัดไปต่อได้เลยโดยข้าม cold start (warm start) ยิ่ง event ต่อเนื่อง สัดส่วน cold start ยิ่งลดลง มันกระทบหนักเฉพาะช่วงที่ต้องการ environment ใหม่จำนวนมากพร้อมกัน"},{"label":"4. ถ้าไม่คุม concurrency provider จะตอบ 429","detail":"function ที่ scale พรวดขึ้นหลายร้อยตัวยิง provider พร้อมกันเกินโควตา ได้ HTTP 429 กลับมาเป็นจำนวนมาก แต่ละ invocation เสียเงินและเวลาไปเปล่าๆ แล้ว event ที่ล้มก็เข้า retry ทำให้ยิ่งถี่ขึ้นอีก"},{"label":"5. ตั้งเพดานให้ตรงกับที่ provider รับได้","detail":"คำนวณจาก อัตราที่รับได้ x เวลาต่อครั้ง เช่น สมมติ 100 ครั้งต่อวินาที x 0.2 วินาที ประมาณ 20 ตั้งเพดาน concurrency ราวนั้นพร้อมเผื่อไว้ คิวจะไหลออกเรียบตามความเร็วที่ provider รับได้ ไม่ใช่ตามความเร็วที่ function scale ได้"},{"label":"6. แยกคิวตามช่องทาง และเตรียม environment ให้เส้นทางที่ไวต่อ latency","detail":"SMS ติดเพดานก็ไม่ลาก email กับ push ตามไปเพราะแยกคิวกัน ส่วน OTP มีคิวและ function ของตัวเองที่เตรียม environment ไว้ล่วงหน้า จึงไม่ต้องเจอ cold start ตอน traffic พุ่ง"}]}
```

**ถ้าพังหรือมีข้อควรระวังอะไร:**

- <mark class="hl-warning">scale function ให้เต็มที่โดยไม่คุม rate ของ provider ไม่ได้ทำให้ส่งเร็วขึ้น แต่ได้ HTTP 429 จำนวนมาก, ค่า invocation ที่เสียเปล่า และ retry ที่ซ้ำเติมกันเป็นวงจร</mark> ความสามารถของ Serverless ที่ scale ได้แทบไม่จำกัด กลับกลายเป็นข้อเสียเมื่อปลายทางไม่ได้ scale ตาม
- **อัตรา = concurrency ÷ เวลาต่อครั้ง ตัวหารเปลี่ยนได้** — ถ้า provider เร็วขึ้น (เวลาต่อครั้งสั้นลง) อัตราที่เราส่งจริงจะสูงขึ้นทั้งที่ concurrency คงเดิม และอาจเกินโควตา ตัวเลขเพดานจึงควรมาจากการวัดจริงและเผื่อขอบไว้ ไม่ใช่คำนวณครั้งเดียวแล้วจบ
- **cold start กระทบ latency ส่วนท้าย ไม่ใช่ค่าเฉลี่ย** — ค่าเฉลี่ยอาจดูดี ขณะที่ P99 (latency ที่ 99% ของคำขอเร็วกว่านั้น) แย่ในช่วง spike จึงควรวัดที่ P99 สำหรับเส้นทางอย่าง OTP
- **provisioned concurrency แก้ cold start ได้ แต่ต้องจ่ายค่าถือ environment ไว้ตลอดเวลา** — ยิ่งซื้อมากยิ่งเข้าใกล้ต้นทุนแบบ worker pool (idle cost) ซึ่งเป็นข้อแลกเปลี่ยนเดียวกับตารางเปรียบเทียบข้างบน คือไม่มีตัวเลือกที่ถูกเสมอ
- function ที่ scale ขึ้นหลายร้อยตัวพร้อมกันและต่างคนต่างเปิด connection ไปยัง database (เช่น อ่านค่าตั้งของผู้ใช้) อาจใช้ connection ของ database จนหมด ต้องมีตัวกลางจัดการ connection pool หรือคุม concurrency ตามที่เล่าไว้ข้างบน

## ADR ตัวอย่าง

> **Title:** เลือก Event-Driven ร่วมกับ Serverless FaaS สำหรับ Notification Service
> **Status:** Accepted
> **Context:** Service หลักในระบบ (Order, Payment, Auth) ต้องแจ้งเตือนผู้ใช้ผ่านหลายช่องทางโดยไม่ให้ latency ของ notification กระทบ critical path ของธุรกรรมหลัก ปริมาณ event ต่อวันไม่สม่ำเสมอมาก มีช่วงเงียบยาวนานสลับกับช่วง flash sale ที่พุ่งสูง
> **Decision:** ใช้ event-driven architecture — service ต้นทาง publish event เข้า event bus กลาง แล้วให้ Notification Service เป็น subscriber ที่รันบน serverless FaaS ประมวลผลทีละ event และยิงต่อไปยัง email/push/SMS provider
> **Consequences:** ลด coupling ระหว่าง service ต้นทางกับช่องทางแจ้งเตือนลงมาก เพิ่มช่องทางใหม่ได้โดยไม่กระทบ service เดิม ต้นทุนต่ำมากในช่วง traffic น้อย แต่ต้องยอมรับ cold start latency เป็นครั้งคราว และต้องออกแบบระบบ retry/dead-letter queue รองรับกรณี provider ภายนอกล่มชั่วคราว เพราะ consistency ของการแจ้งเตือนเป็นแบบ eventual ไม่ใช่ strong
