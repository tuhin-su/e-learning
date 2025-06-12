import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    showSuccessAlert(message: any, cancelButton: boolean = false, onOk?: () => void, onCancel?: () => void): void {
        this.showDialog('Success', message, 'success', cancelButton, onOk, onCancel);
    }

    showErrorAlert(message: any, cancelButton: boolean = false, onOk?: () => void, onCancel?: () => void): void {
        this.showDialog('Error', message, 'error', cancelButton, onOk, onCancel);
    }

    showWarningAlert(message: any, cancelButton: boolean = false, onOk?: () => void, onCancel?: () => void): void {
        this.showDialog('Warning', message, 'warning', cancelButton, onOk, onCancel);
    }

    private showDialog(
        title: string,
        message: string,
        icon: 'success' | 'error' | 'warning' | 'info' | 'question',
        cancelButton: boolean,
        onOk?: () => void,
        onCancel?: () => void
    ): void {
        Swal.fire({
            title: title,
            text: message,
            icon: icon,
            showCancelButton: cancelButton,
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'swal-zindex-top'
            }
        }).then((result) => {
            if (result.isConfirmed && onOk) {
                // Execute the onOk callback when the user clicks 'OK'
                onOk();
            } else if (result.isDismissed && onCancel) {
                // Execute the onCancel callback when the user clicks 'Cancel'
                onCancel();
            }
        });
    }
}
