using KarteDomainService.Features.Karte.Entities;

namespace KarteDomainService.Features.Karte.Repositories;

public interface IPatientRepository
{
    // Patient CRUD
    Task<Patient?> GetByIdAsync(int id);
    Task<List<Patient>> GetAllAsync();
    Task<Patient> CreateAsync(Patient patient);
    Task<Patient?> UpdateAsync(Patient patient);
    Task<bool> DeleteAsync(int id);

    // Consultation CRUD
    Task<Consultation?> GetConsultationByIdAsync(int id);
    Task<Consultation> CreateConsultationAsync(Consultation consultation);
    Task<Consultation?> UpdateConsultationAsync(Consultation consultation);
    Task<bool> DeleteConsultationAsync(int id);

    // Prescription helper
    Task<bool> AddPrescriptionToConsultationAsync(int consultationId, Prescription prescription);
    Task<bool> UpdateImagePathAsync(int patientId, string dbPath);
}
