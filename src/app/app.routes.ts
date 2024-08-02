import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { TrackerComponent } from './tracker/tracker.component';
import { AboutComponent } from './about/about.component';
import { FeaturesComponent } from './features/features.component';



export const routes: Routes = [
  {path: '', redirectTo: '/welcome', pathMatch: 'full'},
  {path: 'welcome', component: WelcomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'tracker', component: TrackerComponent},
  { path: 'about', component: AboutComponent},
  { path: 'features', component: FeaturesComponent}
];

