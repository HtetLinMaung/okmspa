import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  headers = { 'Content-Type': 'application/json' };

  constructor(private http: HttpClient) {}

  doGet(url: string) {
    return this.http.get(`${environment.apiUrl}/${url}`, {
      headers: this.headers,
    });
  }

  doPost(url: string, body: any) {
    return this.http.post(
      `${environment.apiUrl}/${url}`,
      JSON.stringify(body),
      {
        headers: this.headers,
      }
    );
  }

  doPut(url: string, body: any) {
    return this.http.put(`${environment.apiUrl}/${url}`, JSON.stringify(body), {
      headers: this.headers,
    });
  }

  doDelete(url: string) {
    return this.http.delete(`${environment.apiUrl}/${url}`, {
      headers: this.headers,
    });
  }
}
