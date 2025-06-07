

var builder = WebApplication.CreateBuilder(args);


// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("MyPolicy", policy =>
//         policy.WithOrigins("ClientApp")
//               .AllowAnyMethod()
//               .AllowAnyHeader()
//               .AllowCredentials());
// });
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

app.UseCors("AllowFrontend");
// app.UseCors("MyPolicy");


app.MapReverseProxy();

app.Run();
