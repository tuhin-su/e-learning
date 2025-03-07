import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { GlobalStorageService } from '../../services/global-storage.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private storage: GlobalStorageService) {}

  canActivate(): boolean {
    const token = this.storage.get('token')

    if (token) {
      return true;
    } else {
        // return true
      this.router.navigate(['/auth/login']);
      return false;
    
    }
  }
}
