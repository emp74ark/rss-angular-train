import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormSubmittedEvent, ReactiveFormsModule, Validators } from '@angular/forms';
import { emailDuplicateValidator } from '../../validators/emailDuplicate.validator';
import { passwordMismatch, passwordValidation } from '../../validators/password-validation';
import { NgClass } from '@angular/common';
import { FormErrorMessageComponent } from '../form-error-message/form-error-message.component';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CUSTOM_ERRORS } from '../../constants/customTokens';
import { customFormErrorMessages } from '../../constants/customFormErrorMessages';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, tap } from 'rxjs';
import { AuthResponseStatus } from '../../models/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register-form',
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
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private authService = inject(AuthService);
  private previousFormEmail: { email: string; validate: boolean } = { email: '', validate: false };
  protected untrackedErrorMessage = signal('');
  isRegistering = signal(false);
  hide = signal<boolean>(true);

  form = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^[\w\d_]+@[\w\d_]+.\w{2,7}$/),
        emailDuplicateValidator(this.previousFormEmail),
      ],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, passwordValidation(this, 'confirmPassword')],
    }),
    confirmPassword: new FormControl<string>('', {
      nonNullable: true,
      validators: [passwordMismatch(this)],
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

  onSubmit() {
    const { email, password } = this.form.getRawValue();
    this.isRegistering.set(true);
    this.untrackedErrorMessage.set('');
    this.authService
      .signUp({
        email,
        password,
      })
      .pipe(
        tap(data => {
          this.isRegistering.set(false);
          if (data.status === AuthResponseStatus.OK) {
            this.router.navigate(['/']);
          } else {
            if (data.error?.reason === 'invalidUniqueKey') {
              this.previousFormEmail.email = email;
              this.previousFormEmail.validate = true;
              this.emailControl.updateValueAndValidity();
            } else {
              this.untrackedErrorMessage.set(data.error?.message ?? 'Something went wrong');
            }
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  toggleHide(event: MouseEvent) {
    this.hide.update(hide => !hide);
    event.stopPropagation();
  }

  get emailControl() {
    return this.form.controls.email;
  }

  get passwordControl() {
    return this.form.controls.password;
  }

  get confirmPasswordControl() {
    return this.form.controls.confirmPassword;
  }

  get isSubmitDisabled() {
    return !this.form.controls.confirmPassword.value || this.form.invalid || this.isRegistering();
  }
}
