import { Injectable, EventEmitter } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
export class League{
  name?:string;
  id?:string;
}
@Injectable({
  providedIn: 'root'
})
export class LeaguesService {

  leagues = new EventEmitter<League[]>();
  items;
  itemsCollection;
  constructor(private db: AngularFirestore,  
    private itemDoc: AngularFirestoreDocument<League>) {
      this.itemsCollection = this.db.collection<League>('leagues');
      this.items = this.itemsCollection.valueChanges();
     }
     createLeague(league){
      return this.itemsCollection.add(league);
     }
     fetchAllLeagues(){
      return this.db.collection<League>('leagues' /*,ref => {
        return ref.orderBy('category');
      }*/
      ).valueChanges({idField: 'id'}); 
     }
}
