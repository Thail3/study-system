import { modules } from './modules'

export interface QuizQA {
  question: string
  answer: string
}

export interface QuizItem extends QuizQA {
  id: string
  moduleSlug: string
  moduleTitle: string
  topicId: string
  topicTitle: string
}

const RAW_QUIZZES: Record<string, QuizQA[]> = {
  'scalability:vertical-vs-horizontal': [
    {
      question: 'Scale Up (Vertical Scaling) คืออะไร ต่างจาก Scale Out ยังไง',
      answer:
        'Scale Up = เพิ่มกำลังเครื่องเดิม (CPU/RAM แรงขึ้น) ยังมีเครื่องเดียว. Scale Out = เพิ่มจำนวนเครื่อง แต่ละเครื่องขนาดเท่าเดิม',
    },
    {
      question: 'ทำไม Scale Up อย่างเดียวถึงมีปัญหาเรื่อง "single point of failure"',
      answer: 'เพราะมีจุดทำงานแค่จุดเดียว ถ้าเครื่องนั้นล่ม/เสีย ระบบทั้งหมดหยุดทำงานทันที ไม่มีตัวสำรอง',
    },
    {
      question: 'ระบบ production จริงมักเลือกกลยุทธ์ scale แบบไหน',
      answer: 'Scale up จนถึงจุดคุ้มค่า (เครื่องขนาดกลางๆ) แล้วค่อย scale out เพิ่มจำนวนเครื่องแบบนั้นซ้ำๆ ไม่ใช้แค่วิธีเดียวสุดโต่ง',
    },
  ],
  'scalability:load-balancer-basics': [
    {
      question: 'Load Balancer ทำหน้าที่หลัก 3 อย่างอะไรบ้าง',
      answer:
        '(1) กระจาย request ไปแต่ละ server ตาม algorithm (2) health check คอยเช็คว่า server ไหนยังตอบสนอง ตัดออกถ้าไม่ตอบ (3) SSL termination รับ HTTPS จาก client แล้วคุยกับ server ข้างในด้วย HTTP ธรรมดา',
    },
    {
      question: 'L4 กับ L7 Load Balancer ต่างกันยังไง',
      answer:
        'L4 (Transport Layer) มองแค่ IP+port (เร็ว ตัดสินใจหยาบ) ส่วน L7 (Application Layer) อ่านเนื้อหา HTTP จริง (path/header/cookie) ตัดสินใจฉลาดกว่าแต่ช้ากว่าเล็กน้อย แยกงานตาม path ได้',
    },
    {
      question: 'ทำไม Load Balancer เองก็กลายเป็น "จุดเดียวที่ทุกคนต้องผ่าน" (single point of failure ใหม่)',
      answer: 'เพราะทุก request ต้องผ่าน LB ก่อนเสมอ ถ้า LB เครื่องเดียวล่ม ทั้งระบบเข้าถึงไม่ได้ทั้งที่ server ข้างในปกติดี ต้องมี LB มากกว่า 1 เครื่อง',
    },
  ],
  'scalability:lb-algorithms': [
    {
      question: 'Round Robin กับ Least Connections ต่างกันยังไง เหมาะกับสถานการณ์ไหน',
      answer:
        'Round Robin ส่งวนตามลำดับเรื่อยๆ เหมาะถ้างานแต่ละอันหนักเท่ากัน. Least Connections ส่งไปเครื่องที่ active น้อยสุด เหมาะถ้างานหนักไม่เท่ากัน',
    },
    {
      question: 'Consistent Hashing ใช้ทำอะไร ทำไมสำคัญ',
      answer:
        'คำนวณ hash จากข้อมูลระบุตัวตน (เช่น user ID) ให้ชี้ไปเครื่องเดิมเสมอ เหมาะเมื่อต้องการให้ user คนเดิมกลับไปหาเครื่องเดิม (cache locality) ใช้หลักการเดียวกับ sharding',
    },
    {
      question: 'ก่อนเลือก algorithm ควรถามตัวเอง 2 คำถามอะไรบ้าง',
      answer: '(1) งานแต่ละอันหนักเท่ากันไหม (2) ต้องการให้ลูกค้าคนเดิมกลับไปหาเครื่องเดิมไหม',
    },
  ],
  'scalability:stateless-design': [
    {
      question: 'Server แบบ "stateful" คืออะไร มีปัญหายังไง',
      answer:
        'server ที่เก็บข้อมูล (session/cache/ไฟล์) ไว้ใน memory/disk ของตัวเองเท่านั้น ทำให้ request ต้องกลับไปหาเครื่องเดิมเสมอ (sticky session) ถ้าเครื่องนั้นล่ม ข้อมูลหายหมด',
    },
    {
      question: 'External Session Store (เช่น Redis) แก้ปัญหา stateful ยังไง',
      answer: 'ย้าย session ไปเก็บที่ทุก server เข้าถึงร่วมกันได้ ทำให้ server เครื่องไหนก็ตอบ request ได้เหมือนกันหมด ไม่ต้องผูกกับเครื่องใดเครื่องหนึ่ง',
    },
    {
      question: 'ทำไม stateless design ถึงเป็น "รากฐาน" ที่ scale out ต้องพึ่งพา',
      answer:
        'เพราะถ้าแต่ละเครื่องผูกกับข้อมูลของตัวเอง การมีหลายเครื่องก็ไม่มีประโยชน์ (ต้องกลับไปหาเครื่องเดิมเสมอ) ต้องทำให้ทุกเครื่องเข้าถึงข้อมูลชุดเดียวกันได้ก่อน scale out ถึงจะมีความหมายจริง',
    },
  ],
  'fundamentals:client-server-model': [
    {
      question: 'Client กับ Server ต่างกันยังไง แต่ละฝ่ายทำหน้าที่อะไร',
      answer:
        'Client คือฝั่ง "สั่ง" (ส่ง request) เช่น browser/มือถือ. Server คือฝั่ง "ทำ" (รอรับและตอบ request) เก็บข้อมูล/สูตรกลางให้ client หลายตัวเรียกใช้ร่วมกัน',
    },
    {
      question: 'ทำไมการมี server กลางถึงทำให้ client หลายตัวเห็นข้อมูลตรงกันได้ ทั้งที่ client ไม่ได้คุยกันตรงๆ เลย',
      answer: 'เพราะทุก client คุยกับ server เดียวกันเสมอ ข้อมูลอยู่ที่เดียว (server) ทุกคนสั่ง/อ่านจากแหล่งเดียวกัน ไม่ต้องให้ client คุยกันเอง',
    },
    {
      question: 'คำว่า Request กับ Response หมายถึงอะไร',
      answer: 'Request = สิ่งที่ client ส่งไปขอจาก server (ใบสั่ง). Response = สิ่งที่ server ส่งกลับมา (จานอาหาร/ผลลัพธ์)',
    },
  ],
  'fundamentals:dns-resolution': [
    {
      question: 'DNS Resolution คืออะไร แก้ปัญหาอะไร',
      answer: 'กระบวนการแปลงชื่อโดเมน (เช่น google.com) เป็น IP (Internet Protocol) address จริงที่เครื่องใช้เชื่อมต่อได้ เพราะคอมพิวเตอร์รู้แค่ชื่อ ไม่รู้ที่อยู่จริง',
    },
    {
      question: 'ทำไม DNS ถึงเร็วทั้งที่มีหลายขั้นตอน (root → TLD → authoritative)',
      answer: 'เพราะมีการ cache ผลลัพธ์ไว้ทุกขั้นตอน (ตาม TTL - Time To Live) ถ้าเคยถามชื่อนี้มาก่อน ไม่ต้องเดินครบทุกขั้นตอนซ้ำ',
    },
    {
      question: 'TTL สั้นกับยาว ต่างกันยังไง มีข้อดี-เสียยังไง',
      answer:
        'TTL (Time To Live) สั้น = รู้ IP (Internet Protocol) ใหม่เร็วขึ้นถ้าเปลี่ยนที่อยู่ แต่ต้องถามซ้ำบ่อยขึ้น (โหลดเยอะขึ้นที่ resolver). TTL ยาว = โหลดน้อยกว่าแต่รู้การเปลี่ยนแปลงช้ากว่า',
    },
  ],
  'fundamentals:http-lifecycle': [
    {
      question: 'เรียงลำดับขั้นตอนตั้งแต่พิมพ์ URL จนเห็นหน้าเว็บ มีอะไรบ้าง (คร่าวๆ)',
      answer:
        'DNS (Domain Name System) Resolution → TCP (Transmission Control Protocol) Handshake → TLS (Transport Layer Security) Handshake (ถ้า HTTPS) → ส่ง HTTP (HyperText Transfer Protocol) Request → Server ประมวลผล → ส่ง HTTP Response → Browser Render',
    },
    {
      question: 'HTTP status code กลุ่ม 4xx กับ 5xx ต่างกันยังไง',
      answer: '4xx = ฝั่ง client ผิด (เช่น ไม่ได้ login, request ผิดรูปแบบ). 5xx = ฝั่ง server มีปัญหา (เช่น ระบบล่ม)',
    },
    {
      question: 'ทำไม HTTP ถึงเรียกว่า stateless protocol',
      answer: 'เพราะแต่ละ request แยกกันเด็ดขาด server ไม่จำว่าเมื่อกี้คุยกับใคร ถ้าอยากให้จำต้องแนบ cookie/token ยืนยันตัวตนไปทุกครั้ง',
    },
  ],
  'fundamentals:tcp-vs-udp': [
    {
      question: 'TCP กับ UDP ต่างกันยังไง เลือกใช้ตอนไหน',
      answer:
        'TCP (Transmission Control Protocol) การันตีว่าข้อมูลถึงครบ/เรียงลำดับถูก (มี handshake ก่อนส่ง) ใช้กับเว็บไซต์/โอนไฟล์/โอนเงิน. UDP (User Datagram Protocol) ส่งเลยไม่รอยืนยัน เร็วกว่าแต่ข้อมูลอาจหายได้ ใช้กับ video call/เกม/DNS (Domain Name System)',
    },
    {
      question: 'TCP Handshake (SYN/SYN-ACK/ACK) ทำไปเพื่ออะไร',
      answer: 'เพื่อให้ทั้งสองฝั่งยืนยันว่าพร้อมรับ-ส่งข้อมูลกันก่อนเริ่มคุยจริง ป้องกันส่งข้อมูลไปแล้วอีกฝั่งไม่พร้อมรับ',
    },
    {
      question: 'ทำไม DNS ถึงเลือกใช้ UDP ทั้งที่ก็เป็นเรื่องสำคัญ',
      answer:
        'เพราะคำถาม-คำตอบสั้นมาก (รอบเดียวจบ) การเช็คก่อนส่งแบบ TCP จะช้ากว่าตัวข้อมูลจริงเสียอีก ถ้าหายก็แค่ถามใหม่ ต้นทุนต่ำกว่าการรับประกันทุกครั้ง',
    },
  ],
  'fundamentals:realtime-communication': [
    {
      question: 'ทำไม HTTP ปกติ (request-response) ถึงไม่พอสำหรับแอปแชท/notification แบบ real-time',
      answer:
        'เพราะ HTTP (HyperText Transfer Protocol) ปกติ client ต้องถามก่อนเสมอ server พูดเองไม่ได้ แอป real-time ต้องการให้ server "บอกทันที" เมื่อมีอะไรใหม่โดย client ไม่ต้องถามซ้ำ',
    },
    {
      question: 'Long Polling ต่างจาก Short Polling ยังไง',
      answer:
        'Short Polling ถามซ้ำเป็นรอบๆ ได้คำตอบทันทีแต่ส่วนใหญ่ไม่มีอะไรใหม่ (เสียเวลาเปล่า+ดีเลย์). Long Polling server ถ่วงคำตอบไว้จนมีข้อมูลใหม่จริงค่อยตอบ (ดีเลย์ต่ำกว่ามาก) แต่ server ต้องถือ connection ค้างจำนวนมาก',
    },
    {
      question: 'SSE กับ WebSocket ต่างกันตรงไหน',
      answer: 'SSE (Server-Sent Events) ส่งข้อมูลทางเดียว (server → client เท่านั้น). WebSocket ส่งได้สองทาง (client ↔ server พร้อมกัน) เหมาะกับแชทที่ต้องโต้ตอบกันตลอด',
    },
  ],
  'caching:why-cache': [
    {
      question: 'Cache คืออะไร แก้ปัญหาอะไร',
      answer: 'ที่เก็บผลลัพธ์ที่คำนวณ/ค้นหามาแล้วไว้หยิบใช้ซ้ำได้เร็ว แก้ปัญหาการ query database/คำนวณซ้ำๆ สำหรับคำถามเดิมที่ถูกถามบ่อย',
    },
    {
      question: 'ข้อมูลแบบไหนเหมาะกับการ cache ที่สุด (3 เกณฑ์)',
      answer: '(1) ถูกถามบ่อยกว่าที่เปลี่ยนแปลง (read-heavy) (2) คำนวณ/query ใช้เวลานาน (3) เก่าไปนิดหน่อยยังพอรับได้',
    },
    {
      question: 'Cache Hit กับ Cache Miss ต่างกันยังไง',
      answer: 'Hit = เจอข้อมูลที่จดไว้แล้ว หยิบตอบได้ทันที. Miss = ไม่มีข้อมูลจด ต้องไปคำนวณ/query ใหม่ (ช้ากว่า) แล้วค่อยจด cache ไว้',
    },
  ],
  'caching:cache-layers': [
    {
      question: 'เรียงลำดับ cache layer จากใกล้ user สุดไปไกลสุด มีอะไรบ้าง',
      answer: 'Browser Cache → CDN Cache → Server-side/In-memory Cache → Distributed Cache (Redis) → Database',
    },
    {
      question: 'ปัญหาของ Server-side In-memory Cache คืออะไร แก้ด้วยอะไร',
      answer: 'ไม่แชร์กับ server เครื่องอื่น (คล้าย sticky session) แก้ด้วย Distributed Cache (Redis) ที่ทุก server เข้าถึงร่วมกันได้',
    },
    {
      question: 'กฎง่ายๆ ในการเลือกว่า cache ที่ layer ไหนคืออะไร',
      answer: 'ยิ่ง cache อยู่ใกล้ user ยิ่งเร็ว แต่ยิ่งยาก sync ให้ตรงกันทุกที่ — ระบบใหญ่มักใช้หลายชั้นพร้อมกันตามประเภทข้อมูล',
    },
  ],
  'caching:eviction-policy': [
    {
      question: 'Eviction Policy คืออะไร ทำไมต้องมี',
      answer: 'กฎตัดสินใจว่าจะไล่ข้อมูลอะไรออกจาก cache เมื่อ cache เต็มแล้วมีของใหม่เข้ามา (เพราะ cache มีขนาดจำกัด)',
    },
    {
      question: 'LRU (Least Recently Used) ทำงานยังไง',
      answer: 'ทิ้งข้อมูลที่ไม่ถูกหยิบ/แตะต้องนานที่สุดออกก่อน โดยสมมติว่าถ้าไม่มีใครแตะมันนาน ก็มีโอกาสสูงว่าจะไม่มีใครอยากได้ในเร็วๆ นี้เช่นกัน',
    },
    {
      question: 'LRU กับ LFU ต่างกันยังไง',
      answer: 'LRU (Least Recently Used) ดูว่า "นานแค่ไหนที่ไม่ถูกแตะ". LFU (Least Frequently Used) ดูว่า "ถูกหยิบกี่ครั้ง" (ความถี่) ทิ้งตัวที่ถูกหยิบน้อยครั้งสุด ไม่สนว่าหยิบล่าสุดเมื่อไหร่',
    },
  ],
  'caching:cache-invalidation': [
    {
      question: 'Cache Invalidation คือปัญหาอะไร',
      answer: 'ข้อมูลจริงเปลี่ยนไปแล้ว แต่ cache ยังเก็บค่าเก่าอยู่ ทำให้ผู้ใช้เห็นข้อมูลที่ผิด/ล้าสมัยโดยไม่รู้ตัว',
    },
    {
      question: 'กลยุทธ์แก้ cache invalidation มี 3 แบบอะไรบ้าง',
      answer:
        '(1) TTL — ตั้งวันหมดอายุ (2) Write-through — อัปเดต cache ทันทีที่ข้อมูลจริงเปลี่ยน (3) Cache-aside invalidate — ลบ cache เก่าทิ้งเฉยๆ แล้วรอ miss ครั้งถัดไปค่อยโหลดใหม่',
    },
    {
      question: 'ทำไม TTL ยังสำคัญแม้จะมี explicit invalidate อยู่แล้ว',
      answer:
        'เป็นเซฟตี้เน็ต เผื่อมีจุดไหนที่ลืม invalidate (ระบบใหญ่มี cache หลายจุด อาจตกหล่นบางจุด) TTL ทำให้ข้อมูลผิดไม่ค้างอยู่ตลอดไป',
    },
  ],
  'database:sql-vs-nosql': [
    {
      question: 'SQL กับ NoSQL ต่างกันยังไง เลือกใช้ตอนไหน',
      answer:
        'SQL มี schema ตายตัว เชื่อมโยงข้ามตารางได้ดี (JOIN), ACID เข้มงวด เหมาะข้อมูลที่มีความสัมพันธ์ซับซ้อน. NoSQL ยืดหยุ่นเรื่อง schema, scale แนวนอนง่ายกว่า เหมาะข้อมูลที่ไม่ต้องเชื่อมโยงกันเยอะ เขียนถี่มาก',
    },
    {
      question: 'Polyglot Persistence คืออะไร',
      answer: 'การใช้ทั้ง SQL และ NoSQL พร้อมกันในระบบเดียว ตามความเหมาะสมของแต่ละส่วนข้อมูล (เช่น order/payment ใช้ SQL, log/chat history ใช้ NoSQL)',
    },
    {
      question: 'ข้อมูลแบบไหนเหมาะกับ SQL ข้อมูลแบบไหนเหมาะกับ NoSQL',
      answer:
        'SQL เหมาะข้อมูลที่ต้องเชื่อมโยงกันแน่นหนา (e-commerce: user-order-product). NoSQL เหมาะข้อมูลที่เขียนถี่ ไม่ต้องเชื่อมกับอะไร (log, chat, IoT sensor data)',
    },
  ],
  'database:indexing': [
    {
      question: 'Database Index คืออะไร แก้ปัญหาอะไร',
      answer: 'โครงสร้างเสริมที่บอกว่า "ข้อมูลที่ต้องการอยู่ตรงไหน" โดยไม่ต้องไล่อ่านทั้งตาราง (full table scan) ทำให้ query เร็วขึ้นมาก',
    },
    {
      question: 'Index มี trade-off อะไรบ้าง (ไม่ใช่ของฟรี)',
      answer: 'เขียน (insert/update/delete) ช้าลงเพราะต้องอัปเดต index ด้วย, กิน storage เพิ่ม, ควรเลือก index เฉพาะ column ที่ query บ่อยไม่ใช่ทุก column',
    },
    {
      question: 'Composite Index คืออะไร ใช้ตอนไหน',
      answer:
        'Index ที่รวมหลาย column เข้าด้วยกัน เหมาะเมื่อ query กรองด้วยหลาย column พร้อมกันบ่อยๆ (เช่น WHERE country=\'TH\' AND status=\'active\') มักเร็วกว่าทำ index แยกทีละ column',
    },
  ],
  'database:replication': [
    {
      question: 'Replication คืออะไร แก้ปัญหาอะไร',
      answer: 'การทำสำเนาข้อมูลไว้หลายเครื่อง (Primary-Replica) แก้ปัญหา single point of failure และรับคนอ่านพร้อมกันได้จำกัดของ database เครื่องเดียว',
    },
    {
      question: 'Replication Lag คืออะไร',
      answer: 'ช่วงเวลาที่ Replica ยังไม่ทันอัปเดตข้อมูลใหม่ตาม Primary ทำให้อ่านจาก Replica อาจได้ข้อมูลที่ยังไม่สดล่าสุด',
    },
    {
      question: 'ทำไม Primary-Replica ถึงยัง "เขียนไม่ scale"',
      answer:
        'เพราะการเขียนทำได้ที่ Primary เครื่องเดียวเท่านั้น (ป้องกันข้อมูลขัดแย้งกันถ้าแก้พร้อมกันหลายที่) มีแค่การอ่านเท่านั้นที่กระจายไป Replica ได้',
    },
  ],
  'database:sharding': [
    {
      question: 'Sharding ต่างจาก Replication ยังไง',
      answer: 'Replication คือสำเนาข้อมูลเดียวกันไว้หลายที่ (แก้ปัญหาอ่าน/ทนล่ม). Sharding คือแบ่งข้อมูลคนละส่วนไปหลายที่ (แก้ปัญหาข้อมูล/เขียนเกินความจุเครื่องเดียว)',
    },
    {
      question: 'Range-based กับ Hash-based sharding key ต่างกันยังไง มีข้อเสียอะไร',
      answer:
        'Range-based (แบ่งตามช่วง) ง่ายแต่เสี่ยง shard ใดหนึ่งแน่นเกินไป. Hash-based กระจายสม่ำเสมอกว่าแต่เพิ่ม/ลด shard ทีหลังยุ่งยาก (ต้องย้ายข้อมูลเกือบทั้งหมด แก้ด้วย consistent hashing)',
    },
    {
      question: 'ทำไม query ข้าม shard (เช่น JOIN ข้าม shard) ถึงทำยาก/ช้า',
      answer:
        'เพราะต้องไปค้นทุก shard แล้วรวมผลลัพธ์เอง ไม่มีการเชื่อมโยงข้ามเครื่องแบบ JOIN ปกติ ควรเลือก sharding key ที่ query ส่วนใหญ่กรองด้วย key นั้นอยู่แล้ว',
    },
  ],
  'database:consensus-leader-election': [
    {
      question: 'Split-Brain คืออะไร เกิดขึ้นได้ยังไง',
      answer:
        'สถานการณ์ที่มี Primary/Leader มากกว่า 1 ตัวรับ write พร้อมกัน (เพราะแต่ละ replica ตัดสินใจเองว่าควรเป็น Primary โดยไม่มีกติกาป้องกัน) ทำให้ข้อมูลขัดแย้งกัน',
    },
    {
      question: 'ทำไมต้องได้ "เสียงข้างมาก (majority/quorum)" ถึงเป็น leader ได้',
      answer:
        'เพราะในกลุ่มเดียวกัน จะมีคนได้เสียงเกินครึ่งพร้อมกันได้แค่คนเดียวเท่านั้น (ทางคณิตศาสตร์) ทำให้ป้องกัน split-brain ได้จริง ไม่ใช่แค่หวังว่าจะไม่ชนกัน',
    },
    {
      question: 'ทำไมเมื่อเสียงไม่ถึงข้างมาก ระบบถึง "หยุดรับ write" แทนที่จะฝืนเลือก leader',
      answer:
        'เพราะเลือกยอม unavailable (หยุดชั่วคราว) แทนที่จะเสี่ยง inconsistent (split-brain) — สอดคล้องกับ CAP theorem ที่เลือก Consistency เหนือ Availability ตอนเครือข่ายมีปัญหา',
    },
  ],
  'consistency-cap:cap-theorem': [
    {
      question: 'CAP ย่อมาจากอะไร แต่ละตัวหมายถึงอะไร',
      answer: 'C=Consistency (ทุกที่เห็นข้อมูลตรงกันเป๊ะ), A=Availability (ต้องได้รับบริการเสมอ ไม่ปฏิเสธ), P=Partition Tolerance (ทำงานต่อได้แม้สายเชื่อมขาด)',
    },
    {
      question: 'ทำไมในทางปฏิบัติเลือกได้แค่ C หรือ A (ไม่ใช่เลือกได้ทั้ง 3)',
      answer: 'เพราะ P (สายขาด) เกิดขึ้นได้เสมอในระบบจริง จึงต้องมี P เสมอ ทำให้คำถามจริงเหลือแค่ "ตอนสายขาด จะเลือก C หรือ A"',
    },
    {
      question: 'ระบบธนาคารกับระบบ social media feed มักเอียงไปทาง CAP แบบไหน ทำไม',
      answer: 'ธนาคารเอียงไป CP (ยอดผิดอันตรายกว่าให้บริการช้า). social media feed เอียงไป AP (เห็น like ช้านิดหน่อยไม่เป็นไร แต่แอปต้องใช้งานได้ตลอด)',
    },
  ],
  'consistency-cap:pacelc': [
    {
      question: 'PACELC ต่างจาก CAP theorem ยังไง',
      answer: 'CAP พูดแค่ตอน "สายขาด" (P) ว่าเลือก A หรือ C. PACELC เพิ่มส่วน ELC พูดถึง "ตอนสายปกติ" ว่าเลือก Latency หรือ Consistency ด้วย',
    },
    {
      question: 'ทำไมส่วน ELC (ตอนปกติ) ถึงสำคัญกว่าที่คิด',
      answer:
        'เพราะสายขาดเป็นเหตุการณ์นานๆ เกิดที แต่ทุก request ตอนระบบปกติต้องเจอ trade-off latency-vs-consistency นี้อยู่ตลอด (บ่อยกว่าตอนสายขาดมาก)',
    },
    {
      question: 'DynamoDB กับ MongoDB (ค่าเริ่มต้น) เลือกฝั่งไหนใน ELC',
      answer: 'DynamoDB เลือก L (Latency, เน้นเร็ว). MongoDB (default) เลือก C (Consistency, เน้นตรง)',
    },
  ],
  'consistency-cap:consistency-models': [
    {
      question: 'Strong Consistency กับ Eventual Consistency ต่างกันยังไง',
      answer:
        'Strong = อ่านค่าล่าสุดเสมอ ทุก node ตรงกัน 100% ทันที (ต้องรอ sync ก่อนตอบ). Eventual = ตอบทันทีจาก node ใดก็ได้ (อาจยังไม่ใช่ค่าล่าสุด) แต่ข้อมูลจะตรงกันในที่สุด',
    },
    {
      question: 'Inconsistency Window คืออะไร',
      answer: 'ช่วงเวลาที่บาง node รู้ข้อมูลใหม่แล้ว แต่บาง node ยังไม่รู้ (ในระบบ eventual consistency) ระบบที่ดีพยายามทำให้ window นี้สั้นที่สุด',
    },
    {
      question: 'Read-Your-Own-Writes คืออะไร แก้ปัญหาอะไร',
      answer:
        'การรับประกันว่าคนที่เพิ่งเขียนข้อมูลเอง ต้องเห็นข้อมูลของตัวเองทันที (แม้คนอื่นจะยังไม่เห็นก็ตาม) เป็นทางสายกลางระหว่าง strong กับ eventual consistency',
    },
  ],
  'async-messaging:why-async': [
    {
      question: 'Synchronous กับ Asynchronous request ต่างกันยังไง',
      answer:
        'Synchronous = client ส่ง request แล้วรอจนกว่า server ทำเสร็จถึงได้ response กลับ. Asynchronous = server ตอบทันทีว่า "รับเรื่องแล้ว" (job ID) แล้วไปทำงานเบื้องหลัง แจ้งผลทีหลัง',
    },
    {
      question: 'ทำไม synchronous ถึงมีปัญหากับงานหนัก (เช่น encode วิดีโอ)',
      answer:
        'Client (โดยเฉพาะ browser) มัก timeout ถ้ารอนานเกินไป ทั้งที่งานจริงยังทำอยู่ แถม server เครื่องนั้นก็ถูกกั๊กไว้ทำงานเดียว รับ request อื่นไม่ได้เต็มที่',
    },
    {
      question: 'เมื่อไหร่ควรใช้ async pattern',
      answer: 'งานใช้เวลานาน (วินาทีขึ้นไป) ที่ client ไม่จำเป็นต้องรอผลทันที, อยากแยกคนส่งงานออกจากคนทำงาน, หรือต้องการรับงานเข้าคิวไว้ก่อนช่วงพีค',
    },
  ],
  'async-messaging:message-queue': [
    {
      question: 'Message Queue ทำหน้าที่อะไร ช่วยเรื่อง scale ยังไง',
      answer: 'เป็นบัฟเฟอร์ระหว่าง producer กับ consumer ทำให้ทั้งสองฝั่งไม่ต้องเร็วเท่ากัน — เพิ่ม consumer (worker) ได้ถ้างานเยอะเกิน โดย producer ไม่ต้องรอ',
    },
    {
      question: 'At-least-once delivery คืออะไร ทำไมงานผ่าน queue ควรเป็น idempotent',
      answer:
        'At-least-once = ถ้า consumer ทำงานเสร็จแต่ตายก่อนกด ACK, queue จะส่งงานนั้นซ้ำให้ consumer อื่นทำใหม่ (อาจทำงานซ้ำได้) งานจึงควรออกแบบให้ทำซ้ำแล้วผลลัพธ์เหมือนเดิม (idempotent) ไม่งั้นทำซ้ำจะพัง',
    },
    {
      question: 'ทำไม queue ถึงทำให้ producer/consumer ไม่ต้อง "ตายพร้อมกัน" (ทนต่อความล้มเหลว)',
      answer: 'เพราะงานถูกเก็บไว้ในคิวจริง ไม่ได้อยู่ใน memory ของใครคนเดียว ถ้า consumer หนึ่งล่ม งานยังรออยู่ในคิว ให้ consumer ตัวอื่นมาทำต่อได้',
    },
  ],
  'async-messaging:pub-sub': [
    {
      question: 'Pub/Sub ต่างจาก Message Queue ยังไง',
      answer:
        'Message Queue: 1 งานถูก consumer คนใดคนหนึ่งหยิบไปทำแล้วหายจากคิว (คนอื่นไม่เห็นอีก). Pub/Sub: 1 ประกาศถูกส่งไปหาทุก subscriber ที่ฟังอยู่พร้อมกัน แต่ละคนทำงานอิสระ',
    },
    {
      question: 'ทำไม Pub/Sub ถึงลด coupling ระหว่าง service ได้ดี',
      answer:
        'เพราะ publisher แค่ประกาศเหตุการณ์ ไม่ต้องรู้จัก/สนใจว่าใครฟังอยู่บ้าง ระบบใหม่ที่สนใจแค่ subscribe topic เดิม ไม่ต้องแก้โค้ดฝั่งประกาศเลย',
    },
    {
      question: 'ตัวอย่างการใช้ Pub/Sub เช่น "user.registered" มีประโยชน์ยังไงเทียบกับเรียกทุกระบบตรงๆ ในโค้ดเดียว',
      answer:
        'ถ้าเรียกตรงๆ โค้ดจะพันกันยุ่งเหยิงและเพิ่มระบบใหม่ต้องแก้จุดเดิมซ้ำ. Pub/Sub ให้แต่ละระบบ (email, analytics, settings) subscribe topic เดียวกันแยกอิสระ ไม่กระทบกัน',
    },
  ],
  'async-messaging:event-driven': [
    {
      question: 'Event-Driven Architecture (EDA) คืออะไร ต่างจากสั่งงานตรงๆ (request-driven) ยังไง',
      answer:
        'EDA (Event-Driven Architecture) คือให้ service สื่อสารกันผ่านการ "ประกาศเหตุการณ์" (ใช้ Pub/Sub) แทนที่จะเรียกกันตรงๆ — ลด tight coupling ที่เกิดจากการสั่งงานตรงๆ ที่ต้องรู้จักทุก service ปลายทาง',
    },
    {
      question: 'ข้อดีหลักของ EDA คืออะไรบ้าง',
      answer: 'Decoupling (เพิ่ม/ลบ service ได้โดยไม่แก้ตัวประกาศ), Resilience (service ล่มชั่วคราวไม่บล็อกทั้งระบบ), Scalability (แต่ละ service scale อิสระ)',
    },
    {
      question: 'ข้อเสีย/สิ่งที่ต้องแลกของ EDA มีอะไรบ้าง',
      answer: 'Debug ยากขึ้น (flow กระจายหลาย service ต้องมี distributed tracing ช่วย), เกิด eventual consistency โดยธรรมชาติ, ต้องคิดเรื่อง event ordering/duplicate',
    },
  ],
  'microservices-api:monolith-vs-microservices': [
    {
      question: 'Monolith กับ Microservices ต่างกันยังไง',
      answer:
        'Monolith = โค้ดทั้งหมดอยู่ codebase เดียว deploy พร้อมกัน เรียกฟังก์ชันตรงๆ ในโปรเซสเดียว. Microservices = แต่ละ service แยก codebase deploy อิสระ เรียกกันผ่าน network มี latency เพิ่ม',
    },
    {
      question: 'สัญญาณอะไรบ้างที่บอกว่าถึงเวลาแตกเป็น microservices จริงๆ',
      answer: 'deploy ช้าลงเรื่อยๆ (ทีมรอคิวกัน), เปลี่ยนโค้ดจุดหนึ่งกระทบจุดอื่นโดยไม่คาดคิด, หรือบาง feature ต้องการ scale ต่างจากส่วนอื่นมาก',
    },
    {
      question: 'ต้นทุนที่มองไม่เห็นทันทีของการแตกเป็น microservices มีอะไรบ้าง',
      answer: 'network latency ระหว่าง service, partial failure (บาง service ล่มแต่อื่นยังทำงาน), distributed transaction ยากกว่าเดิม, operational overhead ต้องดูแลหลาย service พร้อมกัน',
    },
  ],
  'microservices-api:rest-vs-grpc': [
    {
      question: 'REST กับ gRPC ต่างกันยังไง เหมาะกับอะไร',
      answer:
        'REST (Representational State Transfer) ใช้ HTTP verb ปกติ + JSON อ่านง่าย เหมาะกับ public API/client ภายนอก. gRPC (gRPC Remote Procedure Call) ใช้ Protocol Buffers (binary) เร็วกว่ามาก รองรับ streaming เหมาะกับการสื่อสารระหว่าง service ภายในองค์กรเอง',
    },
    {
      question: 'ทำไม gRPC ถึงเร็วกว่า REST/JSON',
      answer: 'เพราะใช้ binary format ที่กำหนด schema ล่วงหน้า (ผ่าน .proto) ไม่ต้องเขียนชื่อ field ซ้ำๆ ทุกครั้งแบบ JSON ทำให้ payload เล็กกว่ามาก',
    },
    {
      question: 'ทำไม public API ถึงมักเลือก REST มากกว่า gRPC',
      answer: 'เพราะ REST อ่านง่าย/debug ง่าย เครื่องมือรองรับกว้างขวาง ไม่ต้องให้ client ภายนอกมารู้จัก schema/รหัสลับล่วงหน้าเหมือน gRPC',
    },
  ],
  'microservices-api:api-gateway': [
    {
      question: 'API Gateway ทำหน้าที่อะไร แก้ปัญหาอะไร',
      answer:
        'เป็นประตูเดียวที่ client คุยด้วย แทนที่จะต้องรู้จัก/เรียกทุก microservice แยกกันเอง — ทำ routing, authentication รวมศูนย์, rate limiting, aggregation, logging ให้',
    },
    {
      question: 'ทำไม API Gateway ต้องมีมากกว่า 1 เครื่อง',
      answer:
        'เพราะ Gateway กลายเป็น "จุดเดียวที่ทุกคนต้องผ่าน" เหมือน Load Balancer เดี่ยว — ถ้ามีเครื่องเดียวแล้วล่ม ทั้งระบบเข้าถึงไม่ได้ทั้งที่ service ข้างในปกติดี',
    },
    {
      question: 'Authentication รวมศูนย์ที่ Gateway ช่วยอะไร',
      answer: 'ตรวจ token ที่ Gateway ครั้งเดียว ไม่ต้องให้ทุก service ข้างในตรวจซ้ำเอง ลด logic ซ้ำซ้อนกระจายอยู่ทุก service',
    },
  ],
  'microservices-api:service-discovery': [
    {
      question: 'Service Discovery แก้ปัญหาอะไร',
      answer: 'แก้ปัญหา IP ของแต่ละ service instance เปลี่ยนตลอดเวลา (scale in/out, container ถูกสร้าง/ทำลาย) ทำให้ hardcode IP ไว้ไม่ได้',
    },
    {
      question: 'Instance ใหม่ต้องทำอะไรบ้างเมื่อบูตขึ้นมา (lifecycle คร่าวๆ)',
      answer: 'ลงทะเบียนตัวเองกับ Registry บอกว่า "ฉันคือ service X เบอร์ Y" แล้วส่ง heartbeat เป็นระยะเพื่อบอกว่ายัง healthy อยู่',
    },
    {
      question: 'Server-side discovery กับ Client-side discovery ต่างกันยังไง',
      answer:
        'Server-side: client/gateway เปิด Registry เช็คทุกครั้งที่ต้องเรียก. Client-side: client ขอสำเนารายชื่อทั้งหมดมาเก็บเอง แล้วเลือกเองว่าจะเรียกใคร (ลด load ที่ Registry แต่ client ต้องฉลาดขึ้น)',
    },
  ],
  'microservices-api:distributed-transactions-saga': [
    {
      question: 'ทำไม microservices ถึงใช้ database transaction แบบเดียวกับ monolith ไม่ได้อีกต่อไป',
      answer:
        'เพราะแต่ละ service มี database ของตัวเอง ไม่มี transaction เดียวที่ครอบคลุมหลาย database ได้ (ต่างจาก monolith ที่มี BEGIN...COMMIT/ROLLBACK ครอบคลุมทุกตารางใน DB เดียว)',
    },
    {
      question: 'Saga Pattern คืออะไร',
      answer:
        'ชุดของ local transaction เล็กๆ ต่อกันเป็นทอด แต่ละขั้นมีแผนยกเลิก (compensating transaction) เตรียมไว้ ถ้าขั้นไหนล้มเหลว ให้ไล่ยกเลิกขั้นก่อนหน้าย้อนกลับตามลำดับ',
    },
    {
      question: 'Choreography กับ Orchestration (สองแบบของ Saga) ต่างกันยังไง',
      answer:
        'Choreography = แต่ละ service ฟัง event เองและตัดสินใจเอง ไม่มีศูนย์กลาง. Orchestration = มี Saga Orchestrator ตัวเดียวที่รู้ทั้งลำดับขั้นตอนและแผนยกเลิก คอยสั่งการแต่ละ service ตรงๆ',
    },
  ],
  'reliability:rate-limiting': [
    {
      question: 'Rate Limiting คืออะไร แก้ปัญหาอะไร',
      answer: 'จำกัดจำนวน request ที่รับได้ต่อช่วงเวลา ป้องกัน client (ตั้งใจหรือบั๊ก) ยิง request รัวจนระบบล่มไปกระทบ user คนอื่น',
    },
    {
      question: 'Token Bucket ทำงานยังไง',
      answer: 'มีบัตร/token เติมเองอัตโนมัติด้วยอัตราคงที่ ถือได้สูงสุด N ใบ ทุก request ต้องใช้ 1 token ถ้าหมดก็ปฏิเสธ (429) จนกว่าจะเติมกลับ',
    },
    {
      question: 'ทำไม fixed window (จำกัด N request/วินาทีตรงๆ) ถึงมีปัญหา boundary spike',
      answer:
        'เพราะสามารถยิง N request ตอนปลาย window หนึ่ง แล้วยิงอีก N ตอนต้น window ถัดไปทันที รวมเป็น 2N request ในช่วงเวลาสั้นๆ คร่อมขอบ window ได้ — token bucket ลดปัญหานี้ได้ดีกว่า',
    },
  ],
  'reliability:circuit-breaker': [
    {
      question: 'Circuit Breaker มี 3 สถานะอะไรบ้าง ทำงานยังไง',
      answer:
        'Closed (ปกติ ปล่อย request ผ่าน นับความล้มเหลว) → Open (ล้มเหลวเกิน threshold ปฏิเสธทันทีไม่เรียก downstream) → Half-Open (ครบเวลาแล้ว ลองปล่อย request ทดสอบ 1 ตัว) → กลับ Closed ถ้าสำเร็จ หรือกลับ Open ถ้าล้มเหลว',
    },
    {
      question: 'ทำไมต้อง "ตัดไฟทันที" (Open) แทนที่จะรอ timeout ปกติ',
      answer:
        'เพราะถ้าไม่ตัด request จะรอจน timeout นาน (เช่น 30 วิ) กิน thread/connection ของ service ต้นทางจนหมด (thread pool exhaustion) ทำให้ service ต้นทางล่มตามทั้งที่ปัญหาจริงอยู่ที่ downstream',
    },
    {
      question: 'Half-Open state มีไว้ทำไม',
      answer: 'เพื่อทดสอบว่า downstream ฟื้นตัวหรือยัง โดยปล่อย request ทดสอบแค่ 1 ตัว ไม่ใช่ปล่อยทุก request กลับเข้าไปทันที (ป้องกันซ้ำรอยเดิมถ้ายังไม่ฟื้นจริง)',
    },
  ],
  'reliability:retry-backoff': [
    {
      question: 'Exponential Backoff คืออะไร',
      answer: 'การเพิ่มเวลารอเป็นเท่าตัวทุกครั้งที่ retry ล้มเหลว (เช่น 1, 2, 4, 8 วินาที) แทนที่จะ retry ถี่ๆ ทันที ให้เวลา server ฟื้นตัวมากขึ้นเรื่อยๆ',
    },
    {
      question: 'Thundering Herd คืออะไร เกิดขึ้นได้ยังไง',
      answer: 'เหตุการณ์ที่ client จำนวนมาก retry พร้อมกันทันทีหลัง service เพิ่งฟื้นจาก downtime ทำให้ service ล่มซ้ำอีกรอบเพราะโดนถล่มพร้อมกัน',
    },
    {
      question: 'Jitter มีไว้ทำไม',
      answer:
        'สุ่มเวลาบวกลบเล็กน้อยในแต่ละ retry เพื่อกระจายเวลา retry ของ client แต่ละตัวให้ไม่ตรงกันเป๊ะ ลดโอกาส thundering herd ที่อาจเกิดแม้ใช้ exponential backoff แล้วก็ตาม',
    },
  ],
  'reliability:failover-redundancy': [
    {
      question: 'Redundancy กับ Failover ต่างกันยังไง (แต่เกี่ยวข้องกัน)',
      answer: 'Redundancy = การมีของสำรอง (ไม่มีจุดไหนมีแค่ 1 ชุด). Failover = กระบวนการสลับไปใช้ของสำรองเมื่อของหลักเสีย',
    },
    {
      question: 'Active-Passive กับ Active-Active ต่างกันยังไง',
      answer:
        'Active-Passive = standby รอเฉยๆ ไม่ถูกใช้จนกว่า primary จะเสีย (ง่ายกว่าแต่ทรัพยากรเสียเปล่า). Active-Active = ทุกชุดรับภาระพร้อมกันตลอดเวลา (คุ้มทรัพยากรกว่าแต่ต้อง stateless และรองรับ concurrent ได้)',
    },
    {
      question: 'ทำไมไม่มีระบบไหน "0% downtime" จริง แล้วเป้าหมายจริงคืออะไร',
      answer:
        'เพราะไม่มีระบบไหนไม่มี downtime เลยจริงๆ เป้าหมายจริงคือลดโอกาสและความเสียหายให้ต่ำที่สุดเท่าที่งบประมาณ/ความสำคัญของระบบสมเหตุสมผล (วัดเป็น "9 กี่ตัว")',
    },
  ],
  'reliability:observability': [
    {
      question: '3 เสาหลักของ Observability คืออะไร แต่ละอย่างตอบคำถามอะไร',
      answer: 'Log (เกิดอะไรขึ้นเป๊ะๆ ตรงนี้), Metric (ภาพรวมตอนนี้ปกติไหม), Trace (ช้า/พังตรงไหนใน chain ที่ request วิ่งผ่าน)',
    },
    {
      question: 'ทำไม Log อย่างเดียวไม่พอสำหรับระบบ microservices ที่มี service เยอะ',
      answer:
        'เพราะ 1 request อาจวิ่งผ่านหลาย service กว่าจะเสร็จ ต้องไล่เปิด log ทีละ service ถึงจะรู้ว่าช้า/พังตรงไหน — Distributed Tracing ช่วยเห็นภาพรวมทั้ง chain ได้ทันทีโดยไม่ต้องเดา',
    },
    {
      question: 'ลำดับการสืบสวนปัญหาทั่วไปเป็นยังไง (Metric → Trace → Log)',
      answer: 'Metric บอกว่ามีปัญหา (เช่น error rate พุ่ง) → Trace บอกว่าปัญหาอยู่ตรงไหนใน chain → Log บอกรายละเอียดว่าเกิดอะไรขึ้นเป๊ะๆ ที่จุดนั้น',
    },
  ],
  'reliability:idempotency': [
    {
      question: 'Idempotent หมายถึงอะไร (นิยามง่ายๆ)',
      answer: 'ทำซ้ำกี่ครั้ง ผลลัพธ์สุดท้ายเหมือนเดิม (เช่น กดปุ่มเรียกลิฟต์ที่ไฟติดอยู่แล้ว ไม่เรียกลิฟต์คันใหม่)',
    },
    {
      question: 'HTTP Method ไหนที่ไม่ idempotent โดยธรรมชาติ ทำไมถึงอันตราย',
      answer: 'POST — เพราะสร้างของใหม่ทุกครั้งที่เรียก (เช่น "สร้าง order") ถ้า retry โดยไม่มีกลไกป้องกัน จะสร้างซ้ำ/หักเงินซ้ำได้',
    },
    {
      question: 'Idempotency Key ทำงานยังไง',
      answer:
        'Client สร้าง key เฉพาะของ "ความตั้งใจ" นั้นครั้งเดียว แนบไปกับ request ทุกครั้ง (รวมตอน retry) — Server เช็คว่าเคยเห็น key นี้ไหม ถ้าเคยแล้ว ไม่ทำงานซ้ำ แค่ส่งผลลัพธ์เดิมกลับไป',
    },
  ],
  'reliability:deployment-strategies': [
    {
      question: 'ทำไม Big Bang deployment (deploy ทีเดียวทั้งหมด) ถึงเสี่ยงที่สุด',
      answer: 'เพราะถ้า v2 มีบั๊ก user 100% โดนกระทบพร้อมกันทันที และ rollback ก็ต้อง deploy กลับทั้งหมดอีกรอบ (ช้า)',
    },
    {
      question: 'Blue-Green Deployment ทำงานยังไง ข้อดีคืออะไร',
      answer:
        'Deploy v2 ไปสภาพแวดล้อมแยกต่างหาก (Green) ทดสอบให้มั่นใจก่อน แล้วสลับ Load Balancer ให้ traffic ไป Green ทีเดียว — rollback เร็วมากเพราะ Blue (v1) ยังอยู่ครบไม่ได้ถูกแตะเลย',
    },
    {
      question: 'Canary Deployment ต่างจาก Rolling Deployment ยังไง',
      answer:
        'Canary จงใจปล่อยทีละเปอร์เซ็นต์เล็กๆ ก่อน แล้วหยุดดู metric (error rate) ก่อนขยายสัดส่วนเพิ่ม ถ้าผิดปกติ rollback กระทบแค่กลุ่มเล็ก. Rolling แค่ทยอยเปลี่ยน instance ไม่ได้เน้นหยุดดู metric ก่อนขยายเป็นขั้นๆ แบบ canary',
    },
  ],
  'storage-at-scale:object-storage': [
    {
      question: 'ทำไมไม่ควรเก็บไฟล์ใหญ่ (รูป/วิดีโอ) ไว้ใน Database โดยตรง',
      answer:
        'เพราะทำให้ backup ช้าลง, replication หนักขึ้น, database โตเกินความจำเป็น — ควรเก็บไฟล์จริงที่ Object Storage แล้วเก็บแค่ URL ไว้ใน database แทน',
    },
    {
      question: 'Object Storage ต่างจาก file system ทั่วไปยังไง',
      answer: 'ไม่มีโครงสร้างโฟลเดอร์จริงๆ ทุก object มี key แบนราบ (เช่น users/123/avatar.png), เข้าถึงผ่าน HTTP API (upload/download) ไม่ใช่เดินเข้าไปหยิบเองแบบ file system ปกติ',
    },
    {
      question: 'Object Storage เหมาะกับข้อมูลแบบไหน',
      answer: 'ไฟล์ก้อนใหญ่ (blob) ที่ไม่มีโครงสร้างภายในต้อง query เช่น รูปภาพ วิดีโอ เอกสาร — scale เก็บได้แทบไม่จำกัด กระจายหลายเครื่อง/region',
    },
  ],
  'storage-at-scale:cdn': [
    {
      question: 'CDN แก้ปัญหาอะไร',
      answer: 'ปัญหา user ที่อยู่ห่างไกลจาก origin server ต้องรอ request วิ่งข้ามทวีป — CDN เปิด "สาขา" (edge server) กระจายใกล้ user ทั่วโลก',
    },
    {
      question: 'Cache Hit กับ Cache Miss ใน CDN หมายถึงอะไร',
      answer: 'Miss = ครั้งแรกที่มีคนขอไฟล์จากภูมิภาคนั้น edge server ต้องไปเบิกจาก origin ก่อน (ช้า). Hit = คนถัดไปในภูมิภาคเดียวกันขอไฟล์เดียวกัน ได้จาก edge ทันที (เร็ว)',
    },
    {
      question: 'เนื้อหาแบบไหนเหมาะกับ CDN ไม่เหมาะกับอะไร',
      answer:
        'เหมาะกับ static content ที่เหมือนกันทุกคน ไม่เปลี่ยนบ่อย (รูป วิดีโอ CSS JS). ไม่เหมาะกับข้อมูล personalize เฉพาะคน (เช่น dashboard ส่วนตัว) เพราะแต่ละคนต้องการของต่างกัน',
    },
  ],
  'storage-at-scale:search-index': [
    {
      question: 'Inverted Index คืออะไร ต่างจาก index ปกติ (B-Tree) ยังไง',
      answer:
        'Inverted Index เก็บ "คำ" เป็นตัวหลัก แล้วชี้กลับไปว่าเอกสารไหนมีคำนั้นบ้าง (word → docs) ต่างจาก B-Tree index ที่หาค่าที่ตรงกันเป๊ะ ไม่ช่วยเรื่อง "มีคำนี้อยู่ตรงไหนก็ได้ในข้อความยาวๆ"',
    },
    {
      question: "ทำไม SQL LIKE '%คำ%' ถึงช้ามากกับข้อมูลจำนวนมาก",
      answer: 'เพราะต้องไล่อ่านทุกแถวทุกครั้งที่ query (full scan) ไม่มี index ช่วยได้เลยสำหรับการค้นแบบ "มีคำนี้อยู่ตรงไหนในข้อความก็ได้"',
    },
    {
      question: 'ทำไมระบบใหญ่มักแยก search engine (เช่น Elasticsearch) ออกจาก database หลัก',
      answer: 'เพราะ database หลักดูแล consistency เป็นหลัก ส่วน search engine optimize สำหรับ full-text search โดยเฉพาะ (ranking, tokenization, typo tolerance) แยกความรับผิดชอบกันชัดเจน',
    },
  ],
  'security-basics:authn-vs-authz': [
    {
      question: 'Authentication (AuthN) กับ Authorization (AuthZ) ต่างกันยังไง',
      answer: 'AuthN (Authentication) ตอบคำถาม "คุณเป็นใคร" (พิสูจน์ตัวตน เช่น login). AuthZ (Authorization) ตอบคำถาม "คุณเข้าถึงสิ่งนี้ได้ไหม" (ตรวจสิทธิ์)',
    },
    {
      question: 'ทำไม 401 กับ 403 ถึงต่างกัน',
      answer: '401 Unauthorized = ยังไม่ผ่านด่าน AuthN (Authentication) (ไม่รู้ว่าคุณเป็นใคร/token หมดอายุ). 403 Forbidden = ผ่าน AuthN แล้ว (รู้ว่าคุณเป็นใคร) แต่ไม่มีสิทธิ์ทำสิ่งนี้ (ผ่าน AuthZ - Authorization - ไม่ได้)',
    },
    {
      question: 'RBAC คืออะไร',
      answer: 'Role-Based Access Control — กำหนดสิทธิ์ตาม "บทบาท" (admin, editor, viewer) แทนที่จะกำหนดสิทธิ์ทีละคน ง่ายต่อการจัดการเมื่อมี user เยอะ',
    },
  ],
  'security-basics:oauth-flow': [
    {
      question: 'OAuth 2.0 แก้ปัญหาอะไร ("Login with Google")',
      answer: 'ทำให้แอปยืนยันตัวตนผ่าน Google ได้โดยที่ password ของผู้ใช้ไม่เคยผ่านมือแอปเลย ผู้ใช้กรอก password ที่หน้า Google เท่านั้น',
    },
    {
      question: 'Authorization Code กับ Access Token ต่างกันยังไงในขั้นตอน OAuth',
      answer:
        'Authorization Code เป็น "ใบเบิก" ชั่วคราวที่ Google ส่งกลับมาให้แอปก่อน. แอปต้องเอา code นี้ไปแลกเป็น Access Token จริง (พร้อม client secret) ถึงจะใช้เรียก API ได้',
    },
    {
      question: 'JWT (JSON Web Token) เชื่อมโยงกับ stateless design ยังไง',
      answer:
        'JWT (JSON Web Token) เก็บข้อมูลผู้ใช้ไว้ในตัว token เอง (encode+sign) server ตรวจสอบแค่ signature ก็รู้ว่าถูกต้องไหม โดยไม่ต้องเก็บ session state หรือถามที่ไหนเพิ่ม — ทำให้ server เป็น stateless ได้เต็มที่',
    },
  ],
  'security-basics:encryption': [
    {
      question: 'Encryption in Transit กับ Encryption at Rest ต่างกันยังไง',
      answer:
        'In Transit = เข้ารหัสข้อมูลตอนเดินทาง (TLS/HTTPS) ป้องกันคนดักฟังระหว่างทาง. At Rest = เข้ารหัสข้อมูลตอนเก็บนิ่งอยู่ใน disk/database ป้องกันคนขโมย harddisk/backup ไปอ่านตรงๆ',
    },
    {
      question: 'ทำไม Password ไม่ควรเก็บด้วย Encryption แต่ควรใช้ Hashing',
      answer:
        'Encryption ถอดกลับได้ถ้ามี key (เหมือนตู้เซฟเปิดได้). Hashing ถอดกลับเป็นข้อมูลเดิมไม่ได้เลยแม้แต่เจ้าของระบบเอง — ถ้า database หลุดไป คนร้ายได้แค่ hash ที่ reverse กลับเป็น password จริงแทบไม่ได้',
    },
    {
      question: 'ทำไมต้องมีทั้ง Encryption in Transit และ at Rest พร้อมกัน (มีแค่อย่างเดียวไม่พอ)',
      answer:
        'เพราะป้องกันคนละจุด — มี TLS อย่างเดียวป้องกันได้แค่ตอนเดินทาง แต่ถ้า harddisk ถูกขโมยไปตรงๆ ข้อมูลที่ไม่เข้ารหัส at rest ก็ยังอ่านได้ทันที',
    },
  ],
  'capacity-estimation:why-estimate': [
    {
      question: 'Capacity Estimation คืออะไร ทำไมสำคัญ',
      answer: 'ทักษะประเมินตัวเลขคร่าวๆ (QPS - Queries Per Second, ขนาดข้อมูล) ก่อนออกแบบระบบ สำคัญเพราะถ้าตอบไม่ได้เป็นตัวเลข การออกแบบก็เป็นแค่การเดา',
    },
    {
      question: 'ทำไมไม่ต้องคำนวณให้แม่นยำ 100%',
      answer: 'เป้าหมายคือรู้ "ระดับขนาด" (order of magnitude) แค่หลักสิบ/พัน/ล้าน/ร้อยล้านก็พอ เพราะคำตอบต่างกันแค่ order of magnitude เดียวก็เปลี่ยนสถาปัตยกรรมที่เหมาะสมไปคนละแบบแล้ว',
    },
    {
      question: 'กระบวนการคิด capacity estimation มาตรฐาน 5 ขั้นมีอะไรบ้าง (คร่าวๆ)',
      answer:
        '(1) ตั้งสมมติฐานจำนวนผู้ใช้ (2) ประเมิน action/user/วัน (3) คำนวณ requests/วัน → QPS (Queries Per Second) เฉลี่ย (4) คูณ peak multiplier → QPS พีค (5) ประเมินขนาดข้อมูล → storage/bandwidth',
    },
  ],
  'capacity-estimation:latency-numbers': [
    {
      question: 'ทำไม RAM ถึงเร็วกว่า Disk (SSD/HDD) มาก',
      answer:
        'RAM อยู่ใกล้ CPU ที่สุด (~100 nanoseconds) ในขณะที่ SSD/HDD (Hard Disk Drive) ต้องเข้าถึงผ่านกลไกที่ช้ากว่ามาก (SSD ~100 microseconds, HDD ~10 milliseconds) ต่างกันเป็นพันถึงแสนเท่า',
    },
    {
      question: 'ทำไม Round-trip ข้าม region ถึงช้ากว่า round-trip ใน data center เดียวกันมาก',
      answer: 'เพราะข้อมูลต้องเดินทางระยะทางจริงไกลกว่ามาก ทำให้ latency ต่างกันเป็นร้อยเท่า (500 microseconds vs 150 milliseconds)',
    },
    {
      question: 'กฎง่ายๆ ที่ได้จากตาราง latency คืออะไร',
      answer: 'ยิ่งข้อมูลต้องเดินทางไกล (physically) ยิ่งช้า — ควรออกแบบให้ข้อมูลเดินทางน้อยที่สุดเท่าที่จำเป็น (นี่คือเหตุผลที่ cache/CDN ช่วยได้มาก)',
    },
  ],
  'capacity-estimation:estimation-calculator': [
    {
      question: 'Average QPS กับ Peak QPS ต่างกันยังไง อันไหนสำคัญกว่าตอนออกแบบระบบ',
      answer: 'Average QPS (Queries Per Second) คือภาระเฉลี่ยตลอดวัน. Peak QPS คือช่วงที่ภาระสูงสุด — Peak สำคัญกว่าเพราะระบบต้องรอดตอนพีคที่สุด ไม่ใช่แค่ค่าเฉลี่ย',
    },
    {
      question: 'ทำไมต้องคูณ Peak Multiplier เข้าไปในการคำนวณเสมอ',
      answer: 'เพราะ traffic จริงไม่กระจายสม่ำเสมอตลอดวัน (ช่วงกลางวัน/เย็นเยอะกว่ากลางดึกมาก) ถ้าออกแบบตาม average เฉยๆ ระบบจะรับพีคจริงไม่ไหว',
    },
    {
      question: 'ตัวเลข capacity estimation เอาไปใช้ตัดสินใจอะไรต่อได้บ้าง',
      answer: 'ตัดสินใจว่าต้องมี Load Balancer/Scale Out ไหม, ต้อง Cache/Read Replica ไหม, ต้อง Sharding database ไหม — เป็นจุดเริ่มต้นของการตัดสินใจ architecture แทบทุกเรื่อง',
    },
  ],
  'case-studies:url-shortener': [
    {
      question: 'ทำไม URL Shortener ถึงเป็นระบบ read-heavy',
      answer: 'เพราะ 1 short URL ถูกคลิก (redirect/อ่าน) ซ้ำได้หลายครั้ง แต่สร้างใหม่ (เขียน) แค่ครั้งเดียว — อ่านมากกว่าเขียนหลายเท่า',
    },
    {
      question: 'ทำไมการสร้าง short code ด้วยการเข้ารหัส ID เป็น base62 ถึงดีกว่าสุ่มแล้วเช็คชน',
      answer: 'เพราะ base62-encode ID ที่ unique อยู่แล้ว รับประกันไม่ซ้ำกันแน่นอนในตัว ไม่ต้องเสียเวลา generate-แล้วเช็คซ้ำไปเรื่อยๆ เหมือนวิธีสุ่ม',
    },
    {
      question: 'Cache ช่วยระบบนี้ตรงไหน',
      answer: 'URL ยอดนิยมถูกคลิกซ้ำมหาศาล — cache mapping short_code→long_url ไว้ใน Redis ลดภาระที่ database ลงมาก เพราะเป็นระบบ read-heavy',
    },
  ],
  'case-studies:chat-app': [
    {
      question: 'ทำไม HTTP request-response ปกติไม่พอสำหรับแอปแชท ต้องใช้ WebSocket',
      answer:
        'เพราะ HTTP ต้องให้ client ถามก่อนเสมอ แต่แชทต้องการให้ server ส่งข้อความหาไปหา client ได้เองทันทีที่มีข้อความใหม่ — WebSocket เปิด persistent connection ที่ทั้งสองฝั่งพูดใส่กันได้ตลอดเวลา',
    },
    {
      question: 'ทำไมต้องใช้ Pub/Sub (เช่น Redis Pub/Sub) ในระบบแชทที่มีหลาย chat server',
      answer:
        'เพราะถ้า user A ต่อกับ Server 1 และ user B ต่อกับ Server 2 ข้อความของ A ต้องหาทางไปหา Server 2 ให้เจอ — Pub/Sub กลางช่วยกระจายข้อความข้าม server ให้',
    },
    {
      question: 'ทำไมข้อความต้องเขียนลง Database ควบคู่กับการส่ง real-time ด้วย',
      answer: 'เพราะข้อความต้องอยู่ถาวรแม้ user offline (เหมือน SMS ที่รออ่านทีหลังได้) การส่ง real-time อย่างเดียวไม่พอถ้า user ไม่ได้เปิดแอปตอนนั้น',
    },
  ],
  'case-studies:news-feed': [
    {
      question: 'Fan-out on Write กับ Fan-out on Read ต่างกันยังไง',
      answer:
        'Fan-out on Write = โพสต์ใหม่เขียนเข้า feed ของ follower ทุกคนทันที (อ่านเร็ว เขียนหนัก). Fan-out on Read = เก็บโพสต์ที่เดียว รวบรวมสดตอน follower ขอ feed (เขียนเบา อ่านหนัก/ช้ากว่า)',
    },
    {
      question: 'Celebrity Problem คืออะไร แก้ยังไง',
      answer:
        'ปัญหาที่คนดังมี follower หลักล้าน ทำให้ fan-out on write ตอนโพสต์ต้องเขียนเข้า feed หลักล้านคนพร้อมกัน (หนักมาก) — แก้ด้วย hybrid: user ทั่วไปใช้ fan-out on write, คนดังใช้ fan-out on read เฉพาะราย',
    },
    {
      question: 'ทำไม fan-out ต้องทำแบบ async ผ่าน queue ไม่ใช่ synchronous',
      answer:
        'เพราะถ้าเขียนเข้า feed ทุก follower (อาจหลักล้านคน) แบบ synchronous ก่อนตอบกลับ user ที่โพสต์ต้องรอนานมาก — ควรตอบกลับทันทีแล้วส่งงาน fan-out เข้า queue ให้ worker ค่อยๆ ทำเบื้องหลัง',
    },
  ],
  'case-studies:rate-limiter-case': [
    {
      question: 'ทำไม Rate Limiter แบบ distributed (หลาย service เรียกร่วมกัน) ถึงเก็บ token count แยกกันที่แต่ละ server ไม่ได้',
      answer:
        'เพราะ user ที่ยิง request สลับไปมาระหว่าง server (ปกติมากเพราะมี Load Balancer) จะได้โควต้ารวมมากกว่าที่ตั้งใจ ต้องเก็บที่ Redis กลางให้ทุก server เช็ค/อัปเดตค่าเดียวกัน',
    },
    {
      question: 'ทำไมต้องใช้ atomic operation (เช่น Redis INCR) ตอนเช็ค/อัปเดต token count',
      answer: 'ป้องกัน race condition ตอนหลาย server เช็ค/อัปเดตพร้อมกัน (เหมือนสมุดนับบัตรที่ต้องแก้ทีละคนไม่ให้เขียนทับกัน)',
    },
    {
      question: 'ทำไม Rate Limiter ควรอยู่ที่ API Gateway จุดเดียว ไม่ใช่เขียนซ้ำทุก microservice',
      answer: 'ลดการเขียน logic ซ้ำซ้อนกระจายอยู่ทุก service — เชื่อมกับหลักการเดียวกับ authentication รวมศูนย์ที่ Gateway',
    },
  ],

  'case-studies:boss-loot-race': [
    {
      question: 'ทำไมดีไซน์ "เช็คว่าไอเทมยังอยู่ไหม แล้วค่อยเขียนว่าเก็บแล้ว" ถึงทำให้ไอเทมชิ้นเดียวถูกแจกซ้ำ 2 คนได้',
      answer:
        'เพราะเช็คกับเขียนเป็นสองขั้นตอนแยกกัน (check-then-act) — ระหว่างที่ผู้เล่นคนแรกเช็คผ่านแล้วกำลังจะเขียน ผู้เล่นอีกคนก็เช็คผ่านไปแล้วเหมือนกันเพราะสถานะยังไม่ถูกเขียนทับ ทั้งสอง request จึงเห็นว่า "ยังว่าง" พร้อมกันได้จริง',
    },
    {
      question: 'ทางแก้ race condition ของการแจกไอเทมคืออะไร',
      answer:
        'รวมขั้นตอน "เช็ค + เขียน" ให้เป็น operation เดียวที่ atomic แยกกันไม่ได้ เช่น Redis SETNX หรือ Lua script (เทียบเท่า CAS - Compare-And-Swap) คนแรกที่ operation สำเร็จได้ไอเทมจริง คนที่เหลือ fail ทันที',
    },
    {
      question: '"กดเก็บไอเทมก่อนได้ก่อน" มี trade-off เรื่องความแฟร์ยังไง',
      answer:
        'จริงๆ แล้วหมายถึง "request ไปถึง server ก่อน" ไม่ใช่ "มือไวกว่าจริง" ผู้เล่นที่ ping สูง (อยู่ไกล server) เสียเปรียบเสมอแม้กดเร็วกว่าในหน้าจอตัวเอง ถ้าต้องการความแฟร์ที่ไม่ผูกกับ network latency ต้องเปลี่ยนเป็นเปิดหน้าต่างเวลาสั้นๆ ให้ทุกคนกดได้แล้วสุ่มผู้ชนะหลังปิดรับ',
    },
  ],

  'case-studies:flash-sale-ticket': [
    {
      question: 'ทำไมปล่อยให้หมื่น request ยิง UPDATE ตัด stock ตรงไปที่ Database พร้อมกันถึงเป็นปัญหา แม้ transaction จะถูกต้องทุกตัว',
      answer:
        'เพราะ Database ไม่ได้ออกแบบมาให้รองรับหมื่น connection มา lock แถวเดียวกันพร้อมกันในวินาทีเดียว ต่อให้ทุก transaction ถูกต้อง (ไม่มี race condition ขายเกิน) connection pool ก็เต็มจนทั้งระบบช้าหรือ timeout ได้',
    },
    {
      question: 'Virtual Waiting Room แก้ปัญหาอะไรที่ atomic decrement เพียงอย่างเดียวแก้ไม่ได้',
      answer:
        'Atomic decrement การันตีความถูกต้อง (ไม่ oversell) แต่ไม่ได้ลดปริมาณ request ที่ชนกันในเวลาเดียว Waiting Room ช่วยถ่วงอัตราคนเข้าระบบให้พอดีกับที่ backend รับได้ แก้ปัญหาเรื่อง capacity ซึ่งเป็นคนละมิติจากปัญหา correctness',
    },
    {
      question: 'ทำไมยืนยันคำสั่งซื้อจริงที่ Database แบบ async ได้ ไม่ต้องรอ Database ตอบก่อนแจ้งลูกค้า',
      answer:
        'เพราะผลการตัด stock ตัดสินเสร็จเรียบร้อยแล้วที่ Redis (atomic decrement) การเขียนลง Database เป็นแค่การบันทึกประวัติคำสั่งซื้อ ไม่ใช่จุดตัดสินผลว่าใครได้บัตร จึงไม่ต้องรอ Database ตอบก่อนแจ้งผลลูกค้า',
    },
  ],

  'case-studies:ride-hailing-matching': [
    {
      question: 'ทำไม "query หาคนขับใกล้สุด แล้ว assign ทันที" ในขั้นตอนเดียว ถึงทำให้คนขับคนเดียวถูก assign ซ้ำ 2 เที่ยวได้',
      answer:
        'เพราะระหว่างที่ query กำลังหาคนขับใกล้สุด ตำแหน่ง/สถานะของคนขับเปลี่ยนได้ตลอดเวลา ข้อมูลที่ query ได้เป็นแค่ตัวเลือกที่น่าจะใช้ได้ ไม่ใช่ผลตัดสินจริง ถ้าสอง request query พร้อมกันก่อนมีใคร assign จริง ทั้งคู่จะเห็นคนขับคนเดียวกันว่า "ว่าง" พร้อมกัน',
    },
    {
      question: 'ทำไมต้องแยก "หา" กับ "จอง" ออกจากกันเป็นสองขั้นตอน',
      answer:
        'เพราะข้อมูลจากขั้น "หา" (geospatial query) อาจ stale ได้เสมอเนื่องจากคนขับเคลื่อนที่ตลอดเวลา จึงให้ขั้น "จอง" เป็น atomic claim ที่ตัดสินจริง คนแรกที่ claim สำเร็จได้คนขับจริง คนที่เหลือ fail ทันทีแล้วลองคนขับคนถัดไปในรายชื่อ',
    },
    {
      question: 'เคสนี้ต่างจาก Boss Loot Race ยังไงในแง่ของทรัพยากรที่แย่งกัน',
      answer:
        'Boss Loot Race ทรัพยากร (ไอเทม) อยู่นิ่ง ไม่เปลี่ยนตำแหน่ง ส่วนเคสนี้ทั้งคนขับและผู้โดยสารเคลื่อนที่ตลอดเวลา ทำให้ต้องมี Geospatial Index หาตัวเลือกก่อน แล้วค่อยใช้ atomic claim หลักการเดียวกันตัดสินผลจริงอีกชั้นหนึ่ง',
    },
  ],

  'case-studies:viral-post-hotkey': [
    {
      question: 'ทำไมโพสต์ไวรัลที่มี like พุ่งหลักล้านครั้ง ถึงเป็นปัญหาที่ sharding ธรรมดาแก้ไม่ได้',
      answer:
        'เพราะ sharding กระจาย key ต่างกันไปคนละเครื่อง แต่ post_id เดียวกันย่อมอยู่ที่ shard เดียวเสมอไม่ว่า sharding จะดีแค่ไหน ถ้า key นั้นร้อนกว่า key อื่นมหาศาล (hot key) shard นั้นก็ยังรับภาระหนักกว่าเพื่อนอยู่ดี',
    },
    {
      question: 'วิธีแก้ปัญหา Hot Key ของยอด like คืออะไร',
      answer:
        'ไม่เขียน Database ทันทีทุกครั้งที่มีคนกด like — ให้เขียน event เข้า Message Queue ก่อน สะสมยอดที่ In-Memory Counter เป็นช่วงเวลาสั้นๆ แล้ว flush ลง Database เป็นก้อนเดียวเป็นระยะ (batch write) ลดจำนวน write ต่อแถวลงมหาศาล',
    },
    {
      question: 'ทำไมยอมให้ user เห็นยอด like คลาดเคลื่อนได้บ้างในเคสนี้',
      answer:
        'เพราะยอด like ไม่ต้องการ strong consistency — user ไม่รู้สึกความต่างระหว่างเลขที่ตามหลังของจริงไม่กี่วินาที การยอม eventual consistency แลกกับระบบไม่ล่มคุ้มค่ากว่ามาก แต่ถ้าเป็นข้อมูลที่ต้อง exact เสมอ (เช่นยอดเงินในบัญชี) จะใช้วิธีนี้ไม่ได้',
    },
  ],

  'case-studies:realtime-leaderboard': [
    {
      question: 'ทำไม `ORDER BY score DESC LIMIT 100` ที่ Database ตรงๆ ไม่เหมาะกับ Leaderboard แบบเรียลไทม์',
      answer:
        'เพราะ Database ต้อง sort ข้อมูลผู้เล่นหลักล้านแถวใหม่ทุกครั้งที่มีคนขอ Leaderboard ทั้งที่จริงๆ อันดับเปลี่ยนแค่นิดหน่อยระหว่างสอง query ที่ห่างกันไม่กี่วินาที ยิ่งคนเปิดพร้อมกันมาก ยิ่งเปลืองงาน sort ซ้ำเดิม',
    },
    {
      question: 'Sorted Set (เช่น Redis ZSET) แก้ปัญหา Leaderboard ได้ยังไง',
      answer:
        'Sorted Set จัดเรียงข้อมูลตามคะแนนไว้อัตโนมัติตลอดเวลา ทุกครั้งที่มีคนทำแต้มแค่อัปเดตคะแนนด้วย operation เดียว (เช่น ZADD) ไม่ต้อง sort ทั้งชุดใหม่ ทั้งการขอ Top 100 และขออันดับเจาะจงคนเดียวก็หยิบจากโครงสร้างนี้ได้ตรงๆ โดยไม่ต้องคำนวณใหม่',
    },
    {
      question: 'ทำไม Sorted Set ไม่ควรเป็น source of truth หลักของคะแนน ต้อง sync กับ Database ด้วย',
      answer:
        'เพราะ Sorted Set อยู่ใน memory เป็นหลัก เร็วมากแต่เสี่ยงข้อมูลหายถ้า cache ล่ม ต้อง sync กลับ Database เป็นระยะเพื่อเก็บประวัติคะแนนแบบถาวร ไม่ให้ Sorted Set เป็นจุดเดียวที่ข้อมูลจริงอยู่',
    },
  ],

  'architectural-styles:monolith-vs-microservices-style': [
    { question: 'อะไรคือปัจจัยหลักที่ควรใช้ตัดสินใจเลือก Monolith หรือ Microservices ไม่ใช่แค่เรื่องเทคนิค', answer: 'ปัจจัยหลักคือปัจจัยเชิงองค์กร ได้แก่ ขนาดและจำนวนทีม (ตาม Conway\'s Law), ความถี่ที่แต่ละทีมต้องการ deploy อิสระ, ความชัดเจนของ domain boundary, และความพร้อมด้าน operational maturity ของทีม infra ไม่ใช่แค่ว่าเทคโนโลยีไหน \'ดีกว่า\' ในทางเทคนิคเพียวๆ' },
    { question: 'Conway\'s Law เกี่ยวข้องกับการเลือก architectural style ยังไง', answer: 'Conway\'s Law บอกว่าโครงสร้างระบบซอฟต์แวร์มักสะท้อนโครงสร้างการสื่อสารขององค์กรที่สร้างมันขึ้นมา ถ้าทีมแบ่งเป็นหลายทีมอิสระ ระบบก็มักถูกออกแบบให้แยกเป็น service ตามทีมนั้นไปด้วย (microservices) แต่ถ้าเป็นทีมเดียวที่สื่อสารกันตลอดเวลา ระบบมักรวมเป็น monolith เดียวได้อย่างมีประสิทธิภาพกว่า' },
    { question: 'ทำไมทีมเล็กที่เพิ่งเริ่มโปรเจกต์ใหม่ มักถูกแนะนำให้เริ่มด้วย Monolith ก่อน', answer: 'เพราะทีมเล็กสื่อสารกันเองได้ทั่วถึงอยู่แล้ว การ deploy พร้อมกันทั้งระบบยังไม่สร้างปัญหาคอขวด และ domain boundary ที่แท้จริงมักยังไม่ชัดเจนในช่วงแรก การแตกเป็น microservices ก่อนรู้ boundary ที่ถูกต้องมักทำให้ต้องแก้ไข service ที่แบ่งผิดในภายหลัง ซึ่งมีต้นทุนสูงกว่าการรวมเป็นก้อนเดียวไว้ก่อน' },
  ],
  'architectural-styles:soa': [
    { question: 'SOA กับ Microservices ต่างกันตรงไหนในแง่การสื่อสารระหว่าง service', answer: 'SOA พึ่งพา ESB (Enterprise Service Bus) เป็นจุดกลางที่ทุก service ต้องส่งข้อความผ่าน ส่วน microservices ให้แต่ละ service คุยกันโดยตรงหรือผ่าน lightweight gateway โดยไม่มีจุดกลางที่บังคับทุก message ให้ผ่าน ทำให้ deploy และ scale แต่ละ service ได้อิสระกว่า' },
    { question: 'ทำไม ESB ถึงกลายเป็นคอขวดขององค์กรที่ใช้ SOA', answer: 'เพราะทุก message ต้องผ่าน ESB เส้นเดียว ทำให้มันเป็นทั้ง single point of failure และจุดที่ทีมกลางทีมเดียวต้องดูแล routing/transformation logic ของทุกระบบ การเปลี่ยนแปลงใดๆ ต้องผ่านทีมนี้ ทำให้ deploy ช้าลงเมื่อองค์กรโตขึ้น' },
    { question: 'แนวคิดอะไรจาก SOA ที่ยังใช้อยู่ในระบบยุคปัจจุบัน', answer: 'แนวคิด service contract (การประกาศ interface ชัดเจนก่อนใช้งาน เช่น OpenAPI/gRPC schema ในปัจจุบัน) และ enterprise integration patterns ยังคงใช้กันอยู่ รวมถึง ESB/SOA เองก็ยังพบได้จริงในองค์กรใหญ่ที่ต้องเชื่อมระบบ legacy จำนวนมาก เช่น ธนาคารหรือหน่วยงานรัฐ' },
  ],
  'architectural-styles:serverless-architecture': [
    { question: 'Cold Start ใน Serverless คืออะไร และเกิดขึ้นเมื่อไหร่', answer: 'Cold Start คือความหน่วงที่เกิดขึ้นเมื่อแพลตฟอร์มต้องจัดสรร container ใหม่และโหลด runtime/โค้ดขึ้นมาก่อนเริ่มรัน function เพราะไม่มี container ที่ \'อุ่น\' (warm) รออยู่แล้ว มักเกิดกับ function ที่ไม่ได้ถูกเรียกมานาน หรือตอน scale ขึ้นกะทันหันจนต้องสร้าง instance ใหม่จำนวนมาก' },
    { question: 'งานประเภทไหนที่ไม่เหมาะกับ Serverless', answer: 'งานที่รันต่อเนื่องนานเกินขีดจำกัดเวลาของแพลตฟอร์ม (เช่น เกิน 15 นาทีใน AWS Lambda), งานที่ต้องเก็บ state ใน memory ระหว่าง request อย่างต่อเนื่อง (เช่น WebSocket connection ค้างนาน) และงานที่ต้องการ latency สม่ำเสมอแบบไม่ยอมรับ cold start เลย เช่น ระบบ trading ที่ latency-critical' },
    { question: 'โมเดลค่าใช้จ่ายของ Serverless ต่างจาก server แบบ always-on อย่างไร', answer: 'Serverless คิดเงินตามจำนวนครั้งและเวลาที่ execute จริงเท่านั้น ไม่มี traffic ก็ไม่เสียค่าใช้จ่าย ต่างจาก server แบบ always-on ที่ต้องจ่ายค่าเครื่องตลอดเวลาไม่ว่าจะมีคนใช้งานหรือไม่ ทำให้ Serverless คุ้มค่ากว่ามากสำหรับงานที่มี traffic แบบ bursty หรือไม่สม่ำเสมอ' },
  ],
  'architectural-styles:event-driven-architecture-style': [
    { question: 'Choreography กับ Orchestration ต่างกันยังไงในสถาปัตยกรรม event-driven', answer: 'Choreography คือแต่ละ service publish/subscribe event และตัดสินใจทำงานเองโดยไม่มีจุดกลางควบคุม (เหมือนวงแจ๊สด้นสด) ส่วน Orchestration มี service กลางหนึ่งตัว (orchestrator) ที่รู้จักและควบคุม flow ทั้งหมด คอยเรียกแต่ละ service ตามลำดับ (เหมือนวาทยกรควบคุมวงออร์เคสตรา)' },
    { question: 'ทำไม Choreography ถึง debug ยากกว่า Orchestration', answer: 'เพราะไม่มี service ไหนรู้จัก flow ทั้งหมดของงานหนึ่งๆ logic กระจายอยู่ในหลาย service ที่ต่างคน publish/subscribe event ของตัวเอง เวลาเกิดปัญหาต้องตามรอยข้ามหลาย service ด้วย distributed tracing ต่างจาก Orchestration ที่เห็น flow ทั้งหมดได้จากจุดเดียวคือ orchestrator' },
    { question: 'Event-Driven Architecture ในฐานะ \'style\' ทางสถาปัตยกรรม ต่างจากการใช้ message queue ทั่วไปยังไง', answer: 'การใช้ message queue เป็นแค่กลไกทางเทคนิค (mechanic) แต่ Event-Driven Architecture ในระดับ style คือการตัดสินใจออกแบบทั้งระบบและขอบเขตทีมให้สื่อสารกันผ่านการประกาศเหตุการณ์เป็นหลัก ซึ่งส่งผลต่อ topology ของระบบและความเป็นเจ้าของ (ownership) ของแต่ละทีมโดยตรง ไม่ใช่แค่เลือกใช้เครื่องมือตัวหนึ่ง' },
  ],
  'architectural-styles:layered-vs-hexagonal': [
    { question: 'ปัญหาหลักของ Layered Architecture แบบดั้งเดิมคืออะไร', answer: 'Business logic ในชั้นกลางมักพึ่งพา (depend on) รายละเอียดเฉพาะของ infrastructure ในชั้นล่างโดยตรง เช่น ORM entity หรือ SQL เฉพาะ database ทำให้เปลี่ยน database หรือ framework กระทบ business logic ตามไปด้วย และทดสอบ business logic แยกจาก infrastructure ได้ยาก' },
    { question: 'Hexagonal Architecture แก้ปัญหาของ Layered Architecture ด้วยหลักการอะไร', answer: 'ด้วย Dependency Inversion — กลับทิศทางการพึ่งพาให้ business logic (core) เป็นศูนย์กลางที่ไม่รู้จัก infrastructure เลย มีแค่ port (interface) ที่กำหนดไว้ ส่วน adapter ตัวจริง (database, REST, message queue) เป็นฝ่ายต้อง implement ตาม port นั้น ทำให้สลับ infrastructure ได้โดยไม่แตะ core' },
    { question: 'ทำไมโปรเจกต์เล็กๆ อาจไม่จำเป็นต้องใช้ Hexagonal Architecture', answer: 'เพราะการออกแบบ port/adapter ต้องใช้เวลาสร้าง interface เพิ่มตั้งแต่ต้น ถ้าระบบเล็ก ไม่ซับซ้อน และไม่คาดว่าจะเปลี่ยน infrastructure บ่อย Layered Architecture ธรรมดาก็เพียงพอ เริ่มต้นได้เร็วกว่าโดยไม่ต้องแลกกับความซับซ้อนที่เพิ่มขึ้น' },
  ],
  'architecture-documentation:c4-model': [
    { question: 'C4 Model มีระดับการซูมทั้งหมดกี่ระดับ และเรียงลำดับจากภาพกว้างสุดไปแคบสุดว่าอย่างไร', answer: 'มี 4 ระดับ เรียงจากกว้างสุดไปแคบสุดคือ Context (ระบบทั้งก้อนเป็นกล่องเดียว กับ actor ภายนอก), Container (แอปพลิเคชัน/service/database ที่ deploy แยกกันได้จริง), Component (โมดูลภายใน 1 container), และ Code (class/interface จริงในโค้ด) ยิ่งลึกลงไปยิ่งมีรายละเอียดมากขึ้นแต่คนอ่านที่สนใจจะแคบลง' },
    { question: 'ทำไมทีมส่วนใหญ่ถึงมักวาดแค่ Context กับ Container diagram ไว้เป็นเอกสารถาวร แต่ไม่ค่อยรักษา Component หรือ Code diagram ให้ทันสมัยตลอดเวลา', answer: 'เพราะ Context กับ Container เปลี่ยนไม่บ่อย (เปลี่ยนแค่ตอนมี integration ใหม่หรือเปลี่ยน tech stack) และตอบคำถามภาพรวมที่ถูกถามบ่อยที่สุดได้แล้ว ส่วน Component และ Code เปลี่ยนตามการ refactor โค้ดที่เกิดขึ้นถี่มาก ถ้าพยายามรักษาให้ตรงกับโค้ดตลอดเวลาจะกลายเป็นภาระที่ไม่มีใครตามอัปเดตทัน จึงมักวาดแบบ ad-hoc เฉพาะตอนจำเป็นแทน' },
    { question: 'ถ้าต้องอธิบายภาพรวมระบบให้ผู้บริหารที่ไม่ใช่สายเทคฟังภายใน 5 นาที ควรใช้ C4 diagram ระดับไหน เพราะอะไร', answer: 'ควรใช้ระดับ Context เพราะแสดงแค่ระบบทั้งก้อนเป็นกล่องเดียวและใครติดต่อกับระบบบ้าง (ลูกค้า, ระบบภายนอกอย่าง payment gateway) ไม่มีรายละเอียดทางเทคนิคที่ต้องมีพื้นฐานถึงจะเข้าใจ เหมาะกับคนที่อยากรู้ภาพรวมความสัมพันธ์มากกว่ารายละเอียดการทำงานภายใน' },
  ],
  'architecture-documentation:4-plus-1-view': [
    { question: '4+1 View Model ของ Kruchten ประกอบด้วยมุมมองอะไรบ้าง และมุมมองที่ \'+1\' ทำหน้าที่พิเศษอย่างไรเมื่อเทียบกับอีกสี่มุมมอง', answer: 'ประกอบด้วย Logical View (โครงสร้างโดเมน), Process View (พฤติกรรมตอน runtime), Development View (การจัดโครงสร้างซอร์สโค้ด), Physical View (การวาง hardware/network จริง) และมุมมองที่ห้าคือ Scenarios/Use Cases ซึ่งไม่ใช่มุมมองอิสระเหมือนสี่อันแรก แต่ทำหน้าที่เป็นทั้งจุดเริ่มต้นออกแบบและจุดตรวจสอบว่าอีกสี่มุมมองสอดคล้องกันจริงเมื่อนำไปใช้กับสถานการณ์จริง' },
    { question: 'ทีม ops ที่ต้องวางแผนเรื่อง availability และ scalability ของ server ควรดู view ไหนเป็นหลัก และ view นั้นตอบคำถามอะไร', answer: 'ควรดู Physical View (หรือ Deployment View) เป็นหลัก เพราะแสดงว่า software แต่ละส่วนรันอยู่บน server หรือ node ไหน เครือข่ายเชื่อมต่อกันอย่างไร ตอบคำถามว่า \'ระบบรันอยู่ที่ไหน และเชื่อมต่อเน็ตเวิร์กกันยังไง\' ซึ่งจำเป็นต่อการวางแผนด้านฮาร์ดแวร์และความพร้อมใช้งานจริง' },
    { question: 'เพราะเหตุใดทีมขนาดเล็กจึงมักไม่จำเป็นต้องวาดครบทั้ง 5 มุมมองในทุกโปรเจกต์', answer: 'เพราะแต่ละมุมมองตอบคำถามคนละกลุ่มคำถาม ถ้าโปรเจกต์ไม่มีความซับซ้อนด้าน concurrency สูง หรือไม่มีทีมแยกดูแลแต่ละด้านจริง การวาดครบทุกมุมมองอาจเป็นภาระเกินความจำเป็น ทีมเล็กมักเลือกโฟกัสแค่มุมมองที่ตอบคำถามที่ถูกถามบ่อยที่สุด เช่น Logical กับ Physical View เท่านั้น' },
  ],
  'architecture-documentation:adr': [
    { question: 'ADR ตามรูปแบบ Michael Nygard มีกี่ส่วน อะไรบ้าง และส่วน \'Consequences\' สำคัญอย่างไร', answer: 'มี 5 ส่วน คือ Title, Status, Context, Decision, และ Consequences ส่วน Consequences สำคัญเพราะบังคับให้คนเขียนซื่อสัตย์กับต้นทุนของการตัดสินใจ ไม่ใช่แค่บอกว่าเลือกอะไรแต่ต้องบอกด้วยว่าต้องแลกอะไรไป เพราะแทบไม่มีการตัดสินใจสถาปัตยกรรมไหนที่ไม่มีข้อเสียเลย' },
    { question: 'การตัดสินใจแบบไหนที่ควรเขียน ADR และแบบไหนที่ไม่จำเป็น ใช้หลักอะไรแยก', answer: 'ใช้หลัก one-way door vs two-way door: การตัดสินใจที่กลับตัวยากและมีผลระยะยาว เช่น เลือก database หลักหรือ sync vs async messaging ควรเขียน ADR ส่วนการตัดสินใจที่กลับตัวง่ายและผลกระทบแคบ เช่น การตั้งชื่อตัวแปรหรือทดลอง feature flag ชั่วคราว ไม่จำเป็นต้องเขียน ADR' },
    { question: 'เมื่อบริบทของระบบเปลี่ยนไปจนต้องเปลี่ยนการตัดสินใจที่เคยบันทึกไว้ใน ADR เก่า ควรทำอย่างไรกับ ADR เก่านั้น และทำไม', answer: 'ไม่ควรลบหรือแก้ ADR เก่าทิ้ง แต่ควรเขียน ADR ใหม่แล้วมาร์กสถานะของ ADR เก่าเป็น Superseded พร้อมลิงก์ไปยัง ADR ใหม่ เพื่อรักษาประวัติศาสตร์การตัดสินใจทั้งหมดไว้ครบ ทำให้คนในอนาคตเห็นทั้งเหตุผลเดิมและเหตุผลที่เปลี่ยนแปลงในภายหลัง' },
  ],
  'ddd-foundations:bounded-context': [
    { question: 'ทำไมการสร้าง shared domain model เดียวที่ครอบคลุมทั้งองค์กรถึงมีปัญหาเมื่อระบบใหญ่ขึ้น', answer: 'เพราะแต่ละแผนกมองคำเดียวกัน (เช่น "Product") ต่างกัน บาง field ความหมายขัดแย้งกันตรงๆ ถ้ารวมเป็น model เดียวจะบวมเป็นร้อย field และทุกครั้งที่แผนกหนึ่งแก้ field ก็เสี่ยงกระทบ logic ของอีกแผนกโดยไม่ตั้งใจ' },
    { question: 'Bounded Context คืออะไร', answer: 'คือขอบเขตที่ชัดเจนรอบๆ โมเดลหนึ่งชุด ซึ่งภายในขอบเขตนั้นคำศัพท์ทุกคำมีความหมายเดียวเท่านั้น แต่ละ context มีโมเดล ทีม และ storage ของตัวเองได้ เชื่อมต่อกับ context อื่นผ่าน API หรือ event เท่านั้น ไม่แชร์ object หรือ database ตรงๆ' },
    { question: 'สัญญาณอะไรบ้างที่บอกว่าควรตัดระบบเป็น Bounded Context ใหม่', answer: 'เมื่อคำศัพท์เดียวกันเริ่มมีความหมายขัดแย้งกันระหว่างทีม เมื่อสองทีมต้องรอกันตลอดเวลาเพราะแก้ model กลางร่วมกัน หรือเมื่อ business rule ของแผนกหนึ่งเริ่มไม่เกี่ยวข้องกับอีกแผนกเลย' },
  ],
  'ddd-foundations:ubiquitous-language': [
    { question: 'Ubiquitous Language คืออะไร แก้ปัญหาอะไร', answer: 'คือคำศัพท์ชุดเดียวที่ใช้เหมือนกันทุกที่ ทั้งบทสนทนากับ domain expert เอกสาร และโค้ดจริง แก้ปัญหา "translation layer" ที่ต้องมีคนคอยแปลระหว่างสิ่งที่ธุรกิจพูด (เช่น "ยกเลิกออเดอร์") กับสิ่งที่โค้ดเขียน (เช่น setStatus(4)) ซึ่งเป็นต้นเหตุของ bug จากการตีความไม่ตรงกัน' },
    { question: 'ทำไม cancelOrder() ถึงดีกว่า setStatus(order, 4) ในมุมของ Ubiquitous Language', answer: 'เพราะ cancelOrder() ใช้คำเดียวกับที่ domain expert พูดตรงๆ อ่านแล้วเข้าใจ business rule ทันทีโดยไม่ต้องเปิดไฟล์ constants แยกไปดูว่าเลข 4 หมายถึงอะไร ลดโอกาสที่ dev แต่ละคนจะตีความ status code ไม่ตรงกัน' },
    { question: 'Ubiquitous Language เกี่ยวข้องกับ Bounded Context ยังไง', answer: 'Ubiquitous Language ใช้ได้เฉพาะภายใน bounded context เดียวเท่านั้น คำเดียวกัน (เช่น "ออเดอร์") อาจมีรายละเอียดหรือความหมายต่างกันได้ระหว่าง context เช่น Sales สนใจราคา ส่วน Shipping สนใจที่อยู่จัดส่ง แต่ละ context มีภาษาที่สอดคล้องกันภายในตัวเอง ไม่จำเป็นต้องเหมือนกันข้าม context' },
  ],
  'ddd-foundations:aggregate': [
    { question: 'Aggregate และ Aggregate Root คืออะไร', answer: 'Aggregate คือกลุ่มของ entity และ value object ที่ต้องเปลี่ยนแปลงไปด้วยกันเสมอเพื่อรักษาความถูกต้อง (invariant) เช่น Order กับ OrderLineItem ส่วน Aggregate Root คือจุดเข้าเดียวที่ยอมให้แก้ไขอะไรก็ตามภายในกลุ่มนั้น เช่น ต้องเรียกผ่าน order.addLineItem() ไม่ใช่สร้าง OrderLineItem แล้วยัดเข้า database ตรงๆ' },
    { question: 'ทำไม Order aggregate ถึงควรเก็บแค่ customerId แทนที่จะเก็บ Customer object ทั้งก้อน', answer: 'เพราะ Customer เป็น aggregate ของตัวเองที่มีขอบเขตความถูกต้องแยกจาก Order ถ้าฝัง object ตรงๆ transaction ของสอง aggregate จะพันกัน แก้ Customer ทีต้อง lock Order ที่เกี่ยวข้อง และข้อมูล Customer ที่ฝังไว้อาจเก่าไม่ตรงกับข้อมูลจริง การอ้างด้วย ID ทำให้แต่ละ aggregate เขียนพร้อมกันได้อิสระ' },
    { question: 'ทำไมควรออกแบบ Aggregate ให้เล็กที่สุดเท่าที่จะรักษา invariant ที่จำเป็นได้', answer: 'เพราะยิ่ง aggregate ใหญ่ ยิ่งต้อง lock ข้อมูลเยอะตอนเขียน เขียนพร้อมกันไม่ได้ เสี่ยง contention สูงเมื่อมี concurrent write เยอะๆ aggregate เล็กทำให้ transaction เร็วและ scale แต่ละส่วนแยกจากกันได้ดีกว่า' },
  ],
  'ddd-foundations:context-mapping': [
    { question: 'Context Mapping คืออะไร', answer: 'คือการนิยามและจัดการความสัมพันธ์ระหว่าง bounded context หลายๆ context ที่ต้องเชื่อมต่อและแลกเปลี่ยนข้อมูลกันในระบบจริง โดยมีรูปแบบความสัมพันธ์มาตรฐานให้เลือกใช้ตามอำนาจต่อรองและระดับความไว้ใจระหว่างทีม เช่น Partnership, Customer-Supplier, Conformist และ Anti-Corruption Layer' },
    { question: 'Customer-Supplier ต่างจาก Conformist ยังไง', answer: 'Customer-Supplier คือทีม downstream กำหนด requirement ให้ทีม upstream ทำตามได้ ยังคุยกันปรับ API ร่วมกันได้ ส่วน Conformist คือทีม downstream ต้องยอมรับโมเดลของ upstream ทั้งหมดโดยไม่มีอำนาจต่อรองเปลี่ยนแปลงอะไรเลย เช่นการต่อกับ API ธนาคารที่เราแก้ไขข้อกำหนดไม่ได้' },
    { question: 'Anti-Corruption Layer (ACL) ใช้ตอนไหน และทำหน้าที่อะไร', answer: 'ใช้เมื่อต้องเชื่อมต่อกับระบบภายนอกหรือระบบ legacy ที่โมเดลไม่ตรงกับของเราหรือคุณภาพไม่น่าเชื่อถือ ACL เป็นชั้นแปล (adapter) ที่แปลงข้อมูลจากระบบภายนอกให้เข้ากับ Ubiquitous Language ของ context ตัวเองก่อนใช้งานเสมอ เพื่อไม่ให้โมเดลที่ไม่ดีของฝั่งนั้นรั่วไหลเข้ามาปนกับ domain model ภายใน' },
  ],
  'quality-attributes:quality-attributes-ilities': [
    { question: 'Quality Attributes ("ilities") คืออะไร ต่างจาก functional requirement ยังไง', answer: 'Quality attributes คือคุณสมบัติเชิงคุณภาพของทั้งระบบ เช่น scalability, availability, maintainability ไม่ใช่ฟีเจอร์ที่บอกว่าระบบทำอะไรได้ แต่บอกว่าทำสิ่งนั้นได้ดีแค่ไหน และฝังอยู่ในโครงสร้างสถาปัตยกรรมของทั้งระบบ ไม่ใช่สิ่งที่เพิ่มเข้าไปทีหลังแบบฟีเจอร์เดี่ยวๆ' },
    { question: 'ทำไม ilities ถึงเพิ่มเข้าไปทีหลังไม่ได้ง่ายๆ เหมือน feature ทั่วไป', answer: 'เพราะ ilities อย่าง scalability ฝังอยู่ในโครงสร้างพื้นฐานของระบบ เช่นวิธีเก็บ state วิธีต่อฐานข้อมูล และวิธี deploy การเปลี่ยนแปลงทีหลังต้องรื้อโครงสร้างเดิม ไม่ใช่แค่เพิ่มโค้ดใหม่เข้าไปแบบฟีเจอร์ปกติ' },
    { question: 'ทำไมถึงไม่สามารถเพิ่ม ilities ทุกตัวให้สูงสุดพร้อมกันได้', answer: 'เพราะ ilities ส่วนใหญ่แย่งทรัพยากรและความซับซ้อนกัน เช่นเพิ่ม security มักทำให้ performance ลดลง เพิ่ม availability มักเพิ่มความซับซ้อนที่กระทบ maintainability งานของสถาปนิกคือเลือกว่าตัวไหนสำคัญที่สุดสำหรับบริบทนั้น แล้วยอมแลกตัวอื่นลงอย่างมีสติ' },
  ],
  'quality-attributes:nfr-vs-fr': [
    { question: 'Functional Requirement กับ Non-Functional Requirement ต่างกันยังไง ยกตัวอย่าง', answer: 'FR บอกว่าระบบทำอะไรได้บ้าง เช่น "ผู้ใช้รีเซ็ตรหัสผ่านได้" ส่วน NFR บอกว่าทำสิ่งนั้นได้ดีแค่ไหนภายใต้เงื่อนไขอะไร เช่น "อีเมลรีเซ็ตรหัสผ่านต้องส่งถึงภายใน 5 วินาที สำหรับ 99% ของคำขอ"' },
    { question: 'ทำไม NFR แบบ "ระบบต้องเร็ว" ถึงใช้งานไม่ได้จริง ต้องแก้ให้เป็นแบบไหน', answer: 'เพราะกำกวมเกินไป ไม่มีใครรู้ว่าเร็วแค่ไหน และทดสอบไม่ได้ว่าผ่านหรือไม่ผ่าน ต้องเขียนให้เจาะจงเป็นตัวเลขวัดผลได้ เช่น "API response time ต้อง ≤ 200ms ที่ p95 เมื่อมี 1,000 concurrent request"' },
    { question: 'ทำไมสถาปัตยกรรมของระบบถึงถูกขับเคลื่อนด้วย NFR มากกว่า FR', answer: 'เพราะ FR ส่วนใหญ่ทำสำเร็จได้เหมือนกันไม่ว่าจะเลือกสถาปัตยกรรมแบบไหน แต่ NFR อย่างการรองรับโหลดสูงหรือ latency ต่ำ คือตัวบังคับให้ต้องเลือกฐานข้อมูล กลยุทธ์ scaling และรูปแบบ deploy ที่แตกต่างกันไป' },
  ],
  'quality-attributes:atam-tradeoff': [
    { question: 'ATAM คืออะไร มี 5 ขั้นตอนหลักอะไรบ้าง', answer: 'ATAM (Architecture Tradeoff Analysis Method) คือกระบวนการเป็นระบบสำหรับวิเคราะห์ trade-off ทางสถาปัตยกรรม ประกอบด้วย Business Drivers, Architectural Approaches, Quality Attribute Scenarios, Analyze Approaches และ Sensitivity & Tradeoff Points' },
    { question: 'Quality Attribute Scenario ที่ดีต้องมีโครงสร้างแบบไหน', answer: 'ต้องประกอบด้วยสถานการณ์กระตุ้น (stimulus) เงื่อนไขแวดล้อม (environment) และการตอบสนองที่วัดผลได้ (response measure) เช่น "เมื่อมี 100,000 request พร้อมกันในนาทีแรก ระบบต้องตอบกลับภายใน 3 วินาที โดย error rate ไม่เกิน 1%"' },
    { question: 'Sensitivity point กับ Tradeoff point ต่างกันยังไง', answer: 'Sensitivity point คือจุดที่การเปลี่ยนแปลงสถาปัตยกรรมกระทบ quality attribute เดียว ส่วน tradeoff point คือจุดที่การเปลี่ยนแปลงนั้นกระทบหลาย quality attribute พร้อมกันในทิศทางตรงข้ามกัน เช่นเพิ่ม consistency แล้ว availability ลดลง' },
  ],
  'quality-attributes:tradeoff-case': [
    { question: 'ในเคสระบบแชทข้าม region ทำไมถึงเลือกทั้ง strong consistency และ low latency เต็มร้อยพร้อมกันไม่ได้', answer: 'เพราะการยืนยันความถูกต้องของลำดับข้อความข้ามระยะทางไกลต้องใช้เวลาตาม network round-trip จริง (150-250ms ข้ามทวีป) การรอยืนยันทำให้ latency สูงขึ้น ส่วนการแสดงผลทันทีโดยไม่รอยืนยันทำให้เสี่ยงลำดับข้อความสลับกันชั่วขณะ' },
    { question: 'ทางออกที่เลือกใช้จริงในเคสนี้คืออะไร ทำงานอย่างไร', answer: 'ใช้ local sequencer แสดงข้อความทันทีสำหรับผู้ใช้ใน region เดียวกัน (latency ต่ำ) และใช้ Hybrid Logical Clock จัดเรียงลำดับข้อความข้าม region ใหม่แบบ background หลัง sync เสร็จ เป็นทางออกแบบผสมที่ได้ทั้ง latency ต่ำและความถูกต้องของลำดับในที่สุด' },
    { question: 'บทเรียนจากเคส trade-off นี้เอาไปใช้กับสถานการณ์อื่นได้อย่างไร', answer: 'ใช้ขั้นตอนเดียวกันได้: ระบุ quality attribute สองตัวที่แข่งกันให้ชัด หาข้อจำกัดทางเทคนิคที่ทำให้เลือกทั้งคู่เต็มร้อยไม่ได้ ดูว่า user experience จริงของระบบให้น้ำหนักด้านไหนมากกว่า แล้วมองหาทางออกแบบผสมแทนการเลือกสุดโต่งด้านเดียว' },
  ],
  'architecture-case-studies:ecommerce-checkout': [
    { question: 'ทำไม Payment ถึงมักเป็น service แรกที่แยกออกจาก monolith ของระบบ checkout ก่อนส่วนอื่น?', answer: 'เพราะ Payment มีอัตราการเปลี่ยนแปลงสูง (ต้องรองรับผู้ให้บริการชำระเงินใหม่บ่อย), ต้องผ่านมาตรฐาน compliance อย่าง PCI-DSS ซึ่งถ้าแยก scope การ audit จะเล็กลงมาก และมีรูปแบบการ scale ที่ต่างจากส่วน browse สินค้าอย่างชัดเจน การแยกออกมาทำให้ deploy, scale และ audit ได้อิสระโดยไม่กระทบส่วนอื่นของระบบ' },
    { question: 'ทำไมการรวม Order aggregate กับ Payment aggregate เป็นก้อนเดียวกันถึงมักเป็นการออกแบบที่ผิดพลาดตามหลัก DDD?', answer: 'เพราะแม้ Order กับ Payment จะดูเกี่ยวข้องกัน (จ่ายเงินเพื่อสั่งของ) แต่ทั้งสองมี ubiquitous language, rate of change และ consistency requirement ต่างกันมาก — Order เปลี่ยนบ่อยตามฟีเจอร์ธุรกิจ ส่วน Payment ต้องการ strong consistency เข้มงวดและมี invariant ของตัวเอง (เช่น authorize ต้อง capture ภายในเวลาที่กำหนด) การแยก aggregate ทำให้แต่ละฝั่งพัฒนาและควบคุม consistency ได้อิสระ แม้จะต้องจัดการการประสานงานข้าม aggregate เพิ่มขึ้นก็ตาม' },
    { question: 'ในระบบ checkout เพราะเหตุใดการแสดงจำนวนสต๊อกบนหน้าเว็บถึงยอมรับ eventual consistency ได้ แต่ตอนจองสต๊อกจริงตอน checkout ต้องใช้ strong consistency?', answer: 'เพราะ consistency requirement ไม่ใช่คุณสมบัติของทั้งระบบ แต่ขึ้นกับ use case — การแสดงผลจำนวนสต๊อกคลาดเคลื่อนไม่กี่วินาทีไม่กระทบธุรกิจ แต่การจองสต๊อกจริงต้องเช็คแบบ strong เพื่อป้องกัน oversell (ขายสินค้าเกินจำนวนที่มีจริง) ซึ่งเป็น invariant สำคัญที่สุดของ Inventory context' },
  ],
  'architecture-case-studies:notification-platform': [
    { question: 'ทำไม Order Service ควร publish event เข้า event bus แทนที่จะเรียก Notification Service แบบ synchronous โดยตรง?', answer: 'เพราะการเรียกแบบ synchronous จะทำให้ Order Service ต้องรู้จักทุก client ที่ต้องแจ้งเตือน (tight coupling) และถ้า Notification Service ช้าหรือล่ม จะดึงให้ Order Service ช้าตามไปด้วย (cascading failure) ทั้งที่การแจ้งเตือนไม่ได้อยู่ใน critical path ของการสั่งซื้อ การใช้ event-driven architecture ทำให้ Order Service แค่ publish event แล้วจบหน้าที่ทันที ผู้รับ (subscriber) จะมีกี่รายก็ได้โดยไม่ต้องแก้โค้ดต้นทาง' },
    { question: 'เมื่อไหร่ที่ควรเลือก Serverless FaaS แทน Worker Pool แบบ long-running สำหรับ Notification Service และเมื่อไหร่ที่ควรเลือกตรงข้าม?', answer: 'ควรเลือก Serverless FaaS เมื่อ traffic ของ event ไม่สม่ำเสมอมาก (มีช่วงเงียบยาวสลับกับช่วงพุ่งสูง) และไม่ต้องการ latency ที่แน่นอนเป๊ะ เพราะจะช่วยประหยัดต้นทุนตอน idle ได้มาก แต่ต้องยอมรับ cold start เป็นครั้งคราว ส่วน Worker Pool เหมาะกับกรณีที่ต้องการ latency สม่ำเสมอไม่มี cold start และ utilization ของ traffic สูงสม่ำเสมอตลอดเวลาอยู่แล้ว ซึ่งจะคุ้มกว่าเรื่องต้นทุน' },
    { question: 'การที่ Notification Service ยอมรับ eventual consistency ได้ ต่างจาก Payment Service ในเคส checkout อย่างไร และทำไมถึงยอมรับต่างกันได้?', answer: 'Notification Service ยอมให้แจ้งเตือนผู้ใช้ช้ากว่าเหตุการณ์จริงไม่กี่วินาทีถึงนาทีได้ เพราะความล่าช้าเล็กน้อยไม่สร้างความเสียหายจริง ต่างจาก Payment ที่ต้องการ strong consistency เพราะการเก็บเงินซ้ำหรือเก็บเงินไม่สำเร็จแต่บันทึกว่าสำเร็จคือความเสียหายที่ยอมรับไม่ได้ — นี่สะท้อนหลักการว่าระดับ consistency ที่ต้องการขึ้นกับความเสี่ยงจริงของแต่ละโดเมน ไม่ใช่กฎตายตัวของทั้งระบบ' },
  ],
  'architecture-case-studies:core-banking-ledger': [
    { question: 'Ledger Context ต่างจาก Transaction Context อย่างไร ทำไมถึงต้องแยกเป็นคนละ bounded context?', answer: 'Transaction Context เป็นคน \'สั่งการ\' การเปลี่ยนแปลง (initiator) เก็บสถานะของคำสั่งโอนหนึ่งครั้ง ส่วน Ledger Context เป็น \'แหล่งความจริงเดียว\' (source of truth) ของยอดเงินทั้งระบบ บันทึกแบบ double-entry bookkeeping ที่เขียนแล้วห้ามแก้ไขหรือลบ (append-only) ยอด Balance ที่แสดงจริงคำนวณมาจาก ledger entries ไม่ใช่ตัวเลขที่แก้ทับได้โดยตรง การแยกสอง context นี้ทำให้ \'คนสั่ง\' กับ \'ความจริงสุดท้ายที่ audit ได้\' แยกขาดจากกันอย่างชัดเจน ตรงตาม regulation ที่ต้องการ audit trail ที่แก้ไขย้อนหลังไม่ได้' },
    { question: 'ต่อยอดจาก CAP Theorem เพราะเหตุใด Ledger Service ต้องเลือก CP (Consistency over Availability) ในขณะที่ service อื่นในธนาคารเดียวกันอย่าง Notification หรือ Analytics เลือก AP ได้?', answer: 'เพราะ Ledger เก็บยอดเงินจริงที่ต้องถูกต้อง 100% ตลอดเวลา หากเกิด network partition แล้วยอมให้ระบบยัง available อยู่โดยไม่การันตี consistency อาจทำให้เงินถูกโอนซ้ำหรือยอดเงินสองฝั่งไม่ตรงกัน ซึ่งเป็นความเสียหายจริงและผิด regulation ธนาคารกลาง จึงต้องยอมให้ระบบ unavailable ชั่วคราวดีกว่า ในขณะที่ Notification หรือ Analytics ไม่ได้ถือเงินจริง ข้อมูล stale ไปชั่วคราวไม่สร้างความเสียหายร้ายแรง จึงเลือกความพร้อมใช้งานสูงกว่าได้อย่างปลอดภัย' },
    { question: 'ทำไมยอดเงินคงเหลือ (Balance) ในระบบ core banking ถึงไม่ควรถูกเก็บเป็นตัวเลขเดี่ยวที่แก้ทับได้โดยตรง?', answer: 'เพราะถ้าเก็บ Balance เป็นตัวเลขเดี่ยวที่แก้ทับได้ตรงๆ จะไม่มีหลักฐานว่ายอดเงินมาจากรายการไหนบ้าง ตรวจสอบย้อนหลังไม่ได้ และเสี่ยงต่อ race condition เวลามีธุรกรรมพร้อมกันหลายรายการ การใช้ double-entry ledger ที่ append-only ทำให้ยอดเงินคำนวณจากผลรวมของ entry ทั้งหมด ตรวจสอบและ audit ย้อนหลังได้ทุกรายการ สอดคล้องกับข้อกำหนดของ regulation ธนาคารกลางที่ต้องการความโปร่งใสของทุกธุรกรรม' },
  ],

  'deployment-infra-architecture:containerization-basics': [
    { question: 'Container ต่างจาก Virtual Machine (VM) ตรงไหนในเชิงเทคนิค?', answer: 'Container ไม่จำลองฮาร์ดแวร์หรือมี OS kernel เป็นของตัวเอง แต่เป็น process ที่ถูกกั้นขอบเขตให้เห็นแค่ filesystem/network/dependency ของตัวเอง โดยยังแชร์ kernel เดียวกับเครื่อง host อยู่ ส่วน VM จำลองฮาร์ดแวร์ทั้งเครื่องและมี Guest OS แยกต่างหาก ทำให้ container เบากว่าและ startup เร็วกว่ามาก' },
    { question: 'Image กับ Container ต่างกันอย่างไร?', answer: 'Image คือพิมพ์เขียว (blueprint) ที่เป็นไฟล์นิ่งเก็บ code, library และ config ทั้งหมด ส่วน Container คือของจริงที่กำลังรันอยู่ ซึ่งถูกสร้างขึ้นจาก image นั้น จาก image เดียวสามารถสร้าง container ที่รันพร้อมกันได้หลายตัว' },
    { question: 'Container ช่วยแก้ปัญหา "works on my machine" ได้อย่างไร?', answer: 'เพราะ image ห่อรวมทุกอย่างที่โปรแกรมต้องการไว้ในตัวเองแล้ว ไม่ว่าจะรันบนเครื่อง developer หรือ production ถ้าใช้ image เดียวกันก็ได้ environment ที่เหมือนกันทุกประการ ตัดปัญหาเวอร์ชัน library หรือ config ไม่ตรงกันระหว่างเครื่อง' },
  ],
  'deployment-infra-architecture:container-orchestration': [
    { question: 'ทำไมระบบที่มี container จำนวนมากถึงต้องมี Container Orchestration เช่น Kubernetes?', answer: 'เพราะเมื่อมี container กระจายอยู่หลายเครื่อง จะมีงานที่ต้องจัดการซ้ำๆ อย่างต่อเนื่อง ได้แก่ scheduling (วาง container ลงเครื่องที่ว่าง), restart เมื่อ container ตาย, scaling ตามโหลด และ service discovery ระหว่าง container ที่ IP เปลี่ยนตลอดเวลา ซึ่งทำด้วยมือไม่ไหวเมื่อระบบใหญ่ขึ้น' },
    { question: 'Pod, Deployment และ Service ใน Kubernetes ทำหน้าที่ต่างกันอย่างไร?', answer: 'Pod คือหน่วยที่เล็กที่สุดที่ Kubernetes จัดการ ปกติห่อ container หนึ่งตัว Deployment คือคำสั่งกำหนดว่าต้องการ Pod กี่ตัวและคอยรักษาจำนวนนั้นไว้เสมอ (รวมถึงสร้างทดแทนเมื่อ Pod ตาย) ส่วน Service คือจุดเชื่อมต่อที่มี IP/ชื่อคงที่ให้ client เรียก แม้ Pod ข้างหลังจะถูกสร้างใหม่/ทำลายจน IP เปลี่ยนไปตลอดก็ตาม' },
    { question: '"Self-healing" ใน Kubernetes หมายถึงอะไร และเกิดขึ้นได้อย่างไร?', answer: 'Self-healing คือความสามารถของ Kubernetes ในการสร้าง Pod ใหม่ทดแทนอัตโนมัติเมื่อ Pod เดิมตาย โดยไม่ต้องมีคนมาสั่งเอง เกิดจาก control loop ที่คอยเปรียบเทียบจำนวน Pod จริงกับ desired state ที่ประกาศไว้ใน Deployment ตลอดเวลา ถ้าไม่ตรงกันจะสั่งสร้างใหม่ทันที' },
  ],
  'deployment-infra-architecture:cloud-native-patterns': [
    { question: '"Cloud-Native" หมายถึงอะไร และต่างจากแค่ "รันบน cloud" อย่างไร?', answer: 'Cloud-Native เป็นปรัชญาการออกแบบระบบให้ใช้ประโยชน์จากธรรมชาติของ cloud ตั้งแต่แรก เช่น รับมือกับ instance ที่ถูกสร้าง/ทำลายตลอดเวลา เครื่องล่มได้ทุกเมื่อ และต้อง scale ขึ้นลงได้ ไม่ใช่แค่การยกโปรแกรมเดิมไปวางรันบนเครื่องของ cloud provider โดยไม่ปรับการออกแบบ' },
    { question: 'หลักการ 12-Factor App สามข้อที่สำคัญด้านสถาปัตยกรรมคืออะไร?', answer: 'หนึ่งคือ config ผ่าน environment variable แทนการ hardcode ในโค้ด สองคือ stateless process ที่ไม่เก็บ state สำคัญไว้ในตัว instance เอง และสามคือ disposability คือ instance ต้อง start เร็วและ shutdown ได้อย่างนุ่มนวล เพราะถูกสร้าง/ทำลายบ่อยเป็นเรื่องปกติ' },
    { question: 'Sidecar Pattern คืออะไร และ Service Mesh เกี่ยวข้องกันอย่างไร?', answer: 'Sidecar Pattern คือการแปะ container ผู้ช่วยไว้คู่กับทุก Pod เพื่อจัดการ cross-cutting concern เช่น mTLS, retry, การเก็บ metric แทนที่ business code จะต้อง implement เอง เมื่อทุก service ในระบบมี sidecar แบบนี้ รวมกันเรียกว่า Service Mesh ซึ่งบังคับใช้นโยบายเดียวกันได้สม่ำเสมอทั่วทั้งระบบโดยไม่ขึ้นกับภาษาที่แต่ละ service เขียน' },
  ],
  'deployment-infra-architecture:multi-region-deployment': [
    { question: 'ทำไมระบบที่มีผู้ใช้ทั่วโลกถึงต้องพิจารณา Multi-Region Deployment?', answer: 'มีสองเหตุผลหลัก คือลด latency ให้ผู้ใช้แต่ละภูมิภาคโดยมี region ใกล้ตัวผู้ใช้ และเพื่อป้องกัน disaster recovery กรณี region ทั้งหมดล่ม (เช่น ไฟดับทั้งศูนย์ข้อมูล) ซึ่งถ้ามีแค่ region เดียวระบบทั้งหมดจะล่มพร้อมกันทันที' },
    { question: 'Active-Passive กับ Active-Active ต่างกันอย่างไร?', answer: 'Active-Passive มี region หลักรับ traffic ทั้งหมด ส่วน region สำรองรอเฉยๆ จนกว่า region หลักจะล่มค่อยสลับไปใช้ ส่วน Active-Active ทุก region รับ traffic พร้อมกันจริงตลอดเวลา ถ้า region ใดล่ม region ที่เหลือรับภาระต่อได้ทันทีโดยไม่ต้องสลับ แต่ Active-Active ต้องจัดการ data consistency ข้าม region ที่ซับซ้อนกว่ามาก' },
    { question: 'Multi-Region Deployment เชื่อมโยงกับ CAP Theorem อย่างไร?', answer: 'เมื่อหลาย region รับเขียนข้อมูลพร้อมกัน (โดยเฉพาะ Active-Active) ต้องเลือกระหว่างความสดใหม่ของข้อมูล (consistency) กับ latency ต่ำ เพราะการรอให้ทุก region ยืนยันข้อมูลก่อนตอบกลับทำให้ latency สูงข้ามทวีป ในขณะที่การยอมรับ eventual consistency ทำให้เร็วกว่าแต่ข้อมูลอาจไม่ตรงกันชั่วขณะระหว่าง region ซึ่งเป็น trade-off เดียวกับ CAP theorem ที่มาปรากฏในบริบทของระยะทางข้ามทวีปจริง' },
  ],
  'cqrs-event-sourcing:cqrs-basics': [
    { question: 'CQRS ย่อมาจากอะไร และหลักการสำคัญที่สุดของมันคืออะไร', answer: 'CQRS ย่อมาจาก Command Query Responsibility Segregation คือการแยกโมเดลที่ใช้เขียนข้อมูล (command) ออกจากโมเดลที่ใช้อ่านข้อมูล (query) อย่างชัดเจน แทนที่จะใช้โมเดลเดียวกันทำทั้งสองหน้าที่ Write model เน้นความถูกต้องและ normalized ส่วน Read model เน้นความเร็วในการอ่านและ denormalized' },
    { question: 'ทำไม Read Model กับ Write Model ถึงมักถูกออกแบบให้มีโครงสร้างข้อมูลต่างกัน (เช่น normalized vs denormalized)', answer: 'เพราะทั้งสองฝั่งมีเป้าหมายต่างกัน ฝั่ง write ต้องรักษาความถูกต้องของข้อมูลและตรวจสอบ business rule จึงนิยม normalize เพื่อลดข้อมูลซ้ำซ้อนและความขัดแย้ง ส่วนฝั่ง read ต้องการความเร็วในการแสดงผล จึง denormalize ข้อมูลไว้ล่วงหน้าให้พร้อมอ่านทันทีโดยไม่ต้อง join หลายตาราง' },
    { question: 'การ sync ข้อมูลจาก Write Model ไป Read Model ใน CQRS มักเป็นแบบ synchronous หรือ asynchronous และส่งผลอย่างไรต่อผู้ใช้', answer: 'มักเป็นแบบ asynchronous ทำให้เกิด eventual consistency คือมีช่วงเวลาสั้นๆ ที่ข้อมูลที่เพิ่ง write ไปแล้วยังไม่ปรากฏในฝั่ง read ทันที ผู้ใช้ที่กดบันทึกแล้วรีเฟรชหน้าทันทีอาจยังไม่เห็นข้อมูลใหม่ ทีมต้องออกแบบ UX รองรับสถานการณ์นี้' },
  ],
  'cqrs-event-sourcing:event-sourcing': [
    { question: 'Event Sourcing ต่างจากการเก็บข้อมูลแบบ current state ทั่วไปอย่างไร', answer: 'การเก็บแบบ current state จะเขียนทับค่าล่าสุดทุกครั้งที่มีการเปลี่ยนแปลง ทำให้ประวัติก่อนหน้าหายไป ส่วน Event Sourcing เก็บลำดับเหตุการณ์ทั้งหมดที่เกิดขึ้นแบบ append-only (ห้ามแก้ไขหรือลบ) แล้วคำนวณสถานะปัจจุบันโดยการ replay เหตุการณ์ทั้งหมดตามลำดับ event log คือ source of truth ไม่ใช่ค่าที่เก็บตรงๆ' },
    { question: 'Snapshot ใน Event Sourcing มีไว้เพื่อแก้ปัญหาอะไร และทำงานอย่างไร', answer: 'Snapshot มีไว้แก้ปัญหาประสิทธิภาพเมื่อ event สะสมมากขึ้นเรื่อยๆ จนการ replay ตั้งแต่ event แรกทุกครั้งช้าเกินไป วิธีแก้คือบันทึกยอดสรุปสถานะ ณ จุดใดจุดหนึ่งไว้เป็นระยะ เวลาต้องการ current state ก็โหลด snapshot ล่าสุดแล้ว replay เฉพาะ event ที่เกิดขึ้นหลังจากนั้นเท่านั้น' },
    { question: 'เพราะเหตุใด Event Sourcing จึงให้ audit trail มาโดยธรรมชาติ โดยไม่ต้องออกแบบระบบ log แยกต่างหาก', answer: 'เพราะทุกการเปลี่ยนแปลงถูกเก็บเป็น event แยกกันแบบ append-only เรียงตามลำดับเวลาอยู่แล้ว ทำให้รู้ได้เสมอว่าใครทำอะไร เมื่อไหร่ ตามลำดับไหน ต่างจากระบบ current state ทั่วไปที่ต้องสร้างกลไก audit log แยกต่างหากเพื่อบันทึกประวัติการเปลี่ยนแปลง' },
  ],
  'cqrs-event-sourcing:cqrs-event-sourcing-together': [
    { question: 'ในการผสม CQRS กับ Event Sourcing เข้าด้วยกัน Event Store กับ Read Model มีความสัมพันธ์กันอย่างไร', answer: 'Event Store เป็นฝั่ง write ที่เก็บเหตุการณ์แบบ append-only ส่วน Projector เป็น process แยกต่างหากที่ subscribe ฟัง event ใหม่จาก Event Store แล้วนำมาสร้างหรืออัปเดต Read Model (projection) ที่ denormalize พร้อมแสดงผล Query จากผู้ใช้ทั้งหมดอ่านจาก Read Model เท่านั้น ไม่แตะ Event Store โดยตรง' },
    { question: 'ทำไมการรวม CQRS กับ Event Sourcing ถึงทำให้การสร้าง Read Model รูปแบบใหม่ในอนาคตทำได้ง่ายกว่าระบบทั่วไป', answer: 'เพราะ Event Store เก็บประวัติเหตุการณ์ทั้งหมดไว้ครบถ้วนตั้งแต่ event แรก เมื่อต้องการ read model รูปแบบใหม่ที่ไม่เคยมีมาก่อน แค่เขียน Projector ตัวใหม่แล้ว replay event ทั้งหมดผ่านมันก็จะได้ read model ใหม่ที่ถูกต้องครบถ้วนทันที โดยไม่ต้องรื้อฝั่ง write หรือหาข้อมูลใหม่ ต่างจากระบบที่เก็บแค่ current state ซึ่งข้อมูลในอดีตมักถูกเขียนทับหายไปแล้ว' },
    { question: 'Projector ในสถาปัตยกรรม CQRS + Event Sourcing ทำหน้าที่อะไร และสามารถสร้าง Read Model ได้กี่ชุดจาก event stream เดียวกัน', answer: 'Projector คือ process ที่ subscribe ฟัง event ใหม่จาก Event Store แล้วประมวลผลเพื่อสร้างหรืออัปเดต Read Model สามารถสร้าง Read Model ได้หลายชุดพร้อมกันจาก event stream เดียวกัน โดยแต่ละชุดสรุปข้อมูลออกมาคนละรูปแบบตามความต้องการของแต่ละหน้าจอหรือ use case' },
  ],
  'cqrs-event-sourcing:cqrs-tradeoffs': [
    { question: 'ต้นทุนหลักที่ต้องจ่ายเมื่อนำ CQRS/Event Sourcing มาใช้มีอะไรบ้าง', answer: 'ต้นทุนหลักคือ eventual consistency ระหว่างฝั่ง write และ read, จำนวนส่วนประกอบของระบบที่เพิ่มขึ้น (event store, projector, read store แยกกัน), การ debug ที่ยากขึ้นเพราะต้องไล่หาปัญหาข้ามหลายส่วน และเส้นโค้งการเรียนรู้ที่สูงขึ้นสำหรับทีมที่ไม่เคยทำงานกับแนวคิดนี้มาก่อน' },
    { question: 'ระบบแบบใดที่ไม่ควรใช้ CQRS/Event Sourcing และทำไม', answer: 'ระบบ CRUD ธรรมดาที่ไม่มี business rule ซับซ้อน ไม่ต้องการ audit trail ระดับ event และมี traffic ไม่สูงมาก เช่น ระบบจัดการรายชื่อพนักงานภายใน ไม่ควรใช้ เพราะความซับซ้อนของ CQRS/Event Sourcing (eventual consistency, ส่วนประกอบเพิ่มขึ้น, debug ยากขึ้น) จะกลายเป็นต้นทุนล้วนๆ โดยไม่มีประโยชน์มาชดเชย' },
    { question: 'เงื่อนไขแบบใดที่ทำให้ต้นทุนความซับซ้อนของ CQRS/Event Sourcing คุ้มค่าที่จะใช้', answer: 'คุ้มค่าเมื่อโดเมนมีข้อกำหนดด้าน audit/compliance เข้มงวด เช่น การเงินหรือสุขภาพ, ต้องการ read model หลายรูปแบบที่แตกต่างกันมากจากข้อมูลชุดเดียวกัน หรือมีอัตราส่วน read/write ที่เหลื่อมกันสุดขั้วจนต้อง scale สองฝั่งอิสระจากกันจริงๆ ไม่ใช่แค่คาดเดาว่าอาจต้องการในอนาคต' },
  ],
  'team-topologies:four-team-types': [
    { question: 'Stream-aligned team ต่างจาก Platform team อย่างไร ในแง่ของ \'ใครคือลูกค้า\' ของแต่ละทีม', answer: 'Stream-aligned team ส่งมอบคุณค่าให้ลูกค้าปลายทางของธุรกิจโดยตรง (end-to-end ตาม value stream หนึ่งสาย) ส่วน Platform team มีทีม stream-aligned เป็น \'ลูกค้าภายใน\' โดยสร้างเครื่องมือ/infrastructure แบบ self-service เพื่อลด cognitive load ให้ทีมเหล่านั้น ไม่ได้ส่งมอบคุณค่าให้ผู้ใช้ปลายทางโดยตรง' },
    { question: 'ทำไม Enabling team จึงถูกออกแบบให้เป็นความสัมพันธ์ \'ชั่วคราว\' ไม่ใช่ถาวรเหมือนอีก 3 ประเภททีม', answer: 'เพราะเป้าหมายของ Enabling team คือการโค้ชให้ทีมเป้าหมายมีทักษะที่ขาดไปติดตัวเอง ไม่ใช่ทำงานแทน ถ้า Enabling team กลายเป็นความสัมพันธ์ถาวรที่ทีมอื่นต้องพึ่งพาตลอด แสดงว่าการถ่ายทอดความรู้ล้มเหลว และทีมนั้นกำลังทำหน้าที่เหมือน Collaboration แบบไม่มีที่สิ้นสุดแทน' },
    { question: 'Complicated-Subsystem team กับ Platform team ต่างกันอย่างไรในเชิงเป้าหมาย แม้ทั้งคู่จะดูเป็นทีม \'เฉพาะทาง\' เหมือนกัน', answer: 'Platform team มีไว้ลดงาน/ลด cognitive load ของทีมอื่นผ่าน self-service tooling ส่วน Complicated-Subsystem team มีไว้ห่อหุ้มความซับซ้อนที่จำเป็นต้องมีอยู่จริง (essential complexity) ซึ่งทีมอื่นไม่ควรต้องเรียนรู้ลึก เช่น video-codec หรือการคำนวณเฉพาะทาง โดยให้บริการผ่าน API หรือ interface ที่ชัดเจนเท่านั้น' },
  ],
  'team-topologies:team-interaction-modes': [
    { question: 'เพราะเหตุใด X-as-a-Service จึงควรเป็นโหมดปฏิสัมพันธ์เริ่มต้น (default) ระหว่างทีมส่วนใหญ่ในองค์กร มากกว่า Collaboration', answer: 'เพราะ X-as-a-Service มี communication overhead ต่ำที่สุด ทีมเรียกใช้ผลงานของอีกทีมผ่าน API/tool แบบ self-service โดยแทบไม่ต้องสื่อสารกันโดยตรง ทำให้แต่ละทีมทำงานอิสระและเร็วขึ้น ต่างจาก Collaboration ที่ต้อง sync กันตลอดเวลาซึ่งมีต้นทุนสูงและควรใช้เฉพาะช่วงที่ต้องค้นหาคำตอบใหม่ร่วมกันเท่านั้น' },
    { question: 'ถ้าพบว่าทีมสองทีมต้องประชุมกันแบบ Collaboration ทุกสัปดาห์มาต่อเนื่องเป็นปี โดยไม่มีทีท่าว่าจะจบ ควรตีความสถานการณ์นี้อย่างไรตามกรอบ Team Interaction Modes', answer: 'นี่คือสัญญาณเตือนว่าความสัมพันธ์นี้ควรถูกเปลี่ยนเป็น X-as-a-Service แล้ว เพราะ Collaboration ควรมีกรอบเวลาจำกัดเพื่อค้นหาคำตอบใหม่เท่านั้น การที่มันยืดเยื้อแสดงว่า contract หรือ API ระหว่างสองทีมยังไม่นิ่งพอ ควรลงทุนปรับปรุงให้เกิด self-service interface ที่ชัดเจนแทนการประชุม sync กันตลอดไป' },
    { question: 'Facilitating ต่างจาก Collaboration อย่างไร ทั้งที่ทั้งคู่เป็นโหมดปฏิสัมพันธ์แบบชั่วคราวเหมือนกัน', answer: 'Collaboration คือสองทีมทำงานร่วมกันแบบเท่าเทียมเพื่อค้นหาคำตอบใหม่ที่ยังไม่มีใครรู้ ส่วน Facilitating มีทิศทางความสัมพันธ์ชัดเจนกว่า คือฝ่ายหนึ่ง (มักเป็น Enabling team) ทำหน้าที่โค้ช/ช่วยเหลืออีกฝ่ายที่กำลังขาดทักษะหรือติดขัด จนกว่าฝ่ายนั้นจะทำเองได้แล้วจึงถอยออกไป' },
  ],
  'team-topologies:team-topologies-and-architecture': [
    { question: 'Inverse Conway Maneuver คืออะไร และต่างจากการปล่อยให้ Conway\'s Law เกิดขึ้นตามธรรมชาติอย่างไร', answer: 'Inverse Conway Maneuver คือการจงใจจัดโครงสร้างทีมใหม่ให้ตรงกับสถาปัตยกรรมเป้าหมายก่อน แทนที่จะรอให้สถาปัตยกรรมค่อยๆ ก่อตัวขึ้นตามโครงสร้างทีมเดิมโดยไม่ตั้งใจ เช่น แบ่งทีมใหญ่ทีมเดียวออกเป็นหลายทีม stream-aligned ตาม bounded context ก่อน เพื่อให้โค้ดที่แต่ละทีมผลิตออกมามีแนวโน้มแยกเป็น service ตามขอบเขตนั้นตามธรรมชาติ' },
    { question: 'cognitive load คืออะไร และเกี่ยวข้องอย่างไรกับเหตุผลที่ Platform team ควรมีอยู่', answer: 'cognitive load คือขีดจำกัดความซับซ้อนที่ทีมหนึ่งสามารถถือและจัดการได้อย่างมีประสิทธิภาพในเวลาเดียวกัน ถ้าทีม stream-aligned ต้องแบกทั้ง business logic ของ domain ตัวเองและรายละเอียด infrastructure พร้อมกัน cognitive load จะสูงเกินไป Platform team จึงมีไว้ดูดซับความซับซ้อนส่วนที่ไม่ใช่แก่นธุรกิจ (เช่น extraneous complexity ด้าน infra) ออกไป เพื่อให้ทีม stream-aligned โฟกัสกับ domain ของตัวเองได้เต็มที่' },
    { question: 'เพราะเหตุใดการออกแบบขอบเขตทีมให้ตรงกับ bounded context (จากโมดูล Domain-Driven Design) จึงสำคัญ ถ้าหลายทีมมาแตะ bounded context เดียวกันจะเกิดปัญหาอะไร', answer: 'ถ้าหลายทีมดูแล bounded context เดียวกันพร้อมกัน แต่ละทีมมักตีความ business rule ในขอบเขตนั้นไม่ตรงกัน ทำให้โมเดลของ context นั้นเริ่มขัดแย้งกันเอง ในขณะที่ถ้าทีมเดียวดูแลหลาย bounded context พร้อมกัน ทีมนั้นต้องสลับ mental model ไปมาตลอดเวลาซึ่งเป็นภาระ cognitive load เพิ่มเติม การจับคู่ 1 ทีมต่อ 1 bounded context จึงเป็นจุดที่สถาปัตยกรรมและโครงสร้างองค์กรมาบรรจบกันได้ดีที่สุด' },
  ],
  'evolutionary-architecture:fitness-functions': [
    { question: 'Fitness Function คืออะไร และต่างจาก unit test ทั่วไปยังไง', answer: 'Fitness Function คือการทดสอบอัตโนมัติที่วัดว่าคุณสมบัติสถาปัตยกรรม (เช่น dependency ระหว่าง module, response time, ขนาด deployable package) ยังอยู่ในเกณฑ์ที่ยอมรับได้หรือไม่ ต่างจาก unit test ทั่วไปที่เช็คความถูกต้องของ business logic ตรงที่ fitness function เช็คคุณภาพเชิงโครงสร้างของระบบแทน' },
    { question: 'ทำไม fitness function ต้องผูกเข้ากับ CI/CD pipeline แทนที่จะรันแบบ manual เป็นครั้งคราว', answer: 'เพราะถ้ารันแบบ manual จะพึ่งพาความจำหรือวินัยของคน ซึ่งพลาดง่ายเมื่อทีมโตขึ้นหรือมีคนใหม่เข้ามา การผูกเข้ากับ CI/CD ทำให้ตรวจสอบอัตโนมัติทุกครั้งที่มีการเปลี่ยนแปลงโค้ด จับปัญหาได้ทันทีก่อน merge แทนที่จะรู้ตัวตอน production พังแล้ว (shift-left)' },
    { question: 'Static fitness function กับ Dynamic fitness function ต่างกันยังไง ยกตัวอย่างแต่ละแบบ', answer: 'Static fitness function รันตอน build เช่นเดียวกับ unit test เช็คสิ่งที่วัดได้จากโค้ดโดยตรง เช่น dependency graph ด้วย ArchUnit หรือ dependency-cruiser ส่วน Dynamic fitness function รันต่อเนื่องบน runtime หรือ production จริง เช่น ผูก APM กับ alert threshold เพื่อเช็ค response time หรือ error rate ที่วัดได้เฉพาะตอนระบบรับ load จริงเท่านั้น' },
  ],
  'evolutionary-architecture:architecture-erosion': [
    { question: 'Architecture Erosion คืออะไร และทำไมถึงอันตรายกว่าการตัดสินใจเปลี่ยนสถาปัตยกรรมแบบตั้งใจ', answer: 'Architecture Erosion คือช่องว่างที่ค่อยๆ ถ่างออกระหว่างสถาปัตยกรรมที่ตั้งใจออกแบบไว้กับสถาปัตยกรรมที่ระบบมีอยู่จริง โดยไม่มีใครตัดสินใจให้เกิดขึ้น มันอันตรายกว่าเพราะไม่มีบันทึกหรือแผนรองรับ ไม่มีใครรู้ตัวว่ากำลังเบี่ยงไปไกลแค่ไหน ต่างจาก technical debt แบบตั้งใจที่มีการบันทึกเหตุผลและแผนจ่ายคืนชัดเจน' },
    { question: 'Intentional technical debt กับ unintentional erosion ต่างกันตรงไหน และ ADR ช่วยแยกทั้งสองแบบยังไง', answer: 'Intentional technical debt คือการตัดสินใจร่วมกันของทีม มีการบันทึกเหตุผลและแผนจ่ายคืน เช่นเขียนเป็น ADR ส่วน unintentional erosion ไม่มีใครตัดสินใจ เกิดจากทางลัดเล็กๆ ที่สะสมทีละจุดโดยไม่มีบันทึกใดๆ การเขียน ADR ทุกครั้งที่ทีมยอมแลก (trade-off) อะไรบางอย่างเชิงสถาปัตยกรรม ช่วยให้เห็นความแตกต่างชัดเจนระหว่าง debt ที่ทีมรู้ตัวและ erosion ที่ไม่มีใครรู้ตัว' },
    { question: 'มีวิธีอะไรบ้างที่ช่วยจับ architecture erosion ให้ทันก่อนที่ระบบจะกลายเป็น big ball of mud', answer: 'สองวิธีหลักคือ (1) ใช้ fitness function ผูกกับ dependency ที่ตกลงกันไว้ ให้ build fail ทันทีถ้ามีการ import ข้าม boundary ที่ห้ามไว้ แทนที่จะพึ่งการรีวิวโค้ดด้วยสายตาอย่างเดียว และ (2) ทำ architecture review เป็นระยะ เช่นทุกไตรมาส เพื่อวาด dependency diagram จริงจากโค้ดปัจจุบันเทียบกับที่ออกแบบไว้ตอนแรก' },
  ],
  'evolutionary-architecture:common-anti-patterns': [
    { question: 'Distributed Monolith คืออะไร และทำไมถึงแย่กว่าการอยู่เป็น monolith เดิมในบางแง่มุม', answer: 'Distributed Monolith คือระบบที่ถูกแยกเป็นหลาย service บนกระดาษ แต่ยังผูกกันแน่นจนต้อง deploy พร้อมกันเสมอ เรียกกันแบบ synchronous เป็นสายยาว และมักแชร์ database เดียวกัน มันแย่กว่า monolith เดิมเพราะทีมต้องแบกรับความซับซ้อนด้าน operations ของ microservices เต็มๆ (network, monitoring, service discovery) แต่กลับไม่ได้ประโยชน์เรื่อง independent deployability เลย' },
    { question: 'Chatty Services มีอาการยังไง และเป็นสัญญาณของปัญหาอะไรในการออกแบบ', answer: 'Chatty Services คืออาการที่ operation เดียวต้องอาศัย network call ไปมาระหว่างสอง service หลายรอบกว่าจะเสร็จ ทำให้ latency สะสมจากจำนวนรอบมากกว่างานจริง มักเป็นสัญญาณว่า service boundary ถูกตัดผิดจุด ข้อมูลที่ควรอยู่ด้วยกันในการตัดสินใจครั้งเดียวถูกแยกไปอยู่คนละ service วิธีแก้คือออกแบบ API แบบ coarse-grained หรือทบทวน boundary ใหม่' },
    { question: 'ทำไม Shared Database ถึงถือเป็น anti-pattern ทั้งที่ดูเหมือนประหยัดและสะดวกตอนเริ่มโปรเจกต์', answer: 'เพราะ Shared Database ทำลาย encapsulation ของแต่ละ service ทำให้ service ใดๆ ถูกทำให้พังได้จากการเปลี่ยน schema ของอีก service ที่ตัวเองไม่รู้จักด้วยซ้ำ ไม่มีใครกล้า migrate schema เพราะไม่รู้ว่ามีใครพึ่งพา table นั้นอยู่บ้าง เป็น coupling ที่มองไม่เห็นในโค้ดแต่มีจริงในระดับ schema ต่างจาก microservices ที่แต่ละ service ควรเป็นเจ้าของ database ตัวเองและเข้าถึงผ่าน API เท่านั้น' },
  ],
  'systems-thinking-foundations:what-is-a-system': [
    { question: 'ตามนิยามของ Donella Meadows ระบบ (system) ต้องประกอบด้วยสามอย่างอะไรบ้าง', answer: 'Elements (ส่วนประกอบ), Interconnections (การเชื่อมโยงระหว่างส่วนประกอบ), และ Purpose/Function (จุดประสงค์ที่ระบบพยายามทำให้เกิดขึ้น) — ขาดอย่างใดอย่างหนึ่งไปก็ไม่เรียกว่าระบบ' },
    { question: 'ทำไมสองทีมที่มีวิศวกรเก่งพอกันทุกประการ ถึงมี throughput ต่างกันได้มาก', answer: 'เพราะ interconnection (โครงสร้างความสัมพันธ์ เช่น ใครต้อง approve ก่อน merge) ต่างกัน แม้ element (ตัวคน) จะเหมือนกันทุกประการ พฤติกรรมของระบบจึงต่างกันได้จากโครงสร้างล้วนๆ ไม่ใช่จากความสามารถของคน' },
    { question: 'ทำไม Meadows ถึงบอกว่าควรดู purpose ที่แท้จริงของระบบจาก "พฤติกรรม" ไม่ใช่จาก "คำประกาศ"', answer: 'เพราะคำประกาศ purpose อย่างเป็นทางการอาจต่างจากสิ่งที่ระบบทำซ้ำๆ จริง เช่น ทีมประกาศว่าเน้นคุณภาพแต่ deploy ทุกอย่างวันศุกร์บ่ายเพื่อให้ทันโควตา — พฤติกรรมจริงสะท้อน purpose ที่แท้จริงได้แม่นยำกว่าคำพูด' },
  ],
  'systems-thinking-foundations:linear-vs-systems-thinking': [
    { question: 'Linear thinking กับ Systems thinking ต่างกันตรงไหนเป็นหลัก', answer: 'Linear thinking มองเหตุ-ผลเป็นสายโซ่ทางเดียว A→B→C จบ ไม่มีอะไรย้อนกลับ ส่วน systems thinking มองหาว่าผลลัพธ์ (B) ย้อนกลับมามีผลต่อสาเหตุ (A) อีกทีหรือไม่ (feedback loop), มี delay ระหว่างเหตุกับผลไหม, และมีตัวแปรอื่นที่ได้รับผลกระทบไปด้วยหรือเปล่า' },
    { question: 'ทำไมการ "จ้างคนเพิ่ม" เพื่อแก้ปัญหา ticket ค้าง อาจทำให้ ticket ค้างมากขึ้นในช่วงแรก', answer: 'เพราะคนใหม่ต้องมีคน onboarding สอนงาน ซึ่งดึงเวลาคนเก่งในทีมออกจากการตอบ ticket ไปสอนแทน ทำให้ ticket ค้างมากขึ้นชั่วคราวก่อนที่คนใหม่จะเริ่มตอบ ticket ได้เร็วพอ (มี delay หลายเดือน) — นี่คือสิ่งที่ linear thinking มองไม่เห็นเพราะคิดแค่ "จ้างเพิ่ม = จบเรื่อง"' },
    { question: 'เพราะเหตุใดวิศวกรที่เก่ง debugging ปัญหา production มักเก่ง systems thinking โดยไม่รู้ตัว', answer: 'เพราะการ debug ปัญหาที่ "แก้ตรงนี้ กลับไปพังตรงโน้น" (เช่น เพิ่ม cache ลด load แต่ทำให้ query ไม่เคยถูก optimize จนพังหนักตอน cache invalidate) คือการเจอ feedback loop และผลข้างเคียงที่ซ่อนอยู่ ซึ่งเป็นแก่นของ systems thinking พอดี' },
  ],
  'systems-thinking-foundations:structure-produces-behavior': [
    { question: 'หลักการ "structure produces behavior" หมายความว่าอย่างไร', answer: 'โครงสร้างของระบบเป็นตัวผลิตพฤติกรรมของระบบออกมา ไม่ใช่ความตั้งใจดีหรือความสามารถส่วนบุคคลของคนในระบบ — เอาคนเก่งแค่ไหนก็ตาม ใส่เข้าไปในโครงสร้างที่ผิด ก็ยังได้พฤติกรรมแบบเดิม' },
    { question: 'ทำไมการแก้ปัญหาด้วยการ "เปลี่ยนคน" (ไล่ออก จ้างใหม่) มักไม่ได้ผลถาวร', answer: 'เพราะถ้าโครงสร้างเดิมยังอยู่ คนใหม่ที่เข้ามาก็จะค่อยๆ ถูกโครงสร้างนั้น "ปั้น" ให้แสดงพฤติกรรมแบบเดิมออกมาอีก เหมือนน้ำที่เทลงแม่พิมพ์ ไม่ว่าจะเทน้ำชนิดไหน รูปทรงที่ออกมาก็เป็นไปตามแม่พิมพ์เสมอ' },
    { question: 'หลักการนี้เปลี่ยนคำถามแรกเวลาระบบมีปัญหาจาก "ใครทำพลาด" เป็นคำถามอะไร', answer: 'เปลี่ยนเป็น "โครงสร้างอะไรที่ทำให้ความพลาดแบบนี้เกิดขึ้นได้ง่าย หรือแทบเป็นไปไม่ได้ที่จะไม่พลาด" — คำถามนี้นำไปสู่ทางแก้ที่ถาวรกว่า เพราะแก้ที่โครงสร้างจะคงอยู่ไม่ว่าใครจะมาอยู่ในระบบนั้นในอนาคต' },
  ],
  'stocks-and-flows:stock-flow-basics': [
    { question: 'Stock กับ Flow ต่างกันยังไง', answer: 'Stock คือปริมาณสะสม ณ ช่วงเวลาหนึ่ง วัดได้ทันทีถ้าหยุดเวลาดู (เช่น ระดับน้ำในอ่าง, เงินในบัญชี) ส่วน Flow คืออัตราการเปลี่ยนแปลงของ stock ต่อหน่วยเวลา วัดได้จากการเทียบสองช่วงเวลา (เช่น น้ำไหลเข้ากี่ลิตร/นาที)' },
    { question: '"Stock คงที่" (steady state) แปลว่าไม่มีอะไรเกิดขึ้นเลยหรือไม่ เพราะอะไร', answer: 'ไม่ใช่ — stock คงที่แค่แปลว่า inflow เท่ากับ outflow พอดี ทั้งสอง flow ยังทำงานอยู่เต็มที่ตลอดเวลา เช่น บริษัทที่พนักงานคงที่ 200 คน อาจมี turnover สูงมาก (รับเข้า-ออก 80 คน/ปี) ซึ่งซ่อนปัญหาหนักไว้ ทั้งที่ stock ดูนิ่งสงบ' },
    { question: 'ทำไม stock ถึงมี "ความเฉื่อย" (inertia) ที่ flow ไม่มี และมีผลยังไงต่อการตัดสินใจ', answer: 'เพราะ stock เปลี่ยนแปลงทันทีไม่ได้ ต้องสะสมผ่าน flow ไปเรื่อยๆ ทำให้การตัดสินใจในระบบจริงเห็นผลช้ากว่าที่คาด เช่น บริษัทหยุดกู้เพิ่มทันที (ปิด inflow) แต่หนี้ (stock) จะลดลงครึ่งหนึ่งได้ก็ต้องรอ outflow (จ่ายคืน) ค่อยๆ ทำงานไปตามเวลา' },
  ],
  'stocks-and-flows:stocks-in-software-and-orgs': [
    { question: 'Technical Debt มีโครงสร้าง stock/flow ยังไง', answer: 'Stock คือปริมาณ debt ที่สะสมอยู่ในโค้ด, Inflow คือทางลัดที่ทีมเลือกใช้เมื่อ deadline บีบ, Outflow คือเวลาที่ทีมจัดสรรไป refactor คืนหนี้นั้น — ทีมที่ไม่เคยจัดสรร outflow เลย เท่ากับปิด valve ฝั่งนั้น debt จะสะสมไม่มีวันลด' },
    { question: 'Queue ของ web server สะท้อนหลักการ stock/flow ยังไง และเชื่อมกับกลไก system design อะไรบ้าง', answer: 'Stock คือจำนวน request ที่ค้างในคิว, Inflow คืออัตรา request เข้าใหม่, Outflow คือ throughput การประมวลผล — rate limiting, circuit breaker, autoscaling ทั้งหมดคือกลไกควบคุม flow เพื่อไม่ให้ stock (คิว) วิ่งหนีจนควบคุมไม่ได้' },
    { question: 'ทำไม "acquisition" (หาผู้ใช้ใหม่) มักได้รับความสนใจมากกว่า "retention" (ลด churn) ทั้งที่มีน้ำหนักเท่ากันต่อ stock ผู้ใช้', answer: 'เพราะ acquisition เป็น inflow ที่เห็นผลชัดและวัดง่ายกว่า ทั้งที่จริงแล้ว inflow กับ outflow (churn) มีน้ำหนักเท่ากันในการกำหนดว่า stock (จำนวนผู้ใช้) จะโตหรือหด — บริษัทที่ acquisition แรงแต่ churn ก็แรงพอกัน จะเห็น user count นิ่งอยู่ที่เดิมทั้งที่เผาเงินการตลาดไปมาก' },
  ],
  'stocks-and-flows:delay-in-flows': [
    { question: 'Delay ในความหมายของ Systems Thinking คืออะไร และปัญหาหลักของมันคืออะไร', answer: 'Delay คือช่วงเวลาที่ผ่านไประหว่างการเปลี่ยน flow กับตอนที่ผลของการเปลี่ยนนั้นสะท้อนกลับมาที่ stock ที่สังเกตอยู่ ปัญหาหลักไม่ใช่การที่มันมีอยู่ (มีอยู่ในระบบเกือบทุกระบบ) แต่คือคนมักไม่รู้ตัวว่ามี delay จึงตัดสินใจซ้ำเร็วเกินไป' },
    { question: 'Delay สามแบบที่พบบ่อยในระบบซอฟต์แวร์/องค์กรคืออะไรบ้าง', answer: 'Perception delay (เวลาที่ใช้กว่าจะรู้ว่ามีปัญหา), Decision/response delay (เวลาที่ใช้กว่าจะตัดสินใจตอบสนอง), และ Implementation/effect delay (เวลาที่ใช้กว่าการตัดสินใจจะออกฤทธิ์เต็มที่)' },
    { question: 'ทำไม delay ถึงมักทำให้คนเกิดพฤติกรรม "แก้เกินจำเป็น" (overcorrection)', answer: 'เพราะไม่เห็นผลทันทีหลังตัดสินใจ คนมักคิดว่า "ยังทำน้อยไป" แล้วตัดสินใจซ้ำแรงขึ้นอีก พอผลของทั้งสองรอบมาถึงพร้อมกันในที่สุด (เพราะ delay ทำให้มาถึงช้า) ผลที่ได้จะเกินความต้องการไปไกล เช่นทีมเพิ่ม server ซ้ำหลายรอบเพราะ dashboard ที่เห็นยัง lag อยู่' },
  ],
  'feedback-loops:balancing-loops': [
    { question: 'Balancing Loop (B) มีโครงสร้างยังไง และต้องมีลักษณะอะไรเสมอในแง่ของลิงก์ลบ', answer: 'มีโครงสร้าง: สถานะปัจจุบัน → gap เทียบเป้าหมาย → การกระทำที่ลดช่องว่างนั้น → ย้อนกลับไปแก้สถานะปัจจุบัน ต้องมีลิงก์ "−" จำนวนเลขคี่ในวง เพื่อให้ผลสุดท้ายวนกลับมาหักล้างการเปลี่ยนแปลงเริ่มต้น' },
    { question: 'ยกตัวอย่างกลไกในระบบซอฟต์แวร์ที่เป็น balancing loop มา 2 อย่าง', answer: 'เช่น Autoscaling (CPU สูง → เพิ่ม instance → CPU ต่อ instance ลดลง) และ Circuit breaker (error rate สูง → ตัดการเรียก downstream ชั่วคราว → downstream ฟื้นตัว → error rate ลดลง) — ทั้งสองมีเป้าหมายที่ระบบพยายามรักษาไว้' },
    { question: 'Balancing loop ที่ "แรงเกินไป" หรือมี delay มาก จะเกิดพฤติกรรมอะไรแทนที่จะดึงเข้าเป้าหมายอย่างนุ่มนวล', answer: 'จะเกิด oscillation คือแกว่งข้ามเป้าหมายไปมาซ้ำๆ แทนที่จะไล่เข้าเป้าหมายอย่างนุ่มนวล เพราะระบบ "แก้" ตามข้อมูลที่ล้าสมัยไปแล้วเสมอ' },
  ],
  'feedback-loops:reinforcing-loops': [
    { question: 'Reinforcing Loop (R) ต่างจาก Balancing Loop ตรงไหนในแง่จำนวนลิงก์ลบ', answer: 'R loop ไม่มีลิงก์ลบเลย หรือมีลิงก์ลบเป็นจำนวนคู่ (รวมศูนย์) ทำให้ทุกครั้งที่วนครบหนึ่งรอบ ค่าที่ได้จะขยายไปในทิศทางเดิมเสมอ ไม่ใช่ถูกหักล้างเหมือน B loop' },
    { question: 'R loop เป็นสิ่งไม่ดีเสมอไปหรือไม่ ยกตัวอย่างประกอบ', answer: 'ไม่เสมอไป — R loop เป็นกลไกเบื้องหลังการเติบโตที่ดีพอๆ กับความหายนะ เช่น viral growth (ผู้ใช้บอกต่อ → ผู้ใช้ใหม่เพิ่ม → บอกต่อมากขึ้น) หรือ compound learning ของทีม (documentation ดี → onboarding เร็ว → มีเวลาเขียน documentation เพิ่ม)' },
    { question: 'ทำไม R loop ถึง "ไม่มีเป้าหมายในตัวมันเอง" และมีนัยยังไงต่อการออกแบบระบบ', answer: 'เพราะ R loop จะขยายตัวต่อไปเรื่อยๆ ไม่ว่าทิศจะบวกหรือลบ จนกว่าจะมีอย่างอื่นมาหยุดมัน (ทรัพยากรหมด, ตลาดอิ่มตัว, หรือ B loop อื่นมาคาน) — การออกแบบ R loop ที่ดีต้องรู้ล่วงหน้าว่าอะไรจะเป็นเพดานตามธรรมชาติ ไม่งั้นจะพุ่งชนกำแพงแบบไม่ทันตั้งตัว' },
  ],
  'feedback-loops:reading-causal-loop-diagrams': [
    { question: 'ขั้นตอน 3 ข้อในการอ่านว่า loop หนึ่งเป็น R หรือ B คืออะไร', answer: '1) เลือก loop หนึ่งวง เดินตามลูกศรจนกลับมาจุดเริ่มต้น 2) นับจำนวนลิงก์ "−" เฉพาะ loop นั้นวงเดียว 3) นับได้เลขคู่ (รวมศูนย์) = Reinforcing (R), นับได้เลขคี่ = Balancing (B)' },
    { question: 'จุดที่คนอ่าน causal loop diagram ผิดบ่อยที่สุดคืออะไร', answer: 'เผลอนับลิงก์ที่ไม่ได้อยู่ใน loop ที่กำลังพิจารณาปนเข้าไปด้วย เพราะไดอะแกรมจริงมักมี node ที่ share กันระหว่างหลาย loop ต้องแยกให้ชัดว่ากำลังเดินอยู่ในวงไหน' },
    { question: 'ในเคส On-call Fatigue ที่มีทั้ง R loop และ B loop ซ้อนกัน อะไรตัดสินว่าระบบจะทรุดหนักลงหรือกลับสู่สมดุลได้', answer: 'ไม่ได้อยู่ที่ว่ามี loop ไหนอยู่ในระบบ (ทั้งสองมีอยู่พร้อมกันเสมอ) แต่อยู่ที่ loop ไหนแรงกว่าในช่วงเวลานั้น — ถ้าขยายทีม (B loop) ทันก่อนที่ R loop จะวนจน fatigue สะสมหนัก ระบบจะกลับสู่สมดุลได้' },
  ],
  'feedback-loops:delay-and-loop-behavior': [
    { question: 'สัญลักษณ์ที่ใช้วาด delay บน causal loop diagram คืออะไร', answer: 'ขีดคู่ขวางเส้นลูกศร (||) ตรงตำแหน่งที่ผลไม่ได้เกิดทันที ต้องรอเวลา' },
    { question: 'Delay ใน Balancing Loop กับ Delay ใน Reinforcing Loop ทำให้เกิดปัญหาต่างกันยังไง', answer: 'Delay ใน B loop เสี่ยง oscillation/overshoot เพราะระบบแก้ซ้ำก่อนเห็นผลของรอบก่อนครบ ส่วน delay ใน R loop บดบังความเร็วที่แท้จริงของการเติบโต ทำให้รู้ตัวช้าเกินไปก่อนที่ stock จะสะสมไปไกล' },
    { question: 'ก่อนจะแก้ปัญหาที่ดูเหมือนเป็นวงป้อนกลับซ้ำ ควรถามคำถามอะไรก่อนเสมอ', answer: '"loop นี้เป็น R หรือ B" และ "มี delay อยู่บนเส้นไหนบ้าง กี่นาน" — คำตอบร่วมกันบอกได้ว่าควรรอก่อนแก้ซ้ำ (ถ้าเป็น B loop ที่มี delay) หรือควรรีบขยับก่อนสาย (ถ้าเป็น R loop ที่มี delay บดบังความเร็วจริง)' },
  ],
  'behavior-patterns:exponential-growth': [
    { question: 'Exponential growth เกิดจากโครงสร้างแบบไหน และทำไมช่วงแรกถึงดู "ไม่มีอะไรพิเศษ"', answer: 'เกิดจาก reinforcing loop ล้วนๆ ไม่มีอะไรคาน ช่วงแรกดูราบเพราะค่าสัมบูรณ์ที่เพิ่มยังเล็ก ทั้งที่สัดส่วนการเติบโต (%) เท่าเดิมตลอด พอฐานใหญ่ขึ้น ค่าสัมบูรณ์ที่เพิ่มในแต่ละรอบก็ใหญ่ขึ้นจนดู "จู่ๆ ก็พุ่ง"' },
    { question: 'Rule of 70 ใช้ประมาณอะไร และคำนวณยังไง', answer: 'ใช้ประมาณจำนวนรอบที่ค่าจะเพิ่มเป็นสองเท่า จากอัตราการเติบโตต่อรอบเป็นเปอร์เซ็นต์ (r%) คำนวณจาก 70 หาร r เช่น โต 10%/รอบ จะเพิ่มเป็น 2 เท่าใน ~7 รอบ' },
    { question: 'ทำไมไม่มี exponential growth ตัวไหนในโลกจริงที่ดำเนินต่อไปตลอดกาล', answer: 'เพราะฝ่าฝืนกฎฟิสิกส์พื้นฐาน เสมอมีขีดจำกัดตามธรรมชาติ (carrying capacity) รอสกัดกั้นอยู่ข้างหน้าเสมอ เช่น RAM ที่มีจำกัด หรือประชากรโลกที่มีจำกัด' },
  ],
  'behavior-patterns:goal-seeking-behavior': [
    { question: 'Goal-seeking behavior มาจากโครงสร้างแบบไหน และสูตรเบื้องหลังคืออะไร', answer: 'มาจาก pure balancing loop สูตรคือ ค่าใหม่ = ค่าเดิม + (เป้าหมาย − ค่าเดิม) × strength — ยิ่งใกล้เป้าหมาย gap ยิ่งเล็ก ก้าวกระโดดแต่ละรอบจึงเล็กลงเรื่อยๆ โดยอัตโนมัติ' },
    { question: 'Goal-seeking behavior เป็น "ภาพสะท้อนในกระจก" ของอะไร', answer: 'เป็นภาพสะท้อนของ exponential growth — โตแบบทวีคูณเข้าหาศูนย์ (หรือเป้าหมาย) แทนที่จะโตออกจากศูนย์' },
    { question: 'ถ้า strength ของ balancing loop สูงเกินไป จะเกิดอะไรขึ้นแทนที่จะไล่เข้าเป้าหมายอย่างนุ่มนวล', answer: 'กราฟจะไม่ไล่เข้าเป้าหมายอย่างนุ่มนวลอีกต่อไป แต่จะแกว่งเลยเป้าหมายไปมา ซึ่งคือพฤติกรรม oscillation' },
  ],
  'behavior-patterns:oscillation': [
    { question: 'Oscillation เกิดจากการรวมโครงสร้างอะไรสองอย่างเข้าด้วยกัน', answer: 'Balancing Loop + Delay — delay ทำให้ระบบ "แก้" ตามข้อมูลที่ล้าสมัยไปแล้วเสมอ พอแก้เสร็จสถานการณ์จริงเปลี่ยนไปแล้ว จึงต้องแก้กลับทิศอีกที วนซ้ำ' },
    { question: 'Oscillation สามระดับ (damped, sustained, growing) ต่างกันยังไง และแบบไหนอันตรายที่สุด', answer: 'Damped = amplitude เล็กลงทุกรอบจนนิ่ง (ยอมรับได้), Sustained = amplitude เท่าเดิมตลอด (ไม่เสถียร), Growing = amplitude ใหญ่ขึ้นทุกรอบ (อันตรายที่สุด เพราะสุดท้ายจะแกว่งจนหลุดขอบเขตที่รับไหว)' },
    { question: 'ทางแก้ thundering herd จาก cache ที่ expire พร้อมกัน คือการปรับ TTL ให้สูงขึ้นหรือต่ำลง เพราะอะไร', answer: 'ไม่ใช่ทั้งสองอย่าง — ทางแก้ที่แท้จริงคือเพิ่ม jitter ให้แต่ละ cache entry expire ไม่พร้อมกัน (กระจายเวลา) การไล่ปรับ TTL ขึ้นลงเป็นการแก้ oscillation ด้วยการ oscillate เอง ซึ่งไม่แก้ต้นตอ' },
  ],
  'behavior-patterns:overshoot-and-collapse': [
    { question: 'Overshoot and Collapse เกิดจากอะไร', answer: 'เกิดจาก R loop ที่วิ่งเร็วกว่า B loop ที่ควรจะมาคาน — B loop ที่ควรตรวจจับและชะลอการเติบโตก่อนถึงขีดจำกัดตามธรรมชาติ (carrying capacity) ตอบสนองไม่ทัน (เพราะ delay หรือไม่มีอยู่เลย) ระบบจึงพุ่งทะลุขีดจำกัดไปก่อนรู้ตัว' },
    { question: 'ทำไมช่วง collapse (ขาลง) มักดิ่งแรงกว่าช่วงขึ้นเสมอ', answer: 'เพราะตอนชนขีดจำกัดแล้ว มักมี R loop อีกตัวที่ทำงานสวนทางเข้ามาซ้อน เช่น ระบบล่ม → ผู้ใช้หนีไปคู่แข่ง → ผู้ใช้ที่เหลือเห็นเพื่อนหนีก็ยิ่งไม่มั่นใจ ยิ่งหนีตาม — สองแรงที่มีธรรมชาติ reinforcing เหมือนกันแต่สวนทางกัน ทำให้ขาลงชันกว่าขาขึ้น' },
    { question: 'บทเรียนเชิงปฏิบัติจาก overshoot and collapse คือคำถามอะไรที่ควรถามคู่กับทุก R loop ที่กำลังทำงานได้ดี', answer: '"ขีดจำกัดตามธรรมชาติของระบบนี้อยู่ตรงไหน และเรารู้ระยะห่างจากขีดจำกัดนั้นแบบ real-time หรือเปล่า" — capacity planning และ alert ที่เตือนล่วงหน้าคือการสร้าง balancing loop ที่ตอบสนองทันเวลา' },
  ],
  'systems-archetypes:limits-to-growth': [
    { question: 'โครงสร้าง Limits to Growth ประกอบด้วยอะไรบ้าง', answer: 'R loop ที่ขับเคลื่อนการเติบโต บวกกับ B loop ที่มาจาก constraining condition ซึ่งแรงขึ้นเรื่อยๆ ตามการเติบโตนั้นเอง จนในที่สุดฉุดการเติบโตให้ช้าลง' },
    { question: 'ทำไมช่วงแรกของ Limits to Growth ถึงมองเห็นแค่ R loop ที่ทำงานได้สวย ไม่เห็น B loop เลย', answer: 'เพราะ B loop (แรงฉุด) แทบไม่มีผลตอนแรก เนื่องจาก constraining condition ยังห่างไกลขีดจำกัด พอ condition เริ่มใกล้ขีดจำกัดจริง B loop ถึงเริ่มรู้สึกได้ ซึ่งมักสายเกินไปแล้วที่จะชะลอทัน' },
    { question: 'สัญชาตญาณทั่วไปเมื่อเห็นการเติบโตชะลอตัวคือทำอะไร และทำไมมันอาจยิ่งแย่ลง', answer: 'สัญชาตญาณคือ "ดัน R loop ให้แรงขึ้นอีก" แต่ถ้าสาเหตุจริงคือ constraining condition กำลังทำงาน การดัน R loop จะยิ่งเร่งให้ระบบชน limit เร็วขึ้น ทางแก้ที่ถูกต้องคือขยาย constraining condition ให้กว้างขึ้นก่อน' },
  ],
  'systems-archetypes:fixes-that-fail': [
    { question: 'Fixes That Fail มีโครงสร้างสอง loop อะไรซ้อนกันบน "ทางแก้" เดียวกัน', answer: 'B loop ที่บรรเทาอาการทันที กับ R loop ที่ค่อยๆ สร้างผลข้างเคียงซึ่งย้อนกลับมาทำให้ปัญหาเดิมแย่ลงกว่าตอนไม่แก้เลยด้วยซ้ำ' },
    { question: 'ทำไมคนมักตัดสินว่าทางแก้แบบ Fixes That Fail "ได้ผลแล้ว" ทั้งที่กำลังสร้างปัญหาใหญ่กว่าเดิม', answer: 'เพราะ B loop เห็นผลเร็ว ส่วน R loop เห็นผลช้า คนจึงตัดสินจากสิ่งที่เห็นเร็ว (B loop) โดยไม่รู้ว่า R loop กำลังก่อตัวอยู่เงียบๆ เบื้องหลัง กว่าจะรู้ตัวว่าทางแก้ล้มเหลวจริงๆ ก็มักสายเกินไป' },
    { question: 'คำถามสองข้อที่ช่วยจับ Fixes That Fail ได้ตั้งแต่ต้นคืออะไร', answer: '1) "ทางแก้นี้จัดการที่ต้นตอของอาการ หรือแค่กดอาการไว้ชั่วคราว" 2) ถ้าเป็นแบบหลัง ให้ถามต่อว่า "มีอะไรที่กำลังสะสมอยู่เงียบๆ เบื้องหลังทางแก้นี้บ้าง"' },
  ],
  'systems-archetypes:shifting-the-burden': [
    { question: 'Shifting the Burden ต่างจาก Fixes That Fail ตรงไหน', answer: 'Fixes That Fail สร้างผลข้างเคียงใหม่ ส่วน Shifting the Burden กัดกร่อนความสามารถของระบบในการสร้างทางแก้ถาวรด้วยตัวเองไปด้วย ยิ่งพึ่งทางแก้ด่วนมาก ยิ่งไม่มีใครมีเวลา/แรงจูงใจไปสร้างทางแก้ถาวร' },
    { question: 'ทำไม Shifting the Burden ถึง "หลุดออกยากขึ้นเรื่อยๆ" เมื่อเวลาผ่านไป', answer: 'เพราะต้นทุนของการหันไปใช้ทางแก้ถาวรสูงขึ้นเรื่อยๆ เนื่องจาก capability ที่จะสร้างมันถูกกัดกร่อนไปเรื่อยๆ พร้อมกัน จนสุดท้ายไม่มีใครในทีมมีความรู้/เวลาพอจะสร้างทางแก้ถาวรได้อีกแล้ว' },
    { question: 'วิธีป้องกัน Shifting the Burden ที่ได้ผลจริงคืออะไร', answer: 'จำกัดขอบเขตของทางแก้ด่วนไว้ล่วงหน้าอย่างชัดเจน เช่น กำหนดจำนวนครั้งสูงสุดที่ใช้ manual fix ได้ ครั้งถัดไปต้องหยุดงานอื่นแล้วสร้าง automated fix ทันที — เท่ากับเติม balancing loop เข้าไปคานไม่ให้ R loop วิ่งไปเรื่อยๆ' },
  ],
  'systems-archetypes:tragedy-of-the-commons': [
    { question: 'Tragedy of the Commons เกิดขึ้นเมื่อไหร่ และทำไมแต่ละฝ่ายที่ "ตัดสินใจถูกต้อง" ถึงสร้างผลลัพธ์แย่ร่วมกันได้', answer: 'เกิดเมื่อหลายฝ่ายแย่งใช้ทรัพยากรจำกัดร่วมกัน — เพราะผลตอบแทนจากการใช้ทรัพยากรมองเห็นชัดและเป็นของฝ่ายตัวเองทั้งหมด แต่ต้นทุนจากการใช้ร่วมถูกแบ่งกระจายให้ทุกฝ่ายรับไปคนละนิด ทำให้แรงจูงใจ "ใช้เพิ่ม" ชัดกว่า "ใช้น้อยลง" มาก' },
    { question: 'ยกตัวอย่าง Tragedy of the Commons ในองค์กรเทคมา 1 เคส', answer: 'เช่น CI/CD runner pool กลาง — ทุกทีมเพิ่มความถี่ pipeline trigger อย่างสมเหตุสมผลในมุมตัวเอง แต่ผลรวมคือคิวยาว ทุกทีมรอนานขึ้นกว่าเดิม' },
    { question: 'ทางแก้ Tragedy of the Commons ที่ยั่งยืนคืออะไร ต่างจากการ "ขอร้องให้ใช้น้อยลง" ยังไง', answer: 'คือออกแบบกลไกที่ทำให้ต้นทุนที่เคยกระจายไป กลับมาสะท้อนที่ผู้ใช้แต่ละรายโดยตรง เช่น ให้ quota แยกตามทีม หรือทำ chargeback — ต่างจากการขอร้องซึ่งไม่ยั่งยืนเพราะฝ่าฝืนแรงจูงใจของแต่ละคน' },
  ],
  'systems-archetypes:success-to-the-successful': [
    { question: 'Success to the Successful มีโครงสร้างยังไง', answer: 'สองฝ่ายแข่งกันแย่งทรัพยากรจำกัดชุดเดียวกัน โดยกลไกจัดสรรใช้ผลงานที่ผ่านมาเป็นเกณฑ์ — แต่ละฝ่ายมี R loop ของตัวเอง (ยิ่งได้ทรัพยากร ยิ่งมีผลงานดี ยิ่งได้ทรัพยากรเพิ่ม) แต่ทั้งสอง R loop ผูกกันผ่านทรัพยากรที่มีจำกัด' },
    { question: 'ทำไม archetype นี้ถึงอันตรายเป็นพิเศษ ทั้งที่กลไกดูยุติธรรมทุกขั้นตอน', answer: 'เพราะ "ให้รางวัลกับผลงานดี" ฟังดูถูกต้องเสมอ ไม่มีใครตั้งใจกีดกันฝ่ายที่แพ้ แต่ผลสะสมระยะยาวคือความเหลื่อมล้ำที่ขยายตัวเองไปเรื่อยๆ จนฝ่ายเสียเปรียบแทบไม่มีทางไล่ทัน ไม่ว่าจะมีศักยภาพจริงแค่ไหนก็ตาม' },
    { question: 'ทางแก้ Success to the Successful คืออะไร', answer: 'แยกเกณฑ์จัดสรรออกจากผลงานสะสมเป็นระยะๆ เช่น กันงบ/headcount ไว้สำหรับฝ่ายที่มีศักยภาพแต่ยังไม่มี traction โดยเฉพาะ, ประเมิน ROI ต่อทรัพยากรที่ได้รับแทนผลงานสัมบูรณ์, หรือหมุนเวียนโอกาสเป็นระยะ' },
  ],
  'systems-archetypes:escalation': [
    { question: 'โครงสร้างของ Escalation ต่างจาก archetype อื่นในโมดูลนี้ยังไง', answer: 'ไม่ใช่ loop ที่วนอยู่ในฝ่ายเดียว แต่เป็น R loop เดียวขนาดใหญ่ที่สลับตัวตนไปมาระหว่างสองฝ่าย — การกระทำของ A กระตุ้นให้ B รู้สึกเสียเปรียบ B จึงตอบโต้ ซึ่งกระตุ้นให้ A รู้สึกเสียเปรียบอีกที วนไม่มีจุดจบในตัวเอง' },
    { question: 'จุดที่ทำให้ Escalation หลอกคนได้แนบเนียนที่สุดคืออะไร', answer: 'ในแต่ละก้าว การกระทำของแต่ละฝ่ายดูสมเหตุสมผลเสมอเมื่อมองแค่ก้าวนั้นก้าวเดียว ไม่มีฝ่ายไหนตั้งใจทำร้ายอีกฝ่าย แต่ผลสะสมทั้ง trajectory พาไปไกลเกินกว่าที่ใครตั้งใจไว้แต่แรกมาก' },
    { question: 'ทางแก้ Escalation คืออะไร ต่างจากการ "พยายามชนะให้ได้" ยังไง', answer: 'คือหยุดวงจรการตอบโต้แบบสัมพัทธ์ (ปรับตามพฤติกรรมล่าสุดของอีกฝ่าย) แล้วเปลี่ยนไปใช้ข้อตกลงแบบสัมบูรณ์ที่ตกลงร่วมกันล่วงหน้าแทน เช่น SLA ร่วมกันที่ชัดเจน — ต่างจากการพยายามชนะซึ่งยิ่งเร่ง loop ให้แรงขึ้น' },
  ],
  'systems-archetypes:growth-and-underinvestment': [
    { question: 'Growth and Underinvestment ต่างจาก Limits to Growth ตรงไหน ทั้งที่โครงสร้างดูคล้ายกัน', answer: 'Limits to Growth ขีดจำกัดเป็นเงื่อนไขทางธรรมชาติที่ควบคุมไม่ได้ แต่ Growth and Underinvestment ขีดจำกัดคือการตัดสินใจของคน (งบลงทุน) ที่ถูกทำให้ต่ำเกินไปเพราะดูจาก performance ปัจจุบันที่ยังพอไปวัดไปวาย — เป็นข้อจำกัดที่เลือกได้ ไม่ใช่ธรรมชาติบังคับ' },
    { question: 'ทำไม R loop ของ Growth and Underinvestment ถึง "วิ่งได้ทั้งขาขึ้นและขาลง"', answer: 'เพราะลิงก์ทั้งวง (investment→capacity→performance→demand→investment) เป็น "+" ทั้งหมด ถ้าลงทุนทันจะโตต่อเนื่อง แต่ถ้าลงทุนช้าแม้รอบเดียว (มี delay บนเส้น investment→capacity) จะดิ่งลงเป็นวงจรยืนยันตัวเองในทิศตรงข้ามเช่นกัน' },
    { question: 'ทำไมกับดักนี้ถึง "หลอกคนเก่งได้ง่าย" — มันสร้าง self-fulfilling prophecy ยังไง', answer: 'เมื่อไม่ลงทุน performance ทรุดทำให้ demand ที่วัดได้ (realized demand) ลดลง ผู้บริหารเข้าใจผิดว่านั่นคือ demand ที่แท้จริงของตลาด (potential demand) จึงรู้สึกว่าตัดสินใจไม่ลงทุนถูกแล้ว ทั้งที่ demand ที่วัดได้ถูกกดไว้ด้วยข้อจำกัดที่ตัวเองสร้างขึ้นเอง' },
  ],
  'systems-archetypes:accidental-adversaries': [
    { question: 'Accidental Adversaries ต่างจาก Escalation ตรงไหนเป็นหลัก', answer: 'Escalation แต่ละฝ่ายตอบโต้โดยตรงต่อการกระทำของอีกฝ่าย (รู้ตัวว่ากำลังแข่งกัน) ส่วน Accidental Adversaries แต่ละฝ่ายไม่เคยมองอีกฝ่ายเลย แค่ optimize metric ของตัวเองอย่างอิสระ โดยไม่รู้ตัวว่าการกระทำนั้นส่งผลข้างเคียงลบไปโดนอีกฝ่าย' },
    { question: 'ในไดอะแกรมของ Accidental Adversaries เพราะอะไรถึงไม่มีลิงก์ตรงระหว่างการกระทำของสองฝ่ายเลย', answer: 'เพราะสองการกระทำไม่เคย "คุย" กันโดยตรง แต่ละฝ่ายมี R loop ของตัวเองที่หมุนดีในมุมมองตัวเอง ความเสียหายเกิดจากลิงก์ทแยงสองเส้นที่เป็นผลข้างเคียงซึ่งมองไม่เห็นจากมุมของฝ่ายที่ก่อขึ้นเอง ไม่ใช่จากการปะทะกันตรงๆ' },
    { question: 'ทำไม Accidental Adversaries ถึงแก้ยากกว่า Escalation และทางแก้ที่ถูกต้องคืออะไร', answer: 'เพราะไม่มีฝ่ายไหนรู้ตัวว่าตัวเองคือต้นเหตุของปัญหาอีกฝ่าย (จากมุมตัวเองทุกอย่างดูสมเหตุสมผล) จึงไม่มีแรงจูงใจเปลี่ยนพฤติกรรมเอง ทางแก้คือสร้าง metric ร่วมที่บังคับให้เห็นผลกระทบข้ามทีม หรือมีคน/กลไกที่ยืนนอกขอบเขตของทั้งสองฝ่ายมองเห็นภาพรวม' },
  ],
  'leverage-points:twelve-leverage-points': [
    { question: 'Leverage Point คืออะไร และ Meadows จัดอันดับไว้กี่ระดับ', answer: 'Leverage Point คือจุดในระบบที่การเปลี่ยนแปลงเล็กๆ ตรงนั้นส่งผลใหญ่หลวงต่อพฤติกรรมของทั้งระบบ Meadows จัดอันดับไว้ 12 ระดับ จากอ่อนที่สุด (parameters) ไปถึงแรงที่สุด (transcending paradigms)' },
    { question: 'ทำไมคนถึงเลือกแก้ที่ parameter บ่อยที่สุด ทั้งที่เป็นจุดที่มีแรงยกน้อยที่สุด', answer: 'เพราะแก้ง่ายที่สุด เห็นผลเร็วที่สุด ไม่ต้องขออนุมัติใคร ต่างจากการเปลี่ยน rules หรือ goals ที่ต้องอาศัยอำนาจตัดสินใจสูงกว่า มีแรงต้านจากคนที่คุ้นเคยของเดิม และเห็นผลช้ากว่า' },
    { question: 'ยกตัวอย่างการแก้ปัญหาเดียวกัน (deploy fail บ่อย) ที่ระดับ parameter กับระดับ rules ต่างกันยังไง', answer: 'ระดับ parameter คือปรับ timeout/retry/threshold (เปลี่ยนแปลงเล็กน้อย ต้องปรับซ้ำหลายรอบ) ส่วนระดับ rules คือบังคับ CI ต้องเขียวก่อน merge เสมอ (เปลี่ยนพฤติกรรมทั้งทีมทันที ไม่ต้องพึ่งวินัยส่วนบุคคล)' },
  ],
  'leverage-points:parameters-vs-structure': [
    { question: '12 ระดับของ leverage point ยุบเหลือ 3 กลุ่มใหญ่อะไรบ้าง', answer: 'Parameters (ระดับ 12-9 — ตัวเลข ค่าคงที่ ปรับได้คนเดียว), Structure (ระดับ 8-4 — loop strength, information flow, rules ต้องตัดสินใจร่วมของทีม), และ Goals & Paradigm (ระดับ 3-1 — เป้าหมายและมุมมองพื้นฐาน ต้องอาศัยอำนาจสูงกว่า)' },
    { question: 'กฎที่ใช้ตัดสินว่าเมื่อไหร่ควรขยับไปแก้ leverage point ที่แรงกว่าคืออะไร', answer: 'ถ้าแก้ parameter ซ้ำแล้วซ้ำเล่าแต่อาการเดิมยังกลับมาเรื่อยๆ ให้สงสัยว่าปัญหาอยู่ที่ structure ไม่ใช่ parameter — ถ้าแก้ structure แล้วก็ยังไม่หาย ให้สงสัยว่าปัญหาอยู่ที่ goals หรือ paradigm' },
    { question: 'ในเคส "ทีมส่ง PR ที่ทดสอบไม่ครบ" ทำไมการตั้ง coverage threshold (parameter) เพียงอย่างเดียวถึงไม่พอ', answer: 'เพราะทีมอาจเขียน test ห่วยๆ ที่ผ่าน coverage แต่ไม่ได้ทดสอบอะไรจริง (gaming the metric) — ต้องขยับไปแก้ structure (information flow, rules) หรือถ้ายังเลี่ยงได้อยู่ดี ต้องขยับไปแก้ goals ว่าทีมกำลัง optimize อะไรจริงๆ' },
  ],
  'leverage-points:leverage-points-in-practice': [
    { question: 'ในเคส on-call fatigue การแก้ parameter (ปรับ alert threshold) ทำไมถึงล้มเหลว', answer: 'เพราะการเพิ่ม threshold กรอง alert สำคัญบางตัวออกไปด้วย จนมี incident จริงที่ไม่มีใครรู้ตัวจนสาย ปัญหาหลัก (คนน้อยเกินไปเทียบกับ workload) ไม่ได้ถูกแตะเลย' },
    { question: 'อะไรคือ leverage point ระดับ goals ที่ทำให้ทีมแก้ on-call fatigue ได้ถาวรในเคสนี้', answer: 'การเพิ่ม error budget เข้าไปในเป้าหมายทีม (แนวทาง SRE) — ถ้า reliability ต่ำกว่าเป้า ต้องหยุด feature ใหม่ชั่วคราวไปแก้ reliability ก่อน ทำให้ทุกการตัดสินใจของทีมสอดคล้องเป้าหมายใหม่โดยอัตโนมัติ' },
    { question: 'บทเรียนสำคัญจากเคสนี้คือ leverage point ที่แรงที่สุดไม่จำเป็นต้องเป็นอะไร', answer: 'ไม่จำเป็นต้องเป็นการแตะโค้ดเลยสักบรรทัดเดียว — ในเคสนี้คือการเปลี่ยนวิธีวัดผลงานของทีม ซึ่งวิศวกรส่วนใหญ่มักไม่คิดว่าตัวเองมีอำนาจไปแตะ ทั้งที่มันคือจุดเดียวที่แก้ปัญหาได้ถาวรจริงๆ' },
  ],
  'system-traps-mental-models:system-traps-overview': [
    { question: 'Policy Resistance คืออะไร และทางแก้ที่ถูกต้องคืออะไร', answer: 'เกิดเมื่อหลายฝ่ายมีเป้าหมายขัดแย้งกัน แต่ละฝ่ายดึงระบบเข้าหาเป้าหมายตัวเอง ทำให้ทุกฝ่ายออกแรงมากขึ้นแต่ไม่มีใครถึงเป้าหมายจริง ทางแก้คือเจรจาหาเป้าหมายร่วมที่ทุกฝ่ายยอมรับได้ ไม่ใช่ดึงแรงขึ้นอีก' },
    { question: 'Drift to Low Performance เกิดขึ้นได้ยังไง และป้องกันยังไง', answer: 'เกิดเมื่อทีมตั้งเป้าหมายอิงจากผลงานที่ผ่านมา พอผลงานแย่ลงนิดหน่อย เป้าหมายรอบถัดไปก็ถูกปรับลงตาม จนมาตรฐานไหลลงต่ำเรื่อยๆ โดยไม่มีใครตัดสินใจชัดเจน ป้องกันได้ด้วยการยึดเป้าหมายไว้กับมาตรฐานสัมบูรณ์ที่ตายตัว' },
    { question: 'Rule Beating กับ Seeking the Wrong Goal ต่างกันตรงไหน', answer: 'Rule Beating คือกฎถูกออกแบบมาไม่ดีพอ คนหาทางเอาชนะกฎได้โดยไม่ผิดกฎจริง แต่ผิดเจตนารมณ์ ส่วน Seeking the Wrong Goal คือ metric เองตั้งแต่แรกก็วัดผิดสิ่งอยู่แล้ว ระบบจึง optimize ไปในทิศที่ผิดอย่างสมบูรณ์แบบตามที่ metric สั่ง' },
  ],
  'system-traps-mental-models:boundary-problem': [
    { question: 'ทำไม system boundary ถึงไม่มีคำตอบที่ "ถูกต้องแบบสัมบูรณ์"', answer: 'เพราะในโลกจริงทุกอย่างเชื่อมโยงกันหมด ไม่มีเส้นแบ่งที่ธรรมชาติขีดไว้ให้ว่าระบบจบตรงไหน ทีมต้องเลือกเองว่าจะรวมอะไรไว้ในขอบเขตวิเคราะห์ การเลือกนี้มีผลมากต่อทางแก้ที่จะได้ แต่ไม่มีคำตอบถูกผิดตายตัว' },
    { question: 'ยกตัวอย่างว่าปัญหาเดียวกัน (service ตอบช้า) วาดขอบเขตต่างกันได้ทางแก้ต่างกันยังไง', answer: 'ขอบเขตแคบ (แค่ service ตัวเอง) เห็นทางแก้คือ optimize โค้ด/เพิ่ม cache ขอบเขตกลาง (รวม downstream) เห็นว่าต้องเปลี่ยนวิธีเรียกหรือคุยกับทีม downstream ขอบเขตกว้าง (รวมทั้งองค์กร) อาจพบว่าทางแก้จริงอยู่ที่ policy การจัดสรร headcount ทั้งบริษัท' },
    { question: 'คำถามที่ควรถามทุกครั้งก่อนเริ่มวิเคราะห์ระบบเกี่ยวกับ boundary คืออะไร', answer: '"ขอบเขตที่กำลังใช้อยู่ตอนนี้ กว้างพอจะเห็น feedback loop ที่สำคัญที่สุดของปัญหานี้หรือยัง" — ถ้าทางแก้ที่ลองแล้วไม่ได้ผลซ้ำๆ มักเป็นสัญญาณว่าขอบเขตแคบเกินไป ต้องขยับออกไปดูภาพที่กว้างขึ้น' },
  ],
  'system-traps-mental-models:mental-models-and-systems': [
    { question: 'Iceberg Model มีสี่ระดับอะไรบ้าง เรียงจากตื้นไปลึก', answer: 'Events (สิ่งที่เกิดขึ้นตอนนี้), Patterns/Trends (พฤติกรรมซ้ำเมื่อเวลาผ่านไป), Systemic Structures (stock/flow/feedback loop ที่ผลิตแพทเทิร์นนั้น), และ Mental Models (ความเชื่อ/สมมติฐานที่ทำให้โครงสร้างนั้นถูกสร้างขึ้น)' },
    { question: 'ทำไมลำดับของ Iceberg Model ถึงตรงกับลำดับ Leverage Points', answer: 'เพราะทั้งสองคือมุมมองสองมุมของกรอบคิดเดียวกัน — Events ≈ parameter (เห็นง่าย ผลน้อย), Structure ≈ rules/loop strength, Mental Models ≈ paradigm (ลึกที่สุด แต่ทรงพลังที่สุด) ยิ่งขุดลึกลงใต้ผิวน้ำ ยิ่งเจอจุดที่แก้แล้วได้ผลกว้างและยั่งยืนกว่า' },
    { question: 'ทำไมการแก้ปัญหาที่ระดับ "event" อย่างเดียว (เช่น restart server) ถึงไม่เพียงพอ', answer: 'เพราะได้ผลแค่ครั้งนั้นครั้งเดียว ไม่ได้แตะ pattern, structure หรือ mental model ที่ผลิตปัญหานั้นซ้ำๆ ต้องขุดลงไปถึง structure และ mental model ถึงจะแก้ได้ถาวรและกว้างกว่าแค่เหตุการณ์เดียว' },
  ],
  'systems-thinking-case-studies:tech-debt-as-stock-flow': [
    { question: 'ในเคส tech debt ทำไม outflow ถึงเป็นศูนย์มาตลอด 6 เดือน ทั้งที่ทีมเห็นปัญหาอยู่', answer: 'เพราะ mental model ที่ฝังอยู่ในทีมคือ "refactor คือสิ่งที่ทำตอนมีเวลาว่างเท่านั้น ไม่ใช่งานที่ควรจัดสรรเวลาไว้ล่วงหน้า" ทำให้ outflow แพ้ทุกครั้งเวลาต้อง prioritize กับงานที่ถูกมองว่าเป็น "งานจริง" มากกว่า' },
    { question: 'ทำไมการแก้แค่ parameter (ปรับ coding standard เอกสาร) ถึงไม่ได้ผลในเคสนี้', answer: 'เพราะไม่มีเวลาทำตามจริง — เอกสารมาตรฐานไม่ได้เปลี่ยน structure (การจัดสรรเวลา) หรือ mental model (ความเชื่อว่า refactor ไม่ใช่งานจริง) ที่เป็นต้นตอของปัญหา' },
    { question: 'Leverage point ระดับ goals/mental model ที่แนะนำในเคสนี้คืออะไร', answer: 'เปลี่ยนนิยาม "Definition of Done" ของทีมให้รวม "ไม่เพิ่ม complexity เกินเกณฑ์ที่ตั้งไว้" เข้าไปด้วย ไม่ใช่แค่ "feature ทำงานได้" — เปลี่ยนสิ่งที่ทีมนับว่าเป็นงานเสร็จจริงโดยตรง' },
  ],
  'systems-thinking-case-studies:conways-law-systems-view': [
    { question: "Conway's Law มีโครงสร้างเป็น R loop ยังไง และทำไมถึงล็อกตัวเองแน่นขึ้นเรื่อยๆ", answer: 'org structure shape software structure (ทิศทางดั้งเดิม) และ software structure ก็ shape org กลับ (ทีมจัดตัวเองรอบ module ที่มีอยู่มากขึ้นเพราะข้าม boundary มีต้นทุนสูง) — สองทิศทางนี้รวมเป็น R loop ที่ล็อกโครงสร้างเดิมไว้แน่นขึ้นเรื่อยๆ' },
    { question: 'ทำไมการ "ประกาศสถาปัตยกรรมใหม่" โดยไม่แตะโครงสร้างทีมถึงมักล้มเหลว', answer: 'เพราะเป็นการแก้ที่ parameter-level (แค่เปลี่ยนชื่อ/เอกสาร) ในขณะที่ org structure ซึ่งเป็นตัวขับเคลื่อน R loop ตัวจริงยังเหมือนเดิม ทีมจะค่อยๆ ดึงโค้ดกลับไปอยู่ในรูปแบบเดิมโดยไม่รู้ตัว เข้าข่าย Fixes That Fail' },
    { question: 'Inverse Conway Maneuver คืออะไร', answer: 'คือการจัดโครงสร้างทีมให้ตรงกับสถาปัตยกรรมที่ต้องการก่อน แทนที่จะสั่งเปลี่ยนสถาปัตยกรรมตรงๆ — ใช้ R loop เดียวกันที่เคยล็อกปัญหาไว้ ให้กลับมาช่วยล็อกทางแก้ใหม่ให้แน่นแทน โดยแก้ที่ structure (org) ซึ่งเป็นตัวขับเคลื่อนจริง' },
  ],
  'systems-thinking-case-studies:cascading-failure-reinforcing-loop': [
    { question: 'ในเคส cascading failure ทำไม auth-service ถึงล่มตามทั้งที่ไม่มี dependency กับ payment-service ในโค้ดเลย', answer: 'เพราะทั้งสองแชร์ database instance เดียวกัน (dependency ระดับ infrastructure ที่ซ่อนอยู่) — ทีมมองแค่ dependency ระดับโค้ด ไม่เห็น dependency ที่แท้จริงเพราะ system boundary ที่ใช้วิเคราะห์แคบเกินไป' },
    { question: 'R loop ที่ขับเคลื่อน cascading failure ในเคสนี้ประกอบด้วยอะไรบ้าง และมี delay อยู่ตรงไหน', answer: 'Retry จาก client/upstream (+) → Load บน payment-service (+) → Latency/Error เพิ่มขึ้น (+) → วนกลับไปกระตุ้น retry อีก (loop เดียวกับ tech debt spiral) — delay อยู่ที่ alerting lag ระหว่าง error ที่เพิ่มขึ้นจริงกับตอนที่ทีมรู้ตัว' },
    { question: 'Mental model ที่เป็นต้นตอของเคสนี้คืออะไร และ leverage point ระดับ structure ที่แนะนำมีอะไรบ้าง', answer: 'Mental model คือ "retry with timeout ก็เพียงพอแล้วสำหรับ resilience ไม่จำเป็นต้องมี circuit breaker" — leverage point ระดับ structure ที่แนะนำคือใส่ circuit breaker ทุกจุดเรียก downstream, แยก connection pool ไม่ให้แชร์กัน (bulkhead), และเพิ่ม jitter ให้ retry ไม่ยิงพร้อมกัน' },
  ],

  'architectural-styles:what-is-system-architecture': [
    { question: 'System Design กับ System Architecture ต่างกันตรงไหนหลักๆ', answer: 'System Design โฟกัสกลไกภายในหนึ่งระบบ (scale, cache, database) วัดผลด้วยตัวเลข ส่วน System Architecture โฟกัสการตัดสินใจข้ามระบบ/ข้ามทีม (แตกกี่ service, บันทึกเหตุผลยังไง) วัดผลขึ้นกับบริบทองค์กรมากกว่าตัวเลขล้วนๆ' },
    { question: 'ทำไมทีมที่เก่ง System Design อย่างเดียวยังเจอปัญหาทีมชนกันบ่อย ทั้งที่ระบบ scale ได้ดี', answer: 'เพราะปัญหาทีมชนกัน (deploy ชนกัน, แก้โค้ดก้อนเดียวกัน) เป็นปัญหาระดับ System Architecture (โครงสร้างทีม/service) ไม่ใช่ปัญหากลไก การ optimize cache หรือ database (System Design) ไม่ช่วยแก้จุดนี้เลย' },
    { question: 'ในการสัมภาษณ์งาน สัญญาณอะไรที่บ่งบอกว่าผู้สมัครยังแยก System Design กับ System Architecture ไม่ออก', answer: 'การเสนอ \'แตก microservices\' ทันทีโดยไม่ถามเรื่องขนาดทีมหรือ bounded context ก่อนเลย แสดงว่ายังไม่แยกมุมมองการตัดสินใจเชิงองค์กร (architecture) ออกจากกลไกทางเทคนิค (design)' },
  ],
  'evolutionary-architecture:strangler-fig-pattern': [
    { question: 'Strangler Fig Pattern แก้ปัญหาอะไรที่การ rewrite แบบ big-bang มี', answer: 'Big-bang rewrite ต้องหยุด feature ใหม่ระหว่างเขียนใหม่ทั้งระบบ และถ้าพังคือพังทั้งระบบพร้อมกันวันเปิดตัว Strangler Fig migrate ทีละชิ้นเล็กๆ ที่ rollback ได้ และระบบใช้งานได้ตลอดกระบวนการ ไม่ต้องหยุด' },
    { question: 'Facade layer ใน Strangler Fig Pattern ทำหน้าที่อะไร', answer: 'เป็นตัวกลาง (มักเป็น API Gateway/reverse proxy) คอยดักทุก request แล้วตัดสินใจว่าจะส่งไปที่ระบบเก่า (legacy) หรือระบบใหม่ที่ migrate เสร็จแล้ว ทำให้เปลี่ยน route ทีละส่วนได้โดยไม่กระทบส่วนอื่น' },
    { question: 'เมื่อไหร่ถึงจะปลดระวาง (decommission) ระบบ legacy ได้อย่างปลอดภัยใน Strangler Fig Pattern', answer: 'เมื่อ facade ย้าย route ทุกเส้นไปที่ service ใหม่หมดแล้ว จนระบบ legacy เหลือแต่ route ที่ไม่มีใครเรียกใช้งานอีกต่อไป ถึงตอนนั้นค่อยปลดระวาง legacy ได้อย่างปลอดภัย' },
  ],
  'security-architecture:zero-trust-architecture': [
    { question: 'หลักการ \'never trust, always verify\' ของ Zero Trust ต่างจากโมเดล castle-and-moat แบบเดิมยังไง', answer: 'Castle-and-moat เชื่อถือทันทีถ้าอยู่ใน network เดียวกัน (ตรวจแค่ตอนเข้าประตู) ส่วน Zero Trust ไม่เชื่อใครอัตโนมัติแค่เพราะอยู่ใน network เดียวกัน ทุก request ต้องพิสูจน์ตัวตนและสิทธิ์ใหม่ทุกครั้งไม่ว่าจะมาจากไหน' },
    { question: 'ทำไม lateral movement ถึงเป็นความเสี่ยงหลักของโมเดล castle-and-moat', answer: 'เพราะถ้าผู้โจมตีเจาะจุดเดียวสำเร็จ (เช่น credential รั่ว) แล้วอยู่ใน network เดียวกัน จะเดินไปเรียก resource อื่นๆ ได้อย่างอิสระเพราะระบบข้างในเชื่อใจกันเองหมด ไม่มีการตรวจซ้ำ' },
    { question: 'Zero Trust หมายความว่าไม่ต้องมี firewall หรือ network security อีกต่อไปใช่ไหม', answer: 'ไม่ใช่ Zero Trust ไม่ได้บอกให้ถอด firewall ทิ้ง แค่บอกว่าอย่าพึ่งพา network boundary เป็นเกราะป้องกันชั้นเดียว ในทางปฏิบัติมักใช้ควบคู่กับ network segmentation (Defense in Depth) อยู่ดี' },
  ],
  'security-architecture:defense-in-depth': [
    { question: 'Defense in Depth ต่างจากการเพิ่ม firewall หลายตัวตรงไหน', answer: 'Defense in Depth ต้องการความหลากหลายของกลไกป้องกัน (defense diversity) แต่ละชั้นป้องกันคนละประเภทภัยคุกคาม ไม่ใช่แค่เพิ่มปริมาณเครื่องมือชนิดเดียวกัน เพราะถ้าสองชั้นถูก bypass ด้วยวิธีเดียวกันก็ล้มพร้อมกันทั้งคู่' },
    { question: 'ทำไมถึงยังต้องทำ parameterized query ในโค้ดทั้งที่มี WAF บล็อก SQL injection อยู่แล้ว', answer: 'เพราะ WAF อาจถูก bypass ได้ด้วย payload รูปแบบใหม่ที่ signature ยังไม่รู้จัก parameterized query เป็นชั้นป้องกันอิสระที่ยังกันได้แม้ WAF พลาด ตามหลัก Defense in Depth ไม่ควรพึ่งชั้นเดียวสำหรับความเสี่ยงระดับ critical' },
    { question: 'ชั้นการป้องกันแบบ Data layer (เช่น field-level encryption) ช่วยอะไรที่ Network layer ช่วยไม่ได้', answer: 'ถ้าผู้โจมตีเจาะผ่าน Network และ Application layer มาถึง database โดยตรง (เช่นผ่าน insider threat หรือ misconfigured backup) Data layer encryption ยังทำให้ข้อมูลอ่านไม่ออกถ้าไม่มี key แยกต่างหาก เป็นชั้นสุดท้ายที่ยังป้องกันได้' },
  ],
  'security-architecture:threat-modeling': [
    { question: 'STRIDE คืออะไร มีกี่หมวด', answer: 'STRIDE คือ framework จาก Microsoft สำหรับไล่คิดภัยคุกคามตอนออกแบบระบบ มี 6 หมวด: Spoofing (ปลอมตัว), Tampering (แก้ไขข้อมูล), Repudiation (ปฏิเสธว่าไม่ได้ทำ), Information Disclosure (ข้อมูลรั่ว), Denial of Service (ทำให้ใช้งานไม่ได้), Elevation of Privilege (ยกระดับสิทธิ์)' },
    { question: 'ทำไม Threat Modeling ควรทำตอนออกแบบ ไม่ใช่รอตอน code review หรือหลัง deploy', answer: 'เพราะต้นทุนแก้ปัญหาต่ำที่สุดตอนยังเป็นแค่ design (แค่ปรับ design) แพงขึ้นเรื่อยๆ ถ้าเจอตอน code review/pentest (ต้องแก้โค้ด) และแพงที่สุดถ้าเจอตอนถูกโจมตีจริงหลัง production (เสียชื่อเสียงและข้อมูล)' },
    { question: 'Repudiation (ข้อ R ใน STRIDE) ป้องกันด้วยอะไร และเชื่อมกับหัวข้อไหนที่เรียนมาแล้ว', answer: 'ป้องกันด้วย audit log ที่แก้ไขไม่ได้ เชื่อมกับ Event Sourcing ที่เรียนไปแล้วในโมดูล CQRS & Event Sourcing เพราะ event log แบบ append-only คือ audit trail ในตัวอยู่แล้ว' },
  ],
  'security-architecture:secure-by-design-patterns': [
    { question: 'หลักการ Least Privilege คืออะไร ช่วยจำกัดความเสียหายยังไงถ้า service ถูกเจาะ', answer: 'คือการให้สิทธิ์แต่ละ service/user/API key แค่พอทำงานที่ต้องทำเท่านั้น ไม่ใช่ให้สิทธิ์กว้างไว้ก่อน ถ้า service นั้นถูกเจาะ ความเสียหายจะจำกัดอยู่แค่ขอบเขตสิทธิ์ที่มันมี ไม่ลามไปทั้งระบบ' },
    { question: 'ทำไมการ hardcode credential ในโค้ดถึงเป็นความเสี่ยงสูง และ Secrets Manager แก้ปัญหานี้ยังไง', answer: 'เพราะโค้ดมักถูก commit เข้า git, แชร์กับคนนอกทีมตอน debug, หรือหลุดผ่าน log ได้ง่าย Secrets Manager แก้โดยให้ application ขอ short-lived credential ตอน runtime แทน ไม่ต้องมีใครจำหรือแชร์ password ตรงๆ' },
    { question: 'Trust Boundary ในสถาปัตยกรรมคืออะไร และทำไมต้องระบุให้ชัดใน architecture diagram', answer: 'คือจุดที่ข้อมูลเดินทางจากโซนไม่น่าเชื่อถือ (เช่น internet) เข้าสู่โซนที่เชื่อถือได้มากขึ้น ต้องระบุชัดเพราะทุกจุดที่ข้ามเส้นนี้ต้องมีการตรวจสอบ (validate, authenticate) เสมอ ไม่งั้นจะตกหล่นจุดที่ควรตรวจสอบ' },
  ],
  'monitoring-fundamentals:monitoring-vs-observability': [
    { question: 'Monitoring กับ Observability ต่างกันยังไง', answer: 'Monitoring ตอบคำถามที่รู้ล่วงหน้าว่าจะถาม (known-unknowns) ผ่าน dashboard/alert ที่ตั้งไว้ก่อน ส่วน Observability ตอบคำถามที่ไม่เคยคาดคิดมาก่อน (unknown-unknowns) โดย query แบบ ad-hoc บนข้อมูล high-cardinality ตอนสืบสวนจริง' },
    { question: 'ทำไม metric แบบ pre-aggregated ถึงไม่พอสำหรับ debug ปัญหาที่ไม่เคยเจอมาก่อน', answer: 'เพราะ metric สรุป/aggregate มักถูกบีบอัดจนไม่เหลือ dimension ให้ slice หาสาเหตุ ต้องมีข้อมูลเหตุการณ์ดิบที่ tag ด้วย dimension เยอะๆ (high-cardinality เช่น user_id, request_id) ถึงจะ query หา pattern ที่ไม่เคยตั้งคำถามไว้ล่วงหน้าได้' },
    { question: 'high-cardinality data คืออะไร ยกตัวอย่าง field ที่ cardinality สูงกับต่ำ', answer: 'คือ field ที่มีค่าไม่ซ้ำจำนวนมาก เช่น user_id หรือ request_id (cardinality สูง) ต่างจาก field อย่าง http_status ที่มีแค่ไม่กี่ค่าซ้ำๆ กัน (cardinality ต่ำ) — cardinality สูงจำเป็นสำหรับ slice/dice หา unknown-unknowns' },
  ],
  'monitoring-fundamentals:four-golden-signals': [
    { question: 'Four Golden Signals มีอะไรบ้าง', answer: 'Latency (นานแค่ไหนกว่าจะตอบ), Traffic (รับ request มากแค่ไหน), Errors (ล้มเหลวกี่ %), Saturation (ทรัพยากรใกล้เต็มแค่ไหน) — เซ็ตขั้นต่ำที่ควร monitor สำหรับทุก service' },
    { question: 'ทำไมไม่ควรเอา latency ของ request ที่สำเร็จกับที่ error มาเฉลี่ยรวมกัน', answer: 'เพราะ request ที่ error มักตอบกลับเร็วผิดปกติ (fail fast) พอเฉลี่ยรวมกับ request ที่สำเร็จจะทำให้ตัวเลข latency ดูดีเกินจริง ทั้งที่ user จำนวนมากกำลังเจอ error ต้องแยกวัด latency เฉพาะ request ที่สำเร็จ แล้วดู error rate แยกต่างหาก' },
    { question: 'Saturation ต่างจาก Utilization ยังไง', answer: 'Utilization บอกว่าทรัพยากรถูกใช้งานอยู่กี่ % ส่วน Saturation บอกว่าทรัพยากรรับงานเพิ่มไม่ไหวแล้วหรือยัง (เช่น queue length ที่เพิ่มขึ้นเรื่อยๆ แม้ CPU ยังไม่ถึง 100%) — Saturation สะท้อนว่าระบบกำลังตามงานไม่ทันได้ตรงกว่า' },
  ],
  'monitoring-fundamentals:red-and-use-method': [
    { question: 'RED Method ย่อมาจากอะไร ใช้กับอะไร', answer: 'Rate, Errors, Duration — ออกแบบมาสำหรับ service ที่รับ request (API, microservice) มองจากมุม request-driven' },
    { question: 'USE Method ย่อมาจากอะไร ต่างจาก RED ยังไง', answer: 'Utilization, Saturation, Errors — ออกแบบมาสำหรับทรัพยากรระบบ (CPU, memory, disk I/O) ต่างจาก RED ที่มองจากมุม request ของ service ส่วน USE มองจากมุมทรัพยากรเบื้องหลัง' },
    { question: 'database CPU สูงแต่ error rate ของ API ยังปกติ ควรใช้ framework ไหนสืบต่อ และทำไม', answer: 'ใช้ USE Method สืบต่อที่ระดับทรัพยากร เพราะ RED มองจากมุม request ของ service ซึ่งยังปกติอยู่ ต้องดู Saturation ของ USE (เช่น queue รอคิว) เพื่อเช็คว่าทรัพยากรกำลังจะรับงานไม่ไหวหรือยัง ก่อนที่ RED metric ของ service จะเริ่มแย่ลงตามมา' },
  ],
  'metrics-and-prometheus:time-series-data-model': [
    { question: 'metric name กับ label รวมกันเป็นอะไรใน Prometheus', answer: 'metric name บวกกับชุด label ที่ต่างกัน = time series คนละเส้น เช่น http_requests_total{method="GET"} กับ http_requests_total{method="POST"} คือ series แยกกันโดยสมบูรณ์แม้ชื่อ metric เดียวกัน' },
    { question: 'ทำไมอ่านค่า Counter ตรงๆ ถึงไม่ค่อยมีประโยชน์', answer: 'เพราะ Counter เพิ่มขึ้นอย่างเดียวและ reset เป็น 0 ทุกครั้งที่ process restart การอ่านค่าดิบจึงไม่สะท้อนอัตราการเปลี่ยนแปลงที่แท้จริง ต้องดูอัตราการเพิ่มขึ้น (rate) แทน' },
    { question: 'ทำไม time-series DB อย่าง Prometheus ถึงเขียนข้อมูลแบบ append-only ไม่ UPDATE ค่าเก่า', answer: 'เพราะ metric เขียนรัวๆ ต่อเนื่องตลอดเวลาทุก scrape interval append-only ทำให้เขียนเร็วไม่ต้องล็อกแถวเดิมเหมือน relational DB ส่วนข้อมูลเก่าจัดการด้วย compaction และ retention policy แทนการ DELETE ทีละแถว' },
  ],
  'metrics-and-prometheus:promql-basics': [
    { question: 'Instant Vector กับ Range Vector ต่างกันยังไง', answer: 'Instant Vector (เช่น http_requests_total) คืนค่าล่าสุดจุดเดียวของแต่ละ series ส่วน Range Vector (เช่น http_requests_total[5m]) คืนค่าทุกจุดย้อนหลังตามช่วงเวลาที่กำหนด ต้องผ่านฟังก์ชันอย่าง rate() ก่อนถึงจะได้ตัวเลขเดียว' },
    { question: 'rate() จัดการปัญหา counter reset ยังไง', answer: 'rate() รู้ว่าถ้าค่าลดลงทั้งที่ควรเพิ่มอย่างเดียว (เช่น process restart ทำให้ counter กลับไป 0) นั่นคือ reset แล้วชดเชยให้อัตโนมัติ ไม่ทำให้ผลลัพธ์ติดลบผิดปกติ' },
    { question: 'ทำไมใช้ rate() กับ Gauge ไม่ได้ผลลัพธ์ที่มีความหมาย', answer: 'เพราะ rate() ออกแบบมาสำหรับ Counter ที่เพิ่มขึ้นอย่างเดียวเท่านั้น ส่วน Gauge ขึ้นลงได้เองตามปกติโดยไม่ใช่ reset การใช้ rate() กับ Gauge จึงตีความผิดว่าค่าที่ลดลงคือ reset ทั้งที่ไม่ใช่' },
  ],
  'metrics-and-prometheus:cardinality-explosion': [
    { question: 'ทำไม high-cardinality label อย่าง user_id ถึงอันตรายกับ Prometheus โดยเฉพาะ', answer: 'เพราะทุกค่า user_id ที่ต่างกันจะกลายเป็น series ใหม่ 1 เส้น ถ้ามี user นับล้านคนจะได้ series นับล้านเส้นต่อ metric เดียว Prometheus ต้องเก็บ index ของทุก series ไว้ใน memory ทำให้ memory พุ่งจน OOM' },
    { question: 'label แบบไหนถือว่าปลอดภัยใส่ใน Prometheus metric', answer: 'label ที่มีค่าจำกัดและรู้ล่วงหน้าได้คร่าวๆ ว่ามีกี่แบบ (bounded cardinality) เช่น method, status, service — ไม่ใช่ label ที่ค่าโตไปเรื่อยๆ ตามจำนวน user หรือ request' },
    { question: 'ถ้าต้องการสืบปัญหาระดับ user_id เจาะจง ควรทำยังไงแทนการใส่ user_id เป็น metric label', answer: 'ใช้ metric สรุปภาพรวม (aggregate, bounded label) เพื่อบอกว่ามีปัญหา แล้วกระโดดไปดู log หรือ trace ที่ tag ด้วย user_id นั้นเพื่อสืบรายละเอียด เพราะ log/trace ออกแบบมารับ high-cardinality data ได้โดยเฉพาะ ต่างจาก metric label ใน Prometheus' },
  ],
  'centralized-logging:structured-logging': [
    { question: 'Structured Logging ต่างจาก Unstructured Logging ยังไง', answer: 'Structured logging เก็บ log เป็น field แยกชัดเจน (เช่น JSON) query/กรอง/สรุปสถิติได้ตรงๆ ส่วน unstructured logging เป็นข้อความอิสระที่ต้องพึ่ง regex เปราะบางในการค้นหา และพังง่ายถ้าข้อความเปลี่ยน' },
    { question: 'ทำไมการแก้ข้อความใน unstructured log อาจทำให้ alert เงียบหายไปโดยไม่มีใครรู้ตัว', answer: 'เพราะ alert/dashboard ที่ grep หาข้อความเดิมอิงกับข้อความอิสระที่แก้ได้ตลอดเวลา ถ้ามีคนแก้ถ้อยคำใน log (เช่น เว้นวรรคต่างไป) regex ที่ตั้งไว้จะไม่ match ข้อความใหม่อีกต่อไป โดยไม่มี error แจ้งเตือน' },
    { question: 'Correlation ID คืออะไร สำคัญยังไงกับระบบที่มีหลาย service', answer: 'คือ field (เช่น req_id) ที่แปะไปกับทุก log ที่เกิดจาก request เดียวกัน ไม่ว่าจะผ่านกี่ service พอเกิดปัญหาแค่ query ด้วย correlation ID เดียวกันก็เห็น log ทุกจุดที่ request นั้นผ่าน เรียงตามเวลาได้ทันที' },
  ],
  'centralized-logging:log-levels': [
    { question: 'Log Level เรียงจากต่ำไปสูงมีอะไรบ้าง', answer: 'DEBUG (รายละเอียดตอน dev), INFO (เหตุการณ์ปกติ), WARN (ผิดปกติแต่ยังทำงานต่อได้), ERROR (งานนี้ล้มเหลว), FATAL (ระบบทำงานต่อไม่ได้)' },
    { question: 'ทำไมไม่ควรตั้ง production log level เป็น DEBUG ทิ้งไว้ตลอดเวลา', answer: 'เพราะ log ทุกบรรทัดมีต้นทุนจริงทั้งพื้นที่เก็บ ค่า ingest ของระบบ log aggregation และ performance overhead จากการเขียน I/O บ่อยเกินไป DEBUG log ส่วนใหญ่ไม่มีใครเปิดดู ควรเปิดชั่วคราวเฉพาะตอนสืบสวนปัญหาเท่านั้น' },
    { question: 'ทำไม WARN/ERROR/FATAL ควร sample ที่ 100% เสมอ ต่างจาก INFO ที่ sample ได้', answer: 'เพราะเหตุการณ์ผิดปกติ (WARN/ERROR/FATAL) มีปริมาณน้อยกว่า INFO มากและสำคัญกว่าที่จะไม่พลาด ส่วน INFO เป็นเหตุการณ์ปกติจำนวนมหาศาล sample แบบสุ่มเป็น % เล็กๆ ก็ยังเห็นภาพรวมได้โดยไม่ต้องเก็บครบทุกบรรทัด' },
  ],
  'centralized-logging:centralized-log-pipeline': [
    { question: 'Centralized Logging Pipeline มาตรฐานมีขั้นตอนอะไรบ้าง', answer: 'Service เขียน structured log → Log Shipper (Filebeat/Fluentd/Promtail) อ่านและส่งต่อ → Buffer (เช่น Kafka) กันข้อมูลสูญหายตอน spike → Storage & Index (Elasticsearch/Loki) → Query & Visualize (Kibana/Grafana)' },
    { question: 'ทำไม service ไม่เขียน log ตรงไปที่ storage เอง แต่ต้องผ่าน Log Shipper', answer: 'เพื่อไม่ให้ปัญหา network หรือ storage ที่ปลายทางกระทบ service หลักโดยตรง Log Shipper แยกหน้าที่อ่าน/ส่ง log ออกจาก business logic ของ service ทำให้ service ไม่ต้องรอหรือ fail เพราะปัญหาฝั่ง logging' },
    { question: 'ทำไม Grafana Loki ถึงมีต้นทุนต่ำกว่า Elasticsearch มาก ทั้งที่เก็บ log เหมือนกัน', answer: 'Elasticsearch index ทุก field ในทุกบรรทัด log ทำให้ค้นหา full-text ได้ทรงพลังแต่ต้นทุน storage/memory สูงมาก ส่วน Loki index แค่ label จำนวนจำกัด (แนวคิดเดียวกับ Prometheus) แล้วเก็บเนื้อ log แบบบีบอัดไว้ค้นตอน query จริงเท่านั้น จึงประหยัดกว่ามาก แลกกับการค้นข้อความอิสระที่ช้ากว่า' },
  ],
  'distributed-tracing:spans-and-traces': [
    { question: 'Span กับ Trace ต่างกันยังไง', answer: 'Trace คือเส้นทางทั้งหมดของ request เดียวตั้งแต่เข้าระบบจนออก ส่วน Span คือหนึ่งช่วงงานภายใน trace นั้น (เช่น 1 service call) ที่มี start time, end time และ parent span ของตัวเอง' },
    { question: 'Trace ID ต่างจาก Correlation ID ที่ใช้ใน log ยังไง', answer: 'Correlation ID แค่บอกว่า log กลุ่มไหนมาจาก request เดียวกัน (flat ไม่มีโครงสร้าง) ส่วน Trace ID มาพร้อม span ที่มี start/end time และความสัมพันธ์ parent-child ชัดเจน ทำให้เห็นได้ว่า service ไหนกินเวลาไปเยอะสุด' },
    { question: 'ทำไมเวลารวมของ parent span อาจไม่เท่ากับผลรวมเวลาของ child span ทุกตัว', answer: 'เพราะถ้า child span หลายตัวทำงานขนานกัน (parallel calls) เวลาของแต่ละ child จะซ้อนทับกัน ไม่ได้ต่อเนื่องกันตามลำดับ ต้องดู waterfall จริงว่า span ไหนซ้อนทับเวลากันบ้าง ไม่ใช่บวกเวลาทุก span ตรงๆ' },
  ],
  'distributed-tracing:trace-context-propagation': [
    { question: 'Trace Context Propagation คืออะไร ทำไมจำเป็น', answer: 'คือการส่ง trace ID และ span ID ต่อไปยัง service ถัดไป (เช่นผ่าน HTTP header traceparent) เพื่อให้ทุก service ในเส้นทางสร้าง span ที่ผูกกับ trace เดียวกัน ถ้าไม่ propagate แต่ละ service จะสร้าง trace ใหม่แยกกัน ไม่เชื่อมโยงกันทั้งที่มาจาก request เดียวกัน' },
    { question: 'ทำไม trace มักขาดตอนตรงจุดที่ใช้ message queue (เช่น Kafka, RabbitMQ)', answer: 'เพราะ message queue ไม่ใช่ synchronous HTTP call ตรงๆ ถ้าไม่ได้ตั้งใจแนบ trace context ไปกับ message header ตอน publish consumer อีกฝั่งจะเริ่ม trace ใหม่ที่ไม่เชื่อมกับฝั่ง producer เลย' },
    { question: 'sampling decision ที่แนบไปกับ traceparent header มีไว้ทำไม', answer: 'เพื่อให้ทุก service ในเส้นทางตัดสินใจตรงกันว่า trace นี้จะถูกเก็บ (sampled) หรือไม่ ถ้าแต่ละ service สุ่มตัดสินใจเองอิสระ จะได้ trace ที่เก็บ span ไม่ครบทุกจุด กลายเป็น trace ที่ไม่สมบูรณ์' },
  ],
  'distributed-tracing:opentelemetry': [
    { question: 'OpenTelemetry แก้ปัญหา vendor lock-in ของ tracing ยังไง', answer: 'แยก API มาตรฐานที่โค้ด application เรียกใช้ ออกจาก backend ปลายทางที่เก็บ trace จริง (Jaeger, Datadog, ฯลฯ) ทำให้เปลี่ยน backend ได้แค่ปรับ config ที่ Collector โดยไม่ต้องแก้โค้ด instrument ในแอปใหม่ทั้งหมด' },
    { question: 'Auto-Instrumentation กับ Manual Instrumentation ต่างกันยังไง ข้อจำกัดของ Auto คืออะไร', answer: 'Auto-instrumentation attach library/agent โดยไม่ต้องแก้โค้ด ได้ trace พื้นฐานเร็ว แต่ครอบคลุมแค่ระดับ framework/library (HTTP, DB) มองไม่เห็น business logic เฉพาะทาง ต้องเพิ่ม manual instrumentation เองในจุดสำคัญทางธุรกิจ' },
    { question: 'OTel Collector ทำหน้าที่อะไร ทำไมแอปไม่ส่งข้อมูล trace ตรงไปที่ backend เอง', answer: 'Collector รับข้อมูลจากทุกแอป ประมวลผล (filter, sampling, scrub PII, batch) แล้วส่งต่อไปยัง backend แยกหน้าที่นี้ออกจากตัวแอป ทำให้เปลี่ยน backend หรือปรับ sampling ได้จากจุดเดียวโดยไม่ต้อง deploy แอปใหม่ทุกตัว' },
  ],
  'dashboards-and-grafana:dashboard-design-principles': [
    { question: 'ทำไม Four Golden Signals ควรอยู่บนสุดของทุก dashboard เสมอ', answer: 'เพราะตอบคำถามแรกที่ทุกคนอยากรู้เร็วที่สุดคือ "ตอนนี้ปกติไหม" ส่วน metric เฉพาะทางของ business ค่อยอยู่ถัดลงมา ให้คนกวาดตาดูรู้สถานะโดยรวมก่อนค่อยลงรายละเอียด' },
    { question: 'ทำไมไม่ควรใช้ Single Stat แสดงค่าเฉลี่ย latency เพียงตัวเดียว', answer: 'เพราะค่าเฉลี่ยกลบรายละเอียดสำคัญได้ง่าย (เหมือนปัญหาเดียวกับที่เรียนใน Four Golden Signals เรื่อง p95/p99) latency ควรใช้ time-series ที่ plot หลาย percentile พร้อมกันแทน' },
    { question: 'ทำไมไม่ควรทำ dashboard เดียวให้ทั้งผู้บริหารและ on-call engineer ใช้ร่วมกัน', answer: 'เพราะสองกลุ่มต้องการข้อมูลคนละระดับ (ภาพรวมเร็วๆ vs รายละเอียด debug) การยัดรวมกันมักทำให้ทั้งสองฝ่ายต้องเลื่อนหาสิ่งที่ตัวเองต้องการ ควรแยกเป็น overview dashboard กับ drill-down dashboard ที่มีผู้ชมชัดเจน' },
  ],
  'dashboards-and-grafana:grafana-and-data-sources': [
    { question: 'Grafana ต่างจาก Prometheus/Loki ยังไง', answer: 'Grafana ไม่ได้เก็บข้อมูลเอง แต่เป็นชั้น visualization ที่ต่อกับ data source ได้หลายชนิดพร้อมกัน (Prometheus, Loki, Elasticsearch, ฯลฯ) ส่วน Prometheus/Loki มี expression browser พื้นฐานแต่ไม่ได้ออกแบบมาสร้าง dashboard ที่แชร์กับทีมหรือรวมหลาย data source' },
    { question: 'ทำไมการรวม panel จาก Prometheus และ Loki ไว้ใน dashboard เดียวกันถึงมีประโยชน์', answer: 'เพราะเห็นทั้งอาการ (metric error rate พุ่งขึ้นจาก Prometheus) และรายละเอียด (log ที่กรองช่วงเวลาเดียวกันจาก Loki) ในจอเดียว ไม่ต้องสลับแอประหว่างดู metric กับดู log' },
    { question: 'Template Variable ใน Grafana แก้ปัญหาอะไรเมื่อระบบมี service เยอะ', answer: 'แก้ปัญหาต้อง maintain dashboard แยกทีละ service เป็นสิบๆ ชุด โดยสร้าง dropdown ตัวแปร (เช่น $service) แล้วเขียน query แบบ parameterized ครั้งเดียว ผู้ใช้แค่เปลี่ยนค่าใน dropdown ก็ดู service ไหนก็ได้จาก dashboard เดียวกัน' },
  ],
  'dashboards-and-grafana:sli-slo-dashboard': [
    { question: 'SLI กับ SLO ต่างกันยังไง', answer: 'SLI (Service Level Indicator) คือค่าที่วัดได้จริง เช่น % ของ request ที่สำเร็จ ส่วน SLO (Service Level Objective) คือเป้าหมายที่ตั้งไว้สำหรับ SLI นั้น เช่น ต้อง ≥ 99.9% ในช่วง 30 วันที่ผ่านมา' },
    { question: 'Error Budget คำนวณยังไง และมีไว้ทำไม', answer: 'Error Budget = 100% - SLO target เช่น SLO 99.9% จะมี error budget 0.1% เป็นโควตาความล้มเหลวที่ยอมรับได้ ใช้เป็นตัวช่วยตัดสินใจว่าควรเน้นความเสถียรหรือเน้นออก feature ใหม่ในช่วงเวลานั้น' },
    { question: 'ทำไมการตั้ง SLO สูงเกินจริง (เช่น 99.99% ทั้งที่ระบบไม่เคยทำได้) ถึงเป็นปัญหา', answer: 'เพราะ error budget จะหมดตลอดเวลา ทำให้ dashboard แดงอยู่ตลอดจนไม่มีความหมายอีกต่อไป และทีมจะเริ่มเลิกสนใจ ควรตั้ง SLO จากข้อมูลจริงในอดีตบวกกับสิ่งที่ business ยอมรับได้ ไม่ใช่ตั้งให้สูงที่สุดเท่าที่จะทำได้' },
  ],
  'alerting-and-slo:error-budget-burn-rate': [
    { question: 'Burn Rate คืออะไร', answer: 'อัตราที่ error budget กำลังถูกใช้ไป เทียบกับอัตราที่ควรใช้ถ้าจะพอดีหมดตอนสิ้นรอบ SLO burn rate = 1x คือใช้ตามแผนปกติ ส่วน burn rate สูงกว่านั้นแปลว่ากำลังเผา budget เร็วกว่าปกติ' },
    { question: 'ทำไมการ alert ด้วย burn rate ถึงเร็วกว่าการรอดู SLI ตกต่ำกว่า SLO ตรงๆ', answer: 'เพราะถ้ารอให้ SLI ทั้งรอบ 30 วันตกต่ำกว่า SLO จริงๆ ถึงจะ alert ก็สายเกินไปแล้ว burn rate จับสัญญาณ "กำลังจะพัง" ได้ตั้งแต่ชั่วโมงแรกๆ ของปัญหาโดยไม่ต้องรอครบรอบ' },
    { question: 'ทำไมต้องใช้ Multi-Window Multi-Burn-Rate แทนการตั้งเงื่อนไขเดียว', answer: 'เพราะ window สั้นเกินไปจะ alert ไวเกินจาก error ชั่วครู่ที่หายเอง (false positive) ส่วน window ยาวเกินไปจะรู้ตัวช้ากับปัญหารุนแรงที่เกิดฉับพลัน การผสม window สั้น+ยาวพร้อมกันช่วยยืนยันว่าปัญหาเกิดขึ้นจริงและต่อเนื่อง ไม่ใช่ noise' },
  ],
  'alerting-and-slo:alert-fatigue': [
    { question: 'Alert Fatigue คืออะไร เกิดจากอะไร', answer: 'คือภาวะที่คนเริ่มเมิน alert เพราะได้รับบ่อยเกินไปโดยส่วนใหญ่เป็น false positive ที่ไม่มีอะไรต้องทำจริง สาเหตุหลักมาจาก alert ที่ไม่ actionable หรือตั้ง threshold แคบเกินจนจับ noise ปกติของระบบ' },
    { question: 'กฎทองของการตั้ง alert ระดับ Page (ปลุกกลางดึก) คืออะไร', answer: 'ทุก alert ที่ปลุกคนกลางดึกต้องมีสิ่งที่คนคนนั้นทำได้จริงทันที ถ้า alert ไปแล้วสิ่งเดียวที่ทำได้คือรอดูไปก่อน แปลว่าตั้งผิดจุด ควรเปลี่ยนเป็น ticket หรือ dashboard ให้เช็คตอนเช้าแทน' },
    { question: 'ทำไมการตั้งทุก alert เป็น Page เพราะ "เผื่อไว้ก่อน" ถึงเป็นปัญหา', answer: 'เพราะ on-call จะถูกปลุกทุกคืนด้วยเรื่องที่ไม่ต้องรีบแก้ พอเจอเหตุการณ์จริงที่ต้องรีบ คนที่ควรตื่นมาแก้ก็เหนื่อยล้าจาก alert ก่อนหน้าจนตอบสนองช้าลง หรือ mute การแจ้งเตือนไปเลย' },
  ],
  'alerting-and-slo:on-call-and-paging': [
    { question: 'ทำไมต้องมี On-Call Rotation แทนที่จะให้คนเดียวรับผิดชอบตลอด', answer: 'เพื่อไม่ให้ on-call กระจุกอยู่ที่คนเดียวตลอดซึ่งนำไปสู่ burnout เร็วมาก การหมุนเวรให้แต่ละคนเป็น primary สลับกันไปตามรอบช่วยกระจายภาระให้ทั่วถึง' },
    { question: 'Escalation Policy มีไว้ทำไม', answer: 'เพื่อเผื่อกรณีที่ primary on-call ไม่ตอบสนอง (โทรศัพท์ไม่ดัง, หลับลึก, เน็ตหลุด) ถ้าไม่มี escalation policy สำรอง alert วิกฤตอาจถูกปล่อยทิ้งไว้โดยไม่มีใครแก้เลย ต้องไล่ระดับไปหา secondary on-call แล้วไปหา manager ตามลำดับ' },
    { question: 'ทำไมเหตุการณ์ที่ error budget burn rate สูงผิดปกติควรนำไปสู่ Post-Incident Review เสมอ', answer: 'เพราะเป็นสัญญาณว่าเกิดปัญหาที่ส่งผลกระทบจริง ผลของ review มักย้อนกลับไปปรับปรุงจุดต่างๆ เช่น เพิ่ม metric ใหม่ ปรับ dashboard หรือแก้ runbook ให้ชัดขึ้น ทำให้ระบบแข็งแรงขึ้นเรื่อยๆ ทุกครั้งที่มีเหตุการณ์ ไม่ใช่แค่แก้แล้วจบ' },
  ],
  'devops-observability-case-studies:case-checkout-latency-incident': [
    { question: 'ลำดับการสืบสวน incident ในเคส checkout latency เป็นยังไง', answer: 'Alert (burn rate สูงผิดปกติ) → Dashboard (Golden Signals ชี้ว่า Errors พุ่ง) → Metric (PromQL แยกตาม endpoint หาจุดที่ error กระจุก) → Trace (waterfall ชี้ span ที่ช้า) → Log (กรองด้วย trace_id หา error message เป๊ะๆ)' },
    { question: 'ถ้าระบบไม่มี Distributed Tracing เคสนี้จะสืบสวนยากขึ้นตรงไหน', answer: 'จะรู้แค่ว่า endpoint ไหน error แต่ไม่รู้ว่า span ไหนในเส้นทางข้าม service ที่เป็นสาเหตุ ต้องไล่เปิด log ทีละ service เดา trace ID เอง ซึ่งช้ากว่ามาก' },
    { question: 'ทำไมการมี trace ID เชื่อมโยงกับ log ถึงย่นเวลาสืบสวนได้มาก', answer: 'เพราะสามารถกรอง log ด้วย trace_id เดียวกับ span ที่ช้าได้ตรงๆ แทนที่จะต้องเดาว่า log บรรทัดไหนเกี่ยวข้องกับ request ที่ error จริงๆ ท่ามกลาง log นับพันบรรทัดต่อวินาที' },
  ],
  'devops-observability-case-studies:case-prometheus-cardinality-outage': [
    { question: 'ทำไม Prometheus ถึง OOM crash ในเคสนี้', answer: 'เพราะ deploy ใหม่เพิ่ม label user_id เข้าไปใน metric ทำให้จำนวน series ระเบิดตามจำนวน user (unbounded high-cardinality label) Prometheus ต้องเก็บ index ของทุก series ไว้ใน memory จนล้น' },
    { question: 'ทำไมเมื่อ Prometheus ล่ม alert ทุกตัวถึงหยุดทำงานไปด้วย', answer: 'เพราะ alert ทั้งหมดผูกกับ Prometheus ตัวเดียวกันเป็นแหล่งข้อมูล เมื่อ Prometheus เองตาย ไม่มีระบบไหนเหลืออยู่ที่จะยิง alert แจ้งเตือนว่า Prometheus กำลังพัง กลายเป็น blind spot' },
    { question: 'ทางป้องกันที่แนะนำในเคสนี้คืออะไร', answer: 'ต้องมี external uptime checker ที่เป็นอิสระจาก Prometheus/Grafana คอยเฝ้าดูว่า monitoring stack เองยังทำงานปกติอยู่ไหม ไม่ใช่พึ่งพา Prometheus ตัวเดียวกันวัดตัวเอง เพราะระบบ critical ไม่ควรมี single point of failure' },
  ],
  'devops-observability-case-studies:case-silent-failure-unknown-unknown': [
    { question: 'ทำไมทีมในเคสนี้ถึงไม่มี alert ยิงเลยทั้งที่ปัญหาเกิดขึ้นจริงหลายสัปดาห์', answer: 'เพราะ metric ที่มีอยู่วัดแค่ว่า API call ไปหา email provider สำเร็จไหม (HTTP 200) ไม่ได้วัดว่าอีเมลไปถึงกล่องข้อความจริงไหม ทำให้ error rate ยังเขียวปกติแม้ผลลัพธ์จริงที่ user ได้รับจะผิดพลาด' },
    { question: 'บทเรียนหลักของเคสนี้คืออะไร', answer: 'การมีเครื่องมือ observability ครบไม่ได้แปลว่าจะเห็นปัญหาจริงเสมอไป ต้องเลือกวัด SLI ที่สะท้อนผลลัพธ์ที่ user สัมผัสจริง ไม่ใช่แค่สิ่งที่วัดง่ายอย่าง HTTP status code ของ service ตัวเอง' },
    { question: 'เคสนี้เชื่อมโยงกลับไปหาแนวคิดอะไรจากหัวข้อแรกสุดของ track', answer: 'Monitoring vs Observability — ทีมมี known-unknowns ที่เตรียมไว้ล่วงหน้าครบ (dashboard, alert) แต่ metric ที่เลือกวัดไม่ใช่ตัวที่สะท้อนผลลัพธ์ทางธุรกิจจริง สะท้อนว่าเครื่องมือครบไม่ได้การันตีว่าระบบ observable จริง' },
  ],
  'monorepo-vs-polyrepo:monorepo-fundamentals': [
    { question: 'ทำไม monorepo ถึงช่วยจัดการ breaking change ของ shared library ได้ดีกว่า', answer: 'เพราะแก้ library และทุก consumer ที่ต้องปรับตามได้ใน pull request เดียว ตรวจสอบและ merge พร้อมกันทีเดียว ไม่มีช่วงเวลาที่ library เวอร์ชันใหม่ถูก publish แล้วแต่ consumer บางตัวยังไม่ได้อัปเดตตาม' },
    { question: 'ทำไม monorepo ขนาดใหญ่ถึงต้องการ tooling พิเศษอย่าง incremental build', answer: 'เพราะถ้า build/test ทั้ง repo ทุกครั้งที่มีการเปลี่ยนแปลง (แม้แก้แค่ project เดียว) เวลา CI จะยืดยาวขึ้นตามขนาด repo ทั้งหมด ไม่ใช่ตามขนาดของสิ่งที่เปลี่ยนจริง ต้องใช้ dependency graph วิเคราะห์และ build เฉพาะส่วนที่ได้รับผลกระทบ' },
    { question: 'ทำไม monorepo ถึงมีข้อจำกัดด้าน access control มากกว่า polyrepo', answer: 'เพราะทุกคนเห็นโค้ดทุก project ใน repo เดียวกัน การจำกัดสิทธิ์แบบละเอียด (เช่น ทีม A ห้ามเห็นโค้ดทีม B) ทำได้ยากกว่า repo ที่แยกกันโดยธรรมชาติ' },
  ],
  'monorepo-vs-polyrepo:polyrepo-fundamentals': [
    { question: 'จุดแข็งหลักของ polyrepo คืออะไร', answer: 'ความเป็นอิสระ (isolation) — แต่ละทีมมี repo ของตัวเอง กำหนด access control, branch protection, CI pipeline ได้ตามที่ทีมต้องการโดยไม่กระทบทีมอื่น และ build/test จำกัดอยู่แค่ scope ของ repo นั้น' },
    { question: 'Version Drift ใน polyrepo คืออะไร เกิดขึ้นได้ยังไง', answer: 'คือช่วงเวลาที่ consumer repo ต่างๆ ใช้ shared library คนละเวอร์ชันกัน เกิดเพราะต้อง publish library เวอร์ชันใหม่ก่อน แล้วแต่ละ repo ต้องอัปเดต dependency เองแยกกันทีละที่ ระหว่างนั้นบาง repo อาจยังไม่ได้อัปเดตตาม' },
    { question: 'ทำไมการ refactor ทั่วองค์กรถึงทำยากกว่าใน polyrepo', answer: 'เพราะการเปลี่ยน pattern ที่ใช้ทุกที่ต้องไล่ทำทีละ repo แยกกัน ไม่มีทางทำเป็น atomic change ครั้งเดียวจบเหมือน monorepo ที่ทุก project อยู่ใน repository เดียวกัน' },
  ],
  'monorepo-vs-polyrepo:choosing-repo-strategy': [
    { question: 'Conway\'s Law เกี่ยวข้องกับการเลือก repo strategy ยังไง', answer: 'ทีมที่สื่อสารกันบ่อย ทำงานใกล้ชิดกัน (ต้องประสานการเปลี่ยนแปลงบ่อย) มักได้ประโยชน์จาก monorepo มากกว่า ส่วนทีมที่เป็นอิสระต่อกันสูง แยก domain ชัดเจน มักเหมาะกับ polyrepo มากกว่า เพราะโครงสร้าง repo มักสะท้อนโครงสร้างการสื่อสารขององค์กร' },
    { question: 'ทำไมองค์กรที่ย้ายไป monorepo โดยไม่ลงทุน tooling ที่เหมาะสมถึงมักเจอปัญหา', answer: 'เพราะ CI จะช้าลงเรื่อยๆ ตามขนาด repo ที่โตขึ้น กลายเป็นคอขวดของทั้งทีม ต้องมี build system ที่รองรับ incremental build และ affected-only testing (เช่น Nx, Turborepo, Bazel) ไม่ใช่ git เปล่าๆ' },
    { question: 'แนวทาง Hybrid "monorepo ต่อ domain" คืออะไร', answer: 'คือรวม project ที่เกี่ยวข้องกันใกล้ชิด (ทีมเดียวกัน แก้โค้ดร่วมกันบ่อย) ไว้ใน monorepo เล็กๆ ของ domain นั้น แต่แยก domain ที่ไม่เกี่ยวข้องกันออกเป็น repo ต่างหาก ได้ประโยชน์ของ atomic change ภายใน domain โดยไม่ต้องแบกรับความซับซ้อนของ monorepo ระดับทั้งองค์กร' },
  ],
  'branching-strategies:gitflow': [
    { question: 'GitFlow มี branch ถาวรกี่เส้น อะไรบ้าง', answer: '2 เส้น คือ main (production) และ develop (รวมงานที่พัฒนาเสร็จ) ส่วน feature/*, release/*, hotfix/* เป็น branch ชั่วคราวที่แตกออกมาแล้ว merge กลับ' },
    { question: 'ทำไม hotfix/* ถึงแตกจาก main โดยตรง ไม่แตกจาก develop', answer: 'เพราะต้องแก้ปัญหาด่วนบน production โดยไม่รวมงานที่ยังไม่เสร็จจาก develop เข้าไปด้วย แก้เฉพาะจุด merge เข้า main ตรงๆ แล้วค่อย merge กลับ develop ทีหลังเพื่อให้ fix อยู่ในรอบถัดไปด้วย' },
    { question: 'ทำไม GitFlow ถึงไม่เหมาะกับทีมที่ deploy วันละหลายครั้ง', answer: 'เพราะ feature branch ที่แยกจาก develop นานก่อน merge จะสะสม merge conflict มากขึ้นเรื่อยๆ และขั้นตอน develop → release → main ที่ต้องผ่านหลายชั้นทำให้ commit หนึ่งกว่าจะถึง production ใช้เวลานานเกินความจำเป็น' },
  ],
  'branching-strategies:trunk-based-development': [
    { question: 'หัวใจของ Trunk-Based Development คืออะไร', answer: 'ทุกคน commit เข้า branch หลัก (trunk) บ่อยที่สุดเท่าที่จะทำได้ (อย่างน้อยวันละครั้ง) feature branch ที่มีก็มีอายุสั้นมาก (ชั่วโมงถึงไม่เกิน 1 วัน) ทำให้ merge conflict เกิดน้อยกว่า GitFlow มาก' },
    { question: 'Feature Flag แก้ปัญหาอะไรใน Trunk-Based Development', answer: 'แก้ปัญหาโค้ดที่ยังทำไม่เสร็จถูก commit เข้า trunk และ deploy ขึ้น production โดยไม่กระทบ user เพราะถูกครอบด้วยเงื่อนไข flag ที่ปิดอยู่ ทำให้ user ไม่เห็นหรือได้รับผลกระทบจนกว่าทีมจะพร้อมเปิด flag จริง' },
    { question: 'Feature Flag กับ Canary Deployment เหมือนหรือต่างกันยังไง', answer: 'ทั้งคู่คือการแยกขั้นตอน "deploy โค้ดขึ้นระบบ" ออกจาก "เปิดให้ user ใช้งานจริง" เหมือนกัน แต่ feature flag ควบคุมที่ระดับ code path (เปิด/ปิดเงื่อนไขในโค้ด) ส่วน canary ควบคุมที่ระดับ traffic routing (ส่ง request บางส่วนไปยัง version ใหม่)' },
  ],
  'branching-strategies:choosing-branching-strategy': [
    { question: 'GitHub Flow ต่างจาก GitFlow ยังไง', answer: 'GitHub Flow มีแค่ main branch เดียวที่ถือว่า deploy-ready ตลอดเวลา ไม่มี develop หรือ release/* แบบ GitFlow ทุก feature แตก branch จาก main เปิด PR ผ่าน review และ CI แล้ว merge กลับเข้า main และ deploy ทันที' },
    { question: 'ทำไมการเลือก GitFlow เพราะ "ดูเป็นมาตรฐานที่เคยได้ยิน" ทั้งที่ deploy ทุกวันถึงเป็นปัญหา', answer: 'เพราะทีมจะแบกรับ overhead ของ release branch และขั้นตอนหลายชั้นโดยไม่ได้ประโยชน์เพิ่ม เนื่องจากไม่มีความจำเป็นต้อง stabilize ก่อนออกแบบมีรอบชัดเจนตั้งแต่แรก ควรเลือกตามความถี่การ deploy จริง ไม่ใช่ตามความคุ้นเคย' },
    { question: 'ก่อนย้ายจาก GitFlow ไป Trunk-Based Development ต้องมีพื้นฐานอะไรรองรับก่อน', answer: 'CI ที่รันเร็วและน่าเชื่อถือ, feature flag system, automated testing coverage ที่สูง, และวัฒนธรรม code review ที่รวดเร็ว เพราะสิ่งเหล่านี้ทดแทนความปลอดภัยที่ GitFlow ได้จากขั้นตอน release/stabilize ที่ยาวนาน' },
  ],
  'code-review-and-merge-strategy:pr-review-culture': [
    { question: 'Code Review มีคุณค่า 3 ด้านอะไรบ้าง ไม่ใช่แค่หาบั๊ก', answer: 'จับบั๊ก/edge case ที่คนเขียนมองข้าม, ถ่ายทอดความรู้ให้คนอื่นเข้าใจโค้ดส่วนนี้ด้วย (ลด bus factor), และรักษาความสอดคล้องของ pattern/convention ทั่วทั้ง codebase' },
    { question: 'ทำไม PR ขนาดใหญ่ถึงมีความเสี่ยงที่บั๊กจะหลุดผ่าน review มากกว่า PR เล็ก', answer: 'เพราะความสามารถของคนในการตรวจจับรายละเอียดลดลงเมื่อปริมาณโค้ดที่ต้องอ่านเพิ่มขึ้น PR ใหญ่มักถูกไถผ่านเร็วๆ แล้ว approve เพราะอ่านละเอียดทุกบรรทัดไม่ไหว' },
    { question: 'ทำไมทีมควรให้ automated tooling (linter, formatter) จัดการเรื่อง style แทนที่จะให้ human review', answer: 'เพื่อให้ human reviewer เหลือเวลาไปโฟกัสกับสิ่งที่เครื่องมือตรวจไม่ได้ เช่น logic, edge case, และความเหมาะสมของ design ซึ่งเป็นคุณค่าที่แท้จริงของการมีคนมา review' },
  ],
  'code-review-and-merge-strategy:merge-vs-squash-vs-rebase': [
    { question: 'Squash Merge ทำอะไรกับ commit history เทียบกับ Merge Commit', answer: 'Squash Merge รวมทุก commit ใน branch เป็น commit เดียวบน main ทำให้ history สะอาดและอ่านง่าย ส่วน Merge Commit เก็บทุก commit เดิมครบพร้อมเพิ่ม merge commit ต่อท้าย ทำให้ history รกกว่าถ้ามี PR จำนวนมาก' },
    { question: 'ทำไมทีมที่ทำ trunk-based development มักเลือก Squash Merge เป็นค่าเริ่มต้น', answer: 'เพราะให้ history บน main เป็นเส้นตรงและอ่านง่าย (1 PR = 1 commit) เข้ากับหลักการ merge บ่อยๆ ด้วย change เล็กๆ และช่วยให้ debug/bisect หาที่มาของบั๊กได้เร็ว' },
    { question: 'ทำไมห้าม rebase แล้ว force-push branch ที่คนอื่นกำลังใช้งานร่วมอยู่', answer: 'เพราะ rebase เขียนประวัติ commit ใหม่ทั้งหมด (commit hash เปลี่ยนหมด) ถ้า branch นั้นมีคนอื่นดึงไปทำงานต่อแล้ว การ force-push ทับจะทำให้ประวัติของคนอื่นขัดแย้งกับ remote ทันที ควร rebase เฉพาะ branch ส่วนตัวที่ยังไม่มีใคร pull ไปใช้เท่านั้น' },
  ],
  'code-review-and-merge-strategy:branch-protection': [
    { question: 'Branch Protection มีไว้ทำไม ต่างจากการตกลงกันปากเปล่าในทีมยังไง', answer: 'เป็นกลไกที่บังคับให้กฎ (เช่น ต้องมี review, ต้องผ่าน CI) เกิดขึ้นจริงทุกครั้งในระดับระบบ ต่างจากข้อตกลงปากเปล่าที่พึ่งพาวินัยของคน ซึ่งลืมหรือรีบได้ ระบบจะปฏิเสธการ merge ที่ไม่ผ่านเงื่อนไขโดยอัตโนมัติ' },
    { question: 'ทำไมกฎ "Require branch up-to-date ก่อน merge" ถึงสำคัญ', answer: 'เพราะ PR อาจผ่าน CI ตอนที่แตก branch แต่ main เปลี่ยนไปแล้วระหว่างวันจากการ merge PR อื่น การ merge เข้าไปโดยไม่ update ก่อนอาจทำให้ main พังได้ทั้งที่ CI ของ PR เราเขียวตลอด เพราะ CI รันตอนที่ยังไม่เห็นการเปลี่ยนแปลงล่าสุด' },
    { question: 'CODEOWNERS ต่างจาก "require PR review" ธรรมดายังไง', answer: '"require PR review" แค่บังคับว่าต้องมีคน approve แต่ไม่ระบุว่าใคร ส่วน CODEOWNERS กำหนดได้ว่าใครต้องเป็นคน approve เฉพาะสำหรับไฟล์/ส่วนที่เกี่ยวข้อง เช่น การเปลี่ยนแปลงไฟล์ payment ต้องมี reviewer จากทีม payment approve เสมอ' },
  ],
  'versioning-and-release-management:semantic-versioning': [
    { question: 'SemVer เพิ่มเลข MAJOR, MINOR, PATCH เมื่อไหร่บ้าง', answer: 'MAJOR เพิ่มเมื่อมี breaking change ที่โค้ดเดิมของ consumer อาจพัง, MINOR เพิ่มเมื่อเพิ่ม feature ใหม่แบบ backward compatible, PATCH เพิ่มเมื่อแก้บั๊กโดยไม่เปลี่ยน API เลย' },
    { question: 'ทำไม SemVer ถึงเรียกว่าเป็น "สัญญา" ระหว่างผู้ maintain library กับ consumer', answer: 'เพราะเลขเวอร์ชันบอกระดับความเสี่ยงของการอัปเกรดได้ทันที โดยไม่ต้องอ่าน changelog ก่อน — PATCH อัปเกรดได้ทันที, MINOR อัปเกรดได้อย่างมั่นใจว่าโค้ดเดิมไม่พัง, ส่วน MAJOR ต้องหยุดอ่าน changelog ก่อนเสมอเพราะมีโอกาสสูงที่โค้ดเดิมจะพัง' },
    { question: 'สัญลักษณ์ ^ กับ ~ ใน package.json ต่างกันยังไง', answer: '^4.17.21 ยอมรับ MINOR/PATCH ใหม่ทั้งหมดของ major version 4 โดยอัตโนมัติ ส่วน ~4.17.21 ยอมรับแค่ PATCH ใหม่ของ 4.17.x เท่านั้น ทั้งคู่ทำงานถูกต้องได้ก็ต่อเมื่อ library ปฏิบัติตามกฎ SemVer จริง' },
  ],
  'versioning-and-release-management:changelog-and-release-automation': [
    { question: 'Conventional Commits คืออะไร มีไว้ทำไม', answer: 'คือมาตรฐานข้อความ commit ที่มี prefix สื่อความหมายชัดเจน (feat:, fix:, docs:) ทำให้เครื่องมือ automation อ่านแล้วตัดสินใจ version bump และสร้าง changelog ได้เองโดยไม่ต้องมีคนมานั่งตัดสินใจ' },
    { question: 'ทำไม changelog ที่เขียนด้วยมือถึงมักมีปัญหาไม่ครบและไม่สม่ำเสมอ', answer: 'เพราะคนเขียนอาจลืม change เล็กๆ ที่ดูไม่สำคัญ หรือจัดกลุ่มไม่ตรงกันระหว่างแต่ละ release เมื่อ commit message เป็นระบบตาม Conventional Commits การสร้าง changelog กลายเป็นแค่การ parse และจัดกลุ่มอัตโนมัติ ได้ผลลัพธ์สม่ำเสมอทุกครั้ง' },
    { question: 'ทำไมทีมที่ใช้ semantic-release ถึงต้องเข้มงวดกับรูปแบบ commit message', answer: 'เพราะเครื่องมืออ่าน commit message เพื่อตัดสินใจ version bump และสร้าง changelog แบบอัตโนมัติทั้งหมด ถ้า commit message ไม่ตรงรูปแบบ เครื่องมือจะตีความผิดหรือมองข้าม commit นั้นไป ทำให้ version bump ผิดหรือ changelog ไม่ครบ โดยไม่มีคนมาตรวจสอบซ้ำ' },
  ],
  'versioning-and-release-management:monorepo-versioning': [
    { question: 'Independent Versioning กับ Fixed/Lockstep Versioning ต่างกันยังไง', answer: 'Independent Versioning แต่ละ package มีเลขเวอร์ชันเป็นของตัวเองตาม change ที่เกิดจริง ส่วน Fixed/Lockstep Versioning ทุก package ขึ้นเวอร์ชันพร้อมกันเป็นชุดเดียว แม้บาง package จะไม่มีอะไรเปลี่ยนเลยก็ตาม' },
    { question: 'ข้อเสียหลักของ Fixed Versioning คืออะไร', answer: 'package ที่ไม่มีการเปลี่ยนแปลงเลยก็ยังต้องขึ้นเวอร์ชันตามไปด้วยทุกครั้งที่ package อื่นใน monorepo เปลี่ยน สร้างความสับสนให้ consumer ที่เห็น version bump บ่อยผิดปกติทั้งที่ไม่มีอะไรเปลี่ยนสำหรับ package ที่ตัวเองใช้' },
    { question: 'เมื่อไหร่ควรเลือก Fixed Versioning แทน Independent Versioning', answer: 'เมื่อ package ทั้งหมดถูกออกแบบให้ใช้ร่วมกันเป็นชุดเสมอ เช่น framework ที่มี core กับ plugin ที่ผูกกันแน่นต้องใช้ version ตรงกันเป๊ะถึงทำงานได้ Fixed Versioning จะลดความสับสนเรื่อง compatibility ได้มากกว่า' },
  ],
  'git-workflow-at-scale:codeowners': [
    { question: 'CODEOWNERS คืออะไร ทำงานร่วมกับ branch protection ยังไง', answer: 'ไฟล์ที่แมป path ในโค้ดกับทีมหรือคนที่เป็นเจ้าของ เมื่อมี PR แก้ไฟล์ใน path นั้นระบบจะเพิ่ม owner เป็น required reviewer อัตโนมัติ แต่ต้องเปิด branch protection rule "Require review from Code Owners" ควบคู่กันด้วย ไม่งั้น CODEOWNERS แค่บอกความเป็นเจ้าของ ไม่มีผลบังคับอะไรเลย' },
    { question: 'CODEOWNERS match rule ทำงานแบบไหน ทำไมลำดับการเขียนถึงสำคัญ', answer: 'ทำงานแบบ rule สุดท้ายที่ match ชนะ (คล้าย .gitignore) ถ้าเขียน path เฉพาะทางไว้บนแล้ว * ไว้ล่างสุด * จะ override ทุกอย่างก่อนหน้าโดยไม่มี error เตือน ต้องเขียน * ไว้บนสุดแล้วตามด้วย path เฉพาะทางด้านล่างเสมอ' },
    { question: 'ทีมมี CODEOWNERS ครบทุก path แล้วแต่ PR ยังค้างนานเพราะ owner ไม่ว่าง ควรแก้ยังไง', answer: 'กำหนดหลาย owner ต่อ path เพื่อกระจายภาระ ตั้ง SLA ว่า PR ต้องได้ review ภายในกี่ชั่วโมง และพิจารณาว่าทีมนั้น owner หลาย path เกินไปจนเป็นคอขวดหรือเปล่า ซึ่งอาจสะท้อนปัญหา team topology ที่ต้องแก้ที่ต้นตอ' },
  ],
  'git-workflow-at-scale:commit-convention-at-scale': [
    { question: 'commit-msg hook กับ commitlint ทำงานร่วมกันยังไง', answer: 'commit-msg hook คือสคริปต์ที่ git รันอัตโนมัติก่อน commit จะสำเร็จ commitlint ผูกกับ hook นี้ผ่าน husky เพื่อตรวจสอบว่าข้อความ commit ตรงตาม Conventional Commits ก่อนปล่อยให้ commit เกิดขึ้นจริง ทำให้ทุกคนที่ clone repo ได้ hook เดียวกันอัตโนมัติ' },
    { question: 'scope ใน Conventional Commits (feat(scope):) มีประโยชน์ยังไงในบริบท monorepo', answer: 'บอกว่า commit กระทบ package ไหนโดยเฉพาะ เครื่องมือ release automation ในสเกล monorepo ใช้ scope นี้ตัดสินใจว่า package ไหนควรขึ้นเวอร์ชัน โดยไม่กระทบ package อื่นที่ไม่เกี่ยวข้อง ทีมมักบังคับให้ scope ตรงกับชื่อ package จริงกัน typo' },
    { question: 'ทีมติดตั้ง commitlint ผ่าน husky แล้วแต่ยังมี commit ผิดฟอร์แมตหลุดเข้า main ได้ ควรแก้ยังไง', answer: 'local hook ถูกข้ามได้ด้วย git commit --no-verify หรือบางคนอาจไม่ได้ install hook ครบ ต้องมี CI job เช็ก commit message ซ้ำอีกชั้นก่อนอนุญาตให้ merge เข้า main เสมอ ไม่ควรพึ่ง local hook อย่างเดียวเพราะ bypass ได้ ต้องมี server-side enforcement เป็นด่านสุดท้าย' },
  ],
  'git-workflow-at-scale:large-repo-practices': [
    { question: 'Shallow clone, Partial clone, และ Sparse checkout ต่างกันยังไง', answer: 'Shallow clone ตัด commit history เก่า ดึงมาแค่ commit ล่าสุด Partial clone (--filter=blob:none) ไม่ดาวน์โหลดเนื้อไฟล์จนกว่าจะถูกเปิดอ่านจริง Sparse checkout ทำงานบนดิสก์แค่บาง directory ที่เลือกไว้ ใช้ร่วมกันได้เพื่อลดขนาด checkout ในสเกลใหญ่' },
    { question: 'Git LFS แก้ปัญหาอะไร', answer: 'ไฟล์ไบนารีขนาดใหญ่ทำให้ repo บวมเร็วเพราะ git เก็บทุกเวอร์ชันเต็มไฟล์ซ้ำๆ ใน history Git LFS เก็บแค่ pointer เล็กๆ ไว้ใน git history ส่วนเนื้อไฟล์จริงเก็บแยกไว้ใน storage ต่างหาก ดาวน์โหลดเฉพาะตอน checkout เวอร์ชันนั้นจริงๆ' },
    { question: 'นักพัฒนาบ่นว่า clone monorepo ใช้เวลานานมาก ควรแก้ยังไงโดยไม่ย้ายกลับ polyrepo', answer: 'ใช้ partial clone ร่วมกับ sparse checkout ให้นักพัฒนาแต่ละคน checkout เฉพาะ directory ที่ทีมตัวเองทำงานจริง และถ้า repo มี asset ไบนารีใหญ่ปนอยู่ควรย้ายเข้า Git LFS แยกจาก history หลัก ทำให้ clone เบาลงมากโดยยังคงข้อดีของ monorepo ไว้ครบ' },
  ],
  'source-control-case-studies:case-polyrepo-to-monorepo-migration': [
    { question: 'ปัญหา version drift ในเคส polyrepo 3 repo เกิดจากอะไร', answer: 'shared-types เปลี่ยนแต่ web team ไม่รู้ทันทีว่าต้อง bump dependency เพราะข้าม repo กัน กว่าจะรู้ตัวคือตอน production error type mismatch เพราะ CI ของแต่ละ repo แยกกันไม่มีที่ไหนรัน integration check ข้าม repo แบบ atomic' },
    { question: 'ทำไมทีมถึงตัดสินใจย้ายมา monorepo ไม่ใช่เพราะ monorepo ดีกว่าเสมอ', answer: 'เพราะอาการที่เจอ (version drift, ต้องเปิดหลาย PR ข้าม repo ต่อ 1 feature, CI แยกกันจับ integration bug ไม่ได้) ตรงกับปัญหาที่ monorepo แก้ได้ตรงจุดพอดี atomic commit ข้าม package และ CI ที่เห็นทั้งระบบในคอมมิตเดียว' },
    { question: 'สิ่งที่ต้องเตรียมก่อนย้าย polyrepo เป็น monorepo จริงมีอะไรบ้าง', answer: 'Nx/Turborepo สำหรับ incremental build, CODEOWNERS สำหรับกำหนด ownership ชัดเจน, sparse checkout ให้แต่ละทีมไม่ต้อง checkout โค้ดทั้งหมด, และ Conventional Commits พร้อม scope เพื่อให้ release automation รู้ว่า commit กระทบ package ไหน' },
  ],
  'source-control-case-studies:case-hotfix-under-gitflow': [
    { question: 'ทำไม hotfix กลางดึกในทีมที่ใช้ GitFlow ถึงช้ากว่าที่ควร', answer: 'ต้อง merge เข้า main แล้วยังต้อง merge กลับเข้า develop อีกรอบไม่งั้น release ถัดไปจะไม่มี fix นี้ และการ merge กลับนี้เจอ conflict เพราะ develop กับ main ห่างกันไปแล้วหลายสัปดาห์ ยิ่ง branch อายุยืนยิ่ง merge เจ็บปวด' },
    { question: 'ทำไม postmortem ไม่สรุปว่า GitFlow แย่ แต่แนะนำ Trunk-Based Development แทน', answer: 'เพราะ GitFlow เหมาะกับบริบทที่ต้อง maintain หลาย version พร้อมกันจริงๆ แต่ทีมนี้ deploy แค่ version เดียว ไม่เคยต้อง maintain version เก่าคู่ขนาน ตรงกับสัญญาณที่ควรใช้ Trunk-Based Development หรือ GitHub Flow แทนเพราะ deploy บ่อยไม่มี parallel release ให้ sync' },
    { question: 'Trunk-Based Development ต้องการวินัยอะไรเพิ่มขึ้นเทียบกับ GitFlow', answer: 'ทุก merge เข้า trunk ต้อง deploy ได้ทันทีเพราะไม่มี develop เป็นกันชน ต้องพึ่ง feature flags หนักขึ้นสำหรับงานที่ทำไม่เสร็จในวันเดียว และ CI ต้องเร็วและน่าเชื่อถือพอที่จะให้ merge บ่อยๆ ได้อย่างปลอดภัย' },
  ],
  'source-control-case-studies:case-broken-release-from-bad-version-bump': [
    { question: 'ทำไม commit "fix: เปลี่ยน default timeout" ถึงทำให้ 6 ทีมพัง ทั้งที่ commitlint ผ่าน', answer: 'commit เปลี่ยน default behavior ซึ่งควรเป็น breaking change (fix! หรือ BREAKING CHANGE footer) แต่ใช้ fix: ธรรมดา commitlint เช็กได้แค่รูปแบบว่ามี prefix ถูกไหม เช็กเนื้อหาว่าควรเป็น breaking change หรือไม่ไม่ได้เลย consumer ที่ใช้ ^ รับ PATCH อัตโนมัติเลยพังพร้อมกัน' },
    { question: 'ทำไมทั้ง CODEOWNERS และ semantic-release ทำงานถูกต้องตามออกแบบ แต่ยังเกิด incident ได้', answer: 'CODEOWNERS แก้ปัญหาใครควรรีวิว ไม่ใช่รีวิวละเอียดพอไหม reviewer เห็น diff เล็กเลยไม่คิดต่อว่ากระทบ consumer ยังไง semantic-release เชื่อ commit message 100% ตามที่ออกแบบไว้ จุดอ่อนอยู่ที่ input ไม่ใช่ตัว pipeline เอง' },
    { question: 'ทางแก้ที่ทีมเลือกใช้หลัง incident คืออะไร ทำไมถึงตรงจุดกว่าทางอื่น', answer: 'เพิ่ม review guideline เฉพาะ library ที่มี consumer เยอะ ให้ CODEOWNERS กำหนดว่าต้องมี reviewer อาวุโสเช็กเรื่อง breaking change โดยเฉพาะ เพราะจุดอ่อนคือ automation เชื่อ input โดยไม่เช็กเชิงความหมาย ซึ่งเป็นสิ่งที่เครื่องมือทำไม่ได้ ต้องพึ่งกระบวนการที่มนุษย์ทำอยู่แล้วคือ code review' },
  ],
  'ood-fundamentals:encapsulation-and-abstraction': [
    { question: 'Encapsulation กับ Abstraction ต่างกันยังไง', answer: 'Encapsulation คือการรวมข้อมูลกับพฤติกรรมไว้ด้วยกันแล้วจำกัดการเข้าถึงโดยตรงจากภายนอก เป็นกลไกในการซ่อน ส่วน Abstraction คือการตัดสินใจว่าอะไรคือสิ่งจำเป็นที่ผู้ใช้ class ต้องรู้แล้วเปิดเผยแค่นั้น เป็นการตัดสินใจเชิงออกแบบว่าจะซ่อนอะไรเปิดอะไร' },
    { question: 'ทำไม getter/setter ทุก field โดยไม่มี validation ถึงไม่ใช่ encapsulation ที่มีความหมาย', answer: 'เพราะโค้ดภายนอกยังคง set ค่าอะไรก็ได้ผ่าน setter เหมือนเดิม แค่เปลี่ยนรูปแบบการเข้าถึงจาก field ตรงๆ เป็น method ไม่ได้ป้องกันอะไรเลย encapsulation ที่มีความหมายต้องมีกฎทางธุรกิจอยู่ในจุดที่ข้อมูลถูกแก้ไข' },
    { question: 'ความสัมพันธ์ระหว่าง encapsulation กับ abstraction คืออะไร', answer: 'Encapsulation เป็นเครื่องมือที่ทำให้ abstraction เป็นจริงได้ ออกแบบ abstraction ที่ดีแค่ไหนก็ไร้ประโยชน์ถ้าไม่มี encapsulation บังคับว่าโค้ดภายนอกต้องผ่าน interface ที่ออกแบบไว้เท่านั้น' },
  ],
  'ood-fundamentals:coupling-and-cohesion': [
    { question: 'Tight coupling กับ loose coupling ต่างกันยังไง', answer: 'Tight coupling คือโมดูลหนึ่งสร้างหรือรู้จัก class ของอีกโมดูลตรงๆ ผูกติดกันแยกไม่ออก ส่วน loose coupling คือโมดูลรู้จักแค่ interface ไม่สนว่าเบื้องหลังเป็น implementation ไหน สลับได้โดยไม่ต้องแก้โค้ดที่เรียกใช้' },
    { question: 'เป้าหมายของการออกแบบที่ดีเกี่ยวกับ coupling และ cohesion คืออะไร', answer: 'low coupling และ high cohesion พร้อมกัน ถ้ามีแค่อย่างใดอย่างหนึ่งจะยังมีปัญหาอยู่ดี เช่น cohesion สูงแต่ coupling สูงการแก้โมดูลเดียวก็ยังกระทบทั้งระบบ หรือ coupling ต่ำแต่ cohesion ต่ำโค้ดจะกระจัดกระจายหาไม่เจอ' },
    { question: 'Shotgun Surgery คืออาการยังไง เกิดจากอะไร', answer: 'อาการที่แก้ feature เล็กน้อยต้องไล่แก้หลายไฟล์ที่กระจายอยู่ทั่ว codebase เกิดจาก coupling สูงเกินไป โมดูลที่ควรเป็นอิสระต่อกันกลับผูกติดกันแน่น logic ที่เกี่ยวข้องกระจายอยู่หลายที่โดยไม่มีจุดรวมศูนย์' },
  ],
  'ood-fundamentals:composition-vs-inheritance': [
    { question: 'Fragile Base Class Problem คืออะไร', answer: 'ปัญหาที่การเปลี่ยนแปลงใน parent class ส่งผลกระทบต่อ subclass ทุกตัวที่ inherit มา แม้บาง subclass จะไม่ต้องการพฤติกรรมนั้นเลย เช่น Penguin extends Bird ที่มี fly() ทั้งที่เพนกวินบินไม่ได้ ต้อง override ทิ้งหรือ throw error' },
    { question: 'ทำไม composition ถึงยืดหยุ่นกว่า inheritance', answer: 'Inheritance ผูกความสัมพันธ์ที่ compile time เปลี่ยนไม่ได้หลัง build ส่วน composition ให้ object มีพฤติกรรมเป็น field ที่ inject เข้ามา สลับ implementation ได้ที่ runtime โดยไม่กระทบโครงสร้าง class อื่น' },
    { question: 'เมื่อไหร่ที่ inheritance ยังสมเหตุสมผล ไม่ต้องเปลี่ยนเป็น composition', answer: 'เมื่อความสัมพันธ์ is-a เป็นจริงเสมอไม่มีข้อยกเว้น และ subclass ทุกตัวใช้พฤติกรรมของ parent ได้ครบทุกอย่างจริงๆ โดยไม่ต้อง override ทิ้งหรือ throw error เช่น Circle extends Shape ที่ Shape มีแค่ abstract method ให้ subclass implement เอง' },
  ],
  'solid-principles:srp-and-ocp': [
    { question: 'SRP หมายถึง class ควรมี method เดียวใช่ไหม', answer: 'ไม่ใช่ SRP หมายถึง class ควรมีเหตุผลให้เปลี่ยนแปลงแค่เหตุผลเดียว เป็นเรื่องของ actor หรือ stakeholder ที่เป็นเจ้าของ logic นั้น ถ้าหลาย method เปลี่ยนพร้อมกันเสมอเพราะ stakeholder เดียวกันสั่ง มันคือความรับผิดชอบเดียวกัน อยู่ class เดียวกันได้' },
    { question: 'OCP บอกอะไร แสดงออกเป็นโค้ดยังไง', answer: 'Module ควรเปิดสำหรับการขยายแต่ปิดสำหรับการแก้ไข เพิ่มพฤติกรรมใหม่ได้โดยไม่ต้องแก้โค้ดเดิม เช่นใช้ interface กับ polymorphism แทน if-else ที่ยาวขึ้นทุกครั้งที่มี case ใหม่ เพิ่ม class ใหม่ implement interface แทนที่จะแก้ function เดิม' },
    { question: 'ทำไมการเขียนโค้ดตาม OCP เป๊ะตั้งแต่วันแรกไม่ใช่แนวทางที่ดีเสมอไป', answer: 'เพราะ OCP มีต้นทุนต้องสร้าง abstraction เพิ่ม ถ้าเผื่อขยายล่วงหน้าสำหรับ requirement ที่ไม่เคยเกิดขึ้นจริงคือ over-engineering ควรเขียนตรงไปตรงมาก่อนแล้ว refactor ตาม OCP เมื่อเริ่มเห็นสัญญาณจริงว่าจุดนั้นมีแนวโน้มขยายบ่อย' },
  ],
  'solid-principles:liskov-substitution-principle': [
    { question: 'LSP บอกอะไร ต่างจากแค่ type signature ตรงกันยังไง', answer: 'Subtype ต้องสามารถแทนที่ base type ได้โดยไม่ทำให้ความถูกต้องของโปรแกรมเปลี่ยนไป ไม่ใช่แค่ compile ผ่านหรือมี method ครบตาม type signature แต่พฤติกรรมต้องใช้แทนกันได้จริงในทุกจุดที่โค้ดคาดหวัง contract ของ base class ไว้' },
    { question: 'ทำไม Square extends Rectangle ถึงละเมิด LSP', answer: 'Square.setWidth ต้องบังคับ height ให้เท่ากันด้วย ซึ่งทำลาย postcondition เดิมของ Rectangle.setWidth ที่ว่า height ไม่เปลี่ยน ทำให้โค้ดที่คาดหวังพฤติกรรมของ Rectangle ได้ผลลัพธ์ผิดทันทีที่ได้รับ Square มาแทน' },
    { question: 'กฎ precondition/postcondition ของ LSP คืออะไร', answer: 'Subclass ห้ามเข้มงวดกว่า base class ในเงื่อนไขก่อนทำงาน (precondition) และห้ามหย่อนกว่า base class ในผลลัพธ์ที่รับประกัน (postcondition) มีรากฐานจากแนวคิด design by contract' },
  ],
  'solid-principles:isp-and-dip': [
    { question: 'ISP บอกอะไร แก้ปัญหา fat interface ยังไง', answer: 'Client ไม่ควรถูกบังคับให้พึ่งพา method ที่ตัวเองไม่ได้ใช้ แก้ด้วยการแตก interface ใหญ่เป็น interface เล็กๆ ตามความสามารถจริง เช่น Printable, Scannable, Faxable แยกกัน แทน MultiFunctionDevice รวมทุกอย่างไว้ที่เดียว' },
    { question: 'DIP บอกอะไร ตัวอย่าง OrderService กับ database คืออะไร', answer: 'High-level module ไม่ควรพึ่งพา low-level module โดยตรง ทั้งคู่ควรพึ่งพา abstraction ร่วมกัน OrderService ควร depend on interface OrderRepository แทนที่จะ import MySQLDatabase ตรงๆ ทำให้สลับ database ได้โดยไม่ต้องแตะ OrderService' },
    { question: 'ทำไมการสร้าง interface ให้ทุก class ในระบบไม่ใช่การทำตาม DIP ที่ถูกต้อง', answer: 'DIP ไม่ได้บอกให้สร้าง interface ทุกจุด แต่บอกให้ high-level business logic ไม่ผูกติดกับ low-level implementation detail ที่มีแนวโน้มเปลี่ยนจริง สร้าง interface ทุก class โดยไม่มีเหตุผลคือ over-abstraction เพิ่ม indirection โดยไม่ได้ประโยชน์' },
  ],
  'creational-design-patterns:singleton': [
    { question: 'Singleton Pattern ทำอะไรสองอย่างพร้อมกัน', answer: 'ทำ constructor เป็น private ป้องกันไม่ให้สร้าง instance ใหม่ตรงๆ ด้วย new และเก็บ instance เดียวไว้ใน static field แล้วให้ getInstance() เป็นจุดเข้าถึงเดียวที่คืนค่า instance เดิมเสมอไม่ว่าจะเรียกกี่ครั้งก็ตาม' },
    { question: 'ทำไม Singleton ที่เรียกผ่าน static getInstance() ถึงขัดกับ Dependency Inversion Principle', answer: 'เพราะ class ที่เรียก getInstance() ตรงๆ มี dependency ที่ซ่อนอยู่ ไม่ปรากฏใน constructor หรือ parameter เลย ขัดกับ DIP ที่บอกว่า high-level module ควรพึ่งพา abstraction ที่ inject เข้ามา ทำให้ mock ตอน test ไม่ได้' },
    { question: 'ทางเลือกที่ดีกว่า Singleton แบบ static method ทั่วโค้ดคืออะไร', answer: 'ยังคงรักษา instance เดียวไว้ตามที่ธุรกิจต้องการจริง แต่เปลี่ยนวิธีส่งต่อจากการเรียก static method ทั่วโค้ด มาเป็น dependency injection ผ่าน constructor หรือ DI container แทน ได้ประโยชน์ของ instance เดียวครบโดยไม่เสีย testability' },
  ],
  'creational-design-patterns:factory-method-and-abstract-factory': [
    { question: 'Factory Method Pattern แก้ปัญหาอะไร เชื่อมกับ OCP ยังไง', answer: 'ย้าย logic การตัดสินใจว่าจะสร้าง concrete class ไหนมารวมไว้จุดเดียว โค้ดที่เรียกใช้ไม่ต้องรู้จัก concrete class ตรงๆ เมื่อเพิ่มชนิดใหม่แก้แค่ใน factory function จุดเดียว เป็นการนำ OCP มาทำเป็นรูปธรรม' },
    { question: 'Abstract Factory ต่างจาก Factory Method ยังไง', answer: 'Factory Method สร้าง object ชนิดเดียวต่อการเรียกแต่เลือกได้หลาย concrete class ส่วน Abstract Factory สร้าง object หลายชนิดพร้อมกันเป็นตระกูลที่ต้องเข้ากันได้ เช่น UI theme ที่ button กับ checkbox ต้องมาจาก theme เดียวกันเสมอ' },
    { question: 'เมื่อไหร่ที่การสร้าง Factory เป็นการเพิ่ม complexity โดยไม่จำเป็น', answer: 'เมื่อมีแค่ concrete class เดียวที่ไม่มีแนวโน้มเพิ่มชนิดใหม่เลย การสร้าง factory function ห่อ new ClassName() ไว้คือ over-engineering เพิ่ม indirection โดยไม่ได้ประโยชน์ Factory คุ้มค่าตอนมีมากกว่าหนึ่งชนิดที่ต้องเลือกจริง' },
  ],
  'creational-design-patterns:builder': [
    { question: 'Telescoping Constructor คืออาการยังไง Builder แก้ยังไง', answer: 'Constructor รับ parameter จำนวนมาก บาง optional ทำให้ต้องใส่ undefined คั่นตำแหน่ง อ่านไม่ออกว่าค่าไหนคืออะไร Builder แก้ด้วยการแยกสร้างทีละขั้นผ่าน method ที่ตั้งชื่อชัดเจน แล้วจบด้วย build() ที่ validate ครบถ้วนก่อนคืน object' },
    { question: 'ประโยชน์ที่แท้จริงของ method chaining ใน Builder คืออะไร ไม่ใช่แค่ syntax สวย', answer: 'เลื่อน validation ไปรวมที่จุดเดียวคือ build() แทนที่จะ validate ทุกครั้งที่ตั้งค่าแต่ละ field ทำให้สร้าง object ที่ยังไม่สมบูรณ์ระหว่างทางได้อย่างอิสระ โดยรับประกันว่า object สุดท้ายจาก build() ถูกต้องครบถ้วนเสมอ' },
    { question: 'เมื่อไหร่ไม่ควรใช้ Builder Pattern', answer: 'เมื่อ object มีแค่ไม่กี่ field (2-3 ตัว) ที่ required ทั้งหมดไม่มี optional การสร้าง Builder class แยกต่างหากคือการเพิ่ม boilerplate โดยไม่ได้ประโยชน์ ควรใช้ constructor ธรรมดาหรือ object literal ตรงไปตรงมาแทน' },
  ],
  'structural-design-patterns:adapter-and-facade': [
    { question: 'Adapter Pattern แก้ปัญหาอะไร', answer: 'ความเข้ากันไม่ได้ของ interface ระหว่างสองระบบที่มีอยู่แล้ว Adapter แปลงการเรียกจาก interface หนึ่งไปยังอีก interface หนึ่งโดยไม่ต้องแก้โค้ดฝั่งไหนเลย มักใช้ตอนรวม library ภายนอกหรือระบบเก่าเข้ากับโค้ดใหม่' },
    { question: 'Facade Pattern แก้ปัญหาอะไร ต่างจาก Adapter ยังไง', answer: 'Facade แก้ปัญหาความซับซ้อนในการใช้งานระบบที่มีหลายส่วนประสานกัน รวมหลาย service เข้าเป็นจุดเรียกเดียว ต่างจาก Adapter ที่แก้ปัญหาความเข้ากันไม่ได้ของ interface ระหว่าง 2 ระบบที่มีอยู่แล้วโดยไม่ได้ลดจำนวน service ที่ต้องเรียก' },
    { question: 'ทำไม Facade ไม่ควรใช้ปิดบังปัญหา coupling สูงระหว่าง service', answer: 'เพราะ Facade ควรใช้ลดความยุ่งยากในการเรียกใช้ ไม่ใช่ปิดบังความยุ่งเหยิงในการออกแบบ ถ้า service ต่างๆ coupling สูงเกินไปโดยไม่แก้ที่ต้นตอ ปัญหาที่แท้จริงยังอยู่เหมือนเดิม แค่มองไม่เห็นจากภายนอกเท่านั้น' },
  ],
  'structural-design-patterns:decorator-and-proxy': [
    { question: 'Decorator Pattern ทำงานยังไง เชื่อมกับ composition over inheritance ยังไง', answer: 'ห่อ object เดิมด้วย object ใหม่ที่ implement interface เดียวกัน แล้วเพิ่มพฤติกรรมก่อนหรือหลังเรียก method ของ object ที่ห่อไว้ ซ้อนกันได้หลายชั้นอย่างอิสระโดยไม่ต้องแก้ class เดิม เป็นรูปธรรมของหลักการ favor composition over inheritance' },
    { question: 'Proxy Pattern ต่างจาก Decorator ตรงเจตนายังไง', answer: 'ทั้งคู่ implement interface เดียวกับ object ที่ห่อไว้เหมือนกัน แต่ Decorator มีเจตนาเพิ่มความสามารถให้ object ส่วน Proxy มีเจตนาควบคุมการเข้าถึง object โดยพฤติกรรมสุดท้ายเหมือนเดิมทุกประการ เช่น lazy loading, access control, caching' },
    { question: 'ข้อควรระวังของการซ้อน Decorator หลายชั้นคืออะไร', answer: 'ซ้อนหลายชั้นเกินไป (5-6 ชั้นขึ้นไป) ทำให้ debug ยากมาก เพราะ error stack trace ต้องไล่ผ่านทุกชั้น decorator ก่อนถึง object จริง ควรซ้อนเท่าที่จำเป็นและตั้งชื่อ decorator ให้สื่อความหมายชัดเจน' },
  ],
  'structural-design-patterns:composite': [
    { question: 'Composite Pattern แก้ปัญหาอะไร', answer: 'ให้ leaf (เช่น File) และ composite (เช่น Folder) implement interface เดียวกัน ทำให้ client ปฏิบัติต่อ object เดี่ยวและกลุ่ม object แบบเดียวกันได้ ไม่ต้องเช็ค type ก่อนแล้วเขียน logic ต่างกันสองแบบ' },
    { question: 'ทำไม Folder.getSize() ทำงานถูกต้องไม่ว่าต้นไม้จะลึกกี่ชั้น', answer: 'เพราะเรียก child.getSize() แบบ recursive โดยไม่สนใจว่า child เป็น File หรือ Folder ย่อยอีกที ทุก node ไม่ว่า leaf หรือ composite คุยผ่าน interface เดียวกัน client ไม่จำเป็นต้องรู้โครงสร้างต้นไม้ข้างในเลย' },
    { question: 'ทำไม Composite Pattern มักปะทะกับ Interface Segregation Principle', answer: 'ถ้าใส่ method อย่าง add()/remove() ไว้ใน interface ร่วมเพื่อความสม่ำเสมอ leaf อย่าง File ต้อง implement แล้ว throw error ทิ้งเพราะไม่มีความหมายกับมัน ขัดกับ ISP ที่บอกว่า client ไม่ควรถูกบังคับพึ่งพา method ที่ตัวเองไม่ได้ใช้ ต้องชั่งน้ำหนักระหว่าง uniformity กับ type safety' },
  ],
  'behavioral-design-patterns:strategy-and-template-method': [
    { question: 'Strategy Pattern ทำงานยังไง เชื่อมกับ Composition vs Inheritance ยังไง', answer: 'Encapsulate อัลกอริทึมทั้งชุดไว้เป็น object แยก แล้วให้ context class ถือ reference ผ่าน composition สลับอัลกอริทึมได้ที่ runtime โดยไม่ต้องแก้ context class เป็นรูปธรรมของหลักการ favor composition over inheritance และเป็นการทำตาม OCP' },
    { question: 'Template Method ต่างจาก Strategy ตรงกลไกยังไง', answer: 'Template Method ใช้ inheritance กำหนดลำดับขั้นตอนของอัลกอริทึมไว้ตายตัวใน method เดียว แล้วให้ subclass override แค่บางขั้นตอนย่อย ต่างจาก Strategy ที่ใช้ composition สลับอัลกอริทึมทั้งชุดได้ที่ runtime' },
    { question: 'ทำไม Template Method ถึงมีความเสี่ยงแบบเดียวกับที่เรียนในหัวข้อ Liskov Substitution Principle', answer: 'เพราะพึ่งพา inheritance ถ้า subclass override ขั้นตอนใดขั้นตอนหนึ่งแล้วทำลาย invariant ที่ template method คาดหวังไว้ จะเกิดปัญหาแบบเดียวกับ Fragile Base Class Problem ควรพิจารณา Strategy แทนถ้าต้องการความยืดหยุ่นสูงและกังวลเรื่องนี้' },
  ],
  'behavioral-design-patterns:observer': [
    { question: 'Observer Pattern ทำงานยังไง แก้ปัญหาอะไร', answer: 'Subject เก็บรายชื่อ Observer ที่สนใจการเปลี่ยนแปลงไว้ เมื่อ state เปลี่ยนเรียก notify() วนแจ้งทุก observer โดย Subject ไม่ต้องรู้ concrete type ของ observer เลย แก้ปัญหาเดียวกับ Coupling & Cohesion และ OCP คือเพิ่ม observer ใหม่ได้โดยไม่ต้องแก้ Subject' },
    { question: 'ปัญหา memory leak ของ Observer Pattern เกิดจากอะไร แก้ยังไง', answer: 'เกิดจากลืม unsubscribe observer ที่ถูกทำลายไปแล้ว ทำให้ Subject ยังถือ reference ค้างไว้ ป้องกัน garbage collector เก็บไปได้ ทางแก้คือต้อง unsubscribe เสมอในจังหวะที่ observer ถูกทำลาย ซึ่ง framework สมัยใหม่มักผูกไว้กับ lifecycle hook อัตโนมัติ' },
    { question: 'Observer Pattern เป็นรากฐานของอะไรในระดับสถาปัตยกรรม', answer: 'เป็นรากฐานระดับ OOD ของระบบ event-driven ขนาดใหญ่ เช่น message queue, pub-sub, event bus ที่ทำ decoupling ระหว่างผู้ส่งกับผู้รับแบบเดียวกันแต่ในระดับสถาปัตยกรรมทั้งระบบ' },
  ],
  'behavioral-design-patterns:command-and-state': [
    { question: 'Command Pattern ทำอะไร ทำให้ทำอะไรได้บ้างที่เรียก method ตรงๆ ทำไม่ได้', answer: 'Encapsulate การเรียก method หนึ่งครั้งให้กลายเป็น object ที่มี execute() ทำให้เข้าคิวคำสั่งได้ log คำสั่งไว้เป็น audit trail ได้ และ undo ได้เพราะ command เก็บทั้งวิธีทำและวิธีย้อนกลับไว้คู่กัน' },
    { question: 'State Pattern แก้ปัญหาอะไร ต่างจาก if-else เช็ค state ยังไง', answer: 'ย้าย logic การเปลี่ยนสถานะออกจาก context class ไปเป็น class แยกต่อ state หนึ่ง แต่ละ state object รู้เองว่าต้องเปลี่ยนไปเป็น state ไหนต่อ แทนที่จะมี if-else เช็ค state กระจายอยู่ทุกที่ในโค้ด' },
    { question: 'ทำไม State Pattern ถึงถูกมองว่าเป็น Strategy Pattern แบบพิเศษ', answer: 'ทั้งสองใช้กลไกเดียวกันคือ context ถือ reference ไปยัง object ที่ implement interface ร่วมแล้วมอบหมายพฤติกรรมให้ทำแทน แต่ State เพิ่มความสามารถพิเศษคือ state object รู้เองว่าควรเปลี่ยนไปเป็น state ไหนต่อ ขณะที่ Strategy ทั่วไปไม่มีความรับผิดชอบเรื่องสลับตัวเอง' },
  ],
  'clean-architecture-and-folder-structure:layered-architecture': [
    { question: 'Layered Architecture แบบดั้งเดิมมีปัญหาอะไรซ่อนอยู่ ทั้งที่แบ่งเป็นชั้นชัดเจนแล้ว', answer: 'Business Layer มักยัง import concrete class ของ Data Access Layer ตรงๆ (เช่น MySQLUserRepository) ทำให้ high-level module ผูกติดกับ low-level module โดยตรง ขัดกับ Dependency Inversion Principle แม้การแบ่งชั้นจะดูเป็นระเบียบแล้วก็ตาม' },
    { question: 'ผลที่ตามมาเมื่อ business logic ผูกติดกับ concrete repository โดยตรงคืออะไร', answer: 'เขียน unit test ให้ business logic โดยไม่ต่อ database จริงไม่ได้ และสลับ implementation ของ data access (เช่นเปลี่ยนจาก MySQL เป็น PostgreSQL) ไม่ได้โดยไม่แก้ business layer' },
    { question: 'The Dependency Rule ของ Clean Architecture มีไว้ตอบคำถามอะไรที่ Layered Architecture แบบดั้งเดิมตอบไม่ได้', answer: 'ตอบคำถามว่า business logic ทดสอบได้โดยไม่ต้องต่อ database จริงไหม และสลับ implementation ของ data access ได้โดยไม่แก้ business layer ไหม ด้วยการบังคับทิศทาง dependency ให้ถูกต้องผ่าน interface แทนการ import concrete class ตรงๆ' },
  ],
  'clean-architecture-and-folder-structure:the-dependency-rule': [
    { question: 'The Dependency Rule บอกอะไร', answer: 'Source code dependency ต้องชี้เข้าหาศูนย์กลางเท่านั้น ห้ามชี้ออก Entities ไม่รู้จักอะไรนอกวงตัวเอง Use Cases รู้จักแค่ Entities ไม่รู้จัก Interface Adapters หรือ Frameworks เลย ยิ่งเข้าใกล้ศูนย์กลางยิ่งเป็น business logic ล้วนๆ ที่ไม่ผูกกับ framework หรือ database' },
    { question: 'The Dependency Rule เชื่อมกับ Dependency Inversion Principle ยังไง', answer: 'เป็นการนำ DIP ไปใช้ทั้งสถาปัตยกรรมแทนที่จะใช้แค่ระดับ class เดียว use case พึ่งพา interface (port) ไม่รู้จัก concrete implementation (adapter) เลย การประกอบร่างว่าจะใช้ adapter ไหนเกิดที่จุดเริ่มต้นโปรแกรม (composition root)' },
    { question: 'การละเมิด Dependency Rule ที่พบบ่อยที่สุดคืออะไร', answer: 'การ import type หรือ class ของ framework เข้าไปใน Entities/Use Cases โดยไม่รู้ตัว เช่น use case ที่รับ parameter เป็น Express.Request ตรงๆ ทำให้ business logic ผูกติดกับ web framework ทั้งที่ไม่ควรรู้จักเลย' },
  ],
  'clean-architecture-and-folder-structure:folder-structure-in-practice': [
    { question: 'Layer-based กับ Feature-based folder structure ต่างกันยังไง', answer: 'Layer-based จัดโฟลเดอร์ตามชั้นของ Clean Architecture โดยตรง เห็นภาพรวม use case ทั้งหมดง่ายแต่แก้ feature เดียวต้องกระโดดหลายโฟลเดอร์ Feature-based จัดตาม domain รวมทุกชั้นของ feature เดียวกันไว้ที่เดียว ตรงกับหลัก high cohesion แต่มองภาพรวมทั้งระบบยากกว่า' },
    { question: 'Folder structure บังคับ The Dependency Rule ได้จริงไหม', answer: 'ไม่ได้ folder structure เป็นแค่การจัดระเบียบการมองเห็นไฟล์ ไม่ใช่ตัวบังคับทิศทาง dependency จริง ต้องบังคับด้วยวินัยการเขียน import statement เสริมด้วย lint rule อัตโนมัติได้ เช่น ESLint boundaries plugin' },
    { question: 'เมื่อไหร่ที่ใช้ Clean Architecture แบบเต็มรูปแบบคือการทำเกินความจำเป็น', answer: 'เมื่อระบบเป็น CRUD app เล็กๆ ที่มี business logic น้อยมาก แทบจะแค่ read/write database ตรงๆ ต้นทุนของการเขียน interface, dependency injection, composition root อาจไม่คุ้มค่า คุ้มค่าที่สุดเมื่อ business logic ซับซ้อนจริงและมีแนวโน้มต้องสลับ infrastructure บ่อย' },
  ],
  'lld-case-studies:case-parking-lot': [
    { question: 'การแบ่ง ParkingSpot, Ticket, ParkingLot เป็น class แยกกันในเคส Parking Lot สะท้อนหลักการอะไร', answer: 'Single Responsibility Principle แต่ละ class มีเหตุผลให้เปลี่ยนแปลงแค่เหตุผลเดียว ParkingSpot รู้แค่สถานะตัวเอง Ticket รู้แค่ข้อมูลการจอด ParkingLot รับผิดชอบหาช่องว่างและออกตั๋ว ถ้ายัดรวมกันจะกลายเป็น God Class' },
    { question: 'ทำไมการคำนวณค่าจอดรถถึงเหมาะกับ Strategy Pattern', answer: 'เพราะอัตราค่าจอดมีแนวโน้มเปลี่ยนบ่อย (โปรโมชั่น, รายชั่วโมงเทียบเหมาจ่าย, ส่วนลดสมาชิก) encapsulate การคำนวณแต่ละแบบเป็น object แยกทำให้เพิ่มอัตราใหม่ได้โดยไม่แก้โค้ดเดิม ตรงตาม OCP' },
    { question: 'ทำไมการหาช่องว่างแล้ว occupy ต้องเป็น atomic operation เดียวกัน', answer: 'เพราะถ้าแยกเป็นสองขั้นตอน (หาช่องว่างแล้วค่อย occupy) ระหว่างสองขั้นตอนนี้อาจมีคำขอที่สองมาแทรกได้ ทำให้สองคันจองช่องเดียวกันพร้อมกัน (race condition) ต้องออกแบบเป็น method เดียวที่ atomic เช่น findAndOccupySpot()' },
  ],
  'lld-case-studies:case-rate-limiter': [
    { question: 'ทำไม RateLimiter ควรออกแบบให้พึ่งพา interface RateLimitStrategy ตั้งแต่แรก', answer: 'เพราะ rate limiting เป็นโดเมนที่รู้ล่วงหน้าว่ามีอัลกอริทึมหลายแบบใช้จริงในอุตสาหกรรม (fixed window, sliding window, token bucket) แต่ละแบบมี trade-off ต่างกัน การออกแบบให้สลับได้ตั้งแต่แรกจึงตอบสนองสัญญาณจริง ไม่ใช่การเผื่อขยายแบบเดาตาม YAGNI' },
    { question: 'Token Bucket algorithm ทำงานยังไง ข้อดีเทียบกับ Fixed Window คืออะไร', answer: 'แต่ละ client มีถังเก็บ token ทุก request เบิก token ไป 1 หน่วย ถังเติม token กลับตามอัตราที่กำหนด รองรับ burst traffic ได้ในระดับหนึ่งถ้าถังเต็มพอดี ต่างจาก Fixed Window ที่มีปัญหา burst ที่ขอบหน้าต่างเวลา' },
    { question: 'ทำไม thread safety ถึงเป็นจุดที่มักถูกมองข้ามในการออกแบบ Rate Limiter', answer: 'เพราะการอ่าน-แก้ไขค่า token ต้องเป็น atomic operation ถ้าใช้ Map ธรรมดาในระบบ concurrent จริง สอง request ที่มาพร้อมกันอาจอ่านค่า token ก่อนอีกฝ่ายเขียนค่าใหม่ ทำให้ปล่อยผ่าน request มากกว่าที่ควร ต้องใช้ atomic counter หรือ distributed lock แทน' },
  ],
  'lld-case-studies:case-elevator-system': [
    { question: 'ทำไมลิฟต์ถึงเป็นตัวอย่างคลาสสิกของ State Pattern', answer: 'เพราะพฤติกรรมเปลี่ยนตามสถานะปัจจุบันชัดเจนมาก เช่นลิฟต์ที่กำลังเปิดประตูไม่ควรตอบสนองคำสั่งเคลื่อนที่ ทั้งที่ลิฟต์ idle ตอบสนองได้ปกติ State Pattern ย้าย logic นี้ไปไว้ที่ state object แต่ละตัวแทนการเช็ค if-else กระจายทั่วโค้ด' },
    { question: 'Command Pattern มีบทบาทอะไรในระบบลิฟต์', answer: 'Encapsulate การกดปุ่มแต่ละครั้งให้เป็น object ที่เข้าคิวได้ ทำให้ระบบรับคำสั่งจากหลายชั้นพร้อมกันได้ต่อเนื่องแม้ลิฟต์จะไม่ว่าง แทนที่จะประมวลผลทันทีที่กด และเปิดโอกาส log คำสั่งไว้ตรวจสอบย้อนหลังได้' },
    { question: 'ทำไมโจทย์ Elevator System ถึงใช้ pattern สามตัวพร้อมกัน (State, Command, Strategy)', answer: 'เพราะปัญหามีสามมิติต่างกันพร้อมกัน: พฤติกรรมที่เปลี่ยนตามสถานะ (State) คำขอที่ต้องเข้าคิว (Command) และอัลกอริทึมจัดสรรลิฟต์ที่ต้องสลับได้ (Strategy) การแตกปัญหาใหญ่ให้เห็นมิติย่อยแล้วเลือก pattern ที่ตรงกับแต่ละมิติคือทักษะหลักของ LLD ไม่ใช่การยัดทุกอย่างไว้ใน class เดียว' },
  ],
}

// Stable hash of the question text — so a question's id (and its
// spaced-repetition progress) stays attached to its content even if the
// array order changes, instead of drifting when questions are
// reordered/inserted.
function stableId(prefix: string, text: string): string {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i)
    hash |= 0
  }
  return `${prefix}#${(hash >>> 0).toString(36)}`
}

export function getRawQuizKeys(): string[] {
  return Object.keys(RAW_QUIZZES)
}

export function getQuizForTopic(moduleSlug: string, topicId: string): QuizQA[] {
  return RAW_QUIZZES[`${moduleSlug}:${topicId}`] ?? []
}

export function getQuizItemsForTopic(moduleSlug: string, topicId: string, moduleTitle: string, topicTitle: string): QuizItem[] {
  const prefix = `${moduleSlug}:${topicId}`
  return getQuizForTopic(moduleSlug, topicId).map((qa) => ({
    ...qa,
    id: stableId(prefix, qa.question),
    moduleSlug,
    moduleTitle,
    topicId,
    topicTitle,
  }))
}

export function getAllQuizItems(): QuizItem[] {
  const out: QuizItem[] = []
  for (const mod of modules) {
    for (const topic of mod.topics) {
      out.push(...getQuizItemsForTopic(mod.slug, topic.id, mod.title, topic.title))
    }
  }
  return out
}
