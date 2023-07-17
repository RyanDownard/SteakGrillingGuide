

using Microsoft.AspNetCore.Components;
using MudBlazor;
using SteakGrillingGuide.Data;

namespace SteakGrillingGuide.Shared
{
    public partial class BeginTimerDialog
    {
        [CascadingParameter] 
        MudDialogInstance MudDialog { get; set; }
        [Parameter]
        public IEnumerable<Steaks> SteaksToPlaceAtStart { get; set; }
        [Parameter]
        public EventCallback StartTimer { get; set; }
        private async void Submit()
        {
             MudDialog.Close(DialogResult.Ok(true));
            await StartTimer.InvokeAsync();
        }
        void Cancel() => MudDialog.Cancel();
    }
}
