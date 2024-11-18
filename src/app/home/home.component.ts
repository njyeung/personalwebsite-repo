import { Component, ViewChild, ViewChildren } from '@angular/core';
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
  @ViewChild('madison') madison: any
  @ViewChildren('fadein') fadein : any

  keyboardSrc = 'assets/keyboard-tiny.mp4'
  madisonSrc = 'assets/madison-tiny.mp4'

  observer = new IntersectionObserver((entries)=> {
    entries.forEach((entry=> {
      if(entry.isIntersecting) {
        entry.target.classList.add('show');
      } else {
        entry.target.classList.remove('show')
      }
    }))
  })

  videoPlaying = false;
  
  html = document.documentElement;
  headerStyle = {
    'opacity': 1,
    'font-size': '17vw'
  }
  backgroundStyle = {
    'opacity' : 1
  }

  constructor() {
    // mobile
    if(window.innerHeight>window.innerWidth) {
      this.keyboardSrc = 'assets/keyboard-tiny.mp4'
      this.madisonSrc = 'assets/madison-tiny.mp4'
    }
    // desktop
    else if(window.innerHeight<=window.innerWidth) {
      if(window.innerWidth > 1920 + 20) {
        this.keyboardSrc = 'assets/keyboard-small.mp4'
        this.madisonSrc = 'assets/madison-small.mp4'
      }
      else {
        this.keyboardSrc = 'assets/keyboard-tiny.mp4'
        this.madisonSrc = 'assets/madison-tiny.mp4'
      }
    }

    document.addEventListener('scroll', () => {
      this.animation();

      // wait until user interacts with site to save cpu use
      if(this.videoPlaying == false) {
        this.videoPlaying = true;
        this.keyboard.nativeElement.muted = true // you need this line cuz angular is weird
        this.madison.nativeElement.muted = true
        this.keyboard.nativeElement.play();
        this.madison.nativeElement.play();
      }
    })

    document.addEventListener('DOMContentLoaded', () => {

      let dragging: any;
      let startY: number;
      let scrollDown: number;

      document.addEventListener('mousedown', (e:any)=> {
        e.preventDefault();
        dragging = true;
        startY = e.pageY
        scrollDown = this.html.scrollTop
      })

      document.addEventListener('mouseup', ()=> {
        dragging = false;
      })
      
      document.addEventListener('mouseleave', ()=> {
        dragging = false;
      })

      document.addEventListener('mousemove', (e:any)=> {
        if(dragging == true) {
          e.preventDefault();

          const y = e.pageY
          const walk = y - startY

          if(walk > 0) {
            window.scrollBy(0,-10)
          }
          else{
            window.scrollBy(0,10)
          }

          if(this.html.scrollTop < 0) {
            this.html.scrollTop = 0
          }
          if(this.html.scrollTop > document.body.scrollHeight) {
            this.html.scrollTop = document.body.scrollHeight
          }
        }
      })


      
    });
  }

  ngOnInit() {
    setTimeout(()=>{
      window.scrollTo(0,0)
    }, 1000)
  }

  backtotop() {
    window.scrollTo(0,0)
  }
  
  ngAfterViewInit() {
    this.fadein.toArray().forEach((el:any)=>{this.observer.observe(el.nativeElement)})
  }

  animation() {
    const height = window.innerHeight * 2.5 // yes im hard coding this
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

  getHeaderStyle() {
    return this.headerStyle
  }

  getBackgroundStyle() {
    return this.backgroundStyle
  }
}
