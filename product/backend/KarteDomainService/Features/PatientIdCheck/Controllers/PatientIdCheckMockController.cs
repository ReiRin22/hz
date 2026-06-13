using KarteDomainService.Features.PatientIdCheck.Models;
using Microsoft.AspNetCore.Mvc;

namespace KarteDomainService.Features.PatientIdCheck.Controllers;

// TODO: 本番実装時は DB でチェック結果を永続化すること（現在はモック固定値）
[ApiController]
[Route("api/v1/dept-instructions")]
public class PatientIdCheckMockController : ControllerBase
{
    /// <summary>
    /// 患者取り違い防止チェック期待値取得
    /// </summary>
    /// <remarks>
    /// GET /api/v1/dept-instructions/{orderId}/patient-id-check/expectations
    ///
    /// レスポンス:
    /// - 200 OK: バーコード照合に必要な患者・物品・オーダー情報
    /// - 404 Not Found: 対象オーダーが存在しない場合
    /// </remarks>
    [HttpGet("{orderId}/patient-id-check/expectations")]
    [ProducesResponseType(typeof(GetPatientIdCheckExpectationsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<GetPatientIdCheckExpectationsResponse> GetExpectations(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization,
        [FromRoute] string orderId)
    {
        return Ok(new GetPatientIdCheckExpectationsResponse(
            Patient: new PatientExpectation(
                Id: "P001",
                Name: "山田太郎",
                Kana: "ヤマダタロウ",
                BirthDate: "1960-01-15",
                Barcode: "P001-BARCODE"
            ),
            Item: new ItemExpectation(
                Name: "採血管（EDTA）",
                LotNumber: "LOT-2026-001",
                Barcode: "ITEM-BARCODE-001"
            ),
            Order: new OrderExpectation(
                Id: orderId,
                OrderType: "specimen"
            )
        ));
    }

    /// <summary>
    /// 目視確認理由テンプレート一覧取得
    /// </summary>
    /// <remarks>
    /// GET /api/v1/dept-instructions/patient-id-check/reason-templates
    ///
    /// レスポンス:
    /// - 200 OK: 理由テンプレート一覧
    /// </remarks>
    [HttpGet("patient-id-check/reason-templates")]
    [ProducesResponseType(typeof(GetReasonTemplatesResponse), StatusCodes.Status200OK)]
    public ActionResult<GetReasonTemplatesResponse> GetReasonTemplates(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization)
    {
        return Ok(new GetReasonTemplatesResponse(
            Templates: new List<ReasonTemplateItem>
            {
                new("R001", "バーコードが読み取れない（ラベル劣化）"),
                new("R002", "バーコードリーダーの不具合"),
                new("R003", "緊急対応のため手動確認"),
                new("R004", "患者の協力が得られない"),
                new("R005", "その他"),
            }
        ));
    }

    /// <summary>
    /// バーコードから職員情報取得
    /// </summary>
    /// <remarks>
    /// GET /api/v1/dept-instructions/patient-id-check/staff/{barcode}
    ///
    /// レスポンス:
    /// - 200 OK: 職員情報
    /// - 404 Not Found: 対象バーコードの職員が存在しない場合
    /// </remarks>
    [HttpGet("patient-id-check/staff/{barcode}")]
    [ProducesResponseType(typeof(GetStaffByBarcodeResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<GetStaffByBarcodeResponse> GetStaffByBarcode(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization,
        [FromRoute] string barcode)
    {
        return Ok(new GetStaffByBarcodeResponse(
            Staff: new StaffInfo(
                Id: "staff-001",
                Name: "看護師 佐藤"
            )
        ));
    }

    /// <summary>
    /// 患者取り違い防止チェック実施記録
    /// </summary>
    /// <remarks>
    /// POST /api/v1/dept-instructions/{orderId}/patient-id-check/complete
    ///
    /// リクエストボディ:
    /// - patient_confirmer: 確認者区分（PERSON / PROXY / TWO_STAFF / OTHER）
    /// - checked_by: 実施者ID
    /// - completed_at: 実施日時（ISO 8601）
    /// - patient_barcode_read: 患者バーコード読取値（任意）
    /// - item_barcode_read: 物品バーコード読取値（任意）
    /// - practitioner_barcode_read: 実施者バーコード読取値（任意）
    /// - patient_visual_confirmed: 目視確認フラグ（任意）
    /// - patient_confirm_reason: 目視確認理由（任意）
    /// - item_visual_confirmed: 物品目視確認フラグ（任意）
    /// - manual_practitioner_id: 手入力実施者ID（任意）
    ///
    /// レスポンス:
    /// - 200 OK: チェック記録完了
    /// - 404 Not Found: 対象オーダーが存在しない場合
    /// </remarks>
    [HttpPost("{orderId}/patient-id-check/complete")]
    [ProducesResponseType(typeof(PostPatientIdCheckCompleteResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<PostPatientIdCheckCompleteResponse> PostComplete(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization,
        [FromRoute] string orderId,
        [FromBody] PostPatientIdCheckCompleteRequest request)
    {
        var now = DateTime.UtcNow.ToString("o");
        return Ok(new PostPatientIdCheckCompleteResponse(
            SessionId: $"session-{orderId}-{Guid.NewGuid():N}",
            CompletedAt: request.CompletedAt,
            RecordedAt: now
        ));
    }

    /// <summary>
    /// 目視確認理由保存
    /// </summary>
    /// <remarks>
    /// POST /api/v1/dept-instructions/{orderId}/patient-id-check/confirm-reason
    ///
    /// リクエストボディ:
    /// - saved_by: 保存者ID
    /// - timestamp: 保存日時（ISO 8601）
    /// - preset_code: テンプレートコード（任意）
    /// - custom_text: 自由記入テキスト（任意）
    ///
    /// レスポンス:
    /// - 200 OK: 理由保存完了
    /// - 404 Not Found: 対象オーダーが存在しない場合
    /// </remarks>
    [HttpPost("{orderId}/patient-id-check/confirm-reason")]
    [ProducesResponseType(typeof(PostPatientConfirmReasonResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<PostPatientConfirmReasonResponse> PostConfirmReason(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization,
        [FromRoute] string orderId,
        [FromBody] PostPatientConfirmReasonRequest request)
    {
        return Ok(new PostPatientConfirmReasonResponse(
            ReasonId: $"reason-{Guid.NewGuid():N}",
            SavedAt: request.Timestamp // TODO: 本番実装時は DB 保存時刻を返すこと
        ));
    }
}
