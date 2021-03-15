using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kelechek_otchet_dlya_nachalnikov.Models
{
    public class MemberPageByRole
    {
        public int id { get; set; }
        public int memberId { get; set; }
        public String pageTitle { get; set; }
        public String pageAccessPath { get; set; }
    }
}
