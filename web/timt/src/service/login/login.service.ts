import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = environment.apiUrl; // Get the API URL from the environment configuration

  constructor(private http: HttpClient) { }

  // Define the method for logging in
  login(username: string, password: string): Observable<any> {
    const loginUrl = `${this.apiUrl}/login`;
    const payload = { username, password };
  
    const headers = { 'Content-Type': 'application/json' };
  
    return this.http.post<any>(loginUrl, payload, { headers });
  }
}
