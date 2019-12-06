import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicComponent } from './public/public.component';
import { ContestListComponent } from './contest-list/contest-list.component';
import { ContestDetailsComponent } from './contest-details/contest-details.component';
import { InviteFriendsComponent } from './invite-friends/invite-friends.component';
import { InviteFriendsFromCollectionComponent } from './invite-friends-from-collection/invite-friends-from-collection.component';
import { JoinContestComponent } from './join-contest/join-contest.component';
import { MyteamViewComponent } from './myteam-view/myteam-view.component';
import { ProfileCompleteComponent } from './profile-complete/profile-complete.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PublicComponent,
     ContestListComponent,
      ContestDetailsComponent,
       InviteFriendsComponent,
       InviteFriendsFromCollectionComponent,
        JoinContestComponent,
         MyteamViewComponent,
        ProfileCompleteComponent]
})
export class SharedModule { }
