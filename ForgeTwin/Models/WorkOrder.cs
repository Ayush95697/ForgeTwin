using System;
using System.Collections.Generic;

namespace ForgeTwin.Models;

public partial class WorkOrder
{
    public int Id { get; set; }

    public int MachineId { get; set; }

    public int? AssignedToUserId { get; set; }

    public WorkOrderStatus Status { get; set; }

    public WorkOrderPriority Priority { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? DueDate { get; set; }

    public byte[] RowVersion { get; set; } = null!;

    public virtual User? AssignedToUser { get; set; }

    public virtual Machine Machine { get; set; } = null!;

    public virtual ICollection<WorkOrderInventoryItem> WorkOrderInventoryItems { get; set; } = new List<WorkOrderInventoryItem>();
}
