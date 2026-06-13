using KarteDomainService.Features.Karte.Entities;

namespace KarteDomainService.Features.Karte.Services;

public interface IPatientService
{
    Task<Patient?> GetByIdAsync(int id);
    Task<List<Patient>> GetAllAsync();
    Task<Patient> CreatePatientAsync(Patient patient);
    Task<Patient?> UpdatePatientAsync(Patient patient);
    Task<bool> DeletePatientAsync(int id);

    Task<Consultation?> CreateConsultationAsync(int patientId, Consultation consultation);
    Task<bool> AddPrescriptionAsync(int consultationId, Prescription prescription);
    Task<string?> UploadFacePhotoAsync(int patientId, IFormFile file);
}
