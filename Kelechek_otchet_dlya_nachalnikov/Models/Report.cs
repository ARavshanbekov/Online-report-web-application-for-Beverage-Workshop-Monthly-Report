using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace Kelechek_otchet_dlya_nachalnikov.Models
{
    public class Report
    {
        public Report()
        {
            MonthlyBalances = new HashSet<MonthlyBalance>();
            ReportDatas = new HashSet<ReportData>();
        }

        public int id { get; set; }
        public DateTime date { get; set; }
        public string title { get; set; }
        public bool status { get; set; }
        public int? responsibleAreaId { get; set; }
        public int? memberId { get; set; }

        public virtual Member Members { get; set; }
        public virtual ResponsibleArea ResponsibleArea { get; set; }
        [JsonIgnore]
        [IgnoreDataMember]
        public virtual ICollection<MonthlyBalance> MonthlyBalances { get; set; }
        [JsonIgnore]
        [IgnoreDataMember]
        public virtual ICollection<ReportData> ReportDatas { get; set; }
    }
}
