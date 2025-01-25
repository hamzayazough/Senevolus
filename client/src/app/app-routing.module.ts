import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { SignInComponent } from '../pages/sign-in/sign-in.component';
import { CreateProfileComponent } from '../pages/create-profile/create-profile.component';

const routes: Routes = [
    { path: '', redirectTo: '/signin', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'signin', component: SignInComponent },
    { path: 'createProfile', component: CreateProfileComponent},
    { path: '**', redirectTo: '/signin' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
