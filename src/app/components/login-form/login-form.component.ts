import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormSubmittedEvent, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgClass } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormErrorMessageComponent } from '../form-error-message/form-error-message.component';
import { CUSTOM_ERRORS } from '../../constants/customTokens';
import { customFormErrorMessages } from '../../constants/customFormErrorMessages';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { AuthResponseStatus } from '../../models/auth';
import {
  fieldsEquivalentPreviousValidator,
  IFieldsEquivalentPreviousValidatorParams,
} from '../../validators/fieldsEquivalentPrevious.validator';
import { passwordSpaces } from '../../validators/password-validation';

@Component({
  selector: 'app-login-form',
  standalone: true,
  providers: [{ provide: CUSTOM_ERRORS, useValue: customFormErrorMessages }],
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormErrorMessageComponent,
    NgClass,
    RouterLink,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  protected authService = inject(AuthService);

  isRegistering = signal(false);
  hide = signal<boolean>(true);
  protected untrackedErrorMessage = signal('');

  private previousFormFields: IFieldsEquivalentPreviousValidatorParams = {
    fields: {
      email: '',
      password: '',
    },
    validate: false,
    this: this,
  };

  form = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^[\w\d_]+@[\w\d_]+.\w{2,7}$/),
        fieldsEquivalentPreviousValidator(this.previousFormFields),
      ],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, passwordSpaces, fieldsEquivalentPreviousValidator(this.previousFormFields)],
    }),
  });

  protected isSubmitted = toSignal(
    this.form.events.pipe(
      filter(event => event instanceof FormSubmittedEvent),
      map(() => true),
      takeUntilDestroyed(this.destroyRef),
    ),
    { initialValue: false },
  );

  toggleHide(event: MouseEvent) {
    this.hide.update(hide => !hide);
    event.stopPropagation();
  }

  onEmailChange() {
    this.passwordControl.updateValueAndValidity();
  }

  onPasswordChange() {
    this.emailControl.updateValueAndValidity();
  }

  get emailControl() {
    return this.form.controls.email;
  }

  get passwordControl() {
    return this.form.controls.password;
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.untrackedErrorMessage.set('');
      const { email, password } = this.form.getRawValue();
      this.isRegistering.set(true);
      this.authService
        .signIn({
          email,
          password,
        })
        .pipe(
          tap(data => {
            this.isRegistering.set(false);
            if (data.status === AuthResponseStatus.OK) {
              this.router.navigate(['/']);
            } else if (data.error?.reason === 'userNotFound') {
              this.previousFormFields.fields['email'] = email;
              this.previousFormFields.fields['password'] = password;
              this.previousFormFields.validate = true;
              this.emailControl.updateValueAndValidity();
              this.passwordControl.updateValueAndValidity();
            } else {
              this.untrackedErrorMessage.set(data.error?.message ?? 'Something went wrong');
            }
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    }
  }

  get isSubmitDisabled() {
    return this.form.invalid || this.isRegistering();
  }
}
