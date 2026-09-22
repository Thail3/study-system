module Reliability สอน**แนวคิด**ของ rate limiting (บัตรแจกวันละ 8 ใบ) ไปแล้ว — โจทย์สัมภาษณ์นี้ถามลึกกว่านั้น: "ออกแบบ **rate limiter เป็น service กลาง** ที่ทุก microservice ในองค์กรเรียกใช้ร่วมกัน" ลองนึกภาพถ้าสวนสนุกมีหลายประตูทางเข้า แต่ละประตูแจกบัตรนับของตัวเอง — ปัญหาใหม่ที่โผล่มาคือ **หลายประตูต้องนับบัตรใบเดียวกันให้ตรงกัน**

## ปัญหาใหม่: Rate Limiter ต้อง Distributed

```mermaid
flowchart TB
    subgraph Wrong["ผิด — แต่ละประตูนับแยกกัน"]
        C1["Client"] --> S1["ประตู 1\n(นับบัตรของตัวเอง)"]
        C1 --> S2["ประตู 2\n(นับบัตรของตัวเอง)"]
        Note1["ผลลัพธ์: คนสลับเข้าประตู 1 กับ 2\nได้โควต้าจริง 2 เท่าของที่ตั้งใจ"]
    end
    subgraph Right["ถูก — นับที่เดียว"]
        C2["Client"] --> S3["ประตู 1"]
        C2 --> S4["ประตู 2"]
        S3 --> Shared["Redis กลาง\n(จำนวนบัตรต่อคน)"]
        S4 --> Shared
    end
```

ถ้าแต่ละ app server เก็บ token bucket แยกกันเอง (in-memory) — <mark class="hl-warning">user ที่ยิง request สลับไปมาระหว่างเครื่อง (ปกติมากเพราะมี Load Balancer อยู่แล้ว) จะได้โควต้ารวมมากกว่าที่ตั้งใจ</mark> ทางแก้คือย้ายจำนวนบัตรไปเก็บที่ **Redis กลาง** (distributed cache จาก module Caching) ให้ทุก server เช็ค/อัปเดตค่าเดียวกัน เหมือนทุกประตูเปิดสมุดนับบัตรเล่มเดียวกัน แทนที่จะมีสมุดนับแยกคนละเล่ม

```demo
component: StepThroughDiagram
props: {"steps":[{"label":"1. Request มาถึง App Server (ผ่าน Load Balancer)","detail":"App server ไหนก็ได้รับ request แล้วต้องเช็คโควต้าของ user นี้ก่อนประมวลผลต่อ"},{"label":"2. เช็ค/อัปเดต Token Count ที่ Redis กลาง","detail":"ใช้ atomic operation (เช่น Redis INCR + EXPIRE) เพื่อป้องกัน race condition ตอนหลาย server เช็คพร้อมกัน เหมือนสมุดนับบัตรที่แก้ทีละคนไม่ให้เขียนทับกัน"},{"label":"3. Redis ตอบกลับว่าเหลือโควต้าไหม","detail":"ถ้าเหลือ อนุญาต request ผ่าน ถ้าไม่เหลือ ตอบ 429 ทันทีโดยไม่ต้องประมวลผล request จริง"},{"label":"4. ทำที่ API Gateway ไม่ใช่ทุก service แยกกัน","detail":"เชื่อมกับ module Microservices — rate limit ควรอยู่ที่ Gateway (พนักงานต้อนรับ) จุดเดียว ไม่ต้องเขียนซ้ำในทุก microservice ข้างหลัง"}]}
```

```demo
component: JourneyDiagram
props: {"nodes":[{"icon":"person","label":"Client"},{"icon":"gate","label":"App Servers"},{"icon":"notebook","label":"Redis กลาง"}],"travelerIcon":"envelope","steps":[{"activeNode":1,"caption":"Request จากหลายประตู (App Server) ต่างเช็คโควต้าของ user เดียวกัน"},{"activeNode":2,"caption":"ทุกประตูเช็ค/อัปเดตที่ Redis กลางเล่มเดียวกัน (ไม่ใช่นับแยกคนละเครื่อง)"},{"activeNode":1,"caption":"Redis ตอบกลับว่าเหลือโควต้าไหม — ถ้าไม่เหลือ ตอบ 429 ทันที"}]}
```

## Trade-off ที่ควรพูดถึง

- **Redis กลายเป็น dependency สำคัญ** — ถ้า Redis ช้า/ล่ม ทุก request ที่ต้องเช็ค rate limit ก็ช้า/ล่มตาม (ต้องคิดเรื่อง Circuit Breaker จาก module Reliability ป้องกันไว้ด้วย: ถ้า Redis ตอบช้าเกินไป อาจเลือก "fail open" ยอมปล่อยผ่านชั่วคราวดีกว่าบล็อกทุก request)
- **Latency เพิ่มขึ้นทุก request** — ต้องยิงไป Redis ก่อนเสมอ (ปกติเร็วมาก ~1ms เพราะ Redis เป็น in-memory แต่ก็ยังเป็น network call เพิ่ม)
- **เลือก granularity ให้เหมาะ** — per-user, per-IP, หรือ per-API-key ขึ้นกับว่าระบบต้องการป้องกันอะไร (เชื่อมกับ module Reliability เรื่อง rate limiting ระดับต่างๆ)

## คำถามเจาะลึกที่มักถูกถามต่อ

**ถาม: เก็บ token count แยกกันที่แต่ละ server จะได้ effective quota มากกว่าที่ตั้งใจกี่เท่า?**
ถ้ามี N servers behind Load Balancer และ user สลับยิง request ไปมา แต่ละ server เก็บนับแยกกันเอง <mark class="hl-warning">เท่ากับ user ได้โควต้าจริง N เท่าของที่ตั้งใจ</mark> เก็บที่ Redis กลางทำให้ทุก server เห็นค่าเดียวกัน โควต้าเป็นไปตามที่ตั้งใจเป๊ะไม่ว่าจะ scale ไปกี่เครื่อง

**ถาม: ทำไมต้องใช้ atomic operation (INCR) ไม่ใช้ GET แล้ว SET แบบปกติ?**
GET แล้ว SET เป็นสองขั้นตอนแยกกัน (เหมือน check-then-act ใน Boss Loot Race) — สอง request พร้อมกันอ่านค่าเดิมได้เหมือนกันก่อนอีกฝั่งเขียนทับ ทำให้นับพลาด (ปล่อย request เกิน quota ได้) <mark class="hl-insight">INCR เป็น atomic operation เดียว การันตีนับถูกต้องเสมอไม่ว่าจะมีกี่ request มาพร้อมกัน</mark>

**ถาม: ยิงไป Redis ก่อนทุก request เพิ่ม latency เท่าไหร่ คุ้มไหม?**
<mark class="hl-insight">Redis in-memory เพิ่ม latency แค่ราว ~1ms ต่อ request (network round-trip ในเครือข่ายเดียวกัน) เทียบกับ request จริงที่มักใช้เวลาหลัก 10-100ms</mark> การเช็คโควต้าคิดเป็นสัดส่วนน้อยมากของ latency รวม แลกกับ correctness ที่คุ้มค่ามาก

**ถาม: รวม Rate Limiter ไว้ที่ Gateway จุดเดียว ลดงานได้แค่ไหนเทียบกับกระจายทุก microservice?**
ถ้าเขียน logic เดิมซ้ำใน 20 microservice ต้อง maintain 20 จุด แก้ policy ทีต้องแก้ 20 ที่ พลาดจุดเดียวก็เป็นช่องโหว่ รวมที่ Gateway จุดเดียวลดจำนวนจุดที่ต้อง maintain จาก 20 เหลือ 1 ทุก service ข้างในไม่ต้องรับรู้เรื่อง rate limit เลย

**ถาม: "Fail Open" กับ "Fail Closed" ตอน Redis ตอบช้า เลือกยังไง ต่างกันแค่ไหน?**
Fail closed ปลอดภัยกว่าเรื่อง correctness แต่ถ้า Redis ล่ม ทุก request ถูกบล็อกหมด — ทั้งระบบล่มตาม Redis ไปด้วย <mark class="hl-warning">Fail open ยอมให้บาง request หลุด quota ไปชั่วคราว (ความเสียหายจำกัดเพราะสั้นๆ) แต่ระบบหลักยังทำงานต่อได้</mark> ส่วนใหญ่เลือก fail open เพราะ rate limiting ป้องกันปัญหา ไม่ใช่ correctness ที่ต้องเป๊ะ 100%

**ถาม: เลือก granularity per-user/per-IP/per-API-key ผิด จะเกิดอะไร?**
per-IP มีปัญหาถ้าหลาย user อยู่หลัง NAT เดียวกัน (เช่น office เดียวกัน) ทุกคนแย่ง quota เดียวกันทั้งที่เป็นคนละคน per-user แม่นกว่าแต่ต้อง authenticate ก่อนถึงเช็คได้ (ป้องกัน anonymous flood ไม่ได้ก่อน login) เลือกผิด granularity ทำให้ rate limit ไม่ป้องกันสิ่งที่ตั้งใจ หรือบล็อก user ที่ไม่ผิดไปด้วย

> นี่คือตัวอย่างที่ดีว่าทำไม system design เป็นเรื่องของ**การเอาหลายๆ concept มาประกอบกัน** ไม่ใช่ท่องจำแต่ละเรื่องแยกๆ — <mark class="hl-insight">rate limiter เดี่ยวๆ ง่าย แต่พอต้อง distributed ต้องดึง caching, consistency, และ reliability pattern มาผสมกันทั้งหมด</mark>
