using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kelechek_otchet_dlya_nachalnikov.Models
{
    public class TermoplastIVyduv
    {
        public int id { get; set; }
        public int ResponsibleAreaID { get; set; }
        public DateTime Date { get; set; }
        public String Title { get; set; }
        public String ResponsibleAreaName { get; set; }
    }
}
