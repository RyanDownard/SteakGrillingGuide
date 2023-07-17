using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SteakGrillingGuide.Data
{
    public enum CookingStyle
    {
        [Description("Rare")]
        Rare = 0,
        [Description("Medium Rare")]
        MediumRare = 1,
        [Description("Medium")]
        Medium = 2,
        [Description("Well Done")]
        WellDone = 3
    }
}
