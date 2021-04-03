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
    public class MemberPageByRolesController : ControllerBase
    {
        private readonly Kelechek_otchet_dlya_nachalnikovContext _context;

        public MemberPageByRolesController(Kelechek_otchet_dlya_nachalnikovContext context)
        {
            _context = context;
        }

        // GET: api/MemberPageByRoles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberPageByRole>>> GetMemberPageByRole()
        {
            return await _context.MemberPageByRoles.ToListAsync();
        }

        // GET: api/MemberPageByRoles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<List<MemberPageByRole>>> GetMemberPageByRole(int id)
        {
            var memberPageByRole = await _context.MemberPageByRoles.Where(m => m.memberId == id).ToListAsync();

            if (memberPageByRole == null)
            {
                return NotFound();
            }

            return memberPageByRole;
        }

        // PUT: api/MemberPageByRoles/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMemberPageByRole(int id, MemberPageByRole memberPageByRole)
        {
            if (id != memberPageByRole.id)
            {
                return BadRequest();
            }

            _context.Entry(memberPageByRole).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MemberPageByRoleExists(id))
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

        // POST: api/MemberPageByRoles
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<MemberPageByRole>> PostMemberPageByRole(MemberPageByRole memberPageByRole)
        {
            _context.MemberPageByRoles.Add(memberPageByRole);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMemberPageByRole", new { id = memberPageByRole.id }, memberPageByRole);
        }

        // DELETE: api/MemberPageByRoles/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<MemberPageByRole>> DeleteMemberPageByRole(int id)
        {
            var memberPageByRole = await _context.MemberPageByRoles.FindAsync(id);
            if (memberPageByRole == null)
            {
                return NotFound();
            }

            _context.MemberPageByRoles.Remove(memberPageByRole);
            await _context.SaveChangesAsync();

            return memberPageByRole;
        }

        private bool MemberPageByRoleExists(int id)
        {
            return _context.MemberPageByRoles.Any(e => e.id == id);
        }
    }
}
