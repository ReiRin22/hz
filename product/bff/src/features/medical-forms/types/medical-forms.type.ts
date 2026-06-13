import type { OrderType } from "../../../front_bff_shared/features/orders/_shared/types/order.type";
import type { MedicalFormType } from "../../../front_bff_shared/features/orders/orderConfirmed/orderConfirmation/types/responses/orderConfirmation.response";

/** オーダー種別から帳票種別へのマッピング */
export function mapOrderTypeToFormType(orderType: OrderType): MedicalFormType {
  const formTypeMap: Partial<Record<OrderType, MedicalFormType>> = {
    prescription: "PRESCRIPTION",
    lab: "LAB_REQUEST",
    pathology: "LAB_REQUEST",
    microbiology: "LAB_REQUEST",
    imaging: "IMAGING_REQUEST",
    endoscopy: "IMAGING_REQUEST",
    procedure: "PROCEDURE_CONSENT",
    surgery: "PROCEDURE_CONSENT",
    injection: "NURSING_INSTRUCTION",
    transfusion: "NURSING_INSTRUCTION",
  };
  return formTypeMap[orderType] ?? "NURSING_INSTRUCTION";
}

export function mapOrderTypeToFormName(orderType: OrderType): string {
  const formNameMap: Partial<Record<OrderType, string>> = {
    prescription: "処方箋",
    lab: "検査依頼書",
    pathology: "検査依頼書",
    microbiology: "検査依頼書",
    imaging: "画像検査依頼書",
    endoscopy: "画像検査依頼書",
    procedure: "処置同意書",
    surgery: "処置同意書",
    injection: "看護指示書",
    transfusion: "看護指示書",
  };
  return formNameMap[orderType] ?? "看護指示書";
}
