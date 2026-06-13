// TODO: DB設計確定後に本実装のモデルへ置き換えること
namespace KarteDomainService.Features.Master.Models;

// TODO: 本実装時は Code の形式（識別子と表示名の区別）を確認すること
public record UnitRecord(string Code, string Name);
public record UnitsGetResponse(List<UnitRecord> Units);

public record ModificationReasonRecord(string Code, string Name);
public record ModificationReasonsGetResponse(List<ModificationReasonRecord> Reasons);

public record TestItemMasterRecord(
    string Code,
    string Name,
    string UnitId,   // TODO: 本実装時は単位マスタの外部キーID（整数型 or UUID）へ変更すること
    decimal? LowerLimit,
    decimal? UpperLimit,
    decimal? CriticalLower,
    decimal? CriticalUpper);
public record TestItemsGetResponse(List<TestItemMasterRecord> Items);

public record SpecimenItemRecord(string Code, string Name, string SpecimenType, string Category);
public record SpecimenItemsGetResponse(List<SpecimenItemRecord> Items);
