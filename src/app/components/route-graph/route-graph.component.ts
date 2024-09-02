import { Component, computed, inject, input } from '@angular/core';
import { StationsService } from '../../services/stations.service';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { DurationPipe } from '../../pipes/duration.pipe';
import { RideSegment, Segment } from '../../models/common';

@Component({
  selector: 'app-route-graph',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgClass, DurationPipe],
  templateUrl: './route-graph.component.html',
  styleUrl: './route-graph.component.scss',
})
export class RouteGraphComponent {
  path = input<Array<number>>();
  segments = input<Array<RideSegment | Segment>>();
  startStation = input<number>();
  startStationIndex = computed(() => {
    return this.path()?.findIndex(id => id === this.startStation());
  });
  lastStation = input<number>();
  lastStationIndex = computed(() => {
    return this.path()?.findIndex(id => id === this.lastStation());
  });

  stepsAmount = computed(() => {
    const length = this.path()?.length;
    if (length) {
      return length - 1;
    }
    return 0;
  });

  stationsService = inject(StationsService);

  isHighlighted(index: number): boolean {
    const start = this.startStationIndex();
    const end = this.lastStationIndex();
    if (start === undefined || end === undefined) return false;
    return index >= start && index <= end;
  }
}
