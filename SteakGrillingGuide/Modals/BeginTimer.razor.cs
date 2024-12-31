using Microsoft.AspNetCore.Components;
using Plugin.LocalNotification;
using SteakGrillingGuide.Data;
using SteakGrillingGuide.Models;

namespace SteakGrillingGuide.Modals;

public partial class BeginTimer
{
    [Inject]
    private AppLifecycleService lifecycleService { get; set; }
    [Inject]
    protected SteakService SteakService { get; set; }
    [Parameter]
    public EventCallback StartTimer { get; set; }

    protected bool NotificationsEnabled { get; set; } = false;

    protected override async Task OnInitializedAsync()
    {
        SteakService.OnChange += StateHasChanged;

        await CheckNotificationPermissions();
    }

    public void Dispose()
    {
        SteakService.OnChange -= StateHasChanged;
    }

    protected override Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            lifecycleService.Resumed += async () => await CheckNotificationPermissions();
        }
        return base.OnAfterRenderAsync(firstRender);
    }

    protected async Task CheckNotificationPermissions()
    {
        NotificationsEnabled = await LocalNotificationCenter.Current.AreNotificationsEnabled();
        if (!NotificationsEnabled)
        {
            var permissionResults = await LocalNotificationCenter.Current.RequestNotificationPermission();
            NotificationsEnabled = permissionResults;
        }
        StateHasChanged();
    }

    protected async void Submit()
    {
        await StartTimer.InvokeAsync();
    }
}
