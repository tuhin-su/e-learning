import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotisBordService {
  private apiUrl = 'https://www.timt.org.in/api/protected/notice';

  constructor(private http: HttpClient) {}

  getNotices(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
