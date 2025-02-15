import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;  // Modify this based on your logic

  constructor() { }

  // Example: Check if user is logged in by checking a token in localStorage
  checkLoginStatus(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}
