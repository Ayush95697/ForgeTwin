using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ForgeTwin.Models;

public partial class WorkOrderInventoryItem
{
    public int WorkOrderId { get; set; }

    public int InventoryItemId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Quantity used must be at least one")]
    public int QuantityUsed { get; set; }

    public virtual InventoryItem InventoryItem { get; set; } = null!;

    public virtual WorkOrder WorkOrder { get; set; } = null!;
}
