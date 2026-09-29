Leaderboard ของเกมหนึ่งเคย update real-time ทุกครั้งที่มีคะแนนเปลี่ยนแปลง ผ่านไปสองปีของการ "optimize เพื่อลด load" กลายเป็น update ทุก 5 นาที โดยไม่มีวันไหนเลยที่ทีมรู้สึกว่ากำลัง "ยอมรับความไม่ real-time" อย่างจงใจ ทุกการปรับดูสมเหตุสมผลในบริบทตอนนั้นเสมอ

## ระดับที่ 1: Event

ผู้เล่นบ่นว่าอันดับตัวเอง "ค้าง" ไม่ขยับเลย ทั้งที่เพิ่งชนะแมตช์ไปหลายนัดติดต่อกัน

## ระดับที่ 2: Pattern

ย้อนดู commit history ของระบบ leaderboard พบว่า delay ระหว่างคะแนนเปลี่ยนกับ leaderboard update ขยับทีละขั้นตลอด 2 ปี: real-time (&lt;1 วินาที) → 5 วินาที → 30 วินาที → 2 นาที → 5 นาที — <mark class="hl-insight">ทุกครั้งที่ขยับ มี commit message อธิบายเหตุผลด้าน performance รองรับอยู่เสมอ ไม่มีครั้งไหนเลยที่ดูเหมือนการตัดสินใจลดมาตรฐานอย่างจงใจ</mark>

## ระดับที่ 3: Systemic Structure

```demo
component: CausalLoopDiagram
props: {"nodes":[{"id":"gap","label":"Gap: ความ real-time ที่ควรมี vs ที่ทำได้","x":320,"y":230},{"id":"pressure","label":"แรงกดดันเรื่อง Load/Performance","x":320,"y":80},{"id":"scale","label":"ทางแก้จริง: scale infrastructure","x":100,"y":360},{"id":"lowerfreq","label":"ทางลัด: ลดความถี่ update","x":540,"y":360}],"links":[{"from":"gap","to":"pressure","polarity":"+"},{"from":"pressure","to":"scale","polarity":"+"},{"from":"scale","to":"gap","polarity":"-"},{"from":"pressure","to":"lowerfreq","polarity":"+"},{"from":"lowerfreq","to":"gap","polarity":"-"}],"loops":[{"label":"B","x":170,"y":230,"note":"ทางแก้จริง — ช้า ต้องลงทุน"},{"label":"B","x":470,"y":230,"note":"ทางลัด — เร็ว ไม่ต้องลงทุน"}],"highlightLinks":[{"from":"gap","to":"pressure"},{"from":"pressure","to":"lowerfreq"},{"from":"lowerfreq","to":"gap"}],"viewBox":"0 0 640 420"}
caption: โครงสร้างเดียวกับ Eroding Goals ที่เจอในโมดูล Systems Archetypes เป๊ะ — แค่เป้าหมายที่ถูกกัดกร่อนคือ "ความ real-time" แทนที่จะเป็น SLA
```

นี่คือ <mark class="hl-term">**Eroding Goals**</mark> ในคราบของการ optimize performance — ทุกครั้งที่มี pressure เรื่อง load ทีมเลือกทางลัด (ลดความถี่ update) เพราะทำได้เร็วกว่าการลงทุน scale infrastructure จริงมาก และไม่มีจุดไหนที่ต้องตัดสินใจ "ยอมรับมาตรฐานต่ำ" อย่างชัดเจนสักครั้ง มันแค่ไหลลงไปทีละขั้นจนกว่าจะมองย้อนกลับไปถึงรู้ว่าไกลจากจุดเริ่มต้นแค่ไหน

## ระดับที่ 4: Mental Model

ทีมเชื่อในแต่ละจุดว่า **"5 นาทีก็ยังนับว่า real-time พอสำหรับผู้เล่นส่วนใหญ่"** — <mark class="hl-warning">ปัญหาคือความเชื่อนี้ขยับทุกครั้งตามสิ่งที่ระบบทำได้จริง (capability) ไม่ใช่ตามสิ่งที่ผู้เล่นต้องการจริงๆ (demand) — เป็นการเอา mental model มาปรับตาม constraint แทนที่จะแก้ที่ constraint</mark>

## Leverage Point ที่แนะนำ

1. **Parameter**: ปรับ update interval กลับให้ถี่ขึ้น — แก้อาการชั่วคราว แต่ load กลับมาหนักเหมือนเดิมทันที
2. **Structure**: แยก "leaderboard คำนวณ" ออกจาก "leaderboard แสดงผล" — ใช้ incremental update สำหรับ top N และคนใกล้อันดับผู้เล่นแบบ real-time ส่วน full list ค่อย sync ช้าลงได้โดยไม่กระทบประสบการณ์ที่คนสนใจจริง
3. **Goals/Mental Model**: ตั้ง **Transcendent Goal** (จากโมดูล Eroding Goals) — กำหนด SLA ความ real-time ของ leaderboard ไว้ตายตัวเป็นมาตรฐานสัมบูรณ์ (เช่น "ต้อง update ภายใน 3 วินาทีเสมอ") ที่ไม่ยอมให้ engineering constraint มาต่อรองลดมันลงอีกโดยไม่มีคนตัดสินใจชัดเจน ถ้าจะลดต้องเป็นการตัดสินใจระดับ product ไม่ใช่ engineering ทยอยลดเงียบๆ

## กลไกที่ทำงานจริง

**Parameter (ปรับ interval กลับให้ถี่ขึ้น) ทำไมถึงถูกกัดกร่อนซ้ำ**: จากไดอะแกรมด้านบน B loop ฝั่ง "ทางลัด" (pressure→lowerfreq→gap) ยังอยู่ครบ การปรับ interval กลับคือการเดินย้อนกลับหนึ่งก้าวบน loop เดียวกัน — พอ load pressure กลับมา (ซึ่งจะกลับมาแน่เพราะไม่มีอะไรเปลี่ยนด้าน capacity) loop เดิมจะกัดกร่อน interval ลงอีกรอบ

**Structure (แยกคำนวณ/แสดงผล + incremental top-N) ทำไมถึงหยุดแรงกดดันได้จริง**: ทางนี้ไม่ได้สู้กับ loop ตรงๆ แต่ไปลบสาเหตุที่ทำให้ node "pressure" สูงตั้งแต่แรก — งานหนัก (full recompute) ถูกแยกออกจากสิ่งที่ผู้เล่นสนใจจริง (top N + อันดับใกล้ตัว) ทำให้ภาระที่เคยบีบให้ต้องเลือกทางลัดหายไปเยอะ นี่คือการตัดที่ต้นตอของแรงกดดัน ไม่ใช่ต่อรองกับผลลัพธ์ของแรงกดดันนั้น

**Goals/Mental Model (Transcendent Goal) ทำไมถึงตัด Loop ตรงจุด**: ทางนี้ตัดลิงก์ pressure→lowerfreq โดยตรง — เพราะ SLA ที่ตายตัวทำให้ "ลดความถี่" ไม่ใช่ตัวเลือกที่ทำได้อีกต่อไปโดยไม่มีใครอนุมัติ การกัดกร่อนแบบเงียบๆ ที่เคยเกิดขึ้นได้เพราะไม่มีจุดตัดสินใจชัดเจน ก็ไม่มีทางเกิดได้อีกเมื่อทุกการเปลี่ยนแปลงต้องเป็นการตัดสินใจที่มองเห็นได้

หัวข้อสุดท้ายของโมดูลนี้ทิ้งเรื่องเซิร์ฟเวอร์ไปเลย — ไปดูปัญหาที่เกิดจาก**คน** ไม่ใช่โค้ด: **สงคราม Guild ที่บานปลาย**
