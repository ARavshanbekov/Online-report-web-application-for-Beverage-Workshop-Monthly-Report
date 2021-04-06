using Microsoft.EntityFrameworkCore.Migrations;

namespace Kelechek_otchet_dlya_nachalnikov.Migrations
{
    public partial class ColumnNamesAreNormalized : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MemberPageByRoles");

            migrationBuilder.RenameColumn(
                name: "responsibleAreaID",
                table: "Reports",
                newName: "responsibleAreaId");

            migrationBuilder.RenameColumn(
                name: "memberID",
                table: "Reports",
                newName: "memberId");

            migrationBuilder.RenameColumn(
                name: "responsibleAreaID",
                table: "MonthlyBalances",
                newName: "responsibleAreaId");

            migrationBuilder.RenameColumn(
                name: "reportItemID",
                table: "MonthlyBalances",
                newName: "reportItemId");

            migrationBuilder.RenameColumn(
                name: "reportID",
                table: "MonthlyBalances",
                newName: "reportId");

            migrationBuilder.RenameColumn(
                name: "memberID",
                table: "MonthlyBalances",
                newName: "memberId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "responsibleAreaId",
                table: "Reports",
                newName: "responsibleAreaID");

            migrationBuilder.RenameColumn(
                name: "memberId",
                table: "Reports",
                newName: "memberID");

            migrationBuilder.RenameColumn(
                name: "responsibleAreaId",
                table: "MonthlyBalances",
                newName: "responsibleAreaID");

            migrationBuilder.RenameColumn(
                name: "reportItemId",
                table: "MonthlyBalances",
                newName: "reportItemID");

            migrationBuilder.RenameColumn(
                name: "reportId",
                table: "MonthlyBalances",
                newName: "reportID");

            migrationBuilder.RenameColumn(
                name: "memberId",
                table: "MonthlyBalances",
                newName: "memberID");

            migrationBuilder.CreateTable(
                name: "MemberPageByRoles",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    memberId = table.Column<int>(type: "int", nullable: false),
                    pageAccessPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    pageTitle = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MemberPageByRoles", x => x.id);
                });
        }
    }
}
