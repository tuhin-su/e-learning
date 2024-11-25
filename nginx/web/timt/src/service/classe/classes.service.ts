import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getToken } from 'src/app/utils/global-functions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {

  private apiUrl = environment.apiUrl; // Get the API URL from the environment configuration

  constructor(private http: HttpClient) { }


  addClass(data:any): Observable<any>{
    const loginUrl = `${this.apiUrl}/classes`;
    const payload = data;
  
    const headers = { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    };
  
    return this.http.post<any>(loginUrl, payload, { headers });
  }

  getAll(): Observable<any>{
    const loginUrl = `${this.apiUrl}/classes`;
  
    const headers = { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    };
    return this.http.get<any>(loginUrl, { headers });
  }
}
