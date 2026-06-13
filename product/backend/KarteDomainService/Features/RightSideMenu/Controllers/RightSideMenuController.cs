using KarteDomainService.Features.RightSideMenu.Models;
using Microsoft.AspNetCore.Mvc;

namespace KarteDomainService.Features.RightSideMenu.Controllers;

// TODO: DB設計確定後に本実装へ置き換えること
[ApiController]
[Route("api/v1/right-side-menu")]
public class RightSideMenuController : ControllerBase
{
    // GET api/v1/right-side-menu/items
    [HttpGet("items")]
    public ActionResult<RightSideMenuItemsGetResponse> GetItems()
    {
        return Ok(new RightSideMenuItemsGetResponse(new List<RightSideMenuItemRecord>
        {
            new("1", "病棟マップ",   "map",      true, 1),
            new("2", "受診者一覧",   "list",     true, 2),
            new("3", "院内掲示板",   "board",    true, 3),
            new("4", "伝言メモ",     "memo",     true, 4),
            new("5", "システム設定", "settings", true, 5),
        }));
    }
}
