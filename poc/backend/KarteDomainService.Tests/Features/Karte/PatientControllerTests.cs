using KarteDomainService.Features.Karte.Controllers;
using KarteDomainService.Features.Karte.Entities;
using KarteDomainService.Features.Karte.Services;
using KarteDomainService.Shared.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;

namespace KarteDomainService.Tests.Features.Karte;

/// <summary>
/// PatientController の単体テスト。
/// IPatientService と ITenantService をモック化し、DBなしで動作を検証する。
/// </summary>
[TestFixture]
public class PatientControllerTests
{
    private Mock<IPatientService> _serviceMock = null!;
    private PatientController _controller = null!;

    [SetUp]
    public void SetUp()
    {
        _serviceMock = new Mock<IPatientService>();

        // ITenantService をモック化してサービスプロバイダーに登録
        var tenantServiceMock = new Mock<ITenantService>();
        tenantServiceMock.Setup(t => t.TenantId).Returns("tenant_test");

        var serviceProviderMock = new Mock<IServiceProvider>();
        serviceProviderMock
            .Setup(sp => sp.GetService(typeof(ITenantService)))
            .Returns(tenantServiceMock.Object);

        // HttpContext にモックのサービスプロバイダーをセット
        var httpContext = new DefaultHttpContext
        {
            RequestServices = serviceProviderMock.Object,
        };

        _controller = new PatientController(_serviceMock.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = httpContext,
            },
        };
    }

    // ──────────────────────────────────────────
    // GET /patient
    // ──────────────────────────────────────────

    [Test]
    public async Task GetAll_WhenPatientsExist_ReturnsOkWithList()
    {
        // Arrange
        var patients = new List<Patient>
        {
            new() { Id = 1, Name = "田中 太郎", PatientCode = "P001" },
            new() { Id = 2, Name = "鈴木 花子", PatientCode = "P002" },
        };
        _serviceMock.Setup(s => s.GetAllAsync()).ReturnsAsync(patients);

        // Act
        var result = await _controller.GetAll();

        // Assert
        var ok = result.Result as OkObjectResult;
        Assert.That(ok, Is.Not.Null);
        Assert.That(ok!.StatusCode, Is.EqualTo(200));
        Assert.That(ok.Value, Is.EqualTo(patients));
    }

    // ──────────────────────────────────────────
    // GET /patient/{id}
    // ──────────────────────────────────────────

    [Test]
    public async Task GetById_WhenFound_ReturnsOk()
    {
        // Arrange
        var patient = new Patient { Id = 1, Name = "田中 太郎", PatientCode = "P001" };
        _serviceMock.Setup(s => s.GetByIdAsync(1)).ReturnsAsync(patient);

        // Act
        var result = await _controller.GetById(1);

        // Assert
        var ok = result.Result as OkObjectResult;
        Assert.That(ok, Is.Not.Null);
        Assert.That(ok!.StatusCode, Is.EqualTo(200));
        Assert.That(ok.Value, Is.EqualTo(patient));
    }

    [Test]
    public async Task GetById_WhenNotFound_Returns404()
    {
        // Arrange: 存在しない患者ID
        _serviceMock.Setup(s => s.GetByIdAsync(999)).ReturnsAsync((Patient?)null);

        // Act
        var result = await _controller.GetById(999);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<NotFoundResult>());
    }

    // ──────────────────────────────────────────
    // POST /patient
    // ──────────────────────────────────────────

    [Test]
    public async Task Create_ValidPatient_Returns201Created()
    {
        // Arrange
        var input   = new Patient { Name = "田中 太郎", PatientCode = "P001" };
        var created = new Patient { Id = 1, Name = "田中 太郎", PatientCode = "P001" };
        _serviceMock.Setup(s => s.CreatePatientAsync(input)).ReturnsAsync(created);

        // Act
        var result = await _controller.Create(input);

        // Assert
        var createdAt = result.Result as CreatedAtActionResult;
        Assert.That(createdAt, Is.Not.Null);
        Assert.That(createdAt!.StatusCode, Is.EqualTo(201));
        Assert.That(createdAt.Value, Is.EqualTo(created));
    }

    // ──────────────────────────────────────────
    // PUT /patient/{id}
    // ──────────────────────────────────────────

    [Test]
    public async Task Update_WhenIdMismatch_Returns400BadRequest()
    {
        // Arrange: URL の id とボディの patient.Id が不一致
        var patient = new Patient { Id = 2, Name = "田中 太郎", PatientCode = "P001" };

        // Act
        var result = await _controller.Update(1, patient);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<BadRequestResult>());
    }

    [Test]
    public async Task Update_WhenNotFound_Returns404()
    {
        // Arrange
        var patient = new Patient { Id = 1, Name = "田中 太郎", PatientCode = "P001" };
        _serviceMock.Setup(s => s.UpdatePatientAsync(patient)).ReturnsAsync((Patient?)null);

        // Act
        var result = await _controller.Update(1, patient);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<NotFoundResult>());
    }

    [Test]
    public async Task Update_WhenFound_ReturnsOkWithUpdatedPatient()
    {
        // Arrange
        var patient = new Patient { Id = 1, Name = "田中 太郎（更新後）", PatientCode = "P001" };
        _serviceMock.Setup(s => s.UpdatePatientAsync(patient)).ReturnsAsync(patient);

        // Act
        var result = await _controller.Update(1, patient);

        // Assert
        var ok = result.Result as OkObjectResult;
        Assert.That(ok, Is.Not.Null);
        Assert.That(ok!.StatusCode, Is.EqualTo(200));
        Assert.That(ok.Value, Is.EqualTo(patient));
    }

    // ──────────────────────────────────────────
    // DELETE /patient/{id}
    // ──────────────────────────────────────────

    [Test]
    public async Task Delete_WhenFound_Returns204NoContent()
    {
        // Arrange
        _serviceMock.Setup(s => s.DeletePatientAsync(1)).ReturnsAsync(true);

        // Act
        var result = await _controller.Delete(1);

        // Assert
        Assert.That(result, Is.InstanceOf<NoContentResult>());
    }

    [Test]
    public async Task Delete_WhenNotFound_Returns404()
    {
        // Arrange: 存在しない患者ID
        _serviceMock.Setup(s => s.DeletePatientAsync(999)).ReturnsAsync(false);

        // Act
        var result = await _controller.Delete(999);

        // Assert
        Assert.That(result, Is.InstanceOf<NotFoundResult>());
    }
}
