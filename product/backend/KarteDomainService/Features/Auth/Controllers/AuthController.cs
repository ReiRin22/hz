using KarteDomainService.Features.Auth.Models;
using Microsoft.AspNetCore.Mvc;

namespace KarteDomainService.Features.Auth.Controllers;

// TODO: 本番実装時は DB でユーザー認証を行うこと（現在はモック固定値）
[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public ActionResult<LoginResponse> Login([FromBody] LoginRequest request)
    {
        if (request.UserId == "demo" && request.Password == "demo123")
        {
            return Ok(new LoginResponse(
                UserId: "demo",
                UserName: "田中 太郎",
                Role: "doctor",
                Token: "mock-token-demo"));
        }

        return Unauthorized();
    }
}
