import { AsyncPipe } from '@angular/common';
import { Component, inject, DestroyRef, OnInit, Signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbar } from '@angular/material/toolbar';
import { StationsService } from '../../services/stations.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Station, StationConnections } from '../../models/stations';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SearchService } from '../../services/search.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search-panel',
  standalone: true,
  imports: [
    MatToolbar,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './search-panel.component.html',
  styleUrl: './search-panel.component.scss',
})
export class SearchPanelComponent implements OnInit {
  protected filteredFrom: Observable<StationConnections[]>;
  protected filteredTo: Observable<StationConnections[]>;

  private readonly searchService = inject(SearchService);
  private readonly stationsService = inject(StationsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly stations: Signal<StationConnections[]>;

  protected form = new FormGroup({
    from: new FormControl('', Validators.required),
    to: new FormControl('', Validators.required),
    date: new FormControl('', [Validators.required]),
    fakeControl: new FormControl(''),
  });

  constructor() {
    this.stations = toSignal(this.stationsService.$stations, { initialValue: [] });
    this.stationsService.getStations().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  ngOnInit(): void {
    this.filteredFrom = this.filterStations(this.form.controls.from, this.form.controls.to);
    this.filteredTo = this.filterStations(this.form.controls.to, this.form.controls.from);
  }

  protected onSubmit(): void {
    const fromCoordinates = this.getCoordinates(this.form.controls.from.value);
    const toCoordinates = this.getCoordinates(this.form.controls.to.value);

    if (fromCoordinates && toCoordinates) {
      const params = {
        fromLatitude: fromCoordinates.latitude,
        fromLongitude: fromCoordinates.longitude,
        toLatitude: toCoordinates.latitude,
        toLongitude: toCoordinates.longitude,
      };
      this.searchService.search(params).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }
  }

  protected switchStations(): void {
    const fromValue = this.form.controls.from.value;
    const toValue = this.form.controls.to.value;
    this.form.controls.from.setValue(toValue);
    this.form.controls.to.setValue(fromValue);
  }

  private getCoordinates(station: string | null): Pick<Station, 'latitude' | 'longitude'> | null {
    if (!station) {
      return null;
    }
    const currentStation = this.stations().find(s => s.city.toLowerCase() === station.toLowerCase());

    if (!currentStation) {
      return null;
    }

    return { latitude: currentStation.latitude, longitude: currentStation.longitude };
  }

  private filterStations(
    activeControl: FormControl<string | null>,
    neighborControl: FormControl<string | null>,
  ): Observable<StationConnections[]> {
    if (!activeControl || !neighborControl) {
      return this.stationsService.$stations;
    }

    return activeControl.valueChanges.pipe(
      startWith(''),
      switchMap(value => this.filter(value || '', neighborControl)),
    );
  }

  private filter(value: string, control: FormControl<string | null>): Observable<StationConnections[]> {
    const filterValue = value.toLowerCase();
    const excludeValue = control?.value?.toLowerCase() || '';

    return this.stationsService.$stations.pipe(
      map(stations =>
        stations.filter(station => {
          const city = station.city.toLowerCase();
          return city !== excludeValue && city.includes(filterValue);
        }),
      ),
    );
  }
}
