using KarteDomainService.Features.Master.Models;
using Microsoft.AspNetCore.Mvc;

namespace KarteDomainService.Features.Master.Controllers;

// TODO: DB設計確定後に本実装へ置き換えること
[ApiController]
[Route("api/v1/master")]
public class MasterMockController : ControllerBase
{
    // GET api/v1/master/units
    [HttpGet("units")]
    public ActionResult<UnitsGetResponse> GetUnits(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization)
    {
        return Ok(new UnitsGetResponse([
            new("mg/dL", "mg/dL"),
            new("U/L", "U/L"),
        ]));
    }

    // GET api/v1/master/modification-reasons
    [HttpGet("modification-reasons")]
    public ActionResult<ModificationReasonsGetResponse> GetModificationReasons(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization)
    {
        return Ok(new ModificationReasonsGetResponse([
            new("MISTAKE", "入力誤り"),
            new("OTHER", "その他"),
        ]));
    }

    // GET api/v1/master/test-items
    [HttpGet("test-items")]
    public ActionResult<TestItemsGetResponse> GetTestItems(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization,
        // TODO: 本実装時は itemName・itemCode による絞り込みを実装すること
        [FromQuery] string? itemName,
        [FromQuery] string? itemCode)
    {
        // モックのため itemName・itemCode による絞り込みは省略（全件返却）
        return Ok(new TestItemsGetResponse([
            new("GLU", "血糖", "mg/dL", 70, 110, 50, 400),
        ]));
    }

    // GET api/v1/master/specimen-items
    [HttpGet("specimen-items")]
    public ActionResult<SpecimenItemsGetResponse> GetSpecimenItems(
        [FromHeader(Name = "X-Tenant-Id")] string tenantId,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId,
        [FromHeader(Name = "Authorization")] string? authorization)
    {
        return Ok(new SpecimenItemsGetResponse([
            // 血液検査
            new("WBC",    "白血球（WBC）",           "blood", "血液検査"),
            new("RBC",    "赤血球（RBC）",           "blood", "血液検査"),
            new("HGB",    "ヘモグロビン（Hgb）",     "blood", "血液検査"),
            new("HCT",    "ヘマトクリット（Hct）",   "blood", "血液検査"),
            new("PLT",    "血小板（PLT）",           "blood", "血液検査"),
            new("CBC",    "血算（CBC）",             "blood", "血液検査"),
            // 生化学検査
            new("TP",     "総蛋白（TP）",            "blood", "生化学検査"),
            new("ALB",    "アルブミン（Alb）",       "blood", "生化学検査"),
            new("AST",    "AST",                    "blood", "生化学検査"),
            new("ALT",    "ALT",                    "blood", "生化学検査"),
            new("GGT",    "γ-GTP",                 "blood", "生化学検査"),
            new("ALP",    "ALP",                    "blood", "生化学検査"),
            new("TBIL",   "総ビリルビン（T-Bil）",   "blood", "生化学検査"),
            new("CRE",    "クレアチニン（CRE）",     "blood", "生化学検査"),
            new("BUN",    "尿素窒素（BUN）",         "blood", "生化学検査"),
            new("UA",     "尿酸（UA）",              "blood", "生化学検査"),
            new("GLU",    "血糖（GLU）",             "blood", "生化学検査"),
            new("HBA1C",  "HbA1c",                  "blood", "生化学検査"),
            new("IRI",    "インスリン（IRI）",        "blood", "生化学検査"),
            new("TC",     "総コレステロール（TC）",   "blood", "生化学検査"),
            new("TG",     "中性脂肪（TG）",           "blood", "生化学検査"),
            new("HDLC",   "HDL-コレステロール",       "blood", "生化学検査"),
            new("LDLC",   "LDL-コレステロール",       "blood", "生化学検査"),
            new("NA",     "ナトリウム（Na）",         "blood", "生化学検査"),
            new("K",      "カリウム（K）",            "blood", "生化学検査"),
            new("CL",     "クロール（Cl）",           "blood", "生化学検査"),
            new("CRP",    "CRP",                    "blood", "生化学検査"),
            // 凝固検査
            new("PT",     "プロトロンビン時間（PT）", "blood", "凝固検査"),
            new("APTT",   "APTT",                   "blood", "凝固検査"),
            new("FIB",    "フィブリノゲン",           "blood", "凝固検査"),
            new("DDIMER", "Dダイマー",               "blood", "凝固検査"),
            // 尿検査
            new("U-PRO",  "尿蛋白",                 "urine", "尿検査"),
            new("U-GLU",  "尿糖",                   "urine", "尿検査"),
            new("U-OB",   "尿潜血",                 "urine", "尿検査"),
            new("U-SG",   "尿比重",                 "urine", "尿検査"),
            new("U-PH",   "尿pH",                   "urine", "尿検査"),
            new("U-CRE",  "尿クレアチニン",           "urine", "尿検査"),
            // 便検査
            new("FOBT",   "便潜血（FOBT）",           "stool", "便検査"),
        ]));
    }
}
