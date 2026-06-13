using KarteDomainService.Features.ExamResult.Exceptions;
using KarteDomainService.Features.ExamResult.Models;

namespace KarteDomainService.Features.ExamResult.Services;

// TODO: DB設計確定後に本実装へ置き換えること
public class TestResultsService : ITestResultsService
{
    // モック用: 他ユーザーロック中を再現するオーダーUUID
    private const string LockedByOtherOrderUuid = "locked-by-other";
    // モック用: 存在しないオーダーUUIDを再現する
    private const string NotFoundOrderUuid = "not-found-order";
    // モック用: ロック期限切れを再現するオーダーUUID
    private const string LockExpiredOrderUuid = "lock-expired";
    // モック用: 自動連携行削除を再現するオーダーUUID
    private const string ValidationDeleteOrderUuid = "validation-delete";
    // モック用: 他ユーザーのロック解放を再現するオーダーUUID
    private const string ReleaseForbiddenOrderUuid = "release-forbidden";

    public Task<LockAcquireResponse> AcquireLockAsync(string orderUuid, string tenantId, string correlationId)
    {
        if (orderUuid == NotFoundOrderUuid)
            throw new OrderNotFoundException();

        if (orderUuid == LockedByOtherOrderUuid)
            throw new LockConflictException(
                lockedByUserId: "user-other-001",
                lockedByUserName: "田中 太郎",
                lockedAt: "2026-04-22T09:00:00+09:00"
            );

        return Task.FromResult(new LockAcquireResponse(
            LockId: "550e8400-e29b-41d4-a716-446655440000",
            LockedAt: "2026-04-22T09:00:00+09:00",
            ExpiresAt: "2026-04-22T09:30:00+09:00"
        ));
    }

    public Task ReleaseLockAsync(string orderUuid, string tenantId)
    {
        if (orderUuid == ReleaseForbiddenOrderUuid)
            throw new ReleaseForbiddenException();

        return Task.CompletedTask;
    }

    public Task<TestResultsGetResponse> GetTestResultsAsync(string orderUuid, string tenantId)
    {
        if (orderUuid == NotFoundOrderUuid)
            throw new OrderNotFoundException();

        var record = new TestResultRecord(
            ItemCode: "GLU",
            ItemName: "血糖",
            ResultValue: null,
            Unit: "mg/dL",
            ReferenceValueDisplay: "70–110", // 70（LowerLimit）–110（UpperLimit）を整形した値。本実装では lowerLimit/upperLimit が両方 non-null の場合に "${lower}–${upper}" 形式で生成すること
            LowerLimit: 70,
            UpperLimit: 110,
            CriticalLower: 50,
            CriticalUpper: 400,
            PreviousResultValue: null,
            HasPreviousResult: false,
            TestDate: "2024/09/19",
            HasTestDate: true,
            IsUserAdded: false,
            IsAutoLinked: false,
            ConfirmedAt: null
        );

        return Task.FromResult(new TestResultsGetResponse(
            OrderUuid: orderUuid,
            HasConfirmedResults: false,
            TestResults: [record]
        ));
    }

    public Task<TestResultsSaveResponse> SaveTestResultsAsync(
        string orderUuid, string tenantId, string correlationId, TestResultsSaveRequest request)
    {
        if (orderUuid == NotFoundOrderUuid)
            throw new OrderNotFoundException();

        if (orderUuid == LockExpiredOrderUuid)
            throw new LockExpiredException();

        if (orderUuid == ValidationDeleteOrderUuid)
            throw new ValidationDeleteException();

        return Task.FromResult(new TestResultsSaveResponse(
            OrderUuid: orderUuid,
            SavedAt: "2026-04-22T09:00:00+09:00"
        ));
    }
}
