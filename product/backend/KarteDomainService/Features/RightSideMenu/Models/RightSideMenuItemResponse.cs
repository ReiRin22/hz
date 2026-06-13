// TODO: DB設計確定後に本実装のモデルへ置き換えること
namespace KarteDomainService.Features.RightSideMenu.Models;

public record RightSideMenuItemRecord(
    string Id,
    string Label,
    string IconKey,
    bool Visible,
    int SortOrder,
    string? Url = null);

public record RightSideMenuItemsGetResponse(List<RightSideMenuItemRecord> Items);
