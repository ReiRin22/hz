using KarteDomainService.Shared.Services;

namespace KarteDomainService.Shared.Middlewares;

public class TenantMiddleware
{
    private readonly RequestDelegate _next;
    public TenantMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context, ITenantService tenantService)
    {
        if (context.Request.Headers.TryGetValue("X-Tenant-ID", out var tenantId))
        {
            tenantService.TenantId = tenantId;
            // NLog 5.0 以降の推奨される書き方
            NLog.ScopeContext.PushProperty("TenantID", tenantId);
        }
        await _next(context);
    }
}