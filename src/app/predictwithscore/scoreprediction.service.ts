import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Game } from '../predictwin/mypredictions/free/free-prediction.component';
export class League {
  name?: string;
  id?: string;
}
class PointsObj {
  point: number;
  userId: object;
}
@Injectable({
  providedIn: 'root'
})
export class ScorepredictionService {
  tokenEmitter = new EventEmitter<any>();
  freeEmitter = new EventEmitter<any>();
  gamesEmitter = new EventEmitter<any>()
  leagues = new EventEmitter<League[]>();
  freeGamesArray = new EventEmitter<any[]>();
  tokenGamesObj = new EventEmitter<any[]>();
  tokenGamesArray = new EventEmitter<{}>();
  clearGamesArray = new EventEmitter<string>();
  tokengameArrayLength = new EventEmitter<number>();
  myFreePredictionsEmitter = new EventEmitter<any>();
  myTokenPredictionsEmitter = new EventEmitter<any>();
  user_balanceEmitter = new EventEmitter<any>();
  pointsEmitter = new EventEmitter<any>();
  freeLeagueEmitter = new EventEmitter<any>();
  tokenLeagueEmitter = new EventEmitter<any>();
  leagueIdTrackerEmitter = new EventEmitter<any>();
  emitSubmittedGames = new EventEmitter<any>();
  items;
  predictedGames = [];
  itemsCollection;
  nowTimeStamp;
  constructor(private db: AngularFirestore,
    private itemDoc: AngularFirestoreDocument<League>) {
    this.itemsCollection = this.db.collection<League>('leagues');
    this.items = this.itemsCollection.valueChanges();
    this.nowTimeStamp = 10 * 24 * 60 * 60 * 1000;
  }
  checkForGameIdAndPlayerId(id, userId) {
    return this.db.collection<any>('scorePredictionsForAdminScoring', ref =>
      ref.where('ID', '==', id).where('user.userId', '==', userId))
      .valueChanges({ idField: 'id' });
  }
  createLeague(league, id?) {
    if (id) return this.db.collection<League>('leagues').doc(id).update(league);
    return this.itemsCollection.add(league);
  }
  fetchAllLeagues(status?) {
    if (status === true) {
      return this.db.collection<League>('leagues', ref => {
        return ref.where('status', '==', true);
      }
      ).valueChanges({ idField: 'id' });
    }
    return this.db.collection<League>('leagues' /*,ref => {
        return ref.where('status', '==', true);
      }*/
    ).valueChanges({ idField: 'id' });
  }
  fetchFree(arg?, status?) {
    if (arg === 'front-end') {
      return this.db.collection<any>('freescore-games', ref => {
        return ref.where('status', '==', true).where('date', '>=', status).orderBy('date', 'asc');
      }
      ).valueChanges({ idField: 'id' });
    }
    return this.db.collection<any>('freescore-games', ref => {
      return ref.where('date', '>=', status).orderBy('date', 'desc');;
    }
    ).valueChanges({ idField: 'id' });

  }
  fetchToken(arg?, status?) {

    if (status === undefined) {
      status = this.nowTimeStamp;
    }
    if (arg === 'front-end') return this.db.collection<any>('tokenscore-games', ref => {
      return ref.where('status', '==', true).where('date', '>=', status).orderBy('date', 'asc');
    }
    ).valueChanges({ idField: 'id' });
    // console.log(status, 'debugging')
    return this.db.collection<any>('tokenscore-games', ref => {
      return ref.where('date', '>=', status).orderBy('date', 'asc');
    }
    ).valueChanges({ idField: 'id' });

  }
  updateForAdmin(data) {
    if (data.id) { console.log(data); return this.db.collection<any>('scorePredictionsForAdminScoring').doc(data.id).set(data); }
  }
  createForAdmin(data) {
    return this.db.collection<any>('scorePredictionsForAdminScoring').add(data)
  }
  createMyPredictions(data, userId, arg?) {
    if (arg === 'token') {
      return this.db.collection<any>('mypredictions').doc(userId).collection('token').doc(data.id).set(data);
      //  return this.db.collection<any>('my-token-predictions').add(data);
    }

    return this.db.collection<any>('mypredictions').doc(userId).collection('free').doc(data.id).set(data);

  }

  getAllPredictions() {
    return this.db.collection('mypredictions').ref.id
    //.snapshotChanges();
  }
  //  getUserPredictions(userId: string, where, type?) {
  //   if (type === 'token'){
  //     return this.db.collection('mypredictions').doc(userId).collection('token')
  //     .valueChanges({idField: 'id'});

  //   }
  //   if(where ==='scored' && type === 'token'){
  //     this.db.collection('mypredictions').doc(userId).collection('token', ref=>{
  //       return ref.where('scored', '==', false)
  //     })
  //     .valueChanges({idField: 'id'});
  //   }
  //   if(where ==='scored'){

  //     return this.db.collection('mypredictions').doc(userId).collection('free',ref =>{
  //       return ref.where('scored','==', false)
  //     })
  //     .valueChanges({idField: 'id'});
  //   }
  //   // console.log('scored');
  //   return this.db.collection('mypredictions').doc(userId).collection('free')
  //   .valueChanges({idField: 'id'});

  //    }
  fetchFreeGameResults() {
    return this.db.collection<any>('freescoreGamesResults').valueChanges({ idField: 'id' });

  }
  getUserScoredGames(userId) {
    return this.db.collection<any>('scorePredictionsForAdminScoring', ref => ref.where('user.userId', '==', userId)
      .where('scored', '==', true).where('free', '==', true).orderBy('datePredicted', 'desc')).valueChanges({ idField: 'id' });
  }
  getUserTokenScoredGames(userId) {
    let now = Date.now();
    return this.db.collection<any>('scorePredictionsForAdminScoring', ref => ref.where('user.userId', '==', userId)
      .where('date', '<', now).where('token', '==', true).orderBy('date', 'desc')).valueChanges({ idField: 'id' });
  }
  getUserFreePredictionsForScoring(userId): Observable<Game[]> {
    return this.db.collection<any>('scorePredictionsForAdminScoring', ref => ref.where('free', '==', true)
      .where('user.userId', '==', userId).orderBy('datePredicted', 'desc')).valueChanges({ idField: 'id' });
  }
  getUserTokenPredictionsForScoring(userId) {

    return this.db.collection<any>('scorePredictionsForAdminScoring', ref => ref.where('token', '==', true)
      .where('user.userId', '==', userId).orderBy('datePredicted', 'desc')).valueChanges({ idField: 'id' });
  }
  fetchPredictedGameResults() {
    return this.db.collection<any>('scorePredictionsForAdminScoring', ref => ref.where('scored', '==', false)).valueChanges({ idField: 'id' });

  }

  fetchTokenGameResults() {

    return this.db.collection('tokenscoreGamesResults').valueChanges({ idField: 'id' });

  }
  submitGameResults(game, type?) {
    if (type === 'token') {
      console.log(game);
      return this.db.collection('tokenscoreGamesResults').doc(game.id).set(game);
    }
    return this.db.collection('freescoreGamesResults').doc(game.id).set(game);


  }
  updateGame(userId, data) {
    this.db.collection<any>('mypredictions').doc(userId).collection('free').doc(data.id).set(data);
  }
  updateUserpredictionsAfterScoring(userId, data, arg?) {
    if (arg === 'token') {
      return this.db.collection<any>('mypredictions').doc(userId).collection('token').doc(data.id).update(data);
      //  return this.db.collection<any>('my-token-predictions').add(data);
    }

    return this.db.collection<any>('mypredictions').doc(userId).collection('free').doc(data.id).update(data);

  }
  getInfoMessage(arg) {
    //console.log('loooooooo')
    return this.db.collection('infoMessage').doc('homePage').valueChanges();
  }
  fetchGame(id, type?, status?, nowTimeStamp?) {
    if (nowTimeStamp === undefined) {
      nowTimeStamp = this.nowTimeStamp;
    }
    //console.log(nowTimeStamp)
    if (type === 'token' && status === 'front-end') {
      // console.log(id)
      return this.db.collection<any>('tokenscore-games', ref => {
        return ref.where('league_id', '==', id).where('status', '==', true).where('date', '>=', nowTimeStamp).orderBy('date', 'asc');
      }
      ).valueChanges({ idField: 'id' });
    }

    if (type === 'free' && status === 'front-end') {

      return this.db.collection<any>('freescore-games', ref => {
        return ref.where('league_id', '==', id).where('status', '==', true).where('date', '>=', nowTimeStamp).orderBy('date', 'asc');
      }
      ).valueChanges({ idField: 'id' });
    }
    if (type === 'token') {
      return this.db.collection<any>('tokenscore-games', ref => {
        return ref.where('league_id', '==', id).where('date', '>=', nowTimeStamp).orderBy('date', 'asc');
      }
      ).valueChanges({ idField: 'id' });
    }
    return this.db.collection<any>('freescore-games', ref => {
      return ref.where('league_id', '==', id).where('date', '>=', nowTimeStamp).orderBy('date', 'asc');
    }
    ).valueChanges({ idField: 'id' });
  }
}
