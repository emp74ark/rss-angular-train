import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { StationConnections } from '../../models/stations';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { StationsService } from '../../services/stations.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-stations-list',
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardSubtitle,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatChipSet,
    MatChip,
    MatPaginator,
  ],
  templateUrl: './stations-list.component.html',
  styleUrl: './stations-list.component.scss',
})
export class StationsListComponent implements OnInit {
  stationService = inject(StationsService);
  destroyRef = inject(DestroyRef);
  stations = signal<StationConnections[]>([]);

  pageLimit = 5;
  currentPage = signal<number>(0);
  pageItems = computed<StationConnections[]>(() =>
    this.stations().slice(this.currentPage() * this.pageLimit, this.currentPage() * this.pageLimit + this.pageLimit),
  );

  ngOnInit() {
    this.stationService.$stations
      .pipe(
        tap(response => {
          this.stations.set(response);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  getCity(id: number) {
    const station = this.stations().find(s => s.id === id);
    if (station) {
      return station.city;
    }

    return id.toString();
  }

  removeStation(id: number) {
    this.stationService.deleteStation(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  onPaginator($event: PageEvent) {
    this.currentPage.set($event.pageIndex);
  }
}
