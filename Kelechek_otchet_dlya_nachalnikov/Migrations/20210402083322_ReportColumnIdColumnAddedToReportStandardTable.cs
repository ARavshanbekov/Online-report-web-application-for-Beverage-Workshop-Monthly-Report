using Microsoft.EntityFrameworkCore.Migrations;

namespace Kelechek_otchet_dlya_nachalnikov.Migrations
{
    public partial class ReportColumnIdColumnAddedToReportStandardTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "reportColumnId",
                table: "ReportStandards",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "responsibleAreaId",
                table: "ReportStandards",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "reportColumnId",
                table: "ReportStandards");

            migrationBuilder.DropColumn(
                name: "responsibleAreaId",
                table: "ReportStandards");
        }
    }
}
