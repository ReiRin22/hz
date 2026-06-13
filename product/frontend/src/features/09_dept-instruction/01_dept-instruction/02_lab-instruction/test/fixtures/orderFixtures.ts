import type { Order, Allergy } from '../../types/deptInstruction.viewmodel';

const mockAllergies: Allergy[] = [
  {
    id: 'a1',
    component: 'ペニシリン系抗生物質',
    category: 'MEDICATION',
    severity: 'SEVERE',
    symptoms: '呼吸困難、発疹',
    registeredDate: '2024/03/15',
    source: '本人申告',
  },
];

export const specimenOrder: Order = {
  id: 'ORD-001',
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
  visualIndicator: { tubeType: 'PURPLE_CAP', tubeColor: '#8B5CF6' },
  allergies: [],
  hasAllergies: false,
  location: 'OUTPATIENT',
  department: 'INTERNAL_MEDICINE',
  attendingDoctor: '田中医師',
  ward: '外来A',
  roomNumber: '採血室',
  labTestLocation: '院内検査',
  receivedAt: '2025/10/15 08:45',
  acceptedAt: '2025/10/15 09:30',
  acceptedBy: '看護師A',
  scheduledTime: '09:00',
  statusHistory: [
    { status: 'received', timestamp: '2025/10/15 08:45', updatedBy: '田中医師' },
    { status: 'accepted', timestamp: '2025/10/15 09:30', updatedBy: '看護師A' },
  ],
};

export const allergyOrder: Order = {
  ...specimenOrder,
  id: 'ORD-002',
  status: 'implemented',
  allergies: mockAllergies,
  hasAllergies: true,
  patientName: '山田 太郎',
  patientKana: 'ヤマダ タロウ',
  gender: 'MALE',
  orderType: 'SPECIMEN_TEST',
  content: '血液検査（肝機能）',
  visualIndicator: { tubeType: 'YELLOW_CAP', tubeColor: '#EAB308' },
  implementedAt: '2025/10/15 10:30',
  implementedBy: '臨床検査技師A',
  implementationNotes: '採血実施。検体検査室へ提出済み。',
  statusHistory: [
    { status: 'received', timestamp: '2025/10/15 08:45', updatedBy: '田中医師' },
    { status: 'accepted', timestamp: '2025/10/15 09:30', updatedBy: '看護師A' },
    { status: 'implemented', timestamp: '2025/10/15 10:30', updatedBy: '臨床検査技師A' },
  ],
};

export const physiologyOrder: Order = {
  id: 'ORD-003',
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
  visualIndicator: { physiologicalTestType: 'ECG' },
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
    { status: 'started', timestamp: '2025/10/15 11:00', updatedBy: '看護師B' },
  ],
};

/** ステータス更新エラーシナリオで「採取」ボタンを持つ started 検体検査オーダー */
export const startedSpecimenOrder: Order = {
  ...specimenOrder,
  id: 'ORD-004',
  status: 'started',
  patientId: 'P00012360',
  patientName: '山田 太郎',
  patientKana: 'ヤマダ タロウ',
  gender: 'MALE',
  content: '尿検査',
  visualIndicator: { tubeType: 'YELLOW_CAP', tubeColor: '#EAB308' },
  allergies: [],
  hasAllergies: false,
  receivedAt: '2025/10/15 09:00',
  acceptedAt: '2025/10/15 09:15',
  acceptedBy: '看護師A',
  scheduledTime: '09:30',
  implementedAt: undefined,
  implementedBy: undefined,
  implementationNotes: undefined,
  statusHistory: [
    { status: 'accepted', timestamp: '2025/10/15 09:00', updatedBy: '看護師A' },
    { status: 'started', timestamp: '2025/10/15 09:15', updatedBy: '看護師A' },
  ],
};

export const mockOrders: Order[] = [specimenOrder, allergyOrder, physiologyOrder];

/** ステータス更新エラー story 用：started 検体検査オーダーを含む拡張リスト */
export const mockOrdersWithStartedSpecimen: Order[] = [
  ...mockOrders,
  startedSpecimenOrder,
];
