
import { FooterComponent } from './home/footer/footer.component';
import { NewlobbyComponent } from './lobby/newlobby/newlobby.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HeaderComponent } from './home/header/header.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
HeaderComponent,
NewlobbyComponent,
FooterComponent
  ],
  exports: [
    HeaderComponent,
    NewlobbyComponent,
    MDBBootstrapModule,
    FooterComponent,
    RouterModule,

  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  imports: [MDBBootstrapModule,  RouterModule]
})
export class SharedModule {}
