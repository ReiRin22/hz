import { Injectable } from "@nestjs/common";
import type { UpstreamOrder } from "./types/orders.type";

/** モックデータ（上流オーダーシステム API 未実装のため） */
const MOCK_UPSTREAM_PENDING: UpstreamOrder[] = [
  {
    orderId: "pending-1",
    orderType: "PRESCRIPTION",
    orderName: "アセトアミノフェン錠500mg",
    dosage: "500mg",
    frequency: "1日3回 毎食後",
    duration: "7日分",
    instructions: "発熱・疼痛時に服用",
    priority: "通常",
    orderStatus: "PENDING",
  },
  {
    orderId: "pending-2",
    orderType: "LAB",
    orderName: "血算（CBC）",
    instructions: "翌朝空腹時採血",
    priority: "通常",
    scheduledAt: "2026/03/26 07:30",
    orderStatus: "PENDING",
  },
  {
    orderId: "pending-3",
    orderType: "INJECTION",
    orderName: "点滴静脈注射",
    dosage: "生理食塩水 500mL",
    frequency: "1日1回",
    duration: "3日間",
    instructions: "末梢静脈ライン確保後に実施",
    priority: "通常",
    orderStatus: "PENDING",
  },
];

const MOCK_UPSTREAM_CONFIRMED: UpstreamOrder[] = [
  {
    orderId: "confirmed-1",
    orderType: "PRESCRIPTION",
    orderName: "アムロジピン錠5mg",
    dosage: "5mg",
    frequency: "1日1回 朝食後",
    duration: "28日分",
    instructions: "血圧管理目的",
    priority: "通常",
    orderStatus: "CONFIRMED",
    confirmedAt: "2026/03/24 10:15",
    confirmedBy: "田中 医師",
  },
  {
    orderId: "confirmed-2",
    orderType: "IMAGING",
    orderName: "胸部X線検査",
    instructions: "立位正面・側面の2方向",
    priority: "通常",
    orderStatus: "CONFIRMED",
    scheduledAt: "2026/03/24 14:00",
    confirmedAt: "2026/03/24 09:30",
    confirmedBy: "田中 医師",
    implementedAt: "2026/03/24 14:10",
    implementedBy: "山田 放射線技師",
  },
  {
    orderId: "confirmed-3",
    orderType: "LAB",
    orderName: "生化学検査（肝機能・腎機能）",
    instructions: "早朝空腹時採血済み",
    priority: "通常",
    orderStatus: "CONFIRMED",
    confirmedAt: "2026/03/24 08:00",
    confirmedBy: "田中 医師",
    implementedAt: "2026/03/24 08:20",
    implementedBy: "佐藤 看護師",
  },
];

@Injectable()
export class OrdersClient {
  /**
   * 上流オーダーシステムからオーダー一覧を取得する
   * TODO: 上流 API の URL・認証ヘッダーを実装する
   */
  async fetchOrders(
    patientId: string,
    status?: "pending" | "confirmed",
  ): Promise<UpstreamOrder[]> {
    // TODO: axios.get(`${UPSTREAM_BASE_URL}/patients/${patientId}/orders`, { params: { status } }) に差し替え
    void patientId;
    if (status === "confirmed") return MOCK_UPSTREAM_CONFIRMED;
    if (status === "pending") return MOCK_UPSTREAM_PENDING;
    return [...MOCK_UPSTREAM_PENDING, ...MOCK_UPSTREAM_CONFIRMED];
  }

  /**
   * 上流オーダーシステムにオーダー確定を送信する
   * TODO: 上流 API の URL・認証ヘッダーを実装する
   */
  async confirmOrders(
    patientId: string,
    orderIds: string[],
    confirmedBy: string,
  ): Promise<UpstreamOrder[]> {
    // TODO: axios.post(...) に差し替え
    void patientId;
    const now = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
    return orderIds.map((id) => ({
      orderId: id,
      orderType: "PRESCRIPTION",
      orderName: "",
      orderStatus: "CONFIRMED",
      confirmedAt: now,
      confirmedBy,
    }));
  }

  /**
   * 上流オーダーシステムにオーダー取り消しを送信する
   */
  async cancelOrder(
    patientId: string,
    orderId: string,
    cancelledBy: string,
    _reason: string,
  ): Promise<UpstreamOrder> {
    // TODO: axios.patch(...) に差し替え
    void patientId;
    const now = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
    return {
      orderId,
      orderType: "PRESCRIPTION",
      orderName: "",
      orderStatus: "CANCELLED",
      cancelledAt: now,
      cancelledBy,
    };
  }

  /**
   * 上流オーダーシステムにオーダー更新を送信する
   */
  async updateOrder(
    patientId: string,
    orderId: string,
    _order: Record<string, unknown>,
  ): Promise<UpstreamOrder> {
    // TODO: axios.put(...) に差し替え
    void patientId;
    return { orderId, orderType: "PRESCRIPTION", orderName: "", orderStatus: "CONFIRMED" };
  }
}
