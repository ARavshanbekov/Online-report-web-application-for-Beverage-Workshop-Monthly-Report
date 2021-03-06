using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace Kelechek_otchet_dlya_nachalnikov.Models
{
    public class ReportItem
    {
        public ReportItem()
        {
            MonthlyBalances = new HashSet<MonthlyBalance>();
            ReportDatas = new HashSet<ReportData>();
            ReportStandards = new HashSet<ReportStandard>();
        }

        public int id { get; set; }
        public string name { get; set; }
        public string unit { get; set; }
        public int order { get; set; }
        public int? responsibleAreaId { get; set; }

        public virtual ResponsibleArea ResponsibleArea { get; set; }
        [JsonIgnore]
        [IgnoreDataMember]
        public virtual ICollection<MonthlyBalance> MonthlyBalances { get; set; }
        [JsonIgnore]
        [IgnoreDataMember]
        public virtual ICollection<ReportData> ReportDatas { get; set; }
        [JsonIgnore]
        [IgnoreDataMember]
        public virtual ICollection<ReportStandard> ReportStandards { get; set; }
    }
}
