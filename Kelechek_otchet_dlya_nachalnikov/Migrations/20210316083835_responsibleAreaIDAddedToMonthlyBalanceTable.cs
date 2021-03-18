using Microsoft.EntityFrameworkCore.Migrations;

namespace Kelechek_otchet_dlya_nachalnikov.Migrations
{
    public partial class responsibleAreaIDAddedToMonthlyBalanceTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "reportID",
                table: "MonthlyBalance");

            migrationBuilder.AddColumn<int>(
                name: "ReportColID",
                table: "ReportData",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "responsibleAreaID",
                table: "MonthlyBalance",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReportColID",
                table: "ReportData");

            migrationBuilder.DropColumn(
                name: "responsibleAreaID",
                table: "MonthlyBalance");

            migrationBuilder.AddColumn<int>(
                name: "reportID",
                table: "MonthlyBalance",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
