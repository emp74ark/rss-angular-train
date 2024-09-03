import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { OrderCardComponent } from '../../components/order-card/order-card.component';
import { OrderService } from '../../services/order.service';
import { ProfileService } from '../../services/profile.service';
import { Order, OrderCard, User } from '../../models/order';
import { Profile } from '../../models/profile';
import { MatTabsModule } from '@angular/material/tabs';
import { RideService } from '../../services/ride.service';
import { TrainService } from '../../services/train.service';
import { Segment } from '../../models/common';
import { StationsService } from '../../services/stations.service';
import { StationConnections } from '../../models/stations';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ModalWindowComponent } from '../../components/modal-window/modal-window.component';
import { FilterByPipe } from '../../pipes/filterby.pipe';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [MatTabsModule, OrderCardComponent, AsyncPipe, ModalWindowComponent, FilterByPipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  private readonly orderService = inject(OrderService);

  private readonly stationService = inject(StationsService);

  private readonly profileService = inject(ProfileService);

  private readonly rideService = inject(RideService);

  private readonly trainService = inject(TrainService);

  protected isManager: boolean;

  private profile: Profile;

  modal = signal<boolean>(false);

  private stations: StationConnections[] = [];

  stationSignal: Signal<StationConnections[]> = toSignal(this.stationService.$stations, { initialValue: [] });

  orderCards$: Observable<OrderCard[] | null>;

  ngOnInit(): void {
    this.orderCards$ = combineLatest([this.profileService.loadProfile(), this.stationService.getStations()]).pipe(
      switchMap(([profile, stations]) => {
        this.profile = profile;
        this.isManager = profile.role === 'manager';
        this.stations = stations;
        if (this.isManager) {
          return combineLatest([this.orderService.getOrders(this.isManager), this.orderService.getUsers()]);
        }
        return this.orderService.getOrders(this.isManager);
      }),
      switchMap(() => {
        return combineLatest([this.orderService.$orders, this.orderService.$users]);
      }),
      map(([orders, users]) => {
        if (!orders) {
          return null;
        }

        return this.mapOrdersToOrderCards(orders, users);
      }),
    );
  }

  onModal() {
    this.modal.set(!this.modal());
  }

  private mapOrdersToOrderCards(orders: Order[], users: User[]): OrderCard[] {
    return orders
      .map(order => {
        const rideInfo = this.rideService.getInfo<Segment>(
          { id: order.routeId, path: order.path, carriages: order.carriages },
          order.rideId,
          order.schedule.segments,
          order.stationStart,
          order.stationEnd,
        );
        const seatInfo = this.trainService.getInfoBySeat(order.seatId, order.carriages);
        const prices = this.rideService.getPrice(rideInfo.userSegments);

        const startStation = this.stationSignal().find(station => station.id === order.stationStart);
        const endStation = this.stationSignal().find(station => station.id === order.stationEnd);
        const userName = users.find(user => user.id === order.userId)?.name ?? 'anonymous';

        return {
          id: order.id,
          rideId: order.rideId,
          routeId: order.routeId,
          userId: order.userId,
          userName: userName,
          status: order.status,
          path: order.path,
          startStationName: startStation?.city ?? '',
          startStationId: order.stationStart,
          startTripTime: rideInfo.startTime,
          endStationName: endStation?.city ?? '',
          endStationId: order.stationEnd,
          endTripTime: rideInfo.endTime,
          tripDuration: this.calculateDuration(rideInfo.startTime, rideInfo.endTime),
          currentCarriageType: seatInfo?.code ?? '',
          seatId: order.seatId,
          currentCarriageNumber: seatInfo?.number ?? 0,
          totalPrice: prices[seatInfo?.code ?? ''],
          carriages: order.carriages,
          schedule: order.schedule,
        };
      })
      .sort((a, b) => {
        if (a.startTripTime > b.startTripTime) {
          return 1;
        }
        return -1;
      });
  }

  private calculateDuration(start: string, end: string): string {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHours}h ${diffMinutes}m`;
  }

  cancelOrder(orderId: number) {
    this.onModal();
    this.orderService.cancelOrder(orderId, this.isManager).subscribe();
  }
}
