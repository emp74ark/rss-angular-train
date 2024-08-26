export type GeoLocation = {
  lat: number;
  lng: number;
};
export type MapsApiCoordinates = {
  geometry: {
    location: GeoLocation;
  };
};

export type MapsApiSuggestions = {
  predictions: { description: string }[];
};
