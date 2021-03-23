using Microsoft.EntityFrameworkCore.Migrations;

namespace Kelechek_otchet_dlya_nachalnikov.Migrations
{
    public partial class reportIdColumnRemoverdFromReportColumnTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "reportId",
                table: "ReportColumn");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "reportId",
                table: "ReportColumn",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
