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
                    new DurationSettings{ Thickness = Thicknesses[0], FirstSide = 120, SecondSide = 120 },
                    new DurationSettings{ Thickness = Thicknesses[1], FirstSide = 240, SecondSide = 120 },
                    new DurationSettings{ Thickness = Thicknesses[2], FirstSide = 300, SecondSide = 180 },
                    new DurationSettings{ Thickness = Thicknesses[3], FirstSide = 300, SecondSide = 240 },
                    new DurationSettings{ Thickness = Thicknesses[4], FirstSide = 360, SecondSide = 240 },
                    new DurationSettings{ Thickness = Thicknesses[5], FirstSide = 420, SecondSide = 300 },
                    new DurationSettings{ Thickness = Thicknesses[6], FirstSide = 480, SecondSide = 360 },
                    }
                };
                SteakSettings.Add(settingSetup);

                settingSetup = new SteakSettings
                {
                    CookingStyle = CookingStyle.MediumRare,
                    Durations = new List<DurationSettings>()
                    {
                    new DurationSettings{ Thickness = Thicknesses[0], FirstSide = 180, SecondSide = 120 },
                    new DurationSettings{ Thickness = Thicknesses[1], FirstSide = 240, SecondSide = 180 },
                    new DurationSettings{ Thickness = Thicknesses[2], FirstSide = 300, SecondSide = 240 },
                    new DurationSettings{ Thickness = Thicknesses[3], FirstSide = 360, SecondSide = 300 },
                    new DurationSettings{ Thickness = Thicknesses[4], FirstSide = 420, SecondSide = 300 },
                    new DurationSettings{ Thickness = Thicknesses[5], FirstSide = 480, SecondSide = 360 },
                    new DurationSettings{ Thickness = Thicknesses[6], FirstSide = 540, SecondSide = 480 },
                    }
                };
                SteakSettings.Add(settingSetup);

                settingSetup = new SteakSettings
                {
                    CookingStyle = CookingStyle.Medium,
                    Durations = new List<DurationSettings>()
                    {
                    new DurationSettings{ Thickness = Thicknesses[0], FirstSide = 240, SecondSide = 120 },
                    new DurationSettings{ Thickness = Thicknesses[1], FirstSide = 300, SecondSide = 180 },
                    new DurationSettings{ Thickness = Thicknesses[2], FirstSide = 360, SecondSide = 240 },
                    new DurationSettings{ Thickness = Thicknesses[3], FirstSide = 420, SecondSide = 300 },
                    new DurationSettings{ Thickness = Thicknesses[4], FirstSide = 420, SecondSide = 360 },
                    new DurationSettings{ Thickness = Thicknesses[5], FirstSide = 420, SecondSide = 420 },
                    new DurationSettings{ Thickness = Thicknesses[6], FirstSide = 600, SecondSide = 480 },
                    }
                };
                SteakSettings.Add(settingSetup);

                settingSetup = new SteakSettings
                {
                    CookingStyle = CookingStyle.MediumWell,
                    Durations = new List<DurationSettings>()
                    {
                    new DurationSettings{ Thickness = Thicknesses[0], FirstSide = 240, SecondSide = 180 },
                    new DurationSettings{ Thickness = Thicknesses[1], FirstSide = 360, SecondSide = 240 },
                    new DurationSettings{ Thickness = Thicknesses[2], FirstSide = 420, SecondSide = 300 },
                    new DurationSettings{ Thickness = Thicknesses[3], FirstSide = 480, SecondSide = 360 },
                    new DurationSettings{ Thickness = Thicknesses[4], FirstSide = 480, SecondSide = 420 },
                    new DurationSettings{ Thickness = Thicknesses[5], FirstSide = 600, SecondSide = 480 },
                    new DurationSettings{ Thickness = Thicknesses[6], FirstSide = 720, SecondSide = 540 },
                    }
                };
                SteakSettings.Add(settingSetup);

                settingSetup = new SteakSettings
                {
                    CookingStyle = CookingStyle.WellDone,
                    Durations = new List<DurationSettings>()
                    {
                    new DurationSettings{ Thickness = Thicknesses[0], FirstSide = 300, SecondSide = 180 },
                    new DurationSettings{ Thickness = Thicknesses[1], FirstSide = 420, SecondSide = 300 },
                    new DurationSettings{ Thickness = Thicknesses[2], FirstSide = 480, SecondSide = 360 },
                    new DurationSettings{ Thickness = Thicknesses[3], FirstSide = 540, SecondSide = 420 },
                    new DurationSettings{ Thickness = Thicknesses[4], FirstSide = 600, SecondSide = 480 },
                    new DurationSettings{ Thickness = Thicknesses[5], FirstSide = 660, SecondSide = 540 },
                    new DurationSettings{ Thickness = Thicknesses[6], FirstSide = 780, SecondSide = 660 },
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
