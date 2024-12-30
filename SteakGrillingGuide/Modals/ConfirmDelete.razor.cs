using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using SteakGrillingGuide.Data;
using SteakGrillingGuide.Models;

namespace SteakGrillingGuide.Modals;

public partial class ConfirmDelete
{
    [Parameter]
    public Steak Steak { get; set; }
    [Inject]
    protected IJSRuntime JSRunTime { get; set; }
    [Inject]
    protected SteakService SteakService { get; set; }
    protected IJSObjectReference Module { get; set; }


    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            Module = await JSRunTime.InvokeAsync<IJSObjectReference>("import", "./js/bsModal.js");
        }
    }

    protected async Task DeleteSteak()
    {
        SteakService.RemoveSteak(Steak);
        Steak = null;
        await Module.InvokeVoidAsync("hideModalById", "#confirmDeleteModal");
    }

    protected async Task KeepSteak()
    {
        Steak = null;
        await Module.InvokeVoidAsync("hideModalById", "#confirmDeleteModal");
    }
}
