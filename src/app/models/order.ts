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
