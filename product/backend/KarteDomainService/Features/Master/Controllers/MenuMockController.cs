using KarteDomainService.Features.Master.Models;
using Microsoft.AspNetCore.Mvc;

namespace KarteDomainService.Features.Master.Controllers;

// TODO: DB設計確定後に本実装へ置き換えること
[ApiController]
[Route("api/v1/menu")]
public class MenuMockController : ControllerBase
{
    // GET api/v1/menu/items
    [HttpGet("items")]
    public ActionResult<MenuItemsGetResponse> GetMenuItems()
    {
        return Ok(new MenuItemsGetResponse(new List<MenuItemRecord>
        {
            new("1",  "患者基本情報",   "User",     "normal", true, false, 1),
            new("2",  "受診者一覧",     "Search",   "normal", true, false, 2, Url: "/reception-list"),
            new("3",  "予約・受付",     "Calendar", "normal", true, false, 3),
            new("4",  "外来カルテ",     "FileText", "normal", true, true,  4, Url: "/karte/{patientId}/diagnosis/record-creation"),
            new("5",  "入院カルテ",     "Folder",   "normal", true, false, 5),
            new("6",  "病棟マップ",     "Map",      "normal", true, true,  6),
            new("7",  "検査結果／画像", "Image",    "normal", true, false, 7),
            new("8",  "文書作成",       "FileEdit", "normal", true, false, 8),
            new("9",  "部門",           "Building", "department", true, false, 9,
                Children: new List<MenuItemRecord>
                {
                    new("9-1", "臨床検査科",   "Building", "departmentChild", true, false, 1,
                        Url: "/dept-instruction/lab-instruction", ParentId: "9"),
                    new("9-2", "放射線科",     "Building", "departmentChild", true, false, 2, ParentId: "9"),
                    new("9-3", "内視鏡検査科", "Building", "departmentChild", true, false, 3, ParentId: "9"),
                    new("9-4", "栄養指導科",   "Building", "departmentChild", true, false, 4, ParentId: "9"),
                }),
            new("10", "マスタ管理",     "Database", "normal", true, false, 10),
            new("11", "システム設定",   "Settings", "normal", true, false, 11),
            new("12", "ログアウト",     "LogOut",   "normal", true, false, 12),
        }));
    }
}
