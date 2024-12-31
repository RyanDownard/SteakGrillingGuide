using SteakGrillingGuide.Enums;

namespace SteakGrillingGuide.Models;

public class SteakSettings
{
    public CenterCook CenterCook { get; set; }
    public IEnumerable<DurationSettings> Durations { get; set; }
}
