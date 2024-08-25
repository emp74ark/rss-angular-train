export type MapsApiCoordinates = {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
};

export type MapsApiSuggestions = {
  predictions: { description: string }[];
};
