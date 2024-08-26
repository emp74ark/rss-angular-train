import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { GeocodingService } from '../../services/geocoding.service';
import { switchMap, tap } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { SafeUrl } from '@angular/platform-browser';
import { GeoLocation } from '../../models/geo';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit {
  geoService = inject(GeocodingService);

  destroyRef = inject(DestroyRef);

  mapImageUrl: SafeUrl | undefined;

  coordinates = input<GeoLocation | undefined>();

  private coordinates$ = toObservable(this.coordinates);

  ngOnInit() {
    this.coordinates$
      .pipe(
        switchMap(data => {
          return this.geoService.getMap(data).pipe(
            tap(response => {
              const blob = new Blob([response], { type: 'image/png' });
              this.mapImageUrl = window.URL.createObjectURL(blob);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
