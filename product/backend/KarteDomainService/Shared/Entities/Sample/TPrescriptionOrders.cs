using System.ComponentModel.DataAnnotations;

namespace KarteDomainService.Shared.Entities;

/// <summary>
/// 処方オーダーエンティティ。
/// 患者に対して医師が発行した1明細分の処方を表す。
/// MDrugs とのリレーションは ApplicationDbContext.OnModelCreating で定義。
/// </summary>
public class TPrescriptionOrders
{
    /// <summary>処方オーダーID（外部システム連携キー。DB自動採番ではなく外部から付与）</summary>
    [Key][Required] public string OrderId { get; set; } = string.Empty;

    /// <summary>患者ID（個人情報のため、APIのURIには含めない）</summary>
    [Required] public string PatientId { get; set; } = string.Empty;

    /// <summary>薬剤コード（MDrugs への外部キー）</summary>
    [Required] public string DrugId { get; set; } = string.Empty;

    /// <summary>薬剤マスタのナビゲーションプロパティ（Include で結合）</summary>
    public MDrugs? Drug { get; set; }

    /// <summary>投与頻度（例: "1日3回"）</summary>
    [Required] public string Frequency { get; set; } = string.Empty;

    /// <summary>服用タイミング（例: "食後"）</summary>
    [Required] public string Timing { get; set; } = string.Empty;

    /// <summary>投与期間（例: "7日間"）</summary>
    [Required] public string Duration { get; set; } = string.Empty;

    /// <summary>処方日時（UTC）。一覧取得時の並び順基準として使用する。</summary>
    public DateTime OrderedAt { get; set; } = DateTime.UtcNow;
}
