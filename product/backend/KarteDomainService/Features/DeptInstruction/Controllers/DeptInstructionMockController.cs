using KarteDomainService.Features.DeptInstruction.Models;
using KarteDomainService.Shared.Data;
using Microsoft.AspNetCore.Mvc;

namespace KarteDomainService.Features.DeptInstruction.Controllers;

// TODO: 本番実装時は DB でオーダーを永続化すること（現在はモック固定値）
[ApiController]
[Route("api/v1/dept-instructions")]
public class DeptInstructionMockController : ControllerBase
{
    /// <summary>
    /// 臨床検査科指示受け一覧取得
    /// </summary>
    /// <remarks>
    /// POST /api/v1/dept-instructions
    ///
    /// リクエストボディ:
    /// - dept: 部門コード（'lab' 固定）
    /// - orderTypes: カンマ区切りオーダー種（specimen, physiology, pathology, bacteria）
    /// - status: ステータスフィルタ
    /// - date: 日付フィルタ（ISO date）
    /// - patientId: 患者IDフィルタ
    /// - page: ページ番号（デフォルト 1）
    /// - pageSize: 1ページ件数（デフォルト 20）
    ///
    /// レスポンス:
    /// - 200 OK: 指示受けオーダー一覧
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(typeof(GetDeptInstructionsResponse), StatusCodes.Status200OK)]
    public ActionResult<GetDeptInstructionsResponse> GetDeptInstructions(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization,
        [FromBody] GetDeptInstructionsRequest body)
    {
        // 固定オーダー + ORD076連携オーダーをマージ
        var merged = MockStores.DeptInstructionOrders.Values
            .Concat(MockStores.DeptOrdersFromOrderConfirmation.Values)
            .ToList();

        return Ok(new GetDeptInstructionsResponse(merged, merged.Count, body.Page, body.PageSize));
    }

    /// <summary>
    /// 指示受けステータス更新
    /// </summary>
    /// <remarks>
    /// PATCH /api/v1/dept-instructions/{orderId}/status
    ///
    /// リクエストボディ:
    /// - new_status: 遷移先ステータス
    /// - updated_by: 更新者ID
    /// - timestamp: 更新日時（ISO 8601）
    ///
    /// レスポンス:
    /// - 200 OK: 更新後のステータス情報
    /// - 404 Not Found: 対象オーダーが存在しない場合
    /// </remarks>
    [HttpPatch("{orderId}/status")]
    [ProducesResponseType(typeof(UpdateDeptInstructionStatusResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<UpdateDeptInstructionStatusResponse> UpdateStatus(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization,
        [FromRoute] string orderId,
        [FromBody] UpdateDeptInstructionStatusRequest request)
    {
        var updatedAt = DateTime.UtcNow.ToString("o");

        // 固定オーダーのステータスを更新
        if (MockStores.DeptInstructionOrders.TryGetValue(orderId, out var fixedOrder))
        {
            var updatedHistory = (fixedOrder.StatusHistory ?? [])
                .Concat([new(request.NewStatus, updatedAt, request.UpdatedBy)])
                .ToList();
            MockStores.DeptInstructionOrders[orderId] = fixedOrder with
            {
                Status = request.NewStatus,
                StatusHistory = updatedHistory,
            };
        }

        // ORD076から連携されたオーダーのステータスを更新してORD076側に反映させる
        if (MockStores.DeptOrdersFromOrderConfirmation.TryGetValue(orderId, out var linkedOrder))
        {
            var updatedHistory = (linkedOrder.StatusHistory ?? [])
                .Concat([new(request.NewStatus, updatedAt, request.UpdatedBy)])
                .ToList();
            MockStores.DeptOrdersFromOrderConfirmation[orderId] = linkedOrder with
            {
                Status = request.NewStatus,
                StatusHistory = updatedHistory,
            };
        }

        return Ok(new UpdateDeptInstructionStatusResponse(
            OrderId: orderId,
            NewStatus: request.NewStatus,
            UpdatedAt: DateTime.UtcNow.ToString("o")
        ));
    }

    /// <summary>
    /// 3点チェック記録
    /// </summary>
    /// <remarks>
    /// POST /api/v1/dept-instructions/{orderId}/three-point-check
    ///
    /// リクエストボディ:
    /// - patient_confirmed: 患者確認済みフラグ
    /// - order_confirmed: オーダー確認済みフラグ
    /// - allergy_confirmed: アレルギー確認済みフラグ
    /// - checked_by: 確認者ID
    /// - timestamp: 確認日時（ISO 8601）
    ///
    /// レスポンス:
    /// - 200 OK: チェック記録完了
    /// - 404 Not Found: 対象オーダーが存在しない場合
    /// </remarks>
    [HttpPost("{orderId}/three-point-check")]
    [ProducesResponseType(typeof(PostThreePointCheckResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<PostThreePointCheckResponse> PostThreePointCheck(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization,
        [FromRoute] string orderId,
        [FromBody] PostThreePointCheckRequest request)
    {
        return Ok(new PostThreePointCheckResponse(
            OrderId: orderId,
            CheckedAt: DateTime.UtcNow.ToString("o")
        ));
    }

    /// <summary>
    /// 実施者入力
    /// </summary>
    /// <remarks>
    /// POST /api/v1/dept-instructions/{orderId}/implementer
    ///
    /// リクエストボディ:
    /// - implementer: 実施者ID
    /// - implemented_at: 実施日時（ISO 8601）
    /// - witness: 証人ID（任意）
    /// - location: 実施場所（任意）
    /// - notes: 備考（任意）
    /// - reason: 理由（任意）
    ///
    /// レスポンス:
    /// - 200 OK: 実施者記録完了・ステータスが implemented に遷移
    /// - 404 Not Found: 対象オーダーが存在しない場合
    /// </remarks>
    [HttpPost("{orderId}/implementer")]
    [ProducesResponseType(typeof(PostImplementerResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<PostImplementerResponse> PostImplementer(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization,
        [FromRoute] string orderId,
        [FromBody] PostImplementerRequest request)
    {
        return Ok(new PostImplementerResponse(
            OrderId: orderId,
            ImplementedAt: request.ImplementedAt,
            NewStatus: "implemented"
        ));
    }

    /// <summary>
    /// 医事会計連携
    /// </summary>
    /// <remarks>
    /// POST /api/v1/dept-instructions/{orderId}/billing-link
    ///
    /// リクエストボディ:
    /// - trigger_status: 連携トリガーとなったステータス（accepted / result_entered）
    /// - timestamp: 連携日時（ISO 8601）
    ///
    /// レスポンス:
    /// - 200 OK: 医事会計連携完了
    /// - 404 Not Found: 対象オーダーが存在しない場合
    /// </remarks>
    [HttpPost("{orderId}/billing-link")]
    [ProducesResponseType(typeof(PostBillingLinkResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<PostBillingLinkResponse> PostBillingLink(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization,
        [FromRoute] string orderId,
        [FromBody] PostBillingLinkRequest request)
    {
        return Ok(new PostBillingLinkResponse(
            OrderId: orderId,
            BillingLinkedAt: DateTime.UtcNow.ToString("o"),
            Success: true
        ));
    }
}
