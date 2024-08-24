import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [RegisterFormComponent],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupPageComponent {}
