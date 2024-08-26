import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin-routes',
  standalone: true,
  imports: [],
  templateUrl: './admin-routes.component.html',
  styleUrl: './admin-routes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRoutesComponent {}
