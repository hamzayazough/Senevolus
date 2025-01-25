import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from '../pages/home/home.component';
import { SignInComponent } from '../pages/sign-in/sign-in.component';
import { CreateProfileComponent } from '../pages/create-profile/create-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
    CreateProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
