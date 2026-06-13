using KarteDomainService.Features.Karte.Entities;
using KarteDomainService.Features.Karte.Repositories;
using KarteDomainService.Shared.Services;

namespace KarteDomainService.Features.Karte.Services;

public class PatientService : IPatientService
{
    private readonly IPatientRepository _repository;
    private readonly ITenantService _tenantService; // 追加
    private readonly IWebHostEnvironment _environment; // 追加


    public PatientService(
        IPatientRepository repository,
        ITenantService tenantService,
        IWebHostEnvironment environment)
    {
        _repository = repository;
        _tenantService = tenantService;
        _environment = environment;
    }

    public Task<Patient?> GetByIdAsync(int id) => _repository.GetByIdAsync(id);

    public Task<List<Patient>> GetAllAsync() => _repository.GetAllAsync();

    public Task<Patient> CreatePatientAsync(Patient patient) => _repository.CreateAsync(patient);

    public Task<Patient?> UpdatePatientAsync(Patient patient) => _repository.UpdateAsync(patient);

    public Task<bool> DeletePatientAsync(int id) => _repository.DeleteAsync(id);

    public async Task<Consultation?> CreateConsultationAsync(int patientId, Consultation consultation)
    {
        // ビジネスルール: Consultation は必ず Patient に紐づく
        var patient = await _repository.GetByIdAsync(patientId);
        if (patient == null) return null;

        consultation.PatientId = patientId;
        var created = await _repository.CreateConsultationAsync(consultation);
        return created;
    }

    public async Task<bool> AddPrescriptionAsync(int consultationId, Prescription prescription)
    {
        // ビジネスルール: 同一 Consultation 内で同じ Drug の重複は許さない
        return await _repository.AddPrescriptionToConsultationAsync(consultationId, prescription);
    }

    public async Task<string?> UploadFacePhotoAsync(int patientId, IFormFile file)
    {
        // 1. テナントIDの取得
        var tenantId = _tenantService.TenantId;
        if (string.IsNullOrEmpty(tenantId)) throw new InvalidOperationException("テナントIDが不明です。");

        // 2. バリデーション
        if (file == null || file.Length == 0) return null;
        if (file.Length > 5 * 1024 * 1024) throw new Exception("ファイルサイズは5MB以下にしてください。");

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
        var extension = Path.GetExtension(file.FileName).ToLower();
        if (!allowedExtensions.Contains(extension)) throw new Exception("JPGまたはPNG形式のみアップロード可能です。");

        // 3. 保存先パスの構築 (wwwroot/uploads/{tenantId}/{patientId}/)
        var relativeFolder = Path.Combine("uploads", tenantId, patientId.ToString());
        var absoluteFolder = Path.Combine(_environment.WebRootPath, relativeFolder);

        if (!Directory.Exists(absoluteFolder))
        {
            Directory.CreateDirectory(absoluteFolder);
        }

        // 4. ファイル名の決定（常に同じ名前にすることで上書き更新に対応）
        var fileName = $"face_photo{extension}";
        var absoluteFilePath = Path.Combine(absoluteFolder, fileName);

        // 5. 物理保存
        using (var stream = new FileStream(absoluteFilePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // 6. DB用のパス生成 (/uploads/tenant_a/1/face_photo.jpg)
        var dbPath = $"/{relativeFolder}/{fileName}".Replace("\\", "/");

        // Repository経由でImagePathを更新
        var success = await _repository.UpdateImagePathAsync(patientId, dbPath);

        return success ? dbPath : null;
    }
}
