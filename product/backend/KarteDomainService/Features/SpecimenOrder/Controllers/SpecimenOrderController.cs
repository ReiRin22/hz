using KarteDomainService.Features.SpecimenOrder.Models;
using Microsoft.AspNetCore.Mvc;

namespace KarteDomainService.Features.SpecimenOrder.Controllers;

// TODO: 本番実装時は DB でオーダーを永続化すること（現在はモック固定値）
[ApiController]
[Route("api/v1")]
public class SpecimenOrderController : ControllerBase
{
    [HttpPost("patients/{patientId}/specimen-orders")]
    public ActionResult<ConfirmSpecimenOrdersResponse> ConfirmOrders(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization,
        [FromRoute] string patientId,
        [FromBody] ConfirmSpecimenOrdersRequest request)
    {
        var confirmedAt = DateTime.UtcNow.ToString("o");
        var confirmedOrders = request.Items.Select(item => new SpecimenOrderConfirmedResponse(
            Id: $"ORDER-{Guid.NewGuid()}",
            TestName: item.TestName,
            OrderCode: item.OrderCode,
            SpecimenType: item.SpecimenType,
            Status: "confirmed",
            ConfirmedAt: confirmedAt,
            ConfirmedBy: request.ConfirmedBy
        )).ToList();

        return StatusCode(201, new ConfirmSpecimenOrdersResponse(confirmedOrders));
    }

    [HttpGet("patients/{patientId}/specimen-history")]
    public ActionResult<GetSpecimenHistoryResponse> GetHistory(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization,
        [FromRoute] string patientId)
    {
        var history = new List<SpecimenHistoryItem>
        {
            new("hist-001", "2026-05-01", "血算（CBC）", "CBC", "blood",
                "confirmed", "2026-05-01T09:00:00Z", "demo", "血液検査"),
            new("hist-002", "2026-05-03", "HbA1c", "HBA1C", "blood",
                "confirmed", "2026-05-03T10:30:00Z", "demo", "生化学検査"),
        };
        return Ok(new GetSpecimenHistoryResponse(history));
    }

    [HttpGet("order-sets/specimen-sets")]
    public ActionResult<GetSpecimenSetsResponse> GetSets(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization,
        [FromQuery] string? setType)
    {
        var bloodHistoryItem = new SpecimenHistoryItem(
            "item-cbc", "2026-05-01", "血算（CBC）", "CBC", "blood",
            "confirmed", "2026-05-01T09:00:00Z", "demo", "血液検査");
        var hba1cItem = new SpecimenHistoryItem(
            "item-hba1c", "2026-05-01", "HbA1c", "HBA1C", "blood",
            "confirmed", "2026-05-01T09:00:00Z", "demo", "生化学検査");
        var gluItem = new SpecimenHistoryItem(
            "item-glu", "2026-05-01", "血糖（GLU）", "GLU", "blood",
            "confirmed", "2026-05-01T09:00:00Z", "demo", "生化学検査");

        var sets = new List<SpecimenSetItem>
        {
            new("labset-1", "糖尿病セット", "HbA1c・血糖・インスリン", "hospital",
                [hba1cItem, gluItem]),
            new("labset-2", "高血圧セット", "電解質・腎機能", "hospital",
                [bloodHistoryItem]),
            new("labset-3", "肝機能セット", "AST・ALT・γGTP", "hospital",
                [bloodHistoryItem]),
            new("labset-4", "脂質異常症セット", "TC・TG・HDL・LDL", "hospital",
                [bloodHistoryItem]),
        };

        return Ok(new GetSpecimenSetsResponse(sets));
    }
}
