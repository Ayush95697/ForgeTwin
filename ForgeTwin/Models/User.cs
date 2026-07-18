using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ForgeTwin.Models;

public partial class User
{
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Username { get; set; } = null!;

    [Required]
    [StringLength(200)]
    public string PasswordHash { get; set; } = null!;

    public UserRole Role { get; set; }

    public virtual ICollection<WorkOrder> WorkOrders { get; set; } = new List<WorkOrder>();
}
