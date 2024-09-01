import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarriageComponent } from '../../components/carriage/carriage.component';
import { FormErrorMessageComponent } from '../../components/form-error-message/form-error-message.component';
import { StationConnections } from '../../models/stations';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AdminRoutesService } from '../../services/admin.routes.service';
import { filter, get } from 'lodash';
import { adminRoutesStationsValidator, arrayLengthValidator } from '../../validators/admin-route-validation';
import { ARRAY_CONTROL_CUSTOM_ERRORS } from '../../constants/customTokens';
import { adminRoutesFormErrorMessages } from '../../constants/adminRoutesFormErrorMessages';
import { ArrayControlErrorMessageComponent } from '../../components/array-control-error-message/array-control-error-message';
import {
  AdminRoutesResponseStatus,
  IAdminRoutesStationListValidatorParams,
  ICarriage,
  ICombinedRoutes,
  IStation,
  TStationsRecord,
} from '../../models/admin.routes';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-routes',
  standalone: true,
  providers: [{ provide: ARRAY_CONTROL_CUSTOM_ERRORS, useValue: adminRoutesFormErrorMessages }],
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    CarriageComponent,
    FormErrorMessageComponent,
    ArrayControlErrorMessageComponent,
    MatAutocompleteModule,
    NgClass,
  ],
  templateUrl: './admin-routes.component.html',
  styleUrl: './admin-routes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRoutesComponent {
  private adminRoutesService = inject(AdminRoutesService);
  private authService = inject(AuthService);
  private adminRoutesStationsValidatorParams: IAdminRoutesStationListValidatorParams = {
    that: this,
    stationsRecord: null,
  };
  private destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private router = inject(Router);
  protected untrackedErrorMessage = signal('');

  combinedSignal: Signal<ICombinedRoutes[]>;
  stationsRecord: Signal<TStationsRecord>;
  carriagesSig: Signal<ICarriage[]>;
  routesLengthSig: Signal<number>;
  filteredStations: WritableSignal<IStation[]> = signal([]);
  filteredCarriages: WritableSignal<ICarriage[]> = signal([]);
  isSubmitting = signal(false);
  isDeleting = signal(false);
  isReloading = signal(false);
  pageStateSig: WritableSignal<{
    length: number;
    pageIndex: number;
    pageSize: number;
    previousPageIndex: number;
  }>;

  form: FormGroup<{
    id: FormControl<number>;
    stations: FormArray<FormControl<IStation | null>>;
    carriages: FormArray<FormControl<ICarriage | null>>;
  }> | null = null;

  constructor() {
    this.routesLengthSig = computed(() => this.adminRoutesService.combinedSignal().length);
    this.pageStateSig = signal({ length: this.routesLengthSig(), pageIndex: 0, pageSize: 10, previousPageIndex: 0 });
    this.combinedSignal = computed(() => {
      const ps = this.pageStateSig();

      return this.adminRoutesService
        .combinedSignal()
        .slice(ps.pageIndex * ps.pageSize, ps.pageIndex * ps.pageSize + ps.pageSize);
    });

    this.stationsRecord = computed(() => {
      const stations = this.adminRoutesService.stationsObjSig();

      const stationsRecord: TStationsRecord = Object.values(stations).reduce((acc, data) => {
        const connectedStations = data.connectedTo.map(cs => {
          return {
            id: cs.id,
            cityName: stations[cs.id]?.city ?? 'unknown city',
          };
        });

        acc[data.id] = connectedStations;
        return acc;
      }, {} as TStationsRecord);
      stationsRecord[-Infinity] = Object.values(stations).map((station: StationConnections) => ({
        id: station.id,
        cityName: station.city,
      }));

      return stationsRecord;
    });

    this.adminRoutesStationsValidatorParams.stationsRecord = this.stationsRecord;

    this.carriagesSig = computed(() => {
      return this.adminRoutesService.carriagesSig().map(({ code, name }) => ({ code, carriageName: name }));
    });
  }

  get isSubmitDisabled() {
    return this.form?.invalid || this.isSubmitting();
  }

  get createFormDisabled() {
    return !!this.form;
  }

  get isDeleteDisabled() {
    return this.isSubmitting() || this.isDeleting() || this.isReloading();
  }

  get formIdControlValue() {
    return this.form ? this.form.controls.id.value : null;
  }

  get stationsControls() {
    return this.form ? this.form.controls.stations : null;
  }
  get carriagesControls() {
    return this.form ? this.form.controls.carriages : null;
  }

  get stationsArrayErrors() {
    return this.form ? this.form.controls.stations.errors : null;
  }
  get carriagesArrayErrors() {
    return this.form ? this.form.controls.carriages.errors : null;
  }

  createNewForm() {
    this.createForm({ id: NaN, stations: [null, null, null], carriages: [null, null, null] });
  }

  updateRoute(route: ICombinedRoutes) {
    this.createForm({
      id: route.id,
      stations: [...route.path.map(p => ({ id: p.id, cityName: p.city }))],
      carriages: [...route.carriages.map(c => ({ code: c.code, carriageName: c.name }))],
    });
  }

  assignRide(route: ICombinedRoutes) {
    this.router.navigate([`/admin/routes/${route.id}`]);
  }

  deleteRouteModal(route: ICombinedRoutes) {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '320px',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '250ms',
      data: {
        title: `Delete Route ${route.id}?`,
        cancelText: `No`,
        cancelColor: 'primary',
        confirmText: 'Delete',
        confirmColor: 'warn',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap(result => {
          if (result) {
            this.deleteRoute(route);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  handlePageEvent(e: PageEvent) {
    this.pageStateSig.update(p => ({ ...p, ...e }));
  }

  handleSubmit() {
    if (!this.form) {
      return;
    }
    this.form.markAllAsTouched();
    setTimeout(() => {
      if (!this.form) {
        return;
      }
      if (this.form.valid) {
        this.onRealSubmit();
      }
    }, 200);
  }

  handleCanselForm() {
    this.form = null;
  }

  deleteStation(i: number) {
    if (this.form) {
      this.form.controls.stations.removeAt(i);
      this.markStationsForValidate(i);
    }
  }

  deleteCarriage(i: number) {
    if (!this.form) {
      return;
    }
    this.form.controls.carriages.removeAt(i);
  }

  addCity() {
    if (!this.form) {
      return;
    }
    this.form.controls.stations.push(this.createCity(null));
  }
  addCarriage() {
    if (!this.form) {
      return;
    }
    this.form.controls.carriages.push(this.createCarriage(null));
  }

  getStationOptionText = (option: IStation) => {
    const value = option?.cityName ?? null;
    if (value === null) {
      setTimeout(() => {
        this.markStationsForValidate(1);
      }, 100);
    }

    return option?.cityName ?? null;
  };

  getCarriageOptionText(option: ICarriage) {
    return option?.carriageName ?? null;
  }

  getStations(value: IStation, index: number) {
    this.markStationsForValidate(index + 1);
  }

  filterStations(event: Event, index: number) {
    if (!(event.target instanceof HTMLInputElement) || !this.form) {
      return;
    }
    const s = (event.target.value ?? '').toLocaleLowerCase();
    const previousStationId = index === 0 ? -Infinity : this.form.controls.stations.controls[index - 1]?.value?.id;

    if (!previousStationId) {
      this.filteredStations.set([]);
      return;
    }

    this.filteredStations.set(
      filter(get(this.stationsRecord(), previousStationId), sr => sr.cityName.toLocaleLowerCase().includes(s)),
    );
  }

  filterCarriages(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }
    const s = (event.target.value ?? '').toLocaleLowerCase();

    const filteredCarriages = this.carriagesSig().filter(cr => cr.carriageName.toLocaleLowerCase().includes(s));

    this.filteredCarriages.set(filteredCarriages);
  }

  private deleteRoute(route: ICombinedRoutes) {
    this.isDeleting.set(true);

    this.adminRoutesService
      .deleteRoute(route.id)
      .pipe(
        tap(data => {
          this.isDeleting.set(false);
          if (data.status === AdminRoutesResponseStatus.OK) {
            this.dialog.open(ConfirmModalComponent, {
              width: '320px',
              enterAnimationDuration: '500ms',
              exitAnimationDuration: '250ms',
              data: {
                title: `Route ${route.id} deleted.`,
                showCancel: false,
                showOkIcon: true,
                confirmText: 'Ok',
                confirmColor: 'accent',
              },
            });
          } else {
            let title = '';
            if (data.error?.reason === 'invalidAccessToken') {
              this.authService.logOut();
              title = 'Invalid Access Token';
            } else if (data.error?.reason === 'recordNotFound') {
              this.reloadRoutes();
              title = 'Record not found, Routes Reloaded';
            } else if (data.error?.reason === 'recordInUse') {
              title = `Route ${route.id} is already used.`;
            } else {
              title = data.error?.message ?? 'Something went wrong';
            }

            this.dialog.open(ConfirmModalComponent, {
              width: '320px',
              enterAnimationDuration: '500ms',
              exitAnimationDuration: '250ms',
              data: {
                title,
                showCancel: false,
                confirmText: 'Ok',
                confirmColor: 'accent',
              },
            });
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private reloadRoutes() {
    this.isReloading.set(true);
    this.adminRoutesService
      .getAllRoutes()
      .pipe(
        tap(data => {
          this.isReloading.set(false);
          if (data.status === AdminRoutesResponseStatus.ERROR) {
            if (data.error?.reason === 'invalidAccessToken') {
              this.authService.logOut();
            }
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private onRealSubmit = (): void => {
    if (this.form) {
      this.form.markAllAsTouched();
      this.untrackedErrorMessage.set('');
      if (this.form.valid) {
        const { id, stations, carriages: rawCarriages } = this.form.getRawValue();

        if (stations.some(c => c === null) || rawCarriages.some(c => c === null)) {
          this.form.markAllAsTouched();
          return;
        }

        const path = stations.reduce<number[]>((acc, s) => {
          if (s) {
            acc.push(s.id);
          }
          return acc;
        }, []);
        const carriages = rawCarriages.reduce<string[]>((acc, c) => {
          if (c) {
            acc.push(c.code);
          }
          return acc;
        }, []);

        this.isSubmitting.set(true);

        const method = id
          ? this.adminRoutesService.putRoute({ carriages, path }, id)
          : this.adminRoutesService.postRoute({ carriages, path });

        method
          .pipe(
            tap(data => {
              this.isSubmitting.set(false);
              if (data.status === AdminRoutesResponseStatus.OK) {
                this.form = null;
              } else {
                if (data.error?.reason === 'invalidAccessToken') {
                  this.authService.logOut();
                } else {
                  this.untrackedErrorMessage.set(data.error?.message ?? 'Something went wrong');
                }
              }
            }),
            takeUntilDestroyed(this.destroyRef),
          )
          .subscribe();
      }
    }
  };

  private createForm({
    id,
    stations,
    carriages,
  }: {
    id: number;
    stations: Array<IStation | null>;
    carriages: Array<ICarriage | null>;
  }) {
    const form: FormGroup<{
      id: FormControl<number>;
      stations: FormArray<FormControl<IStation | null>>;
      carriages: FormArray<FormControl<ICarriage | null>>;
    }> | null = new FormGroup({
      id: new FormControl<number>(id, {
        nonNullable: true,
      }),
      stations: new FormArray<FormControl<IStation | null>>([...stations.map(v => this.createCity(v))], {
        validators: [Validators.required, arrayLengthValidator],
      }),
      carriages: new FormArray<FormControl<ICarriage | null>>([...carriages.map(v => this.createCarriage(v))], {
        validators: [Validators.required, arrayLengthValidator],
      }),
    });

    this.form = form;
  }

  private markStationsForValidate = (index: number) => {
    if (this.form) {
      this.form.controls.stations.controls.forEach((control, i) => {
        if (i >= index) {
          control.updateValueAndValidity();
        }
      });
    }
  };

  private createCarriage(value: ICarriage | null) {
    const carriage = new FormControl<ICarriage | null>(value, {
      nonNullable: false,
      validators: [Validators.required],
    });
    return carriage;
  }
  private createCity(value: IStation | null) {
    const city = new FormControl<IStation | null>(value, {
      nonNullable: false,
      validators: [Validators.required, adminRoutesStationsValidator(this.adminRoutesStationsValidatorParams)],
    });
    return city;
  }
}
