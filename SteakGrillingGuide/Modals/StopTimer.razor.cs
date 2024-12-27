using Microsoft.AspNetCore.Components;

namespace SteakGrillingGuide.Modals;

public partial class StopTimer
{
    [Parameter]
    public EventCallback StopTimerCallback { get; set; }

    private async void Submit()
    {
        await StopTimerCallback.InvokeAsync();
    }
}
