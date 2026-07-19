using System.Collections.Generic;

namespace ForgeTwin.Models
{
    public class DashboardViewModel
    {
        public Dictionary<string, int> MachineStatusCounts { get; set; } = new();
        public Dictionary<string, int> OpenWorkOrderPriorityCounts { get; set; } = new();
        public List<InventoryItem> LowStockItems { get; set; } = new();
        public int TotalUnitsProducedLast7Days { get; set; }
        public int TotalDefectCountLast7Days { get; set; }
        public int UpcomingMaintenanceCount { get; set; }
    }
}
