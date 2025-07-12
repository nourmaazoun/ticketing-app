namespace tiiicketing_app.model
{
    public class Employe
    {
        public int Id { get; set; } // Clé primaire
        public string Nom { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Motdepasse { get; set; } = string.Empty;


        // Optionnel : si tu veux relier les tickets à cet employé
        public ICollection<Ticket>? Tickets { get; set; }
    }
}
