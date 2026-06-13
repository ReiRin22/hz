import { getCurrentUser } from '../api/getCurrentUser.api';
import { dismissUserAlert } from '../api/dismissUserAlert.api';
import type { GetCurrentUserResponse } from '@/../front_bff_shared/features/current-user/types/response/current-user.api.response';

/**
 * EVT_INIT01: 初期表示 - ログインユーザー情報・アラート取得
 */
export async function fetchGlobalHeaderData(): Promise<GetCurrentUserResponse> {
  return getCurrentUser();
}

/**
 * EVT_SUB01: アラート非表示
 */
export async function dismissAlert(alertId: string): Promise<void> {
  return dismissUserAlert(alertId);
}
