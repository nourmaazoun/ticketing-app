using Microsoft.AspNetCore.Mvc;
using tiiicketing_app.model;
using tiiicketing_app.Data;
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;

namespace tiiicketing_app.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/Users/register
        [HttpPost("register")]
        public IActionResult Register([FromBody] Employe newEmploye)
        {
            if (newEmploye == null)
                return BadRequest(new { message = "Données invalides" });

            var existingUser = _context.Employes.FirstOrDefault(e => e.Email == newEmploye.Email);
            if (existingUser != null)
                return Conflict(new { message = "Un utilisateur avec cet email existe déjà." });

            _context.Employes.Add(newEmploye);
            _context.SaveChanges();

            return Ok(new { message = "Inscription réussie" });
        }

        // POST: api/Users/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Motdepasse))
                return BadRequest("Email et mot de passe requis.");

            var user = _context.Employes.FirstOrDefault(e => e.Email == request.Email && e.Motdepasse == request.Motdepasse);

            if (user == null)
                return Unauthorized("Email ou mot de passe invalide.");

            return Ok(new
            {
                message = "Connexion réussie",
                userId = user.Id,
                nom = user.Nom,
                email = user.Email
            });
        }
    


        // GET: api/Users/me


        // POST: api/Users/logout
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear(); // ✅ Vide la session
            return Ok(new { message = "Déconnexion réussie" });
        }

        // GET: api/Users/employes
        [HttpGet("employes")]
        public ActionResult<IEnumerable<object>> GetEmployeNames()
        {
            var employeNames = _context.Employes
                .Select(e => new { e.Id, Nom = e.Nom })
                .ToList();

            return Ok(employeNames);
        }

        // 🔄 DTO pour la session
        
    }
}
