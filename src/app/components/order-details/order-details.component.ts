import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { Order } from '../../models/order';
import { MatCard, MatCardActions, MatCardContent, MatCardTitle } from '@angular/material/card';
import { OrderService } from '../../services/order.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [MatCard, MatCardTitle, MatCardContent, MatCardActions, MatButton],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss',
})
export class OrderDetailsComponent {
  order = input<Order>();
  orderService = inject(OrderService);
  destroyRef = inject(DestroyRef);

  orderCancelled = output<boolean>();

  onCancel() {
    const id = this.order()?.id;
    if (id) {
      this.orderService
        .cancelOrder(id)
        .pipe(
          tap(res => {
            console.log('ORDER CANCELATION', res);
            this.orderCancelled.emit(true);
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    }
  }
}
