import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { StationsService } from '../../services/stations.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchPanelComponent } from '../../components/search-panel/search-panel.component';
import { SearchResultComponent } from '../../components/search-result/search-result.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [SearchPanelComponent, SearchResultComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent implements OnInit {
  stationsService = inject(StationsService);
  destroyRef = inject(DestroyRef);

  ngOnInit() {
    // prefetch all stations
    this.stationsService.getStations().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
