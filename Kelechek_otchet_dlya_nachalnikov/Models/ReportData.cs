using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kelechek_otchet_dlya_nachalnikov.Models
{
    public class ReportData
    {
        public int id { get; set; }
        public int ReportID { get; set; }
        public int ReportItemID { get; set; }
        public int ReportColID { get; set; }
        public String Data { get; set; }
        public int Order { get; set; }

        //public virtual Report Report { get; set; }
        //public virtual ReportColumn ReportColumn { get; set; }
        //public virtual ReportItem ReportItem { get; set; }
    }
}
