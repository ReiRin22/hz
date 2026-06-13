using KarteDomainService.Features.Karte.Entities;
using Microsoft.EntityFrameworkCore;

namespace KarteDomainService.Features.Karte.Repositories;

public class PatientRepository : IPatientRepository
{
    private readonly ApplicationDbContext _context;

    public PatientRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Patient?> GetByIdAsync(int id)
    {
        return await _context.Patients
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<List<Patient>> GetAllAsync()
    {
        return await _context.Patients.ToListAsync();
    }

    public async Task<Patient> CreateAsync(Patient patient)
    {
        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();
        return patient;
    }

    public async Task<Patient?> UpdateAsync(Patient patient)
    {
        var existing = await _context.Patients.FindAsync(patient.Id);
        if (existing == null) return null;

        existing.Name = patient.Name;
        existing.PatientCode = patient.PatientCode;

        _context.Patients.Update(existing);
        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _context.Patients.FindAsync(id);
        if (existing == null) return false;

        _context.Patients.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Consultation?> GetConsultationByIdAsync(int id)
    {
        return await _context.Consultations
            .Include(c => c.Prescriptions)
                .ThenInclude(pr => pr.Drug)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Consultation> CreateConsultationAsync(Consultation consultation)
    {
        _context.Consultations.Add(consultation);
        await _context.SaveChangesAsync();
        return consultation;
    }

    public async Task<Consultation?> UpdateConsultationAsync(Consultation consultation)
    {
        var existing = await _context.Consultations.FindAsync(consultation.Id);
        if (existing == null) return null;

        existing.ConsultationDate = consultation.ConsultationDate;

        _context.Consultations.Update(existing);
        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteConsultationAsync(int id)
    {
        var existing = await _context.Consultations.FindAsync(id);
        if (existing == null) return false;

        _context.Consultations.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> AddPrescriptionToConsultationAsync(int consultationId, Prescription prescription)
    {
        var consultation = await _context.Consultations
            .Include(c => c.Prescriptions)
                .ThenInclude(pr => pr.Drug)
            .FirstOrDefaultAsync(c => c.Id == consultationId);

        if (consultation == null) return false;

        // Use the Consultation's TryAddPrescription logic which compares DrugId or Drug.Code
        var added = consultation.TryAddPrescription(prescription);
        if (!added) return false;

        // Attach Drug if necessary
        if (prescription.Drug != null)
        {
            var existingDrug = await _context.Drugs.FirstOrDefaultAsync(d => d.Code == prescription.Drug.Code);
            if (existingDrug != null)
            {
                prescription.DrugId = existingDrug.Id;
                prescription.Drug = existingDrug;
            }
            else
            {
                // Add new drug
                _context.Drugs.Add(prescription.Drug);
                await _context.SaveChangesAsync();
                prescription.DrugId = prescription.Drug.Id;
            }
        }

        consultation.Prescriptions.Add(prescription);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateImagePathAsync(int id, string path)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient == null) return false;

        patient.ImagePath = path;

        // 他の項目は変更せず、ImagePathのみを更新対象にする
        _context.Entry(patient).Property(x => x.ImagePath).IsModified = true;

        await _context.SaveChangesAsync();
        return true;
    }
}
