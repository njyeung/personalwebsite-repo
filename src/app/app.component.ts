import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { Router } from '@angular/router'
import { HomeComponent } from './home/home.component';
import { CanvasComponent } from "./canvas/canvas.component";
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

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
    this.updates.versionUpdates
    .pipe(filter((e): e is VersionReadyEvent => e.type === 'VERSION_READY'))
    .subscribe(async ()=> {
      await this.updates.activateUpdate();
      document.location.reload()
    })
  }

  title = "Hi, I'm Nick";

  switchPage(e: String) {
    this.router.navigate([e])
  }
}
