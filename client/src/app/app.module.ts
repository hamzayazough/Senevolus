import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { CreateProfileComponent } from './pages/create-profile/create-profile.component';
import { AppHeaderComponent } from './common/app-header/app-header.component';
import { TaskComponent } from './common/task/task.component';
import { ListTaskComponent } from './common/list-task/list-task.component';
import { ElderTaskPageComponent } from './pages/elder-task-page/elder-task-page.component';
import { ChatComponent } from './common/chat/chat.component';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChatService } from './services/chat-service/chat-service.service';
import { VolunteerTaskPageComponent } from './pages/volunteer-task-page/volunteer-task-page.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ShopProductComponent } from './pages/shop/shop-product/shop-product.component';
import { CreateTaskComponent } from './pages/create-task/create-task.component';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { environment } from '../environment';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SocketService } from './services/socket.service';
import { AddressAutocompleteComponent } from './common/address-autocomplete/address-autocomplete.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { UploadSuccessComponent } from './pages/create-profile/upload-success/upload-success.component';
import { EndTaskDialogComponent } from './end-task-dialog/end-task-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';


const firebaseApp = initializeApp(environment.firebaseConfig);
const auth = getAuth(firebaseApp);
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
    CreateProfileComponent,
    AppHeaderComponent,
    TaskComponent,
    ListTaskComponent,
    ElderTaskPageComponent,
    ChatComponent,
    VolunteerTaskPageComponent,
    ProfileComponent,
    ShopComponent,
    ShopProductComponent,
    CreateTaskComponent,
    AddressAutocompleteComponent,
    EndTaskDialogComponent,
    UploadSuccessComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    MatTabsModule,
    MatSidenavModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatRadioModule,
    MatStepperModule,
    MatDialogModule,
  ],
  providers: [
    provideClientHydration(),
    ChatService,
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    SocketService,
    provideAnimationsAsync(),
    { provide: 'FIREBASE_APP', useValue: firebaseApp },
    { provide: 'FIREBASE_AUTH', useValue: auth },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
