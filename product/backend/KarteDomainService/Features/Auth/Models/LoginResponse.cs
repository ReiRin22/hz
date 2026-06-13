namespace KarteDomainService.Features.Auth.Models;

public record LoginResponse(string UserId, string UserName, string Role, string Token);
