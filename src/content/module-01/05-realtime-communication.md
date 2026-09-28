ลองนึกภาพสองวิธีรอของที่สั่งซื้อ: วิธีแรก**เดินไปเช็คตู้จดหมายหน้าบ้านทุก 10 นาที** ว่าของมาหรือยัง (ส่วนใหญ่เดินไปเช็คแล้วก็ยังไม่มา เสียเวลาเปล่า) วิธีที่สอง**ให้บุรุษไปรษณีย์กดกริ่งบอกทันทีที่ของมาถึง** — ไม่ต้องเดินไปเช็คเองเลย รอฟังกริ่งอย่างเดียวพอ

## HTTP ปกติเป็นแบบแรกเสมอ: Client ต้องถามก่อน

HTTP (HyperText Transfer Protocol) Request/Response Lifecycle (บทที่แล้ว) เป็นแบบ **client ถามก่อนเสมอ server พูดเองไม่ได้** — เหมือนต้องเดินไปเช็คตู้จดหมายเอง server ไม่มีทาง "กดกริ่ง" บอก client ตรงๆ แต่แอปจำนวนมาก (แชท, notification, ราคาหุ้นเรียลไทม์, คะแนนกีฬาสด) ต้องการให้รู้ทันทีที่มีอะไรใหม่ — ต้องมีเทคนิคพิเศษเพิ่มมาช่วย

## Short Polling — เดินไปเช็คตู้จดหมายเป็นระยะ

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    loop ทุก 2 วินาที
        C->>S: มีข้อความใหม่ไหม
        S-->>C: ยังไม่มี
    end
    C->>S: มีข้อความใหม่ไหม
    S-->>C: มี! นี่คือข้อความ
```

ง่ายที่สุด: client ยิง request ถามซ้ำๆ ตามช่วงเวลาที่ตั้งไว้ (เช่นทุก 2 วินาที) — ข้อเสียชัดเจน 2 อย่าง: **เสียเวลาเปล่า**ส่วนใหญ่ (ถามไปส่วนใหญ่ไม่มีอะไรใหม่) และ**ล่าช้า**เสมอ (ถ้าข้อความมาถึงตอนวินาทีที่ 1 หลังถามรอบล่าสุด ต้องรออีกเกือบ 2 วินาทีกว่าจะถามรอบถัดไปถึงจะรู้)

## Long Polling — โทรถามแล้วขอให้ถือสายรอ

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    C->>S: มีข้อความใหม่ไหม (ถือสายรอด้วย)
    Note over S: ยังไม่มี... รอ... รอ...
    Note over S: มีข้อความใหม่มาแล้ว!
    S-->>C: นี่คือข้อความ
    C->>S: ถามต่อทันที (ถือสายรอเหมือนเดิม)
```

Client ถามเหมือนเดิม แต่คราวนี้ **server ไม่รีบตอบทันทีถ้ายังไม่มีอะไรใหม่** — ถือ request ค้างไว้ (เหมือนบอกโทรศัพท์ "อย่าเพิ่งวางสาย รอก่อน") จนกว่าจะมีข้อมูลใหม่จริง (หรือ timeout) ถึงค่อยตอบกลับ พอ client ได้คำตอบก็ยิงถามใหม่ทันที วนแบบนี้ไปเรื่อยๆ — ดีกว่า short polling มาก (แทบไม่มีดีเลย์) แต่ server ต้อง**เปิด connection ค้างไว้เยอะพร้อมกัน** (ถ้ามี user หลักแสนคน server ต้องรับมือกับ connection ค้างหลักแสนพร้อมกัน)

## Server-Sent Events (SSE) — สมัครรับข่าวสารทางเดียว

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    C->>S: เปิด connection ค้างไว้ (subscribe)
    Note over S: มีข่าวใหม่
    S-->>C: push event 1
    Note over S: มีข่าวใหม่อีก
    S-->>C: push event 2
    S-->>C: push event 3
```

Client เปิด connection **ครั้งเดียว** แล้วปล่อยให้ server ส่งข้อมูลมาเรื่อยๆ เองได้ตลอดโดย client ไม่ต้องถามซ้ำเลย (เหมือนสมัครสมาชิกหนังสือพิมพ์ที่ส่งมาส่งถึงบ้านเองทุกฉบับใหม่ ไม่ต้องเดินไปซื้อทีละฉบับ) — ข้อจำกัดคือเป็น<mark class="hl-warning">ทางเดียว</mark> (server → client เท่านั้น) client ส่งอะไรกลับไปทาง connection เดียวกันไม่ได้ เหมาะกับ live score, stock ticker, notification ที่ client แค่ "รับฟัง" ไม่ต้องตอบกลับ

## WebSocket — สายโทรศัพท์เปิดค้างสองทาง

Connection เดียวที่<mark class="hl-insight">ทั้งสองฝั่งส่งหากันได้ตลอดเวลา</mark> (ไม่ใช่แค่ server → client ทางเดียวแบบ SSE) — เหมาะกับแชทที่ทั้งสองฝั่งต้องคุยโต้ตอบกันตลอด (จะเจอรายละเอียดเต็มๆ อีกครั้งตอน case study Design: Chat App)

```demo
component: RealtimeLatencyRaceDemo
caption: กด "จำลอง event ใหม่" ดูว่าแต่ละเทคนิครู้ตัวว่ามี event ใหม่เร็ว/ช้าต่างกันแค่ไหน
```

## เทียบทั้ง 4 วิธี

| วิธี | ทิศทาง | Latency | Overhead ฝั่ง Server |
|---|---|---|---|
| Short Polling | Client ถามเอง | สูง (ขึ้นกับรอบ poll) | ต่ำต่อ request แต่ request ถี่มาก |
| Long Polling | Client ถามเอง (server ถ่วงตอบ) | ต่ำ | ต้องถือ connection ค้างจำนวนมาก |
| SSE | Server → Client ทางเดียว | ต่ำมาก | ต้องถือ connection ค้าง แต่เบากว่า WebSocket |
| WebSocket | สองทาง | ต่ำมาก | ต้องถือ connection ค้าง + จัดการ state สองทาง |

> คำถามสัมภาษณ์: "ทำไมไม่ใช้ WebSocket กับทุกอย่างไปเลยในเมื่อเร็วที่สุด" — เพราะ WebSocket มี overhead ในการดูแล connection ค้างไว้สองทางสูงกว่า (ต้องจัดการ reconnect, จัดการ state ทั้งสองฝั่ง) ถ้าแอปแค่ต้องการ "รับฟัง" ทางเดียว (เช่น notification, live score) SSE ง่ายกว่าและเบากว่ามาก ส่วนถ้าไม่ต้องการ real-time จริงจัง (อัปเดตทุกไม่กี่วินาทีก็พอ) short/long polling ยังใช้ได้และ implement ง่ายกว่ามาก — <mark class="hl-warning">เลือกตามความต้องการจริง ไม่ใช่เลือกที่ "เร็วสุด" เสมอไป</mark>

## ขั้นสูง: เมื่อ Server ส่งเร็วกว่าที่ Client รับไหว และตอน Connection หลุดกลางคัน

Connection ค้างไว้ (WebSocket/SSE) มีปัญหาอีกแบบที่ short/long polling ไม่มี — <mark class="hl-warning">ถ้า server ส่ง event เร็วกว่าที่ client ประมวลผลทัน (เช่น stock ticker ช่วงตลาดผันผวนหนัก ส่ง update หลักร้อยครั้ง/วินาที) ข้อมูลจะกองสะสมรออยู่ใน buffer ของ client จนอาจทำให้แอปค้างหรือกินหน่วยความจำจนแครช</mark> ปัญหานี้เรียกว่า <mark class="hl-term">Backpressure</mark> — ทางแก้ทั่วไปคือ**ไม่ส่งทุก event จริง** แต่ sample/coalesce เอาแค่ค่าล่าสุดทุกช่วงเวลาสั้นๆ (เช่นทุก 100ms) ส่งแค่ค่าล่าสุด ไม่ใช่ส่งทุกการเปลี่ยนแปลงย่อยๆ ให้ client ไล่ตามไม่ทัน

อีกปัญหาคือตอน connection หลุด (มือถือสลับ WiFi ไป 4G, เดินเข้าลิฟต์ เน็ตขาด) — <mark class="hl-insight">client ต้อง reconnect ใหม่เอง และต้องรู้ว่า "พลาด event อะไรไปบ้างระหว่างหลุด"</mark> วิธีแก้คือให้แต่ละ event มีเลขลำดับ (sequence number/message ID) client เก็บเลขล่าสุดที่เคยได้รับไว้ พอ reconnect สำเร็จก็บอก server ว่า "ฉันได้ถึงเลขที่เท่านี้แล้ว" ให้ server ส่งเฉพาะที่ตกหล่นมาให้ ไม่ต้องส่งประวัติทั้งหมดใหม่

ที่ต้องระวังเป็นพิเศษคือถ้า server restart กะทันหัน — <mark class="hl-warning">connection ที่ค้างอยู่หลักแสนพร้อมกันจะหลุดพร้อมกันทั้งหมด แล้วทุก client พยายาม reconnect พร้อมกันทันที กลายเป็น traffic spike กระแทก server ที่เพิ่ง restart เสร็จใหม่ๆ (reconnection storm)</mark> — ทางแก้คือให้ client รอ delay แบบสุ่ม (jitter) ก่อน reconnect แทนที่จะยิงพร้อมกันทันทีทุกเครื่อง เหมือนหลักการ exponential backoff ที่เจอในโมดูล Reliability

> คำถามสัมภาษณ์: "Server restart กะทันหันแล้ว client หลักแสนตัว reconnect พร้อมกันหมด จะป้องกันยังไง" — ให้แต่ละ client สุ่มหน่วงเวลา (jitter) ก่อน reconnect แทนที่จะยิงพร้อมกันทันที และใช้ exponential backoff ถ้า reconnect ไม่สำเร็จ กระจายช่วงเวลาที่ request เข้ามาให้ไม่กระจุกตัวจนกลายเป็น traffic spike ซ้ำเติม server ที่เพิ่งฟื้นตัว
