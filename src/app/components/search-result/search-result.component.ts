import { Component, DestroyRef, inject } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-search-result',
  standalone: true,
  imports: [AsyncPipe, MatListModule, MatCardModule],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.scss',
})
export class SearchResultComponent {
  readonly searchService = inject(SearchService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.searchService.$searchResults
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => console.log('SearchResultComponent', { data }));
  }
}
