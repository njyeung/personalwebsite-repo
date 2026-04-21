import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { RouterOutlet, Routes } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { Router } from '@angular/router'
import { HomeComponent } from './home/home.component';
import { CanvasComponent } from "./canvas/canvas.component";
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, HomeComponent, CanvasComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  private updates = inject(SwUpdate)

  constructor(private router: Router) {}

  ngOnInit() {
    if (this.updates.isEnabled) {
      this.updates.versionUpdates.subscribe(async ()=> {
        await this.updates.activateUpdate();
        document.location.reload()
      })
    }
  }

  title = "Hi, I'm Nick";

  switchPage(e: String) {
    this.router.navigate([e])
  }
}
