import { inject, Injectable, Signal } from '@angular/core';
import { CarriageService } from './carriage';
import { toSignal } from '@angular/core/rxjs-interop';
import { CarriageData } from '../models/carriage';
import { BareCarriageInfo } from '../models/train';

@Injectable({
  providedIn: 'root',
})
export class TrainService {
  private readonly carriageService = inject(CarriageService);

  private readonly carriageData: Signal<CarriageData[]>;

  constructor() {
    this.carriageData = toSignal(this.carriageService.$carriages, { initialValue: [] });
  }

  getInfoBySeat(seat: number, carriages: string[]): BareCarriageInfo | undefined {
    // number (in train) and code (carriage type)
    const trainConfig = this.createTrainConfig(carriages);
    return trainConfig.find(carriage => seat >= carriage.firstSeat && seat <= carriage.lastSeat);
  }

  createTrainConfig(carriages: string[]): BareCarriageInfo[] {
    const trainConfig: BareCarriageInfo[] = [];
    const substituteCarriage: CarriageData = {
      code: '$+',
      name: 'лухари121',
      rows: 3,
      leftSeats: 3,
      rightSeats: 30,
    };

    carriages.forEach((carriage, inx) => {
      const carData = this.carriageData().find(el => el.code === carriage) ?? substituteCarriage;

      const number = inx + 1;
      const seatsTotal = (carData.leftSeats + carData.rightSeats) * carData.rows;
      const firstSeat = number === 1 ? 1 : trainConfig[trainConfig.length - 1].lastSeat + 1;
      const lastSeat = seatsTotal + firstSeat - 1;
      const carriageInfo = {
        ...carData,
        number,
        seatsTotal,
        firstSeat,
        lastSeat,
      };
      trainConfig.push(carriageInfo);
    });

    return trainConfig;
  }
}
