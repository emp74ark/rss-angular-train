export type GeoTag = {
  latitude: number;
  longitude: number;
};

export type StationData = {
  stationId: number;
  city: string;
  geolocation: GeoTag;
};

export type RideSegment = {
  time: string[];
  price: Record<string, number>;
  occupiedSeats: number[];
};

export type Ride = {
  rideId: number;
  segments: RideSegment[];
};

export type Route = {
  id: number;
  path: number[];
  carriages: string[];
  schedule: Ride[];
};

export type SearchResult = {
  from: StationData;
  to: StationData;
  routes: Route[];
};
