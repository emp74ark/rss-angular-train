import { StationData } from './search';

export type ApiStatus = {
  success: boolean;
  error: null | string;
};

export interface Route {
  id: number;
  path: number[];
  carriages: string[];
}

export interface Segment {
  time: string[];
  price: PriceList;
}

export interface RideSegment extends Segment {
  occupiedSeats: number[];
}

export interface RideSchedule {
  rideId: number;
  segments: RideSegment[];
}

export interface RideAdminSchedule {
  rideId: number;
  segments: Segment[];
}

export interface RideRoute extends Route {
  schedule: RideSchedule[];
}

export interface RideAdminRoute extends Route {
  schedule: RideAdminSchedule[];
}

export type SearchResult = {
  from: StationData;
  to: StationData;
  routes: RideRoute[];
};

export interface PriceList {
  [carriageType: string]: number;
}
