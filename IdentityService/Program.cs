using Microsoft.AspNetCore.Identity;
using IdentityService;
using Serilog;
using IdentityService.Models;
using Duende.IdentityServer.Services;
using DotNetEnv;

// Tải file .env
Env.Load();

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

Log.Information("Starting up");

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog((ctx, lc) => lc
        .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level}] {SourceContext}{NewLine}{Message:lj}{NewLine}{Exception}{NewLine}")
        .Enrich.FromLogContext()
        .ReadFrom.Configuration(ctx.Configuration));

    // Cấu hình email 
    builder.Services.AddScoped<IEmailSender, EmailSender>();

    // Đăng ký SMSSender
    builder.Services.AddScoped<ISMSSender, SMSSender>();

    var app = builder
        .ConfigureServices()
        .ConfigurePipeline();

    // Khởi tạo 1 số thông tin người dùng ban đầu
    SeedData.EnsureSeedData(app);

    app.Run();
}
catch (Exception ex) when (ex is not HostAbortedException)
{
    Log.Fatal(ex, "Unhandled exception");
}
finally
{
    Log.Information("Shut down complete");
    Log.CloseAndFlush();
}