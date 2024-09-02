import { Component, inject, Input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DurationPipe } from '../../pipes/duration.pipe';
import { UserTrip } from '../../models/train';
import { Router } from '@angular/router';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { RouteGraphComponent } from '../route-graph/route-graph.component';

@Component({
  selector: 'app-result-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    DatePipe,
    MatIconModule,
    CurrencyPipe,
    DurationPipe,
    ModalWindowComponent,
    RouteGraphComponent,
  ],
  templateUrl: './result-card.component.html',
  styleUrl: './result-card.component.scss',
})
export class ResultCardComponent {
  @Input() trip: UserTrip;
  readonly modal = signal<boolean>(false);
  private readonly router = inject(Router);

  onNavigateToTrip() {
    const rideId = this.trip.rideId.toString();
    const from = this.trip.from.stationId;
    const to = this.trip.to.stationId;
    this.router.navigate([`trip/${rideId}`], {
      queryParams: {
        from: from,
        to: to,
      },
    });
  }

  openGraph(event: Event) {
    event.stopPropagation();
    this.onModal();
  }

  onModal() {
    this.modal.set(!this.modal());
  }
}
