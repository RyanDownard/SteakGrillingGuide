
namespace SteakGrillingGuide.Models;

public class DurationSettings
{
    public double Thickness { get; set; }
    public int FirstSide { get; set; }
    public int SecondSide { get; set; }
    public int TotalTime => FirstSide + SecondSide;
}
