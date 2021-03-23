using Microsoft.EntityFrameworkCore.Migrations;

namespace Kelechek_otchet_dlya_nachalnikov.Migrations
{
    public partial class ReportIdColumnRemovedResponsibleAreIdColumnAddedToReportItemTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "reportId",
                table: "ReportItem");

            migrationBuilder.AddColumn<int>(
                name: "responsibleAreaId",
                table: "ReportItem",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "responsibleAreaId",
                table: "ReportItem");

            migrationBuilder.AddColumn<int>(
                name: "reportId",
                table: "ReportItem",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
