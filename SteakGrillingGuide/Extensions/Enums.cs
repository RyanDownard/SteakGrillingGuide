using EnumsNET;
using SteakGrillingGuide.Enums;

namespace SteakGrillingGuide.Extensions;

public static class EnumExtensions
{
    public static string GetCookingStyleName(this CenterCook value)
    {
        return value.AsString(EnumFormat.Description); 
    }
}