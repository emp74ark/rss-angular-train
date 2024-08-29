import { AsyncPipe } from '@angular/common';
import {
  Component,
  inject,
  DestroyRef,
  OnInit,
  Signal,
  model,
  effect,
  ViewChild,
  computed,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
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
import { MatMenuModule } from '@angular/material/menu';
import moment from 'moment';
import { dateTimeValidator } from '../../validators/date-time-validation';
import { FastErrorStateMatcher } from '../../validators/error.state.matchers';
import { CUSTOM_ERRORS } from '../../constants/customTokens';
import { FormErrorMessageComponent } from '../form-error-message/form-error-message.component';
import { customSearchFormErrorMessages } from '../../constants/custom-search-form-error-messages';
import {
  IStationListValidatorParams,
  stationsNotInListTheSame,
  stationsTheSame,
} from '../../validators/stations-validation';

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
    MatMenuModule,
    ReactiveFormsModule,
    FormErrorMessageComponent,
    AsyncPipe,
  ],
  providers: [provideNativeDateAdapter(), { provide: CUSTOM_ERRORS, useValue: customSearchFormErrorMessages }],
  templateUrl: './search-panel.component.html',
  styleUrl: './search-panel.component.scss',
})
export class SearchPanelComponent implements OnInit {
  @ViewChild('calendar', { static: false }) calendar: MatCalendar<Date>;

  protected filteredFrom: Observable<StationConnections[]>;
  protected filteredTo: Observable<StationConnections[]>;
  protected fastMatcher = inject(FastErrorStateMatcher);
  protected readonly minDate = new Date();
  protected selected = model<Date | null>(null);

  private readonly searchService = inject(SearchService);
  private readonly stationsService = inject(StationsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly stations: Signal<StationConnections[]>;
  private stationListValidatorParams: IStationListValidatorParams = {
    this: this,
    cityList: signal([]),
  };

  protected form = new FormGroup({
    from: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, stationsNotInListTheSame(this.stationListValidatorParams)],
    }),
    to: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        stationsTheSame({ this: this }),
        stationsNotInListTheSame(this.stationListValidatorParams),
      ],
    }),
    date: new FormControl({ value: '', disabled: false }, [Validators.required, dateTimeValidator]),
    time: new FormControl({ value: '', disabled: false }),
  });

  constructor() {
    this.stations = toSignal(this.stationsService.$stations, { initialValue: [] });
    this.stationsService.getStations().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    this.stationListValidatorParams.cityList = computed(() => this.stations().map(x => x.city));

    effect(() => {
      const isDateSelected = !!this.selected();
      if (isDateSelected) {
        this.form.controls.time.enable();
      } else {
        this.form.controls.time.disable();
      }
    });
  }

  get isSubmitDisabled() {
    return this.form.invalid;
  }

  ngOnInit(): void {
    this.filteredFrom = this.filterStations(this.form.controls.from, this.form.controls.to);
    this.filteredTo = this.filterStations(this.form.controls.to, this.form.controls.from);
  }

  protected onSubmit(): void {
    const fromCoordinates = this.getCoordinates(this.form.controls.from.value);
    const toCoordinates = this.getCoordinates(this.form.controls.to.value);
    const date = this.form.controls.date.value;

    if (date && fromCoordinates && toCoordinates) {
      const requestDate = moment(date).toISOString();

      const params = {
        fromLatitude: fromCoordinates.latitude,
        fromLongitude: fromCoordinates.longitude,
        toLatitude: toCoordinates.latitude,
        toLongitude: toCoordinates.longitude,
        time: requestDate,
      };
      this.searchService.search(params).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }
  }

  protected setDateTime(): void {
    const date = this.selected();
    if (date) {
      date.setHours(0);
      date.setMinutes(0);
      const [hours, minutes] = this.form.controls.time.value?.split(':') ?? [];
      const newDate = moment(date)
        .add(Number(hours) ?? 0, 'h')
        .add(Number(minutes) ?? 0, 'minute')
        .format('MMM D YYYY, H:mm');
      this.form.controls.date.setValue(newDate);
    }
  }

  protected switchStations(): void {
    const fromValue = this.form.controls.from.value;
    const toValue = this.form.controls.to.value;
    this.form.controls.from.setValue(toValue);
    this.form.controls.to.setValue(fromValue);
  }

  protected formatOnBlur(): void {
    const value = new Date(this.form.controls.date.value ?? '');
    if (value.getTime() === value.getTime()) {
      const newDate = moment(value).format('MMM D YYYY, H:mm');
      this.form.controls.date.setValue(newDate);
      this.selected.set(value);
      this.calendar.activeDate = this.selected() ?? new Date();
      this.form.controls.time.setValue(`${moment(value).format('HH:mm')}`);
    } else if (this.form.controls.date.value === '') {
      this.selected.set(null);
      this.calendar.activeDate = new Date();
      this.form.controls.time.reset();
    }
  }

  protected onFromChange() {
    this.form.controls.to.updateValueAndValidity();
  }

  private getCoordinates(station: string | null): Pick<Station, 'latitude' | 'longitude'> | null {
    if (!station) {
      return null;
    }
    const currentStation = this.stations().find(s => s.city.toLowerCase() === station.toLowerCase().trim());

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
