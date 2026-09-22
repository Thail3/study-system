โจทย์สัมภาษณ์คลาสสิก: "ออกแบบ URL Shortener แบบ bit.ly" — ลองนึกภาพบริการที่รับ URL ยาวๆ (อาจยาวเป็นร้อยตัวอักษร) แล้วคืนกลับมาเป็นลิงก์สั้นๆ จำง่าย คลิกแล้วพาไปที่หน้าเดิม — โจทย์ฟังดูเรียบง่ายมาก แต่ครอบคลุมแทบทุก concept ที่เรียนมาตลอดหลักสูตรนี้

## Requirement คร่าวๆ

- รับ URL ยาว คืน short code (เช่น `short.ly/aZ3x9`)
- คลิก short code แล้ว redirect ไป URL ต้นฉบับ
- <mark class="hl-insight">รองรับ 100 ล้าน URL ใหม่/เดือน, อ่าน (redirect) มากกว่าเขียนหลายเท่า (read-heavy)</mark> — เหมือนป้ายบอกทางที่คนขับผ่านดูวันละหลายพันครั้ง แต่ไม่ค่อยมีใครมาติดป้ายใหม่บ่อย

```demo
component: StepThroughDiagram
props: {"steps":[{"label":"1. ประเมิน Capacity ก่อน (module Capacity Estimation)","detail":"100M URL/เดือน ≈ 40 write/วินาที (เฉลี่ย) — เขียนน้อย แต่ redirect (อ่าน) อาจสูงกว่านี้ 10-100 เท่า เพราะ 1 URL ถูกคลิกซ้ำได้หลายครั้ง เหมือนป้ายเดียวมีคนผ่านดูซ้ำๆ ทุกวัน"},{"label":"2. ออกแบบวิธีสร้าง Short Code","detail":"เข้ารหัส ID ตัวเลข (auto-increment หรือ distributed ID generator) เป็น base62 (a-z, A-Z, 0-9) ได้ code สั้นไม่ซ้ำกันแน่นอน แทนที่จะสุ่มแล้วเช็คชนไปเรื่อยๆ"},{"label":"3. เลือก Database (module Database)","detail":"ข้อมูลเรียบง่าย (short_code → long_url) ไม่ต้องเชื่อมโยงข้ามตารางซับซ้อน ใช้ key-value store หรือ NoSQL ก็พอ ไม่จำเป็นต้องเป็น SQL"},{"label":"4. ใส่ Cache เพราะ Read-Heavy (module Caching)","detail":"URL ยอดนิยมถูกคลิกซ้ำมหาศาล — จดไว้ในกระดาษข้างเตา (cache mapping short_code → long_url ไว้ใน Redis) ลด load ที่ database ลงอย่างมาก"},{"label":"5. Scale ด้วย Load Balancer (module Scalability)","detail":"หลาย server รับ redirect request พร้อมกัน — เพราะไม่มีอะไรต้องจำเกี่ยวกับ user คนไหนเป็นพิเศษ (stateless ตามธรรมชาติ) ทำ horizontal scaling ได้ง่าย"},{"label":"6. พิจารณา Sharding ถ้าข้อมูลใหญ่มาก (module Database)","detail":"ถ้า URL สะสมหลักพันล้าน แบ่งไปเก็บคนละตึกตาม short_code (hash-based) รองรับได้ไม่จำกัดตามจำนวนตึกที่เพิ่ม"}]}
```

```demo
component: JourneyDiagram
props: {"nodes":[{"icon":"person","label":"Client"},{"icon":"notebook","label":"Cache"},{"icon":"building","label":"Database"}],"travelerIcon":"envelope","steps":[{"activeNode":0,"caption":"Client คลิก short link (เช่น short.ly/aZ3x9)"},{"activeNode":1,"caption":"App เช็ค Cache ก่อน — URL ยอดนิยมส่วนใหญ่ hit ที่นี่ ไม่ต้องไปแตะ Database เลย"},{"activeNode":2,"caption":"ถ้า Miss ถึงไปเปิด Database หา long URL จริง แล้วจดใส่ Cache ไว้ด้วย"},{"activeNode":0,"caption":"Redirect กลับไปยัง URL ต้นฉบับ — เพราะเป็น read-heavy ระบบเน้นให้ทาง Cache เร็วที่สุด"}]}
```

## Architecture รวม

```mermaid
flowchart LR
    C["Client"] --> LB["Load Balancer"]
    LB --> App["App Servers\n(stateless)"]
    App --> Cache["Redis Cache\n(short_code → URL)"]
    App --> DB["Database\n(sharded ถ้าจำเป็น)"]
    App -.->|"cache miss"| DB
```

## จุดที่มักถูกถามต่อในสัมภาษณ์

- **Custom alias** (ผู้ใช้ตั้ง short code เอง) — ต้องเช็คว่า code นั้นถูกใช้ไปแล้วหรือยัง (เหมือนเช็คว่าชื่อโดเมนนี้มีคนจองแล้วหรือยัง)
- **Analytics** (นับจำนวนคลิก) — <mark class="hl-warning">เขียนถี่มาก ควรทำแบบ async ไม่บล็อกการ redirect ให้ user ต้องรอ</mark> (module Async & Messaging)
- **URL หมดอายุ** — ใช้ TTL คล้ายกับที่เรียนใน module Caching (ป้ายที่มีวันหมดอายุกำกับ)

## คำถามเจาะลึกที่มักถูกถามต่อ

**ถาม: ทำไมต้องเข้ารหัส ID เป็น base62 แทนสุ่มโค้ดแล้วเช็คซ้ำว่าชนไหม?**
สุ่มแล้วเช็คต้องมี round-trip ไปถาม Database ก่อนทุกครั้งที่สร้าง code ใหม่ ยิ่ง code เก่าเต็ม namespace มากขึ้น โอกาสสุ่มชนก็สูงขึ้น ต้องวนสุ่มใหม่ซ้ำหลายรอบ <mark class="hl-insight">แปลง auto-increment ID เป็น base62 การันตีไม่ซ้ำได้ในครั้งเดียวจบ ไม่ต้องเช็คซ้ำเลย</mark>

**ถาม: Cache (Redis) ช่วยลด latency การ redirect ได้กี่เท่าเทียบกับอ่านจาก Database ตรงๆ?**
<mark class="hl-insight">Redis เป็น in-memory ตอบได้ในระดับ sub-millisecond (<1ms) ส่วน Database ต้องอ่าน disk/index มักใช้ 5-20ms ต่อ query</mark> — ถ้า URL ยอดนิยมถูกคลิกซ้ำหลักพัน-หมื่นครั้ง/วินาที ให้ Cache รับส่วนใหญ่แทน ลด latency เฉลี่ยของ redirect ลงหลักสิบเท่า และลด load ที่ Database เหลือแค่ตอน cache miss

**ถาม: ทำไมเลือก key-value/NoSQL แทน SQL ทั้งที่ระบบทั่วไปมักใช้ SQL?**
ข้อมูลมีแค่ `short_code → long_url` ไม่มี relation ข้ามตารางให้ join เลย SQL ให้ feature (join, complex transaction) ที่ไม่ได้ใช้ แต่แลกกับ overhead ของ schema/lock ที่ไม่จำเป็น key-value store ให้ throughput อ่าน/เขียนสูงกว่าต่อเครื่องเดียวกัน

**ถาม: ไม่มี Load Balancer จะเกิดอะไร ต่างจากมี LB แค่ไหน?**
ไม่มี LB ทุก request วิ่งไปเครื่องเดียว รับได้จำกัด (เช่นหลักพัน request/วินาที) เกินกว่านี้ request ต่อคิวจนช้าหรือ timeout <mark class="hl-insight">LB กระจาย traffic ไปหลายเครื่องพร้อมกัน เพิ่ม capacity รวมได้เป็นเส้นตรงตามจำนวนเครื่องที่เพิ่ม</mark>

**ถาม: เมื่อไหร่ถึงต้อง Shard Database จริงๆ ไม่ shard ตั้งแต่แรกได้ไหม?**
ไม่ต้อง shard ตั้งแต่แรก เครื่องเดียวที่มี index ดีรองรับได้หลักสิบล้าน-ร้อยล้านแถวสบายๆ ต้อง shard จริงตอนข้อมูลใหญ่เกินที่เครื่องเดียวเก็บ/ประมวลผลได้อย่างมีประสิทธิภาพ (มักระดับพันล้านแถวขึ้นไป) — shard ก่อนถึงจุดนั้นคือ over-engineering เพิ่มความซับซ้อนโดยไม่จำเป็น

**ถาม: ทำไม Analytics (นับคลิก) ต้อง async ไม่นับพร้อมกับ redirect เลย?**
ถ้านับแบบ synchronous ทุก redirect ต้องรอเขียน analytics เสร็จก่อนตอบ user เพิ่ม latency ให้ทุกคนโดยไม่จำเป็น (analytics ไม่ต้องรู้ผลทันที) แยกเป็น async ทำให้ user ได้ redirect เร็วเท่าที่ cache ตอบได้จริง (<10ms) ส่วนนับคลิกประมวลผลเบื้องหลังทีหลัง
