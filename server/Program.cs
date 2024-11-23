using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.EntityFrameworkCore;
using server;
using server.Services;
using Microsoft.AspNetCore.Diagnostics;
using server.Extensions;

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

// Add the ProductService
builder.Services.AddScoped<ProductService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Use custom exception handler middleware
app.UseCustomExceptionHandler();

app.Run();
