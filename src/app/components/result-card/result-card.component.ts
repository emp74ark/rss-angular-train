import { Component, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DurationPipe } from '../../pipes/duration.pipe';
import { UserTrip } from '../../models/train';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, DatePipe, MatIconModule, CurrencyPipe, DurationPipe],
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
