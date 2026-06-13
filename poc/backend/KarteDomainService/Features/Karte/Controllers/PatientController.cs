using KarteDomainService.Features.Karte.Entities;
using KarteDomainService.Features.Karte.Services;
using KarteDomainService.Shared.Services;
using Microsoft.AspNetCore.Mvc;

namespace KarteDomainService.Features.Karte.Controllers;

[ApiController]
[Route("[controller]")]
public class PatientController : ControllerBase
{
    private readonly IPatientService _service;

    public PatientController(IPatientService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<Patient>>> GetAll()
    {
        var tenantId = HttpContext.RequestServices.GetRequiredService<ITenantService>().TenantId;
        Console.WriteLine($"[DEBUG] Current Tenant: {tenantId ?? "None"}");
        var patients = await _service.GetAllAsync();
        return Ok(patients);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Patient>> GetById(int id)
    {
        var tenantId = HttpContext.RequestServices.GetRequiredService<ITenantService>().TenantId;
        Console.WriteLine($"[DEBUG] Current Tenant: {tenantId ?? "None"}");
        var patient = await _service.GetByIdAsync(id);
        if (patient == null) return NotFound();
        return Ok(patient);
    }

    [HttpPost]
    public async Task<ActionResult<Patient>> Create([FromBody] Patient patient)
    {
        var created = await _service.CreatePatientAsync(patient);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Patient>> Update(int id, [FromBody] Patient patient)
    {
        if (id != patient.Id) return BadRequest();

        var updated = await _service.UpdatePatientAsync(patient);
        if (updated == null) return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var deleted = await _service.DeletePatientAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }

    [HttpPost("{patientId}/consultations")]
    public async Task<ActionResult<Consultation>> CreateConsultation(int patientId, [FromBody] Consultation consultation)
    {
        var created = await _service.CreateConsultationAsync(patientId, consultation);
        if (created == null) return NotFound();
        return CreatedAtAction(nameof(GetById), new { id = patientId }, created);
    }

    [HttpPost("consultations/{consultationId}/prescriptions")]
    public async Task<ActionResult> AddPrescription(int consultationId, [FromBody] Prescription prescription)
    {
        var added = await _service.AddPrescriptionAsync(consultationId, prescription);
        if (!added) return BadRequest();
        return NoContent();
    }

    [HttpPost("{id}/photo")]
    public async Task<IActionResult> UploadPhoto(int id, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("ファイルが選択されていないか、空です。");

        try
        {
            var dbPath = await _service.UploadFacePhotoAsync(id, file);

            if (dbPath == null)
            {
                return NotFound(new { Message = "患者が見つかりませんでした。" });
            }

            return Ok(new { ImagePath = dbPath });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }
}
