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
        public int responsibleAreaId { get; set; }   
        public int memberId { get; set; }
        public DateTime date { get; set; }
        public String title { get; set; }
        public Boolean status { get; set; }
    }
}
