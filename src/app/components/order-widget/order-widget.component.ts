import { Component, input, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardTitle } from '@angular/material/card';
import { Seat } from '../../models/carriage';

@Component({
  selector: 'app-order-widget',
  standalone: true,
  imports: [MatButton, MatCard, MatCardActions, MatCardContent, MatCardTitle],
  templateUrl: './order-widget.component.html',
  styleUrl: './order-widget.component.scss',
})
export class OrderWidgetComponent implements OnInit {
  selectedSeat = input<Seat>();
  rideId = input<number>();

  ngOnInit() {
    console.log('SELECTED SEATS', this.selectedSeat());
  }
}
