import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from '../pages/home/home.component';
import { SignInComponent } from '../pages/sign-in/sign-in.component';
import { CreateProfileComponent } from '../pages/create-profile/create-profile.component';
import { AppHeaderComponent } from '../common/app-header/app-header.component';
import { TaskComponent } from '../common/task/task.component';
import { provideAuth0 } from '@auth0/auth0-angular';
import { AuthBtnComponent } from './auth-btn/auth-btn.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
    CreateProfileComponent,
    AppHeaderComponent,
    TaskComponent,
    AuthBtnComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [
    provideClientHydration(),
    provideAuth0({
      domain: 'dev-ibta2mockraiqpl3.us.auth0.com',
      clientId: 'qFnDGnuvJx22LvmoEgmja8UYyGrjJdR4',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'https://dev-ibta2mockraiqpl3.us.auth0.com/api/v2/',
      },
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
