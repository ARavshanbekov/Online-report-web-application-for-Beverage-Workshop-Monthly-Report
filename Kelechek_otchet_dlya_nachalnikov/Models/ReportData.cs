using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kelechek_otchet_dlya_nachalnikov.Models
{
    public class ReportData
    {
        public int id { get; set; }
        public int reportId { get; set; }
        public int reportItemId { get; set; }
        public int reportColumnId { get; set; }
        public double data { get; set; }
        public int order { get; set; }

        //public virtual Report Report { get; set; }
        //public virtual ReportColumn ReportColumn { get; set; }
        //public virtual ReportItem ReportItem { get; set; }
    }
}
