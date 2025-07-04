using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
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

        // Créer un ticket
        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromBody] Ticket ticket)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTicket), new { id = ticket.Id }, ticket);
        }

        // Récupérer un ticket par id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicket(int id)
        {
            var ticket = await _context.Tickets
                .Include(t => t.Employe)

                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null)
                return NotFound();

            return Ok(new
            {
                ticket.Id,
                ticket.Title,
                ticket.Description,
                ticket.Category,
                ticket.Priority,
                ticket.Requester,
                ticket.UserName
               ,
                AssignedToId = ticket.EmployeId,
                AssignedToName = ticket.Employe?.Nom,
                Statut = ticket.Statut
            });
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

                AssignedToId = t.EmployeId,
                AssignedToName = t.Employe != null ? t.Employe.Nom : null,
                Statut = t.Statut
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

            ticket.EmployeId = employeId;
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
                .Where(t => t.EmployeId == employeId)
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
                AssignedToId = t.EmployeId,
                AssignedToName = t.Employe != null ? t.Employe.Nom : null,
                Statut = t.Statut
            });

            return Ok(result);
        }


    }
}
