import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, filter, map, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchService } from '../../services/search.service';
import { DatePipe, Location } from '@angular/common';
import { StationsService } from '../../services/stations.service';
import { MatButton } from '@angular/material/button';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CarriageComponent } from '../../components/carriage/carriage.component';
import { MatCard, MatCardActions, MatCardContent, MatCardTitle } from '@angular/material/card';
import { ModalWindowComponent } from '../../components/modal-window/modal-window.component';
import { RouteGraphComponent } from '../../components/route-graph/route-graph.component';
import { parseInt } from 'lodash';
import { CarriageService } from '../../services/carriage';
import { CarriageData } from '../../models/carriage';
import { ExtendedRoute } from '../../models/route';

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
  ],
  templateUrl: './trip-page.component.html',
  styleUrl: './trip-page.component.scss',
})
export class TripPageComponent implements OnInit {
  location = inject(Location);
  route = inject(ActivatedRoute);
  searchService = inject(SearchService);
  stationsService = inject(StationsService);
  carriageService = inject(CarriageService);
  destroyRef = inject(DestroyRef);

  rideId: number;
  tripRoute: ExtendedRoute;
  stationFrom: { stationId: number; cityName: string };
  departureDate: string;
  stationTo: { stationId: number; cityName: string };
  arrivalDate: string;
  carriages: CarriageData[];
  carriageTypes: CarriageData[];

  getCarriageData(carriageName: string) {
    return this.carriageTypes.find(el => el.code === carriageName);
  }

  ngOnInit() {
    // preload stations
    this.stationsService
      .getStations()
      .pipe(
        // tap(st => console.log(st)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
    // preload carriage types
    this.carriageService
      .get()
      .pipe(
        switchMap(() => {
          return this.carriageService.$carriages;
        }),
        tap(res => {
          console.log(res);
          this.carriageTypes = res;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
    // id
    this.route.params
      .pipe(
        tap(params => console.log(params)),
        switchMap(params => {
          return this.searchService.searchRide(params['id']);
        }),
        tap(route => {
          const steps: number = route.path.length;
          this.rideId = route.rideId;
          this.departureDate = route.schedule.segments[0].time[0];
          this.arrivalDate = route.schedule.segments[steps - 2].time[1];
          this.carriages = route.carriages.map((el: string) => this.getCarriageData(el));
          this.tripRoute = route;
          console.log(route);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    // from & to
    this.route.queryParams
      .pipe(
        filter(params => params['from'] && params['to']),
        map(params => ({
          from: parseInt(params['from']),
          to: parseInt(params['to']),
        })),
        switchMap(params =>
          combineLatest([
            this.stationsService.getStationById(params.from),
            this.stationsService.getStationById(params.to),
          ]),
        ),
        tap(res => {
          this.stationFrom = { stationId: res[0]?.id, cityName: res[0]?.city };
          this.stationTo = { stationId: res[1]?.id, cityName: res[1]?.city };
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  modal = signal<boolean>(false);

  onModal() {
    this.modal.set(!this.modal());
  }

  onBack() {
    this.location.back();
  }

  selectedSeats = signal<number[]>([]);

  onSeatSelect(value: string) {
    const seatNumber = parseInt(value);
    if (this.selectedSeats().includes(seatNumber)) {
      this.selectedSeats.set(this.selectedSeats().filter(el => el !== seatNumber));
    } else {
      this.selectedSeats.set([...this.selectedSeats(), seatNumber]);
    }
  }
}
