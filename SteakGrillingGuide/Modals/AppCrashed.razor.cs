using Microsoft.AspNetCore.Components;

namespace SteakGrillingGuide.Modals;

public partial class AppCrashed
{
    [Parameter, EditorRequired]
    public bool BeforeFinish { get; set; }
    [Parameter, EditorRequired]
    public EventCallback<bool> HandleDecision { get; set; }

    private async Task Submit()
    {
        await HandleDecision.InvokeAsync(true);
    }

    private async Task Cancel()
    {
        await HandleDecision.InvokeAsync(false);
    }
}
