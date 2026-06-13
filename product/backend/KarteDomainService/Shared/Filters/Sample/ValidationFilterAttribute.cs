using KarteDomainService.Shared.Exceptions;
using Microsoft.AspNetCore.Mvc.Filters;

namespace KarteDomainService.Shared.Filters.Sample;

[AttributeUsage(AttributeTargets.Method)]
public class ValidationFilterAttribute : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.ModelState.IsValid)
        {
            var errors = context.ModelState
                .Where(e => e.Value?.Errors.Count > 0)
                .SelectMany(e => e.Value!.Errors.Select(err => new ValidationError(
                    Field:   e.Key,
                    Code:    "REQUIRED",
                    Message: err.ErrorMessage)))
                .ToList();

            throw new ValidationException(errors);
        }
    }
}
