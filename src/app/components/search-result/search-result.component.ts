import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { dates, tripInfo, TripResponse, UserTrip } from './result-mock';
import { ResultCardComponent } from '../result-card/result-card.component';

@Component({
  selector: 'app-search-result',
  standalone: true,
  imports: [
    AsyncPipe,
    MatListModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    DatePipe,
    NgClass,
    ResultCardComponent,
  ],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.scss',
})
export class SearchResultComponent implements OnInit {
  readonly searchService = inject(SearchService);
  private readonly destroyRef = inject(DestroyRef);
  protected dates = dates;
  protected activeDate: string = this.dates[0];
  protected trips: UserTrip[];
  private response: TripResponse = tripInfo;

  ngOnInit(): void {
    this.searchService.$searchResults
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => console.log('SearchResultComponent', { data }));

    this.trips = this.response[this.activeDate];
  }

  renderTrips(): void {
    this.trips = this.response[this.activeDate];
  }
}
