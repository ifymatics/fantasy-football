import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr, 'fr');
import { FooterComponent } from './home/footer/footer.component';
import { NewlobbyComponent } from './lobby/newlobby/newlobby.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HeaderComponent } from './home/header/header.component';
import { RouterModule } from '@angular/router';
import { ModalAlertComponent } from './modal-alert/modal-alert.component';
import { ModalGetTokenComponent } from './modal-getToken/modal-get-token.component';
import { SpinnerComponent } from './spinner/spinner/spinner.component';

@NgModule({
  declarations: [
HeaderComponent,
NewlobbyComponent,
FooterComponent,
ModalAlertComponent,
ModalGetTokenComponent,
SpinnerComponent
  ],
  exports: [
    CommonModule,
    HeaderComponent,
    NewlobbyComponent,
    MDBBootstrapModule,
    FooterComponent,
     ModalAlertComponent,
     ModalGetTokenComponent,
     SpinnerComponent,
    RouterModule,

  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  imports: [MDBBootstrapModule,  RouterModule, CommonModule]
})
export class SharedModule {}
