
using Microsoft.AspNetCore.Mvc;
// using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ForgeTwin.Models;
using ForgeTwin.Data;

// [Authorize]
public class MachinesController : Controller
{
    private readonly ForgeTwinDbContext _context;

    public MachinesController(ForgeTwinDbContext context)
    {
        _context = context;
    }

    // GET: MACHINES
    public async Task<IActionResult> Index()    
    {
        return View(await _context.Machines.ToListAsync());
    }

    // GET: MACHINES/Details/5
    public async Task<IActionResult> Details(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var machine = await _context.Machines
            .FirstOrDefaultAsync(m => m.Id == id);
        if (machine == null)
        {
            return NotFound();
        }

        return View(machine);
    }

    // GET: MACHINES/Create
    public IActionResult Create()
    {
        return View();
    }

    // POST: MACHINES/Create
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Id,Name,Type,Status,InstalledOn,MaintenanceRecords,ProductionLogs,WorkOrders")] Machine machine)
    {
        if (ModelState.IsValid)
        {
            _context.Add(machine);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        return View(machine);
    }

    // GET: MACHINES/Edit/5
    public async Task<IActionResult> Edit(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var machine = await _context.Machines.FindAsync(id);
        if (machine == null)
        {
            return NotFound();
        }
        return View(machine);
    }

    // POST: MACHINES/Edit/5
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int? id, [Bind("Id,Name,Type,Status,InstalledOn,MaintenanceRecords,ProductionLogs,WorkOrders")] Machine machine)
    {
        if (id != machine.Id)
        {
            return NotFound();
        }

        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(machine);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MachineExists(machine.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return RedirectToAction(nameof(Index));
        }
        return View(machine);
    }

    // GET: MACHINES/Delete/5
    // [Authorize(Roles = "Administrator,Supervisor")]
    public async Task<IActionResult> Delete(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var machine = await _context.Machines
            .FirstOrDefaultAsync(m => m.Id == id);
        if (machine == null)
        {
            return NotFound();
        }

        return View(machine);
    }

    // POST: MACHINES/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    // [Authorize(Roles = "Administrator,Supervisor")]
    public async Task<IActionResult> DeleteConfirmed(int? id)
    {
        var machine = await _context.Machines.FindAsync(id);
        if (machine != null)
        {
            _context.Machines.Remove(machine);
        }

        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    private bool MachineExists(int? id)
    {
        return _context.Machines.Any(e => e.Id == id);
    }
}
