namespace tiiicketing_app.model
{
    using System.Text.Json.Serialization;

    public class UpdateTicketStatutDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("statut")]
        public string Statut { get; set; }
    }


}
