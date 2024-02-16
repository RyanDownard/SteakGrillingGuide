
using System.Diagnostics.Metrics;

namespace SteakGrillingGuide.Data;

public class Steak
{
    public string Name { get; set; }
    public DateTime? FirstSideStartTime { get; set; }
    public DateTime? SecondSideStartTime { get; set; }
    public double Thickness { get; set; }
    public CookingStyle CookingStyle { get; set; }
    public DurationSettings DurationSetting { get; set; }
    public bool ShowDetails { get; set; } = false;
    public bool StartNotificationShown { get; set; } = false;
    public bool FlipNotificationShown { get; set; } = false;
    public SavedSteak SavedSteak { get; set; }

    public void SetStartTimes(int LongestTime, DateTime startingAt)
    {
        if (LongestTime == DurationSetting.TotalTime)
        {
            FirstSideStartTime = startingAt;
            SecondSideStartTime = startingAt.AddSeconds(DurationSetting.FirstSide);
        }
        else
        {
            var offset = LongestTime - DurationSetting.TotalTime;
            FirstSideStartTime = startingAt.AddSeconds(offset);
            SecondSideStartTime = startingAt.AddSeconds(offset + (DurationSetting.FirstSide));
        }
    }

    public double GetFirstSidePercentage()
    {
        double percentage = 0;
        //steak is not ready for the grill yet
        if (DateTime.Now < FirstSideStartTime)
        {
            percentage = 100;
        }
        //everything is done, yay!
        else if (DateTime.Now > SecondSideStartTime)
        {
            percentage = 0;
        }
        else
        {
            var totalTime = SecondSideStartTime - FirstSideStartTime;
            var timeDifference = DateTime.Now - FirstSideStartTime;
            percentage = 100 - Math.Round((timeDifference.Value.TotalSeconds / totalTime.Value.TotalSeconds) * 100, MidpointRounding.AwayFromZero);
        }
        return percentage;
    }

    public double GetSecondSidePercentage()
    {
        double percentage = 0;
        //steak is not ready for the grill yet
        if (DateTime.Now < SecondSideStartTime)
        {
            percentage = 100;
        }
        //everything is done, yay!
        else if ((DateTime.Now - SecondSideStartTime).Value.TotalSeconds > DurationSetting.SecondSide)
        {
            percentage = 0;
        }
        else
        {
            var timeDifference = DateTime.Now - SecondSideStartTime;
            percentage = 100 - Math.Round((timeDifference.Value.TotalSeconds / DurationSetting.SecondSide) * 100, MidpointRounding.AwayFromZero);
        }
        return percentage;
    }

    public double GetWaitPercentange(DateTime startTime)
    {

        if (DateTime.Now >= FirstSideStartTime)
        {
            return 0;
        }
        else
        {
            var totalWait = (FirstSideStartTime.Value - startTime).TotalSeconds;
            var totalLeft = (FirstSideStartTime.Value - DateTime.Now).TotalSeconds;
            return Math.Round((totalLeft / totalWait) * 100, MidpointRounding.AwayFromZero);
        }
    }

    public void ToggleDetails()
    {
        ShowDetails  = !ShowDetails;
    }
}
