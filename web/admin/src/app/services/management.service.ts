import { Injectable } from '@angular/core';
import { $dt } from '@primeng/themes';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalStorageService } from './global-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ManagementService {

  constructor(
    private http : HttpClient,
    private storage : GlobalStorageService

  ) { }

  api = environment.api;


  getStreamInfo(): Observable<any>{
    const loginUrl = `${this.api}/info/stream`;
    const payload = {}
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    };
    return this.http.post<any>(loginUrl, payload, { headers });
  }

  deleteCourse(id: any): Observable<any>{
    const loginUrl = `${this.api}/info/course/delete`;
    const payload = {
      "id": id
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    };
    return this.http.post<any>(loginUrl, payload, { headers });
  }

  editCourse(payload:any): Observable<any>{
    const loginUrl = `${this.api}/info/course/edit`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    };
    return this.http.post<any>(loginUrl, payload, { headers });
  }

  creteCourse(payload:any): Observable<any>{
    const loginUrl = `${this.api}/info/course/new`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    };
    return this.http.post<any>(loginUrl, payload, { headers });
  }

}
