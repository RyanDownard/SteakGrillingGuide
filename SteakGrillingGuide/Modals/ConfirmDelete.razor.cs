using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using SteakGrillingGuide.Data;

namespace SteakGrillingGuide.Modals;

public partial class ConfirmDelete
{
    [Parameter]
    public Steak Steak { get; set; }
    [Parameter]
    public EventCallback<Steak> UserConfirmed { get; set; }
    [Inject]
    protected IJSRuntime JSRunTime { get; set; }
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
        await UserConfirmed.InvokeAsync(Steak);
    }

    protected async Task KeepSteak()
    {
        Steak = null;
    }
}
