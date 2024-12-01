// alert.service.ts
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from  '../components/alert-dialog-component/alert-dialog-component.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private dialog: MatDialog) {}

  showSuccessAlert(message: string, cancelButton: boolean = false, onOk?: () => void, onCancel?: () => void): void {
    this.showDialog('Success', message, cancelButton, onOk, onCancel);
  }

  showErrorAlert(message: string, cancelButton: boolean = false, onOk?: () => void, onCancel?: () => void): void {
    this.showDialog('Error', message, cancelButton, onOk, onCancel);
  }

  showWarningAlert(message: string, cancelButton: boolean = false, onOk?: () => void, onCancel?: () => void): void {
    this.showDialog('Warning', message, cancelButton, onOk, onCancel);
  }

  private showDialog(title: string, message: string, cancelButton: boolean, onOk?: () => void, onCancel?: () => void): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { title, message, cancelButton }
    });

    // Subscribe to the custom events only if the functions are provided
    if (onOk) {
      dialogRef.componentInstance.okClick.subscribe(onOk);
    }

    if (onCancel) {
      dialogRef.componentInstance.cancelClick.subscribe(onCancel);
    }
  }
}
