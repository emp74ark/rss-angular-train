import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, filter, map, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchService } from '../../services/search.service';
import { DatePipe } from '@angular/common';
import { StationsService } from '../../services/stations.service';
import { MatButton } from '@angular/material/button';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CarriageComponent } from '../../components/carriage/carriage.component';
import { MatCard } from '@angular/material/card';
import { ModalWindowComponent } from '../../components/modal-window/modal-window.component';
import { RouteGraphComponent } from '../../components/route-graph/route-graph.component';
import { Route } from '../../models/route';

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
  ],
  templateUrl: './trip-page.component.html',
  styleUrl: './trip-page.component.scss',
})
export class TripPageComponent implements OnInit {
  route = inject(ActivatedRoute);
  searchService = inject(SearchService);
  stationsService = inject(StationsService);
  destroyRef = inject(DestroyRef);

  rideId: number;
  tripRoute: Route;
  stationFrom: string;
  departureDate: string;
  stationTo: string;
  arrivalDate: string;
  carriages: string[];

  ngOnInit() {
    this.stationsService.getStations().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
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
          this.carriages = route.carriages;
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
          this.stationFrom = res[0]?.city;
          this.stationTo = res[1]?.city;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  modal = signal<boolean>(false);

  onModal() {
    this.modal.set(!this.modal());
  }
}
