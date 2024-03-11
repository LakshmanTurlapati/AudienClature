import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SphereComponent } from './sphere/sphere.component'; 
import { PlayerComponent } from './player/player.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: PlayerComponent }, // Root page with player
  { path: 'globe', component: SphereComponent }, // Globe page without the player
  // ... other routes

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
