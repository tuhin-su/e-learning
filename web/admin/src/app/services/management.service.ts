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
    const loginUrl = `${this.api}/info/course/create`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    };
    return this.http.post<any>(loginUrl, payload, { headers });
  }


  getStudentInfo(): Observable<any>{
    const loginUrl = `${this.api}/student/fetch`;
    const payload = {}
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    };
    return this.http.post<any>(loginUrl, payload, { headers });
  }


  // edit student

  editStudent(payload:any): Observable<any>{
    const loginUrl = `${this.api}/student/edit`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    };
    return this.http.post<any>(loginUrl, payload, { headers });
  }


  // delete student

  deleteStudent(id: any): Observable<any>{
    const loginUrl = `${this.api}/student/delete`;
    const payload = {
      "id": id
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    };
    return this.http.post<any>(loginUrl, payload, { headers });
  }


  // get user information

  getUserInfo(payload:{current:string | number, max:string|number}): Observable<any>{
    const loginUrl = `${this.api}/user/fetch`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    };
    return this.http.post<any>(loginUrl, payload, { headers });
  }



  editUser(payload:any): Observable<any>{
    const loginUrl = `${this.api}/user/edit`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`,
      
    };
    return this.http.post<any>(loginUrl, payload, { headers });
  }



  deleteUser(id: any): Observable<any>{
    const loginUrl = `${this.api}/user/delete`;
    const payload = {
      "id": id
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    };
    return this.http.post<any>(loginUrl, payload, { headers });
  }


  createUser(payload:any): Observable<any>{
    const loginUrl = `${this.api}/user/create`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    };
    return this.http.post<any>(loginUrl, payload, { headers });
  }
}
