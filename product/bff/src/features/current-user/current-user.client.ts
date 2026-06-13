import { Injectable } from "@nestjs/common";
import type { UpstreamCurrentUser, UpstreamUserAlert } from "./types/current-user.type";

export type { UpstreamCurrentUser, UpstreamUserAlert };

// TODO: 将来的に BFF API から取得する（現在はモックデータ）
const MOCK_CURRENT_USER: UpstreamCurrentUser = {
  userId: "U001",
  fullName: "田中 太郎",
  occupation: "医師",
  belongingDept: "内科",
  sessionStartedAt: "09:00",
};

// TODO: 将来的に BFF API から取得する（現在はモックデータ）
const MOCK_USER_ALERTS: UpstreamUserAlert[] = [];

// TODO: 将来的に BFF API から取得する（現在はモックデータ）
const MOCK_PROXY_APPROVAL_COUNT = 0;

// TODO: 将来的に HPKI カード API から取得する（現在はモックデータ）
const MOCK_HPKI_REMAINING_TIME = "HPKI残り 2時間15分";

@Injectable()
export class CurrentUserClient {
  /**
   * ログインユーザー情報・アラート・代行承認数・HPKI残り時間を一括取得する
   * TODO: 上流 API（認証基盤）への接続を実装する
   */
  async fetchCurrentUserData(): Promise<{
    currentUser: UpstreamCurrentUser;
    userAlerts: UpstreamUserAlert[];
    proxyApprovalCount: number;
    hpkiRemainingTime: string;
  }> {
    return {
      currentUser: MOCK_CURRENT_USER,
      userAlerts: MOCK_USER_ALERTS,
      proxyApprovalCount: MOCK_PROXY_APPROVAL_COUNT,
      hpkiRemainingTime: MOCK_HPKI_REMAINING_TIME,
    };
  }
}
