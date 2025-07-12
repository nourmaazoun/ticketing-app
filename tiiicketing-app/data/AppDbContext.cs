using Microsoft.EntityFrameworkCore;
using tiiicketing_app.model;


namespace tiiicketing_app.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Employe> Employes { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuration supplémentaire des modèles
            modelBuilder.Entity<Ticket>()
                .Property(t => t.Title)
                .HasMaxLength(100);
        }
    }
}