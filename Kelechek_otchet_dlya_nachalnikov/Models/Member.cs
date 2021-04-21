using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kelechek_otchet_dlya_nachalnikov.Models
{
    public class Member
    {
        public Member()
        {
            MonthlyBalances = new HashSet<MonthlyBalance>();
            Reports = new HashSet<Report>();
            ResponsibleAreas = new HashSet<ResponsibleArea>();
        }

        public int id { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string phoneNumber { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string token { get; set; }
        public string memberType { get; set; }

        public virtual ICollection<MonthlyBalance> MonthlyBalances { get; set; }
        public virtual ICollection<Report> Reports { get; set; }
        public virtual ICollection<ResponsibleArea> ResponsibleAreas { get; set; }

    }
}
