import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MapsApiCoordinates, MapsApiSuggestions } from '../models/geo';

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  constructor(private httpClient: HttpClient) {}

  getCoordinatesByName(searchExp: string) {
    const url = `${environment.geo_api_url}/maps/api/geocode/json`;
    return this.httpClient.get<{ results: MapsApiCoordinates[] }>(url, {
      params: {
        key: environment.geo_api_key,
        address: searchExp,
      },
    });
  }

  getAutoCompleteSuggestions(searchExp: string) {
    const url = `${environment.geo_api_url}/maps/api/place/autocomplete/json`;
    return this.httpClient.get<MapsApiSuggestions>(url, {
      params: {
        key: environment.geo_api_key,
        input: searchExp,
        types: 'geocode',
      },
    });
  }
}
