namespace KarteDomainService.Features.DeptInstruction.Models;

// --- POST /api/v1/dept-instructions ---

public record GetDeptInstructionsRequest(
    string? Dept,
    string? OrderTypes,
    string? Status,
    string? Date,
    string? PatientId,
    string? Ward,
    string? Doctor,
    int Page = 1,
    int PageSize = 20
);

public record DeptInstructionStatusHistoryItem(
    string Status,
    string Timestamp,
    string UpdatedBy
);

public record DeptInstructionOrderItem(
    string Id,
    string Status,
    string PatientId,
    string PatientName,
    string PatientKana,
    string Gender,
    string BirthDate,
    int Age,
    string OrderType,
    string Content,
    bool HasAllergies,
    string Location,
    string Department,
    string ReceivedAt,
    string? AttendingDoctor = null,
    string? Ward = null,
    string? RoomNumber = null,
    string? ProcedureType = null,
    string? AcceptedAt = null,
    string? ImplementedAt = null,
    string? AcceptedBy = null,
    string? ImplementedBy = null,
    string? ImplementationNotes = null,
    string? ScheduledTime = null,
    bool? MaterialRecorded = null,
    string? LabTestLocation = null,
    string? ImageTestType = null,
    string? PhysiologicalTestType = null,
    string? ExaminationType = null,
    List<DeptInstructionStatusHistoryItem>? StatusHistory = null
);

public record GetDeptInstructionsResponse(
    List<DeptInstructionOrderItem> Orders,
    int Total,
    int Page,
    int PageSize
);

// --- PATCH /api/v1/dept-instructions/{orderId}/status ---

public record UpdateDeptInstructionStatusRequest(
    string NewStatus,
    string UpdatedBy,
    string Timestamp
);

public record UpdateDeptInstructionStatusResponse(
    string OrderId,
    string NewStatus,
    string UpdatedAt
);

// --- POST /api/v1/dept-instructions/{orderId}/three-point-check ---

public record PostThreePointCheckRequest(
    bool PatientConfirmed,
    bool OrderConfirmed,
    bool AllergyConfirmed,
    string CheckedBy,
    string Timestamp
);

public record PostThreePointCheckResponse(
    string OrderId,
    string CheckedAt
);

// --- POST /api/v1/dept-instructions/{orderId}/implementer ---

public record PostImplementerRequest(
    string Implementer,
    string ImplementedAt,
    string? Witness = null,
    string? Location = null,
    string? Notes = null,
    string? Reason = null
);

public record PostImplementerResponse(
    string OrderId,
    string ImplementedAt,
    string NewStatus
);

// --- POST /api/v1/dept-instructions/{orderId}/billing-link ---

public record PostBillingLinkRequest(
    string TriggerStatus,
    string Timestamp
);

public record PostBillingLinkResponse(
    string OrderId,
    string BillingLinkedAt,
    bool Success
);
