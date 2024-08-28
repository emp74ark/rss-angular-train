import { Component, computed, inject, input } from '@angular/core';
import { StationsService } from '../../services/stations.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Route } from '../../models/route';

@Component({
  selector: 'app-route-graph',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  templateUrl: './route-graph.component.html',
  styleUrl: './route-graph.component.scss',
})
export class RouteGraphComponent {
  route = input<Route>();

  stepsAmount = computed(() => {
    const length = this.route()?.path?.length;
    if (length) {
      return length - 1;
    }
    return 0;
  });

  stationsService = inject(StationsService);

  dateDif(time1: string | undefined, time2: string | undefined) {
    if (time1 && time2) {
      const date1 = new Date(time1).getTime();
      const date2 = new Date(time2).getTime();
      const diff = date2 - date1;
      return `${Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))} min`;
    }
    return null;
  }
}
