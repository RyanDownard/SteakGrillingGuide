using EnumsNET;
using SteakGrillingGuide.Data;

namespace SteakGrillingGuide.Extensions;

public static class EnumExtensions
{
    public static string GetCookingStyleName(this CookingStyle value)
    {
        return value.AsString(EnumFormat.Description); 
    }
}