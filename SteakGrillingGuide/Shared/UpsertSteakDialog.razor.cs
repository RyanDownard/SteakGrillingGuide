using EnumsNET;
using Microsoft.AspNetCore.Components;
using Microsoft.Maui.Layouts;
using MudBlazor;
using SteakGrillingGuide.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SteakGrillingGuide.Shared
{
    public partial class  UpsertSteakDialog
    {
        [CascadingParameter]
        MudDialogInstance MudDialog { get; set; }

        [Parameter] 
        public EventCallback<Steak> AddSteak { get; set; }
        [Parameter]
        public Steak Steak { get; set; } = new Steak();

        [Inject]
        protected SteakProvider SteakProvider { get; set; }

        IEnumerable<double> Thicknesses { get; set; }

        protected bool IsValid { get; set; } = true;

        protected double? Thickness { get; set; } = null;
        protected int? CookedStyle { get; set; } = null;



        protected override Task OnInitializedAsync()
        {
            Thicknesses = SteakProvider.Thicknesses;
            if (!string.IsNullOrWhiteSpace(Steak.Name))
            {
                Thickness = Steak.Thickness;
                CookedStyle = (int)Steak.CookingStyle;
            }
            return base.OnInitializedAsync();
        }

        private async Task Submit()
        {
            try
            {
                if (Thickness == null || CookedStyle == null)
                {
                    IsValid = false;
                    return;
                }
                IsValid = true;
                Steak.Thickness = Thickness.Value;
                Steak.CookingStyle = (CookingStyle)CookedStyle.Value;
                Steak.DurationSetting = SteakProvider.SteakSettings.First(i => i.CookingStyle == Steak.CookingStyle).Durations.First(i => i.Thickness == Steak.Thickness);
                await AddSteak.InvokeAsync(Steak);
                MudDialog.Close(DialogResult.Ok(true));
            }
            catch(Exception ex)
            {
                IsValid = false;
                return;
            }
        }
        void Cancel() => MudDialog.Cancel();
    }
}
