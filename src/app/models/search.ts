export type GeoTag = {
  latitude: number;
  longitude: number;
};

export type StationData = {
  stationId: number;
  city: string;
  geolocation: GeoTag;
};
