using System.ComponentModel.DataAnnotations;

namespace KarteDomainService.Shared.Entities;

/// <summary>
/// 主訴・所見エンティティ。
/// 主訴と所見は同一テーブルで管理し、1レコードに両方を格納する。
/// 記録のたびに新しいレコードを追加し、最新1件を参照する。
/// </summary>
public class TChiefComplaints
{
    /// <summary>サロゲートキー（DB自動採番）</summary>
    public int Id { get; set; }

    /// <summary>患者ID（個人情報のため、APIのURIには含めない）</summary>
    [Required] public string PatientId { get; set; } = string.Empty;

    /// <summary>主訴・所見テキスト</summary>
    [Required] public string Text { get; set; } = string.Empty;

    /// <summary>記録日時（UTC）。最新レコード取得の基準として使用する。</summary>
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
}
