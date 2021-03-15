using Kelechek_otchet_dlya_nachalnikov.Data;
using Kelechek_otchet_dlya_nachalnikov.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Kelechek_otchet_dlya_nachalnikov.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class termoplastIVyduvController : ControllerBase
    {
        private readonly Kelechek_otchet_dlya_nachalnikovContext _context;

        public termoplastIVyduvController(Kelechek_otchet_dlya_nachalnikovContext context)
        {
            _context = context;
        }

        // GET: api/<termoplastIVyduvController>
        [HttpGet]
        public ActionResult<string> Get()
        {            
            int responsibleAreaID = _context.ResponsibleAreas.Where(n => n.Name.Equals("Термопласт и Выдув")).FirstOrDefault().id;
            var reports = _context.Report.Where(r => r.ResponsibleAreaID == responsibleAreaID).ToList();
            int reportCount = reports.Count();
            var data = JsonConvert.SerializeObject(reports);
            Response.Headers.Add("Content-Range", reportCount.ToString());

            return data;
        }

        // GET api/<termoplastIVyduvController>/5
        [HttpGet("{id}")]
        public Report Get(int id)
        {            
            Report report = _context.Report.Where(r => r.id == id).FirstOrDefault();
            return report;
        }

        // POST api/<termoplastIVyduvController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<termoplastIVyduvController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<termoplastIVyduvController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
