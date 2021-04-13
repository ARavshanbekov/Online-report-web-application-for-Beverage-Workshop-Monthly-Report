using Microsoft.EntityFrameworkCore.Migrations;

namespace Kelechek_otchet_dlya_nachalnikov.Migrations
{
    public partial class MemberTypesAreChangedInMembersTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<short>(
                name: "memberType",
                table: "Members",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "memberType",
                table: "Members",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(short));
        }
    }
}
