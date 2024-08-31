import { Component, computed, inject, input } from '@angular/core';
import { StationsService } from '../../services/stations.service';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { ExtendedRoute } from '../../models/route';
import { DateDiffPipe } from '../../pipes/date-diff.pipe';

@Component({
  selector: 'app-route-graph',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgClass, DateDiffPipe],
  templateUrl: './route-graph.component.html',
  styleUrl: './route-graph.component.scss',
})
export class RouteGraphComponent {
  route = input<ExtendedRoute>();
  startStation = input<number>();
  startStationIndex = computed(() => {
    return this.route()?.path?.findIndex(id => id === this.startStation());
  });
  lastStation = input<number>();
  lastStationIndex = computed(() => {
    return this.route()?.path?.findIndex(id => id === this.lastStation());
  });

  stepsAmount = computed(() => {
    const length = this.route()?.path?.length;
    if (length) {
      return length - 1;
    }
    return 0;
  });

  stationsService = inject(StationsService);

  isHighlighted(index: number): boolean {
    const start = this.startStationIndex();
    const end = this.lastStationIndex();
    if (!start || !end) return false;
    return index >= start && index <= end;
  }
}
