import { Injectable } from "@nestjs/common";
import type {
  UpstreamImagingHistoryItem,
  UpstreamImagingSet,
  UpstreamConfirmedImagingOrder,
} from "./types/imaging-orders.type";
import type { ConfirmImagingOrdersRequest } from "./types/imaging-orders.api.request";

/** モックデータ（上流画像検査 API 未実装のため） */
const MOCK_IMAGING_HISTORY: UpstreamImagingHistoryItem[] = [
  // TODO: 上流 API 実装後に差し替え
  {
    examId: "history-1",
    examDate: "2024-12-10",
    examName: "X線検査 胸部 (PA・LAT)",
    modality: "X線検査",
    bodyPart: "胸部",
    imagingContent: "胸部 立位正側",
    protocols: ["PA", "LAT"],
    position: "立位",
    laterality: "指定なし",
    functionalConditions: [],
    specialInstructions: "",
    bodyPartsList: [
      { bodyPart: "胸部", protocol: "PA", laterality: "指定なし" },
      { bodyPart: "胸部", protocol: "LAT", laterality: "指定なし" },
    ],
    priority: "normal",
    preferredTime: "morning",
    useContrast: false,
    hasContrastAllergy: false,
    clinicalPurpose: "健康診断",
    symptomTags: [],
  },
  {
    examId: "history-2",
    examDate: "2024-12-05",
    examName: "CT検査 腹部 (造影)",
    modality: "CT検査",
    bodyPart: "腹部",
    imagingContent: "腹部造影CT",
    protocols: ["Enhanced"],
    position: "臥位",
    laterality: "指定なし",
    functionalConditions: ["造影剤使用", "絶食"],
    specialInstructions: "造影剤は放射線後等",
    bodyPartsList: [
      { bodyPart: "腹部", protocol: "Enhanced", laterality: "指定なし" },
    ],
    priority: "normal",
    preferredTime: "afternoon",
    useContrast: true,
    hasContrastAllergy: false,
    clinicalPurpose: "腫瘍精査",
    symptomTags: ["腹痛"],
  },
  {
    examId: "history-3",
    examDate: "2024-11-28",
    examName: "MRI検査 頭部 (T1WI・T2WI)",
    modality: "MRI検査",
    bodyPart: "頭部",
    imagingContent: "頭部2方向",
    protocols: ["T1WI", "T2WI"],
    position: "臥位",
    laterality: "指定なし",
    functionalConditions: [],
    specialInstructions: "",
    bodyPartsList: [
      { bodyPart: "頭部", protocol: "T1WI", laterality: "指定なし" },
      { bodyPart: "頭部", protocol: "T2WI", laterality: "指定なし" },
    ],
    priority: "normal",
    preferredTime: "morning",
    useContrast: false,
    hasContrastAllergy: false,
    clinicalPurpose: "頭痛精査",
    symptomTags: ["頭痛", "めまい"],
  },
  {
    examId: "history-4",
    examDate: "2024-11-20",
    examName: "超音波検査 腹部",
    modality: "超音波検査",
    bodyPart: "腹部",
    imagingContent: "腹部超音波",
    protocols: ["Standard"],
    position: "臥位",
    laterality: "指定なし",
    functionalConditions: ["絶食"],
    specialInstructions: "",
    bodyPartsList: [
      { bodyPart: "腹部", protocol: "Standard", laterality: "指定なし" },
    ],
    priority: "normal",
    preferredTime: "morning",
    useContrast: false,
    hasContrastAllergy: false,
    clinicalPurpose: "腹部エコー",
    symptomTags: [],
  },
];

const MOCK_IMAGING_SETS: UpstreamImagingSet[] = [
  // TODO: 上流 API 実装後に差し替え
  {
    setId: "set-1",
    setName: "胸部X線セット（正面・側面）",
    setDescription: "胸部X線撮影の標準セット",
    setType: "hospital",
    examItems: [
      {
        examId: "set-1-item-1",
        examDate: "",
        examName: "X線検査 胸部 (PA・LAT)",
        modality: "X線検査",
        bodyPart: "胸部",
        imagingContent: "胸部 立位正側",
        protocols: ["PA", "LAT"],
        position: "立位",
        laterality: "指定なし",
        functionalConditions: [],
        specialInstructions: "",
        bodyPartsList: [
          { bodyPart: "胸部", protocol: "PA", laterality: "指定なし" },
          { bodyPart: "胸部", protocol: "LAT", laterality: "指定なし" },
        ],
        priority: "normal",
        preferredTime: "morning",
        useContrast: false,
        hasContrastAllergy: false,
        clinicalPurpose: "",
        symptomTags: [],
      },
    ],
  },
  {
    setId: "set-2",
    setName: "腹部精査セット",
    setDescription: "腹部の詳細検査（X線＋超音波）",
    setType: "department",
    examItems: [
      {
        examId: "set-2-item-1",
        examDate: "",
        examName: "X線検査 腹部 (AP)",
        modality: "X線検査",
        bodyPart: "腹部",
        imagingContent: "腹部 臥位正面",
        protocols: ["AP"],
        position: "臥位",
        laterality: "指定なし",
        functionalConditions: [],
        specialInstructions: "",
        bodyPartsList: [
          { bodyPart: "腹部", protocol: "AP", laterality: "指定なし" },
        ],
        priority: "normal",
        preferredTime: "morning",
        useContrast: false,
        hasContrastAllergy: false,
        clinicalPurpose: "",
        symptomTags: [],
      },
    ],
  },
  {
    setId: "set-3",
    setName: "頭部精査セット",
    setDescription: "頭部CT＋MRI検査",
    setType: "my",
    examItems: [
      {
        examId: "set-3-item-1",
        examDate: "",
        examName: "CT検査 頭部 (Plain)",
        modality: "CT検査",
        bodyPart: "頭部",
        imagingContent: "頭部CT単純",
        protocols: ["Plain"],
        position: "臥位",
        laterality: "指定なし",
        functionalConditions: [],
        specialInstructions: "",
        bodyPartsList: [
          { bodyPart: "頭部", protocol: "Plain", laterality: "指定なし" },
        ],
        priority: "normal",
        preferredTime: "morning",
        useContrast: false,
        hasContrastAllergy: false,
        clinicalPurpose: "",
        symptomTags: [],
      },
    ],
  },
];

@Injectable()
export class ImagingOrdersClient {
  /**
   * 患者の画像検査履歴一覧を取得する
   * TODO: axios.get(`${UPSTREAM_BASE_URL}/patients/${patientId}/imaging-history`) に差し替え
   */
  async fetchImagingHistory(
    // eslintDisableNextLine @typescriptEslint/noUnusedVars
    _patientId: string
  ): Promise<UpstreamImagingHistoryItem[]> {
    // TODO: 上流 API 実装後に差し替え（現状は患者 ID に関わらず共通モックを返却）
    return MOCK_IMAGING_HISTORY;
  }

  /**
   * 画像検査セット一覧をセット種別でフィルタして取得する
   * TODO: axios.get(`${UPSTREAM_BASE_URL}/imaging-sets?setType=${setType}`) に差し替え
   */
  async fetchImagingSets(
    setType: "hospital" | "department" | "my" | "regular"
  ): Promise<UpstreamImagingSet[]> {
    // TODO: 上流 API 実装後に差し替え
    return MOCK_IMAGING_SETS.filter((s) => s.setType === setType);
  }

  /**
   * 画像オーダーを一括確定する
   * TODO: axios.post(`${UPSTREAM_BASE_URL}/patients/${patientId}/imaging-orders`) に差し替え
   */
  async confirmImagingOrders(
    patientId: string,
    data: ConfirmImagingOrdersRequest
  ): Promise<UpstreamConfirmedImagingOrder[]> {
    // TODO: 上流 API 実装後に差し替え（現状はリクエスト内容をそのままレスポンスとして返却）
    const confirmedAt = new Date().toISOString();
    return data.orders.map((order, index) => ({
      orderId: `imaging-order-${patientId}-${Date.now()}-${index}`,
      orderName: order.name,
      modality: order.modality,
      orderStatus: "CONFIRMED",
      confirmedAt,
      confirmedBy: data.confirmedBy,
    }));
  }
}
