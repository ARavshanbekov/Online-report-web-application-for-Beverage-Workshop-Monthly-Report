﻿// <auto-generated />
using System;
using Kelechek_otchet_dlya_nachalnikov.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Kelechek_otchet_dlya_nachalnikov.Migrations
{
    [DbContext(typeof(Kelechek_otchet_dlya_nachalnikovContext))]
    [Migration("20210422085050_jsonIgnoreAdded")]
    partial class jsonIgnoreAdded
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.13")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Kelechek_otchet_dlya_nachalnikov.Models.Member", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("firstName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("lastName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("memberType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("password")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("phoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("token")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("username")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("id");

                    b.ToTable("Members");
                });

            modelBuilder.Entity("Kelechek_otchet_dlya_nachalnikov.Models.MonthlyBalance", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("date")
                        .HasColumnType("datetime2");

                    b.Property<double>("initialBalance")
                        .HasColumnType("float");

                    b.Property<int?>("memberId")
                        .HasColumnType("int");

                    b.Property<int>("order")
                        .HasColumnType("int");

                    b.Property<int?>("reportId")
                        .HasColumnType("int");

                    b.Property<int?>("reportItemId")
                        .HasColumnType("int");

                    b.Property<double>("residualBalance")
                        .HasColumnType("float");

                    b.Property<int?>("responsibleAreaId")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.HasIndex("memberId");

                    b.HasIndex("reportId");

                    b.HasIndex("reportItemId");

                    b.HasIndex("responsibleAreaId");

                    b.ToTable("MonthlyBalances");
                });

            modelBuilder.Entity("Kelechek_otchet_dlya_nachalnikov.Models.Report", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("date")
                        .HasColumnType("datetime2");

                    b.Property<int?>("memberId")
                        .HasColumnType("int");

                    b.Property<int?>("responsibleAreaId")
                        .HasColumnType("int");

                    b.Property<bool>("status")
                        .HasColumnType("bit");

                    b.Property<string>("title")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("id");

                    b.HasIndex("memberId");

                    b.HasIndex("responsibleAreaId");

                    b.ToTable("Reports");
                });

            modelBuilder.Entity("Kelechek_otchet_dlya_nachalnikov.Models.ReportColumn", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("order")
                        .HasColumnType("int");

                    b.Property<int?>("responsibleAreaId")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.HasIndex("responsibleAreaId");

                    b.ToTable("ReportColumns");
                });

            modelBuilder.Entity("Kelechek_otchet_dlya_nachalnikov.Models.ReportData", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<double>("data")
                        .HasColumnType("float");

                    b.Property<int>("order")
                        .HasColumnType("int");

                    b.Property<int?>("reportColumnId")
                        .HasColumnType("int");

                    b.Property<int?>("reportId")
                        .HasColumnType("int");

                    b.Property<int?>("reportItemId")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.HasIndex("reportColumnId");

                    b.HasIndex("reportId");

                    b.HasIndex("reportItemId");

                    b.ToTable("ReportData");
                });

            modelBuilder.Entity("Kelechek_otchet_dlya_nachalnikov.Models.ReportItem", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("order")
                        .HasColumnType("int");

                    b.Property<int?>("responsibleAreaId")
                        .HasColumnType("int");

                    b.Property<string>("unit")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("id");

                    b.HasIndex("responsibleAreaId");

                    b.ToTable("ReportItems");
                });

            modelBuilder.Entity("Kelechek_otchet_dlya_nachalnikov.Models.ReportStandard", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("reportColumnId")
                        .HasColumnType("int");

                    b.Property<int?>("reportItemId")
                        .HasColumnType("int");

                    b.Property<int?>("responsibleAreaId")
                        .HasColumnType("int");

                    b.Property<double>("value")
                        .HasColumnType("float");

                    b.HasKey("id");

                    b.HasIndex("reportColumnId");

                    b.HasIndex("reportItemId");

                    b.HasIndex("responsibleAreaId");

                    b.ToTable("ReportStandards");
                });

            modelBuilder.Entity("Kelechek_otchet_dlya_nachalnikov.Models.ResponsibleArea", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("memberId")
                        .HasColumnType("int");

                    b.Property<string>("name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("id");

                    b.HasIndex("memberId");

                    b.ToTable("ResponsibleAreas");
                });

            modelBuilder.Entity("Kelechek_otchet_dlya_nachalnikov.Models.MonthlyBalance", b =>
                {
                    b.HasOne("Kelechek_otchet_dlya_nachalnikov.Models.Member", "Member")
                        .WithMany("MonthlyBalances")
                        .HasForeignKey("memberId");

                    b.HasOne("Kelechek_otchet_dlya_nachalnikov.Models.Report", "Report")
                        .WithMany("MonthlyBalances")
                        .HasForeignKey("reportId");

                    b.HasOne("Kelechek_otchet_dlya_nachalnikov.Models.ReportItem", "ReportItem")
                        .WithMany("MonthlyBalances")
                        .HasForeignKey("reportItemId");

                    b.HasOne("Kelechek_otchet_dlya_nachalnikov.Models.ResponsibleArea", "ResponsibleArea")
                        .WithMany("MonthlyBalances")
                        .HasForeignKey("responsibleAreaId");
                });

            modelBuilder.Entity("Kelechek_otchet_dlya_nachalnikov.Models.Report", b =>
                {
                    b.HasOne("Kelechek_otchet_dlya_nachalnikov.Models.Member", "Members")
                        .WithMany("Reports")
                        .HasForeignKey("memberId");

                    b.HasOne("Kelechek_otchet_dlya_nachalnikov.Models.ResponsibleArea", "ResponsibleArea")
                        .WithMany("Reports")
                        .HasForeignKey("responsibleAreaId");
                });

            modelBuilder.Entity("Kelechek_otchet_dlya_nachalnikov.Models.ReportColumn", b =>
                {
                    b.HasOne("Kelechek_otchet_dlya_nachalnikov.Models.ResponsibleArea", "ResponsibleArea")
                        .WithMany("ReportColumns")
                        .HasForeignKey("responsibleAreaId");
                });

            modelBuilder.Entity("Kelechek_otchet_dlya_nachalnikov.Models.ReportData", b =>
                {
                    b.HasOne("Kelechek_otchet_dlya_nachalnikov.Models.ReportColumn", "ReportColumn")
                        .WithMany("ReportDatas")
                        .HasForeignKey("reportColumnId");

                    b.HasOne("Kelechek_otchet_dlya_nachalnikov.Models.Report", "Report")
                        .WithMany("ReportDatas")
                        .HasForeignKey("reportId");

                    b.HasOne("Kelechek_otchet_dlya_nachalnikov.Models.ReportItem", "ReportItem")
                        .WithMany("ReportDatas")
                        .HasForeignKey("reportItemId");
                });

            modelBuilder.Entity("Kelechek_otchet_dlya_nachalnikov.Models.ReportItem", b =>
                {
                    b.HasOne("Kelechek_otchet_dlya_nachalnikov.Models.ResponsibleArea", "ResponsibleArea")
                        .WithMany("ReportItems")
                        .HasForeignKey("responsibleAreaId");
                });

            modelBuilder.Entity("Kelechek_otchet_dlya_nachalnikov.Models.ReportStandard", b =>
                {
                    b.HasOne("Kelechek_otchet_dlya_nachalnikov.Models.ReportColumn", "ReportColumn")
                        .WithMany("ReportStandards")
                        .HasForeignKey("reportColumnId");

                    b.HasOne("Kelechek_otchet_dlya_nachalnikov.Models.ReportItem", "ReportItem")
                        .WithMany("ReportStandards")
                        .HasForeignKey("reportItemId");

                    b.HasOne("Kelechek_otchet_dlya_nachalnikov.Models.ResponsibleArea", "ResponsibleArea")
                        .WithMany("ReportStandards")
                        .HasForeignKey("responsibleAreaId");
                });

            modelBuilder.Entity("Kelechek_otchet_dlya_nachalnikov.Models.ResponsibleArea", b =>
                {
                    b.HasOne("Kelechek_otchet_dlya_nachalnikov.Models.Member", "Member")
                        .WithMany("ResponsibleAreas")
                        .HasForeignKey("memberId");
                });
#pragma warning restore 612, 618
        }
    }
}
