// TODO: 本実装時（DB永続化後）はこのファイルごと削除すること
import { axiosClient } from '@/shared/plugins/axiosClient';

export async function resetOrdersMock(): Promise<void> {
  await axiosClient.post('/dev/reset-orders');
}
