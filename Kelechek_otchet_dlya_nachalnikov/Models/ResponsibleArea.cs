﻿    using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kelechek_otchet_dlya_nachalnikov.Models
{
    public class ResponsibleArea
    {
        public int id { get; set; }
        public int MemberID { get; set; }
        public String Name { get; set; }
        
        //public Member Member { get; set; }
        //public ICollection<Report> Reports { get; set; }
    }
}