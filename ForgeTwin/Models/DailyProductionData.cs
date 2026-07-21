using System;

namespace ForgeTwin.Models
{
    public class DailyProductionData
    {
        public DateTime Date { get; set; }
        public int UnitsProduced { get; set; }
        public int DefectCount { get; set; }
    }
}
