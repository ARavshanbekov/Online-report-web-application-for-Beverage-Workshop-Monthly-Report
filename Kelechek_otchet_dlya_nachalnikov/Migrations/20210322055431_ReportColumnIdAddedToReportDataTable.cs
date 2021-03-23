using Microsoft.EntityFrameworkCore.Migrations;

namespace Kelechek_otchet_dlya_nachalnikov.Migrations
{
    public partial class ReportColumnIdAddedToReportDataTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "reportColId",
                table: "ReportData");

            migrationBuilder.AddColumn<int>(
                name: "reportColumnId",
                table: "ReportData",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "reportColumnId",
                table: "ReportData");

            migrationBuilder.AddColumn<int>(
                name: "reportColId",
                table: "ReportData",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
