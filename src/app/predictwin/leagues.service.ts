import { Injectable, EventEmitter } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Subject, Observable } from 'rxjs';
import { PointObj } from './predictwin/predictwin.component';
import { Game } from './mypredictions/free/free-prediction.component';
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
export class LeaguesService {

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
    return this.db.collection<any>('predictionsForAdminScoring', ref =>
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
      return this.db.collection<any>('free-games', ref => {
        return ref.where('status', '==', true).where('date', '>=', status).orderBy('date', 'asc');
      }
      ).valueChanges({ idField: 'id' });
    }
    return this.db.collection<any>('free-games', ref => {
      return ref.where('date', '>=', status).orderBy('date', 'desc');;
    }
    ).valueChanges({ idField: 'id' });

  }
  fetchToken(arg?, status?) {

    if (status === undefined) {
      status = this.nowTimeStamp;
    }
    if (arg === 'front-end') return this.db.collection<any>('token-games', ref => {
      return ref.where('status', '==', true).where('date', '>=', status).orderBy('date', 'asc');
    }
    ).valueChanges({ idField: 'id' });
    // console.log(status, 'debugging')
    return this.db.collection<any>('token-games', ref => {
      return ref.where('date', '>=', status).orderBy('date', 'asc');
    }
    ).valueChanges({ idField: 'id' });

  }
  updateForAdmin(data) {
    if (data.id) { console.log(data); return this.db.collection<any>('predictionsForAdminScoring').doc(data.id).set(data); }
  }
  createForAdmin(data) {
    return this.db.collection<any>('predictionsForAdminScoring').add(data)
  }
  createMyPredictions(data, userId, arg?) {
    if (arg === 'token') {
      return this.db.collection<any>('mypredictions').doc(userId).collection('token').doc(data.id).set(data);
      //  return this.db.collection<any>('my-token-predictions').add(data);
    }

    return this.db.collection<any>('mypredictions').doc(userId).collection('free').doc(data.id).set(data);

  }
  /************For UserPoint**************** */
  updateUserPoint(userId, data) {

    // return this.db.collection<any>('points').doc(userId).update(data);
    return this.db.collection<PointObj>('points').doc(userId).set(data);
  }
  getUserPoint(userId?) {

    return this.db.collection<PointsObj>('points', ref => {
      return ref.orderBy('point', 'desc')
    }).valueChanges({ idField: 'id' });
  }
  getMyPoints(userId) {
    // return this.db.collection<any>('points', ref=>ref.where('id','==',userId)).doc(userId).valueChanges();
    return this.db.collection<any>('points').doc(userId).valueChanges();
  }
  /************ End of For UserPoint**************** */



  /************  updateUserPrize For test**************** */
  updatePrize(userId, data) {
    return this.db.collection<any>('prizes', ref => ref.where('id', '==', userId)).doc(userId).set(data);
  }
  getPrize(userId) {
    return this.db.collection<any>('prizes').doc(userId).valueChanges();
  }
  /************ End of updateUserPrize For test**************** */
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
    return this.db.collection<any>('freeGamesResults').valueChanges({ idField: 'id' });

  }
  getUserScoredGames(userId) {
    return this.db.collection<any>('predictionsForAdminScoring', ref => ref.where('user.userId', '==', userId)
      .where('scored', '==', true).where('free', '==', true).orderBy('datePredicted', 'desc')).valueChanges({ idField: 'id' });
  }
  getUserTokenScoredGames(userId) {
    let now = Date.now();
    return this.db.collection<any>('predictionsForAdminScoring', ref => ref.where('user.userId', '==', userId)
      .where('date', '<', now).where('token', '==', true).orderBy('date', 'desc')).valueChanges({ idField: 'id' });
  }
  getUserFreePredictionsForScoring(userId): Observable<Game[]> {
    return this.db.collection<any>('predictionsForAdminScoring', ref => ref.where('free', '==', true)
      .where('user.userId', '==', userId).orderBy('datePredicted', 'desc')).valueChanges({ idField: 'id' });
  }
  getUserTokenPredictionsForScoring(userId) {

    return this.db.collection<any>('predictionsForAdminScoring', ref => ref.where('token', '==', true)
      .where('user.userId', '==', userId).orderBy('datePredicted', 'desc')).valueChanges({ idField: 'id' });
  }
  fetchPredictedGameResults() {
    return this.db.collection<any>('predictionsForAdminScoring', ref => ref.where('scored', '==', false)).valueChanges({ idField: 'id' });

  }

  fetchTokenGameResults() {

    return this.db.collection('tokenGamesResults').valueChanges({ idField: 'id' });

  }
  submitGameResults(game, type?) {
    if (type === 'token') {
      console.log(game);
      return this.db.collection('tokenGamesResults').doc(game.id).set(game);
    }
    return this.db.collection('freeGamesResults').doc(game.id).set(game);


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
}
