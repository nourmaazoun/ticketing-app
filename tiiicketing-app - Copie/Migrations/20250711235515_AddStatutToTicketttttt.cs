using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace tiiicketing_app.Migrations
{
    /// <inheritdoc />
    public partial class AddStatutToTicketttttt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AssignedToId",
                table: "Tickets",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssignedToId",
                table: "Tickets");
        }
    }
}
