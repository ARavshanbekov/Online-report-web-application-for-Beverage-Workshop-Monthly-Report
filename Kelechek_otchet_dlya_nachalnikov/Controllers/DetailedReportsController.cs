using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Kelechek_otchet_dlya_nachalnikov.Data;
using Kelechek_otchet_dlya_nachalnikov.Models;
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

            return await _context.Reports.ToListAsync();
        }

        // GET: api/DetailedReports/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Object>> GetReport(int id)
        {

            var report = await _context.Reports.FindAsync(id);

            if (report == null)
            {
                return NotFound();
            }

            var responsibleArea = await _context.ResponsibleAreas.Where(r => r.id == report.responsibleAreaId).FirstOrDefaultAsync();

            if (responsibleArea == null)
            {
                return NotFound();
            }

            var reportMonth = report.date.Month;
            var reportColumns = await _context.ReportColumns.Where(r => r.responsibleAreaId == report.responsibleAreaId).ToListAsync();
            var reportItems = await _context.ReportItems.Where(r => r.responsibleAreaId == report.responsibleAreaId).ToListAsync();
            var monthlyBalance = await _context.MonthlyBalances.Where(r => r.reportId == report.id).ToListAsync();
            //  
            if (monthlyBalance == null || !monthlyBalance.Any())
            {
                return NotFound();
            }

            var reportDatas = await _context.ReportData.Where(r => r.reportId == report.id).ToListAsync();

            if (reportDatas == null || !reportDatas.Any())
            {
                return NotFound();
            }

            var reportStandards = await _context.ReportStandards.Where(r => r.responsibleAreaId == report.responsibleAreaId).ToListAsync();

            if (reportStandards == null || !reportStandards.Any())
            {
                return NotFound();
            }
            //var mergedObject = Merger.Merge(reportItems, reportColumns);
            var dynamicObject = new
            {
                report = report,
                reportColumns = reportColumns,
                reportItems = reportItems,
                monthlyBalances = monthlyBalance,
                reportDatas = reportDatas,
                reportStandards = reportStandards,
                responsibleArea = responsibleArea
            };
            return Ok(dynamicObject);
        }

        // PUT: api/DetailedReports/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReport(List<Report> reports)
        {
            

            foreach (Report report in reports)
            {
                _context.Entry(report).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ReportExists(report.id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
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

            int memberID = (int)requestObject["MemberId"];
            string name = (string)requestObject["Name"];   
            int month = (int)requestObject["Month"];

            var responsibleArea = await _context.ResponsibleAreas.Where(r => r.memberId == memberID && r.name.Equals(name)).FirstOrDefaultAsync();

            if (responsibleArea == null)
            {
                return NotFound();
            }

            var report = await _context.Reports.Where(r => r.date.Month == month && r.memberId == memberID && r.responsibleAreaId == responsibleArea.id).FirstOrDefaultAsync();

            if (report != null)
            {
                return NotFound();
            }

            if (month == 1)
            {
                month = 13;
            }

            var monthlyBalances = await _context.MonthlyBalances.Where(r => r.date.Month == (month - 1) && r.memberId == memberID && r.responsibleAreaId == responsibleArea.id).ToListAsync();
            //  
            if (monthlyBalances == null || !monthlyBalances.Any())
            {
                return NotFound();
            }

            var reportColumns = await _context.ReportColumns.Where(r => r.responsibleAreaId == responsibleArea.id).ToListAsync();            

            if (reportColumns == null || !reportColumns.Any())
            {
                return NotFound();
            }

            var reportItems = await _context.ReportItems.Where(r => r.responsibleAreaId == responsibleArea.id).ToListAsync();

            if (reportItems == null || !reportItems.Any())
            {
                return NotFound();
            }

            var reportStandards = await _context.ReportStandards.Where(s => s.responsibleAreaId == responsibleArea.id).ToListAsync();
           
            if (reportStandards == null || !reportStandards.Any())
            {
                return NotFound();
            }
            //var mergedObject = Merger.Merge(reportItems, reportColumns);
            var dynamicObject = new
            {
                reportColumns = reportColumns,
                reportItems = reportItems,
                monthlyBalances = monthlyBalances,
                reportStandards = reportStandards
            };
            return Ok(dynamicObject);
        }

        // DELETE: api/DetailedReports/5
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
