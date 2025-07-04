import { Component, ElementRef, HostListener, ViewChild, ViewChildren } from '@angular/core';
import { CanvasComponent } from "../canvas/canvas.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CanvasComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  @ViewChild('keyboard') keyboard : any
  @ViewChild('madison') madison: any
  @ViewChildren('fadein') fadein : any

  @ViewChild('textWrapper', { static: true }) textWrapper!: ElementRef;
  @ViewChild('scrollTrigger', { static: true }) scrollTrigger!: ElementRef;
  @ViewChild('body', { static: true }) body!: ElementRef;
  @HostListener('window:scroll', [])
  onScroll(): void {
    this.animation();

    // wait until user interacts with site to save cpu use
    if(this.videoPlaying == false) {
      this.videoPlaying = true;
      this.keyboard.nativeElement.muted = true // you need this line cuz angular is weird
      this.madison.nativeElement.muted = true

      this.keyboard.nativeElement.playbackRate = 0.9
      this.madison.nativeElement.playbackRate = 0.9

      this.keyboard.nativeElement.play();
      this.madison.nativeElement.play();
    }

    // for card animation
    const triggerY = this.scrollTrigger.nativeElement.getBoundingClientRect().top;
    const viewportCenter = window.innerHeight / 2;

    if (triggerY <= viewportCenter) {
      this.textWrapper.nativeElement.classList.add('active');
      this.body.nativeElement.classList.add('cta-active');
    } else {
      this.textWrapper.nativeElement.classList.remove('active');
      this.body.nativeElement.classList.remove('cta-active');
    }
  }
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

  nav(route: string) {
    if(route == 'resume') {
      window.open('https://docs.google.com/document/d/1ckMpXpyVCMkE-bBncIgqxDaanaWUCT9zNp8I4VvG92A/edit?usp=sharing')
    }
    else {
      this.router.navigate([route])
    }
  }
  

  constructor(private router: Router) {
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

    
  }

  // ngOnInit() {
  //   setTimeout(()=>{
  //     window.scrollTo(0,0)
  //   }, 1000)
  // }

  dragging = false;
  startY = 0;
  lastY = 0;
  onMouseMove = (e: any) => {
    if (this.dragging) {
      e.preventDefault();
      const currentY = e.clientY;

      const deltaY = currentY - this.lastY;

      console.log(`scrolling by ${-deltaY * 1.5}`);
      window.scrollBy(0, -deltaY * 1.5);

      this.lastY = currentY;
    }
  };

  onMouseDown(e:any) {
    e.preventDefault();
    this.dragging = true;
    this.startY = e.clientY;
    this.lastY = e.clientY;
    document.addEventListener('mousemove', this.onMouseMove);
  }
  
  onMouseUp() {
    this.dragging = false;
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  onMouseLeave() {
    this.dragging = false;
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  ngAfterViewInit() {
    this.fadein.toArray().forEach((el:any)=>{this.observer.observe(el.nativeElement)})

    document.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
    document.addEventListener('mouseleave', this.onMouseUp.bind(this));
    
  }

  animation() {
    const height = window.innerHeight * 2.5 // yes im hard coding this
    const scrollTop = this.html.scrollTop;
    const maxScrollTop = height - window.innerHeight;

    if(scrollTop <= maxScrollTop) {
      const scrollFraction = scrollTop / maxScrollTop;
      this.headerStyle['opacity'] = Math.cos(scrollFraction*Math.PI/2)
      this.headerStyle['font-size'] = `${(17 + (scrollFraction * 3))}vw`

      this.backgroundStyle['opacity'] = 0;
      if(scrollFraction < 0.4) {
        this.backgroundStyle['opacity'] = 1
      }
      else{
        this.backgroundStyle['opacity'] = 1.3*Math.cos(scrollFraction*2.5 - 0.9);
      }
    }
    else {
      this.headerStyle['opacity'] = 0
      this.backgroundStyle['opacity'] = 0
    }
  }
}
