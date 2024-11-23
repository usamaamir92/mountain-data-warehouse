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

                    // Customize status code and error message based on exception type
                    if (exception is InvalidOperationException)
                    {
                        statusCode = StatusCodes.Status400BadRequest;
                        errorMessage = "Invalid operation. Please check your input.";
                    }
                    else if (exception is KeyNotFoundException)
                    {
                        statusCode = StatusCodes.Status404NotFound;
                        errorMessage = "The requested resource was not found.";
                    }
                    else if (exception is UnauthorizedAccessException)
                    {
                        statusCode = StatusCodes.Status401Unauthorized;
                        errorMessage = "You are not authorized to perform this action.";
                    }

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
