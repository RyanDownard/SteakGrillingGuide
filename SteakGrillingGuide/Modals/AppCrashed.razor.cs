using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using SteakGrillingGuide.Data;
using SteakGrillingGuide.Models;

namespace SteakGrillingGuide.Modals;

public partial class AppCrashed
{
    [Inject]
    public SteakService SteakService { get; set; }
    [Inject]
    public IJSRuntime JSRuntime { get; set; }
    [Parameter, EditorRequired]
    public Func<RecoveryData, Task> HandleDecision { get; set; }
    private RecoveryData RecoveryData { get; set; } = null;
    private IJSObjectReference Module { get; set; }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            Module = Module = await JSRuntime.InvokeAsync<IJSObjectReference>("import", "./js/bsModal.js");
            RecoveryData = await SteakService.GetRecoveryData();

            if(RecoveryData != null)
            {
                await Module.InvokeVoidAsync("showModalById", "#appCrashedModal");
                StateHasChanged();
            }
        }
    }

    private async Task Submit()
    {
        await Module.InvokeVoidAsync("hideModalById", "#appCrashedModal");
        await HandleDecision.Invoke(RecoveryData);
    }

    private async Task Cancel()
    {
        SteakService.RemoveRecoveryData();
        await Module.InvokeVoidAsync("hideModalById", "#appCrashedModal");
    }
}
