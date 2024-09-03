import { Component, inject, input, output, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { RouteGraphComponent } from '../route-graph/route-graph.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OrderCardModalComponent } from './order-card-modal/order-card-modal.component';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { OrderCard, OrderStatus } from '../../models/order';
import { DurationPipe } from '../../pipes/duration.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    MatIcon,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatCardActions,
    MatButtonModule,
    MatDialogModule,
    RouteGraphComponent,
    ModalWindowComponent,
    DurationPipe,
  ],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss',
})
export class OrderCardComponent {
  private readonly dialog = inject(MatDialog);

  isManager = input<boolean>(false);

  order = input.required<OrderCard>();

  cancelOrder = output<number>();

  modal = signal<boolean>(false);

  onModal() {
    this.modal.set(!this.modal());
  }

  onCancelOrder() {
    let title = '';
    if (this.isManager()) {
      title = `You wants to cancel ${this.order().userName}'s order ${this.order().id}?`;
    } else {
      title = `Cancel Order ${this.order().id}?`;
    }

    const dialogRef = this.dialog.open(OrderCardModalComponent, {
      width: '320px',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '250ms',
      data: {
        title,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cancelOrder.emit(this.order().id);
      }
    });
  }

  isCancelable(): boolean {
    return this.order().status === OrderStatus.ACTIVE;
  }
}
