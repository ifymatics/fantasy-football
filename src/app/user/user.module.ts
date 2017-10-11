import { AuthComponent } from './auth/auth.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { UserRoutingModule } from './user-routing.module';
import { FormsModule } from '@angular/forms';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
  LinkedinLoginProvider,
  VkontakteLoginProvider,
} from 'angular-6-social-login-v2';

// Configs
export function getAuthServiceConfigs() {
   const config = new AuthServiceConfig(
      [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider('113068126067086')
        },
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider('554425196940-sp057g4rilbh3p88l8ja9e74saviha1q.apps.googleusercontent.com')
        },
        {
            id: LinkedinLoginProvider.PROVIDER_ID,
            provider: new LinkedinLoginProvider('1098828800522-m2ig6bieilc3tpqvmlcpdvrpvn86q4ks.apps.googleusercontent.com')
          },
      ]
  );
  return config;
}

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    MDBBootstrapModule,
    SocialLoginModule
  ],
  declarations: [
    SignupComponent,
    ProfileComponent,

  ],
  exports: [
    SignupComponent,
  ],
  providers: [{
    provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs
  }]
})
export class UserModule { }
