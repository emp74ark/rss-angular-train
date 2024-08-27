import { Component, computed, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-carriage',
  standalone: true,
  imports: [],
  templateUrl: './carriage.component.html',
  styleUrl: './carriage.component.scss',
})
export class CarriageComponent implements OnInit {
  // input values:
  carriageName = input<string>('Default name');
  rows = input<number>(16);
  leftSeats = input<number>(48);
  rightSeats = input<number>(32);

  // computed values:
  leftSeatsLines = computed<number>(() => {
    return this.leftSeats() / this.rows();
  });
  rightSeatsLines = computed<number>(() => {
    return this.rightSeats() / this.rows();
  });

  seats: Record<'left' | 'right', { id: number; booked: boolean }[][]> = {
    left: [],
    right: [],
  };

  ngOnInit() {
    let currentRightSeatNumber = 1;
    let currentLeftSeatNumber = this.leftSeats() + 1;

    for (let l = 0; l < this.rows(); l++) {
      const leftSeatLine = new Array(this.leftSeatsLines());
      for (let s = 0; s < this.leftSeatsLines(); s++) {
        leftSeatLine[s] = { id: currentLeftSeatNumber, booked: false };
        currentLeftSeatNumber++;
      }
      this.seats.left.push(leftSeatLine);

      const rightSeatLine = new Array(this.rightSeatsLines());
      for (let s = 0; s < this.rightSeatsLines(); s++) {
        rightSeatLine[s] = { id: currentRightSeatNumber, booked: false };
        currentRightSeatNumber++;
      }
      this.seats.right.push(rightSeatLine);
    }

    console.log(this.seats);
  }

  onClick($event: Event) {
    // todo: add related logic here
    console.log(($event.target as HTMLInputElement).id);
  }
}
