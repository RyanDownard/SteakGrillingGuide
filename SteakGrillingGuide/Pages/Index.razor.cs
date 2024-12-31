using MudBlazor;
using SteakGrillingGuide.Data;
using Plugin.LocalNotification;
using System.Text.Json;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using SteakGrillingGuide.Models;

namespace SteakGrillingGuide.Pages;

public partial class Index
{
    [Inject]
    IDialogService DialogService { get; set; }
    [Inject]
    private AppLifecycleService lifecycleService { get; set; }
    [Inject]
    ISnackbar Snackbar { get; set; }
    [Inject]
    SteakService SteakService { get; set; }
    [Inject]
    IJSRuntime JSRunTime { get; set; }
    private DateTime? StartAt { get; set; }
    public DateTime? FinishAt { get; set; }
    private bool IgnoreInfoDialog = false;
    private bool RecoveringFromClose = false;
    private EventCallback OnTimerStarted { get; set; }
    private EventCallback OnTimerStopped { get; set; }

    private static System.Timers.Timer Timer { get; set; }

    private DateTime? SnackbarErrorsAt { get; set; } = null;

    private string SnackbarError { get; set; } = string.Empty;

    private bool RunComplete = false;
    private IJSObjectReference Module { get; set; }
    private Steak UpsertingSteak { get; set; }
    private bool RecoveryBeforeFinished { get; set; } = false;
    private IEnumerable<Steak> SteaksToStart { get; set; } = [];
    private Steak SteakToDelete { get; set; }

    protected override async Task OnInitializedAsync()
    {
        SteakService.OnChange += StateHasChanged;
        await SteakService.GetSavedSteaks();
        GenerateCallBacks();
    }

    public void Dispose()
    {
        SteakService.OnChange -= StateHasChanged;
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            lifecycleService.Resumed += () => HandleResume();
            lifecycleService.Paused += () => HandlePause();
            Module = await JSRunTime.InvokeAsync<IJSObjectReference>("import", "./js/bsModal.js");

            if (!RecoveringFromClose)
            {
                await DisplayInfoDialog();
            }
        }
    }

    private void HandlePause()
    {
        if (Timer != null)
        {
            Timer.Stop();
        }
    }

    private void HandleResume()
    {
        LocalNotificationCenter.Current.ClearAll();

        if (Timer != null)
        {
            Timer.Start();
        }
    }

    private void GenerateCallBacks()
    {
        OnTimerStarted = new EventCallback(this, () => StartTimer());
        OnTimerStopped = new EventCallback(this, () => StopTimer());
    }

    private async Task DisplayInfoDialog(bool manuallyCalled = false)
    {
        string GetWarningSet = await SecureStorage.Default.GetAsync("IgnoreInfoDialog");

        if (GetWarningSet != null)
        {
            _ = bool.TryParse(GetWarningSet, out IgnoreInfoDialog);
        }

        if (!IgnoreInfoDialog || manuallyCalled)
        {
            await Module!.InvokeVoidAsync("showModalById", "#suggestionsModal");
        }
    }

    private async Task EditSteak(Steak steakToEdit)
    {
        UpsertingSteak = steakToEdit;

        StateHasChanged();
        await Module!.InvokeVoidAsync("showModalById", "#upsertSteakModal");
    }

    private async Task ConfirmDeleteSteak(Steak steakToDelete)
    {
        SteakToDelete = steakToDelete;

        StateHasChanged();
        await Module.InvokeVoidAsync("showModalById", "#confirmDeleteModal");
    }

    private async Task StartTimer()
    {
        await Module!.InvokeVoidAsync("hideModalById", "#beginTimerModal");

        if (Timer == null || !Timer.Enabled)
        {
            var longestTime = SteakService.Steaks.Max(i => i.DurationSetting.TotalTime);

            if (!StartAt.HasValue || !FinishAt.HasValue)
            {
                StartAt = DateTime.Now;
                FinishAt = DateTime.Now.AddSeconds(longestTime);
            }

            foreach (var steak in SteakService.Steaks)
            {
                steak.SetStartTimes(longestTime, StartAt.Value);
            }

            await SteakService.GenerateNotifications(StartAt.Value, FinishAt.Value);

            await SteakService.SetRecoveryData(StartAt.Value, FinishAt.Value);

            Timer = new System.Timers.Timer(1000);
            Timer.Elapsed += CountDownTimer;
            Timer.Enabled = true;
        }
    }

    public async void CountDownTimer(Object source, System.Timers.ElapsedEventArgs e)
    {
        if (FinishAt >= DateTime.Now)
        {
            await ShowSnackbarNotifications();
        }
        else
        {
            Timer.Enabled = false;
            Timer = null;
            RunComplete = true;
            Snackbar.Add("Steaks are done!", Severity.Normal, config => { config.RequireInteraction = false; });
            SecureStorage.Default.Remove("ExistingGrillData");
        }

        await InvokeAsync(StateHasChanged);
    }

    private async Task ShowSnackbarNotifications()
    {
        bool steakNotificationUpdated = false;
        var toBePlaced = new List<string>();
        var toBeFlipped = new List<string>();

        foreach (var steak in SteakService.Steaks.Where(i => i.FirstSideStartTime < DateTime.Now && !i.StartNotificationShown))
        {
            steak.StartNotificationShown = true;
            steakNotificationUpdated = true;
            toBePlaced.Add($"{steak.Name}'s");
        }

        foreach (var steak in SteakService.Steaks.Where(i => i.SecondSideStartTime < DateTime.Now && !i.FlipNotificationShown))
        {
            steak.FlipNotificationShown = true;
            steakNotificationUpdated = true;
            toBeFlipped.Add($"{steak.Name}'s");
        }

        try
        {
            if (toBePlaced.Any())
            {
                Snackbar.Add($"Place {string.Join(", ", toBePlaced)} {(toBeFlipped.Count > 1 ? "steaks" : "steak")} on the grill!", Severity.Normal, config =>
                {
                    config.RequireInteraction = false;
                    config.VisibleStateDuration = 10000;
                    config.ShowTransitionDuration = 500;
                    config.HideTransitionDuration = 500;
                });
            }

            if (toBeFlipped.Any())
            {
                Snackbar.Add($"Flip {string.Join(", ", toBeFlipped)} {(toBeFlipped.Count > 1 ? "steaks" : "steak")}!", Severity.Normal, config =>
                {
                    config.RequireInteraction = false;
                    config.VisibleStateDuration = 10000;
                    config.ShowTransitionDuration = 500;
                    config.HideTransitionDuration = 500;
                });
            }
        }
        catch (Exception ex)
        {
            if (SnackbarErrorsAt == null && (toBePlaced.Any() || toBeFlipped.Any()))
            {
                SnackbarErrorsAt = DateTime.Now;
                string errorMessage = toBePlaced.Any() ? $"The following steaks need placed: <br/>{string.Join(", ", toBePlaced)}" : "";
                if (toBePlaced.Any() && toBePlaced.Any())
                {
                    errorMessage += $"\n\n";
                }
                errorMessage += toBeFlipped.Any() ? $"The following steaks need flipped: <br/>{string.Join(", ", toBeFlipped)}" : "";
                SnackbarError = $"An error occurred while displaying information. <br/><br/>{errorMessage}";
            }
        }

        if (SnackbarErrorsAt != null && DateTime.Now > SnackbarErrorsAt.Value.AddSeconds(20))
        {
            SnackbarErrorsAt = null;
            SnackbarError = string.Empty;
        }

        if (steakNotificationUpdated)
        {
            await SteakService.SetRecoveryData(StartAt.Value, FinishAt.Value);
        }
    }

    private async void OpenSteakDialog()
    {
        UpsertingSteak = new();

        await Module!.InvokeVoidAsync("showModalById", "#upsertSteakModal");
    }

    private async void OpenStopDialog()
    {
        await Module!.InvokeVoidAsync("showModalById", "#stopTimerModal");
    }

    private async void OpenStartDialog()
    {
        var longestTime = SteakService.Steaks.Max(i => i.DurationSetting.TotalTime);
        SteaksToStart = SteakService.Steaks.Where(i => i.DurationSetting.TotalTime == longestTime);

        await Module!.InvokeVoidAsync("showModalById", "#beginTimerModal");
    }

    private async Task HandleSteakRestore(RecoveryData recoveryData)
    {
        SteakService.SetSteaks(recoveryData.Steaks);
        StartAt = recoveryData.StartedAt;
        FinishAt = recoveryData.FinishesAt;

        await StartTimer();
        StateHasChanged();
    }

    private async Task StopTimer()
    {
        Timer.Enabled = false;
        Timer = null;
        StartAt = null;
        FinishAt = null;

        SteakService.UpdateAfterStopping();
        LocalNotificationCenter.Current.CancelAll();
        SteakService.RemoveRecoveryData();
        await Module!.InvokeVoidAsync("hideModalById", "#stopTimerModal");
    }

    private void ResetApp()
    {
        Timer = null;
        StartAt = null;
        FinishAt = null;
        RunComplete = false;

        SteakService.RemoveRecoveryData();
        SteakService.ClearSteaks();
    }
}
