namespace KarteDomainService.Features.Sample.Master.Models;

/// <summary>
/// 血液型・Rh因子などのマスタ選択肢を表す共通型。
/// フロントエンドのドロップダウンに渡す値とラベルのペア。
/// </summary>
/// <param name="Value">送信値（例: "A", "B", "O", "AB" / "positive", "negative"）</param>
/// <param name="Label">表示ラベル（例: "A型", "B型" / "陽性(+)", "陰性(-)"）</param>
public record BloodTypeOption(string Value, string Label);
