using MudBlazor;
using SteakGrillingGuide.Data;
using Plugin.LocalNotification;
using System.Text.Json;
using Microsoft.AspNetCore.Components;
using SteakGrillingGuide.Shared;
using Plugin.LocalNotification.AndroidOption;
using Microsoft.JSInterop;
using Microsoft.JSInterop.Implementation;

namespace SteakGrillingGuide.Pages
{
    public partial class Index
    {
        [Inject]
        IDialogService DialogService { get; set; }
        [Inject]
        private AppLifecycleService lifecycleService { get; set; }
        [Inject]
        ISnackbar Snackbar { get; set; }
        [Inject]
        SteakProvider SteakProvider { get; set; }
        [Inject]
        IJSRuntime JSRunTime { get; set; }
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
        private EventCallback<Steak> OnDeleteConfirmed { get; set; }
        private EventCallback<Steak> OnSteakSaved { get; set; }
        private EventCallback<bool> OnRestored { get; set; }
        private EventCallback OnTimerStarted { get; set; }
        private EventCallback OnTimerStopped { get; set; }

        private static System.Timers.Timer Timer { get; set; }

        private DateTime? SnackbarErrorsAt  { get; set; } = null;

        private string SnackbarError { get; set; } = string.Empty;

        private bool RunComplete = false;
        private IJSObjectReference Module { get; set; }
        private Steak UpsertingSteak { get; set; }
        private bool RecoveryBeforeFinished { get; set; } = false;
        private IEnumerable<Steak> SteaksToStart { get; set; } = [];
        private IEnumerable<SavedSteak> UserSavedSteaks { get; set; } = [];
        private Steak SteakToDelete { get; set; }

        protected async override Task OnInitializedAsync()
        {
            GenerateCallBacks();
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

                await HandleRecoveryNeeded();
            }
        }

        private void HandlePause()
        {
            if(Timer != null)
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
            OnSteakAdded = new EventCallback<Steak>(this, (Steak steak) => HandleSteakAdded(steak));
            OnSteakSaved = new EventCallback<Steak>(this, (Steak steak) => SavePersonSteak(steak));
            OnSteakEdited = new EventCallback<Steak>(this, (Steak steak) => HandleSteakEdited(steak));
            OnSteakDeleted = new EventCallback<Steak>(this, (Steak steak) => HandleSteakDeleted(steak));
            OnDeleteConfirmed = new EventCallback<Steak>(this, (Steak steak) => DeleteConfirmed(steak));
            OnRestored = new EventCallback<bool>(this, (bool restore) => HandleSteakRestore(restore));
            OnTimerStarted = new EventCallback(this, () => StartTimer());
            OnTimerStopped = new EventCallback(this, () => StopTimer());
        }

        private async Task HandleRecoveryNeeded()
        {

            string storedRecovery = await SecureStorage.Default.GetAsync("ExistingGrillData");
            if (!string.IsNullOrWhiteSpace(storedRecovery))
            {
                RecoveryData = JsonSerializer.Deserialize<RecoveryData>(storedRecovery);
                RecoveryBeforeFinished = RecoveryData.FinishesAt > DateTime.Now;
                await Module.InvokeVoidAsync("showModalById", "#appCrashedModal");
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
                await Module!.InvokeVoidAsync("showModalById", "#suggestionsModal");
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

            await Module!.InvokeVoidAsync("hideModalById", "#upsertSteakModal");

            UpdateTimingInfo();

            UpsertingSteak = null;

            StateHasChanged();
        }


        private async Task HandleSteakEdited(Steak steakToEdit)
        {
            UpsertingSteak = steakToEdit;
            UserSavedSteaks = await SteakProvider.GetSavedSteaks();
            StateHasChanged();
            await Module!.InvokeVoidAsync("showModalById", "#upsertSteakModal");
        }

        private async Task HandleSteakDeleted(Steak steakToDelete)
        {
            SteakToDelete = steakToDelete;
            await Module.InvokeVoidAsync("showModalById", "#confirmDeleteModal");
        }

        private async Task DeleteConfirmed(Steak steakToDelete)
        {
            await Module.InvokeVoidAsync("hideModalById", "#confirmDeleteModal");
            Steaks.Remove(steakToDelete);
            SteakToDelete = null;
            UpdateTimingInfo();
            StateHasChanged();
        }

        private async Task StartTimer()
        {
            await Module!.InvokeVoidAsync("hideModalById", "#beginTimerModal");
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

                if (RecoveryData == null)
                {
                    var toBePlaced = Steaks.Where(i => i.DurationSetting.TotalTime == LongestTime);
                    foreach (var steak in Steaks.Where(i => i.DurationSetting.TotalTime == LongestTime))
                    {
                        steak.StartNotificationShown = true;
                    }
                    Snackbar.Add($"{string.Join(", ", toBePlaced.Select(x => $"{x.Name}'s"))} {(toBePlaced.Count() > 1 ? "steaks" : "steak")} ready to be placed!", Severity.Normal, config => { config.RequireInteraction = false; config.VisibleStateDuration = 10000; });
                }

                int notificationId = 1;

                foreach (var startTime in Steaks.Where(i => !i.StartNotificationShown && i.FirstSideStartTime != StartAt).GroupBy(i => i.FirstSideStartTime))
                {
                    var applySteakRequest = new NotificationRequest
                    {
                        NotificationId = notificationId,
                        Title = $"Steaks ready for the grill!",
                        Subtitle = $"Place {string.Join(", ", startTime.Select(x => $"{x.Name}'s"))} {(startTime.Count() > 1 ? "steaks" : "steak")} on the grill",
                        BadgeNumber = 1,
                        Silent = false,
                        CategoryType = NotificationCategoryType.Status,
                        Schedule = new NotificationRequestSchedule
                        {
                            NotifyTime = startTime.Key,
                        }
                    };
                    await LocalNotificationCenter.Current.Show(applySteakRequest);
                    notificationId++;
                }

                foreach (var flipTime in Steaks.Where(i => !i.FlipNotificationShown).GroupBy(i => i.SecondSideStartTime))
                {
                    var applySteakRequest = new NotificationRequest
                    {
                        NotificationId = notificationId,
                        Title = $"Steaks ready to be flipped!",
                        Subtitle = $"Flip {string.Join(", ", flipTime.Select(x => x.Name))} {(flipTime.Count() > 1 ? "steaks" : "steak")}",
                        BadgeNumber = 1,
                        Silent = false,
                        CategoryType = NotificationCategoryType.Status,
                        iOS = new Plugin.LocalNotification.iOSOption.iOSOptions
                        {
                            PlayForegroundSound = true
                        },
                        Schedule = new NotificationRequestSchedule
                        {
                            NotifyTime = flipTime.Key
                        }
                    };
                    await LocalNotificationCenter.Current.Show(applySteakRequest);
                    notificationId++;
                }

                var endSteakRequest = new NotificationRequest
                {
                    NotificationId = notificationId,
                    Title = $"Steaks are done!",
                    BadgeNumber = 1,
                    Silent = false,
                    CategoryType = NotificationCategoryType.Status,
                    Schedule = new NotificationRequestSchedule
                    {
                        NotifyTime = FinishAt
                    }
                };

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
            foreach (var steak in Steaks.Where(i => i.FirstSideStartTime < DateTime.Now && !i.StartNotificationShown))
            {
                steak.StartNotificationShown = true;
                steakNotificationUpdated = true;
                toBePlaced.Add($"{steak.Name}'s");
            }

            foreach (var steak in Steaks.Where(i => i.SecondSideStartTime < DateTime.Now && !i.FlipNotificationShown))
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
                    if(toBePlaced.Any() && toBePlaced.Any())
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

        private async void OpenSteakDialog()
        {
            UpsertingSteak = new();
            UserSavedSteaks = await SteakProvider.GetSavedSteaks();
            StateHasChanged();
            await Module!.InvokeVoidAsync("showModalById", "#upsertSteakModal");
        }

        private async void OpenStopDialog()
        {
            await Module!.InvokeVoidAsync("showModalById", "#stopTimerModal");
        }

        private async void OpenStartDialog()
        {
            SteaksToStart = Steaks.Where(i => i.DurationSetting.TotalTime == LongestTime);
            await Module!.InvokeVoidAsync("showModalById", "#beginTimerModal");
        }

        private async Task HandleSteakRestore(bool restore)
        {
            await Module!.InvokeVoidAsync("hideModalById", "#appCrashedModal");
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

        private async Task SavePersonSteak(Steak steak)
        {
            var saved = await SteakProvider.SavePersonSteak(steak);
            if (saved != null)
            {
                steak.SavedSteak = saved;
                Snackbar.Add($"{steak.Name} saved to device!", Severity.Normal, config =>
                {
                    config.RequireInteraction = false;
                    config.VisibleStateDuration = 10000;
                    config.ShowTransitionDuration = 500;
                    config.HideTransitionDuration = 500;
                });
            }
            else
            {
                Snackbar.Add($"Failed {steak.Name} saved to device, please try again", Severity.Error, config =>
                {
                    config.RequireInteraction = false;
                    config.VisibleStateDuration = 10000;
                    config.ShowTransitionDuration = 500;
                    config.HideTransitionDuration = 500;
                });
            }
        }

        private async void StopTimer()
        {
            Timer.Enabled = false;
            Timer = null;
            StartAt = null;
            FinishAt = null;
            Steaks.ForEach(x => { x.StartNotificationShown = false; x.FlipNotificationShown = false; x.FirstSideStartTime = null; x.SecondSideStartTime = null; });
            LocalNotificationCenter.Current.CancelAll();
            SecureStorage.Default.Remove("ExistingGrillData");
            RecoveryData = null;
            await Module!.InvokeVoidAsync("hideModalById", "#stopTimerModal");
        }

        private void ResetApp()
        {
            Timer = null;
            Steaks = new();
            LongestTime = 0;
            StartAt = null;
            FinishAt = null;
            SecureStorage.Default.Remove("ExistingGrillData");
            RecoveryData = null;
            RunComplete = false;
        }
    }
}
