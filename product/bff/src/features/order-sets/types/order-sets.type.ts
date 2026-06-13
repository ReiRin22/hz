export interface UpstreamMySet {
  setId: string;
  setName: string;
  setDescription: string;
  orderItems: string[];
}

export interface UpstreamCompositeSet {
  setId: string;
  setName: string;
  setDescription: string;
  orderType: "prescription" | "injection" | "lab";
  orderItems: string[];
}

export interface UpstreamOrderItem {
  orderId: string;
  orderName: string;
  orderType: string;
}
