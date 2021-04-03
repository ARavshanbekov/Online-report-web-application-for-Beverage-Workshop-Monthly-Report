using Microsoft.EntityFrameworkCore.Migrations;

namespace Kelechek_otchet_dlya_nachalnikov.Migrations
{
    public partial class ReportStandardsTableAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ReportItem",
                table: "ReportItem");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ReportColumn",
                table: "ReportColumn");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Report",
                table: "Report");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MonthlyBalance",
                table: "MonthlyBalance");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MemberPageByRole",
                table: "MemberPageByRole");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Member",
                table: "Member");

            migrationBuilder.RenameTable(
                name: "ReportItem",
                newName: "ReportItems");

            migrationBuilder.RenameTable(
                name: "ReportColumn",
                newName: "ReportColumns");

            migrationBuilder.RenameTable(
                name: "Report",
                newName: "Reports");

            migrationBuilder.RenameTable(
                name: "MonthlyBalance",
                newName: "MonthlyBalances");

            migrationBuilder.RenameTable(
                name: "MemberPageByRole",
                newName: "MemberPageByRoles");

            migrationBuilder.RenameTable(
                name: "Member",
                newName: "Members");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ReportItems",
                table: "ReportItems",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ReportColumns",
                table: "ReportColumns",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Reports",
                table: "Reports",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MonthlyBalances",
                table: "MonthlyBalances",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MemberPageByRoles",
                table: "MemberPageByRoles",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Members",
                table: "Members",
                column: "id");

            migrationBuilder.CreateTable(
                name: "ReportStandards",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    reportItemId = table.Column<int>(nullable: false),
                    value = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReportStandards", x => x.id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReportStandards");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Reports",
                table: "Reports");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ReportItems",
                table: "ReportItems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ReportColumns",
                table: "ReportColumns");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MonthlyBalances",
                table: "MonthlyBalances");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Members",
                table: "Members");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MemberPageByRoles",
                table: "MemberPageByRoles");

            migrationBuilder.RenameTable(
                name: "Reports",
                newName: "Report");

            migrationBuilder.RenameTable(
                name: "ReportItems",
                newName: "ReportItem");

            migrationBuilder.RenameTable(
                name: "ReportColumns",
                newName: "ReportColumn");

            migrationBuilder.RenameTable(
                name: "MonthlyBalances",
                newName: "MonthlyBalance");

            migrationBuilder.RenameTable(
                name: "Members",
                newName: "Member");

            migrationBuilder.RenameTable(
                name: "MemberPageByRoles",
                newName: "MemberPageByRole");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Report",
                table: "Report",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ReportItem",
                table: "ReportItem",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ReportColumn",
                table: "ReportColumn",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MonthlyBalance",
                table: "MonthlyBalance",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Member",
                table: "Member",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MemberPageByRole",
                table: "MemberPageByRole",
                column: "id");
        }
    }
}
