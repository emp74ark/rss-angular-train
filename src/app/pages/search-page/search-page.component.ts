import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CarriageComponent } from '../../components/carriage/carriage.component';
import { StationsService } from '../../services/stations.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [HeaderComponent, CarriageComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent implements OnInit {
  stationsService = inject(StationsService);
  destroyRef = inject(DestroyRef);

  ngOnInit() {
    // prefetch all stations
    this.stationsService.getStations().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
