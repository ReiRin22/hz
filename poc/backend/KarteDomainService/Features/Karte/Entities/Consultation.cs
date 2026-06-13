namespace KarteDomainService.Features.Karte.Entities;

public class Consultation
{
    public int Id { get; set; }
    public DateTime ConsultationDate { get; set; } = DateTime.UtcNow;

    public int PatientId { get; set; }
    public Patient? Patient { get; set; }

    public List<Prescription> Prescriptions { get; set; } = new();

    /// <summary>
    /// 指定した処方を追加します。既存の処方と Drug.Code または DrugId で比較し重複がある場合は追加せず false を返します。
    /// </summary>
    public bool TryAddPrescription(Prescription prescription)
    {
        if (prescription == null) return false;

        // 1) DrugId が設定されている場合は ID で比較
        if (prescription.DrugId != 0)
        {
            var existsById = Prescriptions.Any(p => p.DrugId == prescription.DrugId && p.DrugId != 0);
            if (existsById) return false;
        }

        // 2) Drug オブジェクトの Code が設定されている場合はコードで比較（大文字小文字を無視）
        var newCode = prescription.Drug?.Code;
        if (!string.IsNullOrWhiteSpace(newCode))
        {
            var existsByCode = Prescriptions.Any(p => !string.IsNullOrWhiteSpace(p.Drug?.Code) && string.Equals(p.Drug!.Code, newCode, StringComparison.OrdinalIgnoreCase));
            if (existsByCode) return false;
        }

        // 3) 上記いずれの情報もない場合はチェックできないためそのまま追加する
        Prescriptions.Add(prescription);
        return true;
    }
}
