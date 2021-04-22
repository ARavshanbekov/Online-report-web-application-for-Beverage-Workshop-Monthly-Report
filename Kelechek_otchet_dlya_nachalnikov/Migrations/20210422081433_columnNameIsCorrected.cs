using Microsoft.EntityFrameworkCore.Migrations;

namespace Kelechek_otchet_dlya_nachalnikov.Migrations
{
    public partial class columnNameIsCorrected : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "atatus",
                table: "Reports");

            migrationBuilder.AddColumn<bool>(
                name: "status",
                table: "Reports",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "status",
                table: "Reports");

            migrationBuilder.AddColumn<bool>(
                name: "atatus",
                table: "Reports",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
