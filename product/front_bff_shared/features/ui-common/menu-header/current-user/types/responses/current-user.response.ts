export type UserAlertType = 'system' | 'task' | 'notification' | 'warning';
export type UserAlertPriority = 'low' | 'medium' | 'high' | 'critical';

export interface UserAlertResponse {
  id: string;
  type: UserAlertType;
  title: string;
  message: string;
  priority: UserAlertPriority;
  timestamp: string;
  dismissed: boolean;
  userId: string;
}

export interface CurrentUserResponse {
  id: string;
  name: string;
  role: string;
  department: string;
  loginTime: string;
}

/** GET /api/currentUser のレスポンス型 */
export interface GetCurrentUserResponse {
  currentUser: CurrentUserResponse;
  userAlerts: UserAlertResponse[];
  proxyApprovalCount: number;
  hpkiRemainingTime: string;
}
