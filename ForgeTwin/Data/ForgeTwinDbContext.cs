using System;
using System.Collections.Generic;
using ForgeTwin.Models;
using Microsoft.EntityFrameworkCore;

namespace ForgeTwin.Data;

public partial class ForgeTwinDbContext : DbContext
{
    public ForgeTwinDbContext(DbContextOptions<ForgeTwinDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<InventoryItem> InventoryItems { get; set; }

    public virtual DbSet<Machine> Machines { get; set; }

    public virtual DbSet<MaintenanceRecord> MaintenanceRecords { get; set; }

    public virtual DbSet<ProductionLog> ProductionLogs { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<WorkOrder> WorkOrders { get; set; }

    public virtual DbSet<WorkOrderInventoryItem> WorkOrderInventoryItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<InventoryItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Inventor__3214EC073CEFE6EE");

            entity.HasIndex(e => e.SKU, "UQ__Inventor__CA1ECF0D8EEB032A").IsUnique();

            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.SKU)
                .HasMaxLength(50)
                .HasColumnName("SKU");
            entity.Property(e => e.UnitCost).HasColumnType("decimal(10, 2)");
         
        });

        modelBuilder.Entity<Machine>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Machines__3214EC078F84F492");

            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Type).HasMaxLength(50);
            entity.Property(e => e.Status).HasConversion<byte>();
            entity.Property(e => e.Type).HasConversion<string>();
        });

        modelBuilder.Entity<MaintenanceRecord>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Maintena__3214EC07562E0EDA");

            entity.Property(e => e.Notes)
                .HasMaxLength(500)
                .HasDefaultValue("");
            entity.Property(e => e.Type).HasConversion<byte>();

            entity.HasOne(d => d.Machine).WithMany(p => p.MaintenanceRecords)
                .HasForeignKey(d => d.MachineId)
                .HasConstraintName("FK_Maintenance_Machines");
        });

        modelBuilder.Entity<ProductionLog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Producti__3214EC0700724099");

            entity.Property(e => e.LoggedAt).HasDefaultValueSql("(getutcdate())");

            entity.HasOne(d => d.Machine).WithMany(p => p.ProductionLogs)
                .HasForeignKey(d => d.MachineId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Productio__Machi__4E88ABD4");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC079E4EAFD1");

            entity.HasIndex(e => e.Username, "UQ__Users__536C85E4290B7D3C").IsUnique();

            entity.Property(e => e.PasswordHash).HasMaxLength(200);
            entity.Property(e => e.Username).HasMaxLength(50);

            // Map UserRole enum to tinyint (byte) in the database to avoid InvalidCastException
            entity.Property(e => e.Role).HasConversion<byte>();
        });

        modelBuilder.Entity<WorkOrder>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__WorkOrde__3214EC073F4D5B82");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getutcdate())");
            entity.Property(e => e.RowVersion)
                .IsRowVersion()
                .IsConcurrencyToken();
            entity.Property(e => e.Status).HasConversion<byte>();
            entity.Property(e => e.Priority).HasConversion<byte>();

            entity.HasOne(d => d.AssignedToUser).WithMany(p => p.WorkOrders)
                .HasForeignKey(d => d.AssignedToUserId)
                .HasConstraintName("FK_WorkOrders_Users");

            entity.HasOne(d => d.Machine).WithMany(p => p.WorkOrders)
                .HasForeignKey(d => d.MachineId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_WorkOrders_Machines");
        });

        modelBuilder.Entity<WorkOrderInventoryItem>(entity =>
        {
            entity.HasKey(e => new { e.WorkOrderId, e.InventoryItemId }).HasName("PK__WorkOrde__BDCE7BDD582D1489");

            entity.HasOne(d => d.InventoryItem).WithMany(p => p.WorkOrderInventoryItems)
                .HasForeignKey(d => d.InventoryItemId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__WorkOrder__Inven__4AB81AF0");

            entity.HasOne(d => d.WorkOrder).WithMany(p => p.WorkOrderInventoryItems)
                .HasForeignKey(d => d.WorkOrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__WorkOrder__WorkO__49C3F6B7");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
