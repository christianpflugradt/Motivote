import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Poll} from './poll';
import {Option} from './option';

@Injectable({
  providedIn: 'root'
})
export class PollywogService {

  private pollywogBaseUrl = 'http://localhost:9999';

  constructor(private http: HttpClient) { }

  getPoll(secret: string): Observable<Poll> {
    return this.http.get<Poll>(this.pollywogBaseUrl + '/poll',
      { headers: new HttpHeaders().set('Authorization', secret) });
  }

  updateOptions(secret: string, options: Option[]): Observable<Poll> {
    return this.http.post<Poll>(this.pollywogBaseUrl + '/options',
      {
        keep_options: this.retrieveKeepOptions(options),
        create_options: this.retrieveCreateOptions(options)
      },
      { headers: new HttpHeaders().set('Authorization', secret) });
  }

  retrieveKeepOptions(options: Option[]): number[] {
    const result = [];
    options.filter(o => !!o.id).forEach(o => result.push(o.id));
    return result;
  }

  retrieveCreateOptions(options: Option[]): string[] {
    const result = [];
    options.filter(o => !o.id).forEach(o => result.push(o.text));
    return result;
  }

}
