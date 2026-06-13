using KarteDomainService.Features.Sample.Master.Models;
using Microsoft.EntityFrameworkCore;

namespace KarteDomainService.Features.Sample.Master.Repositories;

/// <summary>
/// マスタデータのDBアクセス層。
/// マルチテナント対応は TenantSchemaInterceptor が search_path をセットするため、
/// クエリ内でテナントを意識する必要はない。
/// </summary>
public class BloodTypeMasterRepository
{
    private readonly ApplicationDbContext _context;

    public BloodTypeMasterRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// 血液型マスタの選択肢一覧を表示順に取得する。
    /// </summary>
    public async Task<List<BloodTypeOption>> GetBloodTypesAsync()
    {
        return await _context.MBloodTypes
            .OrderBy(b => b.SortOrder)
            .Select(b => new BloodTypeOption(b.Value, b.Label))
            .ToListAsync();
    }

    /// <summary>
    /// Rh因子マスタの選択肢一覧を表示順に取得する。
    /// </summary>
    public async Task<List<BloodTypeOption>> GetRhFactorsAsync()
    {
        return await _context.MRhFactors
            .OrderBy(r => r.SortOrder)
            .Select(r => new BloodTypeOption(r.Value, r.Label))
            .ToListAsync();
    }
}
