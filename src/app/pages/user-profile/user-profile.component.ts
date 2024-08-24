import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PasswordModalComponent } from './password-modal/password-modal.component';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { FormErrorMessageComponent } from '../../components/form-error-message/form-error-message.component';
import { MatInput } from '@angular/material/input';
import { CUSTOM_ERRORS } from '../../constants/customTokens';
import { customFormErrorMessages } from '../../constants/customFormErrorMessages';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatCardContent,
    MatFormField,
    MatInput,
    MatLabel,
    MatDialogModule,
    MatIcon,
    MatButton,
    MatSuffix,
    MatDivider,
    MatIconButton,
    MatCardTitle,
    MatError,
    FormErrorMessageComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  providers: [
    {
      provide: CUSTOM_ERRORS,
      useValue: customFormErrorMessages
    },
  ],
})
export class UserProfileComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  protected role = '';

  profileForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  isEditName = false;
  isEditEmail = false;

  ngOnInit(): void {
    this.profileService.loadProfile().subscribe((profile) => {
      if (profile) {
        this.profileForm.patchValue({
          name: profile.name,
          email: profile.email,
        });
        this.role = profile.role;
      }
    });
  }

  saveProfile() {
    if (this.profileForm.valid) {
      this.profileService.updateProfile(this.profileForm.value).subscribe();
      this.isEditName = false;
      this.isEditEmail = false;
    }
  }

  toggleEditName() {
    this.isEditName = !this.isEditName;
  }

  toggleEditEmail() {
    this.isEditEmail = !this.isEditEmail;
  }

  changePassword() {
    const dialogRef = this.dialog.open(PasswordModalComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.profileService.updatePassword(result).subscribe();
      }
    });
  }

  logout() {
    this.authService.logOut();
    this.router.navigate(['/']);
  }
}
