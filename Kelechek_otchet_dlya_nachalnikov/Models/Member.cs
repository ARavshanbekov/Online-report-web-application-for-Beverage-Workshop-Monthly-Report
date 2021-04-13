using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kelechek_otchet_dlya_nachalnikov.Models
{
    public class Member
    {
        public int id { get; set; }
        public String firstName { get; set; }        
        public String lastName { get; set; }
        public String phoneNumber { get; set; }
        public String username { get; set; }
        public String password { get; set; }
        public String token { get; set; }
        public String memberType { get; set; }

    }
}
