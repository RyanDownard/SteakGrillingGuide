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

        private bool DontShowOnStart = false;

        void Submit() => MudDialog.Cancel();

        protected override async Task OnInitializedAsync()
        {
            string GetWarningSet = await SecureStorage.Default.GetAsync("IgnoreInfoDialog");
            if (GetWarningSet != null)
            {
                _ = bool.TryParse(GetWarningSet, out DontShowOnStart);
            }
        }

        private async Task ShowDialogPreferenceChanged(bool value)
        {
            DontShowOnStart = value;
            await SecureStorage.Default.SetAsync("IgnoreInfoDialog", value.ToString());
        }
    }
}
