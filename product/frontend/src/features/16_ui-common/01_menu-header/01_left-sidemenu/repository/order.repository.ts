import { getOrderHistory } from '../api/getOrderHistory.api';
import { getOrderSets } from '../api/getOrderSets.api';
import { searchDrugs } from '../api/searchDrugs.api';
import { postOrderEntry, saveTemporaryOrder } from '../api/postOrder.api';
import type {
  GetOrderHistoryRequest,
  GetOrderSetsRequest,
  SearchDrugsRequest,
  PostOrderEntryRequest,
  SaveTemporaryOrderRequest,
  OrderHistoryResponse,
  OrderSetResponse,
  DrugSearchResponse,
  PostOrderEntryResponse,
  SaveTemporaryOrderResponse,
} from '@/front_bff_shared/features/orders/orderEntry/types/orderEntry.types';

/**
 * EVT_ORDER_INIT: 初期データ並列取得（履歴 + セット）
 */
export async function fetchOrderInitialData(
  params: GetOrderHistoryRequest,
  signal?: AbortSignal
): Promise<{ history: OrderHistoryResponse; sets: OrderSetResponse }> {
  const setsParams: GetOrderSetsRequest = {
    patientId: params.patientId,
    orderType: params.orderType,
  };
  const [history, sets] = await Promise.all([
    getOrderHistory(params, signal),
    getOrderSets(setsParams, signal),
  ]);
  return { history, sets };
}

/**
 * EVT_DRUG_SEARCH: 薬剤検索
 */
export async function fetchDrugSearch(
  params: SearchDrugsRequest,
  signal?: AbortSignal
): Promise<DrugSearchResponse> {
  return searchDrugs(params, signal);
}

/**
 * EVT_ORDER_CONFIRM: オーダー確定送信
 */
export async function confirmOrder(
  body: PostOrderEntryRequest
): Promise<PostOrderEntryResponse> {
  return postOrderEntry(body);
}

/**
 * EVT_ORDER_SAVE_TEMP: 一時保存
 */
export async function saveTempOrder(
  body: SaveTemporaryOrderRequest
): Promise<SaveTemporaryOrderResponse> {
  return saveTemporaryOrder(body);
}
