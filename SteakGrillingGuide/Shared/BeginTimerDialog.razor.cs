

using Microsoft.AspNetCore.Components;
using MudBlazor;
using Plugin.LocalNotification;
using SteakGrillingGuide.Data;

namespace SteakGrillingGuide.Shared
{
    public partial class BeginTimerDialog
    {
        [Inject]
        private AppLifecycleService lifecycleService { get; set; }
        [CascadingParameter] 
        MudDialogInstance MudDialog { get; set; }
        [Parameter]
        public IEnumerable<Steak> SteaksToPlaceAtStart { get; set; }
        [Parameter]
        public EventCallback StartTimer { get; set; }

        private bool NotificationsEnabled { get; set; } = false;
         
        protected override async Task OnInitializedAsync()
        {
            await CheckNotificationPermissions();
        }

        protected override Task OnAfterRenderAsync(bool firstRender)
        {
            if (firstRender)
            {
                lifecycleService.Resumed += async () => await CheckNotificationPermissions();
            }
            return base.OnAfterRenderAsync(firstRender);
        }

        private async Task CheckNotificationPermissions() 
        {
            NotificationsEnabled = await LocalNotificationCenter.Current.AreNotificationsEnabled();
            if (!NotificationsEnabled)
            {
                var permissionResults = await LocalNotificationCenter.Current.RequestNotificationPermission();
                NotificationsEnabled = permissionResults;
            }
            StateHasChanged();
        }

        private async void Submit()
        {
             MudDialog.Close(DialogResult.Ok(true));
            await StartTimer.InvokeAsync();
        }
        void Cancel() => MudDialog.Cancel();
    }
}
