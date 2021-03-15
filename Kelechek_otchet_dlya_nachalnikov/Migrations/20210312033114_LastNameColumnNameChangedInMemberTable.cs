using Microsoft.EntityFrameworkCore.Migrations;

namespace Kelechek_otchet_dlya_nachalnikov.Migrations
{
    public partial class LastNameColumnNameChangedInMemberTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "lastNname",
                table: "Member");

            migrationBuilder.AddColumn<string>(
                name: "lastName",
                table: "Member",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "lastName",
                table: "Member");

            migrationBuilder.AddColumn<string>(
                name: "lastNname",
                table: "Member",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
