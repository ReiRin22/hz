/** 上流 API（認証基盤）から返却される生データ */
export interface UpstreamCurrentUser {
  userId: string;
  fullName: string;
  occupation: string;
  belongingDept: string;
  sessionStartedAt: string;
  hpkiExpiry?: string;
}

export interface UpstreamUserAlert {
  alertId: string;
  alertType: string;
  title: string;
  body: string;
  severity: string;
  issuedAt: string;
  acknowledged: boolean;
  targetUserId: string;
}
