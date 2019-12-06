import { Injectable, EventEmitter } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PredictwinService {
  gamesEmitter = new EventEmitter<any>();
  tokenEmitter = new EventEmitter<any>();
  freeEmitter = new EventEmitter<any>();
  // AllFreeGamesEmitter = new EventEmitter<any>();
  freeGames;
  tokenGames;
  freeGameCollection;
  tokenGameCollection;
  nowTimeStamp
  constructor(private db: AngularFirestore,
    private gameDoc: AngularFirestoreDocument<any>) {
    this.freeGameCollection = this.db.collection<any>('free-games');
    this.tokenGameCollection = this.db.collection<any>('token-games');
    this.freeGames = this.freeGameCollection.valueChanges({ idField: 'id' });
    this.tokenGames = this.tokenGameCollection.valueChanges({ idField: 'id' });
    // this.nowTimeStamp = Date.now();
    this.nowTimeStamp = 10 * 24 * 60 * 60 * 1000;
  }
  createGame(game, type?, id?) {
    if (type === 'token') {
      if (id) return this.db.doc<any>('token-games/' + id).update(game);
      return this.tokenGameCollection.add(game);
    } else {
      if (id) return this.db.doc<any>('free-games/' + id).update(game);
      return this.freeGameCollection.add(game);
    }

  }
  fetchAllTokenGames() {
    return this.db.collection<any>('token-games', ref => ref.where('status', '==', true).where('date', '>=', this.nowTimeStamp).orderBy('date', 'desc'));
  }
  fetchAllGames(type?, status?, area?) {

    if (type === 'token') {
      if (status === true && area === 'front-end') return this.db.collection<any>('token-games', ref => ref.where('status', '==', true).where('date', '>=', this.nowTimeStamp).orderBy('date', 'asc'));
      // if (area === 'back-end') return this.db.collection<any>('token-games', ref => ref.where('status', '==', true).where('date', '>=', this.nowTimeStamp).orderBy('date', 'desc'));
      return this.tokenGames;
    }
    //if( type === 'free') return  this.db.collection<any>('free-games', ref=>ref.where('status','==',true).orderBy('dateCreated', 'desc'));

    return this.freeGames;
  }
  fetchGame(id, type?, status?, nowTimeStamp?) {
    if (nowTimeStamp === undefined) {
      nowTimeStamp = this.nowTimeStamp;
    }
    //console.log(nowTimeStamp)
    if (type === 'token' && status === 'front-end') {
      console.log(id)
      return this.db.collection<any>('token-games', ref => {
        return ref.where('league_id', '==', id).where('status', '==', true).where('date', '>=', nowTimeStamp).orderBy('date', 'asc');
      }
      ).valueChanges({ idField: 'id' });
    }

    if (type === 'free' && status === 'front-end') {

      return this.db.collection<any>('free-games', ref => {
        return ref.where('league_id', '==', id).where('status', '==', true).where('date', '>=', nowTimeStamp).orderBy('date', 'asc');
      }
      ).valueChanges({ idField: 'id' });
    }
    if (type === 'token') {
      return this.db.collection<any>('token-games', ref => {
        return ref.where('league_id', '==', id).where('date', '>=', nowTimeStamp).orderBy('date', 'asc');
      }
      ).valueChanges({ idField: 'id' });
    }
    return this.db.collection<any>('free-games', ref => {
      return ref.where('league_id', '==', id).where('date', '>=', nowTimeStamp).orderBy('date', 'asc');
    }
    ).valueChanges({ idField: 'id' });
  }
  deleteGame() {

  }
}
