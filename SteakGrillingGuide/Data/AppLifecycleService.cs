namespace SteakGrillingGuide.Data;

public class AppLifecycleService
{
    public event Action Paused;

    public void OnPaused(object? sender, EventArgs args)
    {
        Paused?.Invoke();
    }

    public event Action Resumed;

    public void OnResumed(object? sender, EventArgs args)
    {
        Resumed?.Invoke();
    }
}
