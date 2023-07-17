using Microsoft.AspNetCore.Components;
using Microsoft.Maui;
using MudBlazor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SteakGrillingGuide.Shared
{
    public partial class AppInfoDialog
    {
        [CascadingParameter] 
        MudDialogInstance MudDialog { get; set; }

        void Submit() => MudDialog.Cancel();

        private async Task ShowDialogPreferenceChanged(bool value)
        {
            await SecureStorage.Default.SetAsync("IgnoreInfoDialog", value.ToString());
        }
    }
}
