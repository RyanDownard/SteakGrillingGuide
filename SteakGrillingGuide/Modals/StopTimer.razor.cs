using Microsoft.AspNetCore.Components;
using MudBlazor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
