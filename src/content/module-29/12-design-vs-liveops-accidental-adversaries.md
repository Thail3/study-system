ทีม Game Design กับทีม Live-Ops ไม่เคยทะเลาะกันตรงๆ สักครั้ง ทั้งสองทีมยิ้มแย้มในที่ประชุมรวมทุกสัปดาห์ — แต่ทั้งสองทีมกำลังทำลายเป้าหมายของกันและกันอยู่เงียบๆ มาหลายเดือน โดยไม่มีใครรู้ตัวจนกระทั่งมีคนมารวบรวมข้อมูลทั้งสองฝั่งเข้าด้วยกัน

## ระดับที่ 1: Event

Community manager รายงานว่า player trust score ลดลงต่อเนื่อง ขณะที่ engagement metric ของทีม design กลับดีขึ้นเรื่อยๆ ในช่วงเวลาเดียวกัน — ตัวเลขสวนทางกันแบบที่ไม่มีใครในห้องประชุมเข้าใจตอนแรก

## ระดับที่ 2: Pattern

ย้อนดู patch history เทียบกับ trust score พบว่าทุกครั้งที่ design ออก balance patch ถี่ (เพื่อความสดใหม่ของเกม) trust score ของ community ดิ่งลงตรงกันทุกรอบ — <mark class="hl-insight">เกิดซ้ำแบบเดียวกันไม่มีข้อยกเว้น แต่ไม่เคยมีใครเอาสองชุดข้อมูลนี้มาเทียบกันมาก่อน เพราะอยู่คนละ dashboard คนละรายงาน</mark>

## ระดับที่ 3: Systemic Structure

```demo
component: CausalLoopDiagram
props: {"nodes":[{"id":"patchfreq","label":"Design: Patch ถี่ขึ้น","x":140,"y":120},{"id":"engagement","label":"Engagement","x":140,"y":320},{"id":"stability","label":"Live-Ops: คง Meta นิ่ง","x":540,"y":120},{"id":"trust","label":"Tournament Trust","x":540,"y":320}],"links":[{"from":"patchfreq","to":"engagement","polarity":"+"},{"from":"engagement","to":"patchfreq","polarity":"+"},{"from":"stability","to":"trust","polarity":"+"},{"from":"trust","to":"stability","polarity":"+"},{"from":"patchfreq","to":"trust","polarity":"-"},{"from":"stability","to":"engagement","polarity":"-"}],"loops":[{"label":"R","x":140,"y":220,"note":"design เห็นแค่วงนี้"},{"label":"R","x":540,"y":220,"note":"live-ops เห็นแค่วงนี้"}],"highlightLinks":[{"from":"patchfreq","to":"trust"},{"from":"stability","to":"engagement"}],"viewBox":"0 0 680 400"}
caption: ลิงก์ทแยงสองเส้น (patch→trust, stability→engagement) คือตัวการจริง — ไม่มีลิงก์ตรงระหว่างสองทีมเลย แต่ละทีมมองเห็นแค่ R loop ของตัวเอง
```

นี่คือ <mark class="hl-term">**Accidental Adversaries**</mark> — สังเกตว่า<mark class="hl-warning">ไม่มีลิงก์ตรงระหว่าง "การกระทำของ design" กับ "การกระทำของ live-ops" เลยสักเส้น แต่ละทีมมี R loop ของตัวเองที่หมุนดีในมุมมองของตัวเอง (design: patch ถี่ → engagement ดี → มั่นใจ patch ต่อ, live-ops: meta นิ่ง → trust ดี → ยิ่งอยากคงนิ่งต่อ) ความเสียหายเกิดจากลิงก์ทแยงสองเส้นที่เป็นผลข้างเคียงซึ่งมองไม่เห็นจากมุมของฝ่ายที่ก่อขึ้นเอง</mark>

## ระดับที่ 4: Mental Model

ทั้งสองทีมเชื่อว่ากำลัง optimize สิ่งที่ดีที่สุดสำหรับเกมอยู่แล้วในมุมของตัวเอง — ไม่มีใครมองเห็น metric ของอีกฝ่ายเลยเพราะ dashboard คนละชุด รายงานคนละที่ ไม่เคยถูกนำมารวมกันในที่เดียวจนกว่าจะมีคนตั้งใจไปขุดหาเอง

## Leverage Point ที่แนะนำ

1. **Parameter**: จัดประชุม sync กันบ่อยขึ้น — ช่วยสื่อสารได้บ้าง แต่ไม่แก้ที่ metric ที่วัดคนละเรื่องกันอยู่ดี
2. **Structure**: สร้าง shared dashboard ที่ทั้งสองทีมเห็น metric ของกันและกันพร้อมกัน (leverage point ระดับ information flow) ให้เห็นผลกระทบข้ามทีมได้ทันที ไม่ใช่มารู้ทีหลังจากรายงานไตรมาส
3. **Goals/Mental Model**: ตั้ง metric ร่วมที่บังคับให้ทั้งสองทีมรับผิดชอบร่วมกัน เช่น "player retention รวม" แทนที่จะแยก metric ทีมใครทีมมัน — ทำให้ trade-off ระหว่าง freshness กับ stability ต้องถูกตัดสินใจร่วมกันอย่างเปิดเผย ไม่ใช่ต่างคน optimize คนละทิศทางเงียบๆ

## กลไกที่ทำงานจริง

**Parameter (sync meeting บ่อยขึ้น) ทำไมถึงไม่รับประกันอะไร**: จากไดอะแกรมด้านบน ความเสียหายจริงไหลผ่านลิงก์ทแยงสองเส้น (patchfreq→trust, stability→engagement) ที่ dashboard ของแต่ละทีมไม่แสดงให้เห็น — การประชุมให้โอกาสพูดถึงมันได้ แต่ไม่มีอะไรบังคับว่าจะมีใครหยิบยกขึ้นมาทุกครั้ง ขึ้นอยู่กับว่ามีใครจำได้หรือเปล่า

**Structure (shared dashboard) ทำไมถึงทำให้ลิงก์ทแยงมองเห็นได้จริง**: การรวม metric ทั้งสองทีมไว้ที่เดียวทำให้ลิงก์ทแยงที่เคยเป็นผลข้างเคียงที่มองไม่เห็น กลายเป็นข้อมูลที่ทั้งสองทีมเห็นพร้อมกันทุกครั้งโดยไม่ต้องพึ่งความจำใคร — loop ของแต่ละทีมไม่ได้เปลี่ยนรูปร่าง แต่ตอนนี้แต่ละทีมเห็นผลกระทบข้ามทีมของตัวเองแบบ real-time

**Goals/Mental Model (shared retention metric) ทำไมถึงเป็น leverage ที่แรงที่สุด**: ทางนี้ไปไกลกว่าแค่ทำให้มองเห็น — เมื่อ "player retention รวม" เป็นตัวชี้วัดร่วม ลิงก์ทแยงที่เคยเป็นต้นทุนซ่อนของอีกฝ่าย จะกลายเป็นต้นทุนโดยตรงต่อ metric ที่แต่ละทีมกำลัง optimize อยู่แล้ว หลักการเดียวกับ org-wide throughput ในเคส CI/CD runner pool: จัดแนวแรงจูงใจส่วนบุคคลให้ตรงกับสุขภาพของระบบรวม แทนที่จะปล่อยให้ต่างคนต่าง optimize สวนทางกัน

หัวข้อสุดท้ายของโมดูลนี้ทิ้งเรื่องทีมงานไปเลย — ไปดูปัญหาที่ไม่มีใครในระบบทำอะไรผิดสักคน แต่ระบบทั้งระบบกำลังพังอยู่ตรงหน้า: **Bot Farm ที่ปั่นเศรษฐกิจในเกม**
