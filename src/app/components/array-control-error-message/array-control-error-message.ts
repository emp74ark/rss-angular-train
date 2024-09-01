import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ARRAY_CONTROL_CUSTOM_ERRORS } from '../../constants/customTokens';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-array-control-error-message',
  standalone: true,
  imports: [],
  templateUrl: './array-control-error-message.html',
  styleUrl: './array-control-error-message.scss',
})
export class ArrayControlErrorMessageComponent implements ControlValueAccessor, OnInit {
  private readonly control = inject(NgControl, { self: true });
  private readonly errors = inject(ARRAY_CONTROL_CUSTOM_ERRORS);
  private destroyRef = inject(DestroyRef);

  protected readonly error = signal<string>('');

  constructor() {
    this.control.valueAccessor = this;
  }

  ngOnInit() {
    this.control.control?.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const name = this.control.name;
      if (name && this.control.errors) {
        const errorType = Object.keys(this.control.errors)?.[0];
        const message = this.errors[errorType] || 'Unknown error occurred';
        this.error.set(message);
      } else {
        this.error.set('');
      }
    });
  }

  writeValue(): void {}

  registerOnChange(): void {}

  registerOnTouched(): void {}

  setDisabledState?(): void {}
}
