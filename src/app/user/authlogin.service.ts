import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { UtilityService } from "./../utility.service";

import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse
} from "@angular/common/http";
// import { resolve, reject } from 'q';
import { map, catchError } from "rxjs/Operators";

@Injectable({
  providedIn: "root"
})
export class AuthloginService {
  url: string;
  url1 = "https://fantastic.ng/"; // "https://fantastic.ng/";// 'http://34.239.195.56//';

  isLoggedIn = false;
  session;
  componentData = null;
  contest = null;
  lineup = null;
  user;
  isLoading = false;

  constructor(
    private _http: HttpClient,
    private utilityService: UtilityService,
    private router: Router
  ) { }

  api(url2, data: {}, VERB: string, header?): Observable<any> {
    const headers = new HttpHeaders().set("session_key", header);
    const params = new HttpParams().set("data", "{}");
    const verbLang = VERB.toLowerCase();
    this.url = this.url1.concat(url2);

    if (verbLang === "post") {
      if (header)
        // this.fetchSession();
        return this._http.post(this.url, data, { headers });
      // console.log(this.url, data, {headers});
      else return this._http.post(this.url, data);
    } else if (verbLang === "login" || verbLang === "signup") {
      return this._http.post(this.url, data).pipe(catchError(this.handleError));
    } else if (verbLang === "logout") {
      return this._http.post(this.url, data);
    } else {
      // console.log(verbLang);
      return this._http.get(this.url, { headers });
    }
  }
  multipartApi = function (name, params, apiType) {
    // var baseUrl = (apiType==='sport') ? getOptions.sportsApiUrl : getOptions.userApiUrl;
    // const baseUrl = getOptions.baseUrl;
    const paramsObj = new FormData();
    Object.keys(params).forEach(function (key) {
      paramsObj.append(key, params[key]);
    });
    return this._http.post(this.url1 + name, paramsObj, {
      // transformRequest: angular.identity,
      headers: { "Content-Type": undefined }
    });
  };
  /*authStatus(auth) {
  this.isLoggedIn = auth;
  console.log(auth);
  }*/
  isAuthenticated() {
    // tslint:disable-next-line:no-shadowed-variable
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve(this.checkIfLoggedIn()), 500);
    });
    return promise;
  }
  checkIfLoggedIn() {
    // const isLoggedIn = this.utilityService.checkLocalStorageStatus('user');
    this.isLoggedIn = this.utilityService.checkLocalStorageStatus("user");
    return this.isLoggedIn;
  }
  interComponetsTalks(data, arg) {
    if (arg === "contest") {
      this.contest = data;
    } else if (arg === "lineup") {
      this.lineup = data;
      // console.log(this.lineup);
    } else {
      this.componentData = data;
    }
    this.componentData = data;
  }
  getComponentData(): Observable<any> {
    if (this.componentData !== null) {
      return this.componentData;
    } else if (this.contest !== null) {
      return this.contest;
    } else {
      return;
    }
  }
  login(hashing, globalSport, loginForm) {
    this.api("user/auth/login", hashing, "login").subscribe(
      data => {
        // {
        if (data.response_code === 200) {
          console.log(data.data.session_key);
          if (loginForm.value.rememberMe === true) {
            this.utilityService.setSession("remember", {
              email: hashing.email,
              remember: loginForm.value.rememberMe
            });
          } else {
            this.utilityService.clearSession("remember");
            // this.utilityservice.clearLocalStorage('user');
          }
          data.data.login_date = this.utilityService.currentDateTime();
          // console.warn(data.data);
          data.data.login_type = "native";
          this.utilityService.clearLocalStorage("user");
          this.utilityService.setLocalStorage("user", data);
          this.utilityService.getLocalStorage("user").data.session_key !== null
            ? (this.isLoggedIn = true)
            : (this.isLoggedIn = false);
          this.user = this.utilityService.getLocalStorage("user");
          // if (this.user !== false) {
          this.session = data.data.session_key; // this.user.data.session_key;
          this.api(
            "user/my_profile/header_detail",
            {},
            "post",
            this.session
          ).subscribe(
            data1 => {
              data["data"].user_profile.sports = data1["data"].sport;
              // console.warn(data['data']['session_key']);
              // console.warn(this.utilityService.getLocalStorage('user'));
              for (const i of data1["data"]["sport"]) {
                // console.warn(data1['data'].sport);
                const sportId = globalSport ? globalSport : "";
                // console.log( data1['data']['sport'][0].sports_id);
                const id = data1["data"]["sport"][0].sports_id;
                if (data1["data"]["sport"][0].sports_id /*sportId*/) {
                  const selectedSports = data1["data"]["sport"];
                  selectedSports.format_type = "daily";
                  selectedSports.selected_sports_id = globalSport;
                  setTimeout(() => {
                    // this.utilityservice.clearLocalStorage('user');
                    this.router.navigate([id + "/league"]);
                  }, 300);
                }
              }
            },
            error => {
              // console.log(error['error']); alert(error['error']);
              this.isLoading = false;
            }
          );
          // this.router.navigate(['/league']);
        }
      },
      error => {
        this.isLoading = false;
        console.log(error.error);
        // this.isLoading = false;
      }
    );
  }
  logout() {
    // if (this.checkIfLoggedIn()) {

    const user = this.utilityService.getLocalStorage("user").data.session_key;
    // const user = this.checkIfLoggedIn().data.session_key;
    if (user) {
      const logoutObj = { session_key: user };
      this.api("user/auth/logout", logoutObj, "logout").subscribe(
        data => {
          this.utilityService.clearLocalStorage("user");
          this.isLoggedIn = false;
          // console.log(data);
          this.router.navigate(["/"]);
        },
        error => console.log(error)
      );
    } else {
      this.router.navigate(["/"]);
    }
    // }
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      /*console.log(
      `Backend returned code ${JSON.stringify(error.error.error)}, ` +
      `body was: ${JSON.stringify(error.status)}`);*/
    }
    // return an observable with a user-facing error message
    return throwError(error);
    // return Observable.throw(error);
    // 'Something bad happened; please try again later.');
  }
}
