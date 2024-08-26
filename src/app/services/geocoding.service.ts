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
}
