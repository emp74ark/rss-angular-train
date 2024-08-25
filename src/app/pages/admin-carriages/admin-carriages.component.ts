import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin-carriages',
  standalone: true,
  imports: [],
  templateUrl: './admin-carriages.component.html',
  styleUrl: './admin-carriages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCarriagesComponent {}
