using Microsoft.AspNetCore.Components;
using MudBlazor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SteakGrillingGuide.Shared
{
    public partial class AppCrashedDialog
    {
        [CascadingParameter]
        MudDialogInstance MudDialog { get; set; }
        [Parameter, EditorRequired]
        public bool BeforeFinish { get; set; }
        [Parameter, EditorRequired]
        public EventCallback<bool> HandleDecision { get; set; }

        private async Task Submit()
        {
            await HandleDecision.InvokeAsync(true);
            MudDialog.Close();
        }

        private async Task Cancel()
        {
            await HandleDecision.InvokeAsync(false);
            MudDialog.Cancel();
        }
    }
}
