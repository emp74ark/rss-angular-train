import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UserTrip } from '../../services/result.service';
import { DurationPipe } from '../../pipes/duration.pipe';

@Component({
  selector: 'app-result-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, DatePipe, MatIconModule, CurrencyPipe, DurationPipe],
  templateUrl: './result-card.component.html',
  styleUrl: './result-card.component.scss',
})
export class ResultCardComponent {
  @Input() trip: UserTrip;
}
