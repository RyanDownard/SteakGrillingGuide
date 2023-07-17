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
        public double FirstSide { get; set; }
        public double SecondSide { get; set; }
        public double TotalTime => FirstSide + SecondSide;
    }
}
