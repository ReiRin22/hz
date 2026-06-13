import type { GetCurrentUserResponse } from "@/shared/types/current-user.response";

/**
 * ログインユーザー情報のモックデータ
 * BFFの current-user.client.ts と同じデータ
 */
export const MOCK_CURRENT_USER_DATA: GetCurrentUserResponse = {
  currentUser: {
    id: "U001",
    name: "田中 太郎",
    role: "医師",
    department: "内科",
    loginTime: "09:00",
  },
  userAlerts: [],
  proxyApprovalCount: 0,
  hpkiRemainingTime: "HPKI残り 2時間15分",
};
