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

  coordinates = input<GeoLocation>();

  mapUrl: SafeResourceUrl | undefined;

  updateMapUrl() {
    const defaultData = '53.893009, 27.567444';
    const center = this.coordinates()?.lat ? `${this.coordinates()?.lng}, ${this.coordinates()?.lat}` : defaultData;
    const baseUrl = 'https://www.google.com/maps/embed/v1/view';
    const url = `${baseUrl}?key=${environment.geo_api_key}&center=${center}&zoom=10`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit() {
    this.updateMapUrl();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('INPUT VALUES', this.coordinates());
    if (changes['coordinates']) {
      this.updateMapUrl();
    }
  }
}
