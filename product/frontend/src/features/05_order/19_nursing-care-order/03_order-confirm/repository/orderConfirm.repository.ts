import { getOrders } from '../api/getOrders.api';
import { getForms } from '../api/getForms.api';
import { getOrderTypes } from '../api/getOrderTypes.api';
import type { GetOrdersResponse } from '@/front_bff_shared/features/orders/orderConfirmed/orderConfirmation/types/responses/orderConfirmation.response';
import type { GetMedicalFormsResponse } from '@/front_bff_shared/features/orders/orderConfirmed/orderConfirmation/types/responses/orderConfirmation.response';
import type { GetOrderTypesResponse } from '@/front_bff_shared/features/orders/orderConfirmed/orderConfirmation/types/responses/orderConfirmation.response';

export interface OrderConfirmInitData {
  orders: GetOrdersResponse;
  forms: GetMedicalFormsResponse;
  orderTypes: GetOrderTypesResponse;
}

export async function initializeOrderConfirm(params: {
  patientId: string;
  skipReset?: boolean;
}): Promise<OrderConfirmInitData> {
  const [orders, forms, orderTypes] = await Promise.all([
    getOrders({ patientId: params.patientId }),
    getForms({ patientId: params.patientId }),
    getOrderTypes(),
  ]);

  return { orders, forms, orderTypes };
}
