export type MaporyMapItem = {
  id: string;
  placeName: string;
  location: MapLocation;
  visitDate: Date;
  rating?: number;
};

export type MapLocation = {
  latitude: number;
  longitude: number;
};
