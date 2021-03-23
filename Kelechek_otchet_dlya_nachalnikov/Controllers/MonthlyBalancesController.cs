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
    public class MonthlyBalancesController : ControllerBase
    {
        private readonly Kelechek_otchet_dlya_nachalnikovContext _context;

        public MonthlyBalancesController(Kelechek_otchet_dlya_nachalnikovContext context)
        {
            _context = context;
        }

        // GET: api/MonthlyBalances
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MonthlyBalance>>> GetMonthlyBalance()
        {
            return await _context.MonthlyBalance.ToListAsync();
        }

        // GET: api/MonthlyBalances/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MonthlyBalance>> GetMonthlyBalance(int id)
        {
            var monthlyBalance = await _context.MonthlyBalance.FindAsync(id);

            if (monthlyBalance == null)
            {
                return NotFound();
            }

            return monthlyBalance;
        }

        // PUT: api/MonthlyBalances/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMonthlyBalance(int id, MonthlyBalance monthlyBalance)
        {
            if (id != monthlyBalance.id)
            {
                return BadRequest();
            }

            _context.Entry(monthlyBalance).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MonthlyBalanceExists(id))
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

        // POST: api/MonthlyBalances
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<MonthlyBalance>> PostMonthlyBalance(List<MonthlyBalance> monthlyBalance)
        {
            _context.MonthlyBalance.AddRange(monthlyBalance);
            await _context.SaveChangesAsync();

            return StatusCode(201);
        }

        // DELETE: api/MonthlyBalances/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<MonthlyBalance>> DeleteMonthlyBalance(int id)
        {
            var monthlyBalance = await _context.MonthlyBalance.FindAsync(id);
            if (monthlyBalance == null)
            {
                return NotFound();
            }

            _context.MonthlyBalance.Remove(monthlyBalance);
            await _context.SaveChangesAsync();

            return monthlyBalance;
        }

        private bool MonthlyBalanceExists(int id)
        {
            return _context.MonthlyBalance.Any(e => e.id == id);
        }
    }
}
