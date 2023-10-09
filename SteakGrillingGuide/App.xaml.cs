using SteakGrillingGuide.Data;

namespace SteakGrillingGuide;

public partial class App : Application
{
	private AppLifecycleService AppLifecycleService;

	public App(AppLifecycleService appLifecycleService)
	{
		AppLifecycleService = appLifecycleService;

		InitializeComponent();

		MainPage = new MainPage();
	}

    protected override Window CreateWindow(IActivationState activationState)
    {
		Window window = base.CreateWindow(activationState);
		window.Deactivated += AppLifecycleService.OnPaused;
		window.Activated += AppLifecycleService.OnResumed;

		return window;
    }
}
