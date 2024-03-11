import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerComponent } from './player/player.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { SphereComponent } from './sphere/sphere.component'; // Import FormsModule here



@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    FooterComponent,
    SphereComponent,
 
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
