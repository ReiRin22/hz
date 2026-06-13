using System.ComponentModel.DataAnnotations;

namespace KarteDomainService.Shared.Entities;

/// <summary>
/// バイタル情報エンティティ。
/// 血圧・血液型・Rh因子など患者の生体情報を保持する。
/// 各項目は未測定の場合があるため nullable。
/// 記録のたびに新しいレコードを追加し、最新1件を参照する。
/// </summary>
public class TVitalInfos
{
    /// <summary>サロゲートキー（DB自動採番）</summary>
    [Required] public int Id { get; set; }

    /// <summary>患者ID（個人情報のため、APIのURIには含めない）</summary>
    [Required] public string PatientId { get; set; } = string.Empty;

    /// <summary>血圧（例: "120/80"）。未測定の場合は null。</summary>
    public string? BloodPressure { get; set; }

    /// <summary>血液型（例: "A", "B", "O", "AB"）。未確認の場合は null。</summary>
    public string? BloodType { get; set; }

    /// <summary>Rh因子（例: "positive", "negative"）。未確認の場合は null。</summary>
    public string? RhFactor { get; set; }

    /// <summary>記録日時（UTC）。最新レコード取得の基準として使用する。</summary>
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
}
