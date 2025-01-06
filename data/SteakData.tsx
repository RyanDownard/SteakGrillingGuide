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


class Steak {
  personName: string;
  centerCook: string; // e.g., "Rare", "Medium Rare", "Well Done"
  thickness: number;
  firstSideTime: number; // in seconds
  secondSideTime: number; // in seconds

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
  // Use 0 as a fallback if the times are null or undefined
  const safeFirstSideTime = this.firstSideTime ?? 0;
  const safeSecondSideTime = this.secondSideTime ?? 0;

  return safeFirstSideTime + safeSecondSideTime;
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
  steaks = newSteaks;
}

const getSteaks = () => {
  return steaks;
};

export { addSteak, editSteak, getSteaks, getCookingTimes, updateSteaks, Steak };
