namespace SteakGrillingGuide.Modals
{
    public partial class Suggestions
    { 
        protected bool DontShowOnStart = false;
        
        protected override async Task OnInitializedAsync()
        {
            string GetWarningSet = await SecureStorage.Default.GetAsync("IgnoreInfoDialog");

            if (GetWarningSet != null)
            {
                _ = bool.TryParse(GetWarningSet, out DontShowOnStart);
            }
        }

        protected async Task ShowDialogPreferenceChanged(bool value)
        {
            DontShowOnStart = value;
            await SecureStorage.Default.SetAsync("IgnoreInfoDialog", value.ToString());
        }
    }
}
