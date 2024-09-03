import { Segment } from './common';
import { ProfileRole } from './profile';

export enum OrderStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  CANCELED = 'canceled',
}

interface OrderSchedule {
  segments: Segment[];
}

export interface Order {
  id: number;
  rideId: number;
  routeId: number;
  seatId: number;
  userId: number;
  status: OrderStatus;
  path: number[];
  stationStart: number;
  stationEnd: number;
  carriages: string[];
  schedule: OrderSchedule;
}

export interface OrderCard {
  id: number;
  rideId: number;
  routeId: number;
  userId: number;
  userName: string;
  status: OrderStatus;
  path: number[];
  startStationName: string;
  startStationId: number;
  startTripTime: string;
  endStationName: string;
  endStationId: number;
  endTripTime: string;
  tripDuration: string;
  currentCarriageType: string;
  seatId: number;
  currentCarriageNumber: number;
  totalPrice: number;
  carriages: string[];
  schedule: OrderSchedule;
}

export interface OrderBody {
  rideId: number;
  seat: number;
  stationStart: number;
  stationEnd: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: ProfileRole;
}
