namespace KarteDomainService.Features.Karte.Entities;

public class Prescription
{
    public int Id { get; set; }
    // Reference to Drug entity instead of storing drug name directly
    public int DrugId { get; set; }
    public Drug? Drug { get; set; }
    public string Dosage { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int ConsultationId { get; set; }
    public Consultation? Consultation { get; set; }
}
