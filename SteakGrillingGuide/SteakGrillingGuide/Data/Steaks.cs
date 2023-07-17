
namespace SteakGrillingGuide.Data;

public class Steaks
{
    public string Name { get; set; }
    public double FirstSideStartTime { get; set; }
    public double SecondSideStartTime { get; set; }
    public bool ShowDetails { get; set; } = false;
    public bool ShowDeleteDrawer { get; set; } = false;
    public double Thickness { get; set; }
    public CookingStyle CookingStyle { get; set; }
    public DurationSettings DurationSetting { get; set; }


    public void SetStartTimes(double LongestTime)
    {
        if(LongestTime == DurationSetting.TotalTime)
        {
            FirstSideStartTime = LongestTime * 60;
            SecondSideStartTime = (DurationSetting.TotalTime * 60) - (DurationSetting.FirstSide * 60); 
        }
        else
        {
            FirstSideStartTime = (DurationSetting.TotalTime * 60) % (LongestTime * 60);
            var offset = (DurationSetting.TotalTime * 60) % (LongestTime * 60);
            SecondSideStartTime = offset - (DurationSetting.FirstSide * 60);
        }
    }

    public double GetFirstSidePercentage(int counter, double totalTime)
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
            percentage = Math.Round(((counter - (DurationSetting.SecondSide * 60)) / (DurationSetting.FirstSide * 60)) * 100, MidpointRounding.AwayFromZero);
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
            percentage = Math.Round((counter / (DurationSetting.SecondSide * 60)) * 100, MidpointRounding.AwayFromZero);
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
            var totalWait = (longestTime * 60) - FirstSideStartTime;
            var remaining = counter - FirstSideStartTime;
            return Math.Round((remaining / totalWait) * 100, MidpointRounding.AwayFromZero);
        }
    }

    public void ToggleDetails()
    {
        ShowDetails  = !ShowDetails;
    }
}
