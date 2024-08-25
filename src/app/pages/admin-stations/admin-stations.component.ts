import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin-stations',
  standalone: true,
  imports: [],
  templateUrl: './admin-stations.component.html',
  styleUrl: './admin-stations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminStationsComponent {}
