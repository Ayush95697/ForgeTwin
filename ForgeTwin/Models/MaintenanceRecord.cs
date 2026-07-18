using System.ComponentModel.DataAnnotations;

namespace ForgeTwin.Models;

public partial class MaintenanceRecord
{
    public int Id { get; set; }

    public int MachineId { get; set; }
    public virtual Machine Machine { get; set; } = null!;
    [Required(ErrorMessage = "Scheduled date is required")]
    [DataType(DataType.DateTime)]
    public DateTime ScheduledDate { get; set; }

    [DataType(DataType.DateTime)]
    public DateTime? CompletedDate { get; set; }

    public MaintenanceType Type { get; set; }

    [StringLength(500, ErrorMessage = "Notes can't exceed 500 characters")]
    public string Notes { get; set; } = string.Empty;
    // Done
}