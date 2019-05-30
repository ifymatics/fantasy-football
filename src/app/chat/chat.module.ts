import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  imports: [
    CommonModule,
    /* for firebase */
    // AngularFireModule.initializeApp(environment.firebase),
   // AngularFirestoreModule,
   /*end of for firebase */
  ],
  declarations: [ChatComponent]
})
export class ChatModule { }
