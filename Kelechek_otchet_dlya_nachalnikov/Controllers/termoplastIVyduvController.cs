using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Kelechek_otchet_dlya_nachalnikov.Data;
using Kelechek_otchet_dlya_nachalnikov.Models;
using Newtonsoft.Json;

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

        // GET: api/termoplastIVyduv
        [HttpGet]
        public async Task<ActionResult<String>> GetReport()
        {
            var responsibleArea = await _context.ResponsibleAreas.Where(n => n.name.Equals("Термопласт и Выдув")).FirstOrDefaultAsync();
            int responsibleAreaID = responsibleArea.id;
            var reports = _context.Reports.Where(r => r.responsibleAreaId == responsibleAreaID).ToList();
            int reportCount = reports.Count();
            var data = JsonConvert.SerializeObject(reports);
            Response.Headers.Add("Content-Range", reportCount.ToString());

            return data;
        }

        // GET: api/termoplastIVyduv/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Report>> GetReport(int id)
        {
            var report = await _context.Reports.FindAsync(id);
            var reportDate = report.date;

            if (report == null)
            {
                return NotFound();
            }

            //var reportColumns = await _context.ReportColumn.Where(r => r.reportId == report.id).ToListAsync();
            //var reportItems = await _context.ReportItem.Where(r => r.reportId == report.id).ToListAsync();
            //var monthlyBalance = await _context.MonthlyBalance.Where(r => r.date.Month == reportDate.Month && r.memberID == report.memberID && r.responsibleAreaID == report.responsibleAreaID).ToListAsync();
            ////  
            //if (monthlyBalance == null || !monthlyBalance.Any())
            //{
            //    return NotFound();
            //}

            ////var mergedObject = Merger.Merge(reportItems, reportColumns);
            //var dynamicObject = new
            //{
            //    report = report,
            //    reportColumns = reportColumns,
            //    reportItems = reportItems,
            //    monthlyBalance = monthlyBalance
            //};
            return report;
        }

        // PUT: api/termoplastIVyduv/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReport(int id, Report report)
        {
            if (id != report.id)
            {
                return BadRequest();
            }

            _context.Entry(report).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReportExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/termoplastIVyduv
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Report>> PostReport(Report report)
        {
            _context.Reports.Add(report);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReport", new { id = report.id }, report);
        }

        // DELETE: api/termoplastIVyduv/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Report>> DeleteReport(int id)
        {
            var report = await _context.Reports.FindAsync(id);
            if (report == null)
            {
                return NotFound();
            }

            _context.Reports.Remove(report);
            await _context.SaveChangesAsync();

            return report;
        }

        private bool ReportExists(int id)
        {
            return _context.Reports.Any(e => e.id == id);
        }
    }
}
