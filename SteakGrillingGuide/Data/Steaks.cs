
namespace SteakGrillingGuide.Data;

public class Steak
{
    public string Name { get; set; }
    public int FirstSideStartTime { get; set; }
    public int SecondSideStartTime { get; set; }
    public bool ShowDetails { get; set; } = false;
    public bool ShowDeleteDrawer { get; set; } = false;
    public int StartNotificationId { get; set; }
    public int FlipNotificationId { get; set; }
    public double Thickness { get; set; }
    public CookingStyle CookingStyle { get; set; }
    public DurationSettings DurationSetting { get; set; }


    public void SetStartTimes(int LongestTime)
    {
        if(LongestTime == DurationSetting.TotalTime)
        {
            FirstSideStartTime = LongestTime;
            SecondSideStartTime = (DurationSetting.TotalTime) - (DurationSetting.FirstSide); 
        }
        else
        {
            FirstSideStartTime = (DurationSetting.TotalTime) % (LongestTime);
            var offset = (DurationSetting.TotalTime) % (LongestTime);
            SecondSideStartTime = offset - (DurationSetting.FirstSide);
        }
    }

    public double GetFirstSidePercentage(int counter, int totalTime)
    {
        double percentage = 0;
        //steak is not ready for the grill yet
        if (counter > FirstSideStartTime)
        {
            percentage = 100;
        }
        //everything is done, yay!
        else if (counter <= SecondSideStartTime)
        {
            percentage = 0;
        }
        else
        {
            percentage = Math.Round(((double)(counter - DurationSetting.SecondSide) / DurationSetting.FirstSide) * 100, MidpointRounding.AwayFromZero);
        }
        return percentage;
    }

    public double GetSecondSidePercentage(int counter, double totalTime)
    {
        double percentage = 0;
        //steak is not ready for the grill yet
        if (counter > SecondSideStartTime)
        {
            percentage = 100;
        }
        //everything is done, yay!
        else if (counter == totalTime)
        {
            percentage = 0;
        }
        else
        {
            percentage = Math.Round(((double)counter / DurationSetting.SecondSide) * 100, MidpointRounding.AwayFromZero);
        }
        return percentage;
    }

    public double GetWaitPercentange(int counter, double longestTime)
    {
        if(longestTime == DurationSetting.TotalTime || counter <= FirstSideStartTime)
        {
            return 0;
        }
        else
        {
            var totalWait = (longestTime) - FirstSideStartTime;
            var remaining = counter - FirstSideStartTime;
            return Math.Round((remaining / totalWait) * 100, MidpointRounding.AwayFromZero);
        }
    }

    public void ToggleDetails()
    {
        ShowDetails  = !ShowDetails;
    }
}
