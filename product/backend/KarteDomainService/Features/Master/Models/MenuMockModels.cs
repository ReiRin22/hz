// TODO: DB設計確定後に本実装のモデルへ置き換えること
namespace KarteDomainService.Features.Master.Models;

public record MenuItemRecord(
    string Id,
    string Title,
    string IconName,
    string Type,                          // "normal" | "department" | "departmentChild"
    bool Visible,
    bool IsFavorite,
    int SortOrder,
    string? Url = null,
    string? ParentId = null,
    List<MenuItemRecord>? Children = null);

public record MenuItemsGetResponse(List<MenuItemRecord> Items);
