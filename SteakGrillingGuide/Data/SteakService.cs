using System.Reflection;
using System.Text.Json;
using SteakGrillingGuide.Enums;
using SteakGrillingGuide.Models;

namespace SteakGrillingGuide.Data;

public class SteakService
{
    public readonly List<SteakSettings> SteakSettings = new();
    public readonly List<double> Thicknesses = new() { .5, .75, 1.0, 1.25, 1.5, 1.75, 2.0 };
    private List<Steak> _steaks { get; set; }
    public IReadOnlyList<Steak> Steaks { get; set; }
    public SteakService()
    {
        LoadDefaults();
    }

    public void LoadDefaults()
    {
        var settingSetup = new SteakSettings
        {
            CenterCook = CenterCook.Rare,
            Durations = new List<DurationSettings>()
                {
                new DurationSettings{ Thickness = Thicknesses[0], FirstSide = 120, SecondSide = 120 },
                new DurationSettings{ Thickness = Thicknesses[1], FirstSide = 240, SecondSide = 120 },
                new DurationSettings{ Thickness = Thicknesses[2], FirstSide = 300, SecondSide = 180 },
                new DurationSettings{ Thickness = Thicknesses[3], FirstSide = 300, SecondSide = 240 },
                new DurationSettings{ Thickness = Thicknesses[4], FirstSide = 360, SecondSide = 240 },
                new DurationSettings{ Thickness = Thicknesses[5], FirstSide = 420, SecondSide = 300 },
                new DurationSettings{ Thickness = Thicknesses[6], FirstSide = 480, SecondSide = 360 },
                }
        };
        SteakSettings.Add(settingSetup);

        settingSetup = new SteakSettings
        {
            CenterCook = CenterCook.MediumRare,
            Durations = new List<DurationSettings>()
                {
                new DurationSettings{ Thickness = Thicknesses[0], FirstSide = 180, SecondSide = 120 },
                new DurationSettings{ Thickness = Thicknesses[1], FirstSide = 240, SecondSide = 180 },
                new DurationSettings{ Thickness = Thicknesses[2], FirstSide = 300, SecondSide = 240 },
                new DurationSettings{ Thickness = Thicknesses[3], FirstSide = 360, SecondSide = 300 },
                new DurationSettings{ Thickness = Thicknesses[4], FirstSide = 420, SecondSide = 300 },
                new DurationSettings{ Thickness = Thicknesses[5], FirstSide = 480, SecondSide = 360 },
                new DurationSettings{ Thickness = Thicknesses[6], FirstSide = 540, SecondSide = 480 },
                }
        };
        SteakSettings.Add(settingSetup);

        settingSetup = new SteakSettings
        {
            CenterCook = CenterCook.Medium,
            Durations = new List<DurationSettings>()
                {
                new DurationSettings{ Thickness = Thicknesses[0], FirstSide = 240, SecondSide = 120 },
                new DurationSettings{ Thickness = Thicknesses[1], FirstSide = 300, SecondSide = 180 },
                new DurationSettings{ Thickness = Thicknesses[2], FirstSide = 360, SecondSide = 240 },
                new DurationSettings{ Thickness = Thicknesses[3], FirstSide = 420, SecondSide = 300 },
                new DurationSettings{ Thickness = Thicknesses[4], FirstSide = 420, SecondSide = 360 },
                new DurationSettings{ Thickness = Thicknesses[5], FirstSide = 420, SecondSide = 420 },
                new DurationSettings{ Thickness = Thicknesses[6], FirstSide = 600, SecondSide = 480 },
                }
        };
        SteakSettings.Add(settingSetup);

        settingSetup = new SteakSettings
        {
            CenterCook = CenterCook.MediumWell,
            Durations = new List<DurationSettings>()
                {
                new DurationSettings{ Thickness = Thicknesses[0], FirstSide = 240, SecondSide = 180 },
                new DurationSettings{ Thickness = Thicknesses[1], FirstSide = 360, SecondSide = 240 },
                new DurationSettings{ Thickness = Thicknesses[2], FirstSide = 420, SecondSide = 300 },
                new DurationSettings{ Thickness = Thicknesses[3], FirstSide = 480, SecondSide = 360 },
                new DurationSettings{ Thickness = Thicknesses[4], FirstSide = 480, SecondSide = 420 },
                new DurationSettings{ Thickness = Thicknesses[5], FirstSide = 600, SecondSide = 480 },
                new DurationSettings{ Thickness = Thicknesses[6], FirstSide = 720, SecondSide = 540 },
                }
        };
        SteakSettings.Add(settingSetup);

        settingSetup = new SteakSettings
        {
            CenterCook = CenterCook.WellDone,
            Durations = new List<DurationSettings>()
                {
                new DurationSettings{ Thickness = Thicknesses[0], FirstSide = 300, SecondSide = 180 },
                new DurationSettings{ Thickness = Thicknesses[1], FirstSide = 420, SecondSide = 300 },
                new DurationSettings{ Thickness = Thicknesses[2], FirstSide = 480, SecondSide = 360 },
                new DurationSettings{ Thickness = Thicknesses[3], FirstSide = 540, SecondSide = 420 },
                new DurationSettings{ Thickness = Thicknesses[4], FirstSide = 600, SecondSide = 480 },
                new DurationSettings{ Thickness = Thicknesses[5], FirstSide = 660, SecondSide = 540 },
                new DurationSettings{ Thickness = Thicknesses[6], FirstSide = 780, SecondSide = 660 },
                }
        };
        SteakSettings.Add(settingSetup);
    }

    public async Task<SavedSteak> SavePersonSteak(Steak steakToSave)
    {
        SavedSteak savedSteak;
        try
        {
            var savedSteaks = await GetSteaksFromStorage();

            if (savedSteaks.Any(i => i.Name == steakToSave.Name && i.CenterCook == steakToSave.CenterCook))
            {
                //user already has this steak saved, prevent duplicates
                return savedSteaks.FirstOrDefault(i => i.Name == steakToSave.Name && i.CenterCook == steakToSave.CenterCook);
            }

            var asSavedClass = new SavedSteak
            {
                SavedSteakId = Guid.NewGuid(),
                Name = steakToSave.Name,
                CenterCook = steakToSave.CenterCook
            };

            savedSteaks = savedSteaks.Concat(new SavedSteak[] { asSavedClass });

            await SaveSteaksToStorage(savedSteaks);

            savedSteak = asSavedClass;
        }
        catch (Exception ex)
        {
            //TODO logging on saving the steak failed 
            return null;
        }

        return savedSteak;
    }

    public async Task<IEnumerable<SavedSteak>> GetSavedSteaks()
    {
        try
        {
            var savedSteaks = await GetSteaksFromStorage();
            return savedSteaks;
        }
        catch(Exception ex)
        {
            //TODO logging on failing to retrieve steaks 
            return Enumerable.Empty<SavedSteak>();
        }
    }

    public async Task<bool> UpdateSavedSteak(SavedSteak steakToUpdate, SavedSteak updatedSteakInfo)
    {
        bool savedSuccessfully = false;

        try
        {
            var savedSteaks = await GetSteaksFromStorage();

            var previousSteakData = GetSteakFromExistingList(savedSteaks, steakToUpdate);

            previousSteakData.Name = updatedSteakInfo.Name;
            previousSteakData.CenterCook = updatedSteakInfo.CenterCook;

            await SaveSteaksToStorage(savedSteaks);
        }
        catch(Exception ex)
        {
            //TODO logging for failing to update a steak
        }

        return savedSuccessfully;
    }

    public async Task<bool> RemoveSavedSteak(SavedSteak steakToRemove)
    {
        bool savedSuccessfully = false;
        try
        {
            var savedSteaks = await GetSteaksFromStorage();

            savedSteaks = savedSteaks.Where(i => i.SavedSteakId != steakToRemove.SavedSteakId);

            await SaveSteaksToStorage(savedSteaks);

            savedSuccessfully = true;
        }
        catch(Exception ex)
        {
            //TODO logging for failing to remove a steak
        }

        return savedSuccessfully;
    }

    public async Task<IEnumerable<SavedSteak>> GetSteaksFromStorage()
    {
        var steakSavedResponse = await SecureStorage.GetAsync("SavedSteaks");
        if (string.IsNullOrWhiteSpace(steakSavedResponse))
            return Enumerable.Empty<SavedSteak>();
        return JsonSerializer.Deserialize<IEnumerable<SavedSteak>>(steakSavedResponse);
    }

    public SavedSteak GetSteakFromExistingList(IEnumerable<SavedSteak> savedSteaks, SavedSteak steakToFind)
    {
        return savedSteaks.FirstOrDefault(i => i.SavedSteakId == steakToFind.SavedSteakId);
    }

    public async Task SaveSteaksToStorage(IEnumerable<SavedSteak> steaks)
    {
        await SecureStorage.SetAsync("SavedSteaks", JsonSerializer.Serialize(steaks));
    }

    public void AddSteak(Steak steak)
    {

    }

    public void RemoveSteak(Steak steak)
    {

    }

    public void UpdateSteak(Steak steak)
    {

    }

    public async Task SetRecoveryData(List<Steak> steaks, DateTime startAt, DateTime finishAt)
    {
        var recoveryData = new RecoveryData
        {
            StartedAt = startAt,
            FinishesAt = finishAt,
            Steaks = steaks
        };
        await SecureStorage.Default.SetAsync("ExistingGrillData", JsonSerializer.Serialize(recoveryData));
    }

    public async Task<RecoveryData?> GetRecoveryData()
    {
        try
        {
            string storedRecovery = await SecureStorage.Default.GetAsync("ExistingGrillData");
            if (!string.IsNullOrWhiteSpace(storedRecovery))
            {
                var RecoveryData = JsonSerializer.Deserialize<RecoveryData>(storedRecovery);
                return RecoveryData;

            }
        }
        catch(Exception ex)
        {
            return null;
        }
        return null;
    }

    public void RemoveRecoveryData()
    {
        SecureStorage.Default.Remove("ExistingGrillData");
    }
}
