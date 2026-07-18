using System.ComponentModel.DataAnnotations;

namespace ForgeTwin.Models;

public partial class InventoryItem
{
    public int Id { get; set; }

    [Required(ErrorMessage = "SKU is required")]
    [StringLength(50)]
    public string SKU { get; set; } = string.Empty;

    [Required(ErrorMessage = "Item name is required")]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Range(0, int.MaxValue, ErrorMessage = "Quantity cannot be negative")]
    public int QuantityOnHand { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Reorder threshold cannot be negative")]
    public int ReorderThreshold { get; set; }

    [Range(0.01, double.MaxValue, ErrorMessage = "Unit cost must be positive")]
    [DataType(DataType.Currency)]
    public decimal UnitCost { get; set; }

    public virtual ICollection<WorkOrderInventoryItem> WorkOrderInventoryItems { get; set; } = new List<WorkOrderInventoryItem>();
}