import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal-window',
  standalone: true,
  imports: [],
  templateUrl: './modal-window.component.html',
  styleUrl: './modal-window.component.scss',
})
export class ModalWindowComponent {
  title = input<string | number | undefined>('');
  toggleVisibility = output();

  onClose() {
    this.toggleVisibility.emit();
  }
}
