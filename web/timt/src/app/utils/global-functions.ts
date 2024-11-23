import Swal from 'sweetalert2';

export function showSuccessAlert(message: string, cancelButton: boolean = false) {
        Swal.fire({
            title: 'TIMT SAY',
            text: message,
            icon: 'success',
            showCancelButton: cancelButton,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
        });
    
}

export function showErrorAlert(message: string, cancelButton: boolean = false) {
        Swal.fire({
            title: 'TIMT SAY',
            text: message,
            icon: 'error',
            showCancelButton: cancelButton,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
        });
}

export function showWarningAlert(message: string, cancelButton: boolean = false) {
    Swal.fire({
        title: 'TIMT SAY',
        text: message,
        icon: 'warning',
        showCancelButton: cancelButton,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
    });
}

export function getToken(): string | null {
    return localStorage.getItem('token') ? localStorage.getItem('token') : null;
}

export function capitalizeUserName(name: string): string {
    return name
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' ');
  }