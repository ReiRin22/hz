namespace KarteDomainService.Features.OrderConfirmation.Models;

// ----- 共通 -----

public record SpecimenSubItemData(
    string Id,
    string TestName,
    string OrderCode,
    string SpecimenType,
    string? Priority
);

public record OrderItem(
    string OrderId,
    string OrderType,
    string OrderName,
    string? Dosage,
    string? Frequency,
    string? Duration,
    string? Instructions,
    string? Priority,
    string? Amount,
    string? ScheduledAt,
    string? ConfirmedAt,
    string? ConfirmedBy,
    string? ImplementedAt,
    string? ImplementedBy,
    string? CancelledAt,
    string? CancelledBy,
    string OrderStatus,
    List<SpecimenSubItemData>? SpecimenSubItems = null,
    string? DeptInstructionStatus = null
);

// ----- POST /api/v1/orders/list -----

public record GetOrdersRequest(
    string PatientId,
    string? Status
);

public record GetOrdersResponse(
    List<OrderItem> Orders
);

// ----- POST /api/v1/patients/{patientId}/orders/confirm -----

public record ConfirmOrdersRequest(
    List<string> OrderIds,
    string ConfirmedBy
);

public record ConfirmOrdersResponse(
    List<OrderItem> ConfirmedOrders
);

// ----- DELETE /api/v1/orders/{orderId} -----
// レスポンスボディなし（204 No Content）

// ----- POST /api/v1/orders/{orderId}/revoke -----

public record RevokeOrderRequest(
    string RevokedBy,
    string Reason
);

public record RevokeOrderResponse(
    OrderItem Order
);

// ----- POST /api/v1/orders/forms -----

public record GetMedicalFormsRequest(
    string PatientId,
    List<string>? OrderIds
);

public record MedicalFormItem(
    string FormId,
    string FormType,
    string FormName,
    string Description,
    List<string> RelatedOrderIds,
    string PatientId,
    string CreatedAt,
    string CreatedBy,
    string Status,
    string Priority
);

public record GetMedicalFormsResponse(
    List<MedicalFormItem> Forms
);

// ----- POST /api/v1/patients/{patientId}/medical-forms/output -----

public record OutputMedicalFormsRequest(
    List<string> FormIds
);

public record OutputFormResult(
    string FormId,
    string PdfUrl
);

public record OutputMedicalFormsResponse(
    List<OutputFormResult> OutputForms
);

// ----- GET /api/v1/order-types -----

public record OrderTypeItem(
    string Id,
    string Name,
    string Route
);

public record GetOrderTypesResponse(
    List<OrderTypeItem> OrderTypes
);
