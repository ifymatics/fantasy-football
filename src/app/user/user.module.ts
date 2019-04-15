import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SharedModule } from './../shared.module';
import { AuthComponent } from './auth/auth.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { UserRoutingModule } from './user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider} from 'angularx-social-login';



// Configs
const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('554425196940-sp057g4rilbh3p88l8ja9e74saviha1q.apps.googleusercontent.com')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('113068126067086')
  },
  {
    id: LinkedInLoginProvider.PROVIDER_ID,
    provider: new LinkedInLoginProvider('LinkedIn-client-Id', false, 'en_US')
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
  providers: [{
    provide: AuthServiceConfig,
    useFactory: provideConfig
  }]
})
export class UserModule { }
