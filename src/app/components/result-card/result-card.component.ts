import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UserTrip } from '../search-result/result-mock';

@Component({
  selector: 'app-result-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, DatePipe, MatIconModule],
  templateUrl: './result-card.component.html',
  styleUrl: './result-card.component.scss',
})
export class ResultCardComponent {
  @Input() trip: UserTrip;
}
