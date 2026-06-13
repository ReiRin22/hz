using KarteDomainService.Features.Sample.ClinicalEntry.Models;
using KarteDomainService.Features.Sample.ClinicalEntry.Repositories;
using KarteDomainService.Shared.Entities;

namespace KarteDomainService.Features.Sample.ClinicalEntry.Services;

/// <summary>
/// カルテ記入データのビジネスロジック層。
/// 患者IDの入力バリデーションと、患者データへのアクセスログ（監査証跡）を担う。
/// </summary>
public class ClinicalEntryService
{
    private readonly ClinicalEntryRepository _repository;
    private readonly ILogger<ClinicalEntryService> _logger;

    public ClinicalEntryService(ClinicalEntryRepository repository, ILogger<ClinicalEntryService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    /// <summary>指定患者の最新の主訴・所見を取得する。</summary>
    public async Task<TChiefComplaints?> GetChiefComplaintAsync(string patientId)
    {
        ValidatePatientId(patientId);
        _logger.LogInformation("主訴・所見を取得します。PatientId={PatientId}", patientId);

        var result = await _repository.GetChiefComplaintAsync(patientId);

        if (result == null)
            _logger.LogWarning("主訴・所見のレコードが存在しません。PatientId={PatientId}", patientId);

        return result;
    }

    /// <summary>指定患者の最新のバイタル情報を取得する。</summary>
    public async Task<TVitalInfos?> GetVitalInfoAsync(string patientId)
    {
        ValidatePatientId(patientId);
        _logger.LogInformation("バイタル情報を取得します。PatientId={PatientId}", patientId);

        var result = await _repository.GetVitalInfoAsync(patientId);

        if (result == null)
            _logger.LogWarning("バイタル情報のレコードが存在しません。PatientId={PatientId}", patientId);

        return result;
    }

    /// <summary>指定患者の処方オーダー一覧を取得する。</summary>
    public async Task<PrescriptionOrderData> GetPrescriptionOrderAsync(string patientId)
    {
        ValidatePatientId(patientId);
        _logger.LogInformation("処方オーダーを取得します。PatientId={PatientId}", patientId);

        return await _repository.GetPrescriptionOrderAsync(patientId);
    }

    /// <summary>
    /// 患者IDの入力バリデーション。
    /// 空文字の場合、不正なDBクエリが発行される前に早期にエラーを返す。
    /// </summary>
    private static void ValidatePatientId(string patientId)
    {
        if (string.IsNullOrWhiteSpace(patientId))
            throw new ArgumentException("患者IDは必須です。", nameof(patientId));
    }
}
