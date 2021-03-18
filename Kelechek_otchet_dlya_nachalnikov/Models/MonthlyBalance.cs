using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kelechek_otchet_dlya_nachalnikov.Models
{
    public class MonthlyBalance
    {
        public int id { get; set; }
        public int memberID { get; set; }
        public int responsibleAreaID { get; set; }
        public int reportID { get; set; }
        public double initialBalance { get; set; }
        public double residualBalance { get; set; }
        public int order { get; set; }
        public DateTime date { get; set; }
    }
}
