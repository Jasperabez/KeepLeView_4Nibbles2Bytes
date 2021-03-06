import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { QuestComponent } from './quest/quest.component';

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { MapComponent } from './map/map.component';
import { DoorComponent } from './door/door.component';
import { OngoingQuestComponent } from './ongoing-quest/ongoing-quest.component';
import { PopupMessageComponent } from './popup-message/popup-message.component';
import { PopupListComponent } from './popup-list/popup-list.component';
import { ListItemComponent } from './list-item/list-item.component';

Amplify.configure(awsconfig);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    QuestComponent,
    MapComponent,
    DoorComponent,
    OngoingQuestComponent,
    PopupMessageComponent,
    PopupListComponent,
    ListItemComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
  ],

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
