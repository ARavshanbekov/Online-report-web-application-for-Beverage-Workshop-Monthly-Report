using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Kelechek_otchet_dlya_nachalnikov.Models;

namespace Kelechek_otchet_dlya_nachalnikov.Data
{
    public class Kelechek_otchet_dlya_nachalnikovContext : DbContext
    {
        public Kelechek_otchet_dlya_nachalnikovContext (DbContextOptions<Kelechek_otchet_dlya_nachalnikovContext> options)
            : base(options)
        {
        }

        public DbSet<Kelechek_otchet_dlya_nachalnikov.Models.Member> Members { get; set; }
        public DbSet<Kelechek_otchet_dlya_nachalnikov.Models.Report> Reports { get; set; }
        public DbSet<Kelechek_otchet_dlya_nachalnikov.Models.ReportColumn> ReportColumns { get; set; }
        public DbSet<Kelechek_otchet_dlya_nachalnikov.Models.ReportData> ReportData { get; set; }
        public DbSet<Kelechek_otchet_dlya_nachalnikov.Models.ReportItem> ReportItems { get; set; }
        public DbSet<Kelechek_otchet_dlya_nachalnikov.Models.ResponsibleArea> ResponsibleAreas { get; set; }
        public DbSet<Kelechek_otchet_dlya_nachalnikov.Models.MonthlyBalance> MonthlyBalances { get; set; }        
        public DbSet<Kelechek_otchet_dlya_nachalnikov.Models.ReportStandard> ReportStandards { get; set; }
    }
}
