import type { Order, Allergy } from '../types';

const mockAllergies: Allergy[] = [
  {
    id: 'a1',
    component: 'ペニシリン系抗生物質',
    severity: '重度',
    symptoms: '呼吸困難、発疹',
    registeredDate: '2024/03/15',
    source: '本人申告'
  },
  {
    id: 'a2',
    component: '造影剤',
    severity: '中等度',
    symptoms: '発疹、かゆみ',
    registeredDate: '2024/06/20',
    source: '医師記録'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-009',
    status: '受付済',
    patientId: 'P00012353',
    patientName: '小林 健',
    patientKana: 'コバヤシ ケン',
    gender: '男',
    birthDate: '1972/09/18',
    age: 53,
    orderType: '内視鏡検査',
    examinationType: '内視鏡検査',
    endoscopyDetails: '上部消化管内視鏡検査（生検あり）',
    content: '上部消化管内視鏡検査',
    allergies: [],
    hasAllergies: false,
    location: '外来',
    category: '検査',
    department: '内科',
    attendingDoctor: '田中医師',
    ward: '外来A',
    roomNumber: '内視鏡室',
    receivedAt: '2025/10/15 11:00',
    acceptedAt: '2025/10/15 11:30',
    acceptedBy: '看護師C',
    statusHistory: [
      { status: '指示受済', timestamp: '2025/10/15 11:00', updatedBy: '田中医師' },
      { status: '受付済', timestamp: '2025/10/15 11:30', updatedBy: '看護師C' }
    ]
  },
  {
    id: 'ORD-010',
    status: '指示受済',
    patientId: 'P00012354',
    patientName: '松本 恵子',
    patientKana: 'マツモト ケイコ',
    gender: '女',
    birthDate: '1988/02/28',
    age: 37,
    orderType: '内視鏡検査',
    examinationType: '内視鏡検査',
    endoscopyDetails: '大腸内視鏡検査',
    content: '大腸内視鏡検査',
    allergies: [],
    hasAllergies: false,
    location: '外来',
    category: '検査',
    department: '内科',
    attendingDoctor: '佐々木医師',
    ward: '外来B',
    roomNumber: '内視鏡室',
    receivedAt: '2025/10/15 12:15',
    statusHistory: [
      { status: '指示受済', timestamp: '2025/10/15 12:15', updatedBy: '佐々木医師' }
    ]
  },
  {
    id: 'ORD-033',
    status: '実施済',
    patientId: 'P00012374',
    patientName: '中野 裕太',
    patientKana: 'ナカノ ユウタ',
    gender: '男',
    birthDate: '1965/04/12',
    age: 60,
    orderType: '内視鏡検査',
    examinationType: '内視鏡検査',
    endoscopyDetails: '上部消化管内視鏡検査（ポリープ切除）',
    content: '上部消化管内視鏡検査（ポリープ切除）',
    allergies: [],
    hasAllergies: false,
    location: '外来',
    category: '検査',
    department: '消化器内科',
    attendingDoctor: '山本医師',
    ward: '外来C',
    roomNumber: '内視鏡室',
    receivedAt: '2025/10/15 08:30',
    acceptedAt: '2025/10/15 09:00',
    acceptedBy: '看護師A',
    implementedAt: '2025/10/15 09:45',
    implementedBy: '山本医師',
    implementationNotes: '胃体部に5mmポリープ確認、内視鏡的切除実施。出血なし。',
    statusHistory: [
      { status: '指示受済', timestamp: '2025/10/15 08:30', updatedBy: '山本医師' },
      { status: '受付済', timestamp: '2025/10/15 09:00', updatedBy: '看護師A' },
      { status: '実施済', timestamp: '2025/10/15 09:45', updatedBy: '山本医師' }
    ]
  }
];

export const contraindications = [
  {
    id: 'c1',
    medication: 'ペニシリン系抗生物質',
    allergen: 'ペニシリン系抗生物質',
    severity: '禁忌',
    match: true
  },
  {
    id: 'c2',
    medication: '造影剤使用検査',
    allergen: '造影剤',
    severity: '要注意',
    match: false
  }
];

export const medicalHistory = [
  {
    id: 'h1',
    condition: '高血圧症',
    diagnosedDate: '2020/04/01',
    status: '治療継続中'
  },
  {
    id: 'h2',
    condition: '糖尿病（2型）',
    diagnosedDate: '2018/09/15',
    status: '治療継続中'
  }
];