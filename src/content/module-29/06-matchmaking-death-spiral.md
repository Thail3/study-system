เกม PvP ออนไลน์เกมหนึ่งเคยมีผู้เล่นพร้อมกันหลักหมื่นคน ผ่านไปปีครึ่ง เหลือไม่ถึงร้อยคน ทีมพัฒนาไม่ได้ทำอะไรผิดใหญ่ๆ เลย ไม่มี bug ร้ายแรง ไม่มี scandal ไม่มีคู่แข่งมาแย่งตลาด — เกมตายจาก loop เดียวที่ไม่มีใครหยุดมันทัน

## ระดับที่ 1: Event

เดือนนี้ queue time เฉลี่ยของ matchmaking ยาวขึ้นเป็น 8 นาที จากที่เคยแค่ 30 วินาทีเมื่อปีก่อน ผู้เล่นบ่นในทุกช่องทางว่า "รอแมตช์นานเกินไป"

## ระดับที่ 2: Pattern

กราฟ concurrent player ย้อนหลัง 18 เดือน เป็นทรง decline ต่อเนื่อง ไม่ใช่ drop ฉับพลันจากเหตุการณ์ใดเหตุการณ์หนึ่ง — <mark class="hl-insight">ทุกเดือนลดลงประมาณ 8-12% สม่ำเสมอ เป็นทรงกราฟตรงข้ามกับ exponential growth เป๊ะ (decay แบบทบต้น) จากโมดูล Behavior Patterns</mark>

## ระดับที่ 3: Systemic Structure

```demo
component: CausalLoopDiagram
props: {"nodes":[{"id":"players","label":"จำนวนผู้เล่นออนไลน์","x":320,"y":230},{"id":"queue","label":"Queue Time","x":580,"y":230},{"id":"quit","label":"คนเลิกเล่นระหว่างรอ","x":450,"y":390}],"links":[{"from":"players","to":"queue","polarity":"-"},{"from":"queue","to":"quit","polarity":"+"},{"from":"quit","to":"players","polarity":"-"}],"loops":[{"label":"R","x":420,"y":300,"note":"death spiral — วิ่งไม่หยุดเอง"}],"highlightLinks":[{"from":"players","to":"queue"},{"from":"queue","to":"quit"},{"from":"quit","to":"players"}],"viewBox":"0 0 720 460"}
caption: R loop เดียวกับ tech debt spiral และ cascading failure ที่เห็นมาแล้วในโมดูลก่อน — แค่เปลี่ยนตัวละครเป็น "ผู้เล่นในเกม" แทน
```

โครงสร้างนี้คือ Reinforcing Loop ล้วนๆ ไม่มี Balancing Loop มาคานเลย: ผู้เล่นน้อยลง → matchmaking หาคู่ยากขึ้น → queue time นานขึ้น → คนเบื่อรอ เลิกเล่นระหว่างรอ → ผู้เล่นยิ่งน้อยลงอีก วนกลับไปจุดเริ่มต้นแต่แย่กว่าเดิมทุกรอบ — <mark class="hl-warning">ทีมทำ event/promotion ดึงคนกลับมาเป็นระยะๆ ได้ผลชั่วคราว แต่ queue time ยังแย่เหมือนเดิมทันทีที่ event จบ คนที่กลับมาเจอ queue นานก็เลิกเล่นซ้ำ — เข้าข่าย Fixes That Fail จากโมดูล Systems Archetypes</mark>

## ระดับที่ 4: Mental Model

ทีมเชื่อว่า "แค่ทำ event ดึงคนกลับมาเป็นระยะๆ ก็เพียงพอแล้ว" โดยไม่เห็นว่าปัญหาที่แท้จริงคือ**โครงสร้างของระบบ matchmaking เอง** ไม่ใช่แค่ "จำนวนคนที่ลดลง" เฉยๆ — mental model นี้ทำให้ทุกความพยายามแก้ปัญหาพุ่งไปที่การ "เพิ่มคนกลับเข้ามา" (แก้ที่ event ผิวน้ำ) แทนที่จะแก้ที่ตัว loop ที่กำลังกัดกินตัวเองอยู่

## Leverage Point ที่แนะนำ

1. **Parameter**: ลดความเข้มงวดของ skill-based matchmaking ชั่วคราว (จับคู่กว้างขึ้น) — ลด queue time ได้จริง แต่แลกกับ match quality ที่แย่ลง
2. **Structure**: รวม server region/game mode ที่แยก pool กันไว้เข้าเป็น pool เดียว (ลด fragmentation ของ player base ที่มีอยู่), เพิ่ม cross-play ข้ามแพลตฟอร์มเพื่อเติม pool ตอนช่วง low-population
3. **Goals/Mental Model**: เปลี่ยนเป้าหมายจาก "รักษาคุณภาพ match ให้สูงสุดเสมอ" เป็น "รักษา queue time ให้สั้นพอที่คนจะไม่เลิกรอ แม้ต้องแลกกับ match quality บ้าง" — ยอมรับว่า ณ จุดที่ population ใกล้ death spiral, queue time คือ leverage point ที่แรงกว่า match quality มาก

## กลไกที่ทำงานจริง

**Parameter (ลดความเข้มงวด matchmaking ชั่วคราว) ทำไมถึงแค่ซื้อเวลา**: จากไดอะแกรมด้านบน ลิงก์ทั้ง 3 เส้นของ R loop (players→queue→quit→players) ยังอยู่ครบ การจับคู่กว้างขึ้นแค่ลด queue ชั่วคราวโดยไม่แตะลิงก์ไหนเลย — พอ player count ลดลงอีกจากสาเหตุอื่น loop เดิมจะวิ่งซ้ำแบบเดิมทันที

**Structure (รวม pool + cross-play) ทำไมถึงอ่อนแรง Loop ได้จริง**: การรวม server region/mode เข้าเป็น pool เดียวไม่ได้เพิ่มจำนวนผู้เล่นจริง แต่ทำให้ผู้เล่นเท่าเดิมมี pool ให้จับคู่ใหญ่ขึ้น — นี่คือการอ่อนแรงลิงก์ players→queue โดยตรง (ผู้เล่นจำนวนเท่าเดิม แต่ queue time สั้นลงสำหรับจำนวนผู้เล่นเท่านั้น) ต่างจาก parameter ที่แค่ยอมลดคุณภาพ match แลกความเร็วชั่วคราว

**Goals/Mental Model (queue time > match quality) ทำไมถึงตัด Loop ตรงจุดที่สำคัญที่สุด**: loop นี้ spiral ได้เพราะลิงก์ queue→quit คือตัวขับเคลื่อนหลักตอน population ต่ำ — การเปลี่ยนเป้าหมายให้ปกป้อง queue time เป็นอันดับแรกคือการเข้าไปตัดลิงก์นั้นตรงๆ แทนที่จะพยายามรักษา match quality (ซึ่งเป็นสาเหตุที่ทำให้ matching เข้มงวดจน queue ยาวตั้งแต่แรก)

หัวข้อถัดไปเปลี่ยนจาก loop ที่ทำลายตัวเองแบบเห็นชัด ไปเป็นปัญหาที่ค่อยๆ กัดกร่อนแบบไม่มีใครรู้ตัวว่ากำลังยอมรับมาตรฐานที่ต่ำลง — **Leaderboard ที่ Drift ทีละนิด**
