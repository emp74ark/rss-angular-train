import { Component, input, OnInit, output } from '@angular/core';

type SeatState = { id: number; state: 'free' | 'booked' | 'disabled' };

@Component({
  selector: 'app-carriage',
  standalone: true,
  imports: [],
  templateUrl: './carriage.component.html',
  styleUrl: './carriage.component.scss',
})
export class CarriageComponent implements OnInit {
  initialValue = input<number>(1);
  rows = input<number>(5);
  leftSeats = input<number>(2);
  rightSeats = input<number>(2);
  editable = input<boolean>(true);

  selectSeat = output<string>();

  seats: Record<'left' | 'right', SeatState[][]> = {
    left: [],
    right: [],
  };

  ngOnInit() {
    let seatCounter = this.initialValue();

    for (let r = 0; r < this.rows(); r++) {
      const rightSeatLine = new Array(this.rightSeats());

      for (let l = 0; l < this.rightSeats(); l++) {
        rightSeatLine[l] = {
          id: seatCounter,
          state: this.editable() ? 'free' : 'disabled',
        };
        seatCounter++;
      }
      this.seats.right.push(rightSeatLine);

      const leftSeatLine = new Array(this.leftSeats());

      for (let l = 0; l < this.leftSeats(); l++) {
        leftSeatLine[l] = {
          id: seatCounter,
          state: this.editable() ? 'booked' : 'disabled',
        };
        seatCounter++;
      }
      this.seats.left.push(leftSeatLine);
    }
  }

  onClick($event: Event) {
    const target = $event.target as HTMLInputElement;
    console.log('emit', target.id);
    this.selectSeat.emit(target.id);
    // if (target.checked) {
    // }
  }

  isDisabled(state: string) {
    return state === 'disabled';
  }
}
