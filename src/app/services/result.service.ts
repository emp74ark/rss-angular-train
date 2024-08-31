import { computed, inject, Injectable, Signal } from '@angular/core';
import { PriceList, RideRoute, RideSegment, SearchResult } from '../models/common';
import { SearchService } from './search.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { StationsService } from './stations.service';
import { CarriageService } from './carriage';
import { StationConnections } from '../models/stations';
import { CarriageData } from '../models/carriage';
import { StationData } from '../models/search';

export interface UserTrip {
  from: StationData;
  to: StationData;
  routeId: number;
  rideId: number;
  startTime: string;
  endTime: string;
  routeStartCityName: string;
  routeEndCityName: string;
  price: PriceInfo[];
}

type BareCarriageInfo = Omit<CarriageInfo, 'seatsOccupied' | 'seatsAvailable'>;

export interface PriceInfo {
  type: string;
  price: number;
  seatsAvailable: number;
}

export interface CarriageInfo extends CarriageData {
  number: number;
  seatsAvailable: number;
  seatsTotal: number;
  seatsOccupied: number[];
  firstSeat: number;
  lastSeat: number;
}

interface InfoFromRoute {
  routeId: number;
  rideId: number;
  userSegments: RideSegment[];
  routeStartCityId: number;
  routeEndCityId: number;
  carriageConfig: string[];
}

export interface AvailableSeats {
  [carriageType: string]: number;
}

@Injectable({
  providedIn: 'root',
})
export class ResultService {
  rideList: Signal<UserTrip[] | null>;
  private readonly searchService = inject(SearchService);
  private readonly stationsService = inject(StationsService);
  private readonly carriageService = inject(CarriageService);
  // private readonly destroyRef = inject(DestroyRef);

  // sr: Signal<SearchResult | null>;
  // st: Signal<StationConnections[]>;
  // cr: Signal<CarriageData[]>;

  constructor() {
    const searchResultSignal = toSignal(this.searchService.$searchResults, { initialValue: null });
    const stationSignal = toSignal(this.stationsService.$stations, { initialValue: [] });
    const carriageSignal = toSignal(this.carriageService.$carriages, { initialValue: [] });

    this.rideList = computed(() => {
      const searchResult = searchResultSignal();
      const stations = stationSignal();
      const carriages = carriageSignal();

      if (!searchResult || !stations.length || !carriages.length) {
        return null;
      }
      return this.convert(searchResult, stations, carriages);
    });
  }

  // this.com1 = this.mysupersrvice.com

  // @let com = com1();

  convert(res: SearchResult, stations: StationConnections[], carriages: CarriageData[]): UserTrip[] {
    const userTripList: UserTrip[] = [];
    const {
      from: { stationId: fromId },
      to: { stationId: toId },
      routes,
    } = res;

    // const dates = new Set();

    const suggestionList = routes.map(route => this.getUserRides(route, fromId, toId)).flat();

    suggestionList.forEach(suggestion => {
      const routeStartCityName =
        stations.find(x => x.id === suggestion.routeStartCityId)?.city ?? suggestion.routeStartCityId.toString();
      const routeEndCityName =
        stations.find(x => x.id === suggestion.routeEndCityId)?.city ?? suggestion.routeStartCityId.toString();
      const startTime = suggestion.userSegments[0].time[0];
      const endTime = suggestion.userSegments[suggestion.userSegments.length - 1].time[1];
      const price = this.getPrice(suggestion.userSegments);
      const seatsOccupiedTotal = this.getSeatsOccupiedTotal(suggestion.userSegments);
      const availableSeats = this.getSeatsAvailableSortedByCarriageType(
        suggestion.carriageConfig,
        carriages,
        seatsOccupiedTotal,
      );

      const userTrip: UserTrip = {
        from: res.from,
        to: res.to,
        routeId: suggestion.routeId,
        rideId: suggestion.rideId,
        startTime,
        endTime,
        routeStartCityName,
        routeEndCityName,
        price: this.composePriceInfo(price, availableSeats),
      };

      userTripList.push(userTrip);
    });
    return userTripList;
  }

  private composePriceInfo(priceList: PriceList, availableSeats: AvailableSeats): PriceInfo[] {
    return Object.keys(priceList).map(carType => ({
      type: carType,
      price: priceList[carType],
      seatsAvailable: availableSeats[carType],
    }));
  }

  private getSeatsAvailableSortedByCarriageType(
    carriages: string[],
    carriageData: CarriageData[],
    seatsOccupied: number[],
  ): AvailableSeats {
    const trainConfig = this.getTrainInfo(carriages, carriageData, seatsOccupied);

    return trainConfig.reduce((acc, el) => {
      acc[el.code] = acc[el.code] ? acc[el.code] + el.seatsAvailable : el.seatsAvailable;
      return acc;
    }, {} as AvailableSeats);
  }

  private getInfoBySeat(seat: number, carriages: string[], carriageData: CarriageData[]): BareCarriageInfo | undefined {
    const trainConfig = this.createTrainConfig(carriages, carriageData);
    return trainConfig.find(carriage => seat >= carriage.firstSeat && seat <= carriage.lastSeat);
  }

  private getTrainInfo(carriages: string[], carriageData: CarriageData[], seatsOccupied: number[]): CarriageInfo[] {
    const trainConfig = this.createTrainConfig(carriages, carriageData);
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

  private createTrainConfig(carriages: string[], carriageData: CarriageData[]): BareCarriageInfo[] {
    const trainConfig: BareCarriageInfo[] = [];
    const substituteCarriage: CarriageData = {
      code: '$+',
      name: 'лухари121',
      rows: 3,
      leftSeats: 3,
      rightSeats: 30,
    };

    carriages.forEach((carriage, inx) => {
      const carData = carriageData.find(el => el.code === carriage) ?? substituteCarriage;

      const number = inx + 1;
      const seatsTotal = (carData.leftSeats + carData.rightSeats) * carData.rows;
      const firstSeat = number === 1 ? 1 : trainConfig[trainConfig.length - 1].lastSeat + 1;
      const lastSeat = seatsTotal + firstSeat - 1;
      const carriageInfo = {
        ...carData,
        number,
        seatsTotal,
        firstSeat,
        lastSeat,
      };
      trainConfig.push(carriageInfo);
    });

    return trainConfig;
  }

  private getSeatsOccupiedTotal(userSegments: RideSegment[]): number[] {
    const seats = userSegments.map(segment => segment.occupiedSeats).flat();
    return [...new Set(seats)];
  }

  private getPrice(userSegments: RideSegment[]): PriceList {
    return userSegments.reduce((acc, el) => {
      for (const key in el.price) {
        acc[key] = acc[key] ? acc[key] + el.price[key] : el.price[key];
      }
      return acc;
    }, {} as PriceList);
  }

  private getUserRides(route: RideRoute, fromId: number, toId: number): InfoFromRoute[] {
    const startRouteIdx = this.getStationRouteInx(fromId, route);
    const endRouteInx = this.getStationRouteInx(toId, route);

    const routeInfo = {
      routeId: route.id,
      routeStartCityId: route.path[0],
      routeEndCityId: route.path[route.path.length - 1],
      carriageConfig: route.carriages,
    };
    const rideList = route.schedule.map(ride => ({
      rideId: ride.rideId,
      userSegments: ride.segments.slice(startRouteIdx, endRouteInx),
    }));

    return rideList.map(ride => ({ ...ride, ...routeInfo }));
  }

  private getStationRouteInx(id: number, route: RideRoute): number {
    return route.path.findIndex(inx => inx === id);
  }
}
