using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using MudBlazor;
using SteakGrillingGuide.Data;
using SteakGrillingGuide.Models;

namespace SteakGrillingGuide.Components;

public partial class SteakSummary
{
    [Inject]
    protected ISnackbar Snackbar { get; set; }
    [Inject]
    protected SteakService SteakService { get; set; }
    [Inject]
    protected IJSRuntime JSRuntime { get; set; }
    protected IJSObjectReference Module { get; set; }
    [Parameter]
    public Steak SteakToCook { get; set; }
    [Parameter]
    public int LongestTime { get; set; }
    [Parameter]
    public DateTime? StartTime { get; set; }
    [Parameter]
    public Func<Steak, Task> EditSteak { get; set; }
    [Parameter]
    public Func<Steak, Task> DeleteSteak { get; set; }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            Module = await JSRuntime.InvokeAsync<IJSObjectReference>("import", "./js/bsModal.js");
        }
    }

    protected async Task SaveSteakCallback()
    {
        var saved = await SteakService.SavePersonSteak(SteakToCook);

        if (saved != null)
        {
            SteakToCook.SavedSteak = saved;
            Snackbar.Add($"{SteakToCook.Name} saved to device!", Severity.Normal, config =>
            {
                config.RequireInteraction = false;
                config.VisibleStateDuration = 10000;
                config.ShowTransitionDuration = 500;
                config.HideTransitionDuration = 500;
            });
        }
        else
        {
            Snackbar.Add($"Failed {SteakToCook.Name} saved to device, please try again", Severity.Error, config =>
            {
                config.RequireInteraction = false;
                config.VisibleStateDuration = 10000;
                config.ShowTransitionDuration = 500;
                config.HideTransitionDuration = 500;
            });
        }

        StateHasChanged();
    }

    protected async Task EditSteakCallback()
    {
        await EditSteak.Invoke(SteakToCook);
    }

    protected async Task DeleteSteakCallback()
    {
        await DeleteSteak.Invoke(SteakToCook);
    }
}
