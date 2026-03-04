import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { CanvasComponent } from "../canvas/canvas.component";
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CanvasComponent, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

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
  

  spotify: { song: string; artist: string; album_art_url: string; track_id: string } | null = null;
  toastVisible = false;
  toastSlideOut = false;
  textScrolling = false;
  private toastTimeout: any;

  ngOnInit() {
    setTimeout(() => this.fetchLanyard(), 5000);
  }

  ngOnDestroy() {
    clearTimeout(this.toastTimeout);
  }

  fetchLanyard() {
    this.http.get<any>('https://api.lanyard.rest/v1/users/256141285264588801').subscribe({
      next: (res) => {
        this.spotify = res.data.spotify ?? null;
        if (this.spotify) {
          this.toastSlideOut = false;
          this.textScrolling = false;

          // prefetch album art
          const img = new Image();
          img.src = this.spotify.album_art_url;
          img.onload = () => { this.toastVisible = true; };

          setTimeout(() => {
            const container = document.querySelector('.toast-text-container') as HTMLElement;
            const text = document.querySelector('.toast-text') as HTMLElement;
            if (container && text) {
              const overflow = text.scrollWidth - container.clientWidth;
              if (overflow > 0) {
                text.style.setProperty('--scroll-offset', `-${overflow}px`);
                this.textScrolling = true;
              }
            }
          }, 50);

          this.toastTimeout = setTimeout(() => {
            this.toastSlideOut = true;
            setTimeout(() => { 
              this.toastVisible = false; 
            }, 500);
          
          }, 10000);
        }
      },
      error: () => {
        this.spotify = null;
      }
    });
  }

  onMouseOver() {
    clearTimeout(this.toastTimeout);
  }

  onMouseOut() {
    this.toastTimeout = setTimeout(() => {
      this.toastSlideOut = true;
      setTimeout(() => { 
        this.toastVisible = false; 
      }, 500);
    }, 10000);
  }
  constructor(private router: Router, private http: HttpClient) {
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
