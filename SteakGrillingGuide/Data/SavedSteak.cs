using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SteakGrillingGuide.Data
{
    public class SavedSteak
    {
        public Guid SavedSteakId { get; set; }
        public string Name { get; set; }
        public CookingStyle CookingStyle { get; set; } 
    }
}
