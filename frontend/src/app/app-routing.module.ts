import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { MissionComponent } from './mission/mission.component';
import { AuthGuard } from './helpers';
import { DoorComponent } from './door/door.component';

const routes: Routes = [
  // { path: '', component: HomeComponent, canActivate: [] },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'door/:state', component: DoorComponent },
  { path: 'mission/:id', component: MissionComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
