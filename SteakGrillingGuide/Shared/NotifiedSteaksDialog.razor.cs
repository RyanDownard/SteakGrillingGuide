using Microsoft.AspNetCore.Components;
using MudBlazor;
using SteakGrillingGuide.Data;

namespace SteakGrillingGuide.Shared;

public partial class NotifiedSteaksDialog
{
    [CascadingParameter]
    MudDialogInstance MudDialog { get; set; }
    [Parameter]
    public List<Steak> SteaksToPlace { get; set; }
    [Parameter]
    public List<Steak> SteaksToFlip { get; set; }

    void Submit() => MudDialog.Cancel();
}
