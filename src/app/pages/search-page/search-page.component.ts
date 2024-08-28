import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CarriageComponent } from '../../components/carriage/carriage.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [HeaderComponent, CarriageComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {}
