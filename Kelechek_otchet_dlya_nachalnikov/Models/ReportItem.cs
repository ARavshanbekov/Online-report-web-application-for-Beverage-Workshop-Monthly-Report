using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kelechek_otchet_dlya_nachalnikov.Models
{
    public class ReportItem
    {
        public int id { get; set; }        
        public String name { get; set; }
        public String unit { get; set; }
        public int responsibleAreaId { get; set; }
        public int order { get; set; }

        //public Report Report { get; set; }
        //public ICollection<ReportData> reportDatas { get; set; }
    }
}
