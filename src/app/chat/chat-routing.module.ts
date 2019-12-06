import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { ChatComponent } from './chat/chat.component';
const chatRouting: Routes = [
 {path: '', component: ChatComponent},
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(chatRouting)
  ],
  declarations: []
})
export class ChatRoutingModule { }
