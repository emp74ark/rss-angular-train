import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, OnChanges, Signal } from '@angular/core';

type SeatState = { id: number; state: 'free' | 'booked' | 'disabled' };

@Component({
  selector: 'app-carriage',
  standalone: true,
  imports: [NgClass],
  templateUrl: './carriage.component.html',
  styleUrl: './carriage.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriageComponent implements OnChanges {
  initialValue = input<number>(1);
  rows = input<number>(5);
  leftSeats = input<number>(2);
  rightSeats = input<number>(2);
  editable = input<boolean>(true);
  compressionLevel: Signal<2 | 1 | 0> = computed(() => {
    const maxNum = this.initialValue() + this.rows() * (this.leftSeats() + this.rightSeats());
    return maxNum > 9999 ? 2 : maxNum > 999 ? 1 : 0;
  });

  selectSeat = output<string>();

  seats: Record<'left' | 'right', SeatState[][]> = {
    left: [],
    right: [],
  };

  ngOnChanges() {
    this.seats = {
      left: [],
      right: [],
    };
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
    this.selectSeat.emit(target.id);
  }

  isDisabled(state: string) {
    return state === 'disabled';
  }
}
