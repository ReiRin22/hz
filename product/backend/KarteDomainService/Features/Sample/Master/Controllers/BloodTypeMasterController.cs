using KarteDomainService.Features.Sample.Master.Models;
using KarteDomainService.Features.Sample.Master.Services;
using Microsoft.AspNetCore.Mvc;

namespace KarteDomainService.Features.Sample.Master.Controllers;

/// <summary>
/// 血液型マスタを提供するコントローラー。
/// 患者IDを必要としないマスタ取得のため、GETメソッドを使用する。
/// マスタ種別ごとにコントローラーを分割し、将来の肥大化を防ぐ。
/// </summary>
[ApiController]
[Route("master/blood-type")]
public class BloodTypeMasterController : ControllerBase
{
    // マスタビジネスロジックの委譲先
    private readonly BloodTypeMasterService _service;

    public BloodTypeMasterController(BloodTypeMasterService service)
    {
        _service = service;
    }

    /// <summary>
    /// 血液型マスタの選択肢一覧を取得する（例: A型, B型, O型, AB型）。
    /// フロントエンドのドロップダウン初期化に使用する。
    /// </summary>
    [HttpGet("types")]
    public async Task<ActionResult<List<BloodTypeOption>>> GetBloodTypes()
    {
        var result = await _service.GetBloodTypesAsync();
        return Ok(result);
    }

    /// <summary>
    /// Rh因子マスタの選択肢一覧を取得する（例: 陽性(+), 陰性(-)）。
    /// フロントエンドのドロップダウン初期化に使用する。
    /// </summary>
    [HttpGet("rh-factors")]
    public async Task<ActionResult<List<BloodTypeOption>>> GetRhFactors()
    {
        var result = await _service.GetRhFactorsAsync();
        return Ok(result);
    }
}
