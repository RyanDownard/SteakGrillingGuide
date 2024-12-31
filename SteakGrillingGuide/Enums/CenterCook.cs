using System.ComponentModel;

namespace SteakGrillingGuide.Enums;

public enum CenterCook
{
    [Description("Rare")]
    Rare = 0,
    [Description("Medium Rare")]
    MediumRare = 1,
    [Description("Medium")]
    Medium = 2,
    [Description("Medium Well")]
    MediumWell = 3,
    [Description("Well Done")]
    WellDone = 4
}
