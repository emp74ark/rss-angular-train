import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { OrderDetailsComponent } from '../../components/order-details/order-details.component';
import { Order } from '../../models/order';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [AsyncPipe, OrderDetailsComponent],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.scss',
})
export class OrderPageComponent implements OnInit {
  orderService = inject(OrderService);
  destroyRef = inject(DestroyRef);

  orders: Order[] = [];

  getAllOrders() {
    this.orderService
      .getOrders(true)
      .pipe(
        tap(orders => {
          if (orders) {
            this.orders = orders;
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  ngOnInit() {
    this.getAllOrders();
  }

  onOrderListChanged() {
    this.getAllOrders();
  }
}
