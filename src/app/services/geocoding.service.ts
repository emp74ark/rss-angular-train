import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GeoLocation, MapsApiCoordinates, MapsApiSuggestions } from '../models/geo';

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  constructor(private httpClient: HttpClient) {}

  getCoordinatesByName(searchExp: string) {
    return this.httpClient.get<{ results: MapsApiCoordinates[] }>('/maps/api/geocode/json', {
      params: {
        key: environment.geo_api_key,
        address: searchExp,
      },
    });
  }

  getAutoCompleteSuggestions(searchExp: string) {
    return this.httpClient.get<MapsApiSuggestions>('/maps/api/place/autocomplete/json', {
      params: {
        key: environment.geo_api_key,
        input: searchExp,
        types: 'geocode',
      },
    });
  }

  getMap(position?: GeoLocation) {
    const defaultPosition: GeoLocation = { lat: 53.893009, lng: 27.567444 };
    const center = position ? position : defaultPosition;
    return this.httpClient.get('/maps/api/staticmap', {
      params: {
        key: environment.geo_api_key,
        center: `${center.lat}, ${center.lng}`,
        zoom: 12,
        size: '640x640',
      },
      responseType: 'arraybuffer',
    });
  }
}
