using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Kelechek_otchet_dlya_nachalnikov.Data;
using Kelechek_otchet_dlya_nachalnikov.Models;

namespace Kelechek_otchet_dlya_nachalnikov.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportDatasController : ControllerBase
    {
        private readonly Kelechek_otchet_dlya_nachalnikovContext _context;

        public ReportDatasController(Kelechek_otchet_dlya_nachalnikovContext context)
        {
            _context = context;
        }

        // GET: api/ReportDatas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReportData>>> GetReportData()
        {
            return await _context.ReportData.ToListAsync();
        }

        // GET: api/ReportDatas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ReportData>> GetReportData(int id)
        {
            var reportData = await _context.ReportData.FindAsync(id);

            if (reportData == null)
            {
                return NotFound();
            }

            return reportData;
        }

        // PUT: api/ReportDatas/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReportData(int id, ReportData reportData)
        {
            if (id != reportData.id)
            {
                return BadRequest();
            }

            _context.Entry(reportData).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReportDataExists(id))
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

        // POST: api/ReportDatas
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<ReportData>> PostReportData(ReportData reportData)
        {
            _context.ReportData.Add(reportData);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReportData", new { id = reportData.id }, reportData);
        }

        // DELETE: api/ReportDatas/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ReportData>> DeleteReportData(int id)
        {
            var reportData = await _context.ReportData.FindAsync(id);
            if (reportData == null)
            {
                return NotFound();
            }

            _context.ReportData.Remove(reportData);
            await _context.SaveChangesAsync();

            return reportData;
        }

        private bool ReportDataExists(int id)
        {
            return _context.ReportData.Any(e => e.id == id);
        }
    }
}
