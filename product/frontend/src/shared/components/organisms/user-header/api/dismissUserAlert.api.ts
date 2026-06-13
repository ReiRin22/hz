import { axiosClient } from '@/shared/plugins/axiosClient';

export async function dismissUserAlert(alertId: string): Promise<void> {
  await axiosClient.patch(`/user-alerts/${alertId}/dismiss`);
}
