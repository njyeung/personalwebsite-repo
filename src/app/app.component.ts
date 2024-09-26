import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet, Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { ProjectsComponent } from './projects/projects.component';
import { Router } from '@angular/router'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, NavbarComponent, ProjectsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private router: Router) {}

  title = "Hi, I'm Nick";

  switchPage(e: String) {
    this.router.navigate([e])
  }
}
