import { Signal } from '@angular/core';
import { CarriageData } from './carriage';
import { StationConnections } from './stations';
import { Route } from './common';
import { RouteSchedule } from './route';

export interface ICombinedRoutes {
  id: number;
  path: StationConnections[];
  carriages: CarriageData[];
}

export interface IStation {
  id: number;
  cityName: string;
}

export interface ICarriage {
  code: string;
  carriageName: string;
}

export type TStationsRecord = Record<number, IStation[]>;

export interface IAdminRoutesStationListValidatorParams {
  that: object;
  stationsRecord: Signal<TStationsRecord> | null;
}

export interface IAdminRIdeTimeValidatorParams {
  that: object;
  previousTime: Signal<string>;
  nextTime: Signal<string>;
}

export const enum AdminRoutesResponseStatus {
  OK,
  ERROR,
}

export interface AdminExtendedRoute extends Route {
  schedule: RouteSchedule[];
}

export interface IFilledCarriage {
  carriageName: string;
  carriageCode: string;
  carriagePrice: number;
}

export interface ISegmentStation {
  id: number;
  city: string;
}

export interface IFilledSegment {
  time: string[];
  timeFrom: string;
  timeTo: string;
  formattedTimeFrom: string;
  formattedTimeTo: string;
  stationFrom: ISegmentStation;
  stationTo: ISegmentStation;
  filledPrice: IFilledCarriage[];
}

export interface IFilledSchedule {
  rideId: number;
  filledSegments: IFilledSegment[];
}

export interface AdminExtendedFilledRoute extends Route {
  filledShedule: IFilledSchedule[];
}
