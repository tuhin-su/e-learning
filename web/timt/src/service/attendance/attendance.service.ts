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

  getLocation() {
    const attendanceUrl = `${this.apiUrl}/location`;

    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return this.http.get<any>(attendanceUrl, { headers });
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
    return this.http.put<any>(attendanceUrl, {}, { headers });
  }

  getAllStudent(data:{stream:string, sem:Number}){
    const attendanceUrl = `${this.apiUrl}/attendance`;

    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return this.http.post<any>(attendanceUrl, data, { headers });
  }

  getStudentByface(data: any) {
    const attendanceUrl = `${this.apiUrl}/attendance/face`;

    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });

    const body = {
      image: data // The base64 image data
    };

    return this.http.post<any>(`${this.apiUrl}/attendance/face`, body, { headers });
  }
    
}
