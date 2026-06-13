namespace KarteDomainService.Shared.Exceptions;

/// <summary>
/// バリデーションエラー詳細（errors 配列の 1 要素）。
/// </summary>
public record ValidationError(string Field, string Code, string Message);

/// <summary>
/// 入力バリデーション失敗時にスローする例外。
/// ValidationFilterAttribute が ModelState から生成して throw する。
/// </summary>
public class ValidationException(IReadOnlyList<ValidationError> errors)
    : ArgumentException("リクエストのバリデーションに失敗しました。")
{
    public IReadOnlyList<ValidationError> Errors { get; } = errors;
}
