using Microsoft.EntityFrameworkCore.Migrations;

namespace Kelechek_otchet_dlya_nachalnikov.Migrations
{
    public partial class FirstNameColumnNameChangedInMemberTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "fisrtName",
                table: "Member");

            migrationBuilder.AddColumn<string>(
                name: "firstName",
                table: "Member",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "firstName",
                table: "Member");

            migrationBuilder.AddColumn<string>(
                name: "fisrtName",
                table: "Member",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
