using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SteakGrillingGuide.Data
{
    public class SteakSettings
    {
        public CookingStyle CookingStyle { get; set; }
        public IEnumerable<DurationSettings> Durations { get; set; }
    }
}
