using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace tiiicketing_app.Migrations
{
    /// <inheritdoc />
    public partial class AddAttachmentPathToTicket : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AttachmentPath",
                table: "Tickets",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AttachmentPath",
                table: "Tickets");
        }
    }
}
