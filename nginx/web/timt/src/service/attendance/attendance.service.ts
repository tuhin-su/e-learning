import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getToken } from 'src/app/utils/global-functions';
@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private apiUrl = environment.apiUrl; // Get the API URL from the environment configuration

  constructor(private http: HttpClient) { }


  getLocation() {
    const attendanceUrl = `${this.apiUrl}/location`;

    const token = getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return this.http.get<any>(attendanceUrl, { headers });
  }

  getDefualt(params: any = null) {
    const attendanceUrl = `${this.apiUrl}/attendance`;

    const token = getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });

    return this.http.post<any>(attendanceUrl, params, { headers });
  }

  addAttendance(){
    const attendanceUrl = `${this.apiUrl}/attendance`;

    const token = getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return this.http.put<any>(attendanceUrl, {}, { headers });
  }

  getAllStudent(data:{stream:string, sem:string, month: string}){
    const attendanceUrl = `${this.apiUrl}/attendance`;

    const token = getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return this.http.post<any>(attendanceUrl, data, { headers });
  }

  getStudentByface(data: any) {
    const attendanceUrl = `${this.apiUrl}/attendance/face`;

    const token = getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });

    const body = {
      image: data // The base64 image data
    };

    return this.http.post<any>(`${this.apiUrl}/attendance/face`, body, { headers });
  }

  sendHaven(id:string){
    const attendanceUrl = `${this.apiUrl}/attendance/comeHaven`;

    const token = getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });

    const body = {
      id: id 
    };

    return this.http.post<any>(`${attendanceUrl}`, body, { headers });
  }
    
}
