import { Component } from '@angular/core';
import { RouterOutlet, Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { ProfileComponent } from './profile/profile.component';
import { TrackerComponent } from './tracker/tracker.component';
import { AboutComponent } from './about/about.component';
import { FeaturesComponent } from './features/features.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WelcomeComponent, HomeComponent, LoginComponent, ProfileComponent,RouterModule, TrackerComponent, AboutComponent, FeaturesComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Cycles';
}

