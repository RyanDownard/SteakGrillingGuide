using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SteakGrillingGuide.Data
{
    public class DurationSettings
    {
        public double Thickness { get; set; }
        public int FirstSide { get; set; }
        public int SecondSide { get; set; }
        public int TotalTime => FirstSide + SecondSide;
    }
}
