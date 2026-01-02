

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAppFrontend", policy =>
    {
        policy.WithOrigins("https://app.nguyenth4nh.xyz")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});


// Dung khi chay localhost
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowFrontend", policy =>
//     {
//         policy.WithOrigins("http://localhost:3000")
//               .AllowAnyHeader()
//               .AllowAnyMethod()
//               .AllowCredentials();
//     });
// });
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();
// //Dung khi chay localhost
// app.UseCors("AllowFrontend");
app.UseCors("AllowAppFrontend");


app.MapReverseProxy();

app.Run();
