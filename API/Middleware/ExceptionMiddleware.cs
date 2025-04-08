using System.Net;
using System.Text.Json;
using Application.Core;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;
        private readonly JsonSerializerOptions _options;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
            _options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                var oldResponse = context.Response;
                oldResponse.ContentType = "application/json";
                oldResponse.StatusCode = (int)HttpStatusCode.InternalServerError;

                var newResponse = _env.IsDevelopment()
                ? new AppException(oldResponse.StatusCode, ex.Message, ex.StackTrace?.ToString())
                : new AppException(oldResponse.StatusCode, "Internal server error");

                var json = JsonSerializer.Serialize(newResponse, _options);

                await oldResponse.WriteAsync(json);
            }
        }
    }
}