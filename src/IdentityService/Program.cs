using Microsoft.AspNetCore.Identity;
using IdentityService;
using Serilog;
using IdentityService.Models;
using Duende.IdentityServer.Services;
using DotNetEnv;
using Duende.IdentityServer;

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

    // Cấu hình Authentication với Google
    builder.Services.AddAuthentication()
        .AddGoogle("Google", options =>
        {
            // options.ClientId = Environment.GetEnvironmentVariable("CLIENTID");
            // options.ClientSecret = Environment.GetEnvironmentVariable("CLIENTSECRET");
            options.ClientId = Environment.GetEnvironmentVariable("CLIENTID");
            options.ClientSecret = Environment.GetEnvironmentVariable("CLIENTSECRET");
            options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;
            options.Scope.Add("openid");
            options.Scope.Add("profile");
            options.Scope.Add("email");
            // Đảm bảo lưu state
            options.SaveTokens = true; // Lưu token để sử dụng 
            options.CorrelationCookie.SameSite = SameSiteMode.None;
            options.CorrelationCookie.SecurePolicy = CookieSecurePolicy.Always;
            options.CorrelationCookie.Path = "/";
        });
// https://localhost:5001/
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