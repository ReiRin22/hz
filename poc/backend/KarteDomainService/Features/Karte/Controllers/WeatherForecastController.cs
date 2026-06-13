using KarteDomainService.Shared.Services;
using Microsoft.AspNetCore.Mvc;

namespace KarteDomainService.Features.Karte.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries =
    [
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    ];

    [HttpGet(Name = "GetWeatherForecast")]
    public IEnumerable<WeatherForecast> Get()
    {
        // 追加：現在のテナントIDをデバッグ出力
        var tenantId = HttpContext.RequestServices.GetRequiredService<ITenantService>().TenantId;
        Console.WriteLine($"[DEBUG] Current Tenant: {tenantId ?? "None"}");
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        })
        .ToArray();
    }
}
