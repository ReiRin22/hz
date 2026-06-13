using KarteDomainService.Features.ExamResult.Exceptions;
using KarteDomainService.Features.ExamResult.Models;
using KarteDomainService.Features.ExamResult.Services;
using Microsoft.AspNetCore.Mvc;

namespace KarteDomainService.Features.ExamResult.Controllers;

// TODO: DB設計確定後に本実装へ置き換えること
[ApiController]
[Route("api/v1/orders/{orderUuid}/test-results")]
public class TestResultsController(ITestResultsService service) : ControllerBase
{
    // POST api/v1/orders/{orderUuid}/test-results/lock
    [HttpPost("lock")]
    public async Task<ActionResult<LockAcquireResponse>> AcquireLock(
        string orderUuid,
        [FromHeader(Name = "X-Tenant-Id")] string xTenantId,
        [FromHeader(Name = "X-Correlation-ID")] string xCorrelationId,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        try
        {
            var result = await service.AcquireLockAsync(orderUuid, xTenantId, xCorrelationId);
            return Ok(result);
        }
        catch (OrderNotFoundException)
        {
            return NotFound(new BackendErrorResponse("ORDER_NOT_FOUND", "The specified order does not exist."));
        }
        catch (LockConflictException ex)
        {
            return Conflict(new LockConflictResponse(
                ErrorCode: "LOCK_CONFLICT",
                LockedByUserId: ex.LockedByUserId,
                LockedByUserName: ex.LockedByUserName,
                LockedAt: ex.LockedAt));
        }
    }

    // DELETE api/v1/orders/{orderUuid}/test-results/lock
    [HttpDelete("lock")]
    public async Task<IActionResult> ReleaseLock(
        string orderUuid,
        [FromHeader(Name = "X-Tenant-Id")] string xTenantId,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        try
        {
            await service.ReleaseLockAsync(orderUuid, xTenantId);
            return NoContent();
        }
        catch (ReleaseForbiddenException)
        {
            return StatusCode(StatusCodes.Status403Forbidden,
                new BackendErrorResponse("FORBIDDEN", "Cannot release a lock owned by another user."));
        }
    }

    // GET api/v1/orders/{orderUuid}/test-results
    [HttpGet]
    public async Task<ActionResult<TestResultsGetResponse>> GetTestResults(
        string orderUuid,
        [FromHeader(Name = "X-Tenant-Id")] string xTenantId,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        try
        {
            var result = await service.GetTestResultsAsync(orderUuid, xTenantId);
            return Ok(result);
        }
        catch (OrderNotFoundException)
        {
            return NotFound(new BackendErrorResponse("ORDER_NOT_FOUND", "The specified order does not exist."));
        }
    }

    // POST api/v1/orders/{orderUuid}/test-results
    [HttpPost]
    public async Task<ActionResult<TestResultsSaveResponse>> SaveTestResults(
        string orderUuid,
        [FromHeader(Name = "X-Tenant-Id")] string xTenantId,
        [FromHeader(Name = "X-Correlation-ID")] string xCorrelationId,
        [FromHeader(Name = "Authorization")] string authorization,
        [FromBody] TestResultsSaveRequest request)
    {
        try
        {
            var result = await service.SaveTestResultsAsync(orderUuid, xTenantId, xCorrelationId, request);
            return Ok(result);
        }
        catch (OrderNotFoundException)
        {
            return NotFound(new BackendErrorResponse("ORDER_NOT_FOUND", "The specified order does not exist."));
        }
        catch (LockConflictException ex)
        {
            return Conflict(new LockConflictResponse(
                ErrorCode: "LOCK_CONFLICT",
                LockedByUserId: ex.LockedByUserId,
                LockedByUserName: ex.LockedByUserName,
                LockedAt: ex.LockedAt));
        }
        catch (LockExpiredException)
        {
            return Conflict(new BackendErrorResponse("LOCK_EXPIRED", "The edit lock has expired or does not exist."));
        }
        catch (ValidationDeleteException)
        {
            return BadRequest(new BackendErrorResponse("VALIDATION_DELETE", "Auto-linked test result rows cannot be deleted."));
        }
    }
}
