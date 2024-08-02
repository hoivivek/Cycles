import { Component } from '@angular/core';
import { RouterOutlet, Routes, RouterModule } from '@angular/router';
@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterModule,RouterOutlet],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

}
