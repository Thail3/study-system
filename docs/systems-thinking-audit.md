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
