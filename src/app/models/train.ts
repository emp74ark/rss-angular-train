import { CarriageData } from './carriage';
import { Segment, RideSegment } from './common';
import { StationData } from './search';

export interface UserTrip extends Omit<DetailedRideInfo, 'fromId' | 'toId' | 'userSegments'> {
  from: StationData;
  to: StationData;
  routeStartCityName: string;
  routeEndCityName: string;
}

export interface RideInfo<T extends Segment> {
  fromId: number;
  toId: number;
  routeId: number;
  rideId: number;
  startTime: string;
  endTime: string;
  path: number[];
  segments: T[];
  userSegments: T[];
}

export interface DetailedRideInfo extends RideInfo<RideSegment> {
  trainInfo: CarriageInfo[];
  price: PriceInfo[];
}

export type BareCarriageInfo = Omit<CarriageInfo, 'seatsOccupied' | 'seatsAvailable'>;

export interface CarriageInfo extends CarriageData {
  number: number;
  seatsAvailable: number;
  seatsTotal: number;
  seatsOccupied: number[];
  firstSeat: number;
  lastSeat: number;
}

export interface AvailableSeats {
  [carriageType: string]: number;
}

export interface PriceInfo {
  type: string;
  price: number;
  seatsAvailable: number;
}
