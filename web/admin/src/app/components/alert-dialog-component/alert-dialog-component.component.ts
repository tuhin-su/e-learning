// alert-dialog.component.ts
import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-alert-dialog',
  template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>
    <div mat-dialog-content>
      <p>{{ data.message }}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onOk()">OK</button>
      @if (data.cancelButton) {<button  mat-button (click)="onCancel()">Cancel</button>}
    </div>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class AlertDialogComponent {
  @Output() okClick = new EventEmitter<void>();
  @Output() cancelClick = new EventEmitter<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string, title: string, cancelButton: boolean },
    private dialogRef: MatDialogRef<AlertDialogComponent>
  ) {}

  // Emit the custom event when "OK" is clicked
  onOk() {
    this.okClick.emit();
    this.dialogRef.close();
  }

  // Emit the custom event when "Cancel" is clicked
  onCancel() {
    this.cancelClick.emit();
    this.dialogRef.close();
  }
}
