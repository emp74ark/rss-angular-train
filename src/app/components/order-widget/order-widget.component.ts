import { Component, DestroyRef, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardTitle } from '@angular/material/card';
import { Seat } from '../../models/carriage';
import { CurrencyPipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-order-widget',
  standalone: true,
  imports: [MatButton, MatCard, MatCardActions, MatCardContent, MatCardTitle, CurrencyPipe],
  templateUrl: './order-widget.component.html',
  styleUrl: './order-widget.component.scss',
})
export class OrderWidgetComponent {
  selectedSeat = input<Seat>();
  rideId = input<number>();
  stationStart = input<number>();
  stationEnd = input<number>();

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
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(res => console.log('ORDER', res));
    }
  }
}
