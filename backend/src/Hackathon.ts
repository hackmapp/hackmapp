export interface Date {
  year: number;
  month: number;
  day: number;
}

export interface Location {
  longitude: number;
  latitude: number;
}

export default interface Hackathon {
  name: string;
  isHighSchool: boolean;
  startDate: Date;
  endDate: Date;
  location: Location;
  url: string;
}
