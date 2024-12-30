using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using MudBlazor;
using SteakGrillingGuide.Data;
using SteakGrillingGuide.Enums;
using SteakGrillingGuide.Models;
using System.Security.Cryptography;

namespace SteakGrillingGuide.Modals;

public partial class UserSavedSteaks
{
    [Inject]
    protected SteakService SteakProvider { get; set; } = null!;
    [Inject]
    protected IJSRuntime JSRuntime { get; set; }
    [Inject]
    protected ISnackbar Snackbar { get; set; }
    [Inject]
    protected SteakService SteakService { get; set; }
    protected SavedSteak BeforeSaved { get; set; }
    protected SavedSteak UpsertingSteak { get; set; }
    protected SavedSteak DeletingSteak { get; set; }
    protected IJSObjectReference Module { get; set; }
    protected bool IsValid { get; set; } = true;
    protected int? CenterCook { get; set; } = null;

    protected override void OnInitialized()
    {
        base.OnInitialized();
        SteakService.OnChange += StateHasChanged;
    }

    public void Dispose()
    {
        SteakService.OnChange -= StateHasChanged;
    }


    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            Module = await JSRuntime.InvokeAsync<IJSObjectReference>("import", "./js/bsModal.js");
        }
    }

    protected async Task DeleteSavedSteak()
    {
        await SteakProvider.RemoveSavedSteak(DeletingSteak);
        Snackbar.Add($"{DeletingSteak.Name} removed!", Severity.Normal, config =>
        {
            config.RequireInteraction = false;
            config.VisibleStateDuration = 5000;
            config.ShowTransitionDuration = 500;
            config.HideTransitionDuration = 500;
        });
        await HideDeletingModal();

        StateHasChanged();
    }

    protected async Task ShowDeletingModal(SavedSteak steak)
    {
        DeletingSteak = steak;
        await Module!.InvokeVoidAsync("hideModalById", "#savedSteaksModal");
        await Module!.InvokeVoidAsync("showModalById", "#deleteSteakModal");
    }

    protected async Task HideDeletingModal()
    {
        DeletingSteak = null;
        await Module!.InvokeVoidAsync("hideModalById", "#deleteSteakModal");
        await Module!.InvokeVoidAsync("showModalById", "#savedSteaksModal");
    }

    protected async Task EditSavedSteak(SavedSteak savedSteak)
    {
        BeforeSaved = savedSteak;
        UpsertingSteak = savedSteak;
        CenterCook = (int)savedSteak.CenterCook;
        await Module!.InvokeVoidAsync("hideModalById", "#savedSteaksModal");
        await Module!.InvokeVoidAsync("showModalById", "#upsertSavedModal");
    }

    protected async Task UpsertSavedSteak()
    {
        IsValid = true;
        if(CenterCook == null || string.IsNullOrWhiteSpace(UpsertingSteak.Name))
        {
            IsValid = false;
            return;
        }
        UpsertingSteak.CenterCook = (CenterCook)CenterCook;

        if(UpsertingSteak.SavedSteakId == Guid.Empty)
        {
            await SaveNewSavedSteak();
            return;
        }

        await SteakProvider.UpdateSavedSteak(BeforeSaved, UpsertingSteak);
        Snackbar.Add($"{UpsertingSteak.Name} updated!", Severity.Normal, config =>
        {
            config.RequireInteraction = false;
            config.VisibleStateDuration = 5000;
            config.ShowTransitionDuration = 500;
            config.HideTransitionDuration = 500;
        });
        BeforeSaved = null;
        UpsertingSteak = null;
        CenterCook = null;
        await Module!.InvokeVoidAsync("hideModalById", "#upsertSavedModal");
        await Module!.InvokeVoidAsync("showModalById", "#savedSteaksModal"); 
    }

    protected async Task CreateSavedSteak()
    {
        UpsertingSteak = new();
        await Module!.InvokeVoidAsync("hideModalById", "#savedSteaksModal");
        await Module!.InvokeVoidAsync("showModalById", "#upsertSavedModal");
    }

    protected async Task SaveNewSavedSteak()
    {
        var saved = await SteakProvider.SavePersonSteak(new Steak { Name = UpsertingSteak.Name, CenterCook = (CenterCook)CenterCook });

        if(saved != null)
        {
            Snackbar.Add($"{UpsertingSteak.Name} saved to device!", Severity.Normal, config =>
            {
                config.RequireInteraction = false;
                config.VisibleStateDuration = 5000;
                config.ShowTransitionDuration = 500;
                config.HideTransitionDuration = 500;
            });
        }
        else
        {
            Snackbar.Add($"Failed to save steak to device, please try again.", Severity.Error, config =>
            {
                config.RequireInteraction = false;
                config.VisibleStateDuration = 5000;
                config.ShowTransitionDuration = 500;
                config.HideTransitionDuration = 500;
            });
        }

        UpsertingSteak = null;
        CenterCook = null;
        await Module!.InvokeVoidAsync("hideModalById", "#upsertSavedModal");
        await Module!.InvokeVoidAsync("showModalById", "#savedSteaksModal");
    }

    protected async Task HideUpsertModal()
    {
        BeforeSaved = null;
        UpsertingSteak = null;
        CenterCook = null;
        await Module!.InvokeVoidAsync("hideModalById", "#upsertSavedModal");
        await Module!.InvokeVoidAsync("showModalById", "#savedSteaksModal");
    }
}
