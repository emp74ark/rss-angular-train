import { RideRoute, Route, Segment } from './common';

export interface RouteSchedule {
  rideId: number;
  segments: Segment[];
}

export interface ExtendedRoute extends Route {
  schedule: RouteSchedule;
}

export type Trip = {
  from: { city: string };
  to: { city: string };
  routes: RideRoute[];
};
