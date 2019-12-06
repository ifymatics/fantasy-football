import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { SharedModule } from "./../shared.module";
import { MDBBootstrapModule } from "angular-bootstrap-md";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProfileComponent } from "./profile/profile.component";
import { UserRoutingModule } from "./user-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  LinkedInLoginProvider
} from "angularx-social-login";

// Configs
const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(
      "16999051284-pdqpi0dqasoljmp1pcso8jfnaqf4sr1d.apps.googleusercontent.com"
       //"156157409179-a1sib0frv6l8q60g9t8q8es32sma4kj3.apps.googleusercontent.com"
     
    )
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("201840133751668")
  },
  {
    id: LinkedInLoginProvider.PROVIDER_ID,
    provider: new LinkedInLoginProvider("LinkedIn-client-Id", false, "en_US")
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MDBBootstrapModule,
    UserRoutingModule,
    SocialLoginModule
  ],
  declarations: [
    // SignupComponent,
    ProfileComponent,
    EditProfileComponent
  ],
  exports: [
    // SignupComponent,
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ]
})
export class UserModule {}
