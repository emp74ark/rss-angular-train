import { Component } from '@angular/core';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [MatGridList, MatGridTile],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss',
})
export class NotFoundPageComponent {}
