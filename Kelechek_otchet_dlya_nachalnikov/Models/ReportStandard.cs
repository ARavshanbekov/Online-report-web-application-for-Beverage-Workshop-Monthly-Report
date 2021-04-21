using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kelechek_otchet_dlya_nachalnikov.Models
{
    public class ReportStandard
    {
        public int id { get; set; }
        public double value { get; set; }
        public int? reportItemId { get; set; }
        public int? reportColumnId { get; set; }
        public int? responsibleAreaId { get; set; }

        public virtual ReportColumn ReportColumn { get; set; }
        public virtual ReportItem ReportItem { get; set; }
        public virtual ResponsibleArea ResponsibleArea { get; set; }
    }
}
