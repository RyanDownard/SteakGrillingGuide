using Microsoft.AspNetCore.Components;
using MudBlazor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SteakGrillingGuide.Shared
{
    public partial class AboutDialog
    {
        [CascadingParameter]
        MudDialogInstance MudDialog { get; set; }

        void Submit() => MudDialog.Cancel();
    }
}
