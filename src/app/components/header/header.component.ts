import { Component, inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserRoles } from '../../models/auth';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbar, MatButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  protected readonly isLoggedIn: Signal<boolean> = toSignal(this.authService.$authStatus.pipe(map(x => !!x.token)), {
    initialValue: false,
  });
  protected readonly isManager: Signal<boolean> = toSignal(
    this.authService.$authStatus.pipe(map(x => x.role === UserRoles.Manager)),
    {
      initialValue: false,
    },
  );
}
