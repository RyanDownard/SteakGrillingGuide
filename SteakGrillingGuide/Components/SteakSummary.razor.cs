using Microsoft.AspNetCore.Components;
using SteakGrillingGuide.Models;

namespace SteakGrillingGuide.Components;

public partial class SteakSummary
{
    [Parameter]
    public Steak SteakToCook { get; set; }
    [Parameter]
    public int LongestTime { get; set; }
    [Parameter]
    public DateTime? StartTime { get; set; }
    [Parameter]
    public EventCallback<Steak> SaveSteak { get; set; }
    [Parameter]
    public EventCallback<Steak> EditSteak { get; set; }
    [Parameter]
    public EventCallback<Steak> DeleteSteak { get; set; }

    private async Task SaveSteakCallback()
    {
        await SaveSteak.InvokeAsync(SteakToCook);
    }

    private async Task EditSteakCallback()
    {
        await EditSteak.InvokeAsync(SteakToCook);
    }

    private async Task DeleteSteakCallback()
    {
        await DeleteSteak.InvokeAsync(SteakToCook);
    }
}
