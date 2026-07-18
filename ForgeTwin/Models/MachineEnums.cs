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
    public enum MaintenanceType
    {
        Preventive,
        Corrective
    }
}