import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-routes-ride',
  standalone: true,
  imports: [],
  templateUrl: './admin-routes-ride.component.html',
  styleUrl: './admin-routes-ride.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRoutesRideComponent implements OnInit {
  private route = inject(ActivatedRoute);
  routeId: string;

  ngOnInit(): void {
    this.routeId = this.route.snapshot.params[`routeId`];
  }
}
