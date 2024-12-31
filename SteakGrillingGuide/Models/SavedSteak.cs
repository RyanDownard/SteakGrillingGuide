using SteakGrillingGuide.Enums;

namespace SteakGrillingGuide.Models;

public class SavedSteak
{
    public Guid SavedSteakId { get; set; }
    public string Name { get; set; }
    public CenterCook CenterCook { get; set; }
}
