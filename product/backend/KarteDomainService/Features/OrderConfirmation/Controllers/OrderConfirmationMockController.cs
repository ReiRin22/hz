using System.Collections.Concurrent;
using KarteDomainService.Features.DeptInstruction.Models;
using KarteDomainService.Features.OrderConfirmation.Models;
using KarteDomainService.Shared.Data;
using Microsoft.AspNetCore.Mvc;

namespace KarteDomainService.Features.OrderConfirmation.Controllers;

[ApiController]
[Route("api/v1")]
public class OrderConfirmationMockController : ControllerBase
{
    // インメモリストア（モック用）
    private static ConcurrentDictionary<string, OrderItem> _orderStore = CreateInitialStore();

    // DEP002連携オーダーは MockStores.DeptOrdersFromOrderConfirmation で管理

    private static ConcurrentDictionary<string, OrderItem> CreateInitialStore() => new()
    {
        ["order-001"] = new OrderItem(
            OrderId: "order-001",
            OrderType: "PRESCRIPTION",
            OrderName: "アムロジピン錠 5mg",
            Dosage: "5mg",
            Frequency: "1日1回",
            Duration: "30日",
            Instructions: "食後",
            Priority: "NORMAL",
            Amount: "30錠",
            ScheduledAt: null,
            ConfirmedAt: null,
            ConfirmedBy: null,
            ImplementedAt: null,
            ImplementedBy: null,
            CancelledAt: null,
            CancelledBy: null,
            OrderStatus: "PENDING"
        ),
        ["order-002"] = new OrderItem(
            OrderId: "order-002",
            OrderType: "LAB",
            OrderName: "血液検査",
            Dosage: null,
            Frequency: null,
            Duration: null,
            Instructions: null,
            Priority: "NORMAL",
            Amount: null,
            ScheduledAt: "2026-05-12T09:00:00Z",
            ConfirmedAt: "2026-05-11T10:00:00Z",
            ConfirmedBy: "doctor-demo",
            ImplementedAt: null,
            ImplementedBy: null,
            CancelledAt: null,
            CancelledBy: null,
            OrderStatus: "CONFIRMED",
            SpecimenSubItems:
            [
                new("sub-001", "血算（CBC）", "CBC", "blood", "NORMAL"),
            ]
        ),
    };

    /// <summary>POST /api/v1/orders/list</summary>
    [HttpPost("orders/list")]
    public ActionResult<GetOrdersResponse> GetOrders(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization,
        [FromBody] GetOrdersRequest body)
    {
        var orders = _orderStore.Values.ToList();

        var filtered = body.Status switch
        {
            "pending" => orders.Where(o => o.OrderStatus == "PENDING").ToList(),
            "confirmed" => orders.Where(o => o.OrderStatus == "CONFIRMED").ToList(),
            _ => orders,
        };

        // DEP002で更新されたステータスをORD076の確定済みオーダーに反映する
        var enriched = filtered.Select(order =>
            MockStores.DeptOrdersFromOrderConfirmation.TryGetValue(order.OrderId, out var deptOrder)
                ? order with { DeptInstructionStatus = deptOrder.Status }
                : order
        ).ToList();

        return Ok(new GetOrdersResponse(enriched));
    }

    /// <summary>POST /api/v1/patients/{patientId}/orders/confirm</summary>
    [HttpPost("patients/{patientId}/orders/confirm")]
    public ActionResult<ConfirmOrdersResponse> ConfirmOrders(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization,
        [FromRoute] string patientId,
        [FromBody] ConfirmOrdersRequest request)
    {
        var confirmedAt = DateTime.UtcNow.ToString("o");
        var confirmedOrders = new List<OrderItem>();

        foreach (var orderId in request.OrderIds)
        {
            if (_orderStore.TryGetValue(orderId, out var existing))
            {
                var updated = existing with
                {
                    OrderStatus = "CONFIRMED",
                    ConfirmedAt = confirmedAt,
                    ConfirmedBy = request.ConfirmedBy,
                };
                _orderStore[orderId] = updated;
                confirmedOrders.Add(updated);
            }
            else
            {
                // フロント側で追加されたオーダー（panels 経由）はストアに存在しないため、
                // 最小限のエントリとして登録する
                var placeholder = new OrderItem(
                    OrderId: orderId,
                    OrderType: "UNKNOWN",
                    OrderName: "確定済みオーダー",
                    Dosage: null,
                    Frequency: null,
                    Duration: null,
                    Instructions: null,
                    Priority: "NORMAL",
                    Amount: null,
                    ScheduledAt: null,
                    ConfirmedAt: confirmedAt,
                    ConfirmedBy: request.ConfirmedBy,
                    ImplementedAt: null,
                    ImplementedBy: null,
                    CancelledAt: null,
                    CancelledBy: null,
                    OrderStatus: "CONFIRMED"
                );
                _orderStore[orderId] = placeholder;
                confirmedOrders.Add(placeholder);
            }
        }

        // LABオーダー（およびストア未登録のUNKNOWNプレースホルダー）をDEP002向けストアに連携
        // TODO: 本実装時はリクエストボディにOrderTypeを含めてプレースホルダーを廃止すること
        foreach (var order in confirmedOrders.Where(o => o.OrderType == "LAB" || o.OrderType == "UNKNOWN"))
        {
            var deptOrder = new DeptInstructionOrderItem(
                Id: order.OrderId,
                Status: "received",
                PatientId: patientId,
                PatientName: "連携患者",
                PatientKana: "レンケイカンジャ",
                Gender: "MALE",
                BirthDate: "1960-01-01",
                Age: 66,
                OrderType: "SPECIMEN_TEST",
                Content: order.OrderName,
                HasAllergies: false,
                Location: "INPATIENT",
                Department: "INTERNAL_MEDICINE",
                ReceivedAt: confirmedAt,
                AttendingDoctor: order.ConfirmedBy,
                StatusHistory: [new("received", confirmedAt, order.ConfirmedBy ?? "system")]
            );
            MockStores.DeptOrdersFromOrderConfirmation.TryAdd(deptOrder.Id, deptOrder);
        }

        return Ok(new ConfirmOrdersResponse(confirmedOrders));
    }

    /// <summary>DELETE /api/v1/orders/{orderId}</summary>
    [HttpDelete("orders/{orderId}")]
    public IActionResult DeleteOrder(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization,
        [FromRoute] string orderId)
    {
        _orderStore.TryRemove(orderId, out _);
        return NoContent();
    }

    /// <summary>POST /api/v1/orders/{orderId}/revoke</summary>
    [HttpPost("orders/{orderId}/revoke")]
    public ActionResult<RevokeOrderResponse> RevokeOrder(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization,
        [FromRoute] string orderId,
        [FromBody] RevokeOrderRequest request)
    {
        if (_orderStore.TryGetValue(orderId, out var existing))
        {
            var revoked = existing with
            {
                OrderStatus = "CANCELLED",
                CancelledAt = DateTime.UtcNow.ToString("o"),
                CancelledBy = request.RevokedBy,
            };
            _orderStore[orderId] = revoked;
            return Ok(new RevokeOrderResponse(revoked));
        }

        var placeholder = new OrderItem(
            OrderId: orderId,
            OrderType: "UNKNOWN",
            OrderName: "取り消し済みオーダー",
            Dosage: null,
            Frequency: null,
            Duration: null,
            Instructions: null,
            Priority: "NORMAL",
            Amount: null,
            ScheduledAt: null,
            ConfirmedAt: null,
            ConfirmedBy: null,
            ImplementedAt: null,
            ImplementedBy: null,
            CancelledAt: DateTime.UtcNow.ToString("o"),
            CancelledBy: request.RevokedBy,
            OrderStatus: "CANCELLED"
        );
        _orderStore[orderId] = placeholder;
        return Ok(new RevokeOrderResponse(placeholder));
    }

    /// <summary>POST /api/v1/orders/forms</summary>
    [HttpPost("orders/forms")]
    public ActionResult<GetMedicalFormsResponse> GetMedicalForms(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization,
        [FromBody] GetMedicalFormsRequest body)
    {
        var patientId = body.PatientId;
        var forms = new List<MedicalFormItem>
        {
            new(
                FormId: "form-001",
                FormType: "PRESCRIPTION",
                FormName: "処方箋",
                Description: "院外処方箋",
                RelatedOrderIds: ["order-001"],
                PatientId: patientId,
                CreatedAt: "2026-05-11T09:00:00Z",
                CreatedBy: "doctor-demo",
                Status: "READY",
                Priority: "NORMAL"
            ),
            new(
                FormId: "form-002",
                FormType: "LAB_REQUEST",
                FormName: "検査依頼書",
                Description: "血液検査依頼書",
                RelatedOrderIds: ["order-002"],
                PatientId: patientId,
                CreatedAt: "2026-05-11T10:00:00Z",
                CreatedBy: "doctor-demo",
                Status: "READY",
                Priority: "NORMAL"
            ),
        };

        return Ok(new GetMedicalFormsResponse(forms));
    }

    /// <summary>POST /api/v1/patients/{patientId}/medical-forms/output</summary>
    [HttpPost("patients/{patientId}/medical-forms/output")]
    public ActionResult<OutputMedicalFormsResponse> OutputMedicalForms(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization,
        [FromRoute] string patientId,
        [FromBody] OutputMedicalFormsRequest request)
    {
        var outputForms = request.FormIds.Select(id => new OutputFormResult(
            FormId: id,
            PdfUrl: $"/mock-pdf/{id}.pdf"
        )).ToList();

        return Ok(new OutputMedicalFormsResponse(outputForms));
    }

    /// <summary>GET /api/v1/order-types</summary>
    [HttpGet("order-types")]
    public ActionResult<GetOrderTypesResponse> GetOrderTypes(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization)
    {
        var orderTypes = new List<OrderTypeItem>
        {
            new("prescription", "処方", "/order/prescription"),
            new("injection", "注射", "/order/injection"),
            new("procedure", "処置", "/order/procedure"),
            new("guidance", "指導", "/order/guidance"),
            new("lab", "検体検査", "/order/lab"),
            new("physiology", "生理検査", "/order/physiology"),
            new("imaging", "画像検査", "/order/imaging"),
            new("rehabilitation", "リハビリ", "/order/rehabilitation"),
        };

        return Ok(new GetOrderTypesResponse(orderTypes));
    }

    /// <summary>POST /api/v1/dev/reset-orders（開発用ストアリセット）</summary>
    /// <remarks>TODO: 本実装時（DB永続化後）はこのエンドポイントごと削除すること</remarks>
    [HttpPost("dev/reset-orders")]
    public IActionResult ResetOrders(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization)
    {
        _orderStore = CreateInitialStore();
        MockStores.DeptOrdersFromOrderConfirmation = MockStores.CreateInitialDeptOrders();
        return NoContent();
    }
}
// trigger rebuild
