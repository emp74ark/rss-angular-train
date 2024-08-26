import { Component, inject, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { GeoLocation } from '../../models/geo';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit, OnChanges {
  sanitizer = inject(DomSanitizer);

  origin = input<GeoLocation>();

  mapUrl: SafeResourceUrl | undefined;

  updateMapUrl() {
    const defaultData = '53.893009, 27.567444';
    const center = this.origin()?.lat ? `${this.origin()?.lat}, ${this.origin()?.lng}` : defaultData;
    const baseUrl = `https://www.google.com/maps/embed/v1/directions?key=${environment.geo_api_key}`;
    const url = `${baseUrl}&origin=${center}&destination=${center}&center=${center}&zoom=10`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit() {
    this.updateMapUrl();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['origin']) {
      this.updateMapUrl();
    }
  }
}
