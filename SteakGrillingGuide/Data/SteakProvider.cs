using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace SteakGrillingGuide.Data
{
    public class SteakProvider
    {
        public readonly List<SteakSettings> SteakSettings = new List<SteakSettings>();
        public readonly List<double> Thicknesses = new List<double> { .5, .75, 1.0, 1.25, 1.5, 1.75, 2.0 };
        public SteakProvider()
        {
            LoadDefaults();
        }

        public void LoadDefaults()
        {
            var settingSetup = new SteakSettings
            {
                CookingStyle = CookingStyle.Rare,
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
                CookingStyle = CookingStyle.MediumRare,
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
                CookingStyle = CookingStyle.Medium,
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
                CookingStyle = CookingStyle.MediumWell,
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
                CookingStyle = CookingStyle.WellDone,
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

        public async Task<bool> SavePersonSteak(Steak steakToSave)
        {
            bool savedSuccessfully = false;
            try
            {
                var savedSteaks = await GetSteaksFromStorage();

                if (savedSteaks.Any(i => i.Name == steakToSave.Name && i.CookingStyle == steakToSave.CookingStyle))
                {
                    //user already has this steak saved, prevent duplicates
                    return true;
                }

                var asSavedClass = new SavedSteak
                {
                    SavedSteakId = Guid.NewGuid(),
                    Name = steakToSave.Name,
                    CookingStyle = steakToSave.CookingStyle
                };

                savedSteaks = savedSteaks.Concat(new SavedSteak[] { asSavedClass });

                await SaveSteaksToStorage(savedSteaks);

                savedSuccessfully = true;
            }
            catch (Exception ex)
            {
                //TODO logging on saving the steak failed 
            }

            return savedSuccessfully;
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
                previousSteakData.CookingStyle = updatedSteakInfo.CookingStyle;

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
    }
}
