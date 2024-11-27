using Microsoft.EntityFrameworkCore;
using server;
using server.Services;
using DotNetEnv;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Add response logging
builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.AddDebug();
});


// Add DbContext with SQL Server configuration
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
        //    .EnableSensitiveDataLogging()
        //    .LogTo(Console.WriteLine, LogLevel.Information));

// Define the CORS policy
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL");

if (string.IsNullOrEmpty(frontendUrl))
{
    // Throw exception if FRONTEND_URL is not set
    throw new InvalidOperationException("The environment variable FRONTEND_URL is not set. Please set it in the .env file or your environment.");
}

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins(frontendUrl)
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

// Add the ProductService
builder.Services.AddScoped<ProductsService>();
builder.Services.AddScoped<OrdersService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Apply migrations automatically on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Apply CORS globally to all routes
app.UseCors(MyAllowSpecificOrigins);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
