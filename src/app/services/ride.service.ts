import { inject, Injectable } from '@angular/core';
import { PriceList, RideRoute, RideSegment, Route, Segment } from '../models/common';
import { TrainService } from './train.service';
import { AvailableSeats, CarriageInfo, DetailedRideInfo, PriceInfo, RideInfo } from '../models/train';

@Injectable({
  providedIn: 'root',
})
export class RideService {
  private readonly trainService = inject(TrainService);

  composeAll(routes: RideRoute[], fromId: number, toId: number): DetailedRideInfo[] {
    return routes
      .map(el =>
        el.schedule.map(ride => ({
          fromId,
          toId,
          rideId: ride.rideId,
          routeId: el.id,
          path: el.path,
          carriages: el.carriages,
          segments: ride.segments,
        })),
      )
      .flat()
      .map(el =>
        this.getDetailedInfo(
          { id: el.routeId, path: el.path, carriages: el.carriages },
          el.rideId,
          el.segments,
          fromId,
          toId,
        ),
      );
  }

  getDetailedInfo(
    route: Route,
    rideId: number,
    segments: RideSegment[],
    fromId: number,
    toId: number,
  ): DetailedRideInfo {
    const info = this.getInfo(route, rideId, segments, fromId, toId);
    const seatsOccupiedTotal = this.getSeatsOccupiedTotal(info.userSegments);
    const trainInfo = this.getTrainInfo(route.carriages, seatsOccupiedTotal);
    const price = this.getPrice(info.userSegments);
    const availableSeats = this.getSeatsAvailableSortedByCarriageType(route.carriages, seatsOccupiedTotal);

    return {
      ...info,
      trainInfo,
      price: this.composePriceInfo(price, availableSeats),
    };
  }

  getInfo<T extends Segment>(route: Route, rideId: number, segments: T[], fromId: number, toId: number): RideInfo<T> {
    const userSegments = this.getUserSegments(segments, route.path, fromId, toId);
    const startTime = userSegments[0].time[0];
    const endTime = userSegments[userSegments.length - 1].time[1];

    return {
      fromId,
      toId,
      routeId: route.id,
      rideId,
      startTime,
      endTime,
      path: route.path,
      segments,
      userSegments,
    };
  }

  private getSeatsAvailableSortedByCarriageType(carriages: string[], seatsOccupied: number[]): AvailableSeats {
    const trainConfig = this.getTrainInfo(carriages, seatsOccupied);

    return trainConfig.reduce((acc, el) => {
      acc[el.code] = acc[el.code] ? acc[el.code] + el.seatsAvailable : el.seatsAvailable;
      return acc;
    }, {} as AvailableSeats);
  }

  private getTrainInfo(carriages: string[], seatsOccupied: number[]): CarriageInfo[] {
    const trainConfig = this.trainService.createTrainConfig(carriages);
    return trainConfig.map(carriage => {
      const occupiedInCarriage = seatsOccupied.filter(x => x >= carriage.firstSeat && x <= carriage.lastSeat);
      const seatsAvailable = carriage.seatsTotal - occupiedInCarriage.length;

      return {
        ...carriage,
        seatsAvailable,
        seatsOccupied: occupiedInCarriage,
      };
    });
  }

  private composePriceInfo(priceList: PriceList, availableSeats: AvailableSeats): PriceInfo[] {
    return Object.keys(priceList).map(carType => ({
      type: carType,
      price: priceList[carType],
      seatsAvailable: availableSeats[carType],
    }));
  }

  private getPrice(userSegments: (RideSegment | Segment)[]): PriceList {
    return userSegments.reduce((acc, el) => {
      for (const key in el.price) {
        acc[key] = acc[key] ? acc[key] + el.price[key] : el.price[key];
      }
      return acc;
    }, {} as PriceList);
  }

  private getSeatsOccupiedTotal(userSegments: RideSegment[]): number[] {
    const seats = userSegments.map(segment => segment.occupiedSeats).flat();
    return [...new Set(seats)];
  }

  private getUserSegments<T>(segments: T[], path: number[], fromId: number, toId: number): T[] {
    const startRouteIdx = this.getStationRouteInx(fromId, path);
    const endRouteInx = this.getStationRouteInx(toId, path);

    return segments.slice(startRouteIdx, endRouteInx);
  }

  private getStationRouteInx(id: number, path: number[]): number {
    return path.findIndex(inx => inx === id);
  }
}
