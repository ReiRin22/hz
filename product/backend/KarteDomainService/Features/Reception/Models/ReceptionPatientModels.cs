// TODO: DB設計確定後に本実装のモデルへ置き換えること
namespace KarteDomainService.Features.Reception.Models;

public record PatientStatusRecord(
    bool? Consultation,
    bool? Prescription,
    bool? Injection,
    bool? Treatment,
    int? Specimen,
    int? Bacteria,
    int? Pathology,
    bool? Physiology,
    bool? Endoscopy,
    bool? Imaging,
    bool? Rehabilitation,
    bool? Dialysis,
    bool? Surgery,
    bool? Guidance);

public record ReceptionPatientRecord(
    string Id,
    string Category,
    string Type,
    string ReceptionTime,
    string AppointmentSlot,
    string PatientId,
    string Name,
    string Kana,
    string BirthDate,
    string Gender,
    int Age,
    string MedicalCategory,
    string Memo,
    bool MultiDepartment,
    string Remarks,
    PatientStatusRecord Status,
    bool PaymentComplete,
    bool ConsultationComplete,
    bool IsReservation,
    string DoctorId,
    string DepartmentId);

public record GetReceptionPatientsResponse(List<ReceptionPatientRecord> Patients);
