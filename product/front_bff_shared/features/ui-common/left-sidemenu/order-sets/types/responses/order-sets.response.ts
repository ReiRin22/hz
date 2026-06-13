export interface SetDataResponse {
  id: string;
  name: string;
  description: string;
  items: string[];
}

export interface OrderItemResponse {
  id: string;
  name: string;
  type: string;
}

export interface GetMySetsResponse {
  mySets: SetDataResponse[];
}

export interface GetCompositeSetsResponse {
  compositeSets: SetDataResponse[];
}

export interface GetAvailableOrdersResponse {
  availableOrders: OrderItemResponse[];
}

export interface CreateMySetResponse {
  id: string;
  name: string;
  description: string;
  items: string[];
}
