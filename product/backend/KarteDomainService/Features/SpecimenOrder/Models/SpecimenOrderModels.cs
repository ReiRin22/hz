namespace KarteDomainService.Features.SpecimenOrder.Models;

public record SpecimenOrderItem(
    string SpecimenType,
    string OrderCode,
    string TestName,
    int? Quantity,
    string? Priority,
    string? ClinicalPurpose,
    string? SpecialInstructions
);

public record ConfirmSpecimenOrdersRequest(
    List<SpecimenOrderItem> Items,
    string ConfirmedBy
);

public record SpecimenOrderConfirmedResponse(
    string Id,
    string TestName,
    string OrderCode,
    string SpecimenType,
    string Status,
    string ConfirmedAt,
    string ConfirmedBy
);

public record ConfirmSpecimenOrdersResponse(
    List<SpecimenOrderConfirmedResponse> ConfirmedOrders
);

public record SpecimenHistoryItem(
    string Id,
    string Date,
    string TestName,
    string OrderCode,
    string SpecimenType,
    string Status,
    string ConfirmedAt,
    string ConfirmedBy,
    string? Category = null
);

public record GetSpecimenHistoryResponse(
    List<SpecimenHistoryItem> History
);

public record SpecimenSetItem(
    string Id,
    string Name,
    string Description,
    string SetType,
    List<SpecimenHistoryItem> Items
);

public record GetSpecimenSetsResponse(
    List<SpecimenSetItem> SpecimenSets
);
