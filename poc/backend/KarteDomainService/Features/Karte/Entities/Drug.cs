namespace KarteDomainService.Features.Karte.Entities;

public class Drug
{
    public int Id { get; set; }
    // 医療用の一意なコード
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;

    public List<Prescription> Prescriptions { get; set; } = new();
}