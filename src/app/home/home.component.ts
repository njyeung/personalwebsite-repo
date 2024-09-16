import { Component } from '@angular/core';
import { CanvasComponent } from "../canvas/canvas.component";
import { AppComponent } from '../app.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AppComponent, CanvasComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  html = document.documentElement;
  headerStyle = {
    'opacity': 1,
    'font-size': '17vw'
  }

  constructor() {
    document.addEventListener('scroll', () => {
      this.animation();
    })
  }
  
  ngOnInit() {
    setTimeout(()=>{
      window.scrollTo(0,0)
    }, 100)
  }
  
  animation() {
    const scrollTop = this.html.scrollTop;
    const maxScrollTop = this.html.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScrollTop;
    
    this.headerStyle['opacity'] = Math.cos(scrollFraction*Math.PI/2)
    this.headerStyle['font-size'] = `${(17 + (scrollFraction * 3))}vw`
  }

  mouseOverHeader() {

  }

  mouseOutHeader() {

  }

  getHeaderStyle() {
    return this.headerStyle
  }
}
