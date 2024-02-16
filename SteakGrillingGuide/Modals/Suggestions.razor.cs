using Microsoft.AspNetCore.Components;
using MudBlazor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SteakGrillingGuide.Modals
{
    public partial class Suggestions
    { 
        private bool DontShowOnStart = false;
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
