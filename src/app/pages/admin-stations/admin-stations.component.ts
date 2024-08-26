import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { StationsService } from '../../services/stations.service';
import { GeocodingService } from '../../services/geocoding.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { StationConnections } from '../../models/stations';
import { MapComponent } from '../../components/map/map.component';
import { GeoLocation } from '../../models/geo';
import { StationsListComponent } from '../../components/stations-list/stations-list.component';

@Component({
  selector: 'app-admin-stations',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    ReactiveFormsModule,
    MatLabel,
    MatInput,
    MatAutocomplete,
    AsyncPipe,
    MatOption,
    MatAutocompleteTrigger,
    MapComponent,
    StationsListComponent,
  ],
  templateUrl: './admin-stations.component.html',
  styleUrl: './admin-stations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminStationsComponent implements OnInit {
  fb = inject(FormBuilder);
  stationService = inject(StationsService);
  geoService = inject(GeocodingService);
  destroyRef = inject(DestroyRef);

  form: FormGroup;

  $cityName = new BehaviorSubject<string>('');
  $citySuggestions = new BehaviorSubject<string[]>([]);

  relations: StationConnections[] = [];
  $relationName = new BehaviorSubject<string>('');
  $relationSuggestions = new BehaviorSubject<StationConnections[]>([]);

  origin: GeoLocation;

  ngOnInit() {
    this.form = this.fb.group({
      cityName: ['', [Validators.required]],
      relations: this.fb.array([new FormControl(null, [Validators.required])]),
    });

    this.stationService
      .getStations()
      .pipe(
        tap(result => (this.relations = result)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.$cityName
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(value => !!value.trim()),
        switchMap(value => {
          return this.geoService.getAutoCompleteSuggestions(value);
        }),
        tap(value => {
          this.$citySuggestions.next(value.predictions.map(el => el.description));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.$relationName
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(value => {
          return this.stationService.getStations().pipe(
            tap((stations: StationConnections[]) => {
              const cities = stations.filter(el => {
                const trimmedValue = value.trim().toLowerCase();
                const trimmedCity = el.city.trim().toLowerCase();
                if (trimmedValue && trimmedCity.startsWith(trimmedValue)) {
                  return el;
                }
                return null;
              });
              this.$relationSuggestions.next(cities);
            }),
          );
        }),
      )
      .subscribe();
  }

  get relationsGroup() {
    return this.form.get('relations') as FormArray;
  }

  addRelation(): void {
    const relationControl = this.fb.control(null);
    this.relationsGroup.push(relationControl);
  }

  removeRelation(i: number): void {
    this.relationsGroup.removeAt(i);
  }

  onCityNameChange($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.$cityName.next(value);
  }

  onRelationChange($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.$relationName.next(value);
  }

  onOriginSelection(value: string) {
    this.geoService
      .getCoordinatesByName(value)
      .pipe(
        tap(({ results }) => {
          if (results.length) {
            this.origin = {
              lat: results[0].geometry.location.lat,
              lng: results[0].geometry.location.lng,
            };
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onRelatedSelection(value: string) {
    this.stationService.$stations
      .pipe(
        tap(list => {
          const city = list.find(el => el.city === value);
          if (city) {
            this.origin = {
              lat: city.latitude,
              lng: city.longitude,
            };
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onAddStation() {
    if (this.form.valid) {
      const { cityName, relations } = this.form.value;

      const relationIds = this.relations.filter(({ city }) => relations.includes(city)).map(relation => relation.id);

      this.geoService
        .getCoordinatesByName(cityName)
        .pipe(
          switchMap(({ results }) => {
            return this.stationService.createStation({
              city: cityName,
              latitude: results[0].geometry.location.lat,
              longitude: results[0].geometry.location.lng,
              relations: relationIds,
            });
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();

      this.form.reset();
    }
  }
}
