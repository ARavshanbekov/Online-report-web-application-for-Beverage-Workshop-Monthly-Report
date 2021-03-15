﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Kelechek_otchet_dlya_nachalnikov.Models
{
    public class Report
    {
        [Key]
        public int id { get; set; }
        public int ResponsibleAreaID { get; set; }   
        public int MemberID { get; set; }
        public DateTime Date { get; set; }
        public String Title { get; set; }
        
        //public ResponsibleArea ResponsibleArea { get; set; }
        //public ICollection<ReportColumn> ReportColumns { get; set; }
        //public ICollection<ReportItem> reportItems { get; set; }
        //public ICollection<ReportData> reportDatas { get; set; }
    }
}
