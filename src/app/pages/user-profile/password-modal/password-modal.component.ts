import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { passwordValidation } from '../../../components/form-error-message/password-validation';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { FormErrorMessageComponent } from '../../../components/form-error-message/form-error-message.component';
import { MatInput } from '@angular/material/input';
import { CUSTOM_ERRORS } from '../../../constants/customTokens';
import { customFormErrorMessages } from '../../../constants/customFormErrorMessages';

@Component({
  selector: 'app-password-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormField,
    MatLabel,
    MatButton,
    MatInput,
    ReactiveFormsModule,
    FormErrorMessageComponent,
  ],
  templateUrl: './password-modal.component.html',
  styleUrl: './password-modal.component.scss',
  providers: [
    {
      provide: CUSTOM_ERRORS,
      useValue: customFormErrorMessages,
    },
  ],
})
export class PasswordModalComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dialogRef = inject(MatDialogRef<PasswordModalComponent>);

  passwordForm = this.fb.group({
    password: ['', [Validators.required, passwordValidation()]],
  });

  savePassword() {
    if (this.passwordForm.valid) {
      this.dialogRef.close(this.passwordForm.value);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
