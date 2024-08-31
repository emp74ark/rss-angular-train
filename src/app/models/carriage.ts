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

export interface CarriageWithSeatsData extends CarriageData {
  index: number;
  firstSeatNumber: number;
}

export interface CarriagePostResponse {
  code: string;
}

export const enum CarriageResponseStatus {
  OK,
  ERROR,
}

export type Seat = {
  id: number;
  price?: number;
};
