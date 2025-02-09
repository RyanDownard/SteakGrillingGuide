import steakSettings from '../data/SteakSettings.json';

interface Duration {
  Thickness: number;
  FirstSide: number;
  SecondSide: number;
}

interface CookData {
  CenterCook: string;
  Durations: Duration[];
}

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
  centerCook: string;
  thickness: number;
  firstSideTime: number; // in seconds
  secondSideTime: number; // in seconds
  isPlaced: boolean;
  isFlipped: boolean;
  savedSteak?: SavedSteak | null;

  constructor(
    personName: string,
    centerCook: string,
    thickness: number
  ) {
    this.personName = personName;
    this.centerCook = centerCook;
    this.thickness = thickness;
    var steakDurations = this.getCookingTimes(this.centerCook, this.thickness);

    this.firstSideTime = steakDurations?.firstSide ?? 120;
    this.secondSideTime = steakDurations?.secondSide ?? 240;

    this.isPlaced = false;
    this.isFlipped = false;
  }

  totalCookingTime(): number {
    return this.firstSideTime + this.secondSideTime;
  }


  description(): string {
    return `${this.personName} wants their steak ${this.centerCook}. 
Cook the first side for ${this.firstSideTime} seconds and the second side for ${this.secondSideTime} seconds. 
Total time: ${this.totalCookingTime()} seconds.`;
  }

  getCookingTimes = (
    centerCook: string,
    thickness: number
  ): { firstSide: number; secondSide: number } | null => {

    const cookData = steakSettings.find(
      (data: CookData) => data.CenterCook === centerCook
    );

    if (!cookData) {
      console.error('CenterCook not found');
      return null;
    }

    const duration = cookData.Durations.find(
      (d: Duration) => d.Thickness === thickness
    );

    if (!duration) {
      console.error('Thickness not found for the selected CenterCook');
      return null;
    }

    this.firstSideTime = duration.FirstSide;
    this.secondSideTime = duration.SecondSide;

    return { firstSide: duration.FirstSide, secondSide: duration.SecondSide };
  };
}


export type { CookData, Duration };
export { Steak, SavedSteak };
