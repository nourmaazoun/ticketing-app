using Microsoft.AspNetCore.Mvc;

namespace tiiicketing_app.model
{
    public class TicketFormDto
    {
        public string UserName { get; set; }
        public string Requester { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Priority { get; set; }

      
        public IFormFile? File { get; set; }

    }
}
