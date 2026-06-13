using System.ComponentModel.DataAnnotations;

namespace KarteDomainService.Shared.Entities;

/// <summary>
/// 薬剤マスタエンティティ。
/// 処方可能な薬剤の一覧を管理する。
/// TPrescriptionOrders から DrugId を外部キーとして参照される。
/// </summary>
public class MDrugs
{
    /// <summary>薬剤コード（外部マスタとの連携キー。DB自動採番ではなく外部から付与）</summary>
    [Key][Required] public string DrugId { get; set; } = string.Empty;

    /// <summary>薬剤名</summary>
    [Required] public string Name { get; set; } = string.Empty;

    /// <summary>薬剤単価</summary>
    public decimal Price { get; set; }

    /// <summary>薬剤カテゴリ（例: "抗生剤", "鎮痛剤"）</summary>
    [Required] public string Category { get; set; } = string.Empty;

    /// <summary>有効フラグ。false の場合は処方選択肢に表示しない。</summary>
    public bool IsActive { get; set; } = true;
}
