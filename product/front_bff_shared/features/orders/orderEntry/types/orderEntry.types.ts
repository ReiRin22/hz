import type { OrderType } from '../../_shared/types/order.type';

// --- Request types ---

export interface GetOrderHistoryRequest {
  patientId: string;
  orderType?: OrderType;
  limit?: number;
}

export interface GetOrderSetsRequest {
  patientId?: string;
  orderType?: OrderType;
}

export interface SearchDrugsRequest {
  query: string;
  orderType?: OrderType;
  limit?: number;
}

export interface PostOrderEntryRequest {
  patientId: string;
  orderType: OrderType;
  orders: OrderEntryItem[];
  confirmedBy: string;
}

export interface SaveTemporaryOrderRequest {
  patientId: string;
  name: string;
  orders: OrderEntryItem[];
  nextRpNumber: number;
}

export interface OrderEntryItem {
  itemId: string;
  name: string;
  dosage?: string;
  usage?: string;
  quantity?: string;
  frequency?: string;
  timing?: string;
  route?: string;
  period?: string;
  startDate?: string;
  notes?: string;
  rpNumber?: number;
  groupId?: string;
  groupName?: string;
  orderType: OrderType;
}

// --- Response types ---

export interface OrderHistoryResponse {
  orders: OrderHistoryItem[];
  total: number;
}

export interface OrderHistoryItem {
  id: string;
  name: string;
  orderDate: string;
  orderType: OrderType;
  items: OrderEntryItem[];
}

export interface OrderSetResponse {
  sets: OrderSetItem[];
}

export interface OrderSetItem {
  id: string;
  name: string;
  type: 'my-set' | 'composite-set';
  orderType: OrderType;
  items: string[];
}

export interface DrugSearchResponse {
  drugs: DrugItem[];
  total: number;
}

export interface DrugItem {
  id: string;
  name: string;
  code: string;
  dosage?: string;
  unit?: string;
  category?: string;
}

export interface PostOrderEntryResponse {
  success: boolean;
  orderId: string;
  confirmedAt: string;
}

export interface SaveTemporaryOrderResponse {
  success: boolean;
  saveId: string;
  savedAt: string;
}
