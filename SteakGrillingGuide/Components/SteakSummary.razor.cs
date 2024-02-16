using Microsoft.AspNetCore.Components;
using MudBlazor;
using SteakGrillingGuide.Data;
using SteakGrillingGuide.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SteakGrillingGuide.Components
{
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

        [Inject]
        IDialogService? DialogService { get; set; }

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
            var response = await DialogService.ShowMessageBox("Delete Steak?", $"Are you sure you want to delete {SteakToCook.Name}?", "Yes", "No");
            if (response.Value)
            {
                await DeleteSteak.InvokeAsync(SteakToCook);
            }
        }
    }
}
