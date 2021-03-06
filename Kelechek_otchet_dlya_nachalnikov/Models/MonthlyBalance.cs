using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kelechek_otchet_dlya_nachalnikov.Models
{
    public class MonthlyBalance
    {
        public int id { get; set; }
        public double initialBalance { get; set; }
        public double residualBalance { get; set; }
        public int order { get; set; }
        public DateTime date { get; set; }
        public int? memberId { get; set; }
        public int? responsibleAreaId { get; set; }
        public int? reportId { get; set; }
        public int? reportItemId { get; set; }

        public virtual Member Member { get; set; }
        public virtual Report Report { get; set; }
        public virtual ReportItem ReportItem { get; set; }
        public virtual ResponsibleArea ResponsibleArea { get; set; }
    }
}
