import type { OrderResponse } from "@/front_bff_shared/features/orders/orderConfirmed/orderConfirmation/types/responses/orderConfirmation.response";

/**
 * 未確定オーダーのモックデータ
 */
export const MOCK_PENDING_ORDERS: OrderResponse[] = [
  {
    id: "pending-1",
    type: "prescription",
    name: "アセトアミノフェン錠500mg",
    dosage: "500mg",
    frequency: "1日3回 毎食後",
    duration: "7日分",
    instructions: "発熱・疼痛時に服用",
    priority: "通常",
  },
  {
    id: "pending-2",
    type: "lab",
    name: "血算（CBC）",
    instructions: "翌朝空腹時採血",
    priority: "通常",
    scheduledAt: "2026/03/26 07:30",
  },
  {
    id: "pending-3",
    type: "injection",
    name: "点滴静脈注射",
    dosage: "生理食塩水 500mL",
    frequency: "1日1回",
    duration: "3日間",
    instructions: "末梢静脈ライン確保後に実施",
    priority: "通常",
  },
];

/**
 * 確定済みオーダーのモックデータ
 */
export const MOCK_CONFIRMED_ORDERS: OrderResponse[] = [
  {
    id: "confirmed-1",
    type: "prescription",
    name: "アムロジピン錠5mg",
    dosage: "5mg",
    frequency: "1日1回 朝食後",
    duration: "28日分",
    instructions: "血圧管理目的",
    priority: "通常",
    status: "confirmed",
    confirmedAt: "2026/03/24 10:15",
    confirmedBy: "田中 医師",
  },
  {
    id: "confirmed-2",
    type: "imaging",
    name: "胸部X線検査",
    instructions: "立位正面・側面の2方向",
    priority: "通常",
    status: "confirmed",
    scheduledAt: "2026/03/24 14:00",
    confirmedAt: "2026/03/24 09:30",
    confirmedBy: "田中 医師",
    implementedAt: "2026/03/24 14:10",
    implementedBy: "山田 放射線技師",
  },
  {
    id: "confirmed-3",
    type: "lab",
    name: "生化学検査（肝機能・腎機能）",
    instructions: "早朝空腹時採血済み",
    priority: "通常",
    status: "confirmed",
    confirmedAt: "2026/03/24 08:00",
    confirmedBy: "田中 医師",
    implementedAt: "2026/03/24 08:20",
    implementedBy: "佐藤 看護師",
  },
];
