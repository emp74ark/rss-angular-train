import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.scss',
})
export class OrderPageComponent implements OnInit {
  orderService = inject(OrderService);
  destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.orderService
      .getOrders()
      .pipe(
        tap(orders => console.log(orders)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
