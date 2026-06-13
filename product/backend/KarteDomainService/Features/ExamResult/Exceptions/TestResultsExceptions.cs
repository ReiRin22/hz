namespace KarteDomainService.Features.ExamResult.Exceptions;

public class LockConflictException(string lockedByUserId, string lockedByUserName, string lockedAt) : Exception
{
    public string LockedByUserId { get; } = lockedByUserId;
    public string LockedByUserName { get; } = lockedByUserName;
    public string LockedAt { get; } = lockedAt;
}

public class LockExpiredException() : Exception;
public class OrderNotFoundException() : Exception;
public class ValidationDeleteException() : Exception;
public class ReleaseForbiddenException() : Exception;
