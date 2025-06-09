import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet, Routes } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { Router } from '@angular/router'
import { HomeComponent } from './home/home.component';
import { CanvasComponent } from "./canvas/canvas.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, HomeComponent, CanvasComponent],
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
