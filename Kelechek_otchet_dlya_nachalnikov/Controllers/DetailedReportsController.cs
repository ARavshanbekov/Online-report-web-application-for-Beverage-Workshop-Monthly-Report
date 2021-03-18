using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Kelechek_otchet_dlya_nachalnikov.Data;
using Kelechek_otchet_dlya_nachalnikov.Models;
using Kelechek_otchet_dlya_nachalnikov.Tools;
using Newtonsoft.Json.Linq;
using System.Reflection;
using Newtonsoft.Json;
using Nancy.Json;

namespace Kelechek_otchet_dlya_nachalnikov.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DetailedReportsController : ControllerBase
    {
        private readonly Kelechek_otchet_dlya_nachalnikovContext _context;

        public DetailedReportsController(Kelechek_otchet_dlya_nachalnikovContext context)
        {
            _context = context;
        }

        // GET: api/DetailedReports
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Report>>> GetReport()
        {

            return await _context.Report.ToListAsync();
        }

        // GET: api/DetailedReports/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Object>> GetReport(int id, string responsibleAreaName)
        {
            var responsibleArea = await _context.ResponsibleAreas.Where(r => r.MemberID == id && r.Name.Equals(responsibleAreaName)).FirstOrDefaultAsync();

            if (responsibleArea == null)
            {
                return NotFound();
            }

            var report = await _context.Report.Where(r => r.MemberID == id && r.ResponsibleAreaID == responsibleArea.id).FirstOrDefaultAsync();

            if (report == null)
            {
                return NotFound();
            }


            var reportColumns = await _context.ReportColumn.Where(r => r.ReportID == report.id).ToListAsync();
            var reportItems = await _context.ReportItem.Where(r => r.ReportID == report.id).ToListAsync();
            var monthlyBalance = await _context.MonthlyBalance.Where(r => r.memberID == id).FirstOrDefaultAsync();

            //var mergedObject = Merger.Merge(reportItems, reportColumns);
            var dynamicObject = new
            {
                report = report,
                reportColumns = reportColumns,
                reportItems = reportItems,
                monthlyBalance = monthlyBalance
            };
            return dynamicObject;
        }

        // PUT: api/DetailedReports/5
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

        // POST: api/DetailedReports
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Object>> PostReport(Object request)
        {

            
            JObject requestObject = (JObject)JsonConvert.DeserializeObject(request.ToString());

            int memberID = (int)requestObject["MemberID"];
            string name = (string)requestObject["Name"];   
            int month = (int)requestObject["Month"];

            var responsibleArea = await _context.ResponsibleAreas.Where(r => r.MemberID == memberID && r.Name.Equals(name)).FirstOrDefaultAsync();

            if (responsibleArea == null)
            {
                return NotFound();
            }

            var report = await _context.Report.Where(r => r.MemberID == memberID && r.ResponsibleAreaID == responsibleArea.id).FirstOrDefaultAsync();

            if (report == null)
            {
                return NotFound();
            }
            
            var reportColumns = await _context.ReportColumn.Where(r => r.ReportID == report.id).ToListAsync();
            var reportItems = await _context.ReportItem.Where(r => r.ReportID == report.id).ToListAsync();
            var monthlyBalance = await _context.MonthlyBalance.Where(r => r.date.Month == (month - 1) && r.memberID == memberID && r.responsibleAreaID == responsibleArea.id).ToListAsync();
            //  
            if (monthlyBalance == null || !monthlyBalance.Any())
            {
                return NotFound();
            }

            //var mergedObject = Merger.Merge(reportItems, reportColumns);
            var dynamicObject = new
            {
                report = report,
                reportColumns = reportColumns,
                reportItems = reportItems,
                monthlyBalance = monthlyBalance
            };
            return dynamicObject;
        }

        // DELETE: api/DetailedReports/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Report>> DeleteReport(int id)
        {
            var report = await _context.Report.FindAsync(id);
            if (report == null)
            {
                return NotFound();
            }

            _context.Report.Remove(report);
            await _context.SaveChangesAsync();

            return report;
        }

        private bool ReportExists(int id)
        {
            return _context.Report.Any(e => e.id == id);
        }
    }
}
