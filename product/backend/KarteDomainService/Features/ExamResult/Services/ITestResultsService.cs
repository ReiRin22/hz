using KarteDomainService.Features.ExamResult.Models;

namespace KarteDomainService.Features.ExamResult.Services;

public interface ITestResultsService
{
    Task<LockAcquireResponse> AcquireLockAsync(string orderUuid, string tenantId, string correlationId);
    Task ReleaseLockAsync(string orderUuid, string tenantId);
    Task<TestResultsGetResponse> GetTestResultsAsync(string orderUuid, string tenantId);
    Task<TestResultsSaveResponse> SaveTestResultsAsync(string orderUuid, string tenantId, string correlationId, TestResultsSaveRequest request);
}
