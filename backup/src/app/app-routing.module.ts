import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { QuestComponent } from './quest/quest.component';
import { AuthGuard } from './helpers';
import { DoorComponent } from './door/door.component';

const routes: Routes = [
  { path: 'quests', component: HomeComponent, canActivate: [] },
  // { path: 'quests', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'door/:state', component: DoorComponent },
  { path: 'quests/:id', component: QuestComponent },
  { path: '**', redirectTo: 'quests' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
