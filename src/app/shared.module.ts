import { NewlobbyComponent } from './lobby/newlobby/newlobby.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HeaderComponent } from './home/header/header.component';

@NgModule({
  declarations: [
HeaderComponent,
NewlobbyComponent,
  ],
  exports: [
    HeaderComponent,
    NewlobbyComponent,
    MDBBootstrapModule
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  imports: [MDBBootstrapModule ]
})
export class SharedModule {}
