import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private apiUrl = environment.apiUrl; // Get the API URL from the environment configuration

  constructor(private http: HttpClient) { }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  getDefualt(params: any = null) {
    const attendanceUrl = `${this.apiUrl}/attendance`;

    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });

    // Create HttpParams from the provided params object
    if (params) {
      let httpParams = new HttpParams();
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          httpParams = httpParams.set(key, params[key]);
        }
      }
      return this.http.get<any>(attendanceUrl, { headers, params: httpParams });
    }
    return this.http.get<any>(attendanceUrl, { headers });
  }

  addAttendance(){
    const attendanceUrl = `${this.apiUrl}/attendance`;

    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return this.http.post<any>(attendanceUrl, {}, { headers });
  }

}
