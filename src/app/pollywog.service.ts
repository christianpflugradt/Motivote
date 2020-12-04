import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Poll} from './poll';

@Injectable({
  providedIn: 'root'
})
export class PollywogService {

  private pollywogUrl = 'http://localhost:9999/poll';

  constructor(private http: HttpClient) { }

  getPoll(secret: string): Observable<Poll> {
    console.log(secret);
    return this.http.get<Poll>(this.pollywogUrl, { headers: new HttpHeaders().set('Authorization', secret) });
  }

}
