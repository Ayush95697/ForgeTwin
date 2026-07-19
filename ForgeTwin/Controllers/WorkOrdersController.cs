using ForgeTwin.Data;
using ForgeTwin.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
// using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace ForgeTwin.Controllers;

// [Authorize]
public class WorkOrdersController : Controller
{
    private readonly ForgeTwinDbContext _context;

    public WorkOrdersController(ForgeTwinDbContext context) => _context = context;

    public async Task<IActionResult> Index() => View(await WorkOrdersQuery().OrderByDescending(order => order.CreatedAt).ToListAsync());

    public async Task<IActionResult> Details(int? id)
    {
        if (id is null) return NotFound();
        var workOrder = await WorkOrdersQuery()
            .Include(order => order.WorkOrderInventoryItems).ThenInclude(item => item.InventoryItem)
            .FirstOrDefaultAsync(order => order.Id == id);
        return workOrder is null ? NotFound() : View(workOrder);
    }

    public async Task<IActionResult> Create()
    {
        await PopulateSelectorsAsync();
        return View(new WorkOrder { CreatedAt = DateTime.UtcNow, Status = WorkOrderStatus.Open, Priority = WorkOrderPriority.Medium });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("MachineId,AssignedToUserId,Status,Priority,CreatedAt,DueDate")] WorkOrder workOrder)
    {
        // These values are EF navigation/database-generated properties, not user input.
        ModelState.Remove(nameof(WorkOrder.Machine));
        ModelState.Remove(nameof(WorkOrder.RowVersion));
        if (ModelState.IsValid)
        {
            _context.Add(workOrder);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        await PopulateSelectorsAsync(workOrder.MachineId, workOrder.AssignedToUserId);
        return View(workOrder);
    }

    public async Task<IActionResult> Edit(int? id)
    {
        if (id is null) return NotFound();
        var workOrder = await _context.WorkOrders.FindAsync(id);
        if (workOrder is null) return NotFound();
        if (!CanEditWorkOrder(workOrder)) return Forbid();
        await PopulateSelectorsAsync(workOrder.MachineId, workOrder.AssignedToUserId);
        return View(workOrder);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, [Bind("Id,MachineId,AssignedToUserId,Status,Priority,CreatedAt,DueDate,RowVersion")] WorkOrder postedOrder)
    {
        if (id != postedOrder.Id) return NotFound();
        var existingOrder = await _context.WorkOrders.AsNoTracking().FirstOrDefaultAsync(order => order.Id == id);
        if (existingOrder is null) return NotFound();
        if (!CanEditWorkOrder(existingOrder)) return Forbid();
        ModelState.Remove(nameof(WorkOrder.Machine));

        if (!ModelState.IsValid)
        {
            await PopulateSelectorsAsync(postedOrder.MachineId, postedOrder.AssignedToUserId);
            return View(postedOrder);
        }

        await using var transaction = await _context.Database.BeginTransactionAsync();
        var workOrder = await _context.WorkOrders
            .Include(order => order.WorkOrderInventoryItems).ThenInclude(item => item.InventoryItem)
            .FirstOrDefaultAsync(order => order.Id == id);
        if (workOrder is null) return NotFound();

        // Compare against the row version submitted with the form, rather than the version just read.
        _context.Entry(workOrder).Property(order => order.RowVersion).OriginalValue = postedOrder.RowVersion;
        var completingNow = workOrder.Status != WorkOrderStatus.Completed && postedOrder.Status == WorkOrderStatus.Completed;

        if (completingNow)
        {
            foreach (var part in workOrder.WorkOrderInventoryItems)
            {
                if (part.InventoryItem.QuantityOnHand < part.QuantityUsed)
                {
                    ModelState.AddModelError("", $"Insufficient stock for {part.InventoryItem.Name}. Available: {part.InventoryItem.QuantityOnHand}; required: {part.QuantityUsed}.");
                }
            }
            if (!ModelState.IsValid)
            {
                await transaction.RollbackAsync();
                postedOrder.RowVersion = workOrder.RowVersion;
                await PopulateSelectorsAsync(postedOrder.MachineId, postedOrder.AssignedToUserId);
                return View(postedOrder);
            }
            foreach (var part in workOrder.WorkOrderInventoryItems)
                part.InventoryItem.QuantityOnHand -= part.QuantityUsed;
        }

        workOrder.MachineId = postedOrder.MachineId;
        workOrder.AssignedToUserId = postedOrder.AssignedToUserId;
        workOrder.Status = postedOrder.Status;
        workOrder.Priority = postedOrder.Priority;
        workOrder.CreatedAt = postedOrder.CreatedAt;
        workOrder.DueDate = postedOrder.DueDate;

        try
        {
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return RedirectToAction(nameof(Index));
        }
        catch (DbUpdateConcurrencyException)
        {
            await transaction.RollbackAsync();
            ModelState.AddModelError("", "This work order was changed by another user. Reload it and apply your changes again.");
            postedOrder.RowVersion = workOrder.RowVersion;
            await PopulateSelectorsAsync(postedOrder.MachineId, postedOrder.AssignedToUserId);
            return View(postedOrder);
        }
    }

    public async Task<IActionResult> Delete(int? id)
    {
        if (id is null) return NotFound();
        var workOrder = await WorkOrdersQuery().FirstOrDefaultAsync(order => order.Id == id);
        return workOrder is null ? NotFound() : View(workOrder);
    }

    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        var workOrder = await _context.WorkOrders.FindAsync(id);
        if (workOrder is not null) _context.WorkOrders.Remove(workOrder);
        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    private IQueryable<WorkOrder> WorkOrdersQuery() => _context.WorkOrders.Include(order => order.Machine).Include(order => order.AssignedToUser);

    private bool CanEditWorkOrder(WorkOrder workOrder)
    {
        if (!string.Equals(User.FindFirstValue("Role"), UserRole.Technician.ToString(), StringComparison.Ordinal)) return true;
        return int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId)
            && workOrder.AssignedToUserId == userId;
    }

    private async Task PopulateSelectorsAsync(object? selectedMachine = null, object? selectedUser = null)
    {
        ViewData["MachineId"] = new SelectList(await _context.Machines.OrderBy(machine => machine.Name).ToListAsync(), "Id", "Name", selectedMachine);
        var users = await _context.Users.OrderBy(user => user.Username).ToListAsync();
        ViewData["AssignedToUserId"] = new SelectList(users, "Id", "Username", selectedUser);
        ViewData["HasUsers"] = users.Count > 0;
    }
}
