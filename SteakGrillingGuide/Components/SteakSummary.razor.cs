using Microsoft.AspNetCore.Components;
using SteakGrillingGuide.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SteakGrillingGuide.Components
{
    public partial class SteakSummary
    {
        [Parameter]
        public Steaks SteakToCook { get; set; }
        [Parameter]
        public double LongestTime { get; set; }
        [Parameter]
        public int Counter { get; set; }

        private double SideOneInSeconds { get; set; }
        private double SideTwoInSeconds { get; set; }

        protected override Task OnInitializedAsync()
        {
            SideOneInSeconds = SteakToCook.DurationSetting.FirstSide * 60;
            SideTwoInSeconds = SteakToCook.DurationSetting.SecondSide * 60;
            return base.OnInitializedAsync();
        }

        public void OnSwipe(MudBlazor.SwipeDirection direction)
        {
            if (direction == MudBlazor.SwipeDirection.RightToLeft && !SteakToCook.ShowDeleteDrawer)
            {
                SteakToCook.ShowDeleteDrawer = true;
                StateHasChanged();
            }
            else if (direction == MudBlazor.SwipeDirection.LeftToRight && SteakToCook.ShowDeleteDrawer)
            {
                SteakToCook.ShowDeleteDrawer = false;
                StateHasChanged();
            }
        }
    }
}
