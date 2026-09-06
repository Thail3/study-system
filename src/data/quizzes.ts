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
        'L4 มองแค่ IP+port (เร็ว ตัดสินใจหยาบ) ส่วน L7 อ่านเนื้อหา HTTP จริง (path/header/cookie) ตัดสินใจฉลาดกว่าแต่ช้ากว่าเล็กน้อย แยกงานตาม path ได้',
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
      answer: 'กระบวนการแปลงชื่อโดเมน (เช่น google.com) เป็น IP address จริงที่เครื่องใช้เชื่อมต่อได้ เพราะคอมพิวเตอร์รู้แค่ชื่อ ไม่รู้ที่อยู่จริง',
    },
    {
      question: 'ทำไม DNS ถึงเร็วทั้งที่มีหลายขั้นตอน (root → TLD → authoritative)',
      answer: 'เพราะมีการ cache ผลลัพธ์ไว้ทุกขั้นตอน (ตาม TTL) ถ้าเคยถามชื่อนี้มาก่อน ไม่ต้องเดินครบทุกขั้นตอนซ้ำ',
    },
    {
      question: 'TTL สั้นกับยาว ต่างกันยังไง มีข้อดี-เสียยังไง',
      answer:
        'TTL สั้น = รู้ IP ใหม่เร็วขึ้นถ้าเปลี่ยนที่อยู่ แต่ต้องถามซ้ำบ่อยขึ้น (โหลดเยอะขึ้นที่ resolver). TTL ยาว = โหลดน้อยกว่าแต่รู้การเปลี่ยนแปลงช้ากว่า',
    },
  ],
  'fundamentals:http-lifecycle': [
    {
      question: 'เรียงลำดับขั้นตอนตั้งแต่พิมพ์ URL จนเห็นหน้าเว็บ มีอะไรบ้าง (คร่าวๆ)',
      answer:
        'DNS Resolution → TCP Handshake → TLS Handshake (ถ้า HTTPS) → ส่ง HTTP Request → Server ประมวลผล → ส่ง HTTP Response → Browser Render',
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
        'TCP การันตีว่าข้อมูลถึงครบ/เรียงลำดับถูก (มี handshake ก่อนส่ง) ใช้กับเว็บไซต์/โอนไฟล์/โอนเงิน. UDP ส่งเลยไม่รอยืนยัน เร็วกว่าแต่ข้อมูลอาจหายได้ ใช้กับ video call/เกม/DNS',
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
        'เพราะ HTTP ปกติ client ต้องถามก่อนเสมอ server พูดเองไม่ได้ แอป real-time ต้องการให้ server "บอกทันที" เมื่อมีอะไรใหม่โดย client ไม่ต้องถามซ้ำ',
    },
    {
      question: 'Long Polling ต่างจาก Short Polling ยังไง',
      answer:
        'Short Polling ถามซ้ำเป็นรอบๆ ได้คำตอบทันทีแต่ส่วนใหญ่ไม่มีอะไรใหม่ (เสียเวลาเปล่า+ดีเลย์). Long Polling server ถ่วงคำตอบไว้จนมีข้อมูลใหม่จริงค่อยตอบ (ดีเลย์ต่ำกว่ามาก) แต่ server ต้องถือ connection ค้างจำนวนมาก',
    },
    {
      question: 'SSE กับ WebSocket ต่างกันตรงไหน',
      answer: 'SSE ส่งข้อมูลทางเดียว (server → client เท่านั้น). WebSocket ส่งได้สองทาง (client ↔ server พร้อมกัน) เหมาะกับแชทที่ต้องโต้ตอบกันตลอด',
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
      answer: 'LRU ดูว่า "นานแค่ไหนที่ไม่ถูกแตะ". LFU ดูว่า "ถูกหยิบกี่ครั้ง" (ความถี่) ทิ้งตัวที่ถูกหยิบน้อยครั้งสุด ไม่สนว่าหยิบล่าสุดเมื่อไหร่',
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
        'EDA คือให้ service สื่อสารกันผ่านการ "ประกาศเหตุการณ์" (ใช้ Pub/Sub) แทนที่จะเรียกกันตรงๆ — ลด tight coupling ที่เกิดจากการสั่งงานตรงๆ ที่ต้องรู้จักทุก service ปลายทาง',
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
        'REST ใช้ HTTP verb ปกติ + JSON อ่านง่าย เหมาะกับ public API/client ภายนอก. gRPC ใช้ Protocol Buffers (binary) เร็วกว่ามาก รองรับ streaming เหมาะกับการสื่อสารระหว่าง service ภายในองค์กรเอง',
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
      answer: 'AuthN ตอบคำถาม "คุณเป็นใคร" (พิสูจน์ตัวตน เช่น login). AuthZ ตอบคำถาม "คุณเข้าถึงสิ่งนี้ได้ไหม" (ตรวจสิทธิ์)',
    },
    {
      question: 'ทำไม 401 กับ 403 ถึงต่างกัน',
      answer: '401 Unauthorized = ยังไม่ผ่านด่าน AuthN (ไม่รู้ว่าคุณเป็นใคร/token หมดอายุ). 403 Forbidden = ผ่าน AuthN แล้ว (รู้ว่าคุณเป็นใคร) แต่ไม่มีสิทธิ์ทำสิ่งนี้ (ผ่าน AuthZ ไม่ได้)',
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
        'JWT เก็บข้อมูลผู้ใช้ไว้ในตัว token เอง (encode+sign) server ตรวจสอบแค่ signature ก็รู้ว่าถูกต้องไหม โดยไม่ต้องเก็บ session state หรือถามที่ไหนเพิ่ม — ทำให้ server เป็น stateless ได้เต็มที่',
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
      answer: 'ทักษะประเมินตัวเลขคร่าวๆ (QPS, ขนาดข้อมูล) ก่อนออกแบบระบบ สำคัญเพราะถ้าตอบไม่ได้เป็นตัวเลข การออกแบบก็เป็นแค่การเดา',
    },
    {
      question: 'ทำไมไม่ต้องคำนวณให้แม่นยำ 100%',
      answer: 'เป้าหมายคือรู้ "ระดับขนาด" (order of magnitude) แค่หลักสิบ/พัน/ล้าน/ร้อยล้านก็พอ เพราะคำตอบต่างกันแค่ order of magnitude เดียวก็เปลี่ยนสถาปัตยกรรมที่เหมาะสมไปคนละแบบแล้ว',
    },
    {
      question: 'กระบวนการคิด capacity estimation มาตรฐาน 5 ขั้นมีอะไรบ้าง (คร่าวๆ)',
      answer:
        '(1) ตั้งสมมติฐานจำนวนผู้ใช้ (2) ประเมิน action/user/วัน (3) คำนวณ requests/วัน → QPS เฉลี่ย (4) คูณ peak multiplier → QPS พีค (5) ประเมินขนาดข้อมูล → storage/bandwidth',
    },
  ],
  'capacity-estimation:latency-numbers': [
    {
      question: 'ทำไม RAM ถึงเร็วกว่า Disk (SSD/HDD) มาก',
      answer:
        'RAM อยู่ใกล้ CPU ที่สุด (~100 nanoseconds) ในขณะที่ SSD/HDD ต้องเข้าถึงผ่านกลไกที่ช้ากว่ามาก (SSD ~100 microseconds, HDD ~10 milliseconds) ต่างกันเป็นพันถึงแสนเท่า',
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
      answer: 'Average QPS คือภาระเฉลี่ยตลอดวัน. Peak QPS คือช่วงที่ภาระสูงสุด — Peak สำคัญกว่าเพราะระบบต้องรอดตอนพีคที่สุด ไม่ใช่แค่ค่าเฉลี่ย',
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
