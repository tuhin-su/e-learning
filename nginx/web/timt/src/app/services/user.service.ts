import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponce } from '../interface/login';
import { ApiResponce } from '../interface/api-responce';
import { GlobalStorageService } from './global-storage.service';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  api = environment.api;

  constructor(private http: HttpClient, private storage: GlobalStorageService) {}

  login(data: LoginRequest): Observable<LoginResponce> {
    const loginUrl = `${this.api}/login`;
    const headers = { 'Content-Type': 'application/json' } as const;
    return this.http.post<LoginResponce>(loginUrl, data, { headers });
  }

  postInfo(data: any): Observable<any> {
    const userData = `${this.api}/user_info`;

    // Get the token and set the headers
    const token = this.storage.get('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    // Make the POST request with the headers
    return this.http.post<any>(userData, data, { headers });
  }
}
