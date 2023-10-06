using Microsoft.AspNetCore.Components;
using MudBlazor;
using Plugin.LocalNotification;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SteakGrillingGuide.Shared
{
    public partial class StopTimerDialog
    {
        [CascadingParameter]
        MudDialogInstance MudDialog { get; set; }
        [Parameter]
        public EventCallback StopTimer { get; set; }

        private async void Submit()
        {
            MudDialog.Close(DialogResult.Ok(true));
            await StopTimer.InvokeAsync();
        }
        void Cancel() => MudDialog.Cancel();
    }
}
