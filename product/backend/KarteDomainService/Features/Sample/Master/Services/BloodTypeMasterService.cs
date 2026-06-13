using KarteDomainService.Features.Sample.Master.Models;
using KarteDomainService.Features.Sample.Master.Repositories;

namespace KarteDomainService.Features.Sample.Master.Services;

/// <summary>
/// マスタデータのビジネスロジック層。
/// 現時点はリポジトリへの単純委譲だが、将来的なキャッシュ処理などをここに追加する。
/// </summary>
public class BloodTypeMasterService
{
    // DBアクセスの委譲先
    private readonly BloodTypeMasterRepository _repository;

    public BloodTypeMasterService(BloodTypeMasterRepository repository)
    {
        _repository = repository;
    }

    /// <summary>血液型マスタの選択肢一覧を取得する。</summary>
    public Task<List<BloodTypeOption>> GetBloodTypesAsync()
        => _repository.GetBloodTypesAsync();

    /// <summary>Rh因子マスタの選択肢一覧を取得する。</summary>
    public Task<List<BloodTypeOption>> GetRhFactorsAsync()
        => _repository.GetRhFactorsAsync();
}
