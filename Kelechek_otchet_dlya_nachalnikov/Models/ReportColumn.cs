﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kelechek_otchet_dlya_nachalnikov.Models
{
    public class ReportColumn
    {
        public ReportColumn()
        {
            ReportDatas = new HashSet<ReportData>();
            ReportStandards = new HashSet<ReportStandard>();
        }

        public int id { get; set; }
        public string name { get; set; }
        public int order { get; set; }
        public int? responsibleAreaId { get; set; }

        public virtual ResponsibleArea ResponsibleArea { get; set; }
        public virtual ICollection<ReportData> ReportDatas { get; set; }
        public virtual ICollection<ReportStandard> ReportStandards { get; set; }
    }
}
