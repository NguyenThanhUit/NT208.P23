

var builder = WebApplication.CreateBuilder(args);


// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("MyPolicy", policy =>
//         policy.WithOrigins("ClientApp")
//               .AllowAnyMethod()
//               .AllowAnyHeader()
//               .AllowCredentials());
// });


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
app.UseCors("MyPolicy");


app.MapReverseProxy();

app.Run();
