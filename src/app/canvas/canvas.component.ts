import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent {
  @ViewChild('canvas')
  canvas: any
  context: CanvasRenderingContext2D | null | undefined
  html = document.documentElement;
  frameCount = 73;
  img = new Image()

  ngAfterViewInit() {
    this.context = this.canvas?.nativeElement.getContext('2d')
    this.canvas = this.canvas?.nativeElement
    
    this.canvas.width = 2560
    this.canvas.height = 1440
    
    const img = new Image();
    img.src = this.currentFrame(1);

    //this is cooked
    let self = this
    img.onload = function() {
      self.updateImage(1)
    }
    
    setTimeout(()=>this.updateImage(1), 500);
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.coverWindow(this.img);
  }

  currentFrame(index: number){
    return `assets/jpgs-tiny/frame_${(index-1).toString()}.jpg`
  }
  
  constructor() {
    document.addEventListener('scroll', () => {
      this.play();
    })

    this.preloadImages()

  }
  
  ngOnInit() {
    setTimeout(()=>{
      window.scrollTo(0,0)
    }, 500)
  }

  play() {
    const scrollTop = this.html.scrollTop;
    const maxScrollTop = this.html.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScrollTop;
    const frameIndex = Math.min(
      this.frameCount - 1,
      Math.ceil(scrollFraction * this.frameCount)
    );
    
    requestAnimationFrame(() => this.updateImage(frameIndex + 1))
  }

  updateImage(index: number) {
    this.img.src = this.currentFrame(index);
    if(this.context) {
      this.coverWindow(this.img)
    }
  }

  preloadImages() {
    for (let i = 1; i < this.frameCount; i++) {
      const img = new Image();
      img.src = this.currentFrame(i);
    }
  }

  coverWindow(img: any) {
    const imgRatio = img.height / img.width
    const winRatio = window.innerHeight / window.innerWidth
    if (imgRatio > winRatio) {
      const h = window.innerWidth * imgRatio
      this.context?.drawImage(img, 0, (window.innerHeight - h) / 2, window.innerWidth, h)
    }
    if (imgRatio < winRatio) {
      const w = window.innerWidth * winRatio / imgRatio
      this.context?.drawImage(img, (window.innerWidth - w) / 2, 0, w, window.innerHeight)
    }
  }
}

