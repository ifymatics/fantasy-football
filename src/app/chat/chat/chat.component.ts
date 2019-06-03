import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { database } from 'firebase';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chat = '';
         // Get a Firebase Database ref
 chatRef; // = firebase.database().ref("chat");
 my_profile ='';
 fullPageLoader = true;
  firechatAccountDisable = false;
  // userDetail = UtilityService.getLocalStorage('user').user_profile;

  constructor(private db: AngularFirestore) { }

  ngOnInit() {
    this.chatRef = this.db; // .database().ref("chat");
    console.log( this.db.collection('chat')
    );
  }

}
