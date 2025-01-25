import steakSettings from './SteakSettings.json';

interface Duration {
  Thickness: number;
  FirstSide: number;
  SecondSide: number;
}

interface CookData {
  CenterCook: string;
  Durations: Duration[];
}

const getCookingTimes = (
  centerCook: string,
  thickness: number
): { firstSide: number; secondSide: number } | null => {
  // Find the cook data matching the centerCook
  const cookData = steakSettings.find(
    (data: CookData) => data.CenterCook === centerCook
  );

  if (!cookData) {
    console.error('CenterCook not found');
    return null;
  }

  // Find the duration matching the thickness
  const duration = cookData.Durations.find(
    (d: Duration) => d.Thickness === thickness
  );

  if (!duration) {
    console.error('Thickness not found for the selected CenterCook');
    return null;
  }

  // Return the cooking times
  return { firstSide: duration.FirstSide, secondSide: duration.SecondSide };
};

class SavedSteak {
  id: number;
  personName: string;
  centerCook: string;

  constructor(
    id: number,
    personName: string,
    centerCook: string,
  ) {
    this.id = id;
    this.personName = personName;
    this.centerCook = centerCook;
  }
}


class Steak {
  personName: string;
  centerCook: string; // e.g., "Rare", "Medium Rare", "Well Done"
  thickness: number;
  firstSideTime: number; // in seconds
  secondSideTime: number; // in seconds
  savedSteak?: SavedSteak | null;

  constructor(
    personName: string,
    centerCook: string,
    thickness: number
  ) {
    this.personName = personName;
    this.centerCook = centerCook;
    this.thickness = thickness;
    var steakDurations = getCookingTimes(this.centerCook, this.thickness);

    this.firstSideTime = steakDurations?.firstSide ?? 120;
    this.secondSideTime = steakDurations?.secondSide ?? 240;
  }

  totalCookingTime(): number {
    return this.firstSideTime + this.secondSideTime;
  }


  description(): string {
    return `${this.personName} wants their steak ${this.centerCook}. 
Cook the first side for ${this.firstSideTime} seconds and the second side for ${this.secondSideTime} seconds. 
Total time: ${this.totalCookingTime()} seconds.`;
  }
}


let steaks: Steak[] = [];

const addSteak = (steak: Steak) => {
  steaks.push(steak);
};

const editSteak = (index: number, updatedSteak: Steak) => {
  if (index >= 0 && index < steaks.length) {
    steaks[index] = updatedSteak;
  }
};

const updateSteaks = (newSteaks: Steak[]) => {
  steaks = [...newSteaks];
};

const updateSteaksWithSavedId = (updatedInfo: SavedSteak) => {
  steaks.forEach((steak) => {
    if (steak.savedSteak && steak.savedSteak.id === updatedInfo.id) {
      steak.personName = updatedInfo.personName;
      steak.centerCook = updatedInfo.centerCook;
    }
  });
};

const removeAnySavedSteakInfo = (id: number) => {
  steaks.forEach((steak) => {
    if (steak.savedSteak && steak.savedSteak.id === id) {
      steak.savedSteak = null;
    }
  });
};

const getSteaks = () => {
  return steaks;
};



export { steaks, addSteak, editSteak, getSteaks, getCookingTimes, updateSteaks, updateSteaksWithSavedId, removeAnySavedSteakInfo, Steak, SavedSteak };
