using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using tiiicketing_app.Data;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

var builder = WebApplication.CreateBuilder(args);

// Configuration
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// Base de données EF Core
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Contrôleurs avec JSON camelCase + insensible à la casse
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true; // IMPORTANT
    });

// Authentification cookie uniquement (pas de session)
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/api/Users/login";
        options.Cookie.Name = "AuthCookie";
        options.Cookie.SameSite = SameSiteMode.Lax;         // Pour dev local
        options.Cookie.SecurePolicy = CookieSecurePolicy.None; // Pas HTTPS obligatoire en dev
        options.ExpireTimeSpan = TimeSpan.FromHours(2);
        options.SlidingExpiration = true;
    });

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS pour Angular localhost:4200
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularDev", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // <- assure-toi que ton Angular tourne bien ici
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // cookies autorisés
    });
});

var app = builder.Build();

// Dev tools
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

// Middleware pipeline
app.UseHttpsRedirection(); // désactive-le si tu ne fais pas de HTTPS
app.UseRouting();
app.UseCors("AngularDev");

app.UseCookiePolicy();    // pour le cross-origin
app.UseAuthentication();  // active l’authentification par cookie
app.UseAuthorization();

app.MapControllers();

// Appliquer migrations EF Core automatiquement
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
   
db.Database.Migrate();
}

app.Run();
