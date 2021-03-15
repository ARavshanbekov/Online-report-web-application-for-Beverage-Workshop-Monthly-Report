using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kelechek_otchet_dlya_nachalnikov.Models
{
    public class ReportColumn
    {
        public int id { get; set; }
        public int ReportID { get; set; }
        public String Name { get; set; }
        public int Order { get; set; }

        //public virtual Report Report { get; set; }
        //public virtual ReportData ReportData { get; set; }
    }
}
