import { Injectable,  EventEmitter } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable()
export class PredictwinService {
  gamesEmitter = new EventEmitter<any>();
  freeGames;
  tokenGames;
  freeGameCollection;
  tokenGameCollection;
  constructor(private db: AngularFirestore,  
    private gameDoc: AngularFirestoreDocument<any>) {
      this.freeGameCollection = this.db.collection<any>('free-games');
      this.tokenGameCollection = this.db.collection<any>('token-games');
      this.freeGames = this.freeGameCollection.valueChanges({idField: 'id'});
      this.tokenGames = this.tokenGameCollection.valueChanges({idField: 'id'});
     }
     createGame(game, type?){
       if (type === 'token'){ 
        return this.tokenGameCollection.add(game);
       }
       return this.freeGameCollection.add(game);
     }
     fetchAllGames(type?){
       if (type === 'token') {
         return this.tokenGames;
      }
      return this.freeGames;
     }
     fetchGame(id,type?){
      if (type === 'token') {
        return this.db.collection<any>('token-games' ,ref => {
          return ref.where('league_id', '==', id);
        }
        ).valueChanges({idField: 'id'});
      }
      return this.db.collection<any>('free-games' ,ref => {
        return ref.where('league_id', '==', id);
      }
      ).valueChanges({idField: 'id'});
     }
    deleteGame(){

    }
}
