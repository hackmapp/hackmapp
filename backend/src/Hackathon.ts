interface Date {
  year: number;
  month: number;
  day: number;
}

interface Location {
  longitude: number;
  latitude: number;
}

export default interface Hackathon {
  name: string;
  date: Date;
  location: Location;
  url: string;
}
