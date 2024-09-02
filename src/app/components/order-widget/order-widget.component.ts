import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardTitle } from '@angular/material/card';
import { Seat } from '../../models/carriage';
import { CurrencyPipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { RouteGraphComponent } from '../route-graph/route-graph.component';

@Component({
  selector: 'app-order-widget',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardTitle,
    CurrencyPipe,
    ModalWindowComponent,
    RouteGraphComponent,
  ],
  templateUrl: './order-widget.component.html',
  styleUrl: './order-widget.component.scss',
})
export class OrderWidgetComponent {
  selectedSeat = input<Seat>();
  rideId = input<number>();
  stationStart = input<number>();
  stationEnd = input<number>();

  orderId = signal<number | undefined>(undefined);

  orderService = inject(OrderService);
  destroyRef = inject(DestroyRef);

  onOrder() {
    const selectedSeat = this.selectedSeat();
    const rideId = this.rideId();
    const stationStart = this.stationStart();
    const stationEnd = this.stationEnd();
    if (selectedSeat && rideId && stationStart && stationEnd) {
      this.orderService
        .createOrder({
          rideId,
          seat: selectedSeat?.id,
          stationStart,
          stationEnd,
        })
        .pipe(
          switchMap(() => this.orderService.$apiStatus),
          tap(status => {
            if (status?.success) {
              this.modalMessage.set(`Order successfully created with}`);
            } else {
              this.modalMessage.set(status?.error as string);
            }
            this.modal.set(true);
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    }
  }

  modal = signal<boolean>(false);
  modalMessage = signal<string>('');

  onModal() {
    this.modal.set(!this.modal());
  }
}
