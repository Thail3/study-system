โจทย์ "ออกแบบระบบแชทแบบ WhatsApp" — ลองนึกภาพความต่างจาก URL shortener: แชทต้องการ **real-time** ข้อความต้องส่งถึงอีกฝั่งเกือบทันที เหมือนคุยโทรศัพท์ ไม่ใช่ส่งจดหมายที่รอวันสองวันได้

## ปัญหาใหม่ที่ต้องแก้: HTTP ปกติไม่พอ

HTTP request-response แบบที่เรียนมาตลอด (module Fundamentals) เป็นแบบ client ถามก่อนเสมอ (เหมือนต้องกดโทรออกทุกครั้งถึงจะได้ยินเสียงอีกฝั่ง) — แต่แชทต้องการให้ **server ส่งข้อความหาไปหา client ได้เองทันทีที่มีข้อความใหม่** โดย client ไม่ต้องถามซ้ำๆ (polling — เหมือนโทรถามทุก 2 วินาทีว่า "มีข้อความใหม่หรือยัง") วิธีแก้คือ **WebSocket** — เปิดสายค้างไว้ (persistent connection) ที่ทั้งสองฝั่งพูดใส่กันได้ตลอดเวลาโดยไม่ต้องวางสายแล้วโทรใหม่

```demo
component: StepThroughDiagram
props: {"steps":[{"label":"1. เปิด WebSocket Connection","detail":"แทนที่จะเปิด-ปิดสายทุกครั้งแบบ HTTP ปกติ client เปิดสายค้างไว้กับ server ตัวหนึ่ง เหมือนโทรศัพท์ที่ไม่วางหูตลอดการสนทนา"},{"label":"2. Message Routing ข้าม Server (module Scalability)","detail":"ถ้า user A ต่อสายกับ Server 1 และ user B ต่อสายกับ Server 2 ข้อความของ A ต้องหาทางไปหา Server 2 ให้เจอ — ต้องมีสมุดโทรศัพท์กลางบอกว่า user ไหนต่อสายกับ server ไหน (คล้าย Service Discovery จาก module Microservices)"},{"label":"3. Pub/Sub กระจายข้อความ (module Async & Messaging)","detail":"ใช้ Redis Pub/Sub หรือ message broker กลาง — Server 1 ประกาศข้อความ (publish), Server 2 ที่เปิดลำโพงรับฟังอยู่ (subscribe) ได้ยินแล้วส่งต่อผ่านสายของตัวเองไปหา user B"},{"label":"4. เก็บประวัติข้อความ (module Database)","detail":"ข้อความต้องอยู่ถาวรแม้ user offline (เหมือนข้อความ SMS ที่รออ่านได้ทีหลัง) — เขียนลง database ควบคู่ไปกับการส่ง real-time (เขียนสองที่ ต้องคิดเรื่อง consistency)"},{"label":"5. Offline Delivery","detail":"ถ้า user B offline ตอนส่ง ข้อความต้องรอใน queue จนกว่า B online แล้วค่อยส่ง (คล้ายหลักการ Message Queue — วางบัตรคิวรอไว้จนกว่าจะมีคนมารับ)"}]}
```

```demo
component: JourneyDiagram
props: {"nodes":[{"icon":"person","label":"User A"},{"icon":"building","label":"Chat Server 1"},{"icon":"building","label":"Redis Pub/Sub"},{"icon":"building","label":"Chat Server 2"}],"travelerIcon":"envelope","steps":[{"activeNode":1,"caption":"User A ส่งข้อความผ่าน WebSocket ที่เปิดค้างไว้กับ Chat Server 1"},{"activeNode":2,"caption":"Server 1 ประกาศข้อความผ่าน Redis Pub/Sub — ไม่รู้ว่า User B ต่อสายอยู่กับ server ไหน"},{"activeNode":3,"caption":"Chat Server 2 (ที่ User B ต่อสายอยู่) subscribe อยู่ ได้ยินข้อความ"},{"activeNode":0,"caption":"Server 2 ส่งข้อความผ่าน WebSocket ของตัวเองไปถึง User B เกือบทันที"}]}
```

## Architecture รวม

```mermaid
flowchart LR
    A["User A"] <-->|"WebSocket"| S1["Chat Server 1"]
    B["User B"] <-->|"WebSocket"| S2["Chat Server 2"]
    S1 <-->|"publish/subscribe"| Bus["Redis Pub/Sub"]
    S2 <-->|"publish/subscribe"| Bus
    S1 --> DB["Database\n(เก็บประวัติข้อความถาวร)"]
    S2 --> DB
```

## Trade-off ที่ควรพูดถึงในสัมภาษณ์

- **Consistency ของลำดับข้อความ** (module Consistency & CAP) — ข้อความต้องเรียงลำดับถูกต้องแม้มาจากหลาย server เหมือนบทสนทนาที่ต้องอ่านตามลำดับ ไม่ใช่สลับหน้าหลัง
- **Connection ค้างไว้กินทรัพยากร server เยอะกว่า HTTP ปกติมาก** — ต้องคำนวณว่า 1 server รับสายค้างไว้พร้อมกันได้กี่คู่สาย (capacity estimation)
- **Read receipt / "กำลังพิมพ์..."** — เป็น event เล็กๆ ที่ยิงถี่มาก ควรแยกช่องทางจากข้อความจริงเพื่อไม่ให้กระทบ throughput หลัก
