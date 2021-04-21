using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Kelechek_otchet_dlya_nachalnikov.Migrations
{
    public partial class initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Members",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    firstName = table.Column<string>(nullable: true),
                    lastName = table.Column<string>(nullable: true),
                    phoneNumber = table.Column<string>(nullable: true),
                    username = table.Column<string>(nullable: true),
                    password = table.Column<string>(nullable: true),
                    token = table.Column<string>(nullable: true),
                    memberType = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Members", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ResponsibleAreas",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(nullable: true),
                    memberId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResponsibleAreas", x => x.id);
                    table.ForeignKey(
                        name: "FK_ResponsibleAreas_Members_memberId",
                        column: x => x.memberId,
                        principalTable: "Members",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ReportColumns",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(nullable: true),
                    order = table.Column<int>(nullable: false),
                    responsibleAreaId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReportColumns", x => x.id);
                    table.ForeignKey(
                        name: "FK_ReportColumns_ResponsibleAreas_responsibleAreaId",
                        column: x => x.responsibleAreaId,
                        principalTable: "ResponsibleAreas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ReportItems",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(nullable: true),
                    unit = table.Column<string>(nullable: true),
                    order = table.Column<int>(nullable: false),
                    responsibleAreaId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReportItems", x => x.id);
                    table.ForeignKey(
                        name: "FK_ReportItems_ResponsibleAreas_responsibleAreaId",
                        column: x => x.responsibleAreaId,
                        principalTable: "ResponsibleAreas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Reports",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    date = table.Column<DateTime>(nullable: false),
                    title = table.Column<string>(nullable: true),
                    atatus = table.Column<bool>(nullable: false),
                    responsibleAreaId = table.Column<int>(nullable: true),
                    memberId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reports", x => x.id);
                    table.ForeignKey(
                        name: "FK_Reports_Members_memberId",
                        column: x => x.memberId,
                        principalTable: "Members",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Reports_ResponsibleAreas_responsibleAreaId",
                        column: x => x.responsibleAreaId,
                        principalTable: "ResponsibleAreas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ReportStandards",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    value = table.Column<double>(nullable: false),
                    reportItemId = table.Column<int>(nullable: true),
                    reportColumnId = table.Column<int>(nullable: true),
                    responsibleAreaId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReportStandards", x => x.id);
                    table.ForeignKey(
                        name: "FK_ReportStandards_ReportColumns_reportColumnId",
                        column: x => x.reportColumnId,
                        principalTable: "ReportColumns",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReportStandards_ReportItems_reportItemId",
                        column: x => x.reportItemId,
                        principalTable: "ReportItems",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReportStandards_ResponsibleAreas_responsibleAreaId",
                        column: x => x.responsibleAreaId,
                        principalTable: "ResponsibleAreas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MonthlyBalances",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    initialBalance = table.Column<double>(nullable: false),
                    residualBalance = table.Column<double>(nullable: false),
                    order = table.Column<int>(nullable: false),
                    date = table.Column<DateTime>(nullable: false),
                    memberId = table.Column<int>(nullable: true),
                    responsibleAreaId = table.Column<int>(nullable: true),
                    reportId = table.Column<int>(nullable: true),
                    reportItemId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MonthlyBalances", x => x.id);
                    table.ForeignKey(
                        name: "FK_MonthlyBalances_Members_memberId",
                        column: x => x.memberId,
                        principalTable: "Members",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MonthlyBalances_Reports_reportId",
                        column: x => x.reportId,
                        principalTable: "Reports",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MonthlyBalances_ReportItems_reportItemId",
                        column: x => x.reportItemId,
                        principalTable: "ReportItems",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MonthlyBalances_ResponsibleAreas_responsibleAreaId",
                        column: x => x.responsibleAreaId,
                        principalTable: "ResponsibleAreas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ReportData",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    data = table.Column<double>(nullable: false),
                    order = table.Column<int>(nullable: false),
                    reportId = table.Column<int>(nullable: true),
                    reportItemId = table.Column<int>(nullable: true),
                    reportColumnId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReportData", x => x.id);
                    table.ForeignKey(
                        name: "FK_ReportData_ReportColumns_reportColumnId",
                        column: x => x.reportColumnId,
                        principalTable: "ReportColumns",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReportData_Reports_reportId",
                        column: x => x.reportId,
                        principalTable: "Reports",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReportData_ReportItems_reportItemId",
                        column: x => x.reportItemId,
                        principalTable: "ReportItems",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MonthlyBalances_memberId",
                table: "MonthlyBalances",
                column: "memberId");

            migrationBuilder.CreateIndex(
                name: "IX_MonthlyBalances_reportId",
                table: "MonthlyBalances",
                column: "reportId");

            migrationBuilder.CreateIndex(
                name: "IX_MonthlyBalances_reportItemId",
                table: "MonthlyBalances",
                column: "reportItemId");

            migrationBuilder.CreateIndex(
                name: "IX_MonthlyBalances_responsibleAreaId",
                table: "MonthlyBalances",
                column: "responsibleAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportColumns_responsibleAreaId",
                table: "ReportColumns",
                column: "responsibleAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportData_reportColumnId",
                table: "ReportData",
                column: "reportColumnId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportData_reportId",
                table: "ReportData",
                column: "reportId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportData_reportItemId",
                table: "ReportData",
                column: "reportItemId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportItems_responsibleAreaId",
                table: "ReportItems",
                column: "responsibleAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_memberId",
                table: "Reports",
                column: "memberId");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_responsibleAreaId",
                table: "Reports",
                column: "responsibleAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportStandards_reportColumnId",
                table: "ReportStandards",
                column: "reportColumnId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportStandards_reportItemId",
                table: "ReportStandards",
                column: "reportItemId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportStandards_responsibleAreaId",
                table: "ReportStandards",
                column: "responsibleAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_ResponsibleAreas_memberId",
                table: "ResponsibleAreas",
                column: "memberId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MonthlyBalances");

            migrationBuilder.DropTable(
                name: "ReportData");

            migrationBuilder.DropTable(
                name: "ReportStandards");

            migrationBuilder.DropTable(
                name: "Reports");

            migrationBuilder.DropTable(
                name: "ReportColumns");

            migrationBuilder.DropTable(
                name: "ReportItems");

            migrationBuilder.DropTable(
                name: "ResponsibleAreas");

            migrationBuilder.DropTable(
                name: "Members");
        }
    }
}
