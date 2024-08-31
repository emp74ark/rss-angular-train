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
import { CarriageData, CarriageWithSeatsData, Seat } from '../../models/carriage';
import { ExtendedRoute } from '../../models/route';
import { Segment } from '../../models/common';
import { OrderWidgetComponent } from '../../components/order-widget/order-widget.component';

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
  carriageService = inject(CarriageService);
  destroyRef = inject(DestroyRef);

  rideId: number;
  tripRoute: ExtendedRoute;
  stationFrom: { stationId: number; cityName: string };
  departureDate: string;
  stationTo: { stationId: number; cityName: string };
  arrivalDate: string;
  carriages: CarriageWithSeatsData[];
  carriageTypes: CarriageData[];
  currentSegment: Segment;
  seatPrices: Record<string, number> | undefined;

  calcSeatsAmount(c: CarriageData) {
    return c.rows * (c.leftSeats + c.rightSeats);
  }

  calcCarriageTypeAmount() {
    const cTypes = [...new Set(this.tripRoute.carriages)];
    const data: Record<string, number> = {};
    cTypes.forEach(c => {
      data[c] = this.tripRoute.carriages.filter((i: string) => i === c).length;
    });
    return data;
  }

  getCarriageSeats(list: string[]) {
    const data: CarriageWithSeatsData[] = [];
    let seatsCounter = 1;
    for (let i = 0; i < list.length; i++) {
      const carriageDescription = this.carriageTypes.find(c => c.code === list[i]);
      if (carriageDescription) {
        const amountOfSeats = this.calcSeatsAmount(carriageDescription);
        data.push({
          ...carriageDescription,
          index: i,
          firstSeatNumber: seatsCounter,
        });
        seatsCounter += amountOfSeats;
      }
    }
    return data;
  }

  getSeatsPrice(segment: Segment) {
    const price = segment?.price;

    if (!price) {
      return;
    }

    const data: Record<string, number> = {};
    const types = this.calcCarriageTypeAmount();
    Object.entries(segment?.price).forEach(([key, value]) => {
      data[key] = value / types?.[key];
    });

    return data;
  }

  ngOnInit() {
    // preload stations
    this.stationsService.getStations().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();

    // preload carriage types
    this.carriageService
      .get()
      .pipe(
        switchMap(() => this.carriageService.$carriages),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(res => (this.carriageTypes = res));

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
            this.stationsService.getStationById(params.from), // from -> 0
            this.stationsService.getStationById(params.to), // to -> 1
            this.route.params, // id -> 2
          ]),
        ),
        tap(res => {
          this.stationFrom = { stationId: res[0]?.id, cityName: res[0]?.city }; // page header
          this.stationTo = { stationId: res[1]?.id, cityName: res[1]?.city }; // page header
          this.rideId = res[2]['id']; // page header & ride details bellow
        }),
        switchMap(prev => {
          return this.searchService.searchRide(prev[2]['id']);
        }),
        tap(route => {
          this.tripRoute = route;
          const segmentIndex = route.path?.findIndex((el: number) => el === this.stationFrom?.stationId);
          const currentSegment = route.schedule?.segments[segmentIndex];
          this.currentSegment = currentSegment;
          this.departureDate = currentSegment?.time[0];
          this.arrivalDate = currentSegment?.time[1];
          // get carriage name, seats numbers
          this.carriages = this.getCarriageSeats(route.carriages);
          // get occupied seats and price
          this.seatPrices = this.getSeatsPrice(currentSegment);
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

  selectedSeats = signal<Seat[]>([]);

  onSeatSelect(id: string, carriageType: string) {
    const seatNumber = parseInt(id);
    if (this.selectedSeats().some(s => s.id === seatNumber)) {
      this.selectedSeats.set(this.selectedSeats().filter(el => el.id !== seatNumber));
    } else {
      this.selectedSeats.set([
        ...this.selectedSeats(),
        {
          id: seatNumber,
          price: this.seatPrices?.[carriageType],
        },
      ]);
    }
  }
}
