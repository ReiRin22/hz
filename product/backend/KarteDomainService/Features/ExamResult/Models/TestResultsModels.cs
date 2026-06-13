namespace KarteDomainService.Features.ExamResult.Models;

// TODO: 本実装時は LockedAt / ExpiresAt を DateTimeOffset 型へ変更すること
public record LockAcquireResponse(string LockId, string LockedAt, string ExpiresAt);

public record LockConflictResponse(
    string ErrorCode,
    string LockedByUserId,
    string LockedByUserName,
    string LockedAt);

public record TestResultRecord(
    string ItemCode,
    string ItemName,
    decimal? ResultValue,
    string Unit,
    string? ReferenceValueDisplay,
    decimal? LowerLimit,
    decimal? UpperLimit,
    decimal? CriticalLower,
    decimal? CriticalUpper,
    decimal? PreviousResultValue,
    bool HasPreviousResult,
    string? TestDate,          // TODO: 本実装時は DateOnly? 型へ変更すること
    bool HasTestDate,
    bool IsUserAdded,
    bool IsAutoLinked,
    string? ConfirmedAt);      // TODO: 本実装時は DateTimeOffset? 型へ変更すること

public record TestResultsGetResponse(
    string OrderUuid,
    bool HasConfirmedResults,
    IReadOnlyList<TestResultRecord> TestResults);

public record TestResultSaveRecord(
    string ItemCode,
    decimal ResultValue,
    string Unit,
    decimal? LowerLimit,
    decimal? UpperLimit,
    string? TestDate);

public record ModificationReason(string ReasonCode, string? ReasonText);

public record TestResultsSaveRequest(
    List<TestResultSaveRecord> TestResults,
    ModificationReason? ModificationReason);

public record TestResultsSaveResponse(string OrderUuid, string SavedAt); // TODO: 本実装時は SavedAt を DateTimeOffset 型へ変更すること

public record BackendErrorResponse(string ErrorCode, string Message);
