import { Component, input, OnInit } from '@angular/core';

type SeatState = { id: number; state: 'free' | 'booked' | 'disabled' };

@Component({
  selector: 'app-carriage',
  standalone: true,
  imports: [],
  templateUrl: './carriage.component.html',
  styleUrl: './carriage.component.scss',
})
export class CarriageComponent implements OnInit {
  initialValue = input<number>();
  rows = input<number>(5);
  leftSeats = input<number>(2);
  rightSeats = input<number>(2);

  seats: Record<'left' | 'right', SeatState[][]> = {
    left: [],
    right: [],
  };

  ngOnInit() {
    let seatCounter = 1;

    for (let r = 0; r < this.rows(); r++) {
      const rightSeatLine = new Array(this.rightSeats());

      for (let l = 0; l < this.rightSeats(); l++) {
        rightSeatLine[l] = { id: seatCounter, state: 'free' };
        seatCounter++;
      }
      this.seats.right.push(rightSeatLine);

      const leftSeatLine = new Array(this.leftSeats());

      for (let l = 0; l < this.leftSeats(); l++) {
        leftSeatLine[l] = { id: seatCounter, state: 'free' };
        seatCounter++;
      }
      this.seats.left.push(leftSeatLine);
    }
  }

  onClick($event: Event) {
    // todo: add related logic here
    console.log(($event.target as HTMLInputElement).id);
  }
}
