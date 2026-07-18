using System.ComponentModel.DataAnnotations;

namespace ForgeTwin.Models;

public partial class Machine
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Machine name is required")]
    [StringLength(100, MinimumLength = 2,
        ErrorMessage = "Name must be 2-100 characters")]
    public string Name { get; set; } = string.Empty;

    public MachineStatus Status { get; set; }

    public MachineType Type { get; set; }

    [DataType(DataType.DateTime)]
    public DateTime InstalledOn { get; set; }

    public virtual ICollection<MaintenanceRecord> MaintenanceRecords { get; set; }
        = new List<MaintenanceRecord>();

    public virtual ICollection<ProductionLog> ProductionLogs { get; set; }
        = new List<ProductionLog>();

    public virtual ICollection<WorkOrder> WorkOrders { get; set; }
        = new List<WorkOrder>();
}