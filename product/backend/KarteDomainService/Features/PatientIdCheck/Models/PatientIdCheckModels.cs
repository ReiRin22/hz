namespace KarteDomainService.Features.PatientIdCheck.Models;

// --- GET /api/v1/dept-instructions/{orderId}/patient-id-check/expectations ---

public record PatientExpectation(
    string Id,
    string Name,
    string BirthDate,
    string Barcode,
    string? Kana = null
);

public record ItemExpectation(
    string Name,
    string Barcode,
    string? LotNumber = null
);

public record OrderExpectation(
    string Id,
    string OrderType
);

public record GetPatientIdCheckExpectationsResponse(
    PatientExpectation Patient,
    ItemExpectation Item,
    OrderExpectation Order
);

// --- GET /api/v1/dept-instructions/patient-id-check/reason-templates ---

public record ReasonTemplateItem(
    string Code,
    string Label
);

public record GetReasonTemplatesResponse(
    List<ReasonTemplateItem> Templates
);

// --- GET /api/v1/dept-instructions/patient-id-check/staff/{barcode} ---

public record StaffInfo(
    string Id,
    string Name
);

public record GetStaffByBarcodeResponse(
    StaffInfo Staff
);

// --- POST /api/v1/dept-instructions/{orderId}/patient-id-check/complete ---

public record PatientConfirmReason(
    string? PresetCode = null,
    string? CustomText = null
);

public record PostPatientIdCheckCompleteRequest(
    string PatientConfirmer,
    string CheckedBy,
    string CompletedAt,
    string? PatientBarcodeRead = null,
    string? ItemBarcodeRead = null,
    string? PractitionerBarcodeRead = null,
    bool? PatientVisualConfirmed = null,
    PatientConfirmReason? PatientConfirmReason = null,
    bool? ItemVisualConfirmed = null,
    string? ManualPractitionerId = null
);

public record PostPatientIdCheckCompleteResponse(
    string SessionId,
    string CompletedAt,
    string RecordedAt
);

// --- POST /api/v1/dept-instructions/{orderId}/patient-id-check/confirm-reason ---

public record PostPatientConfirmReasonRequest(
    string SavedBy,
    string Timestamp,
    string? PresetCode = null,
    string? CustomText = null
);

public record PostPatientConfirmReasonResponse(
    string ReasonId,
    string SavedAt
);
