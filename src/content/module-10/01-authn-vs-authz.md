ลองนึกภาพพนักงานออฟฟิศที่ต้องผ่านสองด่านทุกเช้า — ด่านแรกคือ**บัตรพนักงาน**ที่แสกนหน้าประตูตึก ยืนยันว่า "คุณคือพนักงานคนนี้จริง" ด่านที่สองคือ**คีย์การ์ดเปิดประตูห้อง** ที่กำหนดว่าคุณเข้าห้องไหนได้บ้าง (ห้อง HR เข้าได้เฉพาะทีม HR, ห้องเซิร์ฟเวอร์เข้าได้เฉพาะทีมไอที) — สองด่านนี้ตอบคำถามคนละอย่างกัน แม้จะดูคล้ายกันมาก

<mark class="hl-term">Authentication (AuthN)</mark> กับ <mark class="hl-term">Authorization (AuthZ)</mark> คือคำสองคำที่คนสับสนกันบ่อยที่สุดในเรื่อง security — เหมือนบัตรพนักงานกับคีย์การ์ดเปิดห้อง

```demo
component: ComparisonDiagram
props: {"left":{"title":"Authentication (AuthN) — บัตรพนักงาน","points":["ตอบคำถาม: คุณเป็นใคร?","พิสูจน์ตัวตน เช่น login ด้วย password, OTP (One-Time Password), biometric","เกิดขึ้นครั้งเดียวตอนเข้าระบบ (ได้ token/session มา)"]},"right":{"title":"Authorization (AuthZ) — คีย์การ์ดเปิดห้อง","points":["ตอบคำถาม: คุณเข้าห้องนี้ได้ไหม?","ตรวจสิทธิ์ทุกครั้งที่พยายามเข้าถึง resource","เกิดขึ้นซ้ำๆ ทุกครั้งที่ต้องการสิทธิ์"]},"note":"ลำดับเสมอ: ต้องแสกนบัตรพนักงาน (AuthN) ผ่านก่อน ถึงจะมาแตะคีย์การ์ดเปิดห้อง (AuthZ) ได้"}
```

```demo
component: JourneyDiagram
props: {"nodes":[{"icon":"person","label":"User"},{"icon":"gate","label":"AuthN"},{"icon":"gate","label":"AuthZ"}],"travelerIcon":"envelope","steps":[{"activeNode":1,"caption":"User login ด้วย email+password — ผ่านด่าน AuthN (พิสูจน์ว่าคุณเป็นใคร) ได้ token มา"},{"activeNode":2,"caption":"User ขอลบโพสต์ — มาถึงด่าน AuthZ (เช็คว่ามีสิทธิ์ทำสิ่งนี้ไหม)"},{"activeNode":2,"caption":"Token ถูกต้อง (ผ่าน AuthN) แต่ไม่มีสิทธิ์ลบโพสต์คนอื่น (ไม่ผ่าน AuthZ) — ได้ 403 Forbidden กลับไป"}]}
```

## ตัวอย่างในชีวิตจริง

```mermaid
sequenceDiagram
    participant U as User
    participant App as Application
    U->>App: Login ด้วย email + password (แสกนบัตรพนักงาน)
    App-->>U: ยืนยันตัวตนสำเร็จ ออก token ให้ (บัตรผ่านประตูตึก)
    U->>App: ขอลบโพสต์ของคนอื่น (ใช้ token เดิม)
    App->>App: token ถูกต้อง (รู้ว่าคุณคือใคร)
    App->>App: แต่คุณไม่มีสิทธิ์ลบโพสต์คนอื่น (คีย์การ์ดเปิดห้องนี้ไม่ได้)
    App-->>U: 403 Forbidden
```

<mark class="hl-insight">สังเกตว่า request ที่สองผ่าน AuthN (บัตรพนักงานถูกต้อง ระบบรู้ว่าคุณคือใครจริงๆ) แต่ล้มเหลวที่ AuthZ (คีย์การ์ดไม่เปิดห้องนี้ให้ — คุณไม่มีสิทธิ์ทำสิ่งนี้) — สอง layer นี้แยกกันชัดเจนและต้องเช็คทั้งคู่เสมอ</mark>

## รูปแบบ Authorization ที่พบบ่อย

- **RBAC (Role-Based Access Control)** — กำหนดสิทธิ์ตาม "บทบาท" (admin, editor, viewer) เหมือนคีย์การ์ดสีต่างกันเปิดประตูคนละชุด ง่ายต่อการจัดการเมื่อมี user เยอะ
- **ABAC (Attribute-Based Access Control)** — กำหนดสิทธิ์ตาม attribute หลายอย่างร่วมกัน (เช่น "เข้าห้องนี้ได้เฉพาะพนักงานแผนกเดียวกัน และเฉพาะเวลาทำงาน") ยืดหยุ่นกว่าแต่ซับซ้อนกว่า

> คำถามสัมภาษณ์: "ทำไม 401 กับ 403 ต่างกัน" — **401 Unauthorized** จริงๆ หมายถึงยังไม่ผ่านด่านบัตรพนักงาน (ไม่รู้ว่าคุณเป็นใคร หรือบัตรหมดอายุ) ส่วน **403 Forbidden** หมายถึงผ่านด่านบัตรพนักงานแล้ว (รู้ว่าคุณเป็นใคร) แต่คีย์การ์ดไม่เปิดห้องนี้ให้ (ไม่มีสิทธิ์ทำสิ่งนี้)

## ขั้นสูง: ช่องโหว่ที่โจมตี AuthN/AuthZ จริงๆ

ต่อให้ระบบ AuthN/AuthZ ออกแบบถูกหลักการทุกอย่าง — ยังมีอีกชั้นที่ต้องป้องกัน: คนร้ายไม่ได้พยายาม "ผ่านด่านตามกฎ" แต่พยายาม **โกงด่าน** ไปเลย เหมือนไม่ได้ปลอมบัตรพนักงาน แต่หลอกพนักงานต้อนรับให้เปิดประตูให้ตรงๆ

**Brute-force login** — ลองรหัสผ่านทีละคำจนกว่าจะเจอ (เหมือนขโมยลองบิดหมุนตู้เซฟทีละเลข) <mark class="hl-warning">rate limit แบบ per-IP อย่างเดียว (โมดูล Reliability) ไม่พอ</mark> เพราะ botnet กระจาย request จากหลายพัน IP พร้อมกัน ต้องเพิ่ม rate limit **per-account** ด้วย (ล็อกบัญชีชั่วคราวหลังพยายาม login ผิดติดกันหลายครั้ง) และ backoff/CAPTCHA เพิ่มความหน่วงให้การลองสุ่มไม่คุ้มค่าคนร้าย

**OWASP-class attack vector อื่นๆ ที่เจาะระบบ auth โดยตรง:**

| การโจมตี | เจาะช่องโหว่ตรงไหน | ป้องกันยังไง |
|---|---|---|
| **SQL Injection** | ฝัง SQL ในช่อง username/password เพื่อ bypass query login ตรงๆ (เช่น `' OR '1'='1`) | ใช้ parameterized query/ORM เสมอ ไม่ต่อ string SQL เอง |
| **XSS (Cross-Site Scripting)** | ฝัง script ในหน้าเว็บที่ user อื่นเปิดดู เพื่อขโมย session token/cookie ไปสวมรอย | sanitize input ที่แสดงผล + ตั้ง cookie เป็น `HttpOnly` (JS อ่านไม่ได้) |
| **CSRF (Cross-Site Request Forgery)** | หลอกให้ user ที่ login อยู่แล้วกดปุ่ม/โหลดหน้าที่ยิง request อันตรายโดยไม่ตั้งใจ (browser แนบ session cookie ให้อัตโนมัติ) | ใช้ CSRF token เฉพาะ form/session + ตั้ง cookie เป็น `SameSite` |
| **SSRF (Server-Side Request Forgery)** | หลอกให้ server ยิง request แทนเรา ไปยัง endpoint ภายในที่ server เชื่อใจ (เช่น ผ่านฟีเจอร์ "ใส่ URL รูปโปรไฟล์") | validate/whitelist URL ปลายทางที่ server ยอมยิงให้ ไม่เชื่อ input จาก user ตรงๆ |

<mark class="hl-insight">auth logic ถูกต้อง 100% ไม่ได้แปลว่าระบบปลอดภัย — ถ้าชั้น input validation รั่ว คนร้ายไม่ต้อง "แฮ็ก" ระบบ auth เลย แค่เดินอ้อมมันไปทางอื่น</mark> นี่คือเหตุผลที่ security ต้องมองทั้ง stack ไม่ใช่แค่ authentication/authorization logic เพียวๆ
