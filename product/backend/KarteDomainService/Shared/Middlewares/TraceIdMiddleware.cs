namespace KarteDomainService.Shared.Middlewares;

public class TraceIdMiddleware
{
    private const string HeaderName = "X-Trace-ID";

    private readonly RequestDelegate _next;

    public TraceIdMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        // BFF から送られた X-Trace-ID を取得。なければ ASP.NET Core の TraceIdentifier を使用
        var traceId = context.Request.Headers.TryGetValue(HeaderName, out var value) && !string.IsNullOrEmpty(value)
            ? value.ToString()
            : context.TraceIdentifier;

        // 後続ミドルウェア・ExceptionMiddleware から参照できるよう Items に保持
        context.Items["TraceId"] = traceId;

        // NLog の MDLC に登録することでログに自動付与される
        NLog.ScopeContext.PushProperty("TraceId", traceId);

        await _next(context);
    }
}
