import { JoinContestComponent } from './shared/join-contest/join-contest.component';
import { NewlobbyComponent } from './lobby/newlobby/newlobby.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home/home.component';


const fantRoutes: Routes = [
{path: '', component: HomeComponent},
{path: 'league', loadChildren: './league/league.module#LeagueModule'},
 {path: 'profile', loadChildren: './user/user.module#UserModule'}
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(fantRoutes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
