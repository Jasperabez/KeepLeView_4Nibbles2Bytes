import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MissionComponent } from './mission/mission.component';

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { MapComponent } from './map/map.component';

<<<<<<< HEAD
<<<<<<< HEAD
Amplify.configure({
  aws_project_region: 'us-east-1',
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: 'us-east-1_ods9jpAIR',
  aws_user_pools_web_client_id: '7jdh37dljq5oehhn47l56r2m98',
  oauth: {},
});
=======
// Amplify.configure({
//   "aws_project_region": "us-east-1",
//   "aws_cognito_region": "us-east-1",
//   "aws_user_pools_id": "us-east-1_ods9jpAIR",
//   "aws_user_pools_web_client_id": "7jdh37dljq5oehhn47l56r2m98",
//   "oauth": {}
// });
>>>>>>> commented amplify bug
=======
Amplify.configure(awsconfig);
>>>>>>> 769434c4ef9377251e006bc048533462ef3d9e5e

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    MissionComponent,
    MapComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
