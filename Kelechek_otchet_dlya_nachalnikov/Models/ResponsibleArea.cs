    using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kelechek_otchet_dlya_nachalnikov.Models
{
    public class ResponsibleArea
    {
        public int id { get; set; }
        public int memberId { get; set; }
        public String name { get; set; }
        
        //public Member Member { get; set; }
        //public ICollection<Report> Reports { get; set; }
    }
}
