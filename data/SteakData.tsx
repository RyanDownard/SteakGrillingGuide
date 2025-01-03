class SteakCooking {
  personName: string;
  desiredDoneness: string; // e.g., "Rare", "Medium Rare", "Well Done"
  thickness: number;
  firstSideTime: number; // in seconds
  secondSideTime: number; // in seconds

  constructor(
    personName: string,
    desiredDoneness: string,
    thickness: number
  ) {
    this.personName = personName;
    this.desiredDoneness = desiredDoneness;
    this.thickness = thickness;

    this.firstSideTime = 0;
    this.secondSideTime = 0;
  }

  totalCookingTime(): number {
    return this.firstSideTime + this.secondSideTime;
  }

  description(): string {
    return `${this.personName} wants their steak ${this.desiredDoneness}. 
Cook the first side for ${this.firstSideTime} seconds and the second side for ${this.secondSideTime} seconds. 
Total time: ${this.totalCookingTime()} seconds.`;
  }
}


const steaks: SteakCooking[] = [];

const addSteak = (steak: SteakCooking) => {
  steaks.push(steak);
};

const editSteak = (index: number, updatedSteak: SteakCooking) => {
  if (index >= 0 && index < steaks.length) {
    steaks[index] = updatedSteak;
  }
};

const getSteaks = () => {
  return steaks;
};

export { addSteak, editSteak, getSteaks };
