﻿using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using SteakGrillingGuide.Data;
using SteakGrillingGuide.Enums;
using SteakGrillingGuide.Models;

namespace SteakGrillingGuide.Modals;

public partial class UpsertSteak
{
    [Parameter]
    public EventCallback<Steak> AddSteak { get; set; }
    [Parameter]
    public Steak Steak { get; set; } = new Steak();
    [Parameter]
    public IEnumerable<SavedSteak> UserSavedSteaks { get; set; }

    [Inject]
    protected SteakService SteakProvider { get; set; }
    [Inject]
    protected IJSRuntime JSRunTime { get; set; }

    IEnumerable<double> Thicknesses { get; set; }

    protected bool IsValid { get; set; } = true;

    protected double? Thickness { get; set; } = null;
    protected int? CenterCook { get; set; } = null;
    protected bool IsNewSteak { get; set; } = true;
    protected IJSObjectReference Module { get; set; }

    protected override Task OnInitializedAsync()
    {
        Thicknesses = SteakProvider.Thicknesses;
        return base.OnInitializedAsync();
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            Module = await JSRunTime.InvokeAsync<IJSObjectReference>("import", "./js/bsModal.js");
        }
    }

    protected override Task OnParametersSetAsync()
    {
        if (Steak != null && !string.IsNullOrWhiteSpace(Steak.Name))
        {
            Thickness = Steak.Thickness;
            CenterCook = (int)Steak.CenterCook;
            IsNewSteak = false;
        }
        else
        {
            Thickness = null;
            CenterCook = null;
            IsNewSteak = true;
        }


        return base.OnParametersSetAsync();
    }

    private async Task Submit()
    {
        try
        {
            if (Thickness == null || CenterCook == null)
            {
                IsValid = false;
                return;
            }
            IsValid = true;
            Steak.Thickness = Thickness.Value;
            Steak.CenterCook = (CenterCook)CenterCook.Value;
            Steak.DurationSetting = SteakProvider.SteakSettings.First(i => i.CenterCook == Steak.CenterCook).Durations.First(i => i.Thickness == Steak.Thickness);

            if(Steak.SavedSteak != null && (Steak.Name != Steak.SavedSteak.Name || Steak.CenterCook != Steak.SavedSteak.CenterCook))
            {

                await Module!.InvokeVoidAsync("hideModalById", "#upsertSteakModal");
                await Module!.InvokeVoidAsync("showModalById", "#changesMadeModal");
                return;
            }

            await FinishAddingSteak();
        }
        catch (Exception ex)
        {
            IsValid = false;
            return;
        }
    }
    private void SavedSteakChanged(ChangeEventArgs e)
    {
        if(!string.IsNullOrWhiteSpace(e.Value.ToString()))
        {
            Steak.SavedSteak = UserSavedSteaks.First(i => i.SavedSteakId == new Guid(e.Value.ToString()));
            Steak.Name = Steak.SavedSteak.Name;
            Steak.CenterCook = Steak.SavedSteak.CenterCook;
            CenterCook = (int)Steak.SavedSteak.CenterCook;
        }
        else
        {
            if(Steak.Name == Steak.SavedSteak.Name)
            {
                Steak.Name = "";
            }

            if(Steak.CenterCook== Steak.SavedSteak.CenterCook)
            {
                CenterCook = null;
            }

            Steak.SavedSteak = null;
        }
    }

    private async Task FinishAddingSteak()
    {
        Thickness = null;
        CenterCook = null;

        await Module!.InvokeVoidAsync("hideModalById", "#upsertSteakModal");
        await AddSteak.InvokeAsync(Steak);
    }

    private async Task ResumeUpsert()
    {
        await Module!.InvokeVoidAsync("hideModalById", "#changesMadeModal");
        await Module!.InvokeVoidAsync("showModalById", "#upsertSteakModal");
    }

    private async Task AddWithoutSaving()
    {
        await Module!.InvokeVoidAsync("hideModalById", "#changesMadeModal");
        await FinishAddingSteak();
    }

    private async Task UpdateSavedSteak()
    {
        var updatedInfo = new SavedSteak()
        {
            Name = Steak.Name,
            CenterCook = Steak.CenterCook
        };

        await SteakProvider.UpdateSavedSteak(Steak.SavedSteak, updatedInfo);
        await Module!.InvokeVoidAsync("hideModalById", "#changesMadeModal");
        await FinishAddingSteak();
    }

    private async Task SaveSteakAsNew()
    {
        var savedSteak = await SteakProvider.SavePersonSteak(Steak);
        if(savedSteak != null)
        {
            Steak.SavedSteak = savedSteak;
        }
        await Module!.InvokeVoidAsync("hideModalById", "#changesMadeModal");
        await FinishAddingSteak();
    }
}