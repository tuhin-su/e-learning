import { Injectable } from '@angular/core';
import { GlobalStorageService } from './global-storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FunctionaltyService {

  constructor(
    private storage: GlobalStorageService,
    private http: HttpClient
  ) { }

  api = environment.api;

  getPost(id: number): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    }
    return this.http.get<any>(`${this.api}/posts/${id}`, {headers});
  }

  postPost(FileData:File): Observable<any>{
    const token = this.storage.get('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });

    const formData = new FormData();
    formData.append('file', FileData);
    return this.http.post<{ id: number }>(this.api+'/posts', formData, { headers });
  }



  getTotalAttendence(): Observable<any>{

    const attendanceurl = `${this.api}/info/atttendance/today_total`;
    const token = this.storage.get('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return this.http.get<any>(attendanceurl, { headers });

  }

  getTotalClasses(): Observable<any>{

    const attendanceurl = `${this.api}/info/classes/today_total`;
    const token = this.storage.get('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return this.http.get<any>(attendanceurl, { headers });

  }

  getTotalNotice(): Observable<any>{

    const attendanceurl = `${this.api}/info/notices/month_total`;
    const token = this.storage.get('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return this.http.get<any>(attendanceurl, { headers });

  }


  getAttendenceChart(data:any): Observable<any>{

    const attendanceurl = `${this.api}/info/attendance/stream`;
    const token = this.storage.get('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    });
    return this.http.post<any>(attendanceurl, data, { headers });

  }
}
