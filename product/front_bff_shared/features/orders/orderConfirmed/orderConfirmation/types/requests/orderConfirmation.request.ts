export interface GetOrdersRequest {
  patientId: string;
  status?: "pending" | "confirmed";
}

export interface ConfirmOrdersRequest {
  patientId: string;
  orderIds: string[];
  confirmedBy: string;
}

export interface CancelOrderRequest {
  reason: string;
  cancelledBy: string;
}

export interface UpdateOrderRequest {
  order: Partial<Record<string, unknown>>;
  editReason: string;
  editedBy: string;
}

export interface GetMedicalFormsRequest {
  patientId: string;
  orderIds?: string[];
}

export interface OutputMedicalFormsRequest {
  patientId: string;
  formIds: string[];
}

export interface RevokeOrderRequest {
  reason: string;
  revokedBy: string;
}

export interface GetOrderTypesRequest {
  patientId: string;
}
