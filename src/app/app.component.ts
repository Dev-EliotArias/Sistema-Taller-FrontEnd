import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SideBarComponent } from './admin/side-bar/side-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent, SideBarComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
