type ConnectionPoint = {
  id: number;
  distance: number;
};

export type Station = {
  id: number;
  city: string;
  latitude: number;
  longitude: number;
};

export type StationConnections = Station & { connectedTo: ConnectionPoint[] };

export type StationRelations = Omit<Station, 'id'> & { relations: number[] };
