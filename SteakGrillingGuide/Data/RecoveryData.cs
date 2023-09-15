using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SteakGrillingGuide.Data
{
    public class RecoveryData
    {
        public DateTime StartedAt { get; set; }
        public DateTime FinishesAt { get; set; }
        public List<Steak> Steaks { get; set; } 
    }
}
