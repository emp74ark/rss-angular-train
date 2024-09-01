import { Signal } from '@angular/core';
import { CarriageData } from './carriage';
import { StationConnections } from './stations';

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

export const enum AdminRoutesResponseStatus {
  OK,
  ERROR,
}
