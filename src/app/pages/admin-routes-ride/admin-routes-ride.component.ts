import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { FormErrorMessageComponent } from '../../components/form-error-message/form-error-message.component';
import { AdminRidesService } from '../../services/admin.rides.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import {
  AdminExtendedFilledRoute,
  AdminExtendedRoute,
  AdminRoutesResponseStatus,
  IFilledCarriage,
  IFilledSchedule,
  IFilledSegment,
  ISegmentStation,
} from '../../models/admin.routes';
import { AdminRoutesService } from '../../services/admin.routes.service';
import { get, isEmpty } from 'lodash';
import { RouteSchedule } from '../../models/route';
import { PriceList, Segment } from '../../models/common';
import { CurrencyPipe, NgClass } from '@angular/common';
import moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { AuthService } from '../../services/auth.service';
import { FastErrorStateMatcher } from '../../validators/error.state.matchers';
import { ArrayControlErrorMessageComponent } from '../../components/array-control-error-message/array-control-error-message';
import { ARRAY_CONTROL_CUSTOM_ERRORS } from '../../constants/customTokens';
import { adminRidesFormErrorMessages } from '../../constants/adminRidesFormErrorMessages';
import { AdminSheduleTimeComponent } from '../../components/admin-shedule-time/admin-shedule-time.component';

@Component({
  selector: 'app-admin-routes-ride',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    FormErrorMessageComponent,
    ArrayControlErrorMessageComponent,
    AdminSheduleTimeComponent,
    NgClass,
    CurrencyPipe,
  ],
  providers: [{ provide: ARRAY_CONTROL_CUSTOM_ERRORS, useValue: adminRidesFormErrorMessages }],
  templateUrl: './admin-routes-ride.component.html',
  styleUrl: './admin-routes-ride.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRoutesRideComponent {
  private route = inject(ActivatedRoute);
  private adminRoutesService = inject(AdminRoutesService);
  private adminRidesService = inject(AdminRidesService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private authService = inject(AuthService);
  protected firstTime = '0001-01-01T01:01:01.000Z';
  protected lastTime = '3001-01-01T01:01:01.000Z';

  matcher = inject(FastErrorStateMatcher);
  routeId: string;
  routeNotFound: WritableSignal<string> = signal('');
  routesRecordSignal: Signal<Record<string, AdminExtendedRoute>>;
  routeSig: Signal<AdminExtendedRoute | null>;
  routeSchedulesFilled: Signal<AdminExtendedFilledRoute | null>;
  isSubmitting = signal(false);
  isDeleting = signal(false);
  isSaving = signal(false);
  isReloading = signal(false);
  editPriceSig = signal({
    rideId: -1,
    rideIndex: -1,
    segmentIndex: -1,
  });
  priceEditForm: FormGroup<{
    data: FormControl<{
      rideId: number;
      segmentIndex: number;
      filledPrice: IFilledCarriage[];
    }>;
    priceArray: FormArray<FormControl<number>>;
  }> | null = null;

  constructor() {
    this.routeId = this.route.snapshot.params[`routeId`];
    this.loadRoute();

    this.routesRecordSignal = toSignal(this.adminRidesService.$extendedRoutesRecord, { initialValue: {} });
    this.routeSig = computed(() => {
      const routesRecord = this.routesRecordSignal();
      const routeRecord = get(routesRecord, this.routeId, null);
      return routeRecord;
    });

    this.routeSchedulesFilled = computed(() => {
      const route = this.routeSig();
      const carriageRecords = this.adminRoutesService.carriagesObjSig();
      const stationRecords = this.adminRoutesService.stationsObjSig();

      if (isEmpty(carriageRecords) || isEmpty(stationRecords) || !route) {
        return null;
      }
      const { carriages: routeCarriages, id: routeId, path: routePath, schedule: routeSchedule } = route;
      const filledShedule: IFilledSchedule[] = routeSchedule.map(({ rideId, segments }: RouteSchedule) => {
        const newSchedule: IFilledSchedule = {
          rideId,
          filledSegments: segments.map(({ time, price }: Segment, segmentIndex) => {
            const stationFromId = routePath[segmentIndex] ?? 0;
            const stationToId = routePath[segmentIndex + 1] ?? 0;

            const stationFrom: ISegmentStation = {
              id: stationFromId,
              city: stationRecords[stationFromId].city,
            };
            const stationTo: ISegmentStation = {
              id: stationToId,
              city: stationRecords[stationToId].city,
            };

            const filledPrice: IFilledCarriage[] = Object.entries(price).map(([carriageId, price]) => {
              const filledCarriage: IFilledCarriage = {
                carriageCode: carriageId,
                carriageName: carriageRecords[carriageId].name,
                carriagePrice: price,
              };
              return filledCarriage;
            });

            const timeFrom = time[0] ?? '';
            const timeTo = time[1] ?? '';
            const formattedTimeFrom = timeFrom ? moment(timeFrom).format('MMM D YYYY, H:mm') : '';
            const formattedTimeTo = timeTo ? moment(timeTo).format('MMM D YYYY, H:mm') : '';

            const filledSegment: IFilledSegment = {
              time,
              timeFrom,
              timeTo,
              stationFrom,
              stationTo,
              filledPrice,
              formattedTimeFrom,
              formattedTimeTo,
            };

            return filledSegment;
          }),
        };
        return newSchedule;
      });

      const r: AdminExtendedFilledRoute = {
        carriages: routeCarriages,
        id: routeId,
        path: routePath,
        filledShedule,
      };

      return r;
    });
  }

  get createFormDisabled() {
    return false;
  }

  get isDeleteRideDisable() {
    return this.isDeleting() || this.isReloading() || this.isSubmitting() || this.isSaving();
  }

  get isEditPriceDisable() {
    return this.isDeleting() || this.isSubmitting() || this.isReloading() || this.isSaving();
  }

  get isEditPriceSubmitDisable() {
    return (
      this.isDeleting() ||
      this.isReloading() ||
      this.isSaving() ||
      this.isSubmitting() ||
      (this.priceEditForm && this.priceEditForm.invalid)
    );
  }

  backClick() {
    this.router.navigate(['/admin/routes']);
  }

  deleteRideModal(rideId: number) {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '320px',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '250ms',
      data: {
        title: `Delete Ride ${rideId}?`,
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
            this.deleteRide(rideId);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
  createNewForm() {
    console.log('Wait, form creating ...');
  }

  createPriceForm(rideId: number, rideIndex: number, segment: IFilledSegment, segmentIndex: number) {
    const priceEditForm: FormGroup<{
      data: FormControl<{
        rideId: number;
        segmentIndex: number;
        filledPrice: IFilledCarriage[];
      }>;
      priceArray: FormArray<FormControl<number>>;
    }> = new FormGroup({
      data: new FormControl<{ rideId: number; segmentIndex: number; filledPrice: IFilledCarriage[] }>(
        { rideId, segmentIndex, filledPrice: segment.filledPrice },
        {
          nonNullable: true,
        },
      ),
      priceArray: new FormArray<FormControl<number>>([
        ...segment.filledPrice.map(({ carriagePrice }) => this.createPriceField(carriagePrice)),
      ]),
    });

    this.priceEditForm = priceEditForm;
    this.editPriceSig.set({
      rideId,
      rideIndex,
      segmentIndex,
    });
  }

  destroyPriceForm() {
    this.priceEditForm = null;
    this.editPriceSig.set({
      rideId: -1,
      rideIndex: -1,
      segmentIndex: -1,
    });
  }

  handlePriceEditFormSubmit() {
    if (this.priceEditForm) {
      this.priceEditForm.markAllAsTouched();
      if (this.priceEditForm.valid) {
        const { data, priceArray } = this.priceEditForm.getRawValue();
        const route = this.routeSig();
        const ride = route?.schedule.find(x => x.rideId === data.rideId);
        if (ride) {
          const newSegments = ride.segments.map((x, i) => {
            const segment: Segment = x;
            if (i === data.segmentIndex) {
              segment.price = {
                ...data.filledPrice.reduce<PriceList>((acc, element, index) => {
                  acc[element.carriageCode] = priceArray[index];
                  return acc;
                }, {}),
              };
            }
            return segment;
          });

          const body = {
            segments: newSegments,
          };
          this.isSubmitting.set(true);

          this.adminRidesService
            .updateRide({ routeId: this.routeId, rideId: ride.rideId }, body)
            .pipe(
              tap(data => {
                this.isSubmitting.set(false);
                if (data.status === AdminRoutesResponseStatus.OK) {
                  this.destroyPriceForm();
                } else {
                  this.handleHttpError(
                    data.error?.reason ?? '',
                    data.error?.message ?? 'Something went wrong',
                    ride.rideId,
                  );
                }
              }),
              takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
        }
      }
    }
  }

  changeTime(v: { rideId: number; segmentIndex: number; time: string[] }) {
    const route = this.routeSig();
    const ride = route?.schedule.find(x => x.rideId === v.rideId);
    if (ride) {
      const newSegments: Segment[] = ride.segments.map((x, i) => {
        const segment: Segment = x;
        if (i === v.segmentIndex) {
          segment.time = v.time;
        }
        return { ...segment };
      });

      const body = {
        segments: newSegments,
      };
      this.isSubmitting.set(true);

      this.adminRidesService
        .updateRide({ routeId: this.routeId, rideId: ride.rideId }, body)
        .pipe(
          tap(data => {
            this.isSubmitting.set(false);
            if (data.status === AdminRoutesResponseStatus.OK) {
              this.destroyPriceForm();
            } else {
              this.handleHttpError(
                data.error?.reason ?? '',
                data.error?.message ?? 'Something went wrong',
                ride.rideId,
              );
            }
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    }
  }

  private createPriceField(v: number) {
    const price = new FormControl<number>(v, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]*$/)],
    });
    return price;
  }

  private deleteRide(rideId: number) {
    if (this.isDeleteRideDisable) {
      return;
    }

    this.isDeleting.set(true);

    this.adminRidesService
      .deleteRide({ routeId: this.routeId, rideId })
      .pipe(
        tap(data => {
          this.isDeleting.set(false);
          if (data.status === AdminRoutesResponseStatus.OK) {
            this.dialog.open(ConfirmModalComponent, {
              width: '320px',
              enterAnimationDuration: '500ms',
              exitAnimationDuration: '250ms',
              data: {
                title: `Ride ${rideId} deleted.`,
                showCancel: false,
                showOkIcon: true,
                confirmText: 'Ok',
                confirmColor: 'accent',
              },
            });
          } else {
            this.handleHttpError(data.error?.reason ?? '', data.error?.message ?? 'Something went wrong', rideId);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private handleHttpError(reason: string, message: string, rideId: number) {
    let title = '';
    if (reason === 'invalidAccessToken') {
      this.authService.logOut();
      title = 'Invalid Access Token';
    } else if (reason === 'recordNotFound') {
      this.loadRoute();
      title = 'Ride not found, Route Reloaded';
    } else if (reason === 'recordInUse') {
      title = `Ride  ${rideId} is already used.`;
    } else if (reason === 'invalidData') {
      title = message;
    } else {
      title = message;
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

  private loadRoute() {
    this.isReloading.set(true);
    this.routeNotFound.set('');
    this.adminRidesService
      .getRideByRouteId(this.routeId)
      .pipe(
        tap(data => {
          this.isReloading.set(false);
          if (data.status === AdminRoutesResponseStatus.ERROR) {
            if (data.error?.reason === 'rideNotFound') {
              this.routeNotFound.set(`Route with id ${this.routeId} not found`);
            }
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
