using Microsoft.EntityFrameworkCore.Migrations;

namespace Kelechek_otchet_dlya_nachalnikov.Migrations
{
    public partial class ColumnNamesAreCorrectedInMemberTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "name",
                table: "Member");

            migrationBuilder.DropColumn(
                name: "surname",
                table: "Member");

            migrationBuilder.AddColumn<string>(
                name: "fisrtName",
                table: "Member",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "lastNname",
                table: "Member",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "fisrtName",
                table: "Member");

            migrationBuilder.DropColumn(
                name: "lastNname",
                table: "Member");

            migrationBuilder.AddColumn<string>(
                name: "name",
                table: "Member",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "surname",
                table: "Member",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
