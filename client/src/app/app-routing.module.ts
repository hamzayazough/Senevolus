import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { SignInComponent } from '../pages/sign-in/sign-in.component';
import { CreateProfileComponent } from '../pages/create-profile/create-profile.component';
import { ElderTaskPageComponent } from '../pages/elder-task-page/elder-task-page.component';
import { VolunteerTaskPageComponent } from '../pages/volunteer-task-page/volunteer-task-page.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { ShopComponent } from '../pages/shop/shop.component';
import { CreateTaskComponent } from '../pages/create-task/create-task.component';

const routes: Routes = [
    { path: '', redirectTo: '/signin', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'signin', component: SignInComponent },
    { path: 'createProfile', component: CreateProfileComponent},
    { path: 'elderTaskPage', component: ElderTaskPageComponent},
    { path: 'volunteerTaskPage', component: VolunteerTaskPageComponent},
    { path: 'profile', component: ProfileComponent},
    { path: 'shop', component: ShopComponent},
    { path: 'create-task', component: CreateTaskComponent},
    { path: '**', redirectTo: '/signin' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
