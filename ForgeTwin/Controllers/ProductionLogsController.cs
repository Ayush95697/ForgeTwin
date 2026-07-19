using ForgeTwin.Data;
using ForgeTwin.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace ForgeTwin.Controllers;

// [Authorize]
public class ProductionLogsController : Controller
{
    private readonly ForgeTwinDbContext _context;

    public ProductionLogsController(ForgeTwinDbContext context) => _context = context;

    public async Task<IActionResult> Index() =>
        View(await _context.ProductionLogs.Include(log => log.Machine).OrderByDescending(log => log.LoggedAt).ToListAsync());

    public async Task<IActionResult> Details(int? id)
    {
        if (id is null) return NotFound();
        var log = await _context.ProductionLogs.Include(log => log.Machine).FirstOrDefaultAsync(log => log.Id == id);
        return log is null ? NotFound() : View(log);
    }

    public async Task<IActionResult> Create()
    {
        await PopulateMachinesAsync();
        return View(new ProductionLog { LoggedAt = DateTime.UtcNow });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("MachineId,UnitsProduced,DefectCount,LoggedAt")] ProductionLog productionLog)
    {
        // Machine is loaded through MachineId; it is not posted by the form.
        ModelState.Remove(nameof(ProductionLog.Machine));
        if (ModelState.IsValid)
        {
            _context.Add(productionLog);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        await PopulateMachinesAsync(productionLog.MachineId);
        return View(productionLog);
    }

    public async Task<IActionResult> Edit(int? id)
    {
        if (id is null) return NotFound();
        var log = await _context.ProductionLogs.FindAsync(id);
        if (log is null) return NotFound();
        await PopulateMachinesAsync(log.MachineId);
        return View(log);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, [Bind("Id,MachineId,UnitsProduced,DefectCount,LoggedAt")] ProductionLog productionLog)
    {
        if (id != productionLog.Id) return NotFound();
        ModelState.Remove(nameof(ProductionLog.Machine));
        if (ModelState.IsValid)
        {
            try { _context.Update(productionLog); await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException) { if (!ProductionLogExists(productionLog.Id)) return NotFound(); throw; }
            return RedirectToAction(nameof(Index));
        }
        await PopulateMachinesAsync(productionLog.MachineId);
        return View(productionLog);
    }

    public async Task<IActionResult> Delete(int? id)
    {
        if (id is null) return NotFound();
        var log = await _context.ProductionLogs.Include(log => log.Machine).FirstOrDefaultAsync(log => log.Id == id);
        return log is null ? NotFound() : View(log);
    }

    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        var log = await _context.ProductionLogs.FindAsync(id);
        if (log is not null) _context.ProductionLogs.Remove(log);
        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    private async Task PopulateMachinesAsync(object? selectedMachine = null)
    {
        var machines = await _context.Machines.OrderBy(machine => machine.Name).ToListAsync();
        ViewData["MachineId"] = new SelectList(machines, "Id", "Name", selectedMachine);
    }

    private bool ProductionLogExists(int id) => _context.ProductionLogs.Any(log => log.Id == id);
}
