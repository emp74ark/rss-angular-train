import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, filter, map, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchService } from '../../services/search.service';
import { CurrencyPipe, DatePipe, Location } from '@angular/common';
import { StationsService } from '../../services/stations.service';
import { MatButton } from '@angular/material/button';
import { MatTab, MatTabContent, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { CarriageComponent } from '../../components/carriage/carriage.component';
import { MatCard, MatCardActions, MatCardContent, MatCardTitle } from '@angular/material/card';
import { ModalWindowComponent } from '../../components/modal-window/modal-window.component';
import { RouteGraphComponent } from '../../components/route-graph/route-graph.component';
import { parseInt } from 'lodash';
import { ExtendedRoute } from '../../models/route';
import { RideService } from '../../services/ride.service';
import { DetailedRideInfo } from '../../models/train';
import { OrderWidgetComponent } from '../../components/order-widget/order-widget.component';
import { Seat } from '../../models/carriage';

@Component({
  selector: 'app-trip-page',
  standalone: true,
  imports: [
    DatePipe,
    MatButton,
    MatTabGroup,
    MatTab,
    CarriageComponent,
    MatCard,
    ModalWindowComponent,
    RouteGraphComponent,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatTabContent,
    MatTabLabel,
    CurrencyPipe,
    OrderWidgetComponent,
  ],
  templateUrl: './trip-page.component.html',
  styleUrl: './trip-page.component.scss',
})
export class TripPageComponent implements OnInit {
  location = inject(Location);
  route = inject(ActivatedRoute);
  searchService = inject(SearchService);
  stationsService = inject(StationsService);
  rideService = inject(RideService);
  destroyRef = inject(DestroyRef);

  tripRoute: ExtendedRoute;
  stationFrom: { id: number; city: string };
  stationTo: { id: number; city: string };
  trainDetails: DetailedRideInfo;

  getData() {
    combineLatest([
      this.route.params.pipe(
        filter(params => params['id']),
        map(params => parseInt(params['id'])),
      ),
      this.route.queryParams.pipe(
        filter(params => params['from'] && params['to']),
        map(params => [parseInt(params['from']), parseInt(params['to'])]),
      ),
    ])
      .pipe(
        map(([id, [from, to]]) => {
          return { id, from, to };
        }),
        switchMap(({ id, from, to }) => {
          return combineLatest([
            of({ id, from, to }), // prev data
            this.searchService.searchRide(id), // route
            this.stationsService.getStationById(from), // stationFrom
            this.stationsService.getStationById(to), // stationTo
          ]);
        }),
        switchMap(([base, route, stationFrom, stationTo]) => {
          const details = this.rideService.getDetailedInfo(
            route,
            route.rideId,
            route.schedule.segments,
            base.from,
            base.to,
          );
          return of({ base, route, details, stationFrom, stationTo });
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(result => {
        console.log('RESULT', result);
        this.tripRoute = result.route;
        this.stationFrom = result.stationFrom;
        this.stationTo = result.stationTo;
        this.trainDetails = result.details;
      });
  }

  ngOnInit() {
    this.getData();
  }

  modal = signal<boolean>(false);

  onModal() {
    this.modal.set(!this.modal());
  }

  onBack() {
    this.location.back();
  }

  selectedSeat = signal<Seat | undefined>(undefined);

  onSeatSelect(value: number | undefined, price: number) {
    if (value) {
      if (this.selectedSeat()?.id === value) {
        this.selectedSeat.set(undefined);
      } else {
        this.selectedSeat.set({ id: value, price });
      }
    }
  }
}
