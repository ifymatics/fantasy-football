import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../../environments/environment';
import { ChatComponent } from './chat/chat.component';
import { ChatRoutingModule } from './chat-routing.module';

@NgModule({
  imports: [
    CommonModule,
    /* for firebase */
    // AngularFireModule.initializeApp(environment.firebase),
    // AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    // AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    // AngularFireStorageModule, // imports firebase/storage only needed for storage features
    /*end of for firebase */
    ChatRoutingModule
  ],
  declarations: [ChatComponent]
})
export class ChatModule { }
