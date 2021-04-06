using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kelechek_otchet_dlya_nachalnikov.Models
{
    public class TermoplastIVyduv
    {
        public int id { get; set; }
        public int responsibleAreaId { get; set; }
        public DateTime date { get; set; }
        public String title { get; set; }
        public String responsibleAreaName { get; set; }
    }
}
