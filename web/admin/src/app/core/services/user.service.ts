import { Injectable } from '@angular/core';
import { GlobalStorageService } from './global-storage.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  api_address = environment.api;

  constructor(private http: HttpClient, private storage: GlobalStorageService) { }
  getQrKey(key:string):Observable<any> {
    const endPoint = `${this.api_address}/user/login/weblogin/${key}`;
    return this.http.get<any>(endPoint);
  }
}
