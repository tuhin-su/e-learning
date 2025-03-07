import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponce } from '../interface/login';
import { ApiResponce } from '../interface/api-responce';
import { GlobalStorageService } from './global-storage.service';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  api = environment.api;
  private cache: { [key: string]: { data: ApiResponce; timestamp: number } } = {};

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

  updateInfo(data: any): Observable<any> {
    const userData = `${this.api}/user_info`;

    // Get the token and set the headers
    const token = this.storage.get('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    // Make the POST request with the headers
    return this.http.put<any>(userData, data, { headers });
  }

   getUserinfo(id: string): Observable<any | ApiResponce> {
    const cacheKey = `userinfo-${id}`;
    const cachedData = this.cache[cacheKey];

    // Check if cached data exists and is less than a day old
    if (cachedData && Date.now() - cachedData.timestamp < 24 * 60 * 60 * 1000) {
      return of(cachedData.data);  // Return cached data
    }

    // Otherwise, fetch from server
    const userData = `${this.api}/user/info/${id}`;
    const token = this.storage.get('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });

    return this.http.get<ApiResponce>(userData, { headers }).pipe(
      tap(
        (response) => {
          this.cache[cacheKey] = { data: response, timestamp: Date.now() };
        }
      )
    );
  }

  sendOTP(email:String){
    const userData = `${this.api}/users/mng/chpw`;
    const token = this.storage.get('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
   
    let data = {
      "email": email
    }
    return this.http.post<any>(userData, data, { headers });
  }

  changepasswd(data:any){
    const userData = `${this.api}/users/mng/chpw`;
    const token = this.storage.get('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return this.http.post<any>(userData, data, { headers });
  }

  logout(){
    const logoutUrl = `${this.api}/pages/auth/logout`;
    const token = this.storage.get('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return this.http.post<any>(logoutUrl, null, { headers });

  }
}
