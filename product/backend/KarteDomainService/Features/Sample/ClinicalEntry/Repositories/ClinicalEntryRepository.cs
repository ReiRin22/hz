using KarteDomainService.Features.Sample.ClinicalEntry.Models;
using KarteDomainService.Shared.Entities;
using Microsoft.EntityFrameworkCore;

namespace KarteDomainService.Features.Sample.ClinicalEntry.Repositories;

/// <summary>
/// カルテ記入データのDBアクセス層。
/// マルチテナント対応は TenantSchemaInterceptor が search_path をセットするため、
/// クエリ内でテナントを意識する必要はない。
/// </summary>
public class ClinicalEntryRepository
{
    private readonly ApplicationDbContext _context;

    public ClinicalEntryRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// 指定患者の主訴・所見を最新レコード1件取得する。
    /// レコードが存在しない場合は null を返す。
    /// </summary>
    public async Task<TChiefComplaints?> GetChiefComplaintAsync(string patientId)
    {
        return await _context.TChiefComplaints
            .Where(c => c.PatientId == patientId)
            .OrderByDescending(c => c.RecordedAt)
            .FirstOrDefaultAsync();
    }

    /// <summary>
    /// 指定患者のバイタル情報を最新レコード1件取得する。
    /// レコードが存在しない場合は null を返す。
    /// </summary>
    public async Task<TVitalInfos?> GetVitalInfoAsync(string patientId)
    {
        return await _context.TVitalInfos
            .Where(v => v.PatientId == patientId)
            .OrderByDescending(v => v.RecordedAt)
            .FirstOrDefaultAsync();
    }

    /// <summary>
    /// 指定患者の処方オーダー一覧を取得し、レスポンス型に変換して返す。
    /// 薬剤マスタ（Drug）をIncludeして1クエリで解決する。
    /// </summary>
    public async Task<PrescriptionOrderData> GetPrescriptionOrderAsync(string patientId)
    {
        var records = await _context.TPrescriptionOrders
            .Include(p => p.Drug)
            .Where(p => p.PatientId == patientId)
            .OrderBy(p => p.OrderedAt)
            .ToListAsync();

        var items = records.Select(p => new PrescriptionItem(
            p.PatientId, p.OrderId,
            new Drug(p.Drug!.DrugId, p.Drug.Name, p.Drug.Price, p.Drug.Category),
            p.Frequency, p.Timing, p.Duration
        )).ToList();

        return new PrescriptionOrderData(items);
    }
}
