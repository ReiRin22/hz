import { axiosClient } from '@/shared/plugins/axiosClient';

export async function deleteOrder(orderId: string): Promise<void> {
  await axiosClient.delete(`/orders/${orderId}`);
}
