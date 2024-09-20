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
  @ViewChild('main') main: any
  @ViewChild('canvas') canvas: any
  context: CanvasRenderingContext2D | null | undefined
  html = document.documentElement;
  frameCount = 67;
  img = new Image()

  folder = 'jpgs-small'

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
      setTimeout(()=>self.updateImage(1), 500);
    }
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.coverWindow(this.img);
  }

  currentFrame(index: number){
    return `assets/${this.folder}/frame_${(index-1).toString()}.jpg`
  }
  
  constructor() {

    // check which folder to use
    if(window.innerHeight>window.innerWidth) {
      // mobile
      this.folder = 'jpgs-mobile'
    }
    if(window.innerHeight<=window.innerWidth) {
      // desktop
      if(window.innerWidth > 1920 + 20) {
        this.folder = 'jpgs-small'
      }
      else {
        this.folder = 'jpgs-tiny'
      }
    }

    document.addEventListener('scroll', () => {
      this.play();
    })

    this.preloadImages()
  }

  play() {
    const height = window.innerHeight * 2.5 // yes im hard coding this
    const totalPageHeight = document.body.scrollHeight;
    const scrollTop = this.html.scrollTop;
    const maxScrollTop = height - window.innerHeight;
    

    if(scrollTop <= maxScrollTop) {
      const scrollFraction = scrollTop / maxScrollTop;
      const frameIndex = Math.min(
        this.frameCount - 1,
        Math.ceil(scrollFraction * this.frameCount)
      );

      requestAnimationFrame(() => this.updateImage(frameIndex + 1))
    }

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

