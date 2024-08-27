export interface Route {
  id: number;
  path: number[];
  carriages: string[];
  schedule?: Schedule;
}

export interface Schedule {
  rideId?: number;
  segments: {
    time: [string, string];
    price: { [key: string]: number };
  }[];
}
