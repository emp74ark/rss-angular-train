import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MapsApiCoordinates, MapsApiSuggestions } from '../models/geo';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  constructor(private httpClient: HttpClient) {}

  getCoordinatesByNameOld(searchExp: string) {
    const url = `${environment.geo_api_url}/maps/api/geocode/json`;
    return this.httpClient.get<{ results: MapsApiCoordinates[] }>(url, {
      params: {
        key: environment.geo_api_key,
        address: searchExp,
      },
    });
  }

  getCoordinatesByName(searchExp: string): Observable<{ results: MapsApiCoordinates[] }> {
    const url = `${environment.geo_api_url}/maps/api/geocode/json`;
    const params = new URLSearchParams({
      key: environment.geo_api_key,
      address: searchExp,
    });

    return from(
      fetch(`${url}?${params.toString()}`).then(response => {
        if (!response.ok) {
          throw new Error('Network response error');
        }
        return response.json();
      }),
    );
  }

  getAutoCompleteSuggestionsOld(searchExp: string) {
    const url = `${environment.geo_api_url}/maps/api/place/autocomplete/json`;
    return this.httpClient.get<MapsApiSuggestions>(url, {
      params: {
        key: environment.geo_api_key,
        input: searchExp,
        types: 'geocode',
      },
    });
  }

  getAutoCompleteSuggestions(searchExp: string): Observable<MapsApiSuggestions> {
    const url = `${environment.geo_api_url}/maps/api/place/autocomplete/json`;
    const params = new URLSearchParams({
      key: environment.geo_api_key,
      input: searchExp,
      types: 'geocode',
    });

    return from(
      fetch(`${url}?${params.toString()}`).then(response => {
        console.log(response);
        if (!response.ok) {
          throw new Error('Network response error');
        }
        return response.json();
      }),
    );
  }
}
