using System.ComponentModel.DataAnnotations;

namespace KarteDomainService.Shared.Entities;

/// <summary>
/// Rh因子マスタエンティティ。
/// フロントエンドのRh因子ドロップダウンの選択肢を管理する。
/// Value を TVitalInfos.RhFactor に保存し、Label を画面表示に使用する。
/// </summary>
public class MRhFactors
{
    /// <summary>サロゲートキー（DB自動採番）</summary>
    [Required] public int Id { get; set; }

    /// <summary>送信値（例: "positive", "negative"）</summary>
    [Required] public string Value { get; set; } = string.Empty;

    /// <summary>表示ラベル（例: "陽性(+)", "陰性(-)"）</summary>
    [Required] public string Label { get; set; } = string.Empty;

    /// <summary>画面表示順。昇順で並べる。</summary>
    public int SortOrder { get; set; }
}
