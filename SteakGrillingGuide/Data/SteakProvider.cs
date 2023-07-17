using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace SteakGrillingGuide.Data
{
    public class SteakProvider
    {
        public readonly List<SteakSettings> SteakSettings = new List<SteakSettings>();
        public readonly List<double> Thicknesses = new List<double> { .5, .75, 1.0, 1.25, 1.5, 1.75, 2.0 };
        public SteakProvider()
        {
            try
            {
                var settingSetup = new SteakSettings
                {
                    CookingStyle = CookingStyle.Rare,
                    Durations = new List<DurationSettings>()
                    {
                    //rare 
                    new DurationSettings{ Thickness = Thicknesses[0], FirstSide = 2, SecondSide = 2 },
                    new DurationSettings{ Thickness = Thicknesses[1], FirstSide = 4, SecondSide = 2 },
                    new DurationSettings{ Thickness = Thicknesses[2], FirstSide = 5, SecondSide = 3 },
                    new DurationSettings{ Thickness = Thicknesses[3], FirstSide = 5, SecondSide = 4 },
                    new DurationSettings{ Thickness = Thicknesses[4], FirstSide = 6, SecondSide = 4 },
                    new DurationSettings{ Thickness = Thicknesses[5], FirstSide = 7, SecondSide = 5 },
                    new DurationSettings{ Thickness = Thicknesses[6], FirstSide = 8, SecondSide = 6 },
                    }
                };
                SteakSettings.Add(settingSetup);

                settingSetup = new SteakSettings
                {
                    CookingStyle = CookingStyle.MediumRare,
                    Durations = new List<DurationSettings>()
                    {
                    //rare 
                    new DurationSettings{ Thickness = Thicknesses[0], FirstSide = 3, SecondSide = 2 },
                    new DurationSettings{ Thickness = Thicknesses[1], FirstSide = 4, SecondSide = 3 },
                    new DurationSettings{ Thickness = Thicknesses[2], FirstSide = 5, SecondSide = 4 },
                    new DurationSettings{ Thickness = Thicknesses[3], FirstSide = 6, SecondSide = 5 },
                    new DurationSettings{ Thickness = Thicknesses[4], FirstSide = 7, SecondSide = 5 },
                    new DurationSettings{ Thickness = Thicknesses[5], FirstSide = 8, SecondSide = 6 },
                    new DurationSettings{ Thickness = Thicknesses[6], FirstSide = 9, SecondSide = 8 },
                    }
                };
                SteakSettings.Add(settingSetup);

                settingSetup = new SteakSettings
                {
                    CookingStyle = CookingStyle.Medium,
                    Durations = new List<DurationSettings>()
                    {
                    //rare 
                    new DurationSettings{ Thickness = Thicknesses[0], FirstSide = 4, SecondSide = 2 },
                    new DurationSettings{ Thickness = Thicknesses[1], FirstSide = 5, SecondSide = 3 },
                    new DurationSettings{ Thickness = Thicknesses[2], FirstSide = 6, SecondSide = 4 },
                    new DurationSettings{ Thickness = Thicknesses[3], FirstSide = 7, SecondSide = 5 },
                    new DurationSettings{ Thickness = Thicknesses[4], FirstSide = 7, SecondSide = 6 },
                    new DurationSettings{ Thickness = Thicknesses[5], FirstSide = 8, SecondSide = 7 },
                    new DurationSettings{ Thickness = Thicknesses[6], FirstSide = 10, SecondSide = 8 },
                    }
                };
                SteakSettings.Add(settingSetup);

                settingSetup = new SteakSettings
                {
                    CookingStyle = CookingStyle.WellDone,
                    Durations = new List<DurationSettings>()
                    {
                    //rare 
                    new DurationSettings{ Thickness = Thicknesses[0], FirstSide = 5, SecondSide = 3 },
                    new DurationSettings{ Thickness = Thicknesses[1], FirstSide = 7, SecondSide = 5 },
                    new DurationSettings{ Thickness = Thicknesses[2], FirstSide = 8, SecondSide = 6 },
                    new DurationSettings{ Thickness = Thicknesses[3], FirstSide = 9, SecondSide = 7 },
                    new DurationSettings{ Thickness = Thicknesses[4], FirstSide = 10, SecondSide = 8 },
                    new DurationSettings{ Thickness = Thicknesses[5], FirstSide = 11, SecondSide = 9 },
                    new DurationSettings{ Thickness = Thicknesses[6], FirstSide = 13, SecondSide = 11 },
                    }
                };
                SteakSettings.Add(settingSetup);
            }
            catch (Exception ex)
            {

            }
        }
    }
}
