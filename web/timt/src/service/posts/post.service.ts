import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { getToken } from 'src/app/utils/global-functions';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  
  getPost(id: number) {}

  postPost(FileData:File): Observable<any>{
    const token = getToken();
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });

    const formData = new FormData();
    formData.append('file', FileData);
    return this.http.post<{ id: number }>(this.apiUrl+'/posts', formData, { headers });
  }
}
