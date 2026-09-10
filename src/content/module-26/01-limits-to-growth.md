โมดูลก่อนหน้าเจอ overshoot and collapse มาแล้วในฐานะ "พฤติกรรม" — โมดูลนี้จะให้ชื่อทางการกับโครงสร้างที่ผลิตพฤติกรรมนั้น เรียกว่า **Systems Archetype** คือแพทเทิร์นโครงสร้างที่พบซ้ำๆ จนถูกตั้งชื่อ จำแนกไว้ ให้จำได้และสื่อสารกับทีมได้เร็วโดยไม่ต้องวาดใหม่ทุกครั้ง

## Limits to Growth: โครงสร้างมาตรฐานเบื้องหลัง Overshoot

**Limits to Growth** คือ R loop ที่ขับเคลื่อนการเติบโต บวกกับ B loop ที่มาจากเงื่อนไขจำกัด (constraining condition) ซึ่งแรงขึ้นเรื่อยๆ ตามการเติบโตนั้นเอง จนในที่สุดฉุดการเติบโตให้ช้าลง

```demo
component: CausalLoopDiagram
props: {"nodes":[{"id":"action","label":"ทุ่มความพยายามโต","x":120,"y":240},{"id":"engine","label":"ตัวชี้วัดการเติบโต","x":420,"y":100},{"id":"condition","label":"เงื่อนไขจำกัด","x":720,"y":240},{"id":"slowing","label":"แรงฉุด","x":420,"y":400}],"links":[{"from":"action","to":"engine","polarity":"+"},{"from":"engine","to":"action","polarity":"+"},{"from":"engine","to":"condition","polarity":"+"},{"from":"condition","to":"slowing","polarity":"+"},{"from":"slowing","to":"engine","polarity":"-"}],"loops":[{"label":"R","x":270,"y":170,"note":"engine of growth"}],"delays":[{"from":"engine","to":"condition"}],"viewBox":"0 0 800 460"}
caption: R loop (บน) ขับเคลื่อนการเติบโต — B loop (ผ่าน condition→slowing) เริ่มไม่มีผลตอนแรก แต่แรงขึ้นเรื่อยๆ ตาม engine ที่โต จนวันหนึ่งฉุดไม่ทัน
```

จุดที่ทำให้ archetype นี้อันตรายคือช่วงแรก B loop (แรงฉุด) แทบไม่มีผลเลย เพราะ condition ยังห่างไกลขีดจำกัด ทำให้ทุกคนเห็นแค่ R loop ที่กำลังทำงานได้สวย — พอ condition เริ่มใกล้ขีดจำกัดจริง B loop ถึงเริ่ม "รู้สึกได้" ซึ่งมักสายเกินไปแล้วที่จะชะลอทัน (มี delay ระหว่าง engine กับ condition กำกับอยู่ ดังในไดอะแกรม)

## ตัวอย่างที่พบบ่อย

| Growth Engine (R loop) | Constraining Condition | สัญญาณเตือนที่มักถูกมองข้าม |
|---|---|---|
| ทีมเติบโตเร็วโดยจ้างเพิ่มเรื่อยๆ | Onboarding capacity ของ senior ที่มีจำกัด | เวลา senior ต้อง mentor ต่อคนใหม่ เพิ่มขึ้นเงียบๆ ก่อนที่จะเห็นผลชัด |
| Feature ใหม่ถูกเพิ่มเร็วตาม demand | Code complexity ที่สะสม | Velocity ยังดูปกติในช่วงแรก เพราะเพิ่งเริ่มสะสม complexity |
| ผู้ใช้โตแบบ viral | Database ที่ scale แนวตั้งอย่างเดียว | Query latency ขยับขึ้นทีละนิด ไม่มีใครสังเกตจนถึงจุดวิกฤต |

## ทางแก้ตาม Systems Thinking: อย่าไปดัน R loop แรงขึ้นอย่างเดียว

สัญชาตญาณทั่วไปเมื่อเห็นการเติบโตชะลอตัวคือ "ดัน R loop ให้แรงขึ้นอีก" (จ้างเพิ่มอีก, การตลาดแรงขึ้นอีก) — แต่ถ้าสาเหตุที่แท้จริงคือ constraining condition กำลังทำงาน การดัน R loop แรงขึ้นจะยิ่งเร่งให้ระบบชน limit เร็วขึ้นเท่านั้น ทางแก้ที่ Systems Thinking แนะนำเสมอคือ **หาและขยาย constraining condition ให้กว้างขึ้นก่อน** (เพิ่ม senior capacity, ลด complexity ผ่าน refactor, sharding database) แล้วค่อยดัน R loop ต่อ — นี่คือหลักการที่จะกลับมาเจอแบบเป็นระบบมากขึ้นในโมดูล Leverage Points ถัดไป
