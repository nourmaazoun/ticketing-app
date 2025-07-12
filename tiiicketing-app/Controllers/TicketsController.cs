using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using tiiicketing_app.Data;
using tiiicketing_app.model;

namespace tiiicketing_app.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TicketsController(AppDbContext context)
        {
            _context = context;
        }
        private string CleanFileName(string fileName)
        {
            // Remplace tous les caractères invalides dans le nom de fichier par '_'
            foreach (var c in Path.GetInvalidFileNameChars())
                fileName = fileName.Replace(c, '_');
            // Remplace les espaces et apostrophes par '_'
            fileName = fileName.Replace(' ', '_').Replace('\'', '_');
            return fileName;
        }

        [HttpPost]
        [RequestSizeLimit(100_000_000)] // Limite à 100MB
        public async Task<IActionResult> CreateTicket([FromForm] TicketFormDto dto)
        {
            // Validation des champs obligatoires
            if (string.IsNullOrWhiteSpace(dto.UserName) ||
                string.IsNullOrWhiteSpace(dto.Requester) ||
                string.IsNullOrWhiteSpace(dto.Title) ||
                string.IsNullOrWhiteSpace(dto.Description) ||
                string.IsNullOrWhiteSpace(dto.Category) ||
                string.IsNullOrWhiteSpace(dto.Priority))
            {
                return BadRequest("Tous les champs obligatoires doivent être remplis");
            }

            string filePath = null;
            string absoluteUploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

            try
            {
                // Si un fichier est fourni
                if (dto.File != null && dto.File.Length > 0)
                {
                    // Création du dossier s'il n'existe pas
                    if (!Directory.Exists(absoluteUploadPath))
                    {
                        Directory.CreateDirectory(absoluteUploadPath);
                        Console.WriteLine($"[SUCCESS] Dossier créé : {absoluteUploadPath}");
                    }

                    var originalFileName = Path.GetFileName(dto.File.FileName);
                    var safeFileName = CleanFileName(originalFileName);
                    var uniqueFileName = $"{Guid.NewGuid()}_{safeFileName}";
                    var fullPhysicalPath = Path.Combine(absoluteUploadPath, uniqueFileName);

                    // Sauvegarde du fichier
                    using (var stream = new FileStream(fullPhysicalPath, FileMode.Create))
                    {
                        await dto.File.CopyToAsync(stream);
                        await stream.FlushAsync();
                        Console.WriteLine($"[SUCCESS] Fichier enregistré : {fullPhysicalPath} ({stream.Length} bytes)");
                    }

                    // Vérification de l'existence du fichier après écriture
                    if (!System.IO.File.Exists(fullPhysicalPath))
                    {
                        Console.WriteLine($"[WARNING] Fichier non trouvé après écriture : {fullPhysicalPath}");
                        return StatusCode(500, "Erreur serveur : échec de l'enregistrement");
                    }

                    // Chemin relatif stocké en base, accessible via URL publique
                    filePath = $"/uploads/{uniqueFileName}";
                }

                // Création de l'entité Ticket
                var ticket = new Ticket
                {
                    UserName = dto.UserName,
                    Requester = dto.Requester,
                    Title = dto.Title,
                    Description = dto.Description,
                    Category = dto.Category,
                    Priority = dto.Priority,
                    AttachmentPath = filePath,
                    Statut = "ouvert",
                };

                _context.Tickets.Add(ticket);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTickets), new { id = ticket.Id }, new
                {
                    id = ticket.Id,
                    attachmentPath = ticket.AttachmentPath,
                    message = filePath != null
                        ? "Ticket créé avec fichier joint"
                        : "Ticket créé sans fichier joint"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CRITICAL] Erreur globale : {ex}");
                return StatusCode(500, new
                {
                    error = "Erreur interne du serveur",
                    requestId = HttpContext.TraceIdentifier
                });
            }
        }


        // Récupérer tous les tickets avec employé et statut inclus
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetTickets()
        {
            var tickets = await _context.Tickets
                .Include(t => t.Employe)

                .ToListAsync();

            var result = tickets.Select(t => new
            {
                t.Id,
                t.Title,
                t.Description,
                t.Category,
                t.Priority,
                t.Requester,
                t.UserName,

                AssignedToId = t.AssignedToId,
                AssignedToName = t.Employe != null ? t.Employe.Nom : null,
                Statut = t.Statut,
                t.AttachmentPath
            });

            return Ok(result);
        }

        // Assigner un ticket à un employé
        [HttpPut("{ticketId}/assign/{employeId}")]
        public async Task<IActionResult> AssignTicket(int ticketId, int employeId)
        {
            var ticket = await _context.Tickets.FindAsync(ticketId);
            if (ticket == null) return NotFound("Ticket non trouvé");

            var employe = await _context.Employes.FindAsync(employeId);
            if (employe == null) return NotFound("Employé non trouvé");

            ticket.AssignedToId = employeId;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpPut("update-statut")]
        public async Task<IActionResult> UpdateStatut([FromBody] UpdateTicketStatutDto dto)
        {
            var ticket = await _context.Tickets.FindAsync(dto.Id);

            if (ticket == null)
                return NotFound("Ticket introuvable");

            ticket.Statut = dto.Statut;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Statut mis à jour avec succès" });
        }
        [HttpGet("by-user/{employeId}")]
       
        public async Task<ActionResult<IEnumerable<object>>> GetTicketsByEmploye(int employeId)
        {
            var tickets = await _context.Tickets
                .Where(t => t.AssignedToId == employeId)
                .Include(t => t.Employe)
                .ToListAsync();

            var result = tickets.Select(t => new
            {
                t.Id,
                t.Title,
                t.Description,
                t.Category,
                t.Priority,
                t.Requester,
                t.UserName,
                AssignedToId = t.AssignedToId,
                AssignedToName = t.Employe != null ? t.Employe.Nom : null,
                Statut = t.Statut,
                t.AttachmentPath
            });

            return Ok(result);
        }
        // Mettre à jour un ticket complet
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(int id, [FromBody] Ticket updatedTicket)
        {
            if (id != updatedTicket.Id)
            {
                return BadRequest("ID mismatch");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingTicket = await _context.Tickets.FindAsync(id);
            if (existingTicket == null)
            {
                return NotFound();
            }

            // Mise à jour des propriétés
            existingTicket.Title = updatedTicket.Title;
            existingTicket.Description = updatedTicket.Description;
            existingTicket.Category = updatedTicket.Category;
            existingTicket.Priority = updatedTicket.Priority;
            existingTicket.Requester = updatedTicket.Requester;
            existingTicket.UserName = updatedTicket.UserName;
            existingTicket.Statut = updatedTicket.Statut;
            existingTicket.AssignedToId= updatedTicket.AssignedToId;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(existingTicket);

            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TicketExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        private bool TicketExists(int id)
        {
            return _context.Tickets.Any(e => e.Id == id);
        }

    }
}
