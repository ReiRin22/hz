import type { OrderResponse, SpecimenSubItemResponse } from '@/front_bff_shared/features/orders/orderConfirmed/orderConfirmation/types/responses/orderConfirmation.response';
import type { PendingOrderViewModel, ConfirmedOrderViewModel, SpecimenSubItemViewModel } from '../types/order-confirm.types';

export function mapToSpecimenSubItem(item: SpecimenSubItemResponse): SpecimenSubItemViewModel {
  return {
    id: item.id,
    testName: item.testName,
    orderCode: item.orderCode,
    specimenType: item.specimenType,
    priority: item.priority,
  };
}

export function mapToPendingOrder(order: OrderResponse): PendingOrderViewModel {
  return {
    id: order.id,
    type: order.type,
    typeName: order.name,
    detail: order.instructions ?? '',
    addedAt: order.scheduledAt ?? '',
    specimenSubItems: order.specimenSubItems?.map(mapToSpecimenSubItem),
    scheduledAt: order.scheduledAt,
  };
}

export function mapToConfirmedOrder(order: OrderResponse): ConfirmedOrderViewModel {
  return {
    id: order.id,
    type: order.type,
    typeName: order.name,
    detail: order.instructions ?? '',
    confirmedAt: order.confirmedAt ?? '',
    status: order.status ?? 'pending',
    isRevoked: order.status === 'cancelled',
    specimenSubItems: order.specimenSubItems?.map(mapToSpecimenSubItem),
    scheduledAt: order.scheduledAt,
    deptInstructionStatus: order.deptInstructionStatus,
  };
}
