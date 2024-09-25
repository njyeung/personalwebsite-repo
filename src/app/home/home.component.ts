import { Component, ElementRef, ViewChild } from '@angular/core';
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

  @ViewChild('intro') intro : any
  @ViewChild('keyboard') keyboard : any

  playing = false;
  
  html = document.documentElement;
  headerStyle = {
    'opacity': 1,
    'font-size': '17vw'
  }
  backgroundStyle = {
    'opacity' : 1
  }

  constructor() {
    document.addEventListener('scroll', () => {
      this.animation();

      // wait until user interacts with site to save cpu use
      if(this.playing == false) {
        this.playing = true;
        this.keyboard.nativeElement.muted = true // you need this line cuz angular is weird
        this.keyboard.nativeElement.play();
      }
    })
  }

  ngOnInit() {
    setTimeout(()=>{
      window.scrollTo(0,0)
    }, 1000)
  }

  animation() {
    const height = window.innerHeight * 2.5 // yes im hard coding this
    const totalPageHeight = document.body.scrollHeight;
    const scrollTop = this.html.scrollTop;
    const maxScrollTop = height - window.innerHeight;

    if(scrollTop <= maxScrollTop) {
      const scrollFraction = scrollTop / maxScrollTop;
      this.headerStyle['opacity'] = Math.cos(scrollFraction*Math.PI/2)
      this.headerStyle['font-size'] = `${(17 + (scrollFraction * 3))}vw`

      if(scrollFraction < 0.4) {
        this.backgroundStyle['opacity'] = 1
      }
      else{
        this.backgroundStyle['opacity'] = 1.3*Math.cos(scrollFraction*2.5 - 0.9)
      }
    }
    else {
      this.headerStyle['opacity'] = 0
      this.backgroundStyle['opacity'] = 0
    }
  }

  mouseOverHeader() {

  }

  mouseOutHeader() {

  }

  getHeaderStyle() {
    return this.headerStyle
  }

  getBackgroundStyle() {
    return this.backgroundStyle
  }
}
