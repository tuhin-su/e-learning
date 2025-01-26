import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { GlobalStorageService } from './global-storage.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INoticRequest, INoticResponce } from '../interface/INotic';
@Injectable({
  providedIn: 'root'
})
export class CollegeService {

  constructor(
    private storage: GlobalStorageService,
    private http: HttpClient,
  ) { }
  private api = environment.api;

  getLocation() {
    const attendanceUrl = `${this.api}/location`;

    const token = this.storage.get('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return this.http.get<any>(attendanceUrl, { headers });
  }

  getDefualt(params: any = null) {
    const attendanceUrl = `${this.api}/attendance`;

    const token = this.storage.get('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });

    return this.http.post<any>(attendanceUrl, params, { headers });
  }

  addAttendance(){
    const attendanceUrl = `${this.api}/attendance`;

    const token = this.storage.get('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return this.http.put<any>(attendanceUrl, {}, { headers });
  }

  getAllStudent(data:{stream:string, sem:string, date: string}){
    const attendanceUrl = `${this.api}/attendance`;

    const token = this.storage.get('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return this.http.post<any>(attendanceUrl, data, { headers });
  }

  getStudentByface(data: any) {
    const attendanceUrl = `${this.api}/attendance/face`;

    const token = this.storage.get('token');;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });

    const body = {
      image: data // The base64 image data
    };

    return this.http.post<any>(`${this.api}/attendance/face`, body, { headers });
  }

  sendHaven(id:string){
    const attendanceUrl = `${this.api}/attendance/comeHaven`;

    const token = this.storage.get('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });

    const body = {
      id: id
    };

    return this.http.post<any>(`${attendanceUrl}`, body, { headers });
  }

  // classes service
  addClass(data:any): Observable<any>{
    const loginUrl = `${this.api}/classes`;
    const payload = data;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    };

    return this.http.post<any>(loginUrl, payload, { headers });
  }

  getAll(date:string): Observable<any>{
    const loginUrl = `${this.api}/classes/${date}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    };
    return this.http.get<any>(loginUrl, { headers });
  }


  /// info
  getInfoSem(value: any): Observable<any>{
    const loginUrl = `${this.api}/info/sem`;
    const payload = {
      "stream": value
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    };
    return this.http.post<any>(loginUrl, payload, { headers });
  }

  // stream info
  getStreamInfo(): Observable<any>{
    const loginUrl = `${this.api}/info/stream`;
    const payload = {}
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    };
    return this.http.post<any>(loginUrl, payload, { headers });
  }

  // NoticService
  getAllNotic(): Observable<any>{
    const loginUrl = `${this.api}/notice`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    };
    return this.http.get<any>(loginUrl, { headers });
  }

  createNotic(data: INoticRequest): Observable<INoticResponce>{ 
    const loginUrl = `${this.api}/notice`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    };
    return this.http.post<INoticResponce>(loginUrl, data, { headers });
  }


}
