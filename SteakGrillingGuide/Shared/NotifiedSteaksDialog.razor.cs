using Microsoft.AspNetCore.Components;
using MudBlazor;
using SteakGrillingGuide.Data;

namespace SteakGrillingGuide.Shared;

public partial class NotifiedSteaksDialog
{
    [CascadingParameter]
    MudDialogInstance MudDialog { get; set; }
    [Parameter]
    public List<Steaks> SteaksToPlace { get; set; }
    [Parameter]
    public List<Steaks> SteaksToFlip { get; set; }

    void Submit() => MudDialog.Cancel();
}
