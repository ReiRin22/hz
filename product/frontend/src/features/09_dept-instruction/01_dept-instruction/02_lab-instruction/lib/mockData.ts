import type { Order, Allergy } from '../../types';

const mockAllergies: Allergy[] = [
  {
    id: 'a1',
    component: 'ペニシリン系抗生物質',
    category: 'MEDICATION',
    severity: 'SEVERE',
    symptoms: '呼吸困難、発疹',
    registeredDate: '2024/03/15',
    source: '本人申告'
  },
  {
    id: 'a2',
    component: '造影剤',
    category: 'MEDICATION',
    severity: 'MODERATE',
    symptoms: '発疹、かゆみ',
    registeredDate: '2024/06/20',
    source: '医師記録'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-002',
    status: 'accepted',
    patientId: 'P00012346',
    patientName: '佐藤 花子',
    patientKana: 'サトウ ハナコ',
    gender: 'FEMALE',
    birthDate: '1978/08/22',
    age: 47,
    orderType: 'SPECIMEN_TEST',
    examinationType: 'SPECIMEN_TEST',
    content: '血液検査（CBC、生化学）',
    visualIndicator: {
      tubeType: 'PURPLE_CAP',
      tubeColor: '#8B5CF6'
    },
    allergies: [],
    hasAllergies: false,
    location: 'OUTPATIENT',
    department: 'INTERNAL_MEDICINE',
    attendingDoctor: '佐々木医師',
    ward: '外来B',
    roomNumber: '採血室',
    labTestLocation: '院内検査',
    receivedAt: '2025/10/15 08:45',
    acceptedAt: '2025/10/15 09:30',
    acceptedBy: '看護師A',
    scheduledTime: '09:00',
    statusHistory: [
      { status: 'received', timestamp: '2025/10/15 08:45', updatedBy: '佐々木医師' },
      { status: 'accepted', timestamp: '2025/10/15 09:30', updatedBy: '看護師A' }
    ]
  },
  {
    id: 'ORD-008',
    status: 'started',
    patientId: 'P00012352',
    patientName: '中村 春香',
    patientKana: 'ナカムラ ハルカ',
    gender: 'FEMALE',
    birthDate: '1995/05/12',
    age: 30,
    orderType: 'PHYSIOLOGICAL_TEST',
    examinationType: 'PHYSIOLOGICAL_TEST',
    content: '心電図検査',
    visualIndicator: {
      physiologicalTestType: 'ECG'
    },
    physiologicalTestType: 'ECG',
    allergies: [],
    hasAllergies: false,
    location: 'OUTPATIENT',
    department: 'INTERNAL_MEDICINE',
    attendingDoctor: '田中医師',
    ward: '外来A',
    roomNumber: '検査室1',
    receivedAt: '2025/10/15 10:45',
    acceptedAt: '2025/10/15 11:00',
    acceptedBy: '看護師B',
    statusHistory: [
      { status: 'accepted', timestamp: '2025/10/15 10:50', updatedBy: '看護師B' },
      { status: 'started', timestamp: '2025/10/15 11:00', updatedBy: '看護師B' }
    ]
  },
  {
    id: 'ORD-012',
    status: 'implemented',
    patientId: 'P00012345',
    patientName: '山田 太郎',
    patientKana: 'ヤマダ タロウ',
    gender: 'MALE',
    birthDate: '1965/04/15',
    age: 60,
    orderType: 'SPECIMEN_TEST',
    examinationType: 'SPECIMEN_TEST',
    content: '血液検査（肝機能）',
    visualIndicator: {
      tubeType: 'YELLOW_CAP',
      tubeColor: '#EAB308'
    },
    allergies: [mockAllergies[0]],
    hasAllergies: true,
    location: 'OUTPATIENT',
    department: 'INTERNAL_MEDICINE',
    attendingDoctor: '田中医師',
    ward: '外来A',
    roomNumber: '採血室',
    receivedAt: '2025/10/15 08:15',
    acceptedAt: '2025/10/15 08:30',
    implementedAt: '2025/10/15 08:45',
    implementedBy: '臨床検査技師A',
    implementationNotes: '採血実施。検体検査室へ提出済み。',
    scheduledTime: '08:30',
    statusHistory: [
      { status: 'received', timestamp: '2025/10/15 08:15', updatedBy: '田中医師' },
      { status: 'accepted', timestamp: '2025/10/15 08:30', updatedBy: '看護師A' },
      { status: 'implemented', timestamp: '2025/10/15 08:45', updatedBy: '臨床検査技師A' }
    ]
  },
  {
    id: 'ORD-015',
    status: 'received',
    patientId: 'P00012356',
    patientName: '木村 良子',
    patientKana: 'キムラ ヨシコ',
    gender: 'FEMALE',
    birthDate: '1980/06/10',
    age: 45,
    orderType: 'SPECIMEN_TEST',
    examinationType: 'SPECIMEN_TEST',
    content: '凝固系検査（PT、APTT）',
    visualIndicator: {
      tubeType: 'LIGHT_BLUE_CAP',
      tubeColor: '#06B6D4'
    },
    allergies: [],
    hasAllergies: false,
    location: 'OUTPATIENT',
    department: 'INTERNAL_MEDICINE',
    receivedAt: '2025/10/15 13:00',
    statusHistory: [
      { status: 'received', timestamp: '2025/10/15 13:00', updatedBy: '佐々木医師' }
    ]
  },
  {
    id: 'ORD-016',
    status: 'accepted',
    patientId: 'P00012357',
    patientName: '斎藤 明',
    patientKana: 'サイトウ アキラ',
    gender: 'MALE',
    birthDate: '1952/03/22',
    age: 73,
    orderType: 'SPECIMEN_TEST',
    examinationType: 'SPECIMEN_TEST',
    content: '血糖検査',
    visualIndicator: {
      tubeType: 'GRAY_CAP',
      tubeColor: '#6B7280'
    },
    allergies: [],
    hasAllergies: false,
    location: 'OUTPATIENT',
    department: 'INTERNAL_MEDICINE',
    receivedAt: '2025/10/15 13:15',
    acceptedAt: '2025/10/15 13:20',
    acceptedBy: '看護師B',
    statusHistory: [
      { status: 'received', timestamp: '2025/10/15 13:15', updatedBy: '田中医師' },
      { status: 'accepted', timestamp: '2025/10/15 13:20', updatedBy: '看護師B' }
    ]
  },
  {
    id: 'ORD-018',
    status: 'collected',
    patientId: 'P00012359',
    patientName: '池田 和夫',
    patientKana: 'イケダ カズオ',
    gender: 'MALE',
    birthDate: '1968/07/14',
    age: 57,
    orderType: 'PATHOLOGY',
    content: '胃生検標本（内視鏡下採取）',
    visualIndicator: {
      tubeType: 'FORMALIN_CONTAINER',
      tubeColor: '#F59E0B',
      containerType: 'specimen'
    },
    allergies: [],
    hasAllergies: false,
    location: 'OUTPATIENT',
    department: 'INTERNAL_MEDICINE',
    receivedAt: '2025/10/15 10:30',
    acceptedAt: '2025/10/15 10:45',
    acceptedBy: '看護師A',
    statusHistory: [
      { status: 'collected', timestamp: '2025/10/15 10:45', updatedBy: '看護師A' }
    ]
  },
  {
    id: 'ORD-019',
    status: 'awaiting_result',
    patientId: 'P00012360',
    patientName: '岡本 春奈',
    patientKana: 'オカモト ハルナ',
    gender: 'FEMALE',
    birthDate: '1975/02/20',
    age: 50,
    orderType: 'PATHOLOGY',
    content: '皮膚生検（左前腕）',
    visualIndicator: {
      tubeType: 'FORMALIN_CONTAINER',
      tubeColor: '#F59E0B',
      containerType: 'specimen'
    },
    allergies: [],
    hasAllergies: false,
    location: 'OUTPATIENT',
    department: 'DERMATOLOGY',
    receivedAt: '2025/10/14 14:00',
    acceptedAt: '2025/10/14 14:15',
    acceptedBy: '看護師B',
    implementedAt: '2025/10/14 14:20',
    statusHistory: [
      { status: 'collected', timestamp: '2025/10/14 14:15', updatedBy: '看護師B' },
      { status: 'awaiting_result', timestamp: '2025/10/14 14:20', updatedBy: '看護師B' }
    ]
  },
  {
    id: 'ORD-020',
    status: 'implemented',
    patientId: 'P00012361',
    patientName: '西村 誠',
    patientKana: 'ニシムラ マコト',
    gender: 'MALE',
    birthDate: '1958/12/03',
    age: 66,
    orderType: 'PATHOLOGY',
    content: '大腸ポリープ切除標本',
    visualIndicator: {
      tubeType: 'FORMALIN_CONTAINER',
      tubeColor: '#F59E0B',
      containerType: 'specimen'
    },
    allergies: [],
    hasAllergies: false,
    location: 'OUTPATIENT',
    department: 'INTERNAL_MEDICINE',
    receivedAt: '2025/10/13 09:00',
    acceptedAt: '2025/10/13 09:15',
    acceptedBy: '看護師C',
    implementedAt: '2025/10/13 09:30',
    implementedBy: '臨床検査技師B',
    implementationNotes: '標本を病理検査室へ提出。外部委託（○○病理センター）',
    statusHistory: [
      { status: 'collected', timestamp: '2025/10/13 09:15', updatedBy: '看護師C' },
      { status: 'awaiting_result', timestamp: '2025/10/13 09:20', updatedBy: '看護師C' },
      { status: 'implemented', timestamp: '2025/10/13 09:30', updatedBy: '臨床検査技師B' }
    ]
  },
  {
    id: 'ORD-021',
    status: 'collected',
    patientId: 'P00012362',
    patientName: '藤井 美和',
    patientKana: 'フジイ ミワ',
    gender: 'FEMALE',
    birthDate: '1987/05/30',
    age: 38,
    orderType: 'BACTERIA',
    content: '尿培養・感受性検査',
    visualIndicator: {
      tubeType: 'CULTURE_BOTTLE',
      tubeColor: '#10B981',
      containerType: 'culture'
    },
    allergies: [],
    hasAllergies: false,
    location: 'OUTPATIENT',
    department: 'UROLOGY',
    receivedAt: '2025/10/15 11:00',
    statusHistory: [
      { status: 'collected', timestamp: '2025/10/15 11:00', updatedBy: '鈴木医師' }
    ]
  },
  {
    id: 'ORD-022',
    status: 'collected',
    patientId: 'P00012363',
    patientName: '村田 健司',
    patientKana: 'ムラタ ケンジ',
    gender: 'MALE',
    birthDate: '1945/09/12',
    age: 80,
    orderType: 'BACTERIA',
    content: '喀痰培養・抗酸菌検査',
    visualIndicator: {
      tubeType: 'CULTURE_BOTTLE',
      tubeColor: '#10B981',
      containerType: 'culture'
    },
    allergies: [],
    hasAllergies: false,
    location: 'OUTPATIENT',
    department: 'RESPIRATORY',
    receivedAt: '2025/10/15 09:00',
    acceptedAt: '2025/10/15 09:15',
    acceptedBy: '看護師D',
    statusHistory: [
      { status: 'collected', timestamp: '2025/10/15 09:15', updatedBy: '看護師D' }
    ]
  },
  {
    id: 'ORD-023',
    status: 'awaiting_result',
    patientId: 'P00012364',
    patientName: '橋本 由紀',
    patientKana: 'ハシモト ユキ',
    gender: 'FEMALE',
    birthDate: '1992/08/25',
    age: 33,
    orderType: 'BACTERIA',
    content: '咽頭培養検査',
    visualIndicator: {
      tubeType: 'CULTURE_BOTTLE',
      tubeColor: '#10B981',
      containerType: 'culture'
    },
    allergies: [],
    hasAllergies: false,
    location: 'OUTPATIENT',
    department: 'OTOLARYNGOLOGY',
    receivedAt: '2025/10/14 15:30',
    acceptedAt: '2025/10/14 15:45',
    acceptedBy: '看護師A',
    implementedAt: '2025/10/14 16:00',
    statusHistory: [
      { status: 'collected', timestamp: '2025/10/14 15:45', updatedBy: '看護師A' },
      { status: 'awaiting_result', timestamp: '2025/10/14 16:00', updatedBy: '看護師A' }
    ]
  },
  {
    id: 'ORD-024',
    status: 'implemented',
    patientId: 'P00012365',
    patientName: '長谷川 隆',
    patientKana: 'ハセガワ タカシ',
    gender: 'MALE',
    birthDate: '1970/03/18',
    age: 55,
    orderType: 'BACTERIA',
    content: '血液培養（2セット）',
    visualIndicator: {
      tubeType: 'CULTURE_BOTTLE',
      tubeColor: '#10B981',
      containerType: 'culture'
    },
    allergies: [],
    hasAllergies: false,
    location: 'OUTPATIENT',
    department: 'INTERNAL_MEDICINE',
    receivedAt: '2025/10/13 13:00',
    acceptedAt: '2025/10/13 13:15',
    acceptedBy: '看護師B',
    implementedAt: '2025/10/13 13:30',
    implementedBy: '臨床検査技師A',
    implementationNotes: '好気・嫌気ボトルに接種。培養器セット。',
    statusHistory: [
      { status: 'collected', timestamp: '2025/10/13 13:15', updatedBy: '看護師B' },
      { status: 'awaiting_result', timestamp: '2025/10/13 13:20', updatedBy: '看護師B' },
      { status: 'implemented', timestamp: '2025/10/13 13:30', updatedBy: '臨床検査技師A' }
    ]
  },
  {
    id: 'ORD-025',
    status: 'accepted',
    patientId: 'P00012366',
    patientName: '高橋 美咲',
    patientKana: 'タカハシ ミサキ',
    gender: 'FEMALE',
    birthDate: '1985/11/08',
    age: 39,
    orderType: 'SPECIMEN_TEST',
    examinationType: 'SPECIMEN_TEST',
    content: '血液検査（一般+生化学+凝固）',
    visualIndicator: [
      {
        tubeType: 'PURPLE_CAP',
        tubeColor: '#8B5CF6'
      },
      {
        tubeType: 'YELLOW_CAP',
        tubeColor: '#EAB308'
      },
      {
        tubeType: 'LIGHT_BLUE_CAP',
        tubeColor: '#06B6D4'
      }
    ],
    allergies: [mockAllergies[1]],
    hasAllergies: true,
    location: 'OUTPATIENT',
    department: 'INTERNAL_MEDICINE',
    attendingDoctor: '佐々木医師',
    ward: '外来A',
    roomNumber: '採血室',
    receivedAt: '2025/10/15 09:30',
    acceptedAt: '2025/10/15 09:45',
    acceptedBy: '看護師C',
    scheduledTime: '10:00',
    statusHistory: [
      { status: 'received', timestamp: '2025/10/15 09:30', updatedBy: '佐々木医師' },
      { status: 'accepted', timestamp: '2025/10/15 09:45', updatedBy: '看護師C' }
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
