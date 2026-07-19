using ForgeTwin.Data;
using ForgeTwin.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
// using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace ForgeTwin.Controllers;

// [Authorize]
public class MaintenanceRecordsController : Controller
{
    private readonly ForgeTwinDbContext _context;

    public MaintenanceRecordsController(ForgeTwinDbContext context) => _context = context;

    public async Task<IActionResult> Index()
    {
        var records = _context.MaintenanceRecords.Include(record => record.Machine);
        return View(await records.ToListAsync());
    }

    public async Task<IActionResult> Details(int? id)
    {
        if (id is null) return NotFound();

        var record = await _context.MaintenanceRecords
            .Include(record => record.Machine)
            .FirstOrDefaultAsync(record => record.Id == id);
        return record is null ? NotFound() : View(record);
    }

    public async Task<IActionResult> Create()
    {
        await PopulateMachinesAsync();
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("MachineId,ScheduledDate,CompletedDate,Type,Notes")] MaintenanceRecord maintenanceRecord)
    {
        // Machine is an EF navigation property, supplied by the FK selector rather than the form post.
        ModelState.Remove(nameof(MaintenanceRecord.Machine));
        if (ModelState.IsValid)
        {
            _context.Add(maintenanceRecord);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        await PopulateMachinesAsync(maintenanceRecord.MachineId);
        return View(maintenanceRecord);
    }

    public async Task<IActionResult> Edit(int? id)
    {
        if (id is null) return NotFound();

        var record = await _context.MaintenanceRecords.FindAsync(id);
        if (record is null) return NotFound();

        await PopulateMachinesAsync(record.MachineId);
        return View(record);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, [Bind("Id,MachineId,ScheduledDate,CompletedDate,Type,Notes")] MaintenanceRecord maintenanceRecord)
    {
        if (id != maintenanceRecord.Id) return NotFound();
        ModelState.Remove(nameof(MaintenanceRecord.Machine));

        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(maintenanceRecord);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MaintenanceRecordExists(maintenanceRecord.Id)) return NotFound();
                throw;
            }

            return RedirectToAction(nameof(Index));
        }

        await PopulateMachinesAsync(maintenanceRecord.MachineId);
        return View(maintenanceRecord);
    }

    public async Task<IActionResult> Delete(int? id)
    {
        if (id is null) return NotFound();

        var record = await _context.MaintenanceRecords
            .Include(record => record.Machine)
            .FirstOrDefaultAsync(record => record.Id == id);
        return record is null ? NotFound() : View(record);
    }

    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        var record = await _context.MaintenanceRecords.FindAsync(id);
        if (record is not null) _context.MaintenanceRecords.Remove(record);
        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    private async Task PopulateMachinesAsync(object? selectedMachine = null)
    {
        var machines = await _context.Machines.OrderBy(machine => machine.Name).ToListAsync();
        ViewData["MachineId"] = new SelectList(machines, "Id", "Name", selectedMachine);
    }

    private bool MaintenanceRecordExists(int id) => _context.MaintenanceRecords.Any(record => record.Id == id);
}
