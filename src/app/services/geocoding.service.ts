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
    const url = `${environment.geo_api_url}/coordinates`;
    return this.httpClient.get<{ results: MapsApiCoordinates[] }>(url, {
      params: {
        input: searchExp,
      },
    });
  }

  getAutoCompleteSuggestions(searchExp: string) {
    const url = `${environment.geo_api_url}/autocomplete`;
    return this.httpClient.get<MapsApiSuggestions>(url, {
      params: {
        input: searchExp,
      },
    });
  }
}
