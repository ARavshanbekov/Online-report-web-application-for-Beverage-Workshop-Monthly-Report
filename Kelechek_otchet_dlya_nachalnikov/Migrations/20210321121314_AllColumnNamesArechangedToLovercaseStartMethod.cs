using Microsoft.EntityFrameworkCore.Migrations;

namespace Kelechek_otchet_dlya_nachalnikov.Migrations
{
    public partial class AllColumnNamesArechangedToLovercaseStartMethod : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "ResponsibleAreas",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "MemberID",
                table: "ResponsibleAreas",
                newName: "memberId");

            migrationBuilder.RenameColumn(
                name: "Unit",
                table: "ReportItem",
                newName: "unit");

            migrationBuilder.RenameColumn(
                name: "ReportID",
                table: "ReportItem",
                newName: "reportId");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "ReportItem",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "ReportItemID",
                table: "ReportData",
                newName: "reportItemId");

            migrationBuilder.RenameColumn(
                name: "ReportID",
                table: "ReportData",
                newName: "reportId");

            migrationBuilder.RenameColumn(
                name: "ReportColID",
                table: "ReportData",
                newName: "reportColId");

            migrationBuilder.RenameColumn(
                name: "Order",
                table: "ReportData",
                newName: "order");

            migrationBuilder.RenameColumn(
                name: "Data",
                table: "ReportData",
                newName: "data");

            migrationBuilder.RenameColumn(
                name: "ReportID",
                table: "ReportColumn",
                newName: "reportId");

            migrationBuilder.RenameColumn(
                name: "Order",
                table: "ReportColumn",
                newName: "order");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "ReportColumn",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "CalculationSign",
                table: "ReportColumn",
                newName: "calculationSign");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Report",
                newName: "title");

            migrationBuilder.RenameColumn(
                name: "ResponsibleAreaID",
                table: "Report",
                newName: "responsibleAreaID");

            migrationBuilder.RenameColumn(
                name: "MemberID",
                table: "Report",
                newName: "memberID");

            migrationBuilder.RenameColumn(
                name: "Date",
                table: "Report",
                newName: "date");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "name",
                table: "ResponsibleAreas",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "memberId",
                table: "ResponsibleAreas",
                newName: "MemberID");

            migrationBuilder.RenameColumn(
                name: "unit",
                table: "ReportItem",
                newName: "Unit");

            migrationBuilder.RenameColumn(
                name: "reportId",
                table: "ReportItem",
                newName: "ReportID");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "ReportItem",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "reportItemId",
                table: "ReportData",
                newName: "ReportItemID");

            migrationBuilder.RenameColumn(
                name: "reportId",
                table: "ReportData",
                newName: "ReportID");

            migrationBuilder.RenameColumn(
                name: "reportColId",
                table: "ReportData",
                newName: "ReportColID");

            migrationBuilder.RenameColumn(
                name: "order",
                table: "ReportData",
                newName: "Order");

            migrationBuilder.RenameColumn(
                name: "data",
                table: "ReportData",
                newName: "Data");

            migrationBuilder.RenameColumn(
                name: "reportId",
                table: "ReportColumn",
                newName: "ReportID");

            migrationBuilder.RenameColumn(
                name: "order",
                table: "ReportColumn",
                newName: "Order");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "ReportColumn",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "calculationSign",
                table: "ReportColumn",
                newName: "CalculationSign");

            migrationBuilder.RenameColumn(
                name: "title",
                table: "Report",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "responsibleAreaID",
                table: "Report",
                newName: "ResponsibleAreaID");

            migrationBuilder.RenameColumn(
                name: "memberID",
                table: "Report",
                newName: "MemberID");

            migrationBuilder.RenameColumn(
                name: "date",
                table: "Report",
                newName: "Date");
        }
    }
}
