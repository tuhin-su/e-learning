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


  getStudentInfo(payload:{current:string | number, max:string|number}): Observable<any>{
    const loginUrl = `${this.api}/student/fetch`;
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


  //  migrate the student 
  migrateStudent(payload:any): Observable<any>{
    const loginUrl = `${this.api}/student/migration`;
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



  inactiveUser(payload: any): Observable<any>{
    const loginUrl = `${this.api}/user/inactive`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    };
    return this.http.post<any>(loginUrl, payload, { headers },);
  }



  createUser(payload:any): Observable<any>{
    const loginUrl = `${this.api}/user/create`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    };
    return this.http.post<any>(loginUrl, payload, { headers });
  }


  getgroups(payload:{current:string | number, max:string|number}): Observable<any>{
    const loginUrl = `${this.api}/group/fetch`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    };
    return this.http.post<any>(loginUrl, payload, { headers });
  }

  editGroup(payload:any): Observable<any>{
    const loginUrl = `${this.api}/group/edit`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`,
      
    };
    return this.http.post<any>(loginUrl, payload, { headers });
  }

  createGroup(payload:any): Observable<any>{
    const loginUrl = `${this.api}/group/create`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    };
    return this.http.post<any>(loginUrl, payload, { headers });
  }


  getAttendance(payload: {
    stream: string,
    sem: string,
    year: Date | null,
    month: Date | null,
    date: Date | null
  }): Observable<any> {
    const loginUrl = `${this.api}/attendance/record`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.get('token')}`
    };
  
    // Format date as MM/DD/YYYY
    let formattedDate = null;
    if (payload.date) {
      const d = new Date(payload.date);
      formattedDate = `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear()}`;
    }
  
    const newPayload = {
      stream: payload.stream,
      sem: payload.sem,
      date: formattedDate
    };
  
    return this.http.post<any>(loginUrl, newPayload, { headers });
  }
  
}
