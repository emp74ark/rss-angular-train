import { Component, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UserTrip } from '../../services/result.service';

@Component({
  selector: 'app-result-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, DatePipe, MatIconModule, CurrencyPipe],
  templateUrl: './result-card.component.html',
  styleUrl: './result-card.component.scss',
})
export class ResultCardComponent {
  @Input() trip: UserTrip;

  router = inject(Router);

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
}
