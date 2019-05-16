import { AuthService, GoogleLoginProvider } from "angularx-social-login";
import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild
} from "@angular/core";
declare var FB: any;
declare const gapi: any;

@Component({
  selector: "app-social-login",
  templateUrl: "./social-login.component.html",
  styleUrls: ["./social-login.component.scss"]
})
export class SocialLoginComponent implements OnInit, AfterViewInit {
  public auth2: any;
  @ViewChild("googleBtn") googleBtn: ElementRef;

  constructor(
    private element: ElementRef,
    private socialAuthService: AuthService
  ) {
    console.log("ElementRef: ", this.element);
    // console.log(this.googleBtn);
  }

  ngOnInit() {
    (window as any).fbAsyncInit = function() {
      FB.init({
        appId: "394951114363257",
        cookie: true,
        xfbml: true,
        version: "v3.1"
      });
      FB.AppEvents.logPageView();
    };

    ((d, s, id) => {
      let js;
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }
  ngAfterViewInit() {
    this.googleInit();
  }
  signInWithFB() {
    console.log("submit login to facebook");
    // FB.login();
    FB.login(response => {
      console.log("submitLogin", response);
      if (response.authResponse) {
        // login success
        // login success code here
        // redirect to home page
      } else {
        console.log("User login failed");
      }
    });
  }
  signInWithGoogle(element) {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    console.log("woooorrrrking");
    /* this.auth2.attachClickHandler(
      element,
      {},
      googleUser => {
        const profile = googleUser.getBasicProfile();
        console.log("Token || " + googleUser.getAuthResponse().id_token);
        console.log("ID: " + profile.getId());
        console.log("Name: " + profile.getName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail());
        //YOUR CODE HERE
      },
      error => {
        //  alert(JSON.stringify(error, undefined, 2));
      }
    );*/
  }

  public googleInit() {
    gapi.load("auth2", () => {
      this.auth2 = gapi.auth2.getAuthInstance({
        client_id:
          "388113572069-3he1ikmaa718ell48aojj83cfelevkhn.apps.googleusercontent.com",
        cookiepolicy: "single_host_origin",
        scope: "profile email"
      });
      this.signInWithGoogle(document.getElementById("googleBtn"));
    });
  }
}
