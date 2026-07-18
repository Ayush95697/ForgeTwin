using ForgeTwin.Data;
using ForgeTwin.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace ForgeTwin.Controllers;

[Authorize]
public class WorkOrderInventoryItemsController : Controller
{
    private readonly ForgeTwinDbContext _context;

    public WorkOrderInventoryItemsController(ForgeTwinDbContext context) => _context = context;

    public async Task<IActionResult> Index(int? workOrderId)
    {
        var items = _context.WorkOrderInventoryItems
            .Include(item => item.InventoryItem)
            .Include(item => item.WorkOrder).ThenInclude(order => order.Machine)
            .AsQueryable();
        if (workOrderId.HasValue) items = items.Where(item => item.WorkOrderId == workOrderId.Value);
        ViewData["WorkOrderId"] = workOrderId;
        return View(await items.ToListAsync());
    }

    public async Task<IActionResult> Create(int? workOrderId)
    {
        await PopulateSelectorsAsync(workOrderId);
        return View(new WorkOrderInventoryItem { WorkOrderId = workOrderId ?? 0 });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("WorkOrderId,InventoryItemId,QuantityUsed")] WorkOrderInventoryItem item)
    {
        ModelState.Remove(nameof(WorkOrderInventoryItem.WorkOrder));
        ModelState.Remove(nameof(WorkOrderInventoryItem.InventoryItem));
        if (ModelState.IsValid)
        {
            if (!await CanChangePartsAsync(item.WorkOrderId))
            {
                ModelState.AddModelError("", "Parts cannot be changed after a work order is completed.");
                await PopulateSelectorsAsync(item.WorkOrderId, item.InventoryItemId);
                return View(item);
            }
            var exists = await _context.WorkOrderInventoryItems.AnyAsync(existing => existing.WorkOrderId == item.WorkOrderId && existing.InventoryItemId == item.InventoryItemId);
            if (!exists)
            {
                _context.Add(item);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index), new { workOrderId = item.WorkOrderId });
            }
            ModelState.AddModelError("", "That inventory item is already linked to this work order. Edit its quantity instead.");
        }
        await PopulateSelectorsAsync(item.WorkOrderId, item.InventoryItemId);
        return View(item);
    }

    public async Task<IActionResult> Edit(int? workOrderId, int? inventoryItemId)
    {
        if (workOrderId is null || inventoryItemId is null) return NotFound();
        var item = await _context.WorkOrderInventoryItems.FindAsync(workOrderId, inventoryItemId);
        return item is null ? NotFound() : View(item);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int workOrderId, int inventoryItemId, [Bind("WorkOrderId,InventoryItemId,QuantityUsed")] WorkOrderInventoryItem item)
    {
        if (workOrderId != item.WorkOrderId || inventoryItemId != item.InventoryItemId) return NotFound();
        ModelState.Remove(nameof(WorkOrderInventoryItem.WorkOrder));
        ModelState.Remove(nameof(WorkOrderInventoryItem.InventoryItem));
        if (ModelState.IsValid)
        {
            if (!await CanChangePartsAsync(workOrderId))
            {
                ModelState.AddModelError("", "Parts cannot be changed after a work order is completed.");
                return View(item);
            }
            _context.Update(item);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index), new { workOrderId });
        }
        return View(item);
    }

    public async Task<IActionResult> Delete(int? workOrderId, int? inventoryItemId)
    {
        if (workOrderId is null || inventoryItemId is null) return NotFound();
        var item = await _context.WorkOrderInventoryItems.Include(item => item.InventoryItem).Include(item => item.WorkOrder).ThenInclude(order => order.Machine)
            .FirstOrDefaultAsync(item => item.WorkOrderId == workOrderId && item.InventoryItemId == inventoryItemId);
        return item is null ? NotFound() : View(item);
    }

    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int workOrderId, int inventoryItemId)
    {
        if (!await CanChangePartsAsync(workOrderId)) return Conflict("Parts cannot be changed after a work order is completed.");
        var item = await _context.WorkOrderInventoryItems.FindAsync(workOrderId, inventoryItemId);
        if (item is not null) _context.WorkOrderInventoryItems.Remove(item);
        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index), new { workOrderId });
    }

    private async Task PopulateSelectorsAsync(int? selectedWorkOrder = null, int? selectedInventoryItem = null)
    {
        var workOrders = await _context.WorkOrders.Include(order => order.Machine).OrderByDescending(order => order.CreatedAt).ToListAsync();
        ViewData["WorkOrderId"] = new SelectList(workOrders, "Id", "Id", selectedWorkOrder);
        ViewData["InventoryItemId"] = new SelectList(await _context.InventoryItems.OrderBy(item => item.Name).ToListAsync(), "Id", "Name", selectedInventoryItem);
    }

    private Task<bool> CanChangePartsAsync(int workOrderId) =>
        _context.WorkOrders.AnyAsync(order => order.Id == workOrderId && order.Status != WorkOrderStatus.Completed);
}
