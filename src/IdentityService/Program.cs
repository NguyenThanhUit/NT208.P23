using DotNetEnv;
using Duende.IdentityServer;
using IdentityService;
using Serilog;
// Env.Load(".env");

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

Log.Information("Starting up");

try
{
    var builder = WebApplication.CreateBuilder(args);
    builder.Services.AddControllers();
    builder.Host.UseSerilog((ctx, lc) => lc
        .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level}] {SourceContext}{NewLine}{Message:lj}{NewLine}{Exception}{NewLine}")
        .Enrich.FromLogContext()
        .ReadFrom.Configuration(ctx.Configuration));
    builder.Services.AddScoped<IEmailSender, EmailSender>();

    var clientId = Environment.GetEnvironmentVariable("CLIENTID");
    var clientSecret = Environment.GetEnvironmentVariable("CLIENTSECRET");

    Console.WriteLine($"CLIENTID: {clientId}");
    Console.WriteLine($"CLIENTSECRET: {clientSecret}");

    builder.Services.AddScoped<ISMSSender, SMSSender>();
    builder.Services.AddAuthentication()
        .AddGoogle("Google", options =>
        {
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

    var app = builder
        .ConfigureServices()
        .ConfigurePipeline();

    app.MapControllers();
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