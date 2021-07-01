import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import geturl from './geturl';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient) { }

  getData(urlpostfix: string)
  {
      let url: string = geturl(urlpostfix);
      return this.http.get(url)
        .pipe(map(res => {
          return res;
        }));
  }
}