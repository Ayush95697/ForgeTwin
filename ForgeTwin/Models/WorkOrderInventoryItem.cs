using System;
using System.Collections.Generic;

namespace ForgeTwin.Models;

public partial class WorkOrderInventoryItem
{
    public int WorkOrderId { get; set; }

    public int InventoryItemId { get; set; }

    public int QuantityUsed { get; set; }

    public virtual InventoryItem InventoryItem { get; set; } = null!;

    public virtual WorkOrder WorkOrder { get; set; } = null!;
}
