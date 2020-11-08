export type MaporyMapItem = {
  id: string;
  placeName: string;
  location: {
    latitude: number;
    longitude: number;
  };
  visitDate: Date;
  rating?: number;
};
