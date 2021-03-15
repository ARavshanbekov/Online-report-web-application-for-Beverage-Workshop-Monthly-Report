using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kelechek_otchet_dlya_nachalnikov.Models
{
    public class ReportItem
    {
        public int id { get; set; }
        public int ReportID { get; set; }        
        public String Name { get; set; }
        public String Unit { get; set; }

        //public Report Report { get; set; }
        //public ICollection<ReportData> reportDatas { get; set; }
    }
}
