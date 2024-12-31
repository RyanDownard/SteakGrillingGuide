namespace SteakGrillingGuide.Models;

public class RecoveryData
{
    public DateTime StartedAt { get; set; }
    public DateTime FinishesAt { get; set; }
    public List<Steak> Steaks { get; set; }
}
