import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { getToken } from 'src/app/utils/global-functions';

@Injectable({
  providedIn: 'root'
})
export class UserInfomationService {
  private apiUrl = environment.apiUrl; // Get the API URL from the environment configuration

  constructor(private http: HttpClient) { }

  // Define the method for logging in
  postInfo(data: any): Observable<any> {
    const userData = `${this.apiUrl}/user_info`;

    // Get the token and set the headers
    const token = getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    // Make the POST request with the headers
    return this.http.post<any>(userData, data, { headers });
  }
}
