using System.ComponentModel.DataAnnotations;

namespace KarteDomainService.Shared.Entities;

/// <summary>
/// 血液型マスタエンティティ。
/// フロントエンドの血液型ドロップダウンの選択肢を管理する。
/// Value を TVitalInfos.BloodType に保存し、Label を画面表示に使用する。
/// </summary>
public class MBloodTypes
{
    /// <summary>サロゲートキー（DB自動採番）</summary>
    [Required] public int Id { get; set; }

    /// <summary>送信値（例: "A", "B", "O", "AB"）</summary>
    [Required] public string Value { get; set; } = string.Empty;

    /// <summary>表示ラベル（例: "A型", "B型", "O型", "AB型"）</summary>
    [Required] public string Label { get; set; } = string.Empty;

    /// <summary>画面表示順。昇順で並べる。</summary>
    public int SortOrder { get; set; }
}
