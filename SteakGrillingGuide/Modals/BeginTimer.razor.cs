using Microsoft.AspNetCore.Components;
using Plugin.LocalNotification;
using SteakGrillingGuide.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SteakGrillingGuide.Modals;

public partial class BeginTimer
{
    [Inject]
    private AppLifecycleService lifecycleService { get; set; }
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
        await StartTimer.InvokeAsync();
    }
}
