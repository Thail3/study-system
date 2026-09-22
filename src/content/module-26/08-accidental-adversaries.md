ทีม Platform อยากลดค่าใช้จ่าย cloud เลยตั้ง quota การใช้ shared compute pool ให้เข้มงวดขึ้น — เป้าหมายของทีม Platform เอง สมเหตุสมผลเต็มที่ ไม่มีใครในทีม Platform คิดจะ "แกล้ง" ทีม Feature เลยสักนิด แต่ผลข้างเคียงคือ pipeline ของทีม Feature ช้าลง ทีม Feature ที่ต้องการความเร็วในการ ship จึงเริ่มตั้ง compute instance แยกของตัวเองนอกระบบ (shadow infra) เพื่อเลี่ยงคอขวด — เป้าหมายของทีม Feature เองก็สมเหตุสมผลเต็มที่เช่นกัน แต่ shadow infra ที่กระจัดกระจายทำให้ค่าใช้จ่ายรวมพุ่งขึ้นและยากต่อการควบคุม ทีม Platform เห็นตัวเลขค่าใช้จ่ายที่บานปลายจึงยิ่งเข้มงวด quota มากขึ้นไปอีก — สองทีมกลายเป็นศัตรูกันในทางปฏิบัติ ทั้งที่ไม่มีใครเคยตั้งใจจะ "สู้" กับอีกฝ่ายเลยแม้แต่ครั้งเดียว

## Accidental Adversaries: ศัตรูที่เกิดจากการไม่มีเจตนาร้ายเลยสักฝ่าย

นี่คือความต่างสำคัญจาก **Escalation** (หัวข้อก่อนหน้า) — ใน Escalation แต่ละฝ่าย**ตอบโต้โดยตรง**ต่อการกระทำของอีกฝ่าย (เห็นอีกฝ่ายทำอะไร แล้วสวนกลับ) แต่ใน **Accidental Adversaries** แต่ละฝ่าย**ไม่เคยมองอีกฝ่ายเลย** — แค่พยายามทำให้<mark class="hl-term">metric ของตัวเองดีขึ้นอย่างเป็นอิสระ (independent optimization)</mark> โดยไม่รู้ตัวว่าการกระทำนั้นส่งผลข้างเคียงลบไปโดนอีกฝ่ายเข้าเต็มๆ

```demo
component: CausalLoopDiagram
props: {"nodes":[{"id":"platform_action","label":"Platform: เข้มงวด quota","x":130,"y":110},{"id":"platform_success","label":"Platform: Cost Efficiency","x":130,"y":390},{"id":"feature_action","label":"Feature: สร้าง Shadow Infra","x":770,"y":110},{"id":"feature_success","label":"Feature: Ship Velocity","x":770,"y":390}],"links":[{"from":"platform_action","to":"platform_success","polarity":"+"},{"from":"platform_success","to":"platform_action","polarity":"+"},{"from":"feature_action","to":"feature_success","polarity":"+"},{"from":"feature_success","to":"feature_action","polarity":"+"},{"from":"platform_action","to":"feature_success","polarity":"-"},{"from":"feature_action","to":"platform_success","polarity":"-"}],"loops":[{"label":"R","x":130,"y":250,"note":"Platform หมุนวงตัวเอง"},{"label":"R","x":770,"y":250,"note":"Feature หมุนวงตัวเอง"}],"highlightLinks":[{"from":"platform_action","to":"feature_success"},{"from":"feature_action","to":"platform_success"}],"viewBox":"0 0 900 480"}
caption: สอง R loop ซ้ายและขวาคือแต่ละทีม optimize metric ของตัวเองอย่างอิสระ (ไม่แตะกันเลย) — ลิงก์ทแยงตรงกลางสองเส้น (สีน้อยกว่า เป็น "−") คือผลข้างเคียงที่ไม่ตั้งใจซึ่งพุ่งข้ามไปโดนอีกฝ่าย
```

สังเกตว่าไดอะแกรมนี้**ไม่มีลิงก์ตรงระหว่าง "Platform: เข้มงวด quota" กับ "Feature: สร้าง Shadow Infra" เลย** — สองการกระทำนี้ไม่เคย "คุย" กันโดยตรง แต่ละฝ่ายมี R loop ของตัวเองที่หมุนได้ดีในมุมมองของตัวเอง (เข้มงวด quota → cost efficiency ดีขึ้น → เข้มงวดต่อ, สร้าง shadow infra → ship เร็วขึ้น → สร้างต่อ) <mark class="hl-warning">ความเสียหายเกิดจากลิงก์ทแยงสองเส้นที่เป็น "ผลข้างเคียงที่มองไม่เห็นจากมุมของฝ่ายที่ก่อ" — Platform ไม่เห็นว่า quota ของตัวเองไปกระทบ velocity ของ Feature โดยตรง และ Feature ก็ไม่เห็นว่า shadow infra ของตัวเองไปกระทบ cost efficiency ของ Platform โดยตรงเช่นกัน</mark>

## ทำไมถึงแก้ยากกว่า Escalation

Escalation แก้ได้ด้วยข้อตกลงร่วมกันเพราะทั้งสองฝ่าย**รู้ตัว**ว่ากำลังแข่งกันอยู่ แต่ Accidental Adversaries แก้ยากกว่าเพราะ**ไม่มีฝ่ายไหนรู้ตัวว่าตัวเองคือต้นเหตุของปัญหาอีกฝ่าย** — แต่ละทีมมองเห็นแค่ metric ของตัวเองดีขึ้นเรื่อยๆ (จากมุมตัวเอง ทุกอย่างดูสมเหตุสมผล ทำถูกทุกอย่าง) จึงไม่มีแรงจูงใจใดๆ ให้หยุดหรือเปลี่ยนพฤติกรรม จนกว่าจะมีใครสักคน**มองเห็นภาพรวมทั้งสองฝ่ายพร้อมกัน** (<mark class="hl-insight">นี่คือปัญหา system boundary ที่แคบเกินไปจากโมดูล System Traps อีกครั้ง — แต่ละทีมวาดขอบเขตแค่รอบตัวเอง ไม่เห็นผลกระทบที่ส่งออกไปนอกขอบเขต</mark>)

## ตัวอย่างที่พบบ่อย

| ฝ่าย A optimize ของตัวเอง | ฝ่าย B optimize ของตัวเอง | ผลข้างเคียงที่ไม่มีใครตั้งใจ |
|---|---|---|
| Platform เข้มงวด infra quota เพื่อ cost | Feature สร้าง shadow infra เพื่อ velocity | Cost รวมพุ่ง, Platform เข้มงวดต่อ วนซ้ำ |
| Sales เร่งปิด deal ด้วย custom feature request | Engineering ต้อง maintain custom code เพิ่มเรื่อยๆ เพื่อรองรับ | Velocity โดยรวมช้าลง กระทบ deal รอบถัดไปที่ Sales ต้องการ |
| Security เพิ่มขั้นตอน approval เพื่อลด risk | Product เลี่ยงขั้นตอนด้วยการ deploy ผ่านช่องทางลัดที่ยังไม่มี policy คุม | Risk จริงเพิ่มขึ้นกว่าตอนไม่มี process เสียอีก |

## ทางแก้: เมตริกร่วมที่มองเห็นผลกระทบข้ามทีม

ทางแก้ที่ใช้ได้จริงคือสร้าง**metric หรือเวทีที่บังคับให้เห็นผลกระทบข้ามฝ่าย** แทนที่แต่ละฝ่ายจะวัดผลแค่ในขอบเขตของตัวเอง เช่น Platform กับ Feature ควรมี shared metric ร่วมกัน (เช่น "cost ต่อ feature ที่ ship สำเร็จ" แทนที่จะแยกวัด cost efficiency กับ velocity คนละตัว) หรือจัดให้สองทีมนั่งคุยกันเป็นระยะเพื่อเห็น trade-off ที่แต่ละฝ่ายกำลังส่งผ่านให้กันโดยไม่รู้ตัว — จุดสำคัญที่สุดคือต้องมีคนหรือกลไกที่ยืนอยู่ "นอกขอบเขต" ของทั้งสองฝ่าย มองเห็นทั้งภาพ ไม่ใช่ปล่อยให้แต่ละฝ่าย optimize ตัวเลขของตัวเองแบบแยกส่วนตลอดไป

โมดูล Systems Archetypes จบลงตรงนี้ด้วย 8 แพทเทิร์นที่พบซ้ำบ่อยที่สุดในองค์กรและระบบซอฟต์แวร์ — โมดูลถัดไป **Leverage Points** จะพาไปดูคำถามที่สำคัญกว่านั้นอีกขั้น: เมื่อรู้แล้วว่าระบบมีโครงสร้างแบบไหน **ควรเข้าไปแทรกแซงตรงจุดไหนถึงจะได้ผลมากที่สุด** โดยใช้แรงน้อยที่สุด
