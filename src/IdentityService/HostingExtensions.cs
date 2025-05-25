using Duende.IdentityServer;
using IdentityService.Data;
using IdentityService.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;
using IdentityService;
namespace IdentityService;

internal static class HostingExtensions
{
    public static WebApplication ConfigureServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddRazorPages();

        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

        builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowLocalhost3000", policy =>
                {
                    policy.WithOrigins("http://localhost:3000")  // Frontend của bạn
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
                });
        });


        builder.Services
            .AddIdentityServer(options =>
            {
                options.Events.RaiseErrorEvents = true;
                options.Events.RaiseInformationEvents = true;
                options.Events.RaiseFailureEvents = true;
                options.Events.RaiseSuccessEvents = true;
                // options.IssuerUri = builder.Configuration["IssuerUri"];
                if (builder.Environment.IsEnvironment("Docker"))
                {
                    //Dùng cho Docker
                    options.IssuerUri = "http://localhost:5001";
                }

                // see https://docs.duendesoftware.com/identityserver/v6/fundamentals/resources/
                // options.EmitStaticAudienceClaim = true;
            })
            .AddInMemoryIdentityResources(Config.IdentityResources)
            .AddInMemoryApiScopes(Config.ApiScopes)
            .AddInMemoryClients(Config.Clients)
            .AddAspNetIdentity<ApplicationUser>()
            .AddProfileService<CustomProfileService>();

        builder.Services.ConfigureApplicationCookie(options =>
        {
            options.Cookie.SameSite = SameSiteMode.Lax;
        });

        builder.Services.AddAuthentication();
        // .AddGoogle(options =>
        // {
        //     options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;

        //     // register your IdentityServer with Google at https://console.developers.google.com
        //     // enable the Google+ API
        //     // set the redirect URI to https://localhost:5001/signin-google
        //     options.ClientId = "copy client ID from Google here";
        //     options.ClientSecret = "copy client secret from Google here";
        // });


        return builder.Build();
    }

    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        app.UseSerilogRequestLogging();

        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseCors("AllowLocalhost3000");

        app.UseStaticFiles();
        app.UseRouting();
        app.UseIdentityServer();
        app.UseAuthorization();

        app.MapRazorPages()
            .RequireAuthorization();

        return app;
    }
}