﻿    using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kelechek_otchet_dlya_nachalnikov.Models
{
    public class ResponsibleArea
    {
        public ResponsibleArea()
        {
            MonthlyBalances = new HashSet<MonthlyBalance>();
            ReportColumns = new HashSet<ReportColumn>();
            ReportItems = new HashSet<ReportItem>();
            ReportStandards = new HashSet<ReportStandard>();
            Reports = new HashSet<Report>();
        }

        public int id { get; set; }
        public string name { get; set; }
        public int? memberId { get; set; }

        public virtual Member Member { get; set; }
        public virtual ICollection<MonthlyBalance> MonthlyBalances { get; set; }
        public virtual ICollection<ReportColumn> ReportColumns { get; set; }
        public virtual ICollection<ReportItem> ReportItems { get; set; }
        public virtual ICollection<ReportStandard> ReportStandards { get; set; }
        public virtual ICollection<Report> Reports { get; set; }
    }
}
