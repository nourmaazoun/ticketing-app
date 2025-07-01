namespace tiiicketing_app.model
{
    public class Ticket
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Category { get; set; }
        public string? Priority { get; set; }
        public string? Requester { get; set; }
        public string? UserName { get; set; }

        // Clé étrangère vers Employe (nullable si ticket non assigné)
        public int? EmployeId { get; set; }

        // Propriété de navigation vers l'employé assigné
        public Employe? Employe { get; set; }
    }
}
