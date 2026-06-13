using KarteDomainService.Features.Sample.ClinicalEntry.Models;
using KarteDomainService.Features.Sample.ClinicalEntry.Services;
using KarteDomainService.Shared.Entities;
using Microsoft.AspNetCore.Mvc;

namespace KarteDomainService.Features.Sample.ClinicalEntry.Controllers;

/// <summary>
/// カルテ記入データを取得するコントローラー。
/// 患者IDは個人情報のため、URIパス・クエリパラメータに含めずリクエストボディで受け取る。
/// </summary>
[ApiController]
[Route("clinical/entry")]
public class ClinicalEntryController : ControllerBase
{
    // カルテ記入ビジネスロジックの委譲先
    private readonly ClinicalEntryService _service;

    public ClinicalEntryController(ClinicalEntryService service)
    {
        _service = service;
    }

    /// <summary>
    /// 指定患者の主訴・所見を取得する。
    /// </summary>
    /// <param name="request">患者IDを含むリクエスト</param>
    /// <returns>主訴・所見エンティティ。レコードが存在しない場合は 404 NotFound。</returns>
    [HttpPost("chief-complaint")]
    public async Task<ActionResult<TChiefComplaints>> GetChiefComplaint([FromBody] ChiefComplaintRequest request)
    {
        var result = await _service.GetChiefComplaintAsync(request.PatientId);

        // 初回入力前など、まだレコードが存在しない場合
        if (result == null) return NotFound();

        return Ok(result);
    }

    /// <summary>
    /// 指定患者のバイタル情報（血圧・血液型など）を取得する。
    /// </summary>
    /// <param name="request">患者IDを含むリクエスト</param>
    /// <returns>バイタル情報エンティティ。レコードが存在しない場合は 404 NotFound。</returns>
    [HttpPost("vital-info")]
    public async Task<ActionResult<TVitalInfos>> GetVitalInfo([FromBody] VitalInfoRequest request)
    {
        var result = await _service.GetVitalInfoAsync(request.PatientId);

        // 初回入力前など、まだレコードが存在しない場合
        if (result == null) return NotFound();

        return Ok(result);
    }

    /// <summary>
    /// 指定患者の処方オーダー一覧を取得する。
    /// </summary>
    /// <param name="request">患者IDを含むリクエスト</param>
    /// <returns>処方オーダーリスト。オーダーがない場合は空リストを返す。</returns>
    [HttpPost("prescription-order")]
    public async Task<ActionResult<PrescriptionOrderData>> GetPrescriptionOrder([FromBody] PrescriptionOrderRequest request)
    {
        // 処方がない患者も正常ケースのため、null チェックなしで空リストをそのまま返す
        var result = await _service.GetPrescriptionOrderAsync(request.PatientId);
        return Ok(result);
    }
}
