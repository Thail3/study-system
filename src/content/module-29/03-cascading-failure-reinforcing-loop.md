เคสสุดท้ายของ track นี้ — เหตุการณ์ production outage ที่รวมแทบทุกแนวคิดที่เรียนมาตลอด track เข้าไว้ในเหตุการณ์เดียว: delay, reinforcing loop, overshoot and collapse, escalation

## ระดับที่ 1: Event — ไทม์ไลน์เหตุการณ์

- **14:02** — `payment-service` เริ่มตอบช้าเพราะ database connection pool ใกล้เต็ม (traffic สูงกว่าปกติเล็กน้อยจากแคมเปญการตลาด)
- **14:05** — API gateway เริ่ม timeout บางคำขอ, client เริ่ม retry อัตโนมัติตาม policy เดิม
- **14:07** — retry ที่เพิ่มขึ้นกลายเป็น load เพิ่มบน `payment-service` เอง — connection pool เต็มจริง
- **14:09** — `auth-service` (แชร์ database instance เดียวกัน) เริ่มช้าตามไปด้วย ทั้งที่ไม่มีปัญหาในตัวมันเองเลย
- **14:12** — ทั้งระบบ (ทุก service ที่ต้อง authenticate) ล่มพร้อมกัน — จากปัญหาเล็กๆ ที่จุดเดียว กลายเป็น outage เต็มระบบภายใน 10 นาที

## ระดับที่ 2: Pattern

ดู incident history ย้อนหลังพบว่ามีสัญญาณเตือนแบบเดียวกันนี้เกิดขึ้นเบาๆ มาแล้ว 3 ครั้งใน 2 เดือนก่อนหน้า (connection pool ขึ้นไปแตะ 90% แล้วลดลงเอง) แต่ไม่มีครั้งไหนกลายเป็น outage เต็มระบบ จนกระทั่งครั้งนี้ — กราฟ latency ของเหตุการณ์นี้มีรูปร่างแบบ **overshoot and collapse** เป๊ะ (จากโมดูล Behavior Patterns): นิ่งอยู่พักหนึ่ง แล้วพุ่งชันขึ้นอย่างรวดเร็วภายในไม่กี่นาที

## ระดับที่ 3: Systemic Structure

```demo
component: CausalLoopDiagram
props: {"nodes":[{"id":"retries","label":"Retry จาก client/upstream","x":150,"y":230},{"id":"load","label":"Load บน payment-service","x":420,"y":100},{"id":"errors","label":"Latency/Error เพิ่มขึ้น","x":690,"y":230}],"links":[{"from":"retries","to":"load","polarity":"+"},{"from":"load","to":"errors","polarity":"+"},{"from":"errors","to":"retries","polarity":"+"}],"loops":[{"label":"R","x":420,"y":260,"note":"cascading failure — วิ่งไม่หยุดเอง"}],"delays":[{"from":"errors","to":"retries"}],"highlightLinks":[{"from":"retries","to":"load"},{"from":"load","to":"errors"},{"from":"errors","to":"retries"}],"viewBox":"0 0 800 320"}
caption: R loop เดียวกับ tech debt spiral ที่เห็นในโมดูล Feedback Loops ทุกประการ แค่เปลี่ยนตัวละคร — บวก delay จาก alerting lag ที่ทำให้ทีมรู้ตัวช้ากว่าที่ loop วิ่งจริง
```

จุดที่ทำให้เหตุการณ์นี้ลาม (cascade) ข้าม service ได้คือ **shared database** — <mark class="hl-warning">`payment-service` กับ `auth-service` ไม่มี dependency กันตรงๆ ในโค้ดเลย แต่แชร์ทรัพยากรระดับล่างร่วมกัน</mark> (นี่คือ system boundary ที่แคบเกินไปจากโมดูล System Traps — ทีมมองแค่ dependency ระดับโค้ด ไม่เห็น dependency ระดับ infrastructure ที่ซ่อนอยู่)

## ระดับที่ 4: Mental Model

Post-mortem พบความเชื่อร่วมที่ฝังอยู่ในทีมมานาน: <mark class="hl-insight">**"Retry with timeout ก็เพียงพอแล้วสำหรับ resilience เราไม่จำเป็นต้องมี circuit breaker เพราะ failure แบบนี้ไม่ค่อยเกิด"**</mark> — ความเชื่อนี้เองที่ทำให้ทีมไม่เคยลงทุนสร้าง circuit breaker หรือทดสอบพฤติกรรมของระบบทั้งหมดภายใต้ load จริงร่วมกัน (ทดสอบแยก service ทีละตัว แต่ไม่เคยทดสอบพฤติกรรม retry ร่วมกันทั้ง call graph)

## Leverage Point ที่แนะนำ

1. **Parameter** (แก้ทันที): เพิ่ม connection pool size ชั่วคราว — บรรเทาเฉพาะหน้า ไม่แก้ต้นตอ
2. **Structure**: ใส่ circuit breaker ที่ทุกจุดเรียก downstream, แยก database connection pool ของแต่ละ service ไม่ให้แชร์กัน (bulkhead pattern), เพิ่ม jitter ให้ retry ไม่ยิงพร้อมกันเป๊ะ (ย้อนกลับไปหลักการจากโมดูล Behavior Patterns เรื่อง oscillation)
3. **Mental Model**: เปลี่ยนความเชื่อทีมจาก "resilience คือ property ที่มีอยู่แล้วถ้าใส่ retry/timeout" เป็น "resilience คือสิ่งที่ต้องทดสอบต่อเนื่องภายใต้ load จริง" — นำไปสู่การทำ chaos engineering หรือ game day exercise เป็นกิจวัตรประจำ ไม่ใช่แค่ตอบสนองหลัง incident เกิดแล้ว

## ปิดท้าย Track: เครื่องมือเดียวกัน ใช้ซ้ำได้กับทุกปัญหา

สามเคสสุดท้ายนี้ — tech debt, Conway's Law, cascading failure — เป็นปัญหาที่ดูไม่เกี่ยวข้องกันเลยในตอนแรก แต่ทุกเคสถูกไล่ผ่านกรอบเดียวกันทั้งหมด: **stock/flow กำหนดว่าอะไรสะสมอยู่, feedback loop กำหนดว่ามันขยายตัวหรือหดตัวยังไง, delay กำหนดว่าทำไมคนถึงรู้ตัวช้า, archetype ช่วยจำแนกแพทเทิร์นที่เจอซ้ำได้เร็ว, leverage point บอกว่าควรลงแรงตรงไหน, และ iceberg model เตือนให้ขุดลงไปให้ลึกกว่าแค่ event ที่เห็นตรงหน้า** — นี่คือของขวัญที่แท้จริงของ Systems Thinking: ไม่ใช่คำตอบสำเร็จรูปสำหรับปัญหาใดปัญหาหนึ่ง แต่คือเลนส์ชุดเดียวที่ใช้มองปัญหาอะไรก็ได้ ในระบบอะไรก็ได้ ไปตลอด
