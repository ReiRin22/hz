using KarteDomainService.Features.Reception.Models;
using Microsoft.AspNetCore.Mvc;

namespace KarteDomainService.Features.Reception.Controllers;

// TODO: DB設計確定後に本実装へ置き換えること
[ApiController]
[Route("api/v1/reception-patients")]
public class ReceptionPatientsController : ControllerBase
{
    // GET api/v1/reception-patients?date=YYYY-MM-DD
    [HttpGet]
    public ActionResult<GetReceptionPatientsResponse> GetReceptionPatients([FromQuery] string? date)
    {
        return Ok(new GetReceptionPatientsResponse([
            new("1", "当日", "初診", "09:15", "", "P001", "山田 太郎", "ヤマダ タロウ",
                "1978-04-15", "男", 45, "保険", "高血圧", false, "",
                new(false, null, null, null, 0, 0, 0, null, null, null, null, null, null, null),
                false, false, false, "doctor1", "department1"),
            new("2", "", "再診", "09:30", "09:30-2", "P002", "佐藤 花子", "サトウ ハナコ",
                "1962-08-22", "女", 62, "保険", "糖尿病定期", true, "眼科併診",
                new(true, false, null, null, 1, 0, 0, null, null, null, null, null, null, false),
                false, false, false, "doctor1", "department1"),
            new("3", "紹介", "初診", "10:05", "", "P003", "鈴木 一郎", "スズキ イチロウ",
                "1965-11-30", "男", 58, "保険", "狭心症疑い", false, "○○病院より紹介",
                new(false, null, null, null, null, null, null, false, null, null, null, null, null, null),
                false, false, false, "doctor1", "department1"),
            new("4", "", "再診", "", "14:00-1", "P004", "中村 誠", "ナカムラ マサシ",
                "1972-05-20", "男", 52, "保険", "高脂血症", false, "",
                new(false, null, null, null, null, null, null, null, null, null, null, null, null, null),
                false, false, true, "doctor1", "department1"),
            new("5", "救急", "初診", "11:25", "", "P005", "山田 花子", "ヤマダ ハナコ",
                "1990-03-12", "女", 34, "保険", "腹痛", false, "救急搬送",
                new(true, false, false, null, 2, 0, 0, null, null, false, null, null, null, null),
                false, false, false, "doctor1", "department1"),
        ]));
    }
}
