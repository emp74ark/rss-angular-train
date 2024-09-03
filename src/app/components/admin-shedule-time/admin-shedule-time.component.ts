import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { IFilledSegment } from '../../models/admin.routes';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FastErrorStateMatcher } from '../../validators/error.state.matchers';
import { ARRAY_CONTROL_CUSTOM_ERRORS } from '../../constants/customTokens';
import { adminRidesFormErrorMessages } from '../../constants/adminRidesFormErrorMessages';
import { ArrayControlErrorMessageComponent } from '../array-control-error-message/array-control-error-message';
import { DatePipe } from '@angular/common';
import { adminRideTimeValidator } from '../../validators/admin-ride-validation';

@Component({
  selector: 'app-admin-shedule-time',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    ArrayControlErrorMessageComponent,
    DatePipe,
  ],
  providers: [DatePipe, { provide: ARRAY_CONTROL_CUSTOM_ERRORS, useValue: adminRidesFormErrorMessages }],
  templateUrl: './admin-shedule-time.component.html',
  styleUrl: './admin-shedule-time.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSheduleTimeComponent {
  direction = input.required<'from' | 'to'>();
  isDisabled = input.required<boolean>();
  segment = input.required<IFilledSegment>();
  rideId = input.required<number>();
  segmentIndex = input.required<number>();
  previousTime = input.required<string>();
  nextTime = input.required<string>();
  changeTime = output<{
    rideId: number;
    segmentIndex: number;
    time: string[];
  }>();

  form: null | FormGroup<{
    time: FormControl<string>;
  }> = null;

  matcher = inject(FastErrorStateMatcher);
  datePipe = inject(DatePipe);

  get isSubmitDisabled() {
    return this.form && this.form.invalid;
  }

  createTimeForm() {
    const segment = this.segment();
    const direction = this.direction();
    const defaultTime = direction === 'from' ? segment.timeFrom : segment.timeTo;

    const formattedDefaultTime = this.datePipe.transform(defaultTime, 'yyyy-MM-ddTHH:mm') ?? '';

    const form = new FormGroup({
      time: new FormControl<string>(formattedDefaultTime, {
        nonNullable: true,
        validators: [
          Validators.required,
          adminRideTimeValidator({ that: this, previousTime: this.previousTime, nextTime: this.nextTime }),
        ],
      }),
    });
    this.form = form;
  }

  destroyForm() {
    this.form = null;
  }

  onSubmit() {
    if (this.form && this.form.valid) {
      this.form.markAllAsTouched();
      const { time } = this.form.getRawValue();
      const convertedTime = new Date(time);
      if (convertedTime.getTime() !== convertedTime.getTime()) {
        return;
      }
      let { timeTo, timeFrom }: IFilledSegment = this.segment();
      const convertedTimeIso = convertedTime.toISOString();

      if (this.direction() === 'from') {
        timeFrom = convertedTimeIso;
      } else {
        timeTo = convertedTimeIso;
      }

      const newTime: string[] = [timeFrom, timeTo];

      const emitObj = {
        rideId: this.rideId(),
        segmentIndex: this.segmentIndex(),
        time: newTime,
      };

      this.changeTime.emit(emitObj);
      this.destroyForm();
    }
  }
}
