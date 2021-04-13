using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kelechek_otchet_dlya_nachalnikov.Models
{
    public class ReportColumn
    {
        public int id { get; set; }        
        public String name { get; set; }
        public int order { get; set; }
        public String calculationSign { get; set; }
        public int responsibleAreaId { get; set; }
    }
}
