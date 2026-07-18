using System;
using System.Collections.Generic;

namespace ForgeTwin.Models;

public partial class ProductionLog
{
    public int Id { get; set; }

    public int MachineId { get; set; }

    public int UnitsProduced { get; set; }

    public int DefectCount { get; set; }

    public DateTime LoggedAt { get; set; }

    public virtual Machine Machine { get; set; } = null!;
}
