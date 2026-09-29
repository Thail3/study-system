ลองนึกภาพสะพานข้ามแม่น้ำสายเดียวที่เป็นทางเข้าออกเมืองเพียงทางเดียว สะพานสร้างมาแปดปีก่อน ตอนนั้นวิศวกรออกแบบไว้รับรถได้ไม่กี่พันคันต่อวัน แต่ปีต่อปีเทศบาลก็ทยอยต่อเติม — เพิ่มเลนจักรยาน เสริมคานรับน้ำหนักรถบรรทุกโดยไม่มีการคำนวณโครงสร้างใหม่ทั้งระบบ ผู้รับเหมาแต่ละรายที่เข้ามาซ่อมก็แก้ไปตามที่เห็นหน้างาน ไม่มีใครเก็บพิมพ์เขียวที่อัปเดตล่าสุดไว้เลยสักฉบับ

วันนี้เทศบาลอยากขยายสะพานให้รับน้ำหนักรถไฟฟ้าขนส่งมวลชนสายใหม่ได้ แต่ไม่มีวิศวกรคนไหนกล้ายืนยันว่าเสาต้นไหนรับน้ำหนักเพิ่มได้จริงแค่ไหน เพราะพิมพ์เขียวเดิมหายไปนานแล้ว จะปิดสะพานเพื่อรื้อสร้างใหม่ทั้งหมดก็ทำไม่ได้ เพราะเป็นเส้นทางเดียวที่คนทั้งเมืองใช้เดินทางทุกวัน หยุดแม้แค่วันเดียวก็กระทบทั้งเมือง

ทางออกที่วิศวกรใช้จริงในสถานการณ์แบบนี้คือสร้างโครงสร้างใหม่ขนานไปกับสะพานเดิมทีละช่วง ทดสอบรับน้ำหนักให้มั่นใจ แล้วค่อยโยกการจราจรมาที่ช่วงใหม่ทีละเลน โดยสะพานเดิมยังใช้งานได้ตลอดเวลา จนวันหนึ่งไม่มีรถวิ่งบนโครงสร้างเก่าเหลือเลยถึงจะรื้อทิ้งได้อย่างปลอดภัย — นี่คือสถานการณ์เดียวกับที่ทีมวิศวกรรมซอฟต์แวร์ต้องเจอเวลาต้อง migrate <mark class="hl-term">**Legacy Monolith**</mark> ที่ไม่มีใครกล้าแตะ

โจทย์นี้คือโจทย์ที่ pillar อื่นในโมดูลนี้ยังไม่เคยพูดถึงตรงๆ — ไม่ใช่การออกแบบระบบใหม่ตั้งแต่ศูนย์ แต่เป็นการเปลี่ยนสถาปัตยกรรมของระบบที่รันอยู่จริงและหยุดไม่ได้ ซึ่งเป็นหัวใจของ **Evolutionary Architecture** (โมดูล 21)

## Requirement คร่าวๆ

- ระบบ inventory monolith อายุ 8 ปี ต้องให้บริการต่อเนื่อง 24/7 ห้ามหยุดระบบเพื่อ migrate เพราะคลังสินค้าใช้งานจริงตลอดเวลา
- โค้ดเดิมแทบไม่มี automated test coverage — แก้จุดเดียวไม่มีใครมั่นใจว่าจุดอื่นจะไม่พังตาม
- ส่วนต่างๆ ในระบบ coupling กันแน่นมาก (เช่น logic คำนวณราคาเรียก logic เช็คสต๊อกตรงๆ) จนไม่มีใครกล้าแก้
- ธุรกิจต้องการฟีเจอร์ใหม่ (multi-warehouse, real-time stock sync ข้ามสาขา) ที่สถาปัตยกรรมเดิมรองรับไม่ไหว
- ห้ามทำ big-bang rewrite เพราะความเสี่ยงสูงเกินกว่าที่ธุรกิจจะรับได้ — ถ้าระบบใหม่พังคือคลังสินค้าทั้งบริษัทหยุดทำงานพร้อมกัน

## รากปัญหา: ทำไม Monolith ถึงกลายเป็นระบบที่ไม่มีใครกล้าแตะ

ก่อนจะพูดถึงวิธีแก้ ต้องเข้าใจก่อนว่าทำไมระบบถึงมาถึงจุดนี้ — ไม่มีวันไหนที่ทีมตัดสินใจสร้างระบบที่ "แตะไม่ได้" ขึ้นมาตรงๆ ตามที่โมดูล 21 (Evolutionary Architecture & Anti-pattern) อธิบายไว้เรื่อง **Architecture Erosion** ปัญหานี้เกิดจากการสะสมของทางลัดเล็กๆ ทีละจุดตลอดแปดปี — deadline กระชั้นทำให้ทีมเขียน query ข้าม module ตรงถึง database ของอีก module, ฟีเจอร์เร่งด่วนทำให้ logic คำนวณราคาไปเรียกฟังก์ชันเช็คสต๊อกตรงๆ แทนที่จะผ่าน interface ที่ตั้งใจไว้ ทำซ้ำแบบนี้จนไม่มีใครจำ boundary เดิมได้อีกแล้ว

<mark class="hl-insight">จุดที่ทีมมักเข้าใจผิดคือคิดว่าปัญหานี้เกิดจากมี developer ที่ไม่มีวินัยอยู่ในทีม แต่จริงๆ แล้วมันคือผลลัพธ์ที่คาดเดาได้ของระบบที่ไม่มีการตรวจสอบ boundary อัตโนมัติ ปล่อยให้ทุกอย่างพึ่งความจำและวินัยของคนล้วนๆ</mark> เมื่อผสมกับการไม่มี test coverage เพียงพอ (โมดูล 21 หัวข้อ Common Anti-pattern เรียกอาการรวมๆ นี้ว่า **big ball of mud**) ทุกจุดในระบบเชื่อมกับทุกจุดจนแก้อะไรก็เสี่ยงพังจุดที่ไม่เกี่ยวข้องเลย นี่คือเหตุผลที่ไม่มีใครกล้าแตะระบบนี้อีกต่อไป

## กลยุทธ์ Migrate: ทำไมเลือก Strangler Fig แทน Big-bang Rewrite

จากโมดูล 13 (Architectural Styles & Patterns) เราเรียนมาแล้วว่า Monolith กับ Microservices ไม่มีฝั่งไหนถูกเสมอ ขึ้นอยู่กับ stage ของระบบ — แต่โจทย์ของทีมนี้ไม่ใช่แค่ "จะเลือก style ไหน" อีกต่อไป เป้าหมายปลายทางชัดเจนอยู่แล้วว่าต้องเป็นสถาปัตยกรรมที่แยก module ได้อิสระกว่าเดิม คำถามจริงคือ **จะย้ายจากจุด A ไปจุด B ได้อย่างไรโดยไม่หยุดระบบ**

ตัวเลือกแรกที่มักถูกเสนอคือ rewrite ทั้งระบบใหม่ตั้งแต่ต้น (big-bang) แต่สำหรับระบบที่ไม่มี test coverage และธุรกิจพึ่งพาอยู่ 24/7 ความเสี่ยงนี้ยอมรับไม่ได้ — ถ้า rewrite ผิดพลาดคือทั้งคลังสินค้าหยุดทำงานพร้อมกันในวันเปิดตัว ไม่มีทางย้อนกลับทีละส่วน

คำตอบที่โมดูล 21 (Evolutionary Architecture & Anti-pattern) เสนอไว้คือ <mark class="hl-term">**Strangler Fig Pattern**</mark> — วางชั้น facade/proxy ไว้หน้า monolith เดิม แล้วค่อย migrate ทีละ capability ออกมาเป็น service ใหม่ โดยระบบเดิมยังใช้งานได้ตลอดกระบวนการ <mark class="hl-insight">หัวใจของแนวทางนี้คือทำให้ทุกก้าวเล็กพอที่จะ rollback ได้ทันทีถ้าพัง แทนที่จะเดิมพันทั้งระบบไว้กับการเปลี่ยนแปลงครั้งเดียว</mark>

```mermaid
flowchart LR
    Client["Client / POS หน้าร้าน"] --> Facade["API Gateway (Facade)"]
    Facade -->|"route ที่ยังไม่ migrate"| Monolith["Legacy Inventory Monolith"]
    Facade -->|"route ที่ migrate แล้ว: Stock Lookup"| StockSvc["Stock Lookup Service (ใหม่)"]
    StockSvc -->|"อ่านข้อมูล sync ช่วงเปลี่ยนผ่าน"| Monolith
    Facade -.->|"ตัวถัดไปที่จะ migrate"| ReserveSvc["Inventory Reservation Service (แผนถัดไป)"]

    classDef legacy fill:#a8527a52,stroke:#a8527a,stroke-width:1.5px
    classDef modern fill:#3d6ea552,stroke:#3d6ea5,stroke-width:1.5px
    class Monolith legacy
    class StockSvc,ReserveSvc modern
```

## เลือก Capability แรก: ทำไมต้อง Stock Lookup

Strangler Fig บอกแค่ว่าให้ migrate ทีละชิ้น แต่ไม่ได้บอกว่าเริ่มจากชิ้นไหนก่อน หลักการเลือกคือ **ความเสี่ยงต่ำที่สุดและ boundary ชัดที่สุด** ไม่ใช่ฟีเจอร์ที่ธุรกิจอยากได้เร่งด่วนที่สุด เพราะเป้าหมายรอบแรกคือพิสูจน์ว่าแนวทางนี้ใช้ได้จริงกับระบบนี้ก่อน ทีมพิจารณาสาม capability: Stock Lookup (อ่านจำนวนสต๊อกคงเหลือ), Inventory Reservation (จองสต๊อกตอนมีคำสั่งซื้อ), และ Order Fulfillment (ตัดสต๊อกจริงตอนส่งของ)

| Capability | Read/Write | Coupling กับส่วนอื่น | ความเสี่ยงถ้าพัง | เลือกเป็นตัวแรกไหม |
|---|---|---|---|---|
| Stock Lookup | Read-only | ต่ำ — แค่ query จำนวนคงเหลือ ไม่แก้ state | ต่ำ — ข้อมูลแสดงคลาดเคลื่อนชั่วคราว ไม่กระทบเงินหรือสต๊อกจริง | ใช่ — เริ่มจากตัวนี้ |
| Inventory Reservation | Read + Write | สูง — ต้องกันสต๊อกไม่ให้ oversell ข้าม request พร้อมกัน | สูง — พังคือขายเกินสต๊อกจริง | ยังไม่ใช่ตอนนี้ |
| Order Fulfillment | Write หนัก | สูงมาก — ผูกกับ payment, shipping, accounting | สูงมาก — พังกระทบทั้ง supply chain | ทำท้ายสุด |

<mark class="hl-warning">ข้อผิดพลาดที่ทีมมักทำคือเลือก migrate capability ที่ธุรกิจอยากได้ก่อน (มักเป็น Inventory Reservation หรือ Order Fulfillment เพราะมีมูลค่าทางธุรกิจสูง) โดยลืมว่ามันคือจุดที่ coupling แน่นและความเสี่ยงสูงที่สุดพอดี ถ้าพังตั้งแต่รอบแรก ทีมจะเสียความเชื่อมั่นในแนวทาง strangler fig ทั้งหมดและมักถูกสั่งให้กลับไปทำ rewrite แบบเดิม</mark> Stock Lookup ชนะเพราะเป็น read-only ไม่มี side effect และมี boundary ชัดเจนอยู่แล้ว — migrate สำเร็จรอบแรกแล้วค่อยขยับไปที่ Inventory Reservation ต่อ

## คุม Coupling ไม่ให้ Erosion เกิดซ้ำด้วย Fitness Function

ถ้า migrate เสร็จแล้วปล่อยไว้เฉยๆ ระบบใหม่ก็เสี่ยงเดินซ้ำรอยเดิม — developer ที่รีบอาจแอบให้ Stock Lookup Service กลับไป query database ของ monolith ตรงๆ แทนที่จะผ่าน API ที่ตั้งใจแยกไว้ เหมือนที่เกิดขึ้นกับระบบเดิมมาแล้วแปดปี วิธีป้องกันตามโมดูล 21 (Evolutionary Architecture & Anti-pattern) คือเขียน <mark class="hl-term">**Fitness Function**</mark> ผูกเข้ากับ CI pipeline

ทีมตั้งกฎอัตโนมัติสองข้อ: (1) dependency check ด้วย dependency-cruiser ว่า Stock Lookup Service ห้าม import โค้ดจาก monolith โดยตรง ต้องคุยผ่าน API เท่านั้น และ (2) latency threshold ว่า p95 ของ endpoint stock lookup ต้องไม่เกิน 150ms ถ้า pull request ไหนละเมิดข้อใดข้อหนึ่ง build fail ทันทีก่อน merge

```demo
component: StepThroughDiagram
props: {"steps":[{"label":"1. วาง Facade หน้า Monolith","detail":"ตั้ง API Gateway ให้ route ทุก request ไปที่ legacy monolith เหมือนเดิม 100% ก่อน ยังไม่มีอะไรเปลี่ยนพฤติกรรมระบบในสายตาผู้ใช้"},{"label":"2. สร้าง Stock Lookup Service คู่ขนาน","detail":"เขียน service ใหม่ที่รองรับเฉพาะ query สต๊อกคงเหลือ (read-only) เลือกตัวนี้ก่อนเพราะ coupling ต่ำและพังแล้วไม่กระทบเงินหรือสต๊อกจริง"},{"label":"3. เพิ่ม Fitness Function ใน CI","detail":"ผูก dependency-cruiser เช็คว่า service ใหม่ห้าม import โค้ด monolith ตรง และเช็ค p95 latency ต้องไม่เกิน 150ms ถ้าละเมิด build fail ทันทีก่อน merge"},{"label":"4. เบี่ยง Route ทีละส่วน","detail":"เปลี่ยน facade ให้ route เฉพาะ stock lookup ไปที่ service ใหม่ ส่วนที่เหลือยังไปที่ monolith เหมือนเดิม ถ้าเจอปัญหา rollback แค่ route เดียวได้ทันที"},{"label":"5. ทำซ้ำกับ Capability ถัดไป","detail":"เมื่อ Stock Lookup เสถียรแล้ว ขยับไป migrate Inventory Reservation ด้วยแนวทางเดียวกัน จนวันหนึ่ง monolith เหลือแต่ route ที่ไม่มีใครเรียกแล้วถึงปลดระวางได้"}]}
```

## ใครเป็นเจ้าของอะไรระหว่าง Migrate

อีกจุดที่ต้องตัดสินใจคู่ขนานคือทีมไหนเป็นเจ้าของ Stock Lookup Service ใหม่ ตาม Team Topologies (โมดูล 20) การให้ทีมเดิมที่ดูแล monolith เป็นคนสร้าง service ใหม่ควบคู่กันมีข้อดีคือเข้าใจ business logic เดิมดีที่สุด แต่ต้องระวังไม่ให้ทีมนี้ยังคง mindset แบบ monolith เดิม (เช่น คุ้นเคยกับการ query database ข้าม module ตรงๆ) จนกลายเป็นคนทำลาย boundary ที่เพิ่งสร้างขึ้นเอง — fitness function ในหัวข้อก่อนหน้าจึงสำคัญกับกรณีนี้เป็นพิเศษ เพราะช่วยจับพฤติกรรมเดิมที่ทีมอาจทำโดยไม่รู้ตัว

## คำถามเจาะลึกที่มักถูกถามต่อ

พออธิบายแผน migrate จบ คนสัมภาษณ์หรือเพื่อนร่วมทีมมักไม่หยุดแค่ "ใช้ Strangler Fig" แต่จะถามต่อว่า "แล้วข้างในมันทำงานยังไง ถ้าพังจะย้อนกลับได้จริงไหม" สี่คำถามด้านล่างคือคำถามต่อยอดที่เจอบ่อยที่สุด แต่ละข้อไล่ให้ครบว่า ใช้ความรู้อะไรจากโมดูลไหน แก้ปัญหายังไง มีขั้นตอนอะไรบ้าง และข้างใต้จริงๆ มีอะไรทำงานอยู่

### Q1: Facade "เบี่ยง traffic" ยังไงกันแน่ และทำไมสลับ route หรือ rollback ได้ในไม่กี่วินาที

**ใช้ความรู้อะไร:** โมดูล 21 (Strangler Fig — facade คือจุดเดียวที่ตัดสินว่า request ไปเก่าหรือใหม่) บวกโมดูล 18 หัวข้อ ขั้นสูง: Service Mesh (canary และ weighted routing คือความสามารถแบบเดียวกัน แต่เคสนี้ทำที่ชั้น gateway หน้าระบบ) บวกหัวข้อ API Gateway ในโมดูล Microservices & API Design ของ System Design

**นึกภาพก่อน:** นึกถึงคนคุมคันโยกสับรางรถไฟ รางสองสายวางไว้ครบแล้ว (สายเก่าคือ monolith สายใหม่คือ Stock Lookup Service) คนคุมแค่ดูว่าขบวนนี้ตามกฎต้องไปสายไหนแล้วสับคันโยก ใช้เวลาเสี้ยววินาที ไม่ต้องรื้อรางใดเลย ถ้าสายใหม่มีปัญหาก็สับกลับได้ทันที facade ทำหน้าที่เดียวกัน: request คือขบวนรถ และกฎ routing คือตารางที่บอกว่าขบวนไหนไปสายไหน

**แก้ปัญหายังไง:** Facade ถือ <mark class="hl-term">**ตารางกฎ routing**</mark> (routing rules) ชุดหนึ่ง แต่ละกฎคือ "เงื่อนไขที่จับคู่ + ปลายทาง" เงื่อนไขที่ใช้ได้มีสี่แบบ เรียงจากปลอดภัยสุดไปกว้างสุด ซึ่งก็คือบันไดที่ใช้ปล่อยของจริงไล่ทีละขั้น:

1. **ตาม path** — `GET /stock/*` ไป service ใหม่ ส่วน path อื่นทั้งหมดไป monolith เหมือนเดิม นี่คือกฎพื้นฐานที่ขีดเส้นแบ่งว่า capability ไหนย้ายแล้ว
2. **ตาม header** — request ที่มี header พิเศษ (เช่น `X-Route-Stock: new`) ไปทางใหม่ ทีมพัฒนากับ QA ใช้ทดสอบบน production จริงได้ ส่วนผู้ใช้ทั่วไปยังไปทางเดิมโดยไม่รู้ตัว
3. **ตามกลุ่มผู้ใช้ (cohort)** — เช่นเฉพาะ POS ของคลังสาขานำร่องที่ความเสี่ยงต่ำก่อน
4. **ตามสัดส่วน (percentage)** — ค่อยๆ ไล่ 1%, 10%, 50%, 100%

<mark class="hl-insight">หัวใจคือ "การย้าย" ถูกลดเหลือแค่การแก้ตัวเลขหนึ่งตัวในไฟล์ config ไม่ใช่การ deploy โค้ดใหม่ ดังนั้น rollback ก็คือแก้ตัวเลขนั้นกลับ</mark>

```mermaid
flowchart LR
    Req["Request เข้า Facade"] --> R1{"path ตรงกับ stock ไหม"}
    R1 -->|"ไม่ตรง"| Mono["Legacy Monolith"]
    R1 -->|"ตรง"| R2{"มี header ทดสอบภายใน<br/>หรือ bucket อยู่ในสัดส่วนที่เปิดแล้วไหม"}
    R2 -->|"ใช่"| New["Stock Lookup Service (ใหม่)"]
    R2 -->|"ไม่ใช่"| Mono

    classDef legacy fill:#a8527a52,stroke:#a8527a,stroke-width:1.5px
    classDef modern fill:#3d6ea552,stroke:#3d6ea5,stroke-width:1.5px
    classDef decide fill:#6b5b9552,stroke:#6b5b95,stroke-width:1.5px
    class Mono legacy
    class New modern
    class R1,R2 decide
```

```demo
component: StepThroughDiagram
props: {"steps":[{"label":"1. เปิดเฉพาะ header (ทดสอบภายใน)","detail":"กฎบอกว่า path stock ไปทางใหม่เฉพาะ request ที่มี header ทดสอบ ผู้ใช้จริงทั้งหมดยังไปที่ monolith 100% ทีมได้ลองของจริงบน production โดยไม่มีลูกค้าคนไหนเสี่ยง"},{"label":"2. เปิดตาม cohort นำร่อง","detail":"เปิดให้ POS ของคลังสาขาเล็กสองสามแห่งก่อน ถ้า error rate หรือ latency ผิดปกติ แก้กฎกลับทีเดียวก็จบ กระทบแค่กลุ่มเล็กมาก"},{"label":"3. เปิดตามสัดส่วน 1% ถึง 50%","detail":"facade คำนวณ hash ของรหัสคลังแล้วเอาเศษหาร 100 ได้ bucket ตั้งแต่ 0 ถึง 99 ถ้า bucket น้อยกว่าสัดส่วนที่ตั้ง จึงไปทางใหม่ คนเดิมจึงได้ทางเดิมทุกครั้ง และตอนเพิ่มสัดส่วนกลุ่มเดิมยังอยู่ทางใหม่ต่อ"},{"label":"4. เปิดครบ 100% แต่ยังเก็บของเก่าไว้","detail":"ทุก request ของ path นี้ไปทางใหม่ แต่ monolith ยังรันและยังมีโค้ดเดิมอยู่ครบ กฎเดิมยังกู้กลับได้ทันทีตลอดช่วงสังเกตการณ์"},{"label":"5. Rollback: แก้ตัวเลขกลับแล้ว reload","detail":"แก้สัดส่วนเป็น 0 หรือ revert commit ของไฟล์กฎ gateway โหลดกฎใหม่โดย request ที่ค้างอยู่ทำต่อจนจบ ส่วน request ใหม่ไปที่ monolith ทันที ใช้เวลาระดับวินาที ไม่ใช่ระดับ deploy"}]}
```

**ข้างใต้ทำงานยังไง:** กฎ routing เก็บเป็นไฟล์ config ใน Git (เหมือนโค้ด มี pull request และ history ให้ย้อนดู) เมื่อแก้กฎ pipeline จะส่งกฎใหม่เข้า gateway ซึ่ง gateway ส่วนใหญ่โหลดกฎแบบ graceful คือ request ที่กำลังทำอยู่ทำต่อจนจบด้วยกฎเดิม ส่วน request ที่เข้ามาใหม่ใช้กฎใหม่ทันที จึงไม่ต้องตัดการเชื่อมต่อของใครและเร็วกว่าการ deploy โค้ดมาก

ส่วน percentage ไม่ได้ "สุ่มทีละ request" แต่ hash คีย์ที่คงที่ (เช่นรหัสคลังหรือ user id) ให้ได้ bucket ตายตัว เหตุผลคือสองระบบอาจตอบต่างกันเล็กน้อย (เช่นเลขสต๊อกที่ตามหลังอยู่ไม่กี่วินาที ดู Q2) ถ้าสุ่มทีละ request คนเดิมกดรีเฟรชจะเห็นเลขกระโดดไปมาระหว่างสองระบบ

**ถ้าพังหรือมีข้อควรระวังอะไร:**

- <mark class="hl-warning">Facade เองกลายเป็นจุดที่ล่มแล้วทั้งระบบล่ม (single point of failure) เพราะทุก request ต้องผ่านมัน</mark> ต้องรันหลายตัวหลัง load balancer และห้ามยัด business logic เข้าไปใน facade ไม่งั้นมันจะกลายเป็น monolith ก้อนใหม่ที่แตะไม่ได้เหมือนเดิม
- การ rollback ด้วยการสลับ route ปลอดภัยก็ต่อเมื่อ "ข้อมูลยังอยู่ที่เดียวกัน" Stock Lookup อ่านอย่างเดียวจึงสลับกลับได้ทันที แต่ capability ที่เขียนข้อมูลต้องคิดเรื่องข้อมูลที่ฝั่งใหม่เขียนไว้แล้วด้วย (ดู Q2)
- ถ้ามี cache อยู่หน้า facade คำตอบเก่าจะยังถูกเสิร์ฟจนกว่าจะหมดอายุ ทำให้การสลับ route ดูเหมือนไม่มีผลทันที และควรมี metric แยกตามปลายทาง (error rate และ latency ของเก่า เทียบกับของใหม่) เพื่อรู้ว่าต้อง rollback เมื่อไหร่

### Q2: Stock Lookup Service ใหม่ต้องใช้ข้อมูลสต๊อกที่ monolith เป็นเจ้าของ จะเอาข้อมูลมาได้ยังไง และทำไมห้ามใช้ dual write

**ใช้ความรู้อะไร:** โมดูล 15 (Bounded Context — service ใหม่ควรมี model และข้อมูลของตัวเอง ไม่ใช่แอบอ่านตารางของคนอื่น และหัวข้อ ขั้นสูง: Domain Events & Anti-Corruption Layer ข้าม Bounded Context อธิบายชั้นแปลไว้แล้ว) บวกโมดูล 19 (CQRS — Read Model คือสำเนาข้อมูลที่จัดรูปให้เหมาะกับการอ่าน) บวกหัวข้อ Replication ในโมดูล Database, Eventual Consistency ในโมดูล Consistency & CAP และ Stream Processing ในโมดูล Async & Messaging ของ System Design

**นึกภาพก่อน:** นึกถึงสมุดบัญชีเล่มหลักของร้าน ถ้าอยากมีสำเนาไว้อีกเล่ม มีสองวิธี วิธีแรกให้พนักงานจดลงสองเล่มด้วยมือทุกครั้ง (dual write) วันไหนจดเล่มแรกเสร็จแล้วถูกเรียกไปทำอย่างอื่น เล่มที่สองก็ตกหล่นโดยไม่มีใครรู้ วิธีที่สองคือตั้งเครื่องถ่ายเอกสารไว้ข้างสมุดเล่มหลัก ถ่ายทุกหน้าที่ถูกจดตามลำดับเดิมเป๊ะ (CDC) สำเนาอาจตามหลังอยู่บ้างแต่ไม่เคยผิดลำดับและไม่ต้องพึ่งความจำของพนักงานเลย ในแผนผังตอนต้นลูกศรจาก Stock Lookup Service กลับไปหา monolith ("อ่านข้อมูล sync ช่วงเปลี่ยนผ่าน") คือเรื่องนี้ และมันคือส่วนที่ยากที่สุดของการ migrate เพราะโค้ดย้ายง่ายกว่าข้อมูลมาก

**แก้ปัญหายังไง:** มีสี่ทางเลือก แต่ละทางแลกอะไรต่างกัน:

| ทางเลือก | ทำงานยังไง | ข้อดี | ข้อเสีย |
|---|---|---|---|
| เรียก API ของ monolith ทุกครั้ง | service ใหม่ยิง request ไปถาม monolith ทุกคำขอ lookup | ง่ายที่สุด ใช้เป็นก้าวแรกได้ | ไม่ได้ลดภาระ monolith และ service ใหม่ล่มตามของเก่า |
| อ่านจาก read replica ของ database monolith | ต่อตรงไปที่สำเนา (replica) ของ database เก่า | ทำเร็ว ไม่ต้องแก้โค้ด monolith | ผูกกับ schema ภายในที่ไม่มีใครเข้าใจครบ ซึ่งคือ coupling แบบเดียวกับที่ fitness function พยายามกัน จึงควรเป็นทางผ่านชั่วคราวที่บันทึกเป็น ADR |
| CDC (Change Data Capture) | อ่านการเปลี่ยนแปลงจาก transaction log ของ database แล้วส่งเป็น event ให้ service ใหม่สร้าง read model ของตัวเอง | ไม่ต้องแก้โค้ด monolith ไม่เพิ่ม query load บนตาราง ได้ทุกการเปลี่ยนแปลงตามลำดับ | ข้อมูลตามหลังอยู่บ้าง (eventual consistency) ต้องมี infra เพิ่ม |
| Dual write | ให้โค้ดเขียนทั้ง database เก่าและ store ใหม่ในคราวเดียว | ดูตรงไปตรงมา | ไม่ใช่ transaction เดียว จึงพังเงียบๆ ได้สองทาง (ดูด้านล่าง) และต้องแก้โค้ด monolith ที่ไม่มี test |

เคสนี้เลือก <mark class="hl-term">**CDC (Change Data Capture)**</mark> คือเครื่องมืออย่าง Debezium อ่าน transaction log ที่ database เขียนไว้อยู่แล้วสำหรับกู้คืนข้อมูลและทำ replication (เรียกว่า WAL ใน PostgreSQL และ binlog ใน MySQL) แปลงทุกการเปลี่ยนแปลงเป็น event ส่งเข้า message broker แล้วให้ service ใหม่นำไปสร้าง read model ของตัวเอง ตัวเลือกนี้เข้ากับ Stock Lookup เป็นพิเศษ เพราะเป็น capability อ่านอย่างเดียวที่ยอมให้ข้อมูลตามหลังได้ไม่กี่วินาที ต่างจาก Inventory Reservation ที่ต้องเช็คของจริงตอนจอง

```mermaid
flowchart TB
    subgraph Bad["Dual write: เขียนสองที่ในโค้ดเดียว (พัง)"]
        A1["Request A ตั้งสต๊อกเป็น 49"] --> DB1["Database เก่า<br/>ได้รับ A แล้ว B<br/>ผลสุดท้าย 48"]
        B1["Request B ตั้งสต๊อกเป็น 48"] --> DB1
        A1 --> DB2["Store ใหม่<br/>ได้รับ B แล้ว A<br/>ผลสุดท้าย 49"]
        B1 --> DB2
    end
    subgraph Good["CDC: อ่านจาก transaction log (แนะนำ)"]
        M["Monolith เขียน database เก่าที่เดียว"] --> L["Transaction log<br/>ลำดับเดียวที่ตัดสินแล้ว"]
        L --> C["CDC connector"]
        C --> K["Message broker<br/>แบ่งตาม SKU"]
        K --> X["ACL + Consumer"]
        X --> RM["Read Model ของ Stock Lookup Service"]
    end

    classDef bad fill:#a8527a52,stroke:#a8527a,stroke-width:1.5px
    classDef good fill:#3d6ea552,stroke:#3d6ea5,stroke-width:1.5px
    classDef flow fill:#6b5b9552,stroke:#6b5b95,stroke-width:1.5px
    class A1,B1,DB1,DB2 bad
    class M,L good
    class C,K,X,RM flow
```

```demo
component: ComparisonDiagram
props: {"left":{"title":"CDC จาก transaction log (ที่เคสนี้เลือก)","points":["ไม่ต้องแก้โค้ด monolith ที่ไม่มี test เลย","อ่านจาก log ที่ database เขียนอยู่แล้ว ไม่เพิ่ม query load บนตารางสต๊อก","ลำดับการเปลี่ยนแปลงต่อ SKU เดียวกันตรงกับต้นทางเสมอ","ข้อแลกคือ read model ตามหลังอยู่ไม่กี่วินาที ต้องวัดและแจ้งเตือน lag"]},"right":{"title":"Dual write เขียนสองที่ในโค้ดเดียว","points":["เขียนที่แรกสำเร็จ ที่สองล้ม สองฝั่งต่างกันโดยไม่มี error ให้ตามรอย","สอง request พร้อมกันอาจไปถึงสอง store คนละลำดับ ค่าสุดท้ายต่างกันถาวร","ไม่มีใครเป็นผู้ตัดสินลำดับที่แท้จริง เพราะไม่มี transaction คลุมทั้งสองที่","ต้องแก้โค้ด monolith ซึ่งคือส่วนที่ทีมไม่กล้าแตะที่สุด"]},"note":"จำง่ายๆ: ให้ต้นทางเขียนที่เดียว แล้วให้ข้อมูลไหลตามไปเป็น event ดีกว่าให้โค้ดเขียนหลายที่พร้อมกัน"}
```

**ข้างใต้ทำงานยังไง:** ลำดับที่เกิดขึ้นจริงมีห้าขั้น (1) ทำ **snapshot** คัดลอกข้อมูลสต๊อกทั้งหมดที่มีอยู่ตอนนี้ พร้อมจดตำแหน่งใน log ณ จุดนั้นไว้ (2) จากตำแหน่งนั้นเป็นต้นไป connector อ่านการเปลี่ยนแปลงทุกแถวใน log แล้วแปลงเป็น event ที่มีคีย์ (เช่น SKU) ค่าก่อนและหลัง และตำแหน่งใน log (3) message broker แบ่ง event ตามคีย์ ทำให้การเปลี่ยนแปลงของ SKU เดียวกันถูกประมวลผลตามลำดับเดิมเสมอ (4) ก่อนถึง read model มี <mark class="hl-term">**Anti-Corruption Layer (ACL)**</mark> แปลรูปตารางของ monolith ให้เป็นโมเดลสต๊อกของ service ใหม่ ไม่ปล่อยให้ชื่อคอลัมน์แปลกๆ รั่วเข้ามา (5) consumer อัปเดต read model แบบ upsert ตาม SKU และข้าม event ที่เก่ากว่าค่าที่เก็บอยู่ เพราะ broker ทั่วไปส่งแบบ at-least-once คือส่งซ้ำได้ การประมวลผลจึงต้อง idempotent (ทำซ้ำกี่รอบผลเท่าเดิม) <mark class="hl-insight">ส่วนที่ทำให้ CDC ปลอดภัยกว่า dual write คือมีผู้ตัดสินลำดับเพียงคนเดียว คือ log ของ database ต้นทาง ปลายทางแค่ตามอ่านตามลำดับนั้น</mark>

**ถ้าพังหรือมีข้อควรระวังอะไร:**

- <mark class="hl-warning">Dual write พังเงียบได้สองทาง คือเขียนสำเร็จแค่ที่เดียว และสอง request ไปถึงสอง store คนละลำดับ</mark> ทั้งสองแบบไม่มี error ใดๆ ปรากฏ ค่าของสองระบบแค่ค่อยๆ เพี้ยนกันไปโดยไม่มีใครรู้จนลูกค้าเห็นเลขสต๊อกผิด
- ต้องวัด **replication lag** (ช่วงห่างระหว่างเวลาที่ต้นทางเปลี่ยนกับเวลาที่ read model ได้ค่านั้น) แล้วตั้ง alert ถ้าเกินที่ธุรกิจรับได้ ไม่งั้นหน้า lookup จะโชว์ของที่หมดไปแล้วโดยไม่มีใครสังเกต
- ถ้า monolith เปลี่ยน schema, connector หรือ ACL อาจพัง จึงต้องให้ทีมเจ้าของ monolith รู้ว่ามี consumer ผูกอยู่ และถ้า consumer หยุดนานเกินกว่าที่ broker เก็บ event ไว้ ต้องทำ snapshot ใหม่ทั้งหมด

### Q3: Fitness Function ที่กัน coupling ย้อนกลับถูกต่อเข้า CI ยังไง ตรวจอะไรและอะไรทำให้ build fail ถ้าจำเป็นต้องยกเว้นจริงจะบันทึกยังไง

**ใช้ความรู้อะไร:** โมดูล 21 (Fitness Function แบบ static ที่ตรวจตอน build กับแบบ dynamic ที่วัดตอนรัน และ Architecture Erosion ที่แยก intentional debt ซึ่งบันทึกเป็น ADR ออกจาก erosion ที่ไม่มีใครรู้ตัว) บวกโมดูล CI/CD & GitOps ของ System Design (pipeline และด่านก่อน merge)

**นึกภาพก่อน:** นึกถึงด่านตรวจสัมภาระที่สนามบิน เครื่อง X-ray ตรวจของต้องห้ามในทุกกระเป๋าโดยไม่ต้องพึ่งความจำของเจ้าหน้าที่ ถ้าเจอก็ไม่ให้ผ่านประตู และถ้ามีเหตุจำเป็นต้องพกของที่ปกติห้าม (เช่นยาประจำตัว) ก็ต้องมีใบอนุญาตแนบที่ตรวจย้อนหลังได้ ไม่ใช่แค่ขอร้องให้เจ้าหน้าที่ปล่อยผ่าน

**แก้ปัญหายังไง:** สองกฎในเคสนี้เป็นคนละชนิด จึงต่อเข้า CI ต่างกัน

กฎที่ 1 (static) คือ dependency-cruiser ตรวจว่าโค้ดของ Stock Lookup Service ห้าม import โค้ดของ monolith ทีมเขียนกฎในไฟล์ config แล้วสั่งรันเป็นหนึ่ง step ใน pipeline:

```js
// .dependency-cruiser.js (ย่อ)
module.exports = {
  forbidden: [
    {
      name: 'stock-lookup-no-monolith-import',
      severity: 'error',
      from: { path: '^services/stock-lookup' },
      to: { path: '^legacy-monolith' }
    }
  ]
};
```

กฎที่ 2 (dynamic) คือ step ที่ deploy service ไปยัง environment ทดสอบชั่วคราว รัน load test ด้วยสคริปต์ชุดเดิมทุกครั้ง แล้ววัด **p95** (ค่าที่ 95% ของ request เร็วกว่า) เทียบกับเพดาน 150ms เครื่องมืออย่าง k6 มี threshold ในตัวและคืน exit code ที่ไม่ใช่ศูนย์เมื่อเกินเกณฑ์

<mark class="hl-insight">ทั้งสองกฎทำให้ build fail ด้วยกลไกเดียวกัน คือ step จบด้วย exit code ที่ไม่ใช่ศูนย์ แล้ว branch protection ที่ตั้งให้ check นี้เป็น "required" ก็ล็อกปุ่ม merge ไว้ ไม่มีใครต้องจำว่าต้องเช็ค</mark>

```mermaid
flowchart LR
    PR["Pull Request"] --> CI["CI Pipeline"]
    CI --> S["Static check<br/>dependency-cruiser"]
    CI --> D["Dynamic check<br/>p95 latency test"]
    S -->|"ไม่มี violation"| G{"Required check<br/>ผ่านครบไหม"}
    D -->|"p95 ไม่เกินเพดาน"| G
    S -->|"เจอ import ต้องห้าม"| F["Build fail<br/>merge ถูกล็อก"]
    D -->|"p95 เกินเพดาน"| F
    G -->|"ผ่านครบ"| OK["Merge เข้า main ได้"]

    classDef ok fill:#3d6ea552,stroke:#3d6ea5,stroke-width:1.5px
    classDef fail fill:#a8527a52,stroke:#a8527a,stroke-width:1.5px
    classDef step fill:#6b5b9552,stroke:#6b5b95,stroke-width:1.5px
    class OK ok
    class F fail
    class CI,S,D,G step
```

```demo
component: JourneyDiagram
props: {"nodes":[{"icon":"person","label":"Developer เปิด PR"},{"icon":"building","label":"CI Pipeline"},{"icon":"gate","label":"Merge Gate (required check)"},{"icon":"building","label":"main และ deploy"}],"travelerIcon":"envelope","steps":[{"activeNode":0,"caption":"Developer ที่รีบเพิ่ม import จากโค้ด monolith เข้าไปใน Stock Lookup Service แล้วเปิด pull request"},{"activeNode":1,"caption":"CI รัน dependency-cruiser สแกนทุกไฟล์ สร้างกราฟ import แล้วเทียบกับกฎ forbidden พบ import จาก services/stock-lookup ไปยัง legacy-monolith"},{"activeNode":1,"caption":"step นี้จบด้วย exit code ที่ไม่ใช่ศูนย์ job ทั้งก้อนถูกทำเครื่องหมายว่า fail พร้อมบอกไฟล์และบรรทัดที่ละเมิด"},{"activeNode":2,"caption":"Merge Gate เห็นว่า required check ไม่ผ่าน ปุ่ม merge ถูกล็อก Developer ต้องเปลี่ยนไปเรียกผ่าน API ตามที่ออกแบบไว้"},{"activeNode":3,"caption":"เมื่อแก้แล้วทุก check ผ่าน โค้ดจึงเข้า main และ deploy ต่อ coupling ต้องห้ามไม่เคยหลุดเข้ามาแม้แต่ครั้งเดียว"}]}
```

**ข้างใต้ทำงานยังไง:** dependency-cruiser ไม่ได้รันโปรแกรม แต่ **อ่านซอร์สโค้ดทุกไฟล์** แล้วสร้างกราฟที่แต่ละจุดคือไฟล์หรือ module และแต่ละเส้นคือ import จากนั้นไล่ทุกเส้นเทียบกับกฎใน `forbidden` ถ้าเส้นไหนตรงทั้งฝั่ง `from` และ `to` ถือเป็น violation ตามระดับ `severity` ที่ตั้งไว้ ถ้าเป็น `error` ตัวโปรแกรมจะจบด้วย exit code ที่ไม่ใช่ศูนย์ ฝั่ง latency ใช้หลักเดียวกันแต่วัดจากการรัน service จริงแล้วคำนวณ percentile จาก response time ที่เก็บได้ นอกจากนี้ไฟล์กฎเองควรมีเจ้าของกำกับ (เช่นกำหนดใน CODEOWNERS) เพื่อไม่ให้ใครแอบผ่อนกฎใน PR ธรรมดา

**ถ้าต้องยกเว้นจริงๆ:** ห้ามปิดกฎหรือลด severity ทั้งข้อ ให้เพิ่มข้อยกเว้นที่แคบที่สุด (เจาะจงไฟล์เดียวหรือตารางเดียว เช่นผ่านเงื่อนไข `pathNot` ในกฎ) พร้อม comment อ้างเลข ADR และวันหมดอายุ ผ่าน PR ที่เจ้าของสถาปัตยกรรมต้อง approve และมีเช็คเล็กๆ ที่ fail เมื่อเลยวันหมดอายุ เพื่อไม่ให้ข้อยกเว้นค้างกลายเป็น erosion แบบไม่มีใครรู้ ซึ่งคือแนวเดียวกับตัวอย่าง ADR-022 ในโมดูล 21 หัวข้อ Architecture Erosion

**ถ้าพังหรือมีข้อควรระวังอะไร:**

- <mark class="hl-warning">กฎแบบ import ตรวจได้เฉพาะ "โค้ดที่ import ตรง" ถ้า service ใหม่เปิด connection ไปที่ database ของ monolith ตรงๆ จะไม่มี import เลยและผ่านการเช็คทั้งที่ coupling อยู่ครบ</mark> ต้องมีอีกชั้นที่ระดับ infrastructure เช่นไม่ให้ credential หรือ network access ไปยัง database ของ monolith แก่ service ใหม่ตั้งแต่แรก
- latency test บน CI runner ที่ใช้ร่วมกันมีสัญญาณรบกวน อาจ fail ทั้งที่โค้ดไม่ผิด ควรรันหลายรอบและตั้งเพดานให้สมเหตุสมผลกับสถานะจริงก่อน ตามที่โมดูล 21 เตือนว่าถ้าเข้มเกินไปทีมจะเริ่มหาทาง bypass
- Fitness function ปกป้องได้เฉพาะสิ่งที่นิยามไว้แล้วเท่านั้น ยังต้องมีการ review สถาปัตยกรรมเป็นระยะสำหรับสิ่งที่วัดเป็นกฎไม่ได้

### Q4: ก่อนบอกว่า Stock Lookup "migrate เสร็จแล้ว" จะพิสูจน์ยังไงว่าระบบใหม่ตอบตรงกับระบบเก่า ในเมื่อระบบเก่าไม่มี test เลย

**ใช้ความรู้อะไร:** โมดูล 21 หัวข้อ ขั้นสูง: Branch by Abstraction & Parallel Run เมื่อ Strangler Fig ไม่พอ (อธิบาย Parallel Run ไว้แล้ว ข้อนี้ดูว่าเทคนิคเดียวกันไปต่อกับ facade ระดับ service ยังไง) บวกหัวข้อ Progressive Delivery ในโมดูล CI/CD & GitOps ของ System Design

**ปัญหาคืออะไร:** "เสร็จ" ไม่ได้แปลว่า service ใหม่ deploy ได้หรือ test ของมันผ่าน แต่แปลว่า <mark class="hl-insight">คำตอบตรงกับระบบเดิมบนข้อมูลจริงและ traffic จริง</mark> ปัญหาคือ monolith ไม่มี test coverage จึงไม่มีชุด test ให้ยึดเป็นมาตรฐาน สิ่งเดียวที่บอกได้ว่า "ถูก" หมายความว่าอะไรคือตัวระบบเก่าที่กำลังรันอยู่จริงนั่นเอง ดังนั้นวิธีพิสูจน์คือใช้มันเป็นเกณฑ์เทียบ

**แก้ปัญหายังไง:** ใช้ Parallel Run ที่ระดับ facade (เรียกอีกอย่างว่า shadow traffic) ทำเป็นขั้นๆ:

1. **Shadow** — facade ส่ง request จริงไป monolith และคืนคำตอบของ monolith ให้ผู้ใช้เหมือนเดิมทุกอย่าง พร้อมกันนั้นส่งสำเนาไปที่ service ใหม่แบบไม่รอคำตอบ (timeout สั้น) ผู้ใช้จึงไม่เคยเห็นผลของ service ใหม่
2. **เทียบ** — ทั้งสองฝั่ง log คำตอบคู่กับ request id เดียวกัน แล้วมี diff job จับคู่เทียบภายหลัง หลัง normalize ตัดสิ่งที่ต่างกันโดยธรรมชาติออกก่อน (เช่น timestamp, ลำดับ list)
3. **จำแนกความต่าง** — แยกเป็น "ตรงกัน", "ต่างเพราะข้อมูลยังตามหลังอยู่ไม่กี่วินาที (ดู Q2)" และ "ต่างจริง" ซึ่งต้องไล่หาว่าเป็น bug ฝั่งไหน
4. **ตั้งเกณฑ์ผ่านล่วงหน้า** — ตกลงกับธุรกิจก่อนเริ่มว่าความต่างจริงต้องต่ำกว่าเท่าไรและต้องรันนานแค่ไหน (เช่นครอบคลุมรอบธุรกิจเต็มอย่างวันนับสต๊อกสิ้นเดือน) ไม่ใช่มาตั้งเกณฑ์ทีหลังตอนเห็นผล
5. **ให้ของใหม่ตอบจริง** — เมื่อผ่านเกณฑ์ ไล่บันไดสัดส่วนจาก Q1 (1%, 10%, 50%, 100%) โดยเฝ้า error rate และ latency เทียบกับ fitness function ระหว่างทาง แล้วเก็บ route เก่าไว้ช่วงหนึ่งก่อนปลดระวาง

```mermaid
flowchart LR
    Req["Request จริงจาก POS"] --> F["Facade"]
    F --> Mono["Legacy Monolith"]
    F -.->|"สำเนา ไม่รอคำตอบ"| New["Stock Lookup Service (ใหม่)"]
    Mono -->|"คำตอบจริงที่ผู้ใช้เห็น"| Resp["Response"]
    Mono -.->|"log คำตอบ + request id"| Diff["Diff Job"]
    New -.->|"log คำตอบ + request id"| Diff
    Diff --> Cls["จำแนก: ตรงกัน / ตามหลังเพราะ lag / ต่างจริง"]

    classDef legacy fill:#a8527a52,stroke:#a8527a,stroke-width:1.5px
    classDef modern fill:#3d6ea552,stroke:#3d6ea5,stroke-width:1.5px
    classDef obs fill:#6b5b9552,stroke:#6b5b95,stroke-width:1.5px
    class Mono legacy
    class New modern
    class Diff,Cls obs
```

```demo
component: JourneyDiagram
props: {"nodes":[{"icon":"person","label":"POS หน้าร้าน"},{"icon":"gate","label":"Facade (mirror)"},{"icon":"building","label":"Legacy Monolith"},{"icon":"building","label":"Stock Lookup ใหม่"},{"icon":"notebook","label":"Diff Log"}],"travelerIcon":"envelope","steps":[{"activeNode":0,"caption":"POS ถามสต๊อกของ SKU-123 ตามปกติ request ถูกใส่ request id เพื่อใช้จับคู่ภายหลัง"},{"activeNode":1,"caption":"Facade ส่ง request ไป monolith ตามเดิม และส่งสำเนาไป service ใหม่พร้อม request id เดียวกัน โดยไม่รอคำตอบของสำเนา"},{"activeNode":2,"caption":"Monolith ตอบ facade คืนคำตอบนี้ให้ POS ผู้ใช้เห็นเฉพาะคำตอบของระบบเก่า"},{"activeNode":3,"caption":"Stock Lookup ใหม่ตอบสำเนาจาก read model ของตัวเอง คำตอบนี้ผู้ใช้ไม่เคยเห็น ถูกบันทึกไว้เฉยๆ"},{"activeNode":4,"caption":"Diff job จับคู่คำตอบสองฝั่งด้วย request id เทียบหลัง normalize แล้วจำแนกว่าตรงกัน ตามหลังเพราะ lag หรือต่างจริง"}]}
```

**ข้างใต้ทำงานยังไง:** gateway หลายตัวมีฟีเจอร์ request mirroring ในตัว (เช่น Envoy และ NGINX) ซึ่งส่งสำเนา request ไปยังอีก upstream โดยทิ้งคำตอบของสำเนาไป จึงเป็นเหตุผลที่ต้องให้ทั้งสองฝั่ง log คำตอบเองแล้วจับคู่ด้วย request id ทีหลัง (ทางหนึ่งที่ทำได้) ผลของการเทียบมักออกมาเป็นสัดส่วน เช่น "ต่างจริงกี่รายการต่อล้านคำขอ" ที่ติดตามเป็นกราฟรายวัน เกณฑ์ที่ตั้งไว้ล่วงหน้าเป็นตัวตัดสินว่าพร้อมสลับหรือยัง ไม่ใช่ความรู้สึกของทีม

**ถ้าพังหรือมีข้อควรระวังอะไร:**

- <mark class="hl-warning">วิธี shadow ปลอดภัยเพราะ Stock Lookup อ่านอย่างเดียวเท่านั้น</mark> ถ้าเอาไปใช้กับ Inventory Reservation ตรงๆ สำเนาจะไปจองสต๊อกซ้ำจริง จึงต้องมีโหมด dry-run หรือ sandbox ก่อนจึงจะ mirror capability ที่เขียนข้อมูลได้
- อย่าถือว่าระบบเก่า "ถูกเสมอ" พอเจอความต่างจริงต้องตัดสินทีละกลุ่มว่าเป็น bug ที่ต้องเก็บไว้ให้เหมือนเดิม (เพราะระบบอื่นพึ่งพาพฤติกรรมนั้นอยู่) หรือเป็น bug ที่ควรแก้ให้ถูกพร้อมแจ้งผู้ใช้ ซึ่งเป็นการตัดสินใจทางธุรกิจ ไม่ใช่แค่เรื่องเทคนิค
- ช่วงที่ทดสอบไม่ครอบคลุมเคสหายาก (เช่นสิ้นเดือน หรือช่วงลดราคา) diff เป็นศูนย์อาจแปลว่ายังไม่เจอ ไม่ใช่ว่าถูกทั้งหมด และการยอมให้ tolerance ของ lag กว้างเกินไปจะกลบความต่างจริงที่ควรเห็น
- Log ของสองฝั่งมีข้อมูลธุรกิจจริง ต้อง mask ข้อมูลอ่อนไหวและกำหนดอายุการเก็บให้สั้น ไม่งั้นระบบสังเกตการณ์กลายเป็นความเสี่ยงชั้นใหม่

## ADR ตัวอย่าง

> **Title:** Migrate Legacy Inventory Monolith ด้วย Strangler Fig เริ่มจาก Stock Lookup
> **Status:** Accepted
> **Context:** Inventory monolith อายุ 8 ปีไม่มี test coverage เพียงพอ และ coupling แน่นมากจนไม่มีใครกล้าแก้ ธุรกิจต้องการฟีเจอร์ multi-warehouse ที่สถาปัตยกรรมเดิมรองรับไม่ไหว แต่ระบบต้องรัน 24/7 ห้ามหยุดเพื่อ rewrite
> **Decision:** วาง API Gateway เป็น facade หน้า monolith เดิม แล้ว migrate ทีละ capability เริ่มจาก Stock Lookup (read-only, coupling ต่ำสุด) ก่อน พร้อมผูก fitness function เช็ค dependency และ latency ทุกครั้งที่ build เพื่อไม่ให้ service ใหม่กลับไปมี coupling แบบเดิม
> **Consequences:** ธุรกิจได้ฟีเจอร์ใหม่ทีละส่วนโดยไม่ต้องหยุดระบบ แต่ทีมต้องดูแล facade layer เพิ่มเติมและ monitor ทั้งฝั่งเก่ากับใหม่คู่ขนานกันระหว่างเปลี่ยนผ่าน และต้องเผื่อเวลาสำหรับ capability ถัดไป (Inventory Reservation, Order Fulfillment) ที่มี coupling และความเสี่ยงสูงกว่านี้มาก
