using Microsoft.EntityFrameworkCore.Migrations;

namespace Kelechek_otchet_dlya_nachalnikov.Migrations
{
    public partial class IdWithSmallLetter : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ID",
                table: "ReportItem",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "ID",
                table: "ReportData",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "ID",
                table: "ReportColumn",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "ID",
                table: "Report",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Member",
                newName: "username");

            migrationBuilder.RenameColumn(
                name: "Surname",
                table: "Member",
                newName: "surname");

            migrationBuilder.RenameColumn(
                name: "PhoneNumber",
                table: "Member",
                newName: "phoneNumber");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "Member",
                newName: "password");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Member",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "ID",
                table: "Member",
                newName: "id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "id",
                table: "ReportItem",
                newName: "ID");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "ReportData",
                newName: "ID");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "ReportColumn",
                newName: "ID");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Report",
                newName: "ID");

            migrationBuilder.RenameColumn(
                name: "username",
                table: "Member",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "surname",
                table: "Member",
                newName: "Surname");

            migrationBuilder.RenameColumn(
                name: "phoneNumber",
                table: "Member",
                newName: "PhoneNumber");

            migrationBuilder.RenameColumn(
                name: "password",
                table: "Member",
                newName: "Password");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Member",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Member",
                newName: "ID");
        }
    }
}
