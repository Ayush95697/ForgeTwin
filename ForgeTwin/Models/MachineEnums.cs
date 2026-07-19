namespace ForgeTwin.Models
{
    public enum MachineStatus : byte
    {
        Running = 0,
        Idle = 1,
        Down = 2,
        UnderMaintenance = 3
    }

    public enum MachineType
    {
        Mechanical,
        Electrical,
        Hydraulic,
        Pneumatic,
        Other
    }
    public enum MaintenanceType : byte
    {
        Preventive,
        Corrective
    }

    public enum WorkOrderStatus : byte
    {
        Open = 0,
        InProgress = 1,
        Completed = 2,
        Cancelled = 3
    }

    public enum WorkOrderPriority : byte
    {
        Low = 0,
        Medium = 1,
        High = 2,
        Critical = 3
    }

    public enum UserRole : byte
    {
        Administrator = 0,
        Supervisor = 1,
        Technician = 2
    }
}
