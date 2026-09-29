# Systems Thinking — สมบูรณ์หรือยัง

Review เนื้อหาหน่อยคับว่าตอนนี้สมบูรณ์ครบถ้วนหรือยัง

---

38 topics ทั้งหมด ไม่ใช่ 36 อย่างที่บอกไปตอนจบ Phase 4 — เลขผิด นับใหม่จากไฟล์จริงคือ 31 topic เดิม + 7 advanced (module-29 ยกเว้น) = 38 ตรงกับ modules.ts ทุกโมดูล (4,4,5,5,9,4,4,3)

---

Checklist ที่วัดได้จริงจากไฟล์ ไม่ใช่ความจำ:
- ทุก 38 ไฟล์มี diagram อย่างน้อย 1 ตัว (mermaid หรือ demo component) — 0 ไฟล์หลุด
- 37/38 ไฟล์มี interactive demo component — เหลือ 1 ไฟล์ที่มีแค่ mermaid
- ทุก 38 ไฟล์มี mark (hl-term/hl-insight/hl-warning) อย่างน้อย 1 อัน — 0 ไฟล์หลุด
- quizzes.ts มี 114 คำถามพอดี = 38 topic × 3 ข้อ ไม่มี orphan ไม่มี missing key
- component ทั้ง 10 ชื่อที่ถูกเรียกใน demo fence resolve เข้า registry.ts ครบ ไม่มีชื่อพิมพ์ผิด
- grep หา TODO/FIXME/coming soon/placeholder/เร็วๆ นี้/ยังไม่เสร็จ ทั่ว track — ไม่เจอสักจุด

---

จุดเดียวที่หลุดจริง: `module-25/05-s-shaped-growth.md` มีแค่ mermaid xychart ไม่มี demo fence — เพราะตอน Phase 1 เขียน advanced topic ตัวนี้ ใช้ xychart ตามสไตล์ sibling (exponential-growth, goal-seeking, oscillation, overshoot) แต่ Phase 2 (demo backfill) สแกนแค่ 13 ไฟล์เดิมที่ mermaid-only ตั้งแต่ก่อน Phase 1 — s-shaped-growth เป็นไฟล์ใหม่ที่เกิดหลัง scan นั้น เลยหลุดจากลิสต์ไปเฉยๆ ไม่ใช่ตั้งใจข้าม

ทางแก้ถ้าจะอุดจริง: StepThroughDiagram เดินผ่าน 4 จุดของ S-curve (ช่วง exponential ต้น → inflection point → ชะลอ → carrying capacity) — component มีอยู่แล้ว ไม่ต้องสร้างใหม่ แค่ยังไม่ได้ทำ

---

"สมบูรณ์" ที่วัดได้จาก checklist (diagram+mark+demo+advanced-tier+quiz ต่อ topic) แทบครบ 38/38 เหลือ gap เดียว — แต่ "สมบูรณ์" แบบเนื้อหา Meadows เต็มพิกัดเป็นคำถามคนละข้อ ยังมีมุมที่ไม่ได้แตะเลย เช่น system dynamics simulation เชิงตัวเลขจริง (ตอนนี้มีแค่ StockFlowSimulator/FeedbackLoopSimulator ตัวเดียวที่ interactive เชิงตัวเลข), หรือ leverage point แต่ละระดับที่เหลือ (ตอนนี้ลงลึกแค่ parameter/rules/goals/paradigm ผ่านเคส ไม่ได้แตะทุกระดับใน 12 ระดับเท่ากัน) — ไม่ใช่ gap ที่ "ต้องแก้" แต่เป็นขอบเขตที่ยังขยายได้ถ้าอยากลึกกว่านี้อีก

---

อุดแล้ว — เพิ่ม StepThroughDiagram 4 steps ให้ `module-25/05-s-shaped-growth.md` (ช่วงต้นเหมือน exponential → inflection point → ช่วงชะลอ → เข้าใกล้ carrying capacity) วางไว้หลังพารากราฟ inflection point ก่อนตาราง "ตัวอย่างที่พบ S-curve" verify ผ่านหมด: typecheck/lint/vitest 37/37/build clean + เช็คจริงในเบราว์เซอร์เห็น STEP 1/4 เรนเดอร์ถูก ตอนนี้ 38/38 ไฟล์มีทั้ง diagram และ demo ครบ ไม่เหลือ gap ที่วัดได้จาก checklist แล้ว

---

module-29 (Case Studies) ขยายจาก 3 เป็น 13 เคส — 10 เคสใหม่ครอบคลุม archetype ที่เหลือเกือบครบ (Tragedy of Commons, Growth and Underinvestment, Overshoot and Collapse, Accidental Adversaries, Emergence/Boundary Problem) บวกเคสเดิม (Success to the Successful, Eroding Goals, Escalation) จากทั้งบริบทเกม/live-service และองค์กร

---

ตอนนี้คุณได้เพิ่ม ใช้ความรู้อะไรของ System Thinking มาแก้ไขปัญหา และมันแก้ไขปัญหายังไง แก้ไขปัญหาได้ยังไง มีขั้นตอนอะไรบ้าง มันทำงานยังไง มีอะไรอยู่ภายใต้การทำงานนั้นบ้าง และอื่นๆ แล้วใช่มั้ยคับ

---

เช็คจริงจากไฟล์ (grep ไม่ใช่ความจำ) — `## กลไกที่ทำงานจริง` มีครบทั้ง 13/13 ไฟล์ใน module-29 แต่ละไฟล์มี 3 ย่อหน้าแยกตาม Leverage Point (Parameter/Structure/Goals) ทุกย่อหน้า:
- อ้างอิงกลับ diagram ที่อยู่ข้างบนตรงๆ ("จากไดอะแกรมด้านบน...") — บอกว่าแตะ node/link ไหน
- อธิบายว่าทำไม Parameter (ระดับตื้น) ถึงไม่ปิด loop จริง — มักเป็นเพราะ "แก้แค่ความน่าจะเป็น/ยกเพดาน" ไม่แตะ link ในไดอะแกรม
- อธิบายว่า Structure/Goals ไปตัด link ไหนโดยตรง พร้อมเรียกชื่อหลักการ systems thinking ที่ใช้ (เช่น stock/flow valve, ลบ precondition ของ archetype, จัดแนวแรงจูงใจ)

ตัวอย่างจริงจาก matchmaking-death-spiral: "จากไดอะแกรมด้านบน ลิงก์ทั้ง 3 เส้นของ R loop (players→queue→quit→players) ยังอยู่ครบ การจับคู่กว้างขึ้นแค่ลด queue ชั่วคราวโดยไม่แตะลิงก์ไหนเลย" — ตรงตามที่ขอทั้ง 5 อย่าง: ความรู้ที่ใช้ (R loop + link เฉพาะ), ทำไมถึงแก้/ไม่แก้ได้, ขั้นตอน (3 ระดับ Parameter→Structure→Goals เรียงกัน), กลไกการทำงาน (ตัด link ไหน), และสิ่งที่อยู่ภายใต้ (ตัว loop ในไดอะแกรม) — ใช่ ทำครบตามที่ถามแล้ว
