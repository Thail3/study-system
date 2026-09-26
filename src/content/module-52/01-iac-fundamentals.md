สั่งสร้างบ้านมีสองแบบ — แบบแรก: บอกช่างทีละคำสั่ง "ตั้งเสาต้นนี้ก่อน แล้วเทปูนพื้น แล้วก่อผนัง แล้วมุงหลังคา" ถ้าสั่งผิดลำดับหรือลืมขั้นตอนไหน บ้านออกมาผิดทันที — แบบที่สอง: ส่ง**พิมพ์เขียว**ให้ผู้รับเหมาไปเดียว บอกแค่ว่า **"อยากได้บ้าน 2 ชั้น 3 ห้องนอน หน้าตาแบบนี้"** ส่วนจะก่อสร้างลำดับไหน ผู้รับเหมาไปคิดเอง คุณสนใจแค่ผลลัพธ์สุดท้ายตรงพิมพ์เขียวหรือไม่

**Infrastructure as Code (IaC)** คือการเขียนพิมพ์เขียวของ infrastructure (server, network, database) เป็นไฟล์โค้ด แทนการเข้าไปคลิกสร้างเองทีละอันบน cloud console

## Imperative vs Declarative

```mermaid
flowchart TB
    subgraph IMP["Imperative: สั่งทีละคำสั่ง"]
        I1["1. สร้าง VM"] --> I2["2. ติดตั้ง package"] --> I3["3. เปิด firewall port"] --> I4["ผลลัพธ์ขึ้นกับ\nลำดับคำสั่งที่รัน"]
    end
    subgraph DEC["Declarative: บอกผลลัพธ์ที่ต้องการ"]
        D1["เขียนไฟล์บอกสภาพสุดท้าย:\nVM 1 ตัว + Package X + Port 443 เปิด"] --> D2["เครื่องมือ IaC\nไปคิดวิธีทำเอง"] --> D3["ผลลัพธ์ตรงตามไฟล์เสมอ\nไม่ว่าจะรันกี่ครั้ง"]
    end

    classDef imp fill:#a8527a52,stroke:#a8527a,stroke-width:1.5px
    classDef dec fill:#3d6ea552,stroke:#3d6ea5,stroke-width:1.5px
    class I1,I2,I3,I4 imp
    class D1,D2,D3 dec
```

<mark class="hl-term">**Declarative**</mark> คือสไตล์ IaC ที่ครองตลาดปัจจุบัน (Terraform, CloudFormation, Pulumi) — คุณเขียนแค่ **"สภาพสุดท้ายที่ต้องการ"** ไม่ใช่ขั้นตอนการไปให้ถึง เครื่องมือจะเทียบไฟล์กับสภาพจริงของ infrastructure ตอนนี้ แล้วคิดเองว่าต้องสร้าง/แก้/ลบอะไรถึงจะตรงกับที่เขียนไว้

<mark class="hl-insight">คุณสมบัติสำคัญที่ตามมาคือ <mark class="hl-term">**Idempotency**</mark> — รันไฟล์ config ซ้ำกี่ครั้งก็ได้ผลลัพธ์เดิมเสมอ ไม่สร้างของซ้ำ ต่างจาก imperative script ที่ถ้ารัน "สร้าง VM" ซ้ำสองครั้งอาจได้ VM สองตัวโดยไม่ตั้งใจ เพราะสคริปต์แค่ทำตามคำสั่งตรงๆไม่เคยเช็คว่ามีอยู่แล้วหรือยัง</mark>

## Plan → Apply: วงจรที่คล้าย Reconcile Loop

เคยเรียน Reconcile Loop ของ GitOps ไปแล้วในโมดูลนี้เอง (บทแรก) — IaC tool ทำงานคล้ายกันมาก แต่เทียบกับ**ทรัพยากร infrastructure** (VM, network, database) แทนที่จะเป็น container/app config

```mermaid
flowchart LR
    A["เขียน .tf config\n(desired state)"] --> B["plan: เทียบกับ\nสภาพจริงบน cloud"]
    B --> C["แสดง diff:\nจะสร้าง/แก้/ลบอะไร"]
    C --> D["คนรีวิว diff"]
    D --> E["apply: ทำให้\nสภาพจริงตรงกับไฟล์"]

    classDef step fill:#3d6ea552,stroke:#3d6ea5,stroke-width:1.5px
    class A,B,C,D,E step
```

<mark class="hl-warning">ต่างจาก GitOps reconcile loop ที่วนอัตโนมัติตลอดเวลาโดยไม่มีคนเข้ามาเกี่ยวข้อง IaC แบบดั้งเดิม (Terraform) มักมี**ขั้นตอน "review diff ก่อน apply"** เป็นด่านสำคัญ — เพราะการเปลี่ยนแปลง infrastructure บางอย่าง (เช่น ลบ database) ทำผิดแล้วกู้คืนไม่ได้ ต่างจากการ deploy app เวอร์ชันใหม่ที่ rollback ได้ง่ายกว่ามาก จึงยังต้องมีคนตรวจ diff ก่อนกดยืนยันเสมอ</mark>

## Drift: เมื่อมีคนคลิกแก้ตรง Cloud Console

```mermaid
sequenceDiagram
    participant Eng as วิศวกร
    participant Cloud as Cloud Console
    participant IaC as IaC State
    participant Real as Infrastructure จริง

    Eng->>Cloud: คลิกเปลี่ยนขนาด VM ตรงๆ (ไม่ผ่านไฟล์ .tf)
    Cloud->>Real: เปลี่ยนขนาด VM ทันที
    Note over IaC,Real: ไฟล์ .tf ยังบอกขนาดเดิม แต่ของจริงเปลี่ยนไปแล้ว
    Eng->>IaC: รัน plan รอบถัดไป
    IaC->>Real: เทียบไฟล์กับสภาพจริง
    Real-->>IaC: ขนาดไม่ตรงกับไฟล์ (Drift!)
    Note over Eng: ต้องเลือก: import ขนาดใหม่เข้าไฟล์ หรือ apply กลับเป็นขนาดเดิม
```

<mark class="hl-warning">การคลิกแก้ตรง cloud console แบบนี้เรียกว่า <mark class="hl-term">**ClickOps**</mark> — เป็นสาเหตุอันดับหนึ่งของ **drift** (สภาพจริงไม่ตรงกับไฟล์ IaC) ต่างจาก GitOps ที่ reconciler จะ revert ค่าที่แก้มือกลับอัตโนมัติ, IaC ทั่วไปจะแค่**แจ้งเตือนว่าไม่ตรง** ให้คนตัดสินใจเองว่าจะรับค่าใหม่เข้าไฟล์ (import) หรือจะบังคับกลับไปค่าเดิมในไฟล์ (apply) — ไม่มีฝั่งไหน "ถูกอัตโนมัติ" เพราะบางทีค่าที่แก้มือฉุกเฉินอาจเป็นค่าที่ควรเก็บไว้จริงๆ</mark>

## เทียบ Imperative vs Declarative

| มิติ | Imperative (script) | Declarative (IaC) |
|---|---|---|
| ต้องรู้ลำดับขั้นตอนไหม | ต้องรู้ ต้องเรียงคำสั่งให้ถูก | ไม่ต้อง บอกแค่ผลลัพธ์ |
| รันซ้ำได้ปลอดภัยไหม (Idempotent) | ไม่แน่นอน อาจสร้างซ้ำ | ได้เสมอ ผลลัพธ์เดิมทุกครั้ง |
| ตรวจ Drift ได้ไหม | ไม่มีกลไก ต้องเช็คเอง | มี (`plan` เทียบให้อัตโนมัติ) |
| ตัวอย่างเครื่องมือ | Bash script, AWS CLI ต่อคำสั่ง | Terraform, CloudFormation, Pulumi |

> คำถามสัมภาษณ์: "ทำไมทีมที่ใช้ Terraform ยังต้องมีขั้นตอน `plan` ให้คนอ่านก่อน ทั้งที่มันคือ declarative ที่ควรเชื่อถือได้อยู่แล้ว" — คำตอบที่ดีคือชี้ว่า declarative แก้ปัญหาแค่ "ต้องรู้ลำดับขั้นตอนไหม" กับ "รันซ้ำปลอดภัยไหม" แต่ไม่ได้แปลว่าการเปลี่ยนแปลงที่คำนวณได้จะปลอดภัยเสมอ (เช่น diff อาจบอกว่าจะ "ทำลายแล้วสร้าง database ใหม่" ซึ่งเสียข้อมูลถ้าไม่รู้ตัว) การอ่าน `plan` ก่อนคือด่านสุดท้ายที่จับความเปลี่ยนแปลงที่ไม่ได้ตั้งใจก่อนมันเกิดจริงบน production
