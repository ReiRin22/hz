import { Injectable } from "@nestjs/common";
import type { UpstreamMySet, UpstreamCompositeSet, UpstreamOrderItem } from "./types/order-sets.type";
import type { CreateMySetRequest } from "./types/order-sets.api.request";

/** モックデータ（上流オーダーセット API 未実装のため） */
const MOCK_MY_SETS: UpstreamMySet[] = [
  {
    setId: "myset-1",
    setName: "糖尿病セット",
    setDescription: "HbA1c、血糖値、尿検査",
    orderItems: ["HbA1c", "血糖値", "尿糖", "尿蛋白"],
  },
  {
    setId: "myset-2",
    setName: "高血圧セット",
    setDescription: "腎機能、電解質、尿検査",
    orderItems: ["クレアチニン", "eGFR", "Na", "K", "Cl", "尿蛋白"],
  },
  {
    setId: "myset-3",
    setName: "肝機能セット",
    setDescription: "肝機能基本検査",
    orderItems: ["AST", "ALT", "γ-GTP", "ALP", "T-Bil"],
  },
  {
    setId: "myset-4",
    setName: "脂質異常症セット",
    setDescription: "脂質関連検査",
    orderItems: ["TC", "TG", "HDL-C", "LDL-C"],
  },
];

const MOCK_COMPOSITE_SETS: UpstreamCompositeSet[] = [
  // 処方オーダー
  {
    setId: "preset-1",
    setName: "糖尿病治療セット",
    setDescription: "糖尿病の標準的な治療薬セット",
    orderType: "prescription",
    orderItems: ["メトホルミン 500mg", "グリメピリド 1mg"],
  },
  {
    setId: "preset-2",
    setName: "高血圧治療セット",
    setDescription: "高血圧の標準的な治療薬セット",
    orderType: "prescription",
    orderItems: ["アムロジピン 5mg", "カンデサルタン 8mg"],
  },
  {
    setId: "preset-3",
    setName: "脂質異常症セット",
    setDescription: "脂質異常症の標準的な治療薬セット",
    orderType: "prescription",
    orderItems: ["アトルバスタチン 10mg", "エゼチミブ 10mg"],
  },
  {
    setId: "preset-4",
    setName: "感冒セット",
    setDescription: "感冒症状の標準的な治療薬セット",
    orderType: "prescription",
    orderItems: ["カロナール 200mg", "PL配合顆粒", "ムコダイン 250mg"],
  },
  // 注射オーダー
  {
    setId: "injset-1",
    setName: "輸液基本セット",
    setDescription: "標準的な輸液セット",
    orderType: "injection",
    orderItems: ["生理食塩水 500ml"],
  },
  {
    setId: "injset-2",
    setName: "電解質補正セット",
    setDescription: "電解質補正用の輸液セット",
    orderType: "injection",
    orderItems: ["ソリタT3号 500ml", "KCL 20mEq"],
  },
  {
    setId: "injset-3",
    setName: "ビタミン補充セット",
    setDescription: "ビタミン補充用セット",
    orderType: "injection",
    orderItems: ["ビタミンB1 100mg", "ビタミンC 500mg"],
  },
  {
    setId: "injset-4",
    setName: "抗菌薬投与セット",
    setDescription: "抗菌薬投与用セット",
    orderType: "injection",
    orderItems: ["生理食塩水 500ml", "セフトリアキソン 1g"],
  },
  // 検体オーダー
  {
    setId: "labset-1",
    setName: "糖尿病セット",
    setDescription: "HbA1c、血糖値、尿検査",
    orderType: "lab",
    orderItems: ["HbA1c", "血糖値", "尿糖", "尿蛋白"],
  },
  {
    setId: "labset-2",
    setName: "高血圧セット",
    setDescription: "腎機能、電解質、尿検査",
    orderType: "lab",
    orderItems: ["クレアチニン", "eGFR", "Na", "K", "Cl", "尿蛋白"],
  },
  {
    setId: "labset-3",
    setName: "肝機能セット",
    setDescription: "肝機能基本検査",
    orderType: "lab",
    orderItems: ["AST", "ALT", "γ-GTP", "ALP", "T-Bil"],
  },
  {
    setId: "labset-4",
    setName: "脂質異常症セット",
    setDescription: "脂質関連検査",
    orderType: "lab",
    orderItems: ["TC", "TG", "HDL-C", "LDL-C"],
  },
];

const MOCK_AVAILABLE_ORDERS: UpstreamOrderItem[] = [
  { orderId: "order-1", orderName: "アムロジピン錠5mg「サワイ」1錠", orderType: "処方" },
  { orderId: "order-2", orderName: "血算（CBC）", orderType: "検体" },
  { orderId: "order-3", orderName: "インスリン注射", orderType: "注射" },
  { orderId: "order-4", orderName: "胸部X線", orderType: "画像" },
  { orderId: "order-5", orderName: "創傷処置（清拭・ガーゼ交換）", orderType: "処置" },
  { orderId: "order-6", orderName: "心電図検査", orderType: "生理" },
  { orderId: "order-7", orderName: "理学療法（PT）", orderType: "リハビリ" },
  { orderId: "order-8", orderName: "食事指導（糖尿病）", orderType: "指導" },
  { orderId: "order-9", orderName: "HbA1c", orderType: "検体" },
];

@Injectable()
export class OrderSetsClient {
  /**
   * ログインユーザーの Myセット一覧を取得する
   * TODO: 上流 API の URL・認証ヘッダーを実装する
   */
  async fetchMySets(): Promise<UpstreamMySet[]> {
    // TODO: axios.get(`${UPSTREAM_BASE_URL}/order-sets/my-sets`) に差し替え
    return MOCK_MY_SETS;
  }

  /**
   * 複合セット一覧をオーダー種別でフィルタして取得する
   * TODO: 上流 API の URL・認証ヘッダーを実装する
   */
  async fetchCompositeSets(
    orderType: "prescription" | "injection" | "lab"
  ): Promise<UpstreamCompositeSet[]> {
    // TODO: axios.get(`${UPSTREAM_BASE_URL}/order-sets/composite-sets?orderType=${orderType}`) に差し替え
    return MOCK_COMPOSITE_SETS.filter((s) => s.orderType === orderType);
  }

  /**
   * Myセット作成用オーダー候補一覧を取得する
   * TODO: 上流 API の URL・認証ヘッダーを実装する
   */
  async fetchAvailableOrders(): Promise<UpstreamOrderItem[]> {
    // TODO: axios.get(`${UPSTREAM_BASE_URL}/orders/available`) に差し替え
    return MOCK_AVAILABLE_ORDERS;
  }

  /**
   * Myセットを新規作成する
   * TODO: 上流 API の URL・認証ヘッダーを実装する
   */
  async saveMySet(data: CreateMySetRequest): Promise<UpstreamMySet> {
    // TODO: axios.post(`${UPSTREAM_BASE_URL}/order-sets/my-sets`, data) に差し替え
    const newSet: UpstreamMySet = {
      setId: `myset-${Date.now()}`,
      setName: data.name,
      setDescription: data.description ?? "",
      orderItems: data.items,
    };
    // TODO: 上流 API 実装後に永続化処理に差し替える（現状はレスポンスのみ返却・状態は保持しない）
    return newSet;
  }
}
