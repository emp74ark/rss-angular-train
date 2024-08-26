import { ProfileRole } from './profile';

export enum OrderStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  CANCELED = 'canceled',
}

interface Schedule {
  segments: {
    time: string[];
    price: Record<string, number>;
  }[];
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
  schedule: Schedule;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: ProfileRole;
}
