export interface CarriageRequest {
  nope: string;
}
export interface CarriageBody {
  name: string;
  rows: number;
  leftSeats: number;
  rightSeats: number;
}
export interface CarriageData extends CarriageBody {
  code: string;
}

export interface CarriagePostResponse {
  code: string;
}

export const enum CarriageResponseStatus {
  OK,
  ERROR,
}
