import { Component, computed, DestroyRef, inject, OnInit, Signal } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { ResultCardComponent } from '../result-card/result-card.component';
import { ResultService, UserTrip } from '../../services/result.service';
import moment from 'moment';

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
  readonly resultService = inject(ResultService);
  private readonly destroyRef = inject(DestroyRef);
  private cardData: UserTrip[];
  protected datesSig: Signal<string[] | null>;
  protected activeDate: string;
  protected trips: UserTrip[];
  protected isNoRide: boolean;

  constructor() {
    const rideListSig = this.resultService.rideList;
    this.datesSig = computed(() => {
      const data = rideListSig();
      if (!data) {
        return null;
      }
      this.cardData = data.sort((a, b) => {
        if (a.startTime > b.startTime) {
          return 1;
        }
        return -1;
      });
      this.isNoRide = this.cardData.length === 0 ? true : false;

      console.log('dataResult', data);
      const availableDates = this.getAllDates();
      this.activeDate = availableDates[0];
      this.renderTrips();
      return availableDates;
    });
  }

  ngOnInit(): void {
    this.searchService.$searchResults
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => console.log('SearchResultComponent', { data }));
  }

  renderTrips(): void {
    this.trips = this.cardData.filter(data => this.activeDate === this.getDate(data.startTime));
  }

  private getAllDates(): string[] {
    return [...new Set(this.cardData.map(x => this.getDate(x.startTime)))].sort();
  }

  private getDate(isoString: string): string {
    return moment(isoString).format('YYYY-MM-DD');
  }
}
