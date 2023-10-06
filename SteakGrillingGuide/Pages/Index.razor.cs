using MudBlazor;
using SteakGrillingGuide.Data;
using Plugin.LocalNotification;
using System.Text.Json;
using Microsoft.AspNetCore.Components;
using SteakGrillingGuide.Shared;

namespace SteakGrillingGuide.Pages
{
    public partial class Index
    {
        [Inject]
        IDialogService DialogService { get; set; }

        [Inject]
        ISnackbar Snackbar { get; set; }
        private List<int> NotificationIds { get; set; } = new();
        private List<Steak> Steaks { get; set; } = new();
        private RecoveryData? RecoveryData { get; set; }
        private DateTime? StartAt { get; set; }
        public DateTime? FinishAt { get; set; }
        private int LongestTime { get; set; }
        private bool IgnoreInfoDialog = false;
        private bool RecoveringFromClose = false;
        private EventCallback<Steak> OnSteakAdded { get; set; }
        private EventCallback<Steak> OnSteakEdited { get; set; }
        private EventCallback<Steak> OnSteakDeleted { get; set; }
        private EventCallback<bool> OnRestored { get; set; }
        private EventCallback OnTimerStarted { get; set; }
        private EventCallback OnTimerStopped { get; set; }

        private static System.Timers.Timer Timer { get; set; }

        protected async override Task OnInitializedAsync()
        {
            OnSteakAdded = new EventCallback<Steak>(this, (Steak steak) => HandleSteakAdded(steak));
            OnSteakEdited = new EventCallback<Steak>(this, (Steak steak) => HandleSteakEdited(steak));
            OnSteakDeleted = new EventCallback<Steak>(this, (Steak steak) => HandleSteakDeleted(steak));
            OnRestored = new EventCallback<bool>(this, (bool restore) => HandleSteakRestore(restore));
            OnTimerStarted = new EventCallback(this, () => StartTimer());
            OnTimerStopped = new EventCallback(this, () => StopTimer());
            await HandleRecoveryNeeded();
            if (!RecoveringFromClose)
            {
                await DisplayInfoDialog();
            }
        }

        private async Task HandleRecoveryNeeded()
        {

            string storedRecovery = await SecureStorage.Default.GetAsync("ExistingGrillData");
            if (!string.IsNullOrWhiteSpace(storedRecovery))
            {
                RecoveryData = JsonSerializer.Deserialize<RecoveryData>(storedRecovery);
                var options = new DialogOptions { DisableBackdropClick = true };
                var parameters = new DialogParameters { ["BeforeFinish"] = RecoveryData.FinishesAt > DateTime.Now, ["HandleDecision"] = OnRestored };
                DialogService.Show<AppCrashedDialog>("Restore?", parameters, options);

            }
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
                DialogService.Show<AppInfoDialog>();
            }
        }

        private void UpdateTimingInfo()
        {
            if (Steaks.Any())
            {
                LongestTime = Steaks.Max(i => i.DurationSetting.TotalTime);
            }
            else
            {
                LongestTime = 0;
            }
        }

        private async Task HandleSteakAdded(Steak addedSteak)
        {
            if (string.IsNullOrWhiteSpace(addedSteak.Name))
            {
                addedSteak.Name = $"Steak {Steaks.Count + 1}";
            }

            if (!Steaks.Any(i => i == addedSteak))
            {
                Steaks.Add(addedSteak);
            }

            UpdateTimingInfo();

            StateHasChanged();
        }


        private async Task HandleSteakEdited(Steak steakToEdit)
        {
            var options = new DialogOptions { DisableBackdropClick = true, FullWidth = true };
            var parameters = new DialogParameters { ["AddSteak"] = OnSteakAdded, ["Steak"] = steakToEdit };
            DialogService.Show<UpsertSteakDialog>("Steak", parameters, options);
            StateHasChanged();
        }

        private async Task HandleSteakDeleted(Steak steakToDelete)
        {
            Steaks.Remove(steakToDelete);
            UpdateTimingInfo();
            StateHasChanged();
        }

        private async Task StartTimer()
        {
            if (Timer == null || !Timer.Enabled)
            {
                if (RecoveryData != null)
                {
                    StartAt = RecoveryData.StartedAt;
                    FinishAt = RecoveryData.FinishesAt;
                }
                else
                {
                    StartAt = DateTime.Now;
                    FinishAt = DateTime.Now.AddSeconds(LongestTime);
                }

                foreach (var steak in Steaks)
                {
                    steak.SetStartTimes(LongestTime, StartAt.Value);
                }

                foreach (var steak in Steaks.Where(i => i.DurationSetting.TotalTime == LongestTime))
                {
                    steak.StartNotificationShown = true;
                }

                int notificationId = 1;

                foreach (var startTime in Steaks.Where(i => !i.StartNotificationShown && i.FirstSideStartTime != StartAt).GroupBy(i => i.FirstSideStartTime))
                {
                    var applySteakRequest = new NotificationRequest
                    {
                        NotificationId = notificationId,
                        Title = $"Steaks ready for the grill!",
                        Subtitle = $"{string.Join(", ", startTime.Select(x => x.Name))} is ready to be placed on the grill",
                        BadgeNumber = 1,
                        Schedule = new NotificationRequestSchedule
                        {
                            NotifyTime = startTime.Key
                        }
                    };
                    NotificationIds.Add(notificationId);
                    notificationId++;
                    await LocalNotificationCenter.Current.Show(applySteakRequest);
                }

                foreach (var flipTime in Steaks.Where(i => !i.FlipNotificationShown).GroupBy(i => i.SecondSideStartTime))
                {
                    var applySteakRequest = new NotificationRequest
                    {
                        NotificationId = notificationId,
                        Title = $"Steaks ready to be flipped!",
                        Subtitle = $"{string.Join(", ", flipTime.Select(x => x.Name))} is ready to be flipped on the grill",
                        BadgeNumber = 1,
                        Schedule = new NotificationRequestSchedule
                        {
                            NotifyTime = flipTime.Key
                        }
                    };
                    NotificationIds.Add(notificationId);
                    notificationId++;
                    await LocalNotificationCenter.Current.Show(applySteakRequest);
                }

                var endSteakRequest = new NotificationRequest
                {
                    NotificationId = notificationId,
                    Title = $"Steaks are done!",
                    BadgeNumber = 1,
                    Schedule = new NotificationRequestSchedule
                    {
                        NotifyTime = FinishAt
                    }
                };
                NotificationIds.Add(notificationId);
                await LocalNotificationCenter.Current.Show(endSteakRequest);


                await SetRecoveryData();
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
                Snackbar.Add("Steaks are done!", Severity.Normal, config => { config.RequireInteraction = false; });
                SecureStorage.Default.Remove("ExistingGrillData");
            }
            await InvokeAsync(StateHasChanged);
        }

        private async Task ShowSnackbarNotifications()
        {
            bool steakNotificationUpdated = false;
            foreach (var steak in Steaks.Where(i => i.FirstSideStartTime < DateTime.Now && !i.StartNotificationShown))
            {
                steak.StartNotificationShown = true;
                Snackbar.Add($"{steak.Name} ready to be placed!", Severity.Normal, config => { config.RequireInteraction = false; });
                steakNotificationUpdated = true;
            }

            foreach (var steak in Steaks.Where(i => i.SecondSideStartTime < DateTime.Now && !i.FlipNotificationShown))
            {
                steak.FlipNotificationShown = true;
                Snackbar.Add($"{steak.Name} ready to be flipped!", Severity.Normal, config => { config.RequireInteraction = false; });
                steakNotificationUpdated = true;
            }

            if (steakNotificationUpdated)
            {
                await SetRecoveryData();
            }
        }

        private async Task SetRecoveryData()
        {
            var recoveryData = new RecoveryData
            {
                StartedAt = StartAt.Value,
                FinishesAt = FinishAt.Value,
                Steaks = Steaks
            };
            await SecureStorage.Default.SetAsync("ExistingGrillData", JsonSerializer.Serialize(recoveryData));
        }

        private void OpenSteakDialog()
        {
            var options = new DialogOptions { DisableBackdropClick = true, FullWidth = true };
            var parameters = new DialogParameters { ["AddSteak"] = OnSteakAdded };
            DialogService.Show<UpsertSteakDialog>("Steak", parameters, options);

        }

        private void OpenStopDialog()
        {
            var options = new DialogOptions { DisableBackdropClick = true, FullWidth = true };
            var parameters = new DialogParameters { ["StopTimer"] = OnTimerStopped };
            DialogService.Show<StopTimerDialog>("Stop Timer", parameters, options);
        }

        private void OpenStartDialog()
        {
            var options = new DialogOptions { DisableBackdropClick = true, FullWidth = true };
            var parameters = new DialogParameters { ["StartTimer"] = OnTimerStarted, ["SteaksToPlaceAtStart"] = Steaks.Where(i => i.DurationSetting.TotalTime == LongestTime) };
            DialogService.Show<BeginTimerDialog>("Start Grill", parameters, options);
        }

        private async Task HandleSteakRestore(bool restore)
        {
            if (restore)
            {
                Steaks = RecoveryData!.Steaks;
                if (RecoveryData.FinishesAt > DateTime.Now)
                {
                    LongestTime = Steaks.Max(x => x.DurationSetting.TotalTime);
                    await StartTimer();
                }
                else
                {
                    UpdateTimingInfo();
                    SecureStorage.Default.Remove("ExistingGrillData");
                    RecoveryData = null;
                }

                StateHasChanged();
            }
            else
            {
                SecureStorage.Default.Remove("ExistingGrillData");
                RecoveryData = null;
            }
        }

        private void StopTimer()
        {
            Timer.Enabled = false;
            Timer = null;
            StartAt = null;
            FinishAt = null;
            Steaks.ForEach(x => { x.StartNotificationShown = false; x.FlipNotificationShown = false; x.FirstSideStartTime = null; x.SecondSideStartTime = null; });
            foreach(var notificationId in NotificationIds)
            {
                LocalNotificationCenter.Current.Clear(notificationId);
            }
            NotificationIds = new();
        }

        private void ResetApp()
        {
            Timer = null;
            Steaks = new();
            LongestTime = 0;
            StartAt = null;
            FinishAt = null;
        }
    }
}
