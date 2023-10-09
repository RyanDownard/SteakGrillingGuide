using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SteakGrillingGuide.Data
{
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
}
