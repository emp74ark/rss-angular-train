import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, Signal, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { map, Observable, tap } from 'rxjs';
import { CarriageService } from '../../services/carriage';
import { CarriageData, CarriageResponseStatus } from '../../models/carriage';
import { CarriageComponent } from '../../components/carriage/carriage.component';
import { IPageWidth, PageWidthService } from '../../services/page.width.service';
import { MatCardModule } from '@angular/material/card';
import { IMaxSumColumnsParams, maxSumColumns } from '../../validators/seats-validator';
import { CUSTOM_ERRORS } from '../../constants/customTokens';
import { carriageFormErrorMessages } from '../../constants/carriageFormErrorMessages';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormErrorMessageComponent } from '../../components/form-error-message/form-error-message.component';
import {
  CARRIAGEMAXROWS,
  CARRIAGEMAXTOTALCOLUMNS,
  CARRIAGEMINROWS,
  CARRIAGEMINTOTALCOLUMNS,
} from '../../constants/carriage';
import {
  IUniqueCarriageNameValidatorParams,
  uniqueCarriageNameValidator,
} from '../../validators/uniqueCarriageNameValidator';
import { FastErrorStateMatcher } from '../../validators/error.state.matchers';
import { carriageCodeDuplicateValidator } from '../../validators/carriageCodeDuplicate.validator';

@Component({
  selector: 'app-admin-carriages',
  standalone: true,
  providers: [{ provide: CUSTOM_ERRORS, useValue: carriageFormErrorMessages }],
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    CarriageComponent,
    FormErrorMessageComponent,
    NgClass,
  ],
  templateUrl: './admin-carriages.component.html',
  styleUrl: './admin-carriages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCarriagesComponent {
  $pageWidth: Observable<IPageWidth>;
  carriagesSig: Signal<CarriageData[]>;
  isSubmitting = signal(false);
  isDeleting = signal(false);
  matcher = inject(FastErrorStateMatcher);
  protected untrackedErrorMessage = signal('');
  protected form: FormGroup<{
    code: FormControl<string>;
    name: FormControl<string>;
    rows: FormControl<number>;
    leftSeats: FormControl<number>;
    rightSeats: FormControl<number>;
  }> | null = null;
  protected carriageViewState = signal<Omit<CarriageData, 'code' | 'name'>>({
    leftSeats: 0,
    rightSeats: 0,
    rows: 0,
  });
  private carriageService = inject(CarriageService);
  private pageService = inject(PageWidthService);
  private destroyRef = inject(DestroyRef);

  private maxSumColumnsParams: IMaxSumColumnsParams = {
    maxSize: CARRIAGEMAXTOTALCOLUMNS,
    minSize: CARRIAGEMINTOTALCOLUMNS,
    formName: 'form',
    this: this,
  };

  private uniqueCarriageNameValidatorParams: IUniqueCarriageNameValidatorParams = {
    formName: 'form',
    this: this,
    emulateCodeValidation: false,
  };

  private previousFormCode: { code: string; validate: boolean } = { code: '', validate: false };

  constructor() {
    this.carriagesSig = toSignal(this.carriageService.$carriages, { initialValue: [] });
    this.$pageWidth = this.pageService.pageWidth$;
  }

  get createFormDisabled() {
    return !!this.form;
  }

  get isSubmitDisabled() {
    return this.form?.invalid || this.isSubmitting();
  }

  get isDeleteDisabled() {
    return this.isSubmitting() || this.isDeleting();
  }

  get formCodeControlValue() {
    return this.form ? this.form.controls.code.value : null;
  }

  createNewForm() {
    this.createForm({ code: '', name: '', leftSeats: 1, rightSeats: 1, rows: 12 });
  }

  editCarriage(carriage: CarriageData) {
    this.createForm(carriage);
  }

  onLeftChange() {
    if (this.form) {
      this.form.controls.leftSeats.markAsTouched();
      this.form.controls.rightSeats.markAsTouched();
      this.form.controls.rightSeats.updateValueAndValidity();
    }
  }

  onRightChange() {
    if (this.form) {
      this.form.controls.leftSeats.markAsTouched();
      this.form.controls.rightSeats.markAsTouched();
      this.form.controls.leftSeats.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.form) {
      this.form.markAllAsTouched();
      this.untrackedErrorMessage.set('');
      if (this.form.valid) {
        const { code, leftSeats, name, rightSeats, rows } = this.form.getRawValue();
        this.isSubmitting.set(true);

        const method = code
          ? this.carriageService.put({ leftSeats, name, rightSeats, rows }, code)
          : this.carriageService.post({ leftSeats, name, rightSeats, rows });

        method
          .pipe(
            tap(data => {
              this.isSubmitting.set(false);
              if (data.status === CarriageResponseStatus.OK) {
                this.form = null;
              } else {
                if (data.error?.reason === 'invalidUniqueKey') {
                  this.previousFormCode.code = name;
                  this.previousFormCode.validate = true;
                  this.form?.controls.name.updateValueAndValidity();
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
  }

  deleteCarriage(code: string) {
    if (!this.form || this.form.controls.code.value !== code) {
      this.isDeleting.set(true);
      this.carriageService
        .delete(code)
        .pipe(
          tap(() => {
            this.isDeleting.set(false);
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    }
  }

  onCanselForm() {
    this.form = null;
  }

  private createForm({ code, leftSeats, name, rightSeats, rows }: CarriageData) {
    this.carriageViewState.set({ leftSeats, rightSeats, rows });
    this.form = new FormGroup({
      code: new FormControl<string>(code, {
        nonNullable: true,
      }),
      name: new FormControl<string>(name, {
        nonNullable: true,
        validators: [
          Validators.required,
          uniqueCarriageNameValidator(this.uniqueCarriageNameValidatorParams, this.carriagesSig),
          carriageCodeDuplicateValidator(this.previousFormCode),
        ],
      }),
      rows: new FormControl<number>(rows, {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.min(CARRIAGEMINROWS),
          Validators.max(CARRIAGEMAXROWS),
          Validators.pattern(/^[0-9]*$/),
        ],
      }),
      leftSeats: new FormControl<number>(leftSeats, {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.min(0),
          Validators.pattern(/^[0-9]*$/),
          maxSumColumns(this.maxSumColumnsParams, 'rightSeats'),
        ],
      }),
      rightSeats: new FormControl<number>(rightSeats, {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.min(0),
          Validators.pattern(/^[0-9]*$/),
          maxSumColumns(this.maxSumColumnsParams, 'leftSeats'),
        ],
      }),
    });

    this.form.valueChanges
      .pipe(
        tap(x =>
          this.carriageViewState.update(y => {
            const rows = Math.min(CARRIAGEMAXROWS, x.rows ?? y.rows);
            const leftSeats = Math.min(CARRIAGEMAXTOTALCOLUMNS, x.leftSeats ?? y.leftSeats);
            const rightSeats = Math.min(CARRIAGEMAXTOTALCOLUMNS, x.rightSeats ?? y.rightSeats);

            return { rows, leftSeats, rightSeats };
          }),
        ),
        map(() => true),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
