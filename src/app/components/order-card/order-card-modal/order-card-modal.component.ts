import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-order-card-modal',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './order-card-modal.component.html',
  styleUrl: './order-card-modal.component.scss',
})
export class OrderCardModalComponent {
  private readonly dialogRef = inject(MatDialogRef<OrderCardModalComponent>);
  data = inject(MAT_DIALOG_DATA);

  cancelOrder() {
    this.dialogRef.close(true);
  }

  closeModal() {
    this.dialogRef.close();
  }
}
