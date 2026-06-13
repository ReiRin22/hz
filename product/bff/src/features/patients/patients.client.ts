import { Injectable } from "@nestjs/common";
import type { UpstreamPatient, UpstreamPatientInfo } from "./types/patients.type";

/** モックデータ（上流患者マスタ API 未実装のため） */
const MOCK_UPSTREAM_PATIENT_P0078901: UpstreamPatient = {
  patientId: 'P0078901',
  patientName: '山田 太郎',
  allergyList: [
    { code: 'A010', name: 'スギ花粉' },
    { code: 'A011', name: 'ヒノキ花粉' },
  ],
  birthDate: '1990-11-05',
  renalFunction: { ccrValue: 98 },
  conditions: {
    pregnancyFlag: false,
    renalImpairmentFlag: false,
    hepaticImpairmentFlag: false,
  },
};

// TODO: 上流 API（患者記録情報）実装後に削除する
const MOCK_UPSTREAM_PATIENT_INFO_P0078901: UpstreamPatientInfo = {
  basicInfo: {
    patientId: 'P0078901',
    name: '山田 太郎',
    nameKana: 'ヤマダ タロウ',
    birthDate: '1990-11-05',
    gender: 'male',
    bloodType: 'B',
    insuranceNumber: '9876543210',
    address: '東京都渋谷区恵比寿1-2-3',
    phone: '03-9876-5432',
    emergencyContact: '山田 花子',
    emergencyPhone: '090-9876-5432',
    occupation: '会社員',
    nationality: '日本',
    religion: '',
    primaryDiagnosis: '花粉症',
    admissionDate: '',
    ward: '',
    room: '',
  },
  allergyHistory: { allergies: [], medicalHistories: [], surgeries: [] },
  vaccinations: [],
  familyInfo: {
    familyMembers: [],
    guarantor: { name: '', relationship: '', birthDate: '', phone: '', address: '', occupation: '' },
  },
  infections: [],
  implantDevices: { pacemakers: [], aneurysmClips: [], metalImplants: [] },
  lifestyle: {
    smokingStatus: 'never',
    smokingDetail: '',
    alcoholStatus: 'occasional',
    alcoholDetail: '',
    exerciseHabit: '',
    sleepHours: '',
    dietRestriction: '',
    memo: '',
    meta: { createdBy: '', createdAt: '', updatedBy: '', updatedAt: '' },
  },
  medicalMemos: [],
  philosophies: [],
  accessControl: {
    vipSetting: {
      isVip: false,
      restrictionLevel: 'none',
      memo: '',
      meta: { createdBy: '', createdAt: '', updatedBy: '', updatedAt: '' },
    },
    userAccesses: [],
  },
};

const MOCK_UPSTREAM_PATIENT: UpstreamPatient = {
  patientId: "P001",
  patientName: "山田 太郎",
  allergyList: [
    { code: "A001", name: "ペニシリン系" },
    { code: "A002", name: "セフェム系" },
    { code: "A003", name: "NSAIDs" },
  ],
  birthDate: "1955-04-01",
  renalFunction: { ccrValue: 45 },
  conditions: {
    pregnancyFlag: false,
    renalImpairmentFlag: true,
    hepaticImpairmentFlag: false,
  },
};

// TODO: 上流 API（患者記録情報）実装後に削除する
const MOCK_UPSTREAM_PATIENT_INFO: UpstreamPatientInfo = {
  basicInfo: {
    patientId: 'P001',
    name: '山田 太郎',
    nameKana: 'ヤマダ タロウ',
    birthDate: '1950-05-15',
    gender: 'male',
    bloodType: 'A',
    insuranceNumber: '1234567890',
    address: '東京都新宿区西新宿1-1-1',
    phone: '03-1234-5678',
    emergencyContact: '山田 花子',
    emergencyPhone: '090-1234-5678',
    occupation: '無職（元会社員）',
    nationality: '日本',
    religion: '',
    primaryDiagnosis: '慢性心不全',
    admissionDate: '2025-01-10',
    ward: '第2病棟',
    room: '201号室',
  },
  allergyHistory: {
    allergies: [
      {
        id: 'al-001',
        allergen: 'ペニシリン系抗菌薬',
        reaction: '蕁麻疹・発疹',
        severity: 'moderate',
        confirmedDate: '2010-03-20',
        meta: { createdBy: '鈴木 医師', createdAt: '2025-01-10T10:00:00', updatedBy: '鈴木 医師', updatedAt: '2025-01-10T10:00:00' },
      },
      {
        id: 'al-002',
        allergen: 'そば',
        reaction: 'アナフィラキシー',
        severity: 'severe',
        confirmedDate: '2015-07-01',
        meta: { createdBy: '田中 看護師', createdAt: '2025-01-11T09:30:00', updatedBy: '田中 看護師', updatedAt: '2025-01-11T09:30:00' },
      },
    ],
    medicalHistories: [
      {
        id: 'mh-001',
        disease: '高血圧症',
        diagnosisDate: '2000-04-15',
        hospital: '新宿総合病院',
        memo: '降圧薬内服中',
        meta: { createdBy: '鈴木 医師', createdAt: '2025-01-10T10:05:00', updatedBy: '鈴木 医師', updatedAt: '2025-01-10T10:05:00' },
      },
      {
        id: 'mh-002',
        disease: '2型糖尿病',
        diagnosisDate: '2005-08-20',
        hospital: '新宿総合病院',
        memo: 'HbA1c管理中',
        meta: { createdBy: '鈴木 医師', createdAt: '2025-01-10T10:10:00', updatedBy: '鈴木 医師', updatedAt: '2025-01-10T10:10:00' },
      },
    ],
    surgeries: [
      {
        id: 'su-001',
        surgeryName: '虫垂切除術',
        surgeryDate: '1985-06-10',
        hospital: '東京大学附属病院',
        memo: '合併症なし',
        meta: { createdBy: '鈴木 医師', createdAt: '2025-01-10T10:15:00', updatedBy: '鈴木 医師', updatedAt: '2025-01-10T10:15:00' },
      },
    ],
  },
  vaccinations: [
    {
      id: 'va-001',
      vaccineName: 'インフルエンザワクチン',
      vaccinationDate: '2024-11-01',
      lotNumber: 'FL2024-001',
      administrator: '田中 看護師',
      memo: '左上腕に接種',
      meta: { createdBy: '田中 看護師', createdAt: '2024-11-01T14:00:00', updatedBy: '田中 看護師', updatedAt: '2024-11-01T14:00:00' },
    },
    {
      id: 'va-002',
      vaccineName: '新型コロナウイルスワクチン（4回目）',
      vaccinationDate: '2024-05-15',
      lotNumber: 'CV2024-005',
      administrator: '田中 看護師',
      memo: '',
      meta: { createdBy: '田中 看護師', createdAt: '2024-05-15T10:30:00', updatedBy: '田中 看護師', updatedAt: '2024-05-15T10:30:00' },
    },
  ],
  familyInfo: {
    familyMembers: [
      {
        id: 'fm-001',
        name: '山田 花子',
        relationship: '配偶者',
        birthDate: '1952-08-20',
        phone: '090-1234-5678',
        address: '東京都新宿区西新宿1-1-1',
        isEmergencyContact: true,
        meta: { createdBy: '田中 看護師', createdAt: '2025-01-10T11:00:00', updatedBy: '田中 看護師', updatedAt: '2025-01-10T11:00:00' },
      },
      {
        id: 'fm-002',
        name: '山田 一郎',
        relationship: '長男',
        birthDate: '1978-03-10',
        phone: '080-9876-5432',
        address: '東京都渋谷区道玄坂2-2-2',
        isEmergencyContact: false,
        meta: { createdBy: '田中 看護師', createdAt: '2025-01-10T11:05:00', updatedBy: '田中 看護師', updatedAt: '2025-01-10T11:05:00' },
      },
    ],
    guarantor: {
      name: '山田 花子',
      relationship: '配偶者',
      birthDate: '1952-08-20',
      phone: '090-1234-5678',
      address: '東京都新宿区西新宿1-1-1',
      occupation: '無職',
    },
  },
  infections: [
    {
      id: 'in-001',
      infectionName: 'B型肝炎（HBs抗原）',
      testDate: '2025-01-10',
      result: 'negative',
      memo: '',
      meta: { createdBy: '鈴木 医師', createdAt: '2025-01-10T12:00:00', updatedBy: '鈴木 医師', updatedAt: '2025-01-10T12:00:00' },
    },
    {
      id: 'in-002',
      infectionName: 'C型肝炎（HCV抗体）',
      testDate: '2025-01-10',
      result: 'negative',
      memo: '',
      meta: { createdBy: '鈴木 医師', createdAt: '2025-01-10T12:05:00', updatedBy: '鈴木 医師', updatedAt: '2025-01-10T12:05:00' },
    },
  ],
  implantDevices: {
    pacemakers: [],
    aneurysmClips: [],
    metalImplants: [
      {
        id: 'mi-001',
        partName: '右膝関節',
        materialName: '人工関節（チタン合金）',
        implantDate: '2018-09-15',
        memo: 'MRI検査時は要確認',
        meta: { createdBy: '鈴木 医師', createdAt: '2025-01-10T13:00:00', updatedBy: '鈴木 医師', updatedAt: '2025-01-10T13:00:00' },
      },
    ],
  },
  lifestyle: {
    smokingStatus: 'former',
    smokingDetail: '40本/日 × 30年、2010年禁煙',
    alcoholStatus: 'occasional',
    alcoholDetail: '週1〜2回、ビール350ml程度',
    exerciseHabit: '週2回ウォーキング（30分）',
    sleepHours: '6〜7時間',
    dietRestriction: '塩分制限（6g/日未満）',
    memo: '',
    meta: { createdBy: '田中 看護師', createdAt: '2025-01-10T13:30:00', updatedBy: '田中 看護師', updatedAt: '2025-01-10T13:30:00' },
  },
  medicalMemos: [
    {
      id: 'mm-001',
      category: '注意事項',
      content: 'ペニシリン系アレルギーあり。処方時は必ず確認すること。',
      isImportant: true,
      meta: { createdBy: '鈴木 医師', createdAt: '2025-01-10T14:00:00', updatedBy: '鈴木 医師', updatedAt: '2025-01-10T14:00:00' },
    },
    {
      id: 'mm-002',
      category: 'コミュニケーション',
      content: '難聴あり。大きな声でゆっくり話す。補聴器使用中。',
      isImportant: false,
      meta: { createdBy: '田中 看護師', createdAt: '2025-01-11T09:00:00', updatedBy: '田中 看護師', updatedAt: '2025-01-11T09:00:00' },
    },
  ],
  philosophies: [
    {
      id: 'ph-001',
      endOfLifeWish: '苦痛なく穏やかに逝きたい。延命処置は望まない。',
      resuscitationWish: 'doNot',
      artificialNutritionWish: 'doNot',
      mechanicalVentilationWish: 'doNot',
      decisionMaker: '山田 花子（配偶者）',
      decisionMakerPhone: '090-1234-5678',
      memo: '2025年1月に本人・家族と話し合い済み',
      isLatest: true,
      meta: { createdBy: '鈴木 医師', createdAt: '2025-01-15T15:00:00', updatedBy: '鈴木 医師', updatedAt: '2025-01-15T15:00:00' },
    },
  ],
  accessControl: {
    vipSetting: {
      isVip: false,
      restrictionLevel: 'none',
      memo: '',
      meta: { createdBy: 'admin', createdAt: '2025-01-10T08:00:00', updatedBy: 'admin', updatedAt: '2025-01-10T08:00:00' },
    },
    userAccesses: [
      { id: 'ua-001', userId: 'U001', userName: '鈴木 医師', role: 'doctor', canView: true, canEdit: true, grantedBy: 'admin', grantedAt: '2025-01-10T08:00:00' },
      { id: 'ua-002', userId: 'U002', userName: '田中 看護師', role: 'nurse', canView: true, canEdit: true, grantedBy: 'admin', grantedAt: '2025-01-10T08:00:00' },
    ],
  },
};

@Injectable()
export class PatientsClient {
  /**
   * 上流患者マスタ API から患者情報を取得する
   * TODO: 上流 API の URL・認証ヘッダーを実装する
   */
  async fetchPatient(patientId: string): Promise<UpstreamPatient> {
    // TODO: axios.get(`${UPSTREAM_BASE_URL}/patients/${patientId}`) に差し替え
    if (patientId === 'P0078901') return MOCK_UPSTREAM_PATIENT_P0078901;
    return MOCK_UPSTREAM_PATIENT;
  }

  /**
   * 上流システムから患者記録情報を取得する
   * TODO: 上流 API の URL・認証ヘッダーを実装する
   */
  async fetchPatientInfo(patientId: string): Promise<UpstreamPatientInfo> {
    // TODO: axios.get(`${UPSTREAM_BASE_URL}/patients/${patientId}/patient-info`) に差し替え
    if (patientId === 'P0078901') return MOCK_UPSTREAM_PATIENT_INFO_P0078901;
    return MOCK_UPSTREAM_PATIENT_INFO;
  }
}
