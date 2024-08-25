import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { StationsService } from '../../services/stations.service';
import { GeocodingService } from '../../services/geocoding.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';

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

  $input = new BehaviorSubject<string>('');
  $citySuggestions = new BehaviorSubject<string[]>([]);

  ngOnInit() {
    this.form = this.fb.group({
      cityName: [''],
      relations: [''],
    });

    this.$input
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(value => console.log('!', value)),
        switchMap(value => {
          return this.geoService.getAutoCompleteSuggestions(value);
        }),
        tap(value => {
          console.log('SUGGESTION', value);
          this.$citySuggestions.next(value.predictions.map(el => el.description));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onInputChange($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.$input.next(value);
  }

  onAddStation() {
    if (this.form.valid) {
      const cityName = this.form.controls['cityName']?.value as string;
      this.geoService
        .getCoordinatesByName(cityName)
        .pipe(
          tap(res => console.log(res)),
          switchMap(({ results }) => {
            return this.stationService.createStation({
              city: cityName,
              latitude: results[0].geometry.location.lat,
              longitude: results[0].geometry.location.lng,
              relations: [],
            });
          }),
          tap(res => console.log(res)),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    }
  }
}
