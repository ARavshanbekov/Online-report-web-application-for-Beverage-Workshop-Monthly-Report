﻿using Microsoft.EntityFrameworkCore.Migrations;

namespace Kelechek_otchet_dlya_nachalnikov.Migrations
{
    public partial class responsibleAreaIdColumnAddedToReportColumnTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "responsibleAreaId",
                table: "ReportColumn",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "responsibleAreaId",
                table: "ReportColumn");
        }
    }
}
