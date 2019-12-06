import { SocialLoginComponent } from "./../user/auth/social-login/social-login.component";
import { SignupComponent } from "./../user/signup/signup.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AuthComponent } from "./../user/auth/auth.component";
import { HomeRoutingModule } from "./home-routing.module";
import { UserModule } from "./../user/user.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home/home.component";
import { MDBBootstrapModule } from "angular-bootstrap-md";
import { HttpClientModule } from "@angular/common/http";
import { SharedModule } from "../shared.module";
import { FooterComponent } from "./footer/footer.component";
import { NewHomeComponent } from './new-home/new-home.component';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from "@angular/platform-browser";


declare var Hammer: any;
export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any> {
    'pan': {direction: Hammer.DIRECTION_ALL},
    'swipe': {direction: Hammer.DIRECTION_VERTICAL}
  };

  buildHammer(element: HTMLElement) {
    const mc = new Hammer(element, {
      touchAction: 'auto',
      inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput,
      recognizers: [
        [Hammer.Swipe, {
          direction: Hammer.DIRECTION_HORIZONTAL
        }]
      ]
    });
    return mc;
  }
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UserModule,
    // LobbyModule,
    HomeRoutingModule,
    HttpClientModule,
    FormsModule,
    MDBBootstrapModule,
    ReactiveFormsModule,
    SharedModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent,
    // JoinContestComponent,
    AuthComponent,
    SignupComponent,
    SocialLoginComponent,
    NewHomeComponent
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    }
  ]
})
export class HomeModule {}
