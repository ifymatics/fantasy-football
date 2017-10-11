import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthloginService {
  url: string;
  url1 = 'http://127.0.0.1/fantastic/';


  constructor(private _http: HttpClient) { }

  /*login(data: {}) {
    console.log(data);
   return this._http.post('http://127.0.0.1/fantastic/user/auth/login', data);
  }*/
  api(url2, data: {}, module) {
this.url = this.url1.concat(url2);
return this._http.post(this.url, data, module);
  }
}
