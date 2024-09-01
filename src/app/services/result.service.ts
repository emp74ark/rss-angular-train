import { computed, inject, Injectable, Signal } from '@angular/core';
import { SearchResult } from '../models/common';
import { SearchService } from './search.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { StationsService } from './stations.service';
import { StationConnections } from '../models/stations';
import { RideService } from './ride.service';
import { UserTrip } from '../models/train';

@Injectable({
  providedIn: 'root',
})
export class ResultService {
  rideList: Signal<UserTrip[] | null>;
  private readonly searchService = inject(SearchService);
  private readonly stationsService = inject(StationsService);
  private readonly rideService = inject(RideService);

  constructor() {
    const searchResultSignal = toSignal(this.searchService.$searchResults, { initialValue: null });
    const stationSignal = toSignal(this.stationsService.$stations, { initialValue: [] });

    this.rideList = computed(() => {
      const searchResult = searchResultSignal();
      const stations = stationSignal();

      if (!searchResult || !stations.length) {
        return null;
      }
      return this.compose(searchResult, stations);
    });
  }

  private compose(res: SearchResult, stations: StationConnections[]): UserTrip[] {
    const { from, to, routes } = res;
    const rideList = this.rideService.composeAll(routes, from.stationId, to.stationId);

    return rideList.map(ride => {
      const { routeId, rideId, startTime, endTime, path, segments, price, trainInfo } = ride;
      const routeStartCityName = stations.find(x => ride.path[0] === x.id)?.city ?? '';
      const routeEndCityName = stations.find(x => ride.path[ride.path.length - 1] === x.id)?.city ?? '';

      return {
        from,
        to,
        routeId,
        rideId,
        startTime,
        endTime,
        path,
        segments,
        price,
        trainInfo,
        routeStartCityName,
        routeEndCityName,
      };
    });
  }
}
