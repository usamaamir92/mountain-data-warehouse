using Microsoft.AspNetCore.Diagnostics;

namespace server.Extensions
{
    public static class CustomExceptionHandler
    {
        public static IApplicationBuilder UseCustomExceptionHandler(this IApplicationBuilder app)
        {
            app.UseExceptionHandler(errorApp =>
            {
                errorApp.Run(async context =>
                {
                    context.Response.ContentType = "application/json";

                    var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;

                    // Default to 500 Internal Server Error
                    var statusCode = StatusCodes.Status500InternalServerError;
                    string errorMessage = "An unexpected error occurred. Please try again later.";

                    context.Response.StatusCode = statusCode;

                    var errorResponse = new
                    {
                        Message = errorMessage,
                        StatusCode = statusCode,
                        Details = exception?.Message // Include detailed error in development
                    };

                    await context.Response.WriteAsJsonAsync(errorResponse);
                });
            });

            return app;
        }
    }
}
