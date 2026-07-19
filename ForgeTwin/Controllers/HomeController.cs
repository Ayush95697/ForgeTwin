using System.Diagnostics;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ForgeTwin.Data;
using ForgeTwin.Models;
using Microsoft.AspNetCore.Mvc;

namespace ForgeTwin.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ForgeTwinDbContext _context;

        public HomeController(ILogger<HomeController> logger, ForgeTwinDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var now = DateTime.UtcNow;
            var sevenDaysAgo = now.AddDays(-7);
            var upcoming = now.AddDays(7);

            var viewModel = new DashboardViewModel
            {
                MachineStatusCounts = await _context.Machines
                    .GroupBy(m => m.Status)
                    .Select(g => new { Status = g.Key.ToString(), Count = g.Count() })
                    .ToDictionaryAsync(x => x.Status, x => x.Count),

                OpenWorkOrderPriorityCounts = await _context.WorkOrders
                    .Where(wo => wo.Status == WorkOrderStatus.Open || wo.Status == WorkOrderStatus.InProgress)
                    .GroupBy(wo => wo.Priority)
                    .Select(g => new { Priority = g.Key.ToString(), Count = g.Count() })
                    .ToDictionaryAsync(x => x.Priority, x => x.Count),

                LowStockItems = await _context.InventoryItems
                    .Where(i => i.QuantityOnHand < i.ReorderThreshold)
                    .ToListAsync(),

                TotalUnitsProducedLast7Days = await _context.ProductionLogs
                    .Where(p => p.LoggedAt >= sevenDaysAgo)
                    .SumAsync(p => p.UnitsProduced),

                TotalDefectCountLast7Days = await _context.ProductionLogs
                    .Where(p => p.LoggedAt >= sevenDaysAgo)
                    .SumAsync(p => p.DefectCount),

                UpcomingMaintenanceCount = await _context.MaintenanceRecords
                    .Where(mr => mr.ScheduledDate >= now && mr.ScheduledDate <= upcoming && mr.CompletedDate == null)
                    .CountAsync()
            };

            return View(viewModel);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
